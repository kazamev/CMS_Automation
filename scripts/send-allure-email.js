const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

(async () => {
  try {
    console.log('Email script started');

    const pdfPath = path.resolve(__dirname, '../Allure_Report.pdf');

    if (!fs.existsSync(pdfPath)) {
      console.error('PDF not found:', pdfPath);
      process.exit(1);
    }

    console.log('PDF found:', pdfPath);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'shilpa@kazam.in',
        pass: 'jipl ekby tsca drdn'
      }
    });

    console.log('Verifying Gmail login');
    await transporter.verify();
    console.log('Gmail authentication successful');

    const info = await transporter.sendMail({
      from: 'shilpa@kazam.in',
      to: 'bshilpa747@gmail.com',
      subject: 'Allure Automation Report',
      text: 'Hi,\n\nPlease find attached the automation report.\n\nThanks,\nShilpa',
      attachments: [
        {
          filename: 'Allure_Report.pdf',
          path: pdfPath
        },
  //        {
  //   filename: 'Extent_Report.pdf',
  //   path: path.resolve(__dirname, '../Extent_Report.pdf')
  // },
   {
    filename: 'Playwright_Report.pdf',
    path: path.resolve('Playwright_Report.pdf')
  }
      ]
    });

    console.log(' Email sent successfully!');
    console.log(' Message ID:', info.messageId);

  } catch (error) {
    console.error('Email failed:', error.message);
    process.exit(1);
  }
})();
