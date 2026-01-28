import { expect } from "@playwright/test";
import fs from "fs";
import path from "path";
import * as excel from "xlsx";

export class DailyReportsPage {
  constructor(page) {
    this.page = page;
    this.RevenueTab = page.locator("//button[normalize-space()='Revenue']");
    this.EditTable= page.locator("//button[normalize-space()='Table Fields']");
    this.sessionCheckbox= page.locator("//input[@id='device_sessions']");
    this.ApplyBtn= page.locator("//button[normalize-space()='Apply']");
    this.MonthlyReportsTab = page.locator("//button[normalize-space()='Monthly Report']");
    this.UsageColumnCheckbox =page.locator("//input[@id='device_usage']");


    this.url =
      "https://novo.kazam.in/org/zynetic_electric_vehicle_charging_llc/7aff5403-3de3-4273-9665-099574cf2048/cpo/reports/daily-reports";

    this.reportDropdown = page.locator("//div[@class='grid gap-2']//select[1]");
    this.generateBtn = page.locator("//button[normalize-space()='Generate Report']");
  }


  //DAILY REPORTS PAGE
  async openDailyReportsPage() {
    await this.page.goto(this.url, { waitUntil: "networkidle" });
    await this.page.waitForTimeout(2000);
  }

  //select report from dropdown
  async selectReportDropdown(value) {
  await this.reportDropdown.waitFor({ state: "visible", timeout: 20000 });
  await this.reportDropdown.selectOption(value);

  // wait for Generate Report button to be enabled after dropdown change
  await this.generateBtn.waitFor({ state: "visible", timeout: 20000 });
}

//select date from kazam calendar
  async selectKazamCalendarDate(userDate) {
  const [day, month, year] = userDate.split("/");

  const yearSelect = this.page.locator(
    "select.focus\\:ring-0.focus\\:outline-none.border-none.p-1:nth-of-type(1)"
  );
  const monthSelect = this.page.locator(
    "select.focus\\:ring-0.focus\\:outline-none.border-none.p-1:nth-of-type(2)"
  );

  await yearSelect.waitFor({ state: "visible" });
  await yearSelect.selectOption(year);
  await monthSelect.selectOption(String(Number(month) - 1));

  const dayBtn = this.page.locator(
    `//button[.//div[text()='${Number(day)}']]`
  );

  await dayBtn.waitFor({ state: "visible" });
  await dayBtn.dblclick(); // replaces two clicks
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
   const totalUsage = usageValues.reduce((a, b) => a + b, 0);
   const formattedTotal = Number(totalUsage.toFixed(2));
   return formattedTotal;
}


//edit table fields
  async editTableFields() {
  await this.EditTable.waitFor({ state: "visible" });
  await this.EditTable.click();

  // await this.sessionCheckbox.waitFor({ state: "visible" });
  // await this.sessionCheckbox.scrollIntoViewIfNeeded();
  // if (!(await this.sessionCheckbox.isChecked())) {
  //   await this.sessionCheckbox.click();
  // }

  // await this.UsageColumnCheckbox.waitFor({ state: "visible" });
  // await this.UsageColumnCheckbox.scrollIntoViewIfNeeded();
  // if (!(await this.UsageColumnCheckbox.isChecked())) {
  //   await this.UsageColumnCheckbox.click();
  // }

  await this.ApplyBtn.waitFor({ state: "visible" });
  await this.ApplyBtn.click();

  await this.page.waitForLoadState("networkidle");
}

//download daily report
async downloadDailyReport(fileName) {
    //listener BEFORE clicking
    const downloadPromise = this.page.waitForEvent("download", { timeout: 30000 });
    const downloadBtn = this.page.locator("//button[normalize-space()='Generate Report']");
    
    //Click the button
    await downloadBtn.click();

    // 3. Await the download (No sleep needed, waitForEvent handles the wait)
    const download = await downloadPromise;

    const downloadDir = path.join(__dirname, "../downloads");
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir);
    }

    const filePath = path.join(downloadDir, fileName);
    await download.saveAs(filePath);

    return filePath;
  }

