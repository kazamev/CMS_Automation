
export function attachApiCapture(page) {
  const apiLogs = [];

  page.on('request', request => {
    const url = request.url();

    // ✅ FILTER: only business APIs
    if (!url.includes('/api/')) return;

    apiLogs.push({
      type: 'REQUEST',
      method: request.method(),
      url
    });
  });

  page.on('response', async response => {
    const url = response.url();
    if (!url.includes('/api/')) return;

    const status = response.status();

    apiLogs.push({
      type: status >= 400 ? 'FAILED' : 'RESPONSE',
      method: response.request().method(),
      status,
      url
    });
  });

  return apiLogs;
}



