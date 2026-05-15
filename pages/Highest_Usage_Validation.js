
import * as excel from "xlsx";
exports.HigUsgPage = class HigUsgPage {

  constructor(page) {
    this.page = page;
    this.UsageDropdown = page.locator("(//*[name()='svg'][@class='feather feather-chevron-down transform duration-500 '])[4]");
    this.DesOption = page.locator("//button[normalize-space()='Descending']");
    this.HigUsageRow = page.locator("//*[@id='scroll_listener']/table/tbody/tr").first();
    this.SessionHistory = page.locator('//*[@id="cms-app-main-content"]/div/div/div[2]/div[2]/div[2]/div[1]/button');
  }

  async UsageFilter() {
    await this.UsageDropdown.click();
    await this.DesOption.click();
   await this.page.waitForTimeout(2000);
    await this.page.waitForLoadState("networkidle");
  }

  async HigUsgRow() {
    const successRow = this.HigUsageRow.first(); 
    await this.HigUsageRow.first().waitFor({ state: "visible", timeout: 20000 }); 
    console.log("Highest Usage Charger Details"); {

    const HigUsgRow = {
    "Charger id": '//*[@id="scroll_listener"]/table/tbody/tr[1]/td[2]/div/button/div/button/p',
    "Sessions":'//*[@id="scroll_listener"]/table/tbody/tr[1]/td[4]/div',
    "Usage":'//*[@id="scroll_listener"]/table/tbody/tr[1]/td[5]/div',
    "Avg Utilization":'//*[@id="scroll_listener"]/table/tbody/tr[1]/td[6]/div',
    "Host Details":'//*[@id="scroll_listener"]/table/tbody/tr[1]/td[12]/div/div',
    "Hub Name":'//*[@id="scroll_listener"]/table/tbody/tr[1]/td[9]/div/div',
       };

  
   const extractedTexts = {};
   for (const [key, selector] of Object.entries(HigUsgRow)) {
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
  await this.HigUsageRow.click();
  await this.page.waitForLoadState("networkidle"); 
  return extractedTexts;
}
  }

async SesHistory() {
    await this.page.waitForTimeout(2000);
    await this.SessionHistory.click();
    await this.page.waitForTimeout(3000);
    await this.page.waitForLoadState("networkidle");
  }

async countExcelSessions(filePath) {
      const wb = excel.readFile(filePath);
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const data = excel.utils.sheet_to_json(sheet, { header: 1 }); 
      const rows = data.slice(1);
      const sessionIDs = rows
          .map(r => r[1])     
          .filter(id => id);
      return sessionIDs.length;
  }

async verifySessionCounts(filePath, Sessions) {
    const excelCount = await this.countExcelSessions(filePath);
    // let errors = [];
    if (Number(Sessions) !== Number(excelCount)) {
        console.log(
            `🛑 Sessions count of the Highest Usage Charger mismatch → UI: ${Sessions}, Excel: ${excelCount}`
        );
    }
   
        else {
        console.log(
            `🟢 Sessions count of the Highest Usage Charger matches → UI: ${Sessions}, Excel: ${excelCount}`
         );
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

async verifyUsage(filePath,Usage) {
    //Sum usage from Excel (kWh)
    const excelUsageKwh = await this.SumOfUsage(filePath);
    //Round Excel MWh to 2 decimals
    const excelUsage = Number(excelUsageKwh.toFixed(2));
    console.log(`Session Excel Usage (kWh): ${excelUsage}`);
    console.log(`Highest Usage (kWh): ${Usage}`);
    //Allowed buffer/tolerance (0.2 MWh)
    const tolerance = excelUsage * 0.05;
    // let errors = [];
    //Check if values differ beyond tolerance
    if (Math.abs(Usage - excelUsage) === 0) {
        console.log(`🟢 Highest Usage in the charger page (${Usage} kwh) matches session Excel Usage (${excelUsage} kwh)`);
    }
    else if (Math.abs(Usage - excelUsage) <= tolerance) {
        console.log(`🟡 Highest Usage in the charger page (${Usage} kwh) matches session Excel Usage (${excelUsage} kwh) --within ±5% tolerance`);
    }
    else {
        console.log(
            `🛑 Highest Usage in the charger page (${Usage} kwh) does NOT match session Excel Usage (${excelUsage} kwh)`);
    }

    //Return result
    // if (errors.length === 0) {
    //     return {
    //         success: true,
    //         excelUsage,
    //         message:  ` Highest Usage in the charger page (${Usage} kWh) matches session Excel Usage (${excelUsage} kWh) --within ±5% tolerance`
    //     };
    // } else {
    //     console.log( `🔴 Highest Usage in the charger page (${Usage} kWh) does NOT match session Excel Usage (${excelUsage} kWh)`);
    //     errors.forEach(e => console.log("" + e));
    //     return {
    //         success: false,
    //         excelUsage,
    //         message: errors.join(" | ")
    //     };
    // }
}

}

