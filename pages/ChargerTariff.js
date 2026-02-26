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
    this.FastChargingbtn = page.locator("(//button[@type='button'])[2]");
    this.TimeOfTheDayBtn = page.locator("(//button[@type='button'])[3]");
    this.ChargeByHrs= page.locator("(//button[@type='button'])[4]");
    this.nextBtn = page.locator("//button[normalize-space()='Next']");
    this.amountInput = page.locator("//input[contains(@placeholder,'Enter Amount')]");
    this.addPriceBtn = page.locator("//button[normalize-space()='Add Price']");
    this.searchChargerInput = page.locator("(//input[@placeholder='Search'])[1]");
    this.linkCheckbox = page.locator("(//input[@id='link-checkbox'])[2]");
    this.reviewDetailsDiv = page.locator("(//div[contains(@class,'flex flex-col gap-4')])[1]");
    this.createBtn = page.locator("//button[text()='Create']");
    this.detailsAfterCreateDiv = page.locator("(//div[@class='w-full h-full border border-kazamGray-200 rounded-md ml-2 p-6 flex flex-col gap-10 overflow-auto'])[1]");
    this.selectedchargerId = page.locator("(//*[@id='hover_cell_0'])[1]");


this.timerange1 = page.locator("(//button[contains(@class,'text-kazamGray-700 w-full focus:border-kazamGray-300 border-y border-x border-gray-300 rounded-l-lg px-4 py-2 flex justify-between items-center false')])[1]");    
// this.starttime4 = page.locator("//button[normalize-space()='10:00 hrs']");
  this.timerange2 = page.locator("button[class='text-kazamGray-700 w-full focus:border-kazamGray-300 border-y border-r border-gray-300 rounded-r-lg px-4 py-2 flex justify-between items-center focus:border-kazamRed-600 border-kazamRed-600']");
  // this.endtime4 =page.locator("//button[normalize-space()='12:00 hrs']");   
    this.dayofweek = page.locator("//button[normalize-space()='----']");
    this.day1 = page.locator("(//input[@id='link-checkbox'])[3]");
    this.day2 = page.locator("(//input[@id='link-checkbox'])[5]");
    this.day3 = page.locator("(//input[@id='link-checkbox'])[7]");


    //charge by hour locators
    this. hourrange = page.locator("//div[@id='PlusIcon']//*[name()='svg']//*[name()='path' and contains(@d,'M5.59668 1')]");
