import fs from "fs";   
import path from "path";
import * as excel from "xlsx";

export class DashboardSessionsPage {

    constructor(page) {
        this.page = page;

        //GLOBAL KPI LOCATORS
        this.sessionsValue = page.locator("(//p[@class='text-base font-medium'])[2]");
        this.usageValue = page.locator("(//p[@class='text-base font-medium'])[3]");

        // Sessions KPI Card
        this.sessionsKPICard = page.locator("//div[contains(@class,'hover:cursor-pointer')][.//p[text()='No of Sessions']]");

        //SESSIONS PAGE LOCATORS
        this.allSessionsButton = page.locator("//button[contains(.,'All (')]");
        this.ongoingButton = page.locator("//button[contains(.,'Ongoing (')]");
        this.dateFilter = page.locator("//button[contains(.,'This month') or contains(.,'Today')]");
        this.menuButton = page.locator("svg.feather-more-vertical");
        this.downloadBtn = page.locator("(//div[contains(.,'Download Report')])[13]");
        this.filterApplied = page.locator("//div[@class='flex justify-between']//button[2]");
        this.AnomalyField= page.locator("//input[@placeholder='Non Anomaly']"); 
        this.AnomalyOption= page.locator("//span[@class='p-2 text-xs font-medium cursor-pointer hover:bg-purple-50 duration-300 flex gap-2 items-center']");
        this.Applybtn= page.locator("//button[normalize-space()='Apply']");
        this.DashBoardTimeFilter= page.locator("//button[@class='w-full flex gap-1 items-center bg-black py-2 px-3 border rounded-md bg-white']"); 
         this.downloadButton = page.locator("//div[@id='download']//*[name()='svg']");
        this.excelOption = page.locator("(//div[@class='flex items-center gap-2 m-1 hover:bg-kazamGray-100 p-2 rounded-md'])[2]");
        this.chargertimeperiod = page.locator("//button[.//div[normalize-space()='Today']]");
 
    }


    // Fetch KPI values from Dashboard
    async getKPIValues() {
    const sessionText = await this.sessionsValue.textContent();
    const usageText = await this.usageValue.textContent();
    const sessionKpi = Number(sessionText.replace(/[^0-9.]/g, ""));  // keep only numbers & dot
    let usageKpi = Number(usageText.replace(/[^0-9.]/g, ""));        // numeric value only

    // Convert Dashboard KPI if it is in kWh
    if (usageText.toLowerCase().includes("kwh")) {
        usageKpi = usageKpi / 1000;       // Convert to MWh
    }
    return { sessionKpi, usageKpi };
}

    // Apply Time Filter in Dashboard
    async applyTimeFilterInDashboard(period) {
    await this.DashBoardTimeFilter.click();

    //Locate the option dynamically
   const option = this.page.locator(`//div[contains(@class,'flex')]//div[normalize-space(text())='${period}']`);
    await option.waitFor();
    await option.click();
    await this.page.waitForLoadState("networkidle");
}

    // Navigate to Sessions Page
    async openSessionsPage() {
    await this.sessionsKPICard.click();
    await this.page.waitForLoadState("networkidle");   
}

// Apply Time Filter in Sessions Page
    async applyTimeFilter(period) {
    await this.dateFilter.click();
    await this.page.waitForTimeout(1000);
   const option = this.page.locator(`//div[contains(@class,'flex')]//div[normalize-space(text())='${period}']`);
    await option.waitFor();
    await this.page.waitForTimeout(1000);
    await option.click();
    await this.page.waitForLoadState("networkidle");
}

// Apply anomaly filter
async applyAnomalyFilter(optionText) {
    await this.filterApplied.click();
    await this.AnomalyField.click();
    await this.page.waitForTimeout(1000);
    const option = this.page.locator(`//*[contains(@class,'cursor-pointer') and contains(normalize-space(.),'${optionText}')]`).first();
    await option.waitFor();
    await option.click();
    await this.Applybtn.click();
    await this.page.waitForTimeout(1000);
    await this.page.waitForLoadState("networkidle");

}

// Get Session Tab Counts from UI
async getSessionTabCounts() {
    await this.allSessionsButton.waitFor();
    const allTxt = await this.allSessionsButton.textContent();
    const allCount = Number(allTxt.match(/\d+/)[0]);
    await this.page.waitForTimeout(1000);
    const ongoingTxt = await this.ongoingButton.textContent();
    const ongoingCount = Number(ongoingTxt.match(/\d+/)[0]);
    await this.page.waitForTimeout(1000);
    return { allCount, ongoingCount };
}

// Download Excel Report
async downloadExcel() {
    // Start listener
    const downloadPromise = this.page.waitForEvent("download", { timeout: 60000 });

    await this.menuButton.click();
    await this.downloadBtn.waitFor({ state: "visible" });
    await this.downloadBtn.click();

    const download = await downloadPromise;
    const downloadDir = path.join(__dirname, "downloads");
    if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir);

