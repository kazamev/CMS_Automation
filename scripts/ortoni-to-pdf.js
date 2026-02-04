const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  let browser;

  try {
    browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    // Large desktop viewport
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });

    const reportPath = path.resolve(
      __dirname,
      '..',
      'ortoni-report',
      'ortoni-report.html'
    );

    await page.goto(`file://${reportPath}`, {
      waitUntil: 'networkidle0',
    });

    // Hide sidebar + fix layout
    await page.addStyleTag({
      content: `
        aside, nav {
          display: none !important;
        }
        main, .main-content, body {
          margin-left: 0 !important;
          width: 100% !important;
        }
      `
    });

    // Give UI time to reflow
    await new Promise(r => setTimeout(r, 3000));

    const pdfPath = path.resolve(
      __dirname,
      '..',
      'ortoni-report',
      'Ortoni_Report.pdf'
    );

    await page.pdf({
      path: pdfPath,
      format: 'A4',
      landscape: true,
      printBackground: true,
      scale: 0.9,
      margin: {
        top: '10mm',
        bottom: '10mm',
        left: '10mm',
        right: '10mm',
      },
    });

    console.log('Ortoni PDF generated:');
    console.log(pdfPath);

  } catch (err) {
    console.error('Error generating Ortoni PDF:', err);
  } finally {
    if (browser) await browser.close();
    process.exit(0);
  }
})();
