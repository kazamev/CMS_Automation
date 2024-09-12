// ReportPage.js
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

class ReportPage {
  constructor(page) {
    this.page = page;
    this.localDownloadPath = path.join(process.env.HOME || process.env.USERPROFILE, "Downloads");
    this.downloadFilename = "converted_session_report.xlsx"; // Customize if needed
  }

  async convertCsvToXlsx(source, destination) {
    // Your CSV to XLSX conversion logic here
  }

  async downloadAndConvertReport() {
    let source = path.join(this.localDownloadPath, this.downloadFilename);
    let destination = path.join(this.localDownloadPath, "converted_session_report.xlsx");
    
    try {
      await this.convertCsvToXlsx(source, destination);
    } catch (e) {
      console.error(e.toString());
    }
  }

  fileExists(filePath) {
    return fs.existsSync(filePath);
  }

  readExcelFile(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Get the first sheet name
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  }

  countNonEmptySessions(sheetJson) {
    let nonEmptyCellCount = 0;
    for (let i = 1; i < sheetJson.length; i++) {
      if (sheetJson[i][1]) {
        nonEmptyCellCount++; // Count non-empty cells in the second column
      }
    }
    return nonEmptyCellCount;
  }

  calculateTotalUsage(sheetJson) {
    let sum = 0;
    for (let i = 1; i < sheetJson.length; i++) {
      let cellValue = sheetJson[i][9]; // Index 9 corresponds to the eighth column
      if (typeof cellValue === "string") {
        cellValue = parseFloat(cellValue.replace("kWh", "").trim());
      }
      if (!isNaN(cellValue)) {
        sum += cellValue;
      }
    }
    return sum;
  }
}

module.exports = ReportPage;
