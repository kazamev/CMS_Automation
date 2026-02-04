const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });

  const page = await browser.newPage({
    viewport: { width: 1920, height: 1200 }
  });

  const glanceUrl =
    'file:///C:/Users/dodda/OneDrive/Documents/CMS_Automation/ortoni-report/ortoni-report.html#/glance';

  console.log('Opening Glance page');
  await page.goto(glanceUrl, { waitUntil: 'networkidle' });

  // Wait until table data is fully rendered
  await page.waitForSelector('table', { timeout: 20000 });

  // Clean UI for PDF
  await page.addStyleTag({
    content: `
      /* Hide sidebar + header */
      nav, aside {
        display: none !important;
      }

      /* Expand main content */
      main, .container, .content {
        margin-left: 0 !important;
        padding-left: 0 !important;
        width: 100% !important;
      }

      /* Table styling */
      table {
        width: 100% !important;
        font-size: 12px;
      }

      th, td {
        padding: 8px !important;
        text-align: left !important;
      }

      /* Remove scrollbars */
      body {
        overflow: visible !important;
      }
    `
  });

  const outputPath = path.resolve(
    __dirname,
    '../Ortoni_Glance_Report.pdf'
  );

  await page.pdf({
    path: outputPath,
    format: 'A4',
    landscape: true,        
    printBackground: true,
    margin: {
      top: '20px',
      bottom: '20px',
      left: '15px',
      right: '15px'
    }
  });

  await browser.close();

  console.log('Ortoni Glance PDF generated successfully:');
  console.log(outputPath);
})();
