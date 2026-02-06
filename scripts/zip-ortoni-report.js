const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const sourceDir = path.resolve(__dirname, '..', 'ortoni-report');
const zipPath = path.resolve(__dirname, '..', 'Ortoni_Report.zip');

const output = fs.createWriteStream(zipPath);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log(`Ortoni ZIP created: ${zipPath}`);
});

archive.on('error', err => {
  throw err;
});

archive.pipe(output);
archive.directory(sourceDir, false);
archive.finalize();