    const filePath = path.join(downloadDir, "sessions.xlsx");
    await download.saveAs(filePath);
    return filePath;
}

// Session Count in downloaded Excel
async countSessionIdsInExcel(filePath) {
    const wb = excel.readFile(filePath);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const data = excel.utils.sheet_to_json(sheet, { header: 1 }); 
    const rows = data.slice(1);
    const sessionIDs = rows
        .map(r => r[1])       // change index based on required column
        .filter(id => id);
    return sessionIDs.length;
}


 async verifyCounts(filePath, allCount, sessionKpi) {
    //Extract count from Excel
    const excelCount = await this.countSessionIdsInExcel(filePath);
    let errors = [];
    //Compare UI All Count with Dashboard KPI
    if (allCount !== sessionKpi) {
        errors.push(`UI All Count (${allCount}) does NOT match KPI Count (${sessionKpi})`);
    }
    //Compare Excel count with KPI
    if (sessionKpi !== excelCount) {
        errors.push(`KPI Count (${sessionKpi}) does NOT match Excel Count (${excelCount})`);
    }
    //Compare UI All Count with Excel
    if (allCount !== excelCount) {
        errors.push(`UI All Count (${allCount}) does NOT match Excel Count (${excelCount})`);

        //compare report analytics and  excel count






        
    }
    //Return structured result
    if (errors.length === 0) {
        console.log(`All counts matched successfully  ${excelCount}`);
        return {
            success: true,
            excelCount,
            message: "All counts matched successfully"
        };
    } else {
        console.log(" Mismatch found:");
        errors.forEach(e => console.log(" - " + e));

        return {
            success: false,
            excelCount,
            message: errors.join(" | ")
        };
    }
}



async sumOfUsage(filePath) {
    const wb = excel.readFile(filePath);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const data = excel.utils.sheet_to_json(sheet, { header: 1 });
    const rows = data.slice(1);
    // Excel Usage column index (example: column 9)
    const usageValues = rows
        .map(row => Number(row[9]))   // change index if needed
        .filter(v => !isNaN(v));
    const totalUsageKwh = usageValues.reduce((a, b) => a + b, 0);
    // console.log("Excel Usage Sum (kWh):", totalUsageKwh);
    return totalUsageKwh;
}


async verifyUsageFromExcel(filePath, usageKpi) {
    //Sum usage from Excel (kWh)
    const excelUsageKwh = await this.sumOfUsage(filePath);
    //Convert kWh → MWh
    const excelUsageMWh_raw = excelUsageKwh / 1000;
    //Round Excel MWh to 2 decimals
    const excelUsageMWh = Number(excelUsageMWh_raw.toFixed(2));
    console.log(`Excel Usage (kWh): ${excelUsageKwh}`);
    console.log(`Excel Usage (MWh Rounded): ${excelUsageMWh}`);
    console.log(`KPI Usage (MWh): ${usageKpi}`);
    //Allowed buffer/tolerance (0.2 MWh)
    const tolerance = 0.2;
    let errors = [];
    //Check if values differ beyond tolerance
    if (Math.abs(usageKpi - excelUsageMWh) > tolerance) {
        errors.push(
            `Usage KPI (${usageKpi} MWh) does NOT match Excel Usage (${excelUsageMWh} MWh). ` + `Allowed Buffer: ±${tolerance} MWh`);
    }

    //Return result
    if (errors.length === 0) {
        return {
            success: true,
            excelUsageMWh,
            message: "Usage values matched successfully"
        };
    } else {
        console.log("Usage mismatch found:");
        errors.forEach(e => console.log("" + e));
        return {
            success: false,
            excelUsageMWh,
            message: errors.join(" | ")
        };
    }
}
// Navigate to Daily Reports Page
async openDailyReportsPage() {
    await this.page.goto("https://novo.kazam.in/org/zynetic_electric_vehicle_charging_llc/7aff5403-3de3-4273-9665-099574cf2048/cpo/reports/daily-reports");
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(2000);
}

// Select dropdown value in Daily Reports
async selectReportDropdown(value) {
    const dropdown = this.page.locator("//div[@class='grid gap-2']//select[1]");
    await dropdown.waitFor({ state: "visible" });
    await dropdown.selectOption(value);
    await this.page.waitForTimeout(2000);
    // Remove waitForTimeout. If the page loads data after selection:
    await this.page.waitForLoadState("networkidle");
}

