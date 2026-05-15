import fs from "fs";   
import path from "path";
import * as excel from "xlsx";

export class DataValidation {

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
        this.downloadButton = page.locator("//div[@id='download']//*[name()='svg']");
        this.excelOption = page.locator("(//div[@class='flex items-center gap-2 m-1 hover:bg-kazamGray-100 p-2 rounded-md'])[2]");
        this.chargertimeperiod = page.locator("//button[.//div[normalize-space()='Today']]");
        this.RevenueTab = page.locator("//button[normalize-space()='Revenue']");
        this.reportDropdown = page.locator("//div[@class='grid gap-2']//select[1]");

    this.revenue = page.locator("(//span[@class='text-2xl'])[1]");
    this.totalRevenue = page.locator("(//span[@class='text-2xl'])[3]");
    this.SelectSucessTrans=page.locator("//select[@class='border border-gray-300 bg-white rounded-lg text-sm focus:border-kazamGray-300 focus:ring-kazamGray-300']");



    // Calendar
    this.calendarBtn = page.locator("//*[@id='cms-app-main-content']/div/div[2]/div[1]/div[2]/div/button");

    // Calendar dropdowns
    this.yearSelect = page.locator("(//select[@class='focus:ring-0 focus:outline-none border-none p-1'])[2]");
    this.monthSelect = page.locator("(//select[@class='focus:ring-0 focus:outline-none border-none p-1'])[1])");
    this.submitDateBtn = page.locator("//button[normalize-space()='Submit']");

     this.DashBoardTimeFilter= page.locator("//button[@class='w-full flex gap-1 items-center bg-black py-2 px-3 border rounded-md bg-white']");
   

    // Search
    this.searchBox = page.locator("//input[@type='search']");
    this.firstRow = page.locator("(//p[@class='text-base font-medium'])[1])");

