#!/usr/bin/env node
/**
 * Repository lint. `next lint` was removed in Next 16, so the two rules that
 * actually matter for this build are checked here instead:
 *
 *   1. No em dashes or en dashes in any rendered text. Typography rule from the
 *      brief: commas, colons, semicolons and full stops only.
 *   2. No bare <img> tags in app/ or components/. Every picture must go through
 *      next/image (see components/pex-image.tsx).
 *
 * The mirrored template under public/ is excluded because it is a read-only
 * reference copy that must stay byte identical to wilcon-main.zip.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = process.cwd()
const SKIP_DIRS = new Set(['node_modules', '.next', '.git', 'public', '.template', 'coverage'])
const TEXT_EXT = new Set(['.ts', '.tsx', '.js', 'mjs', '.jsx', '.md', '.css', '.json', '.html'])
const DASHES = {
  '—': 'em dash',
  '–': 'en dash',
}

const files = []

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue
    const full = join(dir, entry)
    const stats = statSync(full)
    if (stats.isDirectory()) walk(full)
    else if (TEXT_EXT.has(extOf(entry))) files.push(full)
  }
}

function extOf(name) {
  const index = name.lastIndexOf('.')
  return index === -1 ? '' : name.slice(index)
}

walk(ROOT)

const problems = []

for (const file of files) {
  const rel = relative(ROOT, file)
  const contents = readFileSync(file, 'utf8')
  const lines = contents.split('\n')

  lines.forEach((line, position) => {
    for (const [character, label] of Object.entries(DASHES)) {
      if (line.includes(character)) {
        problems.push(`${rel}:${position + 1}: ${label} in "${line.trim().slice(0, 70)}"`)
      }
    }

    if (/app|components/.test(rel) && file.endsWith('.tsx') && /<img[\s/>]/.test(line)) {
      problems.push(`${rel}:${position + 1}: bare <img> tag, use <PexImage> (next/image) instead`)
    }
  })
}

if (problems.length) {
  console.error(`\nLint failed with ${problems.length} problem(s):\n`)
  for (const problem of problems.slice(0, 60)) console.error('  ' + problem)
  if (problems.length > 60) console.error(`  ...and ${problems.length - 60} more`)
  console.error('\nFix: replace dashes with , . : or ; and route images through next/image.\n')
  process.exit(1)
}

console.log(`Lint clean: ${files.length} files checked, no dashes and no bare <img> tags.`)