//count sessions in Sessions report)
  async countTxnIdsDailyReport(filePath) {
    const wb = excel.readFile(filePath);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const data = excel.utils.sheet_to_json(sheet);
    return data.length;
  }

//count sessions in chargers report
  async countSessionsInChargersReport(filePath) {
    const wb = excel.readFile(filePath);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const data = excel.utils.sheet_to_json(sheet, { header: 1 });
    const rows = data.slice(1);
    const RevenueValues = rows
        .map(row => Number(row[2]))   // change index if needed
        .filter(v => !isNaN(v));
   const totalRevenue = RevenueValues.reduce((a, b) => a + b, 0);
   return totalRevenue;
  }

async sumOfUsageInChargerReport(filePath) {
    const wb = excel.readFile(filePath);
    const sheet = wb.Sheets[wb.SheetNames[0]]; 
    const data = excel.utils.sheet_to_json(sheet, { header: 1 });
    const rows = data.slice(1); 
    // Excel Usage column index (example: column 9)
    const usageValues = rows
        .map(row => Number(row[3]))   // change index if needed
        .filter(v => !isNaN(v));
   const totalUsage = usageValues.reduce((a, b) => a + b, 0);
   const formattedTotal = Number(totalUsage.toFixed(2));
   return formattedTotal;
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

//Sum of Revenue(Excel)
async sumOfRevenue(filePath) {
    const wb = excel.readFile(filePath);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const data = excel.utils.sheet_to_json(sheet, { header: 1 });
    const rows = data.slice(1);
    // Excel Usage column index (example: column 9)
    const RevenueValues = rows
        .map(row => Number(row[2]))   // change index if needed
        .filter(v => !isNaN(v));
   const totalRevenue = RevenueValues.reduce((a, b) => a + b, 0);
   const formattedTotal = Number(totalRevenue.toFixed(2));
  //  console.log("Excel Revenue Sum:", formattedTotal);
   return formattedTotal;
}


//sum of usage in chargers report
async sumOfUsageInRevenueReport(filePath) {
    const wb = excel.readFile(filePath);
    const sheet = wb.Sheets[wb.SheetNames[0]]; 
    const data = excel.utils.sheet_to_json(sheet, { header: 1 });
    const rows = data.slice(1); 
    // Excel Usage column index (example: column 9)
    const usageValues = rows
        .map(row => Number(row[13]))   // change index if needed
        .filter(v => !isNaN(v));
   const totalUsage = usageValues.reduce((a, b) => a + b, 0);
   const formattedTotal = Number(totalUsage.toFixed(2));
   return formattedTotal;
}


//Monthly Report Tab Click
async MonthlyReport(){  
  await this.MonthlyReportsTab.waitFor({ state: "visible" });
   await this.MonthlyReportsTab.click();
   await this.page.waitForLoadState("networkidle");
}

//Select Previous Month
async selectPreviousMonth() {
    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const today = new Date();
    let targetMonthIndex = today.getMonth() - 1;
    let targetYear = today.getFullYear();

    if (targetMonthIndex < 0) {
        targetMonthIndex = 11;
        targetYear -= 1;
    }

    const targetMonth = monthNames[targetMonthIndex];

    const yearLabel = this.page.locator("//span[@class='font-semibold text-lg text-gray-900']");
    const prevYearBtn = this.page.locator("//button[normalize-space()='<']");
    const monthBtn = this.page.locator(`//button[normalize-space()='${targetMonth}']`);

    await yearLabel.waitFor({ state: "visible", timeout: 20000 });

    let displayedYear = Number((await yearLabel.textContent()).trim());

    while (displayedYear > targetYear) {
        await prevYearBtn.click();

        // FIX STARTS HERE
        // Instead of waitForFunction, we wait until the text is NO LONGER the old year
        await expect(yearLabel).not.toHaveText(String(displayedYear), { timeout: 5000 });
        // FIX ENDS HERE

        displayedYear = Number((await yearLabel.textContent()).trim());
    }

    await monthBtn.waitFor({ state: "visible", timeout: 10000 });
    await monthBtn.click();

    console.log(`Selected Previous Month: ${targetMonth} ${targetYear}`);
}
}