    // Download
     this.MenuButton= page.locator("//div[@id='download']//*[name()='svg']");
    this.downloadReport= page.locator("(//div[contains(text(),'Download Report')])[1]");
    }

    // Fetch KPI values from Dashboard
    async GetKPIValues() {
      await this.page.waitForTimeout(5000);
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
    async ApplyTimeFilterInDashboard(period) {
    await this.DashBoardTimeFilter.click();

    //Locate the option dynamically
   const option = this.page.locator(`//div[contains(@class,'flex')]//div[normalize-space(text())='${period}']`);
    await option.waitFor();
    await option.click();
    await this.page.waitForLoadState("networkidle");

    const today = new Date();

  // Yesterday
  const endDate = new Date(today);
  endDate.setDate(today.getDate() - 1);

  // 7 days before yesterday
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 8);

  const startDay = startDate.getDate();
  const endDay = endDate.getDate();

  const startMonth = startDate.getMonth();
  const currentMonth = today.getMonth();

  function formatDate(date) {
    const day = String(date.getDate()).padStart(2,'0');
    const month = String(date.getMonth()+1).padStart(2,'0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  console.log("Start Date:", formatDate(startDate));
  console.log("End Date:", formatDate(endDate));

  // If start date is in previous month → go to previous month
  if (startMonth !== currentMonth) {
    await this.page.locator("//button[@title='Go to Previous Month']//*[name()='svg']").click();
  }

  // Select Start Date
  await this.page.locator(`//button[normalize-space()='${startDay}']`).click();

  // If end date is in current month → move forward
  if (startMonth !== endDate.getMonth()) {
    await this.page.locator("//button[@title='Go to Next Month']//*[name()='svg']").click();
  }

  // Select End Date
  await this.page.locator(`//button[normalize-space()='${endDay}']`).click();

  // Submit
  await this.page.locator("//button[normalize-space()='Submit']").click();

  await this.page.waitForLoadState("networkidle");

}

    // Navigate to Sessions Page
    async OpenSessionsPage() {
    await this.sessionsKPICard.click();
    await this.page.waitForLoadState("networkidle");   
}

// Apply Time Filter in Sessions Page
    async ApplyTimeFilter(period) {
    await this.dateFilter.click();
    await this.page.waitForTimeout(1000);
   const option = this.page.locator(`//div[contains(@class,'flex')]//div[normalize-space(text())='${period}']`);
    await option.waitFor();
    await this.page.waitForTimeout(1000);
    await option.click();
    await this.page.waitForLoadState("networkidle");
    const today = new Date();

  // Yesterday
  const endDate = new Date(today);
  endDate.setDate(today.getDate() - 1);

  // 7 days before yesterday
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 8);

  const startDay = startDate.getDate();
  const endDay = endDate.getDate();

  const startMonth = startDate.getMonth();
  const currentMonth = today.getMonth();

  function formatDate(date) {
    const day = String(date.getDate()).padStart(2,'0');
    const month = String(date.getMonth()+1).padStart(2,'0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  console.log("Start Date:", formatDate(startDate));
  console.log("End Date:", formatDate(endDate));

  // If start date is in previous month → go to previous month
  if (startMonth !== currentMonth) {
    await this.page.locator("//button[@title='Go to Previous Month']//*[name()='svg']").click();
  }

  // Select Start Date
  await this.page.locator(`//button[normalize-space()='${startDay}']`).click();

  // If end date is in current month → move forward
  if (startMonth !== endDate.getMonth()) {
    await this.page.locator("//button[@title='Go to Next Month']//*[name()='svg']").click();
  }

  // Select End Date
  await this.page.locator(`//button[normalize-space()='${endDay}']`).click();

  // Submit
  await this.page.locator("//button[normalize-space()='Submit']").click();

  await this.page.waitForLoadState("networkidle");

}

// Apply anomaly filter
async ApplyAnomalyFilter(optionText) {
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
async GetSessionTabCounts() {
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
async DownloadExcel() {
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
async CountSessionIdsInExcel(filePath) {
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
 async VerifyCounts(filePath, allCount, sessionKpi) {
    //Extract count from Excel
    const excelCount = await this.CountSessionIdsInExcel(filePath);
    let errors = [];

    const tolerance = excelCount * 0.05;
    //Compare All Count with Dashboard KPI
    {
        if (Math.abs(allCount - sessionKpi) === 0) {
            console.log(`🟢 All sessions Count in the session page (${allCount}) matches Dashboard KPI Sessions (${sessionKpi})`);
        }
       else if (Math.abs(sessionKpi - excelCount) <= tolerance) {
            console.log(`🟡 Dashboard KPI Sessions (${sessionKpi}) matches Excel Count (${excelCount}) ---within ±5% tolerance`)
            }
        else {
            errors.push(`🛑 Dashboard KPI Sessions (${sessionKpi}) does NOT match Excel Count (${excelCount})`);
    }

    //Compare Excel count with KPI
   if (Math.abs(sessionKpi - excelCount) === 0)  {
        console.log(`🟢 KPI Count (${sessionKpi}) matches Excel Count (${excelCount})`);
    }
    else if (Math.abs(sessionKpi - excelCount) <= tolerance) { 
        console.log(`🟡 KPI Count (${sessionKpi}) matches Excel Count (${excelCount}) ---within ±5% tolerance`);
    }
    else {
        errors.push(`🛑KPI Count (${sessionKpi}) does NOT match Excel Count (${excelCount})`);
    }

    //Compare UI All Count with Excel
    if (allCount !== excelCount) {
        errors.push(`🛑All sessions Count in the session page (${allCount}) does NOT match Excel Count (${excelCount})`);
 
    }
    else {
        console.log(`🟢 All sessions Count in the session page (${allCount}) matches Excel Count (${excelCount})`);
    }
    
}
 }
// Sum of Usage from session Excel
async SumOfUsage(filePath) {
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

async VerifyUsageFromExcel(filePath, usageKpi) {
   
    //Sum usage from Excel (kWh)
    const excelUsageKwh = await this.SumOfUsage(filePath);
    //Convert kWh → MWh
    const excelUsageMWh_raw = excelUsageKwh / 1000;
    //Round Excel MWh to 2 decimals
    const excelUsageMWh = Number(excelUsageMWh_raw.toFixed(2));
    console.log(`Session Excel Usage (kWh): ${excelUsageKwh}`);
    console.log(`Session Excel Usage (MWh Rounded): ${excelUsageMWh}`);
    console.log(`Dashboard KPI Usage (MWh): ${usageKpi}`);
    //Allowed buffer/tolerance (0.2 MWh)
    const tolerance = excelUsageMWh * 0.05;
    let errors = [];
    //Check if values differ beyond tolerance
    if (Math.abs(usageKpi - excelUsageMWh) === 0) {
       console.log(`🟢 Usage KPI (${usageKpi} MWh) matches session Excel Usage (${excelUsageMWh} MWh)`);
    }
    else if (Math.abs(usageKpi - excelUsageMWh) <= tolerance) {
        console.log(`🟡 Usage KPI (${usageKpi} MWh) matches session Excel Usage (${excelUsageMWh} MWh) --within ±5% tolerance`);
    }
        else { 
       console.log(`🛑 Usage KPI (${usageKpi} MWh) does NOT match session Excel Usage (${excelUsageMWh} MWh)`);
    }
}


//charger Page
async ChargerPage() {
    await this.page.goto("https://novo.kazam.in/org/vraj_technologies/dc3d9dfe-3cc3-4068-9f7a-091acdcc3756/cpo/chargers", { waitUntil: "load" });
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(2000);
    console.log("Navigated to Charger Page");

}
async ApplyTimeFilterinChargerPage(period) {
    await this.chargertimeperiod.click();
    await this.page.waitForTimeout(1000);
    const option = this.page.locator(`//div[contains(@class,'flex')]//div[normalize-space(text())='${period}']`);
    await option.waitFor();
    await this.page.waitForTimeout(1000);
    await option.click();
    await this.page.waitForLoadState("networkidle");

    const today = new Date();

  // Yesterday
  const endDate = new Date(today);
  endDate.setDate(today.getDate() - 1);

  // 7 days before yesterday
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 8);

  const startDay = startDate.getDate();
  const endDay = endDate.getDate();

  const startMonth = startDate.getMonth();
  const currentMonth = today.getMonth();

  function formatDate(date) {
    const day = String(date.getDate()).padStart(2,'0');
    const month = String(date.getMonth()+1).padStart(2,'0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  console.log("Start Date:", formatDate(startDate));
  console.log("End Date:", formatDate(endDate));

  // If start date is in previous month → go to previous month
  if (startMonth !== currentMonth) {
    await this.page.locator("//button[@title='Go to Previous Month']//*[name()='svg']").click();
  }

  // Select Start Date
  await this.page.locator(`//button[normalize-space()='${startDay}']`).click();

  // If end date is in current month → move forward
  if (startMonth !== endDate.getMonth()) {
    await this.page.locator("//button[@title='Go to Next Month']//*[name()='svg']").click();
  }

  // Select End Date
  await this.page.locator(`//button[normalize-space()='${endDay}']`).click();

  // Submit
  await this.page.locator("//button[normalize-space()='Submit']").click();

  await this.page.waitForLoadState("networkidle");
    
}

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

async GetSessionsAndUsageFromChargerExcel(filePath4) {
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
async GetAverageOnlinePercentFromExcel(filePath4) {
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
        row[18]?.toString().replace(/[^0-9.]/g, "")
      )
    )
    .filter(v => !isNaN(v));

  const avgOnline =values.reduce((a, b) => a + b, 0) / values.length;
  return Number(avgOnline.toFixed(2));
}

async VerifySessionKPIWithChargerExcel(filePath4, sessionKpi) {
    const {
        excelSessions,
    } = await this.GetSessionsAndUsageFromChargerExcel(filePath4);

    // Compare Sessions
    if (sessionKpi !== excelSessions) {
        console.log(
            `🔴 Sessions mismatch : KPI Session Count: ${sessionKpi}, Session count in ChargerExcel: ${excelSessions}`
        );
    } else {
    console.log(
        `🟢 Sessions matched : KPI Session Count: ${sessionKpi}, ChargerExcel Session Count: ${excelSessions}`
    );
}
}
async VerifyUsageKPIWithChargerExcel(filePath4,usageKpi) {
    const {
        excelUsageMW
    } = await this.GetSessionsAndUsageFromChargerExcel(filePath4);
    const USAGEKPI=usageKpi.toFixed(2);

    // Compare Usage (MW) with tolerance
    // const tolerance = 0.2;
    if (USAGEKPI != excelUsageMW) {
        console.log(
            `🔴 Usage mismatch : KPI: ${USAGEKPI}MW, Charger Excel: ${excelUsageMW}MW`
        );
    } else {
    console.log(
        `🟢 Usage matched : KPI usage: ${USAGEKPI}MW, ChargerExcel usage: ${excelUsageMW}MW`
    );
}

}

// Verify Online % from charger Excel vs Dashboard KPI
async verifyOnlinePercentWithExcel(filePath4, OnlineKpi) {
    const avgOnlinePercent =await this.GetAverageOnlinePercentFromExcel(filePath4);
    const excelValue = Number(parseFloat(avgOnlinePercent).toFixed(2));

    if (excelValue !== OnlineKpi) {
      console.log( `🔴 Online Percentage mismatch: KPI ${OnlineKpi}%, Report page Excel Avg ${avgOnlinePercent}%`);
    } else {
      console.log( `🟢 Online Percentage matches KPI: ${OnlineKpi}%, Report Page Excel Avg ${avgOnlinePercent}%`);
      };
  
}

//Navigate to Revenue Page
async SelectSuccessTransactions(){  
await this.SelectSucessTrans.click();
await this.page.waitForTimeout(3000);
await this.SelectSucessTrans.selectOption({ label: "Success" });
await this.page.waitForTimeout(4000);
await this.page.waitForLoadState("networkidle");    
}



// Calendar: select single date
async SelectDate() {

  await this.calendarBtn.click();

  const today = new Date();

  // End date = Yesterday
  const endDate = new Date(today);
  endDate.setDate(today.getDate() - 1);

  // Start date = 7 days before yesterday
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 8);

  const startDay = startDate.getDate();
  const startMonth = startDate.getMonth();
  const startYear = startDate.getFullYear();

  const endDay = endDate.getDate();
  const endMonth = endDate.getMonth();
  const endYear = endDate.getFullYear();

  console.log(`Selecting Range: ${startDay}/${startMonth+1}/${startYear} → ${endDay}/${endMonth+1}/${endYear}`);

  // Select Start Year
  await this.page.locator("select").nth(1).selectOption(String(startYear));

  // Select Start Month
  await this.page.locator("select").nth(0).selectOption(String(startMonth));

  // Click Start Date
  await this.page.locator(`//button[.//div[text()='${startDay}']]`).click();

  // If month changed → update dropdown
  if (startMonth !== endMonth || startYear !== endYear) {

    await this.page.locator("select").nth(1).selectOption(String(endYear));
    await this.page.locator("select").nth(0).selectOption(String(endMonth));

  }

  // Click End Date
  await this.page.locator(`//button[.//div[text()='${endDay}']]`).click();

  // Click Submit
  await this.page.locator("//button[normalize-space()='Submit']").click();

}

// Print Revenue Values
async printRevenueValues() {
  await this.revenue.waitFor({ state: "visible", timeout: 30000 });
  // await this.totalRevenue.waitFor({ state: "visible", timeout: 30000 });
  const RevenueText = await this.revenue.innerText();
  // const totalRevenueText = await this.totalRevenue.innerText();
  console.log("Revenue In Revenue Page:", RevenueText);
  // console.log("Total Revenue:", totalRevenueText);

  return RevenueText
    // totalRevenueText
  
}

async DownloadExcelFile() {
  

  await this.MenuButton.waitFor({ state: "visible", timeout: 20000 });
  await this.MenuButton.click();

  await this.downloadReport.waitFor({ state: "visible", timeout: 20000 });

  // Try normal download first
  try {
    const [download] = await Promise.all([
      this.page.waitForEvent("download", { timeout: 20000 }),
      this.downloadReport.click()
    ]);

    const downloadDir = path.join(__dirname, "downloads");
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }

    const filePath = path.join(downloadDir, "Revenue.xlsx");
    await download.saveAs(filePath, { timeout: 60000 });

    console.log("Excel Downloaded:", filePath);
    return filePath;

  } catch (e) {
    console.log("Download event not fired, checking new tab...");

    const [newPage] = await Promise.all([
      this.page.context().waitForEvent("page"),
      this.downloadReport.click()
    ]);

    await newPage.waitForLoadState("networkidle");

    const response = await this.page.request.get(newPage.url());
    const buffer = await response.body();

    const filePath = path.join(__dirname, "downloads", "Revenue.xlsx");
    fs.writeFileSync(filePath, buffer);

    console.log("Excel Downloaded via new tab:", filePath);
    return filePath;
  }
}



async sumBilledAmountForOrg(filePath4) {
  const workbook = excel.readFile(filePath4);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = excel.utils.sheet_to_json(sheet);
  let total = 0;
  data.forEach(row => {
    const owner = String(row.OWNER || row.Owner || row.owner || "").trim();

    if (owner === "Org") {
      const billed = Number(
        String(row["BILLED AMOUNT"] || row["Billed Amount"] || row["BILLED"] || 0)
          .replace(/[^\d.]/g, "")
      );
      total += billed;
    }
  });
  const formattedTotal = Number(total.toFixed(2));;
  return formattedTotal;
}

//Sum of Revenue(Excel)
// async SumOfRevenue(filePath4) {
//     const wb = excel.readFile(filePath4);
//     const sheet = wb.Sheets[wb.SheetNames[0]];
//     const data = excel.utils.sheet_to_json(sheet, { header: 1 });
//     const rows = data.slice(1);
//     // Excel Usage column index (example: column 9)
//     const RevenueValues = rows
//         .map(row => Number(row[2]))   // change index if needed
//         .filter(v => !isNaN(v));
//    const totalRevenue = RevenueValues.reduce((a, b) => a + b, 0);
//    const formattedTotal = Number(totalRevenue.toFixed(2));
//   //  console.log("Excel Revenue Sum:", formattedTotal);
//    return formattedTotal;
// }

async verifyRevenueFromExcel(filePath4, revenueText, revenueKpi) {
  const Revenue = await this.sumBilledAmountForOrg(filePath4);

  const revenuePageValue = Number(
    revenueText.toString().replace(/[^\d.]/g, "")
  );

  const revenueKpiValue = Number(
    revenueKpi.toString().replace(/[^\d.]/g, "")
  );

  const tolerance = 1; // small tolerance
  let errors = [];

  console.log(`Excel Revenue: ${Revenue}`);

  // Excel vs Page
  if (Math.abs(revenuePageValue - Revenue) > tolerance) {
    errors.push(
      `🔴 Excel Revenue (${Revenue}) does not match Revenue Page value (${revenuePageValue})`
    );
  } else {
    console.log(`🟢 Excel Revenue (${Revenue}) matches Revenue Page Value (${revenuePageValue})`);
  }

  // Excel vs KPI
  if (Math.abs(revenueKpiValue - Revenue) > tolerance) {
    errors.push(
      `🔴 Excel Revenue (${Revenue}) does not match Dashboard(KPI) revenue (${revenueKpiValue})`
    );
  } else {
    console.log(`🟢 Excel Revenue (${Revenue}) matches Dashboard(KPI) Revenue (${revenueKpiValue})`);
  }

  // KPI vs Page
  if (Math.abs(revenueKpiValue - revenuePageValue) > tolerance) {
    errors.push(
      `🔴 Dashboard Revenue (${revenueKpiValue}) does not match Revenue Page value (${revenuePageValue})`
    );
  } else {
    console.log(`🟢 Dashboard(KPI) Revenue (${revenueKpiValue}) matches Revenue Page Value (${revenuePageValue})`);
  }

}
}