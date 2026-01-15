const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  try {
    const htmlPath = path.resolve(__dirname, '../extent-report/ExtentReport.html');
    const pdfPath = path.resolve(__dirname, '../Extent_Report.pdf');

    if (!fs.existsSync(htmlPath)) {
      throw new Error('Extent HTML report not found');
    }

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 5000));

    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true
    });

    await browser.close();

    console.log(`Extent PDF generated successfully at: ${pdfPath}`);
  } catch (err) {
    console.error('Extent PDF generation failed:', err.message);
  }
})();
