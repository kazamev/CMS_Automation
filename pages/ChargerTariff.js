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
    this.searchChargerInput = page.locator("//div[contains(@class,'flex gap-x-4')]//input[contains(@placeholder,'Search')]");
    this.linkCheckbox = page.locator("(//input[@id='link-checkbox'])[2]");
    this.reviewDetailsDiv = page.locator("(//div[contains(@class,'flex flex-col gap-4')])[1]");
    this.createBtn = page.locator("//button[text()='Create']");
    this.searchAfterCreateInput = page.locator("(//input[contains(@placeholder,'Search')])[1]");
    this.detailsAfterCreateDiv = page.locator("(//div[@class='w-full h-full border border-kazamGray-200 rounded-md ml-2 p-6 flex flex-col gap-10 overflow-auto'])[1]");
    this.editIcon = page.locator("//div[@class='edit-button cursor-pointer']//*[name()='svg']");
    this.updateBtn = page.locator("//button[normalize-space()='Update']");
    this.fierstNext=page.locator("//button[normalize-space()='Next']")
  }

  async navigate() {
    await this.page.goto(this.tariffUrl, { waitUntil: "networkidle" });
  }

  async createTariff(tariffName) {
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

//   // ---------- END DATE (Today + 3 Days) ----------
//   await this.endDateCalendar.click();
//   await this.page.locator(
//     //button[normalize-space()='${endDate}'] | //div[normalize-space()='${endDate}']
//   ).first().click();

//   // If end date is in next month → move calendar
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

async addPrice(amount) {  
    await this.amountInput.fill(amount);
     await this.page.waitForTimeout(2000)
    // await this.addPriceBtn.click();
    await this.nextBtn.click();
  }

  //collect charger id from list then pass the same charer id to searchAndLinkCharger function
  //next update

  async searchAndLinkCharger(chargerId) {
    await this.searchChargerInput.fill(chargerId);
     await this.page.waitForTimeout(2000)
    if (await this.linkCheckbox.isVisible()) {
      console.log("Charger present:", chargerId);
      await this.linkCheckbox.check();
    } else {
      console.log("Charger not found:", chargerId);
    }
    await this.nextBtn.click();
  }

 async getReviewAndConfirmDetailsAsTable(title = "Review & Confirm Tariff Details") {
  // Right-side review container (stable)
  const container = this.page.locator(
    "//div[contains(@class,'rounded') and .//text()='Pricing Details']"
  );
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
    // valid label-value pairs
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
  console.log(`\📋 ${title}`);
  console.table(table);
  return table;
}
  async createTariffFinal() {
     await this.page.waitForTimeout(2000)
    await this.createBtn.click();
    await this.page.waitForTimeout(5000)
  }

async searchTariffAndGetDetailsAsTable(tariffName) {
  // Search
  await this.page.locator("//input[@placeholder='Search']").fill(tariffName);
  await this.page.waitForTimeout(1500);
  // Click tariff card
  await this.page.locator("//div[contains(@class,'border')][.//text()='" + tariffName + "']").first().click();
  const panel = this.detailsAfterCreateDiv;
  await panel.waitFor({ timeout: 30000 });

  //BASIC DETAILS
  const text = (await panel.innerText())
    .split("\n")
    .map(t => t.trim())
    .filter(Boolean);

  const tariffDetails = [];
  for (let i = 0; i < text.length; i++) {
    const key = text[i];
    const value = text[i + 1];
    if (["NAME", "DESCRIPTION", "TARIFF TYPE", "VALIDITY"].includes(key)) {
      tariffDetails.push({ Field: key, Value: value ?? "N/A" });
      i++;
    }
  }

//PRICING
const pricingData = [];
// Get full panel text
const panelText = (await panel.innerText())
  .split("\n")
  .map(t => t.trim())
  .filter(Boolean);
// Find Pricing section start
const pricingIndex = panelText.indexOf("Pricing");
if (pricingIndex !== -1) {
  for (let i = pricingIndex + 1; i < panelText.length - 1; i++) {
    const key = panelText[i];
    const value = panelText[i + 1];
    // Stop when next section starts
    if (["Assigned Assets", "Additional Charges"].includes(key)) break;
    // Skip headers
    if (key === "Price Type" || key === "Amount") continue;
    pricingData.push({
      priceType: key,
      amount: value
    });
    i++; // move to next pair
  }
}
  //OUTPUT 
  console.log("\n Tariff Details");
  console.table(tariffDetails);
  console.log("\n Pricing Details");
  console.table(pricingData);
  return { tariffDetails, pricingData };
}
}

//   async verifyTariff(chargerId) {
//     await this.searchAfterCreateInput.fill(chargerId);
//     const details = await this.detailsAfterCreateDiv.innerText();
//     console.log("\n Created Tariff Details:\n", details);
//     return details;
//   }

//   async editAndUpdateTariff() {
//     await this.editIcon.click();
//     await this.nextBtn.click();
//     await this.nextBtn.nth(0).click();
//     await this.linkCheckbox.uncheck();
//     await this.nextBtn.click();
//     await this.updateBtn.click();
//   }
