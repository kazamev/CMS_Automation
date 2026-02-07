const path = require('path');
const fs = require('fs');


const logFile = path.join(process.cwd(), 'logs/console.log');
const htmlFile = path.join(process.cwd(), 'logs/console.html');

const data = fs.readFileSync(logFile, 'utf8');
const tests = data.split('===== TEST START:').slice(1);

let html = `
<html>
<head>
<style>
body { font-family: Arial; }
h2 { background:#222; color:#fff; padding:8px; }
pre {
  background:#f4f4f4;
  padding:12px;
  white-space:pre-wrap;
  border-left:4px solid #2196f3;
}
</style>
</head>
<body>

<h1>Playwright Console Logs</h1>
`;

tests.forEach(t => {
  const title = t.split('=====')[0].trim();
  const content = t.split('===== TEST END')[0];
  html += `<h2>${title}</h2><pre>${content}</pre>`;
});

html += '</body></html>';
fs.writeFileSync(htmlFile, html);
console.log('HTML log report generated');
