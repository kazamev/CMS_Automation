import fs from "fs";   
import path from "path";
import * as excel from "xlsx";

export class DashboardSessionsPage {

    constructor(page) {
        this.page = page;

        //KPI LOCATORS
        this.revenueValue = page.locator("(//p[@class='text-base font-medium'])[1]");
        this.sessionsValue = page.locator("(//p[@class='text-base font-medium'])[2]");
        this.usageValue = page.locator("(//p[@class='text-base font-medium'])[3]");
        this.onlinePercent = page.locator("(//p[@class='text-base font-medium'])[4]");

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
            this.RevenueTab = page.locator("//button[normalize-space()='Revenue']");
             this.reportDropdown = page.locator("//div[@class='grid gap-2']//select[1]");
    }

    // Fetch KPI values from Dashboard
    async getKPIValues() {
  const sessionText = await this.sessionsValue.textContent();
  const usageText = await this.usageValue.textContent();
  const onlineText = await this.onlinePercent.textContent();
  const revenueText = await this.revenueValue.textContent();

  this.sessionKpi = Number(sessionText.replace(/[^0-9.]/g, ""));
  this.usageKpi = Number(usageText.replace(/[^0-9.]/g, ""));
  this.onlineKpi = Number(onlineText.replace(/[^0-9.]/g, ""));
  this.revenueKpi = Number(revenueText.replace(/[^0-9.]/g, ""));

  if (usageText.toLowerCase().includes("kwh")) {
    this.usageKpi = this.usageKpi / 1000;
  }

  return {
    sessionKpi: this.sessionKpi,
    usageKpi: this.usageKpi,
    onlineKpi: this.onlineKpi,
    revenueKpi: this.revenueKpi
  };
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

// Session Count in  session downloaded Excel
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

// Verify Counts (KPI vs UI vs Excel)
 async verifyCounts(filePath, allCount, sessionKpi) {
    //Extract count from Excel
    const excelCount = await this.countSessionIdsInExcel(filePath);
    let errors = [];

    const tolerance = excelCount * 0.05;
    //Compare All Count with Dashboard KPI
    {
        if (Math.abs(allCount - sessionKpi) > tolerance) {
        errors.push(`🛑All sessions Count in the session page (${allCount}) does NOT match KPI Count (${sessionKpi})`);
         }
    }

    //Compare Excel count with KPI
   if (Math.abs(sessionKpi - excelCount) > tolerance)  {
        errors.push(`🛑KPI Count (${sessionKpi}) does NOT match Excel Count (${excelCount})`);
    }
    //Compare UI All Count with Excel
    if (allCount !== excelCount) {
        errors.push(`🛑All sessions Count in the session page (${allCount}) does NOT match Excel Count (${excelCount})`);
 
    }
    //Return structured result
    if (errors.length === 0) {
        console.log(`Session counts match across the Dashboard, Session page, and Excel file (${excelCount} ) ---within ±5% tolerance`);
        return {
            success: true,
            excelCount
        };
    } else {
        console.log(`🛑Session counts not matched across the Dashboard(${sessionKpi}) Session page(UI)(${allCount}), and Session Excel file. ${excelCount}`);
        errors.forEach(e => console.log(" - " + e));

        return {
            success: false,
            excelCount,
            message: errors.join(" | ")
        };
    }
}

// Sum of Usage from session Excel
async sumOfUsage(filePath) {
  const wb = excel.readFile(filePath);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const data = excel.utils.sheet_to_json(sheet, { header: 1 });

  const rows = data.slice(1); // skip header row

  const values = rows
    .map(row => Number(row[9]))
    .filter(v => !isNaN(v));

  return values.reduce((a, b) => a + b, 0);
}

// Verify Usage (KPI vs session Excel)
async verifyUsageFromExcel(filePath, usageKpi) {
    //Sum usage from Excel (kWh)
    const excelUsageKwh = await this.sumOfUsage(filePath);
    //Convert kWh → MWh
    const excelUsageMWh_raw = excelUsageKwh / 1000;
    //Round Excel MWh to 2 decimals
    const excelUsageMWh = Number(excelUsageMWh_raw.toFixed(2));
    console.log(`Session Excel Usage (kWh): ${excelUsageKwh}`);
    console.log(`Session Excel Usage (MWh Rounded): ${excelUsageMWh}`);
    console.log(`KPI Usage (MWh): ${usageKpi}`);
    //Allowed buffer/tolerance (0.2 MWh)
    const tolerance = excelUsageMWh * 0.05;
    let errors = [];
    //Check if values differ beyond tolerance
    if (Math.abs(usageKpi - excelUsageMWh) > tolerance) {
        errors.push(
            `Usage KPI (${usageKpi} MWh) does NOT match session Excel Usage (${excelUsageMWh} MWh)`);
    }

    //Return result
    if (errors.length === 0) {
        return {
            success: true,
            excelUsageMWh,
            message:  `Usage KPI (${usageKpi} MWh) match session Excel Usage (${excelUsageMWh} MWh) --within ±5% tolerance`
        };
    } else {
        console.log( `Usage KPI (${usageKpi} MWh) does NOT match session Excel Usage (${excelUsageMWh} MWh)`);
        errors.forEach(e => console.log("" + e));
        return {
            success: false,
            excelUsageMWh,
            message: errors.join(" | ")
        };
    }
}
// Navigate to Reports Page
async openDailyReportsPage() {
    await this.page.goto("https://novo.kazam.in/org/zynetic_electric_vehicle_charging_llc/7aff5403-3de3-4273-9665-099574cf2048/cpo/reports/daily-reports");
    await this.page.waitForLoadState("networkidle");
    console.log("Navigated to Reports Page");
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

//Download  Report with fixed filename
async downloadSessionReport() {
      const downloadPromise = this.page.waitForEvent("download", { timeout: 90000 });
    const downloadBtn = this.page.locator("//button[normalize-space()='Generate Report']");
    await downloadBtn.waitFor({ timeout:60000});
    await downloadBtn.click();
    const download = await downloadPromise;
      this.page.waitForEvent('download', { timeout: 90000 });
    
    // Create downloads folder if not exists
    const downloadDir = path.join(__dirname, "downloads");
    if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir);

    // Save file with required name
    const filePath2 = path.join(downloadDir, "Session_Reports_Analytics.xlsx");
    await download.saveAs(filePath2);
    return filePath2;
}

//Download Charger Report with fixed filename
async downloadChargerReport() {
      const downloadPromise = this.page.waitForEvent("download", { timeout: 90000 });
    const downloadBtn = this.page.locator("//button[normalize-space()='Generate Report']");
    await downloadBtn.waitFor({ timeout:60000});
    await downloadBtn.click();
    const download = await downloadPromise;
      this.page.waitForEvent('download', { timeout: 90000 });
    
    // Create downloads folder if not exists
    const downloadDir = path.join(__dirname, "downloads");
    if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir);

    // Save file with required name
    const filePath3 = path.join(downloadDir, "Charger_Reports_Analytics.xlsx");
    await download.saveAs(filePath3);
    return filePath3;

}

// Count txn_id in Session Report Excel
async countTxnIdsSessionReport(filePath2) {
      const wb = excel.readFile(filePath2);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const data = excel.utils.sheet_to_json(sheet, { header: 1 }); 
    const rows = data.slice(1);
    const txnIds = rows
        .map(r => r[2])       // change index based on required column
        .filter(id => id);
    return txnIds.length;

}

// Compare session report count with KPI & session Excel
async verifySessionReportCounts(txnIds, sessionKpi, excelCount) {
    let errors = [];

    // Compare Session Report Count vs Dashboard KPI
    const tolerance = txnIds * 0.05;
    if (Math.abs(txnIds - sessionKpi) > tolerance)
        {
        errors.push(
            ` Report Session (${txnIds}) does not match KPI Sessions (${sessionKpi}) within ±5% tolerance`
        );
    } else {
        console.log(
            `Report Session (${txnIds}) matched KPI Sessions (${sessionKpi}) within ±5% tolerance`
        );
    }

    // Compare  Report Count vs Excel Sessions Count
    if (txnIds !== excelCount) {
        errors.push(
            `Report page Sessions (${txnIds}) does not match Session page Excel Sessions Count (${excelCount})`
        );
    } else {
        console.log(
            `Report page Session (${txnIds}) matched Session page Excel Sessions (${excelCount})`
        );
    }

    // Final result
    if (errors.length === 0) {
        // console.log(`Report Session (${txnIds}) matched  Excel Sessions (${excelCount})`);
        return {
            success: true,
            txnIds,
            message: `Report page Session (${txnIds}) matched  Excel Sessions (${excelCount}`
        };
    } else {
        console.log(`Report page Session (${txnIds}) doesn't match  Excel Sessions (${excelCount}`);
        errors.forEach(e => console.log(" - " + e));
        return {
            success: false,
            txnIds,
            message: errors.join(" | ")
        };
    }
}

// Verify Usage from Report Excel vs KPI
    async verifyReportUsageFromExcel(filePath2, usageKpi) {
    const excelUsageKwh = await this.sumOfUsage(filePath2);

    // Convert to MWh
    const excelMWh_raw = excelUsageKwh / 1000;

    // Round to 2 decimals
    const excelMWh = Number(excelMWh_raw.toFixed(2));

    console.log(`Report page Excel Usage (kWh): ${excelUsageKwh}`);
    console.log(`Report page Excel Usage (MWh Rounded): ${excelMWh}`);
    console.log(`KPI Usage (MWh): ${usageKpi}`);

    // Allowed tolerance (0.2 MWh)
    const tolerance = excelMWh * 0.05;
    if (Math.abs(usageKpi - excelMWh) <= tolerance) {
        return {
            success: true,
            excelUsageMWh: excelMWh,
            message: `Usage values match across the Dashboard, Reports(Analytics) Excel file (${excelMWh} MWh)---within ±5% tolerance`
        };
    }
    // Failure result
    return {
        success: false,
        excelUsageMWh: excelMWh,
        message: `Usage KPI (${usageKpi} MWh) does NOT match Reports(Analytics) Excel file (${excelMWh} MWh)`
    };
}

//online percent verification from charger excel
async verifyOnlinePercentFromChargerExcel(filePath3, onlineKpi) {
    const avgOnlinePercent = await this.getAverageOnlinePercentFromExcel(filePath3); 
    const difference = Math.abs(avgOnlinePercent - onlineKpi);  
    const tolerance = avgOnlinePercent * 0.05; // 5% tolerance
    if (difference <= tolerance) {
      return {
        success: true,
        message: `Online Percentage matches KPI: ${onlineKpi}%, Excel Avg: ${avgOnlinePercent}%---within ±5% tolerance`
      };
    } else {
      return {
        success: false,
        message: `Online Percentage mismatch! KPI: ${onlineKpi}%, Excel Avg: ${avgOnlinePercent}%`
        };
    }
}

async RevenueClick() {
   await this.RevenueTab.waitFor({ state: "visible", timeout: 30000 });
 
   await Promise.all([
     this.page.waitForLoadState("networkidle"),
     this.RevenueTab.click()
   ]);
 
   // Wait for report dropdown as proof Revenue page loaded
   await this.reportDropdown.waitFor({ state: "visible", timeout: 30000 });
 }

