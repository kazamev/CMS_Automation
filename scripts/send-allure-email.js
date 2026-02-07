const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

(async () => {
  try {
    console.log('Email script started');

    // PDF paths
    const ortoniFinalPdf = path.resolve(
      __dirname,
      '../ortoni-report/Ortoni_Final_Report.pdf'
    );

    const consolePdf = path.resolve(
      __dirname,
      '../logs/Playwright-Console-Logs.pdf'
    );

    const files = [
      ortoniFinalPdf,
      consolePdf
    ];

    // Check all PDFs exist
    files.forEach(file => {
      if (!fs.existsSync(file)) {
        console.error('PDF not found:', file);
        process.exit(1);
      }
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'shilpa@kazam.in',
        pass: 'jipl ekby tsca drdn'   // app password
      }
    });

    await transporter.verify();
    console.log('Gmail authentication successful');

    const info = await transporter.sendMail({
      from: 'shilpa@kazam.in',
      to: 'shilpa@kazam.in',
      subject: 'Automation Test Reports',
      text: `
Hi Team,

Please find attached the automation test reports:

• Ortoni Automation Report (Dashboard + Glance)
• Playwright Console Logs (test-wise execution logs)

Thanks,
Shilpa
`,
      attachments: [
        {
          filename: 'Ortoni_Automation_Report.pdf',
          path: ortoniFinalPdf
        },
        {
          filename: 'Playwright_Console_Logs.pdf',
          path: consolePdf
        }
      ]
    });

    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);

  } catch (error) {
    console.error('Email failed:', error.message);
    process.exit(1);
  }
})();
