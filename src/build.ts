// @ts-ignore
import { minify } from 'minify';
import url from 'url';
import fs from 'fs';
import path from 'path';

const fileOrder = ['types', 'ldJsonParser', 'index'];
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const filePaths = fileOrder.map((file) => path.join(__dirname, '../dist/', `${file}.js`));
const outputPath = path.join(__dirname, '../out', 'bookmarklet.js');

function toBookmarklet(minifiedJsCode: string): string {
  return `javascript:(()=>{${minifiedJsCode}})()`;
}

async function main() {
  const codes = filePaths.map((filePath) => fs.readFileSync(filePath, 'utf-8'));
  fs.writeFileSync(outputPath, codes.join('\n'));
  const minifiedJsCode = await minify(outputPath);
  const bookmarklet = toBookmarklet(minifiedJsCode);
  fs.writeFileSync(path.join(__dirname, '..', 'out', 'bookmarklet.js'), bookmarklet);
}

main();
