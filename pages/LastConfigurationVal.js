import { test, expect } from "../fixtures/login.fixture";
export class LastConfigurationVal {

    constructor(page) {
        this.page = page;

        this.LastConfigValue = page.locator("//*[@id='cms-app-main-content']/div/div/div[2]/div[2]/div[1]/div[5]/p");
        this.ReconfigurationIcon = page.locator("//button[@class='flex items-center justify-center']//*[name()='svg']");
        this.ReconfigurationDate = page.locator("//*[@id='cms-app-main-content']/div/div/section/div/div[3]/div[2]/span/span[2]");
        this.CloseBtn = page.locator("(//*[name()='path'][@clip-rule='evenodd'])[1]");
        this.ChargerRow = page.locator("//*[@id='scroll_listener']/table/tbody/tr[1]");

    }

async ClickOnFirstCharger() {
    await this.ChargerRow.click();
    await this.page.waitForLoadState("networkidle") 
    await this.page.waitForTimeout(3000);
  }

async getLastConfigurationValue() {
    const lastConfigDate = await this.LastConfigValue.textContent();
    await this.page.waitForTimeout(3000);
    return lastConfigDate;
  }

async getChargerId() {
    const chargerId = await this.page.locator("(//p[@class='font-medium text-sm'])[1]").textContent();
    console.log("Charger ID: ", chargerId);
    return chargerId;
  }

async getLastConfigurationValueInCharger() {
    await this.ReconfigurationIcon.click();
    await this.page.waitForTimeout(3000);
    const ReconfigurationDate = await this.ReconfigurationDate.textContent();
    await this.CloseBtn.click();
    await this.page.waitForTimeout(3000);
    return ReconfigurationDate;
  }


async ValidateLastConfigurationValue(lastConfigDate,ReconfigurationDate) {
  const normalize = (dateStr) => {if (!dateStr) return "";
    let cleaned = dateStr.replace(",", "").trim();

    //Remove ONLY seconds (HH:MM:SS → HH:MM)
    cleaned = cleaned.replace(/(\d{1,2}:\d{2}):\d{2}(\s?[AP]M)/,"$1$2");

    //If minutes missing (11 AM → 11:00 AM)
    if (/^\d{2}\/\d{2}\/\d{4}\s\d{1,2}\s?[AP]M$/.test(cleaned)) {
      cleaned = cleaned.replace(/(\d{1,2})(\s?[AP]M)/, "$1:00 $2");
    }
    return cleaned;
  };

  const normalizedLast = normalize(lastConfigDate);
  const normalizedReconfig = normalize(ReconfigurationDate);

  //Assertion
  expect(normalizedLast, "Last Configuration Date mismatch").toBe(normalizedReconfig);
  console.log("Last Configuration Date is consistent across pages.");

}
}
