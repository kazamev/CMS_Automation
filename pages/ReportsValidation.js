// pages/ReportValidationPage.js

const path = require("path");
const fs = require("fs");
const XLSX = require("xlsx");

class ReportValidationPage {
    constructor(localDownloadPath, downloadFilename) {
        this.localDownloadPath = localDownloadPath;
        this.downloadFilename = downloadFilename;
    }

    // Method to convert CSV to XLSX
    async convertCsvToXlsx(source, destination) {
        try {
            const workbook = XLSX.readFile(source);
            XLSX.writeFile(workbook, destination);
            console.log(`Converted CSV to XLSX: ${destination}`);
        } catch (error) {
            console.error("Error converting CSV to XLSX:", error.toString());
        }
    }

    // Method to get the file path
    getFilePath() {
        return path.join(this.localDownloadPath, "converted_session_report.xlsx");
    }

    // Method to validate the number of sessions
    async validateSessions(dashboardValue) {
        const filePath = this.getFilePath();

        // Check if the file exists
        if (fs.existsSync(filePath)) {
            // Read the Excel file
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0]; // Get the first sheet name
            const worksheet = workbook.Sheets[sheetName];

            // Convert sheet to JSON to easily access rows and columns
            const sheetJson = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            // Count non-empty cells in the second column excluding the first cell
            let nonEmptyCellCount = 0;
            for (let i = 1; i < sheetJson.length; i++) {
                if (sheetJson[i][1]) {
                    nonEmptyCellCount++;
                }
            }

            console.log(`Total no of sessions (From Report): ${nonEmptyCellCount}`);
            console.log(`Total no of sessions (From Dashboard): ${dashboardValue}`);

            if (dashboardValue == nonEmptyCellCount) {
                console.log(
                    "The number of sessions in the report is equal to the number of sessions on the dashboard."
                );
            } else {
                console.log(
                    "The number of sessions in the report is NOT equal to the number of sessions on the dashboard."
                );
            }
        } else {
            console.error("File not found:", filePath);
        }
    }
}

module.exports = ReportValidationPage;
