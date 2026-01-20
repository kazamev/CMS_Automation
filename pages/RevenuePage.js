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

    //Invoice Search
    this.Invoicefirstclick = page.locator("//div[@class='flex flex-col w-full h-full relative']//div[1]//div[1]//div[1]//button[1]//*[name()='svg']");
    this.InvoiceDownload= page.locator("//*[@id='cms-app-main-content']/div/div[2]/div[2]/div[2]/div/div/div[2]/div[1]/div[2]/div[2]/p[2]/button");

    
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

async downloadInvoiceFile() {
  const successRow = this.page.locator("//div[contains(@class,'cursor-pointer')]").filter({ hasText: "Success" }).first();
  // wait for overview to load (Transaction ID appears)
await this.page.locator("body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) span").first().waitFor({ state: "visible", timeout: 20000 });
  // await this.page.waitForTimeout(1000);
    await this.Invoicefirstclick.click();
    await this.page.waitForTimeout(2000);
    await this.InvoiceDownload.click();
    await this.page.waitForTimeout(8000);
  // Data from the invoice page
          const invoiceSelectors = {
            "Transaction id":
              "body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(4) > div:nth-child(1) > div:nth-child(2) > p:nth-child(2) > span:nth-child(1)",
            "Billed Amount":
              "div[class='flex items-center justify-between'] span[class='font-mono']",
            "Host Details":
              "body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > p:nth-child(2)",
            "Driver Details":
              "body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > p:nth-child(2)",
            "Time stamp": "p[class='text-black'] span[class='text-gray-600']",
          };
          const ExtractedTexts = {};

          for (const [key, selector] of Object.entries(invoiceSelectors)) {
    const elements = await this.page.$$(selector);
    const values = [];

    for (const element of elements) {
      const text = await element.textContent();
      const trimmedText = String(text).trim();
      console.log(`${key}: ${trimmedText}`);
      values.push(trimmedText);
       }
       ExtractedTexts[key] = values;
          }
          return ExtractedTexts;
  }

async compareOverviewWithInvoice(overviewData, invoiceData) {
  const keysToCompare = ["Transaction id", "Billed Amount", "Host Details", "Driver Details", "Time stamp"];
  let mismatchFound = false;
  const results = [];

  console.log("\n Comparison Report");

  for (const key of keysToCompare) {
    let overviewVal = (overviewData[key] ? overviewData[key][0] : "NOT FOUND").trim();
    let invoiceVal = (invoiceData[key] ? invoiceData[key][0] : "NOT FOUND").trim();

    let isMatch = false;

    if (key === "Driver Details") {
      // Remove dashes and extra spaces: "Limousine - 123" -> "Limousine 123"
      const clean = (val) => val.replace(/[-\s]+/g, " ").trim();
      isMatch = clean(overviewVal) === clean(invoiceVal);
    } 
    else if (key === "Time stamp") {
      // Convert both strings to Date objects to compare actual time
      // Overview: "14/01/2026 11:56:01 pm"
      // Invoice: "Jan 14 2026, 11:56:01 pm"
      const dateO = new Date(overviewVal.replace(/\//g, "-")); 
      const dateI = new Date(invoiceVal.replace(/,/g, ""));
      
      isMatch = dateO.getTime() === dateI.getTime();
      
      // Fallback: If Date object fails, check if time part matches
      if (!isMatch) {
          const timeO = overviewVal.match(/\d{2}:\d{2}:\d{2}/);
          const timeI = invoiceVal.match(/\d{2}:\d{2}:\d{2}/);
          isMatch = timeO && timeI && timeO[0] === timeI[0];
      }
    } 
    else if (key === "Billed Amount") {
      // Remove currency symbols and compare numbers
      const numO = overviewVal.replace(/[^0-9.]/g, "");
      const numI = invoiceVal.replace(/[^0-9.]/g, "");
      isMatch = numO === numI;
    } 
    else {
      // Exact match for other fields
      isMatch = overviewVal === invoiceVal;
    }

    if (isMatch) {
      results.push(`${key}: MATCHED`);
    } else {
      results.push(`${key}: MISMATCH! (Overview: "${overviewVal}" vs Invoice: "${invoiceVal}")`);
      mismatchFound = true;
    }
  }

  results.forEach(res => console.log(res));

  return { 
    success: !mismatchFound, 
    message: mismatchFound ? "Mismatch found" : "Invoice and Overview are same" 
  };
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

















