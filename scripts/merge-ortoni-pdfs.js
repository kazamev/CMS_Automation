const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

(async () => {
  try {
    const ortoniPdfPath = path.resolve(
      __dirname,
      '..',
      'ortoni-report',
      'Ortoni_Report.pdf'
    );

    const glancePdfPath = path.resolve(
      __dirname,
      '..',
      'Ortoni_Glance_Report.pdf'
    );

    const finalPdfPath = path.resolve(
      __dirname,
      '..',
      'ortoni-report',
      'Ortoni_Final_Report.pdf'
    );

    // Read PDFs
    const ortoniPdfBytes = fs.readFileSync(ortoniPdfPath);
    const glancePdfBytes = fs.readFileSync(glancePdfPath);

    // Load PDFs
    const ortoniPdf = await PDFDocument.load(ortoniPdfBytes);
    const glancePdf = await PDFDocument.load(glancePdfBytes);

    // Create new PDF
    const finalPdf = await PDFDocument.create();

    // Copy pages from Ortoni Report
    const ortoniPages = await finalPdf.copyPages(
      ortoniPdf,
      ortoniPdf.getPageIndices()
    );
    ortoniPages.forEach(page => finalPdf.addPage(page));

    // Copy pages from Glance Report
    const glancePages = await finalPdf.copyPages(
      glancePdf,
      glancePdf.getPageIndices()
    );
    glancePages.forEach(page => finalPdf.addPage(page));

    // Save merged PDF
    const finalPdfBytes = await finalPdf.save();
    fs.writeFileSync(finalPdfPath, finalPdfBytes);

    console.log('Final combined PDF created:');
    console.log(finalPdfPath);

  } catch (error) {
    console.error('Error merging PDFs:', error);
  }
})();