//// Select dropdown value in Daily Reports
async selectConfigureDropdown(value) {
    const dropdown = this.page.locator("//*[@id='cms-app-main-content']/section/div[1]/section/div/div[5]/select");
    await dropdown.waitFor({ state: "visible" });
    await dropdown.selectOption(value);
    await this.page.waitForTimeout(2000);
    // Remove waitForTimeout. If the page loads data after selection:
    await this.page.waitForLoadState("networkidle");
}



// Calendar date selection (uses your function logic)
async selectKazamCalendarDate(userDate) {
    const [day, month, year] = userDate.split("/");
    
    // Select Year and Month
    await this.page.selectOption("select.focus\\:ring-0.focus\\:outline-none.border-none.p-1:nth-of-type(1)", year);
    await this.page.selectOption("select.focus\\:ring-0.focus\\:outline-none.border-none.p-1:nth-of-type(2)", String(Number(month) - 1));

    // Wait for the specific day to be visible
    const dayBtn = this.page.locator(`//button[.//div[text()='${Number(day)}']]`);
    await dayBtn.waitFor({ state: "visible" });
    
    // Perform a double click to select
    await dayBtn.dblclick(); 
    console.log(`Selected date: ${userDate}`);
}

//Download Daily Report with fixed filename
async downloadDailyReport() {
      const downloadPromise = this.page.waitForEvent("download", { timeout: 90000 });
    const downloadBtn = this.page.locator("//button[normalize-space()='Generate Report']");
    await downloadBtn.waitFor({ timeout:60000});
    await downloadBtn.click();
    const download = await downloadPromise;
    

    // Create downloads folder if not exists
    const downloadDir = path.join(__dirname, "downloads");
    if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir);

    // Save file with required name
    const filePath2 = path.join(downloadDir, "Session_Reports_Analytics.xlsx");
    await download.saveAs(filePath2);
    return filePath2;
}


// Count txn_id 
async countTxnIdsDailyReport(filePath2) {
      const wb = excel.readFile(filePath2);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const data = excel.utils.sheet_to_json(sheet, { header: 1 }); 
    const rows = data.slice(1);
    const txnIds = rows
        .map(r => r[2])       // change index based on required column
        .filter(id => id);
    return txnIds.length;

}

// Compare daily report count with KPI & Excel
async verifyDailyReportCounts(txnIds, sessionKpi, excelCount) {
    let errors = [];

    // Compare Daily Report Count vs Dashboard KPI
    if (txnIds !== sessionKpi) {
        errors.push(
            `Daily Report Session (${txnIds}) does not match KPI Sessions (${sessionKpi})`
        );
    } else {
        console.log(
            `Daily Report Session matched KPI Sessions → ${txnIds}`
        );
    }

    // Compare Daily Report Count vs Excel Sessions Count
    if (txnIds !== excelCount) {
        errors.push(
            `Daily Report Session (${txnIds}) does not match Excel Sessions Count (${excelCount})`
        );
    } else {
        console.log(
            `Daily Report Session matched Excel Sessions → ${txnIds}`
        );
    }

    // Final result
    if (errors.length === 0) {
        console.log("Daily Report Session matched KPI & Excel");
        return {
            success: true,
            txnIds,
            message: "Daily Report Session matched KPI & Excel"
        };
    } else {
        console.log("Daily Report Mismatch Found:");
        errors.forEach(e => console.log(" - " + e));
        return {
            success: false,
            txnIds,
            message: errors.join(" | ")
        };
    }
}

    async verifyReportUsageFromExcel(filePath2, usageKpi) {
    const excelUsageKwh = await this.sumOfUsage(filePath2);

    // Convert to MWh
    const excelMWh_raw = excelUsageKwh / 1000;

    // Round to 2 decimals
    const excelMWh = Number(excelMWh_raw.toFixed(2));

    console.log(`Excel Usage (kWh): ${excelUsageKwh}`);
    console.log(`Excel Usage (MWh Rounded): ${excelMWh}`);
    console.log(`KPI Usage (MWh): ${usageKpi}`);

    // Allowed tolerance (0.2 MWh)
    const tolerance = 0.2;
    if (Math.abs(usageKpi - excelMWh) <= tolerance) {
        return {
            success: true,
            excelUsageMWh: excelMWh,
            message: "Usage values matched successfully"
        };
    }
    // Failure result
    return {
        success: false,
        excelUsageMWh: excelMWh,
        message: `Usage KPI (${usageKpi} MWh) does NOT match Excel Usage (${excelMWh} MWh). Allowed Buffer: ±${tolerance} MWh`
    };
}

