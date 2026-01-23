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

        // // Search
        // this.searchChargerInput = page.locator("input[placeholder='Search in charger list']");

        // // Right-side "chargers" dropdown
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

    async openSettings() {
        await this.settingsBtn.click();
        await this.OrganisationOption.waitFor({ state: 'visible', timeout: 5000 });
        // await this.usermanageBtn.click();
        // await this.usercount.waitFor({ state: 'visible', timeout: 5000 }); 
        // const text = await this.usercount.textContent();
        // return{    
        // UserCount:text.match(/\d+/)[0]
        await this.OrganisationOption.click();
    }

     async getOrganisationDetails() {
    const orgDetails = {
    organizationName: await this. page.locator('text=Organization Name').locator('xpath=following-sibling::*').innerText(),
    email: await this. page.locator('text=Email').locator('xpath=following-sibling::*').innerText(),
    plan: await this. page.locator('text=Plan').locator('xpath=following-sibling::*').innerText(),
    country: await this. page.locator('text=Country').locator('xpath=following-sibling::*').innerText(),
    timeZone:await this. page.locator('text=Time Zone').locator('xpath=following-sibling::*').innerText(),
    currency:await this. page.locator("//div[@class='flex items-center gap-2']").innerText(),
  };

  // 4. Print in console

  console.log(`OrganizationName : ${orgDetails.organizationName}`);
  console.log(`Email             : ${orgDetails.email}`);
  console.log(`Plan              : ${orgDetails.plan}`);
  console.log(`Country           : ${orgDetails.country}`);
  console.log(`TimeZone          : ${orgDetails.timeZone}`);
  console.log(`Currency           : ${orgDetails.currency}`);
   return orgDetails;
 
     }

    



   async  validateOrgVsDashboard(orgData, dashData) {
  let hasMismatch = false;
  const logs = [];

  console.log("\n Organization Validation Started\n");

  // -------- Organization Name --------
  {
    const orgVal  = orgData.name?.trim();
    const dashVal = dashData.organizationName?.trim();

    if (orgVal === dashVal) {
      logs.push("Organization Name: MATCHED");
    } else {
      logs.push(`Organization Name: MISMATCH (${orgVal} vs ${dashVal})`);
      hasMismatch = true;
    }
  }

  // -------- Plan --------
  {
    const orgVal  = orgData.plan?.replace(/plan/i, "").trim().toLowerCase();

    const dashVal = dashData.plan
      ?.trim()
      .toLowerCase();

    if (orgVal === dashVal) {
      logs.push("Plan: MATCHED");
    } else {
      logs.push(`Plan: MISMATCH (${orgVal} vs ${dashVal})`);
      hasMismatch = true;
    }
  }

  // -------- Country (generic, no hardcode) --------
  {
    const orgVal = orgData.country?.trim();

    const dashVal = dashData.country
      ?.replace(/\(.*?\)/g, "")   // removes (IN), (US), etc
      .trim();

    if (orgVal === dashVal) {
      logs.push("Country: MATCHED");
    } else {
      logs.push(`Country: MISMATCH (${orgVal} vs ${dashVal})`);
      hasMismatch = true;
    }
  }

  // -------- Timezone --------
  {
    const orgVal = orgData.timezone?.trim().toLowerCase();

    const dashVal = dashData.timeZone
      ?.split("(UTC")[0]          // removes UTC offset & city list
      .trim().toLowerCase();

   if (orgVal.includes(dashVal)) {
  logs.push("Timezone: MATCHED");
} else {
  logs.push(`Timezone: MISMATCH (${orgVal} vs ${dashVal})`);
  hasMismatch = true;
}

  }

  // -------- Currency (fully generic) --------
 {
  const orgSymbol = orgData.currency?.symbol?.trim();
  const orgName   = orgData.currency?.name?.trim();

  // Normalize dashboard text (handle newline)
  const normalizedCurrency = dashData.currencyText
    ?.replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const dashSymbol = normalizedCurrency
    ?.replace(/[A-Za-z\s]/g, "")
    .trim();

  const dashName = normalizedCurrency
    ?.replace(/[^A-Za-z\s]/g, "")
    .trim();

  if (orgSymbol === dashSymbol && orgName === dashName) {
    logs.push("Currency: MATCHED");
  } else {
    logs.push(
      `Currency: MISMATCH (${orgSymbol} ${orgName} vs ${dashSymbol} ${dashName})`
    );
    hasMismatch = true;
  }
}


  // -------- Print Report 
  logs.forEach(l => console.log(l));

  return {
    success: !hasMismatch,
    message: hasMismatch
      ? "Organization validation failed"
      : "Organization validation passed"
  };
}


    // async openStateDropdown() {
    //     await this.stateDropdown.click();
    // }

    // async openHubDropdown() {
    //     await this.hubDropdown.click();
    // }

    // async openTimePeriodDropdown() {
    // //     await this.timePeriodDropdown.click();
    // }

    // async searchCharger(name) {
    //     await this.searchChargerInput.fill(name);
    // }
};
