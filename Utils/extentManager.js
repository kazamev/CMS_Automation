const { ExtentReports, ExtentTest } = require('extent');
const fs = require('fs-extra');
const path = require('path');

const reportPath = path.join(process.cwd(), 'extent-report');
fs.ensureDirSync(reportPath);

let extent;
let test;

function initExtent() {
  extent = new ExtentReports();
  extent.attachReporter({
    generate: () => ({
      filePath: path.join(reportPath, 'index.html'),
      theme: 'dark',
      documentTitle: 'CMS Automation Report',
      reportName: 'Playwright Execution Report'
    })
  });
}

function getExtent() {
  if (!extent) initExtent();
  return extent;
}

function createTest(testName) {
  test = getExtent().createTest(testName);
  return test;
}

function flush() {
  extent.flush();
}

module.exports = { createTest, flush };
