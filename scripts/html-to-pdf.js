const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(
    `file://${path.join(process.cwd(), 'logs/console.html')}`,
    { waitUntil: 'networkidle0' }
  );

  await page.pdf({
    path: 'logs/Playwright-Console-Logs.pdf',
    format: 'A4',
    printBackground: true
  });

  await browser.close();
  console.log('PDF generated');
})();
