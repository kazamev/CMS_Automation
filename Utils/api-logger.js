import fs from 'fs';
import path from 'path';

export function attachApiLogger(page) {
  const logDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

  const logFile = path.join(logDir, 'console.log');

  // Store APIs uniquely
  const apiMap = new Map();

  const isBusinessApi = url =>
    url.includes('/api/v1/') &&
    !url.match(/\.(png|jpg|jpeg|svg|css|js|woff|ico)$/i);

  page.on('request', req => {
    const url = req.url();
    if (!isBusinessApi(url)) return;

    const key = `${req.method()} ${url}`;
    if (!apiMap.has(key)) {
      apiMap.set(key, {
        method: req.method(),
        url,
        status: '',
      });
    }
  });

  page.on('response', res => {
    const url = res.url();
    if (!isBusinessApi(url)) return;

    const key = `${res.request().method()} ${url}`;
    if (!apiMap.has(key)) {
      apiMap.set(key, {
        method: res.request().method(),
        url,
        status: res.status(),
      });
    } else {
      apiMap.get(key).status = res.status();
    }
  });

  page.on('requestfailed', req => {
    const url = req.url();
    if (!isBusinessApi(url)) return;

    const key = `${req.method()} ${url}`;
    apiMap.set(key, {
      method: req.method(),
      url,
      status: 'FAILED',
    });
  });

  return {
  printApiTable(testName = '') {
  if (apiMap.size === 0) {
    console.log('\nNo API calls captured\n');
    return;
  }

  const rows = [...apiMap.values()];

  const colWidths = {
    method: Math.max(6, ...rows.map(r => r.method.length)),
    status: Math.max(6, ...rows.map(r => String(r.status).length)),
    url: Math.max(80, ...rows.map(r => r.url.length)),
  };

  const line =
    '│' +
    '─'.repeat(colWidths.method + 2) + '│' +
    '─'.repeat(colWidths.status + 2) + '│' +
    '─'.repeat(colWidths.url + 2) + '│';

  const header =
    '│ ' +
    'METHOD'.padEnd(colWidths.method) + ' │ ' +
    'STATUS'.padEnd(colWidths.status) + ' │ ' +
    'URL'.padEnd(colWidths.url) + ' │';

  let table = '';
  table += line + '\n';
  table += header + '\n';
  table += line + '\n';

  rows.forEach(r => {
    table +=
      '│ ' +
      r.method.padEnd(colWidths.method) + ' │ ' +
      String(r.status).padEnd(colWidths.status) + ' │ ' +
      r.url.padEnd(colWidths.url) + ' │\n';
    table += line + '\n';
  });

  const title = `==== API CALLS : ${testName} ====\n`;

  //PRINT IN VS CODE CONSOLE
  console.log('\n' + title + table);

  //WRITE TO LOG FILE (PDF source)
  // fs.appendFileSync(logFile, '\n' + title + table + '\n');

  apiMap.clear();
}
  }
}


// import fs from 'fs';
// import path from 'path';

// export function attachApiLogger(page) {
//   const logDir = path.join(process.cwd(), 'logs');
//   if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

//   const logFile = path.join(logDir, 'console.log');
//   const apiMap = new Map();

//   const isBusinessApi = url =>
//     url.includes('/api/v1/') &&
//     !url.match(/\.(png|jpg|jpeg|svg|css|js|woff|ico)$/i);

//   page.on('request', req => {
//     const url = req.url();
//     if (!isBusinessApi(url)) return;

//     const key = `${req.method()} ${url}`;
//     if (!apiMap.has(key)) {
//       apiMap.set(key, {
//         method: req.method(),
//         url,
//         status: '',
//       });
//     }
//   });

//   page.on('response', res => {
//     const url = res.url();
//     if (!isBusinessApi(url)) return;

//     const key = `${res.request().method()} ${url}`;
//     if (apiMap.has(key)) {
//       apiMap.get(key).status = res.status();
//     } else {
//       apiMap.set(key, {
//         method: res.request().method(),
//         url,
//         status: res.status(),
//       });
//     }
//   });

//   page.on('requestfailed', req => {
//     const url = req.url();
//     if (!isBusinessApi(url)) return;

//     const key = `${req.method()} ${url}`;
//     apiMap.set(key, {
//       method: req.method(),
//       url,
//       status: 'FAILED',
//     });
//   });

//   return {
//     // 🔹 EXISTING TABLE (UNCHANGED)
//     printApiTable(testName = '') {
//       if (apiMap.size === 0) return;

//       const rows = [...apiMap.values()];

//       const colWidths = {
//         method: Math.max(6, ...rows.map(r => r.method.length)),
//         status: Math.max(6, ...rows.map(r => String(r.status).length)),
//         url: Math.max(80, ...rows.map(r => r.url.length)),
//       };

//       const line =
//         '│' +
//         '─'.repeat(colWidths.method + 2) + '│' +
//         '─'.repeat(colWidths.status + 2) + '│' +
//         '─'.repeat(colWidths.url + 2) + '│';

//       const header =
//         '│ ' +
//         'METHOD'.padEnd(colWidths.method) + ' │ ' +
//         'STATUS'.padEnd(colWidths.status) + ' │ ' +
//         'URL'.padEnd(colWidths.url) + ' │';

//       let table = '';
//       table += line + '\n';
//       table += header + '\n';
//       table += line + '\n';

//       rows.forEach(r => {
//         table +=
//           '│ ' +
//           r.method.padEnd(colWidths.method) + ' │ ' +
//           String(r.status).padEnd(colWidths.status) + ' │ ' +
//           r.url.padEnd(colWidths.url) + ' │\n';
//         table += line + '\n';
//       });

//       const title = `==== API CALLS : ${testName} ====\n`;
//       console.log('\n' + title + table);
//     },

//     //NEW VALIDATION METHOD
//     validateAllApis200(testName = '') {
//       if (apiMap.size === 0) return;

//       const failedApis = [...apiMap.values()].filter(
//         api => api.status !== 200
//       );

//       if (failedApis.length > 0) {
//         const errorMsg = failedApis
//           .map(a => `${a.method} ${a.url} → ${a.status}`)
//           .join('\n');

//         throw new Error(
//           `API validation failed in "${testName}".\nNon-200 APIs:\n${errorMsg}`
//         );
//       }
//     },

//     clear() {
//       apiMap.clear();
//     }
//   };
// }
