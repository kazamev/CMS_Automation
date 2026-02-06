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
        this.BtnAll = page.locator("(//div[starts-with(normalize-space(), 'All(')])[4]");
        this.BtnBusy = page.locator("//button[.//div[contains(@class,'bg-blue-600')]]");
        this.BtnAvailable = page.locator("//button[.//div[contains(@class,'bg-green-600')]]");
        this.BtnError = page.locator("//button[.//div[contains(@class,'whitespace-nowrap')]]");
        this.settingsBtn = page.locator("//button[@class='p-1 rounded-full']//*[name()='svg']");
        this.usermanageBtn = page.locator("//button[normalize-space()='User Management']");
        this.usercount=page.locator("//p[@class='w-max whitespace-nowrap']");

        //Setting
         this.OrganisationOption=page.locator("//a[normalize-space()='Organization']");
         this.orgDetailsCard=page.locator("(//div[@class='w-2/5 bg-white rounded-md h-auto border p-4 flex flex-col gap-4'])[1]");
        //User Creation
        this.UserRoleTab=page.locator("//span[normalize-space()='User Role']");
        this.UserRoleBtn=page.locator("//button[normalize-space()='Create User Role']");
        this.RoleNameInput=page.locator("(//input[@id='large-input'])[1]");
        this.RoleDescInput=page.locator("(//input[@id='large-input'])[2]");
        this.CreateBtn=page.locator("//button[text()='Create']");
        
        //Role validation
        this.RoleCard=page.locator("(//div[@class='flex flex-col gap-4 h-max w-full bg-white p-4 border rounded-lg group hover:border-kazamPurple-600 cursor-pointer border-kazamPurple-600'])[1]")
        this.RoleName=page.locator("(//p[@class='text-sm'])[1]");
        this.RoleDes=page.locator("(//p[@class='text-sm'])[2]");

        //Role Deletion
        this.RoleDeleteBtn=page.locator("(//*[name()='svg'][@class='feather feather-trash '])[1]");
        this.Confirmbtn=page.locator("//button[normalize-space()='Confirm']");

        //User Creation
        this.ManageUserTab=page.locator("//span[normalize-space()='Manage Users']");
        this.AddUserBtn=page.locator("//button[normalize-space()='Add User']");
        this.UserEmailInput=page.locator("(//input[@id='large-input'])[1]");
        this.UserRoleDropdown=page.locator("//input[@placeholder='Select']"); 
        this.UserDesignationInput=page.locator("(//input[@id='large-input'])[2]");

        this.SelectRoleOption=page.locator("(//input[@placeholder='Select'])[1]");
        this.NxtBtn=page.locator("//button[normalize-space()='Next']");
        this.chargerCheckbox=page.locator("(//input[@id='link-checkbox'])[2]");
        this.sendInviteBtn=page.locator("//button[normalize-space()='Send Invite']");


        this.DashBoardTimeFilter= page.locator("//button[@class='w-full flex gap-1 items-center bg-black py-2 px-3 border rounded-md bg-white']"); 
        
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

 // Apply Time Filter in Dashboard
    async applyTimeFilterInDashboard(period) {
    await this.DashBoardTimeFilter.click();

    //Locate the option dynamically
   const option = this.page.locator(`//div[contains(@class,'flex')]//div[normalize-space(text())='${period}']`);
    await option.waitFor();
    await option.click();
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
    await this.page.waitForLoadState("networkidle");}

     // Top counters
    async getChargerCounts() {
    await this.page.waitForTimeout(500); // small buffer time
    await this.chargersCount.waitFor({ state: "visible", timeout: 5000 });
    await this.connectorsCount.waitFor({ state: "visible", timeout: 5000 });
    await this.nonConfigCount.waitFor({ state: "visible", timeout: 5000 });

    return {
        chargers: await this.chargersCount.textContent(),
        connectors: await this.connectorsCount.textContent(),
        nonConfigured: await this.nonConfigCount.textContent()
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

    async UserCreation(Data) {
        // await this.settingsBtn.click(Data);
        // await this.page.waitForLoadState("networkidle");
        // await this.page.waitForTimeout(1000);
        // await this.usermanageBtn.click();
        // await this.page.waitForLoadState("networkidle");
        // await this.page.waitForTimeout(2000);
        await this.UserRoleTab.click();
        await this.page.waitForLoadState("networkidle");
        await this.page.waitForTimeout(2000);
        await this.UserRoleBtn.click()
        await this.page.waitForTimeout(2000);
        await this.page.waitForLoadState("networkidle");
        await this.RoleNameInput.fill(Data.RoleName);
        await this.page.waitForTimeout(2000);
        await this.RoleDescInput.fill(Data.RoleDescription);
        await this.page.waitForTimeout(1000);
        await this.CreateBtn.click();
        await this.page.waitForTimeout(2000);
        await this.page.waitForLoadState("networkidle");
    }
    
    async RoleValidation() {
        await this.RoleCard.click();
        await this.page.waitForTimeout(2000);
        const roleName = (await this.RoleName.textContent()).trim();
        const roleDesc = (await this.RoleDes.textContent()).trim(); 
        return {
            name: roleName,
            description: roleDesc
        };
    }

    async RoleDeletion() {
        await this.UserRoleTab.click();
        await this.page.waitForLoadState("networkidle");
        await this.page.waitForTimeout(5000);
        await this.RoleCard.click();
        await this.page.waitForTimeout(2000);
        await this.RoleDeleteBtn.click();
        await this.page.waitForTimeout(2000);
        await this.Confirmbtn.click();
        await this.page.waitForTimeout(2000);
    }

    //dummymail generater
    async generateDummyEmail() {
  return `test_${Date.now()}@mailinator.com`;
}

// Add User Function
async AddUser(Data) {
    await this.ManageUserTab.click();
    await this.page.waitForTimeout(2000);
    await this.AddUserBtn.click();
    await this.page.waitForTimeout(2000);
    await this.UserEmailInput.fill(Data.UserEmail);
    await this.page.waitForTimeout(2000);
    await this.UserRoleDropdown.click();
    await this.page.locator(`//div[text()="${Data.RoleName}"]`).click();
    await this.page.waitForTimeout(2000);
    await this.UserDesignationInput.fill(Data.UserDesignation);
    await this.page.waitForTimeout(2000);
    await this.NxtBtn.click();
    await this.page.waitForTimeout(2000);
    await this.chargerCheckbox.check();
    await this.page.waitForTimeout(2000);
    await this.NxtBtn.click();
    await this.page.waitForTimeout(2000);
    await this.sendInviteBtn.click();
    await this.page.waitForTimeout(2000);
}
}