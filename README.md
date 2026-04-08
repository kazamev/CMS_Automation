This project automates the functional and analytical validation of the Charging Management System (CMS) web application using Playwright with JavaScript and Ortoni reporting.



🧰 Tech Stack
Language: JavaScript (Node.js)
Automation Framework: Playwright
Reporting Tools: Allure, Ortoni, Extent Reports
Other Tools: Puppeteer, XLSX, Nodemailer


Utilities & File Handling
fs-extra – File system operations with extra features
archiver – Used to create zip files (e.g., reports, logs)
xlsx – Read/write Excel files (test data handling)
pdf-lib – Generate and modify PDF files


Communication
nodemailer – Send emails (eg, test reports)


How to Install Dependencies
npm install

How to Run Tests
npm run Complete:allure (Embeded all tests in single Test File(CMS_Complete_Flow))


All Installed Pakages

├── @playwright/test@1.58.1
├── @types/node@24.10.4
├── allure-commandline@2.36.0
├── allure-playwright@3.4.5
├── archiver@7.0.1
├── extent@0.4.0
├── fs-extra@11.3.3
├── http-server@14.1.1
├── nodemailer@7.0.12
├── ortoni-report@4.0.5
├── pdf-lib@1.17.1
├── puppeteer@24.34.0
└── xlsx@0.18.5