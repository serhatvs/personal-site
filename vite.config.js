import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import { generateBlog } from './scripts/blog-generator.mjs'
import { generatePortfolioContent } from './scripts/portfolio-generator.mjs'

function createContentSourcesPlugin({ rootDir, basePath }) {
  const blogContentDirectory = path.resolve(rootDir, 'src/content/blog')
  const projectDataPath = path.resolve(rootDir, 'src/data/projects.js')
  const toolDataPath = path.resolve(rootDir, 'src/data/tools.js')

  return {
    name: 'lunerya-content-sources',
    configureServer(server) {
      server.watcher.add(blogContentDirectory)
      server.watcher.add(projectDataPath)
      server.watcher.add(toolDataPath)

      const handleChange = async (file) => {
        const resolvedFile = path.resolve(file)
        const isBlogChange =
          path.extname(resolvedFile) === '.md' && resolvedFile.startsWith(blogContentDirectory)
        const isPortfolioChange = resolvedFile === projectDataPath || resolvedFile === toolDataPath

        if (!isBlogChange && !isPortfolioChange) {
          return
        }

        if (isBlogChange) {
          generateBlog({ rootDir, basePath })
        }

        if (isPortfolioChange) {
          await generatePortfolioContent({ rootDir, basePath })
        }

        server.ws.send({ type: 'full-reload' })
      }

      server.watcher.on('add', handleChange)
      server.watcher.on('change', handleChange)
      server.watcher.on('unlink', handleChange)
    },
  }
}

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const rootDir = process.cwd()
  const basePath = env.VITE_BASE_PATH || '/'
  const { generatedEntries } = generateBlog({
    rootDir,
    basePath,
  })
  const { projectEntries, toolEntries } = await generatePortfolioContent({
    rootDir,
    basePath,
  })

  const blogInputs = Object.fromEntries(
    generatedEntries.map((entry) => [`blog-${path.basename(path.dirname(entry))}`, entry]),
  )
  const projectInputs = Object.fromEntries(
    projectEntries.map((entry) => [`project-${path.basename(path.dirname(entry))}`, entry]),
  )
  const toolInputs = Object.fromEntries(
    toolEntries.map((entry) => [`tool-${path.basename(path.dirname(entry))}`, entry]),
  )

  return {
    base: basePath,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    plugins: [createContentSourcesPlugin({ rootDir, basePath })],
    build: {
      rollupOptions: {
        input: {
          home: path.resolve(rootDir, 'index.html'),
          journal: path.resolve(rootDir, 'blog/index.html'),
          projects: path.resolve(rootDir, 'projects/index.html'),
          tools: path.resolve(rootDir, 'tools/index.html'),
          ...blogInputs,
          ...projectInputs,
          ...toolInputs,
        },
        output: {
          manualChunks: {
            three: ['three'],
            motion: ['gsap', 'animejs'],
            icons: ['lucide'],
          },
        },
      },
    },
  }
})
