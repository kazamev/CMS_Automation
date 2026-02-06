const puppeteer = require('puppeteer');
const path = require('path');
const { spawn } = require('child_process');

(async () => {
  let browser;
  let server;

  try {
    // console.log('Starting Allure HTTP server...');

    // Start Allure server
    server = spawn('allure', ['open', '-p', '5050', 'allure-report'], {
      shell: true,
      stdio: 'ignore'
    });

    // Give server time to start
    await new Promise(r => setTimeout(r, 5000));

    // console.log(' Launching browser...');
    browser = await puppeteer.launch({ headless: 'new' });

    const page = await browser.newPage();

    // console.log(' Opening Allure report via HTTP...');
    await page.goto('http://localhost:5050', {
      waitUntil: 'networkidle0'
    });

    // console.log(' Waiting for Allure UI to hydrate');
    await page.waitForFunction(() => {
      const loaders = document.querySelectorAll('div');
      return ![...loaders].some(el => el.innerText === 'Loading...');
    }, { timeout: 30000 });

    const pdfPath = path.resolve(__dirname, '../Allure_Report.pdf');

    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true
    });

    console.log(' Allure PDF generated successfully at:');
    console.log(pdfPath);

  } catch (err) {
    console.error(' Error generating PDF:', err);
  } finally {
    if (browser) await browser.close();
    if (server) server.kill();
    process.exit(0);
  }
})();



