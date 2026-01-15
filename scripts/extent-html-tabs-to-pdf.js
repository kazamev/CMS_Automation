const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  try {
    const htmlPath = path.resolve(__dirname, '../extent-report/index.html');
    const pdfPath = path.resolve(__dirname, '../Extent_Report.pdf');

    if (!fs.existsSync(htmlPath)) {
      console.error('Extent HTML report not found:', htmlPath);
      process.exit(1);
    }

    console.log('Launching browser...');
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    console.log('📄 Opening Extent HTML report...');
    await page.goto(`file://${htmlPath}`, {
      waitUntil: 'networkidle0'
    });

    // Wait for Extent UI
    console.log('Waiting for Extent UI...');
    await page.waitForSelector('body', { timeout: 30000 });
    await new Promise(r => setTimeout(r, 4000));

    // Click Dashboard tab
    console.log('Opening Dashboard tab...');
    await page.evaluate(() => {
      const dashboardTab = [...document.querySelectorAll('a')]
        .find(a => a.textContent.includes('Dashboard'));
      if (dashboardTab) dashboardTab.click();
    });
    await new Promise(r => setTimeout(r, 3000));

    // Scroll dashboard
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise(r => setTimeout(r, 2000));

    // Click Tests/View tab
    console.log('Opening Tests tab...');
    await page.evaluate(() => {
      const testsTab = [...document.querySelectorAll('a')]
        .find(a => a.textContent.includes('Test'));
      if (testsTab) testsTab.click();
    });
    await new Promise(r => setTimeout(r, 3000));

    // Scroll test results
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise(r => setTimeout(r, 2000));

    // Generate PDF
    console.log('Generating Extent PDF...');
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        bottom: '20px',
        left: '15px',
        right: '15px'
      }
    });

    console.log(' Extent PDF generated successfully:');
    console.log(pdfPath);

    await browser.close();
  } catch (error) {
    console.error('Extent PDF generation failed:', error);
    process.exit(1);
  }
})();
