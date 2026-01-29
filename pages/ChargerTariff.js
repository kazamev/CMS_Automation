export class ChargerTariffPage {
  constructor(page) {
    this.page = page;

    // URL
    this.tariffUrl ="https://novo.kazam.in/org/Tyagi_Org/1b8d6bd0-22f5-4cd5-b794-1ce364573a30/cpo/revenue_management/tariffs";

    // Locators
    this.createTariffBtn = page.locator("//button[normalize-space()='Create Tariff']");
    this.tariffNameInput = page.locator("//input[@placeholder='Enter tariff name']");
    this.startDateCalendar = page.locator("//div[@class='p-2 px-4 cursor-pointer']//*[name()='svg']");
    this.endDateCalendar = page.locator("(//*[name()='path'])[21]");
    this.FixedtariffBtn = page.locator("(//button[@type='button'])[1]");
    this.nextBtn = page.locator("//button[normalize-space()='Next']");
    this.amountInput = page.locator("//input[contains(@placeholder,'Enter Amount')]");
    this.addPriceBtn = page.locator("//button[normalize-space()='Add Price']");
    this.searchChargerInput = page.locator("(//input[@placeholder='Search'])[1]");
    this.linkCheckbox = page.locator("(//input[@id='link-checkbox'])[2]");
    this.reviewDetailsDiv = page.locator("(//div[contains(@class,'flex flex-col gap-4')])[1]");
    this.createBtn = page.locator("//button[text()='Create']");
    this.detailsAfterCreateDiv = page.locator("(//div[@class='w-full h-full border border-kazamGray-200 rounded-md ml-2 p-6 flex flex-col gap-10 overflow-auto'])[1]");
  
    // this.updateBtn = page.locator("//button[normalize-space()='Update']");
    // this.fierstNext=page.locator("//button[normalize-space()='Next']")

    //tariff deletion
    this.searchAfterCreateInput = page.locator("(//input[contains(@placeholder,'Search')])[1]");
    this.editIcon = page.locator("//div[@class='edit-button cursor-pointer']//*[name()='svg']");
    this.fierstNext=page.locator("//button[normalize-space()='Next']")
    this.linkCheckbox = page.locator("(//input[@id='link-checkbox'])[2]");
    this.nextBtn = page.locator("//button[normalize-space()='Next']");
    this.updateBtn = page.locator("//button[normalize-space()='Update']");
    this.dltbut=page.locator("//div[@class='delete-button cursor-pointer']//*[name()='svg']");
    this.yesbtn=page.locator("//button[normalize-space()='Yes']");

  }

  // Navigate to Tariff Page(Revenue)
  async navigate() {
    await this.page.goto(this.tariffUrl, { waitUntil: "networkidle" });
  }

  // Create new tariff
  async createTariff(tariffName) {
    console.log("Start Charger Tariff Creation");
    await this.createTariffBtn.click();
    await this.tariffNameInput.fill(tariffName);
    await this.page.waitForTimeout(2000)
  }

  async selectStartAndEndDate() {
  const today = new Date();
  const startDate = today.getDate();
  const endDateObj = new Date();
  endDateObj.setDate(today.getDate() + 3);
  const endDate = endDateObj.getDate();
  const isNextMonth =
    today.getMonth() !== endDateObj.getMonth() ||
    today.getFullYear() !== endDateObj.getFullYear();

  //START DATE (Today)
  await this.startDateCalendar.click();
   await this.page.waitForTimeout(2000)
  await this.page.locator(`//button[normalize-space()='${startDate}'] | //div[normalize-space()='${startDate}']`).first().click();
   await this.page.waitForTimeout(2000)

//   //END DATE (Today + 3 Days)
//   await this.endDateCalendar.click();
//   await this.page.locator(
//     //button[normalize-space()='${endDate}'] | //div[normalize-space()='${endDate}']
//   ).first().click();

//   // If end date is in next month - move calendar
//   if (isNextMonth) {
//     await this.page.locator(
//       "//button[@aria-label='Next Month'] | //svg[contains(@class,'chevron-right')]"
//     ).first().click();
//   }

//   await this.page.locator(
//     //button[normalize-space()='${endDate}'] | //div[normalize-space()='${endDate}']
//   ).first().click();



// Continue flow
  await this.FixedtariffBtn.click();
  await this.page.waitForTimeout(2000)
  await this.fierstNext.click();
}

// Add tariff Price
async addPrice(amount) {  
    await this.amountInput.fill(amount);
    await this.page.waitForTimeout(2000)
    // await this.addPriceBtn.click();
    await this.nextBtn.click();
  }

  // Search and link charger
  async searchAndLinkCharger(chargerId) {
  await this.searchChargerInput.fill(chargerId);
     
    if (await this.linkCheckbox.isVisible()) {
      // console.log("Charger present:", chargerId);
      await this.linkCheckbox.check();
    } else {
      console.log("Charger not found:", chargerId);
    }
    await this.nextBtn.click();
  }

  // Get review and confirm details as table
 async getReviewAndConfirmDetailsAsTable(title = "Review & Confirm Tariff Details") {
const container = this.page.locator("//div[contains(@class,'rounded') and .//text()='Pricing Details']");
  await container.waitFor({ timeout: 30000 });
  // Get all visible text blocks
  const text = (await container.innerText())
    .split("\n")
    .map(t => t.trim())
    .filter(Boolean);
  const table = [];
  for (let i = 0; i < text.length; i++) {
    const key = text[i];
    const value = text[i + 1];

    // stop before next sections
    if (["Pricing Details", "Asset Selection"].includes(key)) continue;
   
    if (
      ["Name", "Description", "Tariff Type", "Validity", "Price Type", "Amount", "Chargers"]
        .includes(key)
    ) {
      table.push({
        Field: key,
        Value: value ?? "N/A"
      });
      i++;
    }
  }
  console.log(`\ ${title}`);
  console.table(table);
  return table;
}
 
// Final create tariff
async createTariffFinal() {
  await this.createBtn.click();
  await this.page.waitForTimeout(2000)
  console.log("Charger Tariff Created Successfully");
}

//charger tariff deletion
async deleteTariff(tariffName) {
  // Search
  await this.searchAfterCreateInput.fill(tariffName);
  await this.page.waitForTimeout(2000)
  // Click tariff card
 await this.page.locator(`//div[contains(@class,'border')][.//text()[contains(normalize-space(), "${tariffName}")]]`).first().click();

  await this.editIcon.click();
  await this.page.waitForTimeout(2000)
  await this.nextBtn.click();
  await this.page.waitForTimeout(2000)
  await this.nextBtn.click();
  await this.page.waitForTimeout(2000)
  await this.linkCheckbox.uncheck();
  await this.page.waitForTimeout(2000);
  await this.nextBtn.click();
  await this.page.waitForTimeout(2000);
  await this.updateBtn.click();
  await this.page.waitForTimeout(2000);
  await this.dltbut.click();
  await this.page.waitForTimeout(2000);
  await this.yesbtn.click();
  await this.page.waitForTimeout(2000);
  
}
}