 //Revenue Report Download
 async downloadRevenueReport() {
      const downloadPromise = this.page.waitForEvent("download", { timeout: 90000 });
    const downloadBtn = this.page.locator("//button[normalize-space()='Generate Report']");
    await downloadBtn.waitFor({ timeout:60000});
    await downloadBtn.click();
    const download = await downloadPromise;
      this.page.waitForEvent('download', { timeout: 90000 });
    
    // Create downloads folder if not exists
    const downloadDir = path.join(__dirname, "downloads");
    if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir);

    // Save file with required name
    const filePath8 = path.join(downloadDir, "CRevenue_Report_Analytics.xlsx");
    await download.saveAs(filePath8);
    return filePath8;

}
 
 //Sum of Revenue(Excel)
 async sumOfRevenue(filePath) {
     const wb = excel.readFile(filePath);
     const sheet = wb.Sheets[wb.SheetNames[0]];
     const data = excel.utils.sheet_to_json(sheet, { header: 1 });
     const rows = data.slice(1);
     // Excel Usage column index
     const RevenueValues = rows
         .map(row => Number(row[2]))   // change index if needed
         .filter(v => !isNaN(v));
    const totalRevenue = RevenueValues.reduce((a, b) => a + b, 0);
    const formattedTotal = Number(totalRevenue.toFixed(2));
   //  console.log("Excel Revenue Sum:", formattedTotal);
    return formattedTotal;
 }

 //Revenue Validation(KPI vs Report Excel)
 async validateRevenue(filePath, revenueKpi) {
    const excelRevenue = await this.sumOfRevenue(filePath);
    const tolerance = 0; // 0 Rupees tolerance
    if (Math.abs(revenueKpi - excelRevenue) <= tolerance) {
        return {
            message:`Revenue KPI (${revenueKpi} ) match Excel Revenue (${excelRevenue})`
        };
    }
    return {
        success: false,
        excelRevenue: excelRevenue,
        message: `Revenue KPI (${revenueKpi}) does NOT match Excel Revenue (${excelRevenue})`
    };
 }

