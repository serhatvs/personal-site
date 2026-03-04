import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import {
  createBlogEntry,
  createProjectEntry,
  createToolEntry,
  getAdminSummary,
} from './scripts/admin-content-service.mjs'
import { generateBlog } from './scripts/blog-generator.mjs'
import { generatePortfolioContent } from './scripts/portfolio-generator.mjs'

function sendJson(response, statusCode, payload) {
  response.statusCode = statusCode
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.end(JSON.stringify(payload))
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = []

    request.on('data', (chunk) => {
      chunks.push(chunk)
    })

    request.on('end', () => {
      try {
        const rawBody = Buffer.concat(chunks).toString('utf8')
        resolve(rawBody ? JSON.parse(rawBody) : {})
      } catch (error) {
        reject(new Error('Request body must be valid JSON.'))
      }
    })

    request.on('error', reject)
  })
}

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

function createAdminApiPlugin({ rootDir, basePath }) {
  return {
    name: 'lunerya-admin-api',
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const url = request.url ? new URL(request.url, 'http://127.0.0.1') : null

        if (!url || !url.pathname.startsWith('/__admin-api/')) {
          next()
          return
        }

        try {
          if (request.method === 'GET' && url.pathname === '/__admin-api/status') {
            sendJson(response, 200, {
              mode: 'dev',
              canWrite: true,
              routes: {
                blog: true,
                project: true,
                tool: true,
              },
            })
            return
          }

          if (request.method === 'GET' && url.pathname === '/__admin-api/summary') {
            const summary = await getAdminSummary({ rootDir, basePath })
            sendJson(response, 200, summary)
            return
          }

          if (request.method === 'POST' && url.pathname === '/__admin-api/blog') {
            const payload = await readJsonBody(request)
            const result = await createBlogEntry({ rootDir, basePath, payload })
            server.ws.send({ type: 'full-reload' })
            sendJson(response, 201, result)
            return
          }

          if (request.method === 'POST' && url.pathname === '/__admin-api/project') {
            const payload = await readJsonBody(request)
            const result = await createProjectEntry({ rootDir, basePath, payload })
            server.ws.send({ type: 'full-reload' })
            sendJson(response, 201, result)
            return
          }

          if (request.method === 'POST' && url.pathname === '/__admin-api/tool') {
            const payload = await readJsonBody(request)
            const result = await createToolEntry({ rootDir, basePath, payload })
            server.ws.send({ type: 'full-reload' })
            sendJson(response, 201, result)
            return
          }

          sendJson(response, 404, {
            ok: false,
            error: 'Admin endpoint not found.',
          })
        } catch (error) {
          sendJson(response, 400, {
            ok: false,
            error: error instanceof Error ? error.message : 'Unexpected admin API error.',
          })
        }
      })
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
    plugins: [createContentSourcesPlugin({ rootDir, basePath }), createAdminApiPlugin({ rootDir, basePath })],
    build: {
      rollupOptions: {
        input: {
          home: path.resolve(rootDir, 'index.html'),
          journal: path.resolve(rootDir, 'blog/index.html'),
          admin: path.resolve(rootDir, 'admin/index.html'),
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
