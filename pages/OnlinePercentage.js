import fs from "fs";
import path from "path";
import * as excel from "xlsx";

export class OnlinePercentagePage {
constructor(page) {
        this.page = page;

        // Online percentage
        this.onlinePercent = page.locator("(//p[@class='text-base font-medium'])[4]");
        this.downloadButton = page.locator("//div[@id='download']//*[name()='svg']");
        this.excelOption = page.locator("(//div[@class='flex items-center gap-2 m-1 hover:bg-kazamGray-100 p-2 rounded-md'])[2]");
        this.DashBoardTimeFilter= page.locator("//button[@class='w-full flex gap-1 items-center bg-black py-2 px-3 border rounded-md bg-white']");

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


async getOnlinePercentage() {
       const onlineText = await this.onlinePercent.textContent();
       const OnlineKpi = Number(onlineText.replace(/[^0-9.]/g, ""));
       return OnlineKpi;
    }


async  clickOnlinePercentage() {
    await this.onlinePercent.click();
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(8000);
  }

async downloadExcel() {
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
    const filePath = path.join(downloadDir, "Chargers.xlsx");
    await download.saveAs(filePath);
    console.log("Excel Downloaded ", filePath);
    return filePath;
}


async getAverageOnlinePercentFromExcel(filePath) {
  if (!filePath) {
    throw new Error("Excel file path is undefined for Online % calculation");
  }
  const wb = excel.readFile(filePath);
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


async verifyOnlinePercentWithExcel(filePath, OnlineKpi) {
  try {
    const avgOnlinePercent = await this.getAverageOnlinePercentFromExcel(filePath); 
    console.log("Average Online Percent from Excel:", avgOnlinePercent);
    const difference = Math.abs(avgOnlinePercent - OnlineKpi);

    const tolerance = 1.0; // 1% tolerance
    if (difference <= tolerance) {
      return {
        success: true,
        message: `Online Percentage matches KPI: ${OnlineKpi}%, Excel Avg: ${avgOnlinePercent}%`
      };
    } else {
      return {
        success: false,
        message: `Online Percentage mismatch! KPI: ${OnlineKpi}%, Excel Avg: ${avgOnlinePercent}%`
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Error verifying Online Percentage: ${error.message}`
    };
  }         
    } 
}
