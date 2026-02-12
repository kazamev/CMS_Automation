
const path = require('path');
const fs = require('fs');

const logFile = path.join(process.cwd(), 'all-api-logs/all-console.log');
const htmlFile = path.join(process.cwd(), 'all-api-logs/all-console.html');

if (!fs.existsSync(logFile)) {
  console.log('No all-api log file found.');
  process.exit();
}

const data = fs.readFileSync(logFile, 'utf8');
const tests = data
  .split('==== ALL BUSINESS API CALLS :')
  .slice(1);

let html = `
<html>
<head>
<style>
body { font-family: Arial; font-size: 15px; }
h2 { background:#222; color:#fff; padding:8px; }

pre {
  background:#f4f4f4;
  padding:10px;
  white-space:pre-wrap;
  border-left:4px solid #2196f3;
}

/*TABLE FIXES */
table {
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0;
  font-size: 11px;
  table-layout: fixed; 
}

th, td {
  border: 1px solid #444;
  padding: 4px 6px;
  word-break: break-word;
  vertical-align: top;
}

thead {
  background: #eee;
}

tr {
  page-break-inside: avoid;   /* NO ROW SPLIT */
}

</style>
</head>
<body>

<h1>Playwright Console Logs</h1>
`;

function asciiTableToHtml(tableText) {

  const lines = tableText
    .split('\n')
    .filter(l => l.includes('│'));

  const rows = lines
    .map(l =>
      l.split('│')
       .slice(1, -1)
       .map(c => c.trim())
    )
    
    .filter(r =>
      r.length > 0 &&
      r[0] !== '' &&
      !r.every(cell => /^─+$/.test(cell))
    );

  if (rows.length === 0) return '';

  const header = rows[0];
  const body = rows.slice(1);

  return `
  <table>
  <colgroup>
    <col style="width: 73px;">
    <col style="width: 73px;">
    <col style="width: auto;">
  </colgroup>
    <thead>
      <tr>${header.map(h => `<th>${h}</th>`).join('')}</tr>
    </thead>
    <tbody>
      ${body.map(r =>
        `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`
      ).join('')}
    </tbody>
  </table>`;
}

tests.forEach(t => {

  const parts = t.split('====');
  const title = parts[0].trim();
  const content = parts.slice(1).join('====');

  html += `<h2>${title}</h2>`;

  html += asciiTableToHtml(content);
});



html += '</body></html>';
fs.writeFileSync(htmlFile, html);

console.log('HTML log report generated');
