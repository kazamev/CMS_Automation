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
    await this.reportDropdown.waitFor({ timeout: 30000 });
    await this.reportDropdown.selectOption(value);
    await this.page.waitForTimeout(2000);
  }

  //select date from kazam calendar
  async selectKazamCalendarDate(userDate) {
    const [day, month, year] = userDate.split("/");
    await this.page.selectOption(
      "select.focus\\:ring-0.focus\\:outline-none.border-none.p-1:nth-of-type(1)",
      year
    );
    await this.page.selectOption(
      "select.focus\\:ring-0.focus\\:outline-none.border-none.p-1:nth-of-type(2)",
      String(Number(month) - 1)
    );
    const dayBtn = this.page.locator(
      `//button[.//div[text()='${Number(day)}']]`
    );
    await dayBtn.click();
    await dayBtn.click();
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
    await this.page.waitForTimeout(2000);
    await this.sessionCheckbox.waitFor({ state: "visible" });
    const isChecked = await this.sessionCheckbox.isChecked();
    if (!isChecked) {
      await this.sessionCheckbox.click();
    } else {
      console.log("Sessions checkbox is already checked.");
    } 
    await this.UsageColumnCheckbox.waitFor({ state: "visible" });
    const isUsageChecked = await this.UsageColumnCheckbox.isChecked(); 
    if (!isUsageChecked) {
      await this.UsageColumnCheckbox.click();
    } else {
      console.log("Usage checkbox is already checked.");
    } 
    await this.page.waitForTimeout(2000);
    await this.ApplyBtn.click();  
    await this.page.waitForLoadState("networkidle");     
  }



  //download daily report
  async downloadDailyReport(fileName) {
  const downloadPromise = this.page.waitForEvent("download", {
    timeout: 90000,
  });

  const downloadBtn = this.page.locator(
    "//button[normalize-space()='Generate Report']"
  );

  await downloadBtn.waitFor({ timeout: 60000 });
  await downloadBtn.click();
  await this.page.waitForTimeout(2000);

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
        .map(row => Number(row[13]))   // change index if needed
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
        .map(row => Number(row[14]))   // change index if needed
        .filter(v => !isNaN(v));
   const totalUsage = usageValues.reduce((a, b) => a + b, 0);
   const formattedTotal = Number(totalUsage.toFixed(2));
   return formattedTotal;
}


//Revenue Tab Click
async RevenueClick() {
  await this.RevenueTab.waitFor({ state: "visible" });
  await this.RevenueTab.click();
  await this.page.waitForTimeout(2000);
}

//download daily report
// async downloadDailyReport(fileName) {
//   const downloadPromise = this.page.waitForEvent("download", {
//     timeout: 90000,
//   });

//   await this.generateBtn.waitFor({ timeout: 60000 });
//   await this.generateBtn.click();
//   await this.page.waitForTimeout(2000);

//   const download = await downloadPromise;

//   const downloadDir = path.join(__dirname, "../downloads");
//   if (!fs.existsSync(downloadDir)) {
//     fs.mkdirSync(downloadDir);
//   }

//   const filePath = path.join(downloadDir, fileName);
//   await download.saveAs(filePath);

//   return filePath;
// }


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

  // Handle Jan to Dec of previous year
  if (targetMonthIndex < 0) {
    targetMonthIndex = 11;
    targetYear -= 1;
  }

  const targetMonth = monthNames[targetMonthIndex];
  //LOCATORS
  const yearLabel = this.page.locator("//span[@class='font-semibold text-lg text-gray-900']");
  const prevYearBtn = this.page.locator("//button[normalize-space()='<']");
  const nextYearBtn = this.page.locator("//button[normalize-space()='>']");
  const monthBtn = this.page.locator(`//button[normalize-space()='${targetMonth}']`);

  //ADJUST YEAR
  let displayedYear = Number((await yearLabel.innerText()).trim());
  while (displayedYear > targetYear) {
    await prevYearBtn.click();
    await this.page.waitForTimeout(2000);
    displayedYear = Number((await yearLabel.innerText()).trim());
  }

  while (displayedYear < targetYear) {
    await nextYearBtn.click();
    displayedYear = Number((await yearLabel.innerText()).trim());
  }

  //SELECT MONTH
  await monthBtn.waitFor({ timeout: 10000 });
  await monthBtn.click();
  await this.page.waitForTimeout(2000);
  console.log(`Selected Previous Month: ${targetMonth} ${targetYear}`);
  await this.page.waitForTimeout(2000);
}

}