async ChargerPage() {
    await this.page.goto("https://novo.kazam.in/org/zynetic_electric_vehicle_charging_llc/7aff5403-3de3-4273-9665-099574cf2048/cpo/chargers");
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(2000);
    console.log("Navigated to Charger Page");

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
    // Start listening BEFORE triggering download
    const downloadPromise = this.page.waitForEvent("download", { timeout: 90000 });

    // Click download on 3-dots menu
    await this.downloadButton.click();
    await this.excelOption.waitFor({ state: "visible", timeout: 5000 });
    await this.excelOption.click();

    // Capture the download
    const download = await downloadPromise;

    // Ensure downloads folder exists
    const downloadDir = path.join(__dirname, "downloads");
    if (!fs.existsSync(downloadDir)) {
        fs.mkdirSync(downloadDir, { recursive: true });
    }

    // Save file
    const filePath4 = path.join(downloadDir, "chargers.xlsx");
    await download.saveAs(filePath4);

    console.log("Charger Excel Downloaded:", filePath4);
    return filePath4;
}

async getSessionsAndUsageFromSessionReportExcel(filePath4) {
    const wb = excel.readFile(filePath4);
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
    excelUsageMW: Number(totalUsageMW.toFixed(2))
};

}


// Calculate Average Online % from  Charger Excel
async getAverageOnlinePercentFromExcel(filePath4) {
  if (!filePath4) {
    throw new Error("Excel file path is undefined for Online % calculation");
  }
  const wb = excel.readFile(filePath4);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const data = excel.utils.sheet_to_json(sheet, { header: 1 });
  const rows = data.slice(1);
  const values = rows   
    .map(row =>
      parseFloat(
        row[5]?.toString().replace(/[^0-9.]/g, "")
      )
    )
    .filter(v => !isNaN(v));

  const avgOnline =values.reduce((a, b) => a + b, 0) / values.length;
  return Number(avgOnline.toFixed(2));
}

