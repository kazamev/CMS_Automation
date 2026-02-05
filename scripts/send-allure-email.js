// const nodemailer = require('nodemailer');
// const path = require('path');
// const fs = require('fs');

// (async () => {
//   try {
//     console.log('Email script started');

//     const pdfPath = path.resolve(__dirname, '../Allure_Report.pdf');

//     if (!fs.existsSync(pdfPath)) {
//       console.error('PDF not found:', pdfPath);
//       process.exit(1);
//     }

//     console.log('PDF found:', pdfPath);

//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: 'shilpa@kazam.in',
//         pass: 'jipl ekby tsca drdn'
//       }
//     });

//     console.log('Verifying Gmail login');
//     await transporter.verify();
//     console.log('Gmail authentication successful');

//     const info = await transporter.sendMail({
//       from: 'shilpa@kazam.in',
//       to: 'bshilpa747@gmail.com',
//       subject: 'Allure Automation Report',
//       text: 'Hi,\n\nPlease find attached the  automation report.\n\nThanks,\nShilpa',
//       attachments: [
//         {
//           filename: 'Allure_Report.pdf',
//           path: pdfPath
//         },
//   //        {
//   //   filename: 'Extent_Report.pdf',
//   //   path: path.resolve(__dirname, '../Extent_Report.pdf')
//   // },
//    {
//     filename: 'Playwright_Report.pdf',
//     path: path.resolve('Playwright_Report.pdf')
//   }
//       ]
//     });

//     console.log(' Email sent successfully!');
//     console.log(' Message ID:', info.messageId);

//   } catch (error) {
//     console.error('Email failed:', error.message);
//     process.exit(1);
//   }
// })();

const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

(async () => {
  try {
    console.log('Email script started');

    // const allurePdf = path.resolve(__dirname, '../Allure_Report.pdf');
    const ortoniPdf = path.resolve(__dirname, '../ortoni-report/Ortoni_Report.pdf');
    // const playwrightPdf = path.resolve(__dirname, '../Playwright_Report.pdf');

    // Check files
    [ortoniPdf].forEach(file => {
      if (!fs.existsSync(file)) {
        console.error('PDF not found:', file);
        process.exit(1);
      }
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'shilpa@kazam.in',
        pass: 'jipl ekby tsca drdn' 
      }
    });

    await transporter.verify();
    console.log('Gmail authentication successful');

    const info = await transporter.sendMail({
      from: 'shilpa@kazam.in',
      to: 'bshilpa747@gmail.com',
      subject: 'Automation Test Report - Ortoni',
      text:
`Hi,

Please find attached the automation test report:
- Ortoni Report


Thanks,
Shilpa`,
      attachments: [
        // {
        //   filename: 'Allure_Report.pdf',
        //   path: allurePdf
        // },
        {
          filename: 'Ortoni_Report.pdf',
          path: ortoniPdf
        },

          {
    filename: 'Ortoni_Glance_Report.pdf',
    path: path.resolve('Ortoni_Glance_Report.pdf')
  }
        
      //  {filename: 'Ortoni_Report.zip',
      //   path: path.resolve(__dirname, '../Ortoni_Report.zip')
      //   },

        // {
        //   filename: 'Playwright_Report.pdf',
        //   path: playwrightPdf
        // }
      ]
    });

    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);

  } catch (error) {
    console.error('Email failed:', error.message);
    process.exit(1);
  }
})();
