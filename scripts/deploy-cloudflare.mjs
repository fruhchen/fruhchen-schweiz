/**
 * Deploy static site to Cloudflare Pages via Direct Upload API.
 * No wrangler dependency — uses native Node 20 fetch + FormData.
 *
 * Required env vars:
 *   CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_KEY, CLOUDFLARE_EMAIL
 */

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

async function deploy() {
  console.log(`Collecting files from ${OUT_DIR}...`);
  const files = await collectFiles(OUT_DIR);
  console.log(`Found ${files.length} files`);

  const form = new FormData();
  for (const file of files) {
    const relPath = '/' + relative(OUT_DIR, file).replace(/\\/g, '/');
    const content = await readFile(file);
    form.append(relPath, new Blob([content]), relPath);
  }

  console.log('Uploading to Cloudflare Pages...');
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT}/deployments`,
    {
      method: 'POST',
      headers: {
        'X-Auth-Email': EMAIL,
        'X-Auth-Key': API_KEY,
      },
      body: form,
    }
  );

  const data = await res.json();

  if (!data.success) {
    console.error('Deploy failed:', JSON.stringify(data.errors, null, 2));
    process.exit(1);
  }

  console.log(`Deployed successfully: ${data.result.url}`);
}

deploy();