this.price1 = page.locator("(//input[@placeholder='Enter Amount'])[1]")
this.addprice = page.locator("(//button[contains(text(),'Add Price')])[1]");
this.price2 =page.locator("(//input[contains(@placeholder,'Enter Amount')])[2]");
this.Condition2=this.page.locator("(//button[@class='flex items-center justify-between w-full font-medium text-left group-first:rounded-t-xl border-gray-200 dark:border-gray-700 border-l border-r group-first:border-t border-b rounded-b-lg group-first:!rounded-t-lg border-gray-200 dark:border-gray-700 p-0 text-gray-500 dark:text-gray-400 hover:bg-gray-100 hover:dark:bg-gray-800 text-gray-900 bg-[#F7F9FB] hover:!bg-[#F7F9FB]'])[1]");
this.price3=this.page.locator("(//input[@placeholder='Enter Amount'])[3]");
  
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


  // Create new tariff
  async createTariff(tariffName) {
    await this.createTariffBtn.click();
    await this.tariffNameInput.fill(tariffName);
    await this.page.waitForTimeout(2000)
  }

 async selectStartAndEndDate() {
  const today = new Date();
  const startDate = today.getDate().toString();

  // 1. Open the calendar
  await this.startDateCalendar.click();
  const dayElement = this.page.locator('#createTariff')
    .locator('div, span')
    .filter({ hasText: new RegExp(`^${startDate}$`) })
    .filter({ visible: true });
  await dayElement.last().click({ force: true });



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
  // async searchAndLinkCharger(chargerId) {
  // await this.searchChargerInput.fill(chargerId);
     
  //   if (await this.linkCheckbox.isVisible()) {
  //     // console.log("Charger present:", chargerId);
  //     await this.linkCheckbox.check();
  //   } else {
  //     console.log("Charger not found:", chargerId);
  //   }
  //   await this.nextBtn.click();
  // }

   async searchAndLinkCharger() {
    await this.linkCheckbox.check();
      const chargerId = await this.selectedchargerId.innerText();
      await this.page.waitForTimeout(2000)
      if (await this.linkCheckbox.isChecked()) {
        console.log("Selected Charger:", chargerId);
      } else {
        console.log("Charger not found");
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
  await this.page.waitForTimeout(2000);
  
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
  await this.page.waitForTimeout(1000);
  await this.nextBtn.click();
  await this.page.waitForTimeout(1000);
  await this.updateBtn.click();
  await this.page.waitForTimeout(1000);
  await this.dltbut.click();
  await this.page.waitForTimeout(1000);
  await this.yesbtn.click();
  await this.page.waitForTimeout(1000);
 await this.page.waitForLoadState('networkidle');
  
}

// Fast Charging tariff creation
 async selectStartAndEndDateForFastCharging() {
  const today = new Date();
  const startDate = today.getDate().toString();

  // 1. Open the calendar
  await this.startDateCalendar.click();
  const dayElement = this.page.locator('#createTariff')
    .locator('div, span')
    .filter({ hasText: new RegExp(`^${startDate}$`) })
    .filter({ visible: true });
  await dayElement.last().click({ force: true });
// Continue flow
  await this.FastChargingbtn.click();
  await this.page.waitForTimeout(2000)
  await this.fierstNext.click();
}

// Time Of Day tariff creation
async selectStartAndEndDateForTimeOfDay() {
  const today = new Date();
  const startDate = today.getDate().toString();

  // 1. Open the calendar
  await this.startDateCalendar.click();
  const dayElement = this.page.locator('#createTariff')
    .locator('div, span')
    .filter({ hasText: new RegExp(`^${startDate}$`) })
    .filter({ visible: true });
  await dayElement.last().click({ force: true });
// Continue flow
  await this.TimeOfTheDayBtn.click();
  await this.page.waitForTimeout(2000)
  await this.fierstNext.click();


}
    // Set time range
  async setTimeRangeForTimeOfDay(StartTime, EndTime) {  
        await this.timerange1.click();
        await this.page.waitForTimeout(1000); // 1000 millisecond = 1 second
    
    // Select start time
      const starttime4 = this.page.locator(`//button[normalize-space()='${StartTime}']`);
        await starttime4.click();    
        await this.page.waitForTimeout(1000); // 1000 millisecond = 1 second

    // End time
    
        await this.timerange2.click();
        await this.page.waitForTimeout(1000); // 1000 millisecond = 1 second
      
    // select end time
     
        const endtime4 = this.page.locator(`//button[normalize-space()='${EndTime}']`);
        await endtime4.click();
        await this.page.waitForTimeout(1000); // 1000 milliseconnd = 1 second

    // set day of week

        await this.dayofweek.click();
        await this.page.waitForTimeout(1000); // 1000 millisecond = 1 second

    // select date 1
      
        await this.day1.click();    
        await this.page.waitForTimeout(1000); // 1000 millisecond = 1 second

    // select date 2
     
        await this.day2.click();    
        await this.page.waitForTimeout(1000); // 1000 millisecond = 1 second

    // select date 3
      
        await this.day3.click();
        await this.page.waitForTimeout(1000); // 1000 millisecond = 1 second    


      }



// Charge by hour tariff creation
async selectStartAndEndDateForHourTariff() {
  const today = new Date();
  const startDate = today.getDate().toString();

  // 1. Open the calendar
  await this.startDateCalendar.click();
  const dayElement = this.page.locator('#createTariff')
    .locator('div, span')
    .filter({ hasText: new RegExp(`^${startDate}$`) })
    .filter({ visible: true });
  await dayElement.last().click({ force: true });
// Continue flow
  await this.ChargeByHrs.click();
  await this.page.waitForTimeout(2000)
  await this.fierstNext.click();
}


      // Condition one 
    // Select hour range   
    async setChargeByHour(Amount) { 
        await this.hourrange.click();
        await this.page.waitForTimeout(1000); // 1000 millisecond = 1 second
      
    // Price 1
      
        await this.price1.click();
        await this.price1.fill(Amount);
        await this.page.waitForTimeout(1000); // 1000 millisecond = 1 second
      
    // Add price 
      
        await this.addprice.click();
        await this.page.waitForTimeout(1000); // 1000 millisecond = 1 second
      
    // Price 2
      
        await this.price2.click(); 
        await this.price2.fill(Amount);
        await this.page.waitForTimeout(1000); // 1000 millisecond = 1 second

    // Condition 2
        await this.Condition2.click();
        await this.page.waitForTimeout(1000); // 1000 millisecond = 1 second

    // Price 3
        await this.price3.click();
        await this.price3.fill(Amount);
        await this.page.waitForTimeout(1000); // 1000 millisecond = 1 second
        // Continue flow
        await this.nextBtn.click();
        await this.page.waitForTimeout(3000); // 1000 millisecond = 1 second
 

    }

    }

