 
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

    //Locate the option dynamically
   const option = this.page.locator(`//div[contains(@class,'flex')]//div[normalize-space(text())='${period}']`);
    // await option.waitFor();
    await option.click();
    await this.page.waitForLoadState("networkidle");
    // Get today's date
    const today = new Date();

   // Calculate yesterday
   const endDate = new Date(today);
   endDate.setDate(today.getDate() - 1);

// Calculate 7 days before today
const startDate = new Date(today);
startDate.setDate(today.getDate() - 8);

// Extract day numbers
const startDay = startDate.getDate();
const endDay = endDate.getDate();

// Format function (DD/MM/YYYY)
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // month is 0-based
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

// Calculate yesterday
const EndDate = new Date(today);
EndDate.setDate(today.getDate() - 1);

// Calculate 7 days before today
const StartDate = new Date(today);
StartDate.setDate(today.getDate() - 8);

// Print formatted dates
console.log("Start Date:", formatDate(StartDate));
console.log("End Date:", formatDate(EndDate));

// Click start date
await this.page.locator(`//button[normalize-space()='${startDay}']`).click();

// Click end date
await this.page.locator(`//button[normalize-space()='${endDay}']`).click();

// Click Submit
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
        await this.page.goto("https://novo.kazam.in/org/zynetic_electric_vehicle_charging_llc/7aff5403-3de3-4273-9665-099574cf2048/cpo/chargers", { waitUntil: "load" });
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

// Get today's date
    const today = new Date();

   // Calculate yesterday
   const endDate = new Date(today);
   endDate.setDate(today.getDate() - 1);

// Calculate 7 days before today
const startDate = new Date(today);
startDate.setDate(today.getDate() - 8);

// Extract day numbers
const startDay = startDate.getDate();
const endDay = endDate.getDate();

// Format function (DD/MM/YYYY)
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // month is 0-based
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}


// Calculate yesterday
const EndDate = new Date(today);
EndDate.setDate(today.getDate() - 1);

// Calculate 7 days before today
const StartDate = new Date(today);
StartDate.setDate(today.getDate() - 8);

// Print formatted dates
console.log("Start Date:", formatDate(StartDate));
console.log("End Date:", formatDate(EndDate));

// Click start date
await this.page.locator(`//button[normalize-space()='${startDay}']`).click();

// Click end date
await this.page.locator(`//button[normalize-space()='${endDay}']`).click();

// Click Submit
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