 
 exports. WeeklyChargerConnectorValidator = class  WeeklyChargerConnectorValidator {
 constructor(page) {
        this.page = page;

        // Revenue block
        this.revenueValue = page.locator("(//p[@class='text-base font-medium'])[1]");
        
        // No of session block
        this.sessionsValue = page.locator("(//p[@class='text-base font-medium'])[2]");
        
        // Usage
        this.usageValue = page.locator("(//p[@class='text-base font-medium'])[3]");
       
        // Online percentage
        this.onlinePercent = page.locator("(//p[@class='text-base font-medium'])[4]");

        //calender filter in dashboard
        this.DashBoardTimeFilter= page.locator("//button[@class='w-full flex gap-1 items-center bg-black py-2 px-3 border rounded-md bg-white']");
   

        // Charger count
        this.totalChargers = page.locator("//span[@class='text-sm text-black']");
        this.totalConnectors = page.locator("(//span[@class='text-sm text-black ml-2'])[1]");
        this.nonConfigured = page.locator("(//span[@class='text-sm text-black ml-2'])[2]");

        // Charger connector status
        this.BtnAll = page.locator("(//div[starts-with(normalize-space(), 'All(')])[4]");
        this.BtnBusy = page.locator("//button[.//div[contains(@class,'bg-blue-600')]]");
        this.BtnAvailable = page.locator("//button[.//div[contains(@class,'bg-green-600')]]");
        this.BtnError = page.locator("//button[.//div[contains(@class,'whitespace-nowrap')]]");
        this.settingsBtn = page.locator("//button[@class='p-1 rounded-full']//*[name()='svg']");
        this.usermanageBtn = page.locator("//button[normalize-space()='User Management']");
        this.usercount=page.locator("//p[@class='w-max whitespace-nowrap']");


        // this.CalenderOption= page.locator("//button[@class='w-full flex gap-1 items-center bg-black py-2 px-3 border rounded-md bg-white']"); 
        
         // Top counters
        this.chargersCount = page.locator("//div[contains(.,'Chargers')]/span[contains(@class,'text-black')]");
        this.connectorsCount = page.locator("//div[contains(., 'Connectors')]/span[contains(@class,'text-black')]");
        this.nonConfigCount = page.locator("//div[contains(., 'Non Configured')]/span[contains(@class,'text-black')]");

        // Connector status buttons
        this.btnAll = page.locator("(//div[starts-with(normalize-space(), 'All(')])[4]");
        this.btnBusy = page.locator("//button[.//div[contains(@class,'bg-[#6A8DE1]')]]");
        this.btnAvailable = page.locator("//button[.//div[contains(@class,'bg-[#56B588]')]]");
        this.btnError = page.locator("//button[.//div[contains(@class,'whitespace-nowrap')]]");

        this.chargertimeperiod = page.locator("//button[.//div[normalize-space()='Today']]");

        this.OnlineCharger=page.locator("//select[@class='text-xs font-medium border border-gray-300 rounded-md focus:border-kazamGray-300 focus:ring-kazamGray-300']")
        this.OnlineFilterInCharger=page.locator("//div[@class='flex gap-2 items-end']//div[@class='flex flex-col gap-1']//button[1]");

 }



// Apply Time Filter in Dashboard
async applyTimeFilterInDashboard(period) {

  await this.DashBoardTimeFilter.click();

  const option = this.page.locator(`//div[contains(@class,'flex')]//div[normalize-space(text())='${period}']`);
  await option.click();
  await this.page.waitForLoadState("networkidle");

  const today = new Date();

  // Yesterday
  const endDate = new Date(today);
  endDate.setDate(today.getDate() - 1);

  // 7 days before yesterday
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 8);

  const startDay = startDate.getDate();
  const endDay = endDate.getDate();

  const startMonth = startDate.getMonth();
  const currentMonth = today.getMonth();

  function formatDate(date) {
    const day = String(date.getDate()).padStart(2,'0');
    const month = String(date.getMonth()+1).padStart(2,'0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  console.log("Start Date:", formatDate(startDate));
  console.log("End Date:", formatDate(endDate));

  // If start date is in previous month → go to previous month
  if (startMonth !== currentMonth) {
    await this.page.locator("//button[@title='Go to Previous Month']//*[name()='svg']").click();
  }

  // Select Start Date
  await this.page.locator(`//button[normalize-space()='${startDay}']`).click();

  // If end date is in current month → move forward
  if (startMonth !== endDate.getMonth()) {
    await this.page.locator("//button[@title='Go to Next Month']//*[name()='svg']").click();
  }

  // Select End Date
  await this.page.locator(`//button[normalize-space()='${endDay}']`).click();

  // Submit
  await this.page.locator("//button[normalize-space()='Submit']").click();

  await this.page.waitForLoadState("networkidle");
}


    async getRevenue() {
        return (await this.revenueValue.textContent()).trim();
    }

    async getTotalSessions() {
        return (await this.sessionsValue.textContent()).trim();
    }

    async getUsage() {
        return (await this.usageValue.textContent()).trim();
    }

    async getOnlinePercentage() {
        return (await this.onlinePercent.textContent()).trim();
    }

  // FIXED: Added visibility waits before getting text to prevent TimeoutErrors
    async getDashboardConnectorStatusCounts() {
        // Wait for the buttons to be visible on the page before trying to read them
        await this.BtnBusy.waitFor({ state: "visible", timeout: 15000 });
        
        return {
            All: (await this.BtnAll.textContent() || "0").trim(),
            Busy: (await this.BtnBusy.textContent() || "0").trim(),
            Available: (await this.BtnAvailable.textContent() || "0").trim(),
            Error: (await this.BtnError.textContent() || "0").trim(),
        };
    }

    async getDashboardChargerCounts() {
        // Explicit wait for elements linked to your XPaths
        await this.totalChargers.waitFor({ state: "visible" });
        return {
            chargers: (await this.totalChargers.textContent() || "0").trim(),
            connectors: (await this.totalConnectors.textContent() || "0").trim(),
            nonConfigured: (await this.nonConfigured.textContent() || "0").trim()
        };
    }

    async navigateToChargersPage() {
        await this.page.goto("https://novo.kazam.in/org/hpcl/9d778325-3fdd-4879-a9f9-b660ca6e240c/cpo/chargers", { waitUntil: "load" });
        await this.page.waitForLoadState("networkidle");
    }
    async applyTimeFilterinChargerPage(period) {
    await this.chargertimeperiod.click();
    await this.page.waitForTimeout(1000);
   const option = this.page.locator(`//div[contains(@class,'flex')]//div[normalize-space(text())='${period}']`);
    await option.waitFor();
    await this.page.waitForTimeout(1000);
    await option.click();
    await this.page.waitForLoadState("networkidle");

const today = new Date();

  // Yesterday
  const endDate = new Date(today);
  endDate.setDate(today.getDate() - 1);

  // 7 days before yesterday
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 8);

  const startDay = startDate.getDate();
  const endDay = endDate.getDate();

  const startMonth = startDate.getMonth();
  const currentMonth = today.getMonth();

  function formatDate(date) {
    const day = String(date.getDate()).padStart(2,'0');
    const month = String(date.getMonth()+1).padStart(2,'0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  console.log("Start Date:", formatDate(startDate));
  console.log("End Date:", formatDate(endDate));

  // If start date is in previous month → go to previous month
  if (startMonth !== currentMonth) {
    await this.page.locator("//button[@title='Go to Previous Month']//*[name()='svg']").click();
  }

  // Select Start Date
  await this.page.locator(`//button[normalize-space()='${startDay}']`).click();

  // If end date is in current month → move forward
  if (startMonth !== endDate.getMonth()) {
    await this.page.locator("//button[@title='Go to Next Month']//*[name()='svg']").click();
  }

  // Select End Date
  await this.page.locator(`//button[normalize-space()='${endDay}']`).click();

  // Submit
  await this.page.locator("//button[normalize-space()='Submit']").click();

  await this.page.waitForLoadState("networkidle");

}

     // Top counters
    async getChargerCounts() {
    await this.page.waitForTimeout(500); // small buffer time
    await this.chargersCount.waitFor({ state: "visible", timeout: 5000 });
    await this.connectorsCount.waitFor({ state: "visible", timeout: 5000 });
    // await this.nonConfigCount.waitFor({ state: "visible", timeout: 5000 });

    return {
        chargers: await this.chargersCount.textContent(),
        connectors: await this.connectorsCount.textContent(),
    //     nonConfigured: await this.nonConfigCount.textContent()
     };
    }
// Connector status count
async getConnectorStatusCounts() {
    return {
            All: await this.btnAll.textContent(),
            Busy: await this.btnBusy.textContent(),
            Available: await this.btnAvailable.textContent(),
            Error: await this.btnError.textContent(),
        };
    }


    //online and offline filter in DashBoard
async OnlineFilter(){
// console.log("Online Chargers Data In Dashboard...")
await this.OnlineCharger.click();
await this.OnlineCharger.selectOption("Online");
await this.page.waitForTimeout(5000)
await this.page.waitForLoadState("networkidle");
}


//online and offline filter in Charger Page
async OnlineFilterCharger(){
// console.log("Online Chargers Data In Charger Page...")
await this.OnlineFilterInCharger.click();
await this.page.locator("//div[@class='$'][normalize-space()='Online']").click();
await this.page.waitForLoadState("networkidle");


}
}