const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

const output = fs.createWriteStream(
  path.resolve(__dirname, '..', 'Ortoni_Report.zip')
);
const archive = archiver('zip', { zlib: { level: 9 } });

archive.pipe(output);

archive.directory(
  path.resolve(__dirname, '..', 'ortoni-report'),
  'ortoni-report'
);

archive.finalize();

output.on('close', () => {
  console.log('Ortoni report zipped successfully');
});
