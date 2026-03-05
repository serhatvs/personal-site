import fs from 'node:fs'
import path from 'node:path'

const projectRoot = process.cwd()
const distRoot = path.resolve(projectRoot, 'dist')

const requiredPages = ['index.html', 'blog/index.html', 'projects/index.html', 'tools/index.html', 'admin/index.html']
const ignoredProtocolPattern = /^[a-zA-Z][a-zA-Z\d+.-]*:/
const hashedAssetPattern = /^[^/\\]+-[A-Za-z0-9_-]{6,}\.(js|css)$/

function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile()
  } catch {
    return false
  }
}

function directoryExists(directoryPath) {
  try {
    return fs.statSync(directoryPath).isDirectory()
  } catch {
    return false
  }
}

function collectHtmlFiles(directoryPath) {
  const discovered = []
  const queue = [directoryPath]

  while (queue.length > 0) {
    const current = queue.pop()
    const entries = fs.readdirSync(current, { withFileTypes: true })

    entries.forEach((entry) => {
      const fullPath = path.join(current, entry.name)

      if (entry.isDirectory()) {
        queue.push(fullPath)
        return
      }

      if (entry.isFile() && fullPath.endsWith('.html')) {
        discovered.push(fullPath)
      }
    })
  }

  return discovered
}

function toPosixRelative(filePath) {
  return path.relative(projectRoot, filePath).split(path.sep).join('/')
}

function stripQueryAndHash(value) {
  let cutIndex = value.length
  const queryIndex = value.indexOf('?')
  const hashIndex = value.indexOf('#')

  if (queryIndex >= 0) {
    cutIndex = Math.min(cutIndex, queryIndex)
  }

  if (hashIndex >= 0) {
    cutIndex = Math.min(cutIndex, hashIndex)
  }

  return value.slice(0, cutIndex)
}

function shouldIgnoreLink(value) {
  if (!value) {
    return true
  }

  const trimmed = value.trim()

  if (!trimmed) {
    return true
  }

  if (trimmed.startsWith('#')) {
    return true
  }

  if (trimmed.startsWith('//')) {
    return true
  }

  return ignoredProtocolPattern.test(trimmed)
}

function resolveInternalTarget(sourceHtmlPath, rawTarget) {
  const cleaned = stripQueryAndHash(rawTarget.trim())

  if (!cleaned) {
    return { exists: true, resolvedPath: sourceHtmlPath }
  }

  const candidate = cleaned.startsWith('/')
    ? path.resolve(distRoot, cleaned.replace(/^\/+/, ''))
    : path.resolve(path.dirname(sourceHtmlPath), cleaned)

  if (fileExists(candidate)) {
    return { exists: true, resolvedPath: candidate }
  }

  if (directoryExists(candidate)) {
    const indexCandidate = path.join(candidate, 'index.html')
    if (fileExists(indexCandidate)) {
      return { exists: true, resolvedPath: indexCandidate }
    }
  }

  return { exists: false, resolvedPath: candidate }
}

function checkRequiredPages(errors) {
  requiredPages.forEach((relativePagePath) => {
    const fullPath = path.resolve(distRoot, relativePagePath)

    if (!fileExists(fullPath)) {
      errors.push(`Missing required page: dist/${relativePagePath}`)
    }
  })
}

function checkHashedAssets(errors) {
  const assetsDirectory = path.resolve(distRoot, 'assets')

  if (!directoryExists(assetsDirectory)) {
    errors.push('Missing assets directory: dist/assets')
    return { jsCount: 0, cssCount: 0 }
  }

  const assets = fs
    .readdirSync(assetsDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && hashedAssetPattern.test(entry.name))
    .map((entry) => entry.name)

  const hashedJsAssets = assets.filter((name) => name.endsWith('.js'))
  const hashedCssAssets = assets.filter((name) => name.endsWith('.css'))

  if (hashedJsAssets.length === 0) {
    errors.push('No hashed JS assets found in dist/assets (expected pattern: name-hash.js, hash length >= 6).')
  }

  if (hashedCssAssets.length === 0) {
    errors.push('No hashed CSS assets found in dist/assets (expected pattern: name-hash.css, hash length >= 6).')
  }

  return {
    jsCount: hashedJsAssets.length,
    cssCount: hashedCssAssets.length,
  }
}

function checkInternalLinks(htmlFiles, errors) {
  const attributePattern = /\b(?:href|src)\s*=\s*(['"])(.*?)\1/gi
  let checkedLinks = 0

  htmlFiles.forEach((htmlPath) => {
    const source = fs.readFileSync(htmlPath, 'utf8')
    let match

    while ((match = attributePattern.exec(source)) !== null) {
      const rawTarget = match[2]

      if (shouldIgnoreLink(rawTarget)) {
        continue
      }

      const resolution = resolveInternalTarget(htmlPath, rawTarget)
      checkedLinks += 1

      if (resolution.exists) {
        continue
      }

      errors.push(
        `Broken link in ${toPosixRelative(htmlPath)}: "${rawTarget}" -> ${toPosixRelative(resolution.resolvedPath)}`,
      )
    }
  })

  return checkedLinks
}

function run() {
  const errors = []

  if (!directoryExists(distRoot)) {
    console.error(`Deploy smoke failed.\n- Missing build output directory: ${toPosixRelative(distRoot)}`)
    process.exit(1)
  }

  checkRequiredPages(errors)
  const { jsCount, cssCount } = checkHashedAssets(errors)
  const htmlFiles = collectHtmlFiles(distRoot)
  const checkedLinks = checkInternalLinks(htmlFiles, errors)

  if (errors.length > 0) {
    console.error('Deploy smoke failed.')
    errors.forEach((error) => {
      console.error(`- ${error}`)
    })
    process.exit(1)
  }

  console.log(
    `Deploy smoke passed. Required pages: ${requiredPages.length}, hashed JS: ${jsCount}, hashed CSS: ${cssCount}, HTML files: ${htmlFiles.length}, internal links checked: ${checkedLinks}.`,
  )
}

run()
