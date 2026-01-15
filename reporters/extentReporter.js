const { createTest, flush } = require('../Utils/extentManager');

class ExtentReporter {
  onTestBegin(test) {
    this.extentTest = createTest(test.title);
  }

  onTestEnd(test, result) {
    if (result.status === 'passed') {
      this.extentTest.pass('Test Passed');
    } else if (result.status === 'failed') {
      this.extentTest.fail(result.error?.message || 'Test Failed');
    } else {
      this.extentTest.skip('Test Skipped');
    }
  }

  onEnd() {
    flush();
    console.log('📊 Extent Report generated');
  }
}

module.exports = ExtentReporter;
