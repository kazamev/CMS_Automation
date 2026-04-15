CMS Automation Script

This project contains an automated UI and data validation testing framework for the Charging Management System (CMS) platform. It utilizes Playwright with JavaScript to validate critical CMS workflows, dashboards, and analytical data.
Additionally, it integrates multiple reporting tools and utilities for HTML reporting, PDF generation, and email notifications

TEST COVERAGE:

Login Validation
Organisation Details Validation
User Creation and Verification
Driver Creation, Validation, and Deactivation
End-to-End Charger Creation & Reconfiguration
Online/Offline Charger & Connector Validation
Session Count, Usage, Revenue Validation
Session-related validations
Dashboard vs Charger Page Data Comparison
Revenue Validation (Dashboard vs Revenue Page)
Highest Usage Validation
Weekly Data Validation (Sessions, Usage, Revenue, Online %)
Tariff Creation, Validation, and Deletion
Driver Group Creation and Validation
Tax and Aggregation Validation
Validation before Tariff Deletion (Assigned Chargers Check)
Revenue Report and Invoice Validation
State-wise and Hub-wise Data Validation
Business APIs (V1, V2, V3) exported and converted to PDF
Connector Type Validation
Error Code and Status Validation
Last Configuration Validation


🧰 Tech Stack: 

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

Clone the Repository

git clone <repository-url>
cd CMS_Automation


How to Install Dependencies: 
npm install

How to Run Tests: 
npm run Complete:allure (This command runs the complete CMS flow (end-to-end scenarios).)


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
