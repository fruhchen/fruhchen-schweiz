import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { createHash } from 'crypto';

const ACCOUNT_ID = 'd25d6578e14ef14e33461789079cae74';
const PROJECT_NAME = 'fruhchen-schweiz';
const API_TOKEN = 'RzCfck7WRif2fXe0htT32bybjF1Ip3GlOw3ZMsQL';
const OUT_DIR = join(import.meta.dirname, 'out');

function walkDir(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...walkDir(full));
    } else {
      files.push(full);
    }
  }
  return files;
}

function hashFile(content) {
  return createHash('sha256').update(content).digest('hex');
}

function getMimeType(path) {
  const ext = path.split('.').pop()?.toLowerCase();
  const types = {
    html: 'text/html', css: 'text/css', js: 'application/javascript',
    json: 'application/json', svg: 'image/svg+xml', png: 'image/png',
    jpg: 'image/jpeg', ico: 'image/x-icon', txt: 'text/plain',
    woff: 'font/woff', woff2: 'font/woff2', map: 'application/json',
  };
  return types[ext] || 'application/octet-stream';
}

async function deploy() {
  console.log('Collecting files...');
  const allFiles = walkDir(OUT_DIR);
  console.log(`Found ${allFiles.length} files`);

  // Build manifest and collect file data
  const manifest = {};
  const fileEntries = []; // { hash, content, path }
  const seenHashes = new Set();

  for (const filePath of allFiles) {
    const relPath = '/' + relative(OUT_DIR, filePath).replace(/\\/g, '/');
    const content = readFileSync(filePath);
    const hash = hashFile(content);
    manifest[relPath] = hash;
    if (!seenHashes.has(hash)) {
      seenHashes.add(hash);
      fileEntries.push({ hash, content, path: relPath });
    }
  }

  console.log(`${Object.keys(manifest).length} paths, ${fileEntries.length} unique files`);

  // Build single multipart form with manifest + all files
  console.log('\nCreating deployment with all files...');
  const formData = new FormData();
  formData.append('manifest', JSON.stringify(manifest));

  // Add each unique file as a form field keyed by its hash
  for (const entry of fileEntries) {
    const blob = new Blob([entry.content], { type: getMimeType(entry.path) });
    formData.append(entry.hash, blob, entry.hash);
  }

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT_NAME}/deployments`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${API_TOKEN}` },
      body: formData,
    }
  );

  const data = await res.json();

  if (data.success) {
    console.log('\n=== DEPLOYED ===');
    console.log('ID:', data.result.id);
    console.log('Preview:', data.result.url);
    console.log('Production: https://fruhchen-schweiz.pages.dev');
  } else {
    console.error('Failed:', JSON.stringify(data.errors, null, 2));

    // If there are required files, upload them separately
    if (data.result?.required_files?.length > 0) {
      console.log(`Need to upload ${data.result.required_files.length} files...`);
    }
  }
}

deploy().catch(console.error);
