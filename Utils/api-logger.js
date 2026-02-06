import fs from 'fs';
import path from 'path';

export function attachApiLogger(page) {
  const logDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

  const logFile = path.join(logDir, 'console.log');
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
        METHOD: req.method(),
        STATUS: '',
        URL: url,
      });
    }
  });

  page.on('response', res => {
    const url = res.url();
    if (!isBusinessApi(url)) return;

    const key = `${res.request().method()} ${url}`;
    if (apiMap.has(key)) {
      apiMap.get(key).STATUS = res.status();
    }
  });

  page.on('requestfailed', req => {
    const url = req.url();
    if (!isBusinessApi(url)) return;

    const key = `${req.method()} ${url}`;
    apiMap.set(key, {
      METHOD: req.method(),
      STATUS: 'FAILED',
      URL: url,
    });
  });

    return {
    printApiTable(testName = '') {
      if (apiMap.size === 0) {
        console.log(`\n========== API CALLS : ${testName} ==========\nNo API calls captured\n`);
        return;
      }

      console.log(`\n========== API CALLS : ${testName} ==========\n`);

      // ✅ THIS gives EXACT output like your screenshot
      console.table([...apiMap.values()]);

      apiMap.clear();
    }
  };
}

