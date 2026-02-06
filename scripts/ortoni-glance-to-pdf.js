const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--disable-web-security']
    });

    const page = await browser.newPage();

    await page.setViewport({
      width: 1920,
      height: 1200,
      deviceScaleFactor: 1,
    });

    await page.emulateMediaType('screen');

    const reportPath = path.resolve(
      __dirname,
      '..',
      'ortoni-report',
      'ortoni-report.html'
    );

    console.log('Opening Glance page');

    await page.goto(`file://${reportPath}#/glance`, {
      waitUntil: 'networkidle0',
    });

    // Wait for Glance table
    await page.waitForFunction(() =>
      document.body.innerText.includes('Test Suite Glance'),
      { timeout: 30000 }
    );

    // Fix layout AFTER content is ready
    await page.addStyleTag({
      content: `
        aside, nav {
          display: none !important;
        }

        body {
          margin: 0 !important;
          overflow: visible !important;
        }

        main, .main-content, .content {
          margin-left: 0 !important;
          width: 100% !important;
          height: auto !important;
        }

        table {
          width: 100% !important;
        }

        /*  DO NOT block page breaks globally */
        tr {
          page-break-inside: avoid;
        }
      `
    });

    const pdfPath = path.resolve(
      __dirname,
      '..',
      'Ortoni_Glance_Report.pdf'
    );

   await page.pdf({
  path: pdfPath,
  printBackground: true,
  format: 'A3',
  landscape: true,
  scale: 0.9,
  // pageRanges: '2-',   //THIS IS THE KEY
  margin: {
    top: '20px',
    bottom: '20px',
    left: '15px',
    right: '15px',
  },
});

    console.log('Ortoni Glance PDF generated successfully:');
    console.log(pdfPath);

  } catch (err) {
    console.error('Error generating Ortoni Glance PDF:', err);
  } finally {
    if (browser) await browser.close();
    process.exit(0);
  }
})();