async verifyDashboardKPIWithChargerExcel(filePath4, sessionKpi, usageKpi) {
    const {
        excelSessions,
        excelUsageMW
    } = await this.getSessionsAndUsageFromSessionReportExcel(filePath4);
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
    // const tolerance = 0.2;
    if (usageKpi != excelUsageMW) {
        errors.push(
            `Usage mismatch : KPI: ${usageKpi} MW, Charger Excel: ${excelUsageMW} MW`
        );
    } else {
    console.log(
        `Usage matched : KPI usage: ${usageKpi}, ChargerExcel usage: ${excelUsageMW}MW`
    );
}

    if (errors.length === 0) {
        // console.log(`Dashboard KPI Usage ${usageKpi} MW and Charger Excel usage ${excelUsageMW}MW matched successfully`);
        return {
            success: true,
            excelSessions,
            excelUsageMW,
            message: `Dashboard KPI Usage ${usageKpi} and Charger Excel usage ${excelUsageMW}MW matched successfully`
        };
    } else {
        console.log(`Mismatch found in Dashboard KPI Usage ${usageKpi} and Charger Excel usage ${excelUsageMW}MW`);
        errors.forEach(e => console.log("" + e));

        return {
            success: false,
            excelSessions,
            excelUsageMW,
            message: errors.join(" | ")
        };
    }
}

// Verify Online % from charger Excel vs Dashboard KPI
async verifyOnlinePercentWithExcel(filePath4, OnlineKpi) {
  try {
    const avgOnlinePercent =
      await this.getAverageOnlinePercentFromExcel(filePath4);

    if (avgOnlinePercent !== OnlineKpi) {
      return {
        success: false,
        message: `Online Percentage mismatch: KPI ${OnlineKpi}%, Report page Excel Avg ${avgOnlinePercent}%`
      };
    } else {
      return {
        success: true,
        message: `Online Percentage matches KPI: ${OnlineKpi}%,Report Page Excel Avg ${avgOnlinePercent}%`
      };
    }

  } catch (error) {
    return {
      success: false,
      message: `Error verifying Online Percentage: ${error.message}`
    };
  }
}

 
 
 
 //sum of usage in chargers report
 async sumOfUsageInRevenueReport(filePath) {
     const wb = excel.readFile(filePath);
     const sheet = wb.Sheets[wb.SheetNames[0]]; 
     const data = excel.utils.sheet_to_json(sheet, { header: 1 });
     const rows = data.slice(1); 
     // Excel Usage column index (eg: column 9)
     const usageValues = rows
         .map(row => Number(row[13]))   // change index if needed
         .filter(v => !isNaN(v));
    const totalUsage = usageValues.reduce((a, b) => a + b, 0);
    const formattedTotal = Number(totalUsage.toFixed(2));
    return formattedTotal;
 }

}