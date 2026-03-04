import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import { generateBlog } from './scripts/blog-generator.mjs'

function createBlogContentPlugin({ rootDir, basePath }) {
  const contentDirectory = path.resolve(rootDir, 'src/content/blog')

  const isMarkdownChange = (file) =>
    path.extname(file) === '.md' && path.resolve(file).startsWith(contentDirectory)

  const regenerate = () => {
    generateBlog({ rootDir, basePath })
  }

  return {
    name: 'lunerya-blog-content',
    configureServer(server) {
      server.watcher.add(contentDirectory)

      const handleChange = (file) => {
        if (!isMarkdownChange(file)) {
          return
        }

        regenerate()
        server.ws.send({ type: 'full-reload' })
      }

      server.watcher.on('add', handleChange)
      server.watcher.on('change', handleChange)
      server.watcher.on('unlink', handleChange)
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const rootDir = process.cwd()
  const basePath = env.VITE_BASE_PATH || '/'
  const { generatedEntries } = generateBlog({
    rootDir,
    basePath,
  })

  const blogInputs = Object.fromEntries(
    generatedEntries.map((entry) => [`blog-${path.basename(path.dirname(entry))}`, entry]),
  )

  return {
    base: basePath,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    plugins: [createBlogContentPlugin({ rootDir, basePath })],
    build: {
      rollupOptions: {
        input: {
          home: path.resolve(rootDir, 'index.html'),
          journal: path.resolve(rootDir, 'blog/index.html'),
          ...blogInputs,
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
