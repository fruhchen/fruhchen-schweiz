/**
 * Deploy static site to Cloudflare Pages via Direct Upload API.
 * No wrangler dependency — uses native Node 20 fetch + FormData.
 *
 * Required env vars:
 *   CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_KEY, CLOUDFLARE_EMAIL
 */

import { createHash } from 'crypto';
import { readdir, readFile } from 'fs/promises';
import { join, relative } from 'path';

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_KEY = process.env.CLOUDFLARE_API_KEY;
const EMAIL = process.env.CLOUDFLARE_EMAIL;
const PROJECT = 'fruhchen-schweiz';
const OUT_DIR = process.argv[2] || 'out';

if (!ACCOUNT_ID || !API_KEY || !EMAIL) {
  console.error('Missing env vars: CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_KEY, CLOUDFLARE_EMAIL');
  process.exit(1);
}

const headers = { 'X-Auth-Email': EMAIL, 'X-Auth-Key': API_KEY };

async function collectFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(full)));
    } else {
      files.push(full);
    }
  }
  return files;
}

function contentHash(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

async function deploy() {
  console.log(`Collecting files from ${OUT_DIR}...`);
  const filePaths = await collectFiles(OUT_DIR);
  console.log(`Found ${filePaths.length} files`);

  // Build manifest and file map
  const manifest = {};
  const fileMap = new Map(); // hash -> { content, path }

  for (const filePath of filePaths) {
    const relPath = '/' + relative(OUT_DIR, filePath).replace(/\\/g, '/');
    const content = await readFile(filePath);
    const hash = contentHash(content);
    manifest[relPath] = hash;
    if (!fileMap.has(hash)) {
      fileMap.set(hash, { content, path: relPath });
    }
  }

  console.log(`Unique files: ${fileMap.size} (${filePaths.length} total, ${filePaths.length - fileMap.size} deduplicated)`);

  // Build multipart form: manifest + files keyed by hash
  const form = new FormData();
  form.append('manifest', JSON.stringify(manifest));

  for (const [hash, { content, path }] of fileMap) {
    form.append(hash, new Blob([content]), path);
  }

  console.log('Uploading to Cloudflare Pages...');
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT}/deployments`,
    { method: 'POST', headers, body: form }
  );

  const data = await res.json();

  if (!data.success) {
    console.error('Deploy failed:', JSON.stringify(data.errors, null, 2));
    process.exit(1);
  }

  console.log(`Deployed successfully: ${data.result.url}`);
}

deploy();
