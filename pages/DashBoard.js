exports.DashboardPage = class DashboardPage {

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
   

        // Charger count
        this.totalChargers = page.locator("//span[@class='text-sm text-black']");
        this.totalConnectors = page.locator("(//span[@class='text-sm text-black ml-2'])[1]");
        this.nonConfigured = page.locator("(//span[@class='text-sm text-black ml-2'])[2]");

        // Charger connector status
        this.btnAll = page.locator("(//div[starts-with(normalize-space(), 'All(')])[4]");
        this.btnBusy = page.locator("//button[.//div[contains(@class,'bg-blue-600')]]");
        this.btnAvailable = page.locator("//button[.//div[contains(@class,'bg-green-600')]]");
        this.btnError = page.locator("//button[.//div[contains(@class,'whitespace-nowrap')]]");
        this.settingsBtn = page.locator("//button[@class='p-1 rounded-full']//*[name()='svg']");
        this.usermanageBtn = page.locator("//button[normalize-space()='User Management']");
        this.usercount=page.locator("//p[@class='w-max whitespace-nowrap']");

        //Setting
         this.OrganisationOption=page.locator("//a[normalize-space()='Organization']");
         this.orgDetailsCard=page.locator("(//div[@class='w-2/5 bg-white rounded-md h-auto border p-4 flex flex-col gap-4'])[1]")
        // // Dropdowns
        // this.stateDropdown = page.locator("button:has-text('All States')");
        // this.hubDropdown = page.locator("button:has-text('All Hubs')");
        // this.timePeriodDropdown = page.locator("button:has-text('This month')");
        // this.customizeBtn = page.locator("button:has-text('Customize')");

        // Search
        // this.searchChargerInput = page.locator("input[placeholder='Search in charger list']");

        // Right-side "chargers" dropdown
        // this.chargerViewDropdown = page.locator("button:has-text('Chargers')");
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

    async getChargerCounters() {
        return {
            chargers: await this.totalChargers.textContent(),
            connectors: await this.totalConnectors.textContent(),
            nonConfigured: await this.nonConfigured.textContent()
        }
    }

    async getConnectorStatusCounts() {
        return {
            all: await this.btnAll.textContent(),
            busy: await this.btnBusy.textContent(),
            available: await this.btnAvailable.textContent(),
            error: await this.btnError.textContent()
        }
    }

    // async openSettings() {
    //     await this.settingsBtn.click();
    //     await this.OrganisationOption.waitFor({ state: 'visible', timeout: 5000 });
    //     // await this.usermanageBtn.click();
    //     // await this.usercount.waitFor({ state: 'visible', timeout: 5000 }); 
    //     // const text = await this.usercount.textContent();
    //     // return{    
    //     // UserCount:text.match(/\d+/)[0]
    //     await this.OrganisationOption.click();
    // }

}