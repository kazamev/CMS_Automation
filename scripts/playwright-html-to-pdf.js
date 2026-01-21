const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

(async () => {
  try {
    const reportPath = path.resolve('extent-report/index.html');
    const outputPdf = path.resolve('Playwright_Report.pdf');

    if (!fs.existsSync(reportPath)) {
      throw new Error('Playwright HTML report not found');
    }

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(`file://${reportPath}`, {
      waitUntil: 'networkidle0'
    });

    await page.pdf({
      path: outputPdf,
      format: 'A4',
      printBackground: true
    });

    await browser.close();
    console.log(' Playwright HTML PDF generated:', outputPdf);
  } catch (err) {
    console.error('Playwright PDF failed:', err.message);
    process.exit(1);
  }
})();
