import fs from 'fs';
import path from 'path';

// utils/api-capture.js
export function attachApiLogger(page, apiLogs) {
  page.on('request', request => {
    const url = request.url();

    // ✅ FILTER NOISE
    if (!url.includes('/api/')) return;

    apiLogs.push({
      type: 'REQUEST',
      method: request.method(),
      url
    });
  });

  page.on('response', response => {
    const url = response.url();
    if (!url.includes('/api/')) return;

    apiLogs.push({
      type: response.status() >= 400 ? 'FAILED' : 'RESPONSE',
      method: response.request().method(),
      status: response.status(),
      url
    });
  });

  page.on('requestfailed', request => {
    const url = request.url();
    if (!url.includes('/api/')) return;

    apiLogs.push({
      type: 'NETWORK_ERR',
      method: request.method(),
      status: 'ERR',
      url
    });
  });
}
