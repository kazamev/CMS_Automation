import fs from "fs";   
import path from "path";
import * as excel from "xlsx";
export class RevenuePage {
  constructor(page) {
    this.page = page;

    // URL
    this.revenueUrl ="https://novo.kazam.in/org/zynetic_electric_vehicle_charging_llc/7aff5403-3de3-4273-9665-099574cf2048/cpo/revenue_management/overview";
    this.DashboardrevenueValue = page.locator("(//p[@class='text-base font-medium'])[1]");
    this.revenue = page.locator("(//span[@class='text-2xl'])[1]");
    this.totalRevenue = page.locator("(//span[@class='text-2xl'])[3]");
    this.Dashboardurl="https://novo.kazam.in/org/zynetic_electric_vehicle_charging_llc/7aff5403-3de3-4273-9665-099574cf2048/cpo"

    // Calendar
    this.calendarBtn = page.locator("button[type='submit']");

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

async DashBoardURL(){
  await this.page.goto(this.Dashboardurl);
  await this.page.waitForLoadState("networkidle")
}

//time filter in Dashboard
async applyTimeFilterInDashboard(period) {
    await this.DashBoardTimeFilter.click();

//Locate the option dynamically
   const option = this.page.locator(`//div[contains(@class,'flex')]//div[normalize-space(text())='${period}']`);
    await option.waitFor();
    await option.click();
    await this.page.waitForLoadState("networkidle");
}
//Dashboard Revenue
async getDashboardRevenue() {
await this.DashboardrevenueValue.waitFor({ state: "visible" });

const text = await this.DashboardrevenueValue.innerText();
const DashboardRevenue = Number(text.replace(/[^\d.]/g, ""));

console.log("DashboardRevenue:", DashboardRevenue);
return DashboardRevenue;
}
// Navigate to Revenue Page
async goto() {

    await this.page.goto(this.revenueUrl);
    await this.page.waitForLoadState("networkidle");
  }

// Print Revenue Values
async printRevenueValues() {
  await this.revenue.waitFor({ state: "visible", timeout: 30000 });
  await this.totalRevenue.waitFor({ state: "visible", timeout: 30000 });
  const revenueText = await this.revenue.innerText();
  const totalRevenueText = await this.totalRevenue.innerText();
  console.log("Revenue:", revenueText);
  console.log("Total Revenue:", totalRevenueText);

  return {
    revenueText,
    totalRevenueText
  };
}

// Calendar: select single date
async selectSingleDate(day) {
  await this.calendarBtn.click();
  const dateBtn = this.page.locator(`//div[normalize-space()='${day}']`);

  await dateBtn.waitFor({ timeout: 30000 });
  await dateBtn.click();
  await dateBtn.click();
  await this.submitDateBtn.click();
}
  // Calendar: select full month
  // async selectFullMonth(year, monthIndex) {
  //   await this.calendarBtn.click();
  //   await this.yearSelect.selectOption(year.toString());
  //   await this.monthSelect.selectOption(monthIndex.toString());
  //   const lastDay = new Date(year, monthIndex + 1, 0).getDate();
  //   await this.page.click("//button[normalize-space()='1']");
  //   await this.page.click(`//button[normalize-space()='${lastDay}']`);
  // }

async openSuccessTransactionAndGetOverview() {
  const successRow = this.page.locator("//div[contains(@class,'cursor-pointer')]").filter({ hasText: "Success" }).first();

// wait for overview to load (Transaction ID appears)
await this.page.locator("body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) span").first().waitFor({ state: "visible", timeout: 20000 });
  // await this.page.waitForTimeout(1000);
  const overviewSelectors = {
    "Transaction id":
      "body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > span:nth-child(2)",

    "Billed Amount":
      "body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3)",

    "Host Details":
      "body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(9) > span:nth-child(1) > span:nth-child(1)",

    "Driver Details":
      "body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(10) > span:nth-child(1)",

    "Time stamp":
      "body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(11) > span:nth-child(1)",
  };

  const extractedTexts = {};

  for (const [key, selector] of Object.entries(overviewSelectors)) {
    const elements = await this.page.$$(selector);
    const values = [];

    for (const element of elements) {
      const text = await element.textContent();
      const trimmedText = String(text).trim();
      console.log(`${key}: ${trimmedText}`);
      values.push(trimmedText);
    }

    extractedTexts[key] = values;

  }
  return extractedTexts;
}

// Download Report
  async downloadReportFile() {
    await this.downloadReport.click();
  }

async downloadExcelFile() {
  console.log("Starting Excel download");

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



//Sum of Revenue(Excel)
async sumOfRevenue(filePath4) {
    const wb = excel.readFile(filePath4);
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

//Validation
async verifyRevenueFromExcel(filePath4, revenueText, DashboardRevenue) {
  const Revenue = await this.sumOfRevenue(filePath4);
  const revenuePageValue = Number(
    revenueText.replace(/[^\d.]/g, "")
  );
  console.log(`Excel Revenue: ${Revenue}`);
  console.log(`Revenue In Revenue Page: ${revenuePageValue}`);
  console.log(`Dashboard Revenue: ${DashboardRevenue}`);
  let errors = [];
  if (Math.abs(revenuePageValue - Revenue) > 1.0) {
    errors.push(
      `Excel Revenue (${Revenue}) does not match Revenue Page value (${revenuePageValue})`
    );
  }
  if (Math.abs(DashboardRevenue - Revenue) > 1.0) {
    errors.push(
      `Dashboard Revenue (${DashboardRevenue}) does NOT match Excel revenue (${Revenue})`
    );
  } else {
    console.log(
      `Dashboard Revenue matched Excel Revenue → ${DashboardRevenue}`
    );
  }

  if (errors.length === 0) {
    return { success: true, message: "Revenue values matched successfully" };
  }
  console.log("Revenue mismatch found:");
  errors.forEach(e => console.log(e));
  return { success: false, message: errors.join(" | ") };
}
}

















