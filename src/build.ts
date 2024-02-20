// @ts-ignore
import { minify } from 'minify';
import fs from 'fs';
import path from 'path';

async function main(filePath: string): Promise<string> {
  const minifiedJs = await minify(filePath);
  return `javascript:(()=>{${minifiedJs}})()`;
}

const filePaths = process.argv.slice(2);

filePaths.forEach((filePath) => {
  const dirPath = path.dirname(filePath);
  const fileName = path.basename(filePath).replace(/\.js$/, '.min.js');
  main(filePath).then((result) => {
    fs.writeFileSync(path.join(dirPath.replace('dist', 'out'), fileName), result);
  });
});