async ChargerPage() {
    await this.page.goto("https://novo.kazam.in/org/zynetic_electric_vehicle_charging_llc/7aff5403-3de3-4273-9665-099574cf2048/cpo/chargers");
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(2000);

}
async applyTimeFilterinChargerPage(period) {
    await this.chargertimeperiod.click();
    await this.page.waitForTimeout(1000);
   const option = this.page.locator(`//div[contains(@class,'flex')]//div[normalize-space(text())='${period}']`);
    await option.waitFor();
    await this.page.waitForTimeout(1000);
    await option.click();
    await this.page.waitForLoadState("networkidle");}


async ChargerdownloadExcel() {
     const downloadPromise = this.page.waitForEvent("download");
        //Click download on 3dots menu
        await this.downloadButton.click();
        await this.page.waitForTimeout(1000);
        await this.excelOption.waitFor({ state: "visible", timeout: 5000 });
        await this.excelOption.click();
    
        //Wait for file
        const download = await downloadPromise;
    
        //Check "downloads" folder exists in current directory
        const downloadDir = path.join(__dirname, "downloads");
        if (!fs.existsSync(downloadDir)) {
            fs.mkdirSync(downloadDir);
        }
        //Save the file
        const filePath3 = path.join(downloadDir, "chargers.xlsx");
        await download.saveAs(filePath3);
        console.log("Excel Downloaded ", filePath3);
        return filePath3;
    }

async getSessionsAndUsageFromSessionReportExcel(filePath3) {
    const wb = excel.readFile(filePath3);
    const sheet = wb.Sheets[wb.SheetNames[0]];

    // Read Excel as raw rows
    const data = excel.utils.sheet_to_json(sheet, { header: 1, defval: "" });

    // First row is header row
    const headers = data[0].map(h => h.toString().trim());

    // Find column INDEXES
    const sessionColIndex = headers.findIndex(h =>
        h.toLowerCase().includes("sessions")
    );

    const usageColIndex = headers.findIndex(h =>
        h.toLowerCase().includes("usage")
    );

    if (sessionColIndex === -1 || usageColIndex === -1) {
        throw new Error(
            `Sessions or Usage column not found.
             Headers found: ${headers.join(", ")}`
        );
    }

    let totalSessions = 0;
    let totalUsageKW = 0;
    // Start from row 1 (skip headers)
    for (let i = 1; i < data.length; i++) {
        const row = data[i];

        //Sessions
        const sessions = Number(row[sessionColIndex]) || 0;
        totalSessions += sessions;

        // Usage
        if (row[usageColIndex]) {
            const usageKW = parseFloat(
                row[usageColIndex].toString().replace(/[^0-9.]/g, "")
            );

            if (!isNaN(usageKW)) {
                totalUsageKW += usageKW;
            }
        }
    }

    const totalUsageMW = totalUsageKW / 1000;
  return {
    excelSessions: totalSessions,
    excelUsageKW: Number(totalUsageKW.toFixed(2)),
    excelUsageMW: Number(totalUsageMW.toFixed(4))
};

}

async verifyDashboardKPIWithChargerExcel(filePath3, sessionKpi, usageKpi) {
    const {
        excelSessions,
        excelUsageMW
    } = await this.getSessionsAndUsageFromSessionReportExcel(filePath3);
    let errors = [];

    // Compare Sessions
    if (sessionKpi !== excelSessions) {
        errors.push(
            `Sessions mismatch : KPI Session Count: ${sessionKpi}, Session count in ChargerExcel: ${excelSessions}`
        );
    } else {
    console.log(
        `Sessions matched : KPI Session Count: ${sessionKpi}, ChargerExcel Session Count: ${excelSessions}`
    );
}

    // Compare Usage (MW) with tolerance
    const tolerance = 0.2;
    if (Math.abs(usageKpi - excelUsageMW) > tolerance) {
        errors.push(
            `Usage mismatch : KPI: ${usageKpi} MW, Charger Excel: ${excelUsageMW} MW (Allowed ±${tolerance})`
        );
    } else {
    console.log(
        `Usage matched : KPI usage: ${usageKpi}, ChargerExcel usage: ${excelUsageMW}`
    );
}

    if (errors.length === 0) {
        console.log("Dashboard KPI and Charger Excel matched successfully");
        return {
            success: true,
            excelSessions,
            excelUsageMW,
            message: "Dashboard KPI and Charger Excel matched successfully"
        };
    } else {
        console.log("Mismatch found");
        errors.forEach(e => console.log("" + e));

        return {
            success: false,
            excelSessions,
            excelUsageMW,
            message: errors.join(" | ")
        };
    }
}

}




//charger and session module validation
//charger module and charger report_ana (count ,usage,ava)
//