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

        this.OnlineCharger=page.locator("//select[@class='text-xs font-medium border border-gray-300 rounded-md focus:border-kazamGray-300 focus:ring-kazamGray-300']")
        this.OnlineFilterInCharger=page.locator("//div[@class='flex gap-2 items-end']//div[@class='flex flex-col gap-1']//button[1]")
        // // Dropdowns
        // this.stateDropdown = page.locator("button:has-text('All States')");
        // this.hubDropdown = page.locator("button:has-text('All Hubs')");
        // this.timePeriodDropdown = page.locator("button:has-text('This month')");
        // this.customizeBtn = page.locator("button:has-text('Customize')");

        // Search
        // this.searchChargerInput = page.locator("input[placeholder='Search in charger list']");

        // Right-side "chargers" dropdown
        // this.chargerViewDropdown = page.locator("button:has-text('Chargers')");

        //hub creation
        this.HubCreationBtn=page.locator("//button[normalize-space()='Add Hub']");
        this.Hubname=page.locator("(//input[@id='large-input'])[1]");
        this.Lattitude=page.locator("//input[@placeholder='Enter latitude']");
        this.Longitude=page.locator("//input[@placeholder='Enter longitude']");
        this.loadType=page.locator("//span[@class='truncate']");
        this.SanctionLoad=page.locator("//input[@placeholder='Enter Sanction Load']");
        this.GetAddressBtn=page.locator("//button[normalize-space()='Get Address']");
        this.NextBtn=page.locator("//button[normalize-space()='Next']");
        this.ChrgerCheck1=page.locator("(//input[@id='link-checkbox'])[2]");
        this.ChargerCheck2=page.locator("(//input[@id='link-checkbox'])[3]");
        this.searchCharger=page.locator("//input[@placeholder='Search by device id']");
        this.NxtBtn=page.locator("//button[normalize-space()='Next']");
        this.confirmbtn=page.locator("//button[normalize-space()='Confirm']");
        this.StateDropdown=page.locator("(//input[contains(@placeholder,'Select')])[1]");
        this.discom=page.locator("//*[@id='createHub']/div/div[2]/div[2]/div[2]/div/div[2]/div/div/div/input");
        this.BillNum=page.locator("//input[contains(@placeholder,'Enter Bill Number')]");
        this.ConnectorType=page.locator("//input[@id='large-input']");
        this.PhoneNum=page.locator("//input[@placeholder='Phone Number']");
        this.CreateHub=page.locator("//button[normalize-space()='Create Hub']");

        //hub deletion
        this.HubSearch=page.locator("//input[@placeholder='Search by hub name']")
        this.HubCard=page.locator("//div[@class='flex flex-col gap-3 w-full h-full border rounded-lg p-4 bg-white cursor-pointer']");
        this.ChargeCheckbox1=page.locator("(//input[@id='link-checkbox'])[1]")
        this.ChargeCheckbox2=page.locator("(//input[@id='link-checkbox'])[2]")
        this.RemoveChargerBtn=page.locator("//button[normalize-space()='Remove Chargers']");
        this.ConfirmBtn=page.locator("//button[normalize-space()='Confirm']");
        this.DeleteHub=page.locator("(//*[name()='svg'][contains(@class,'feather feather-trash text-gray-500 hover:text-black')])[1]");
        this.ConfirmBtn=page.locator("//button[normalize-space()='Confirm']")
        this.HubDetailsCard=page.locator("(//div[@class='flex flex-col gap-4 w-[30%] h-full overflow-y-auto rounded-lg bg-white shadow-sm p-5'])[1]")

    }

 // Apply Time Filter in Dashboard
    async applyTimeFilterInDashboard(period) {
    await this.DashBoardTimeFilter.click();

    //Locate the option dynamically
   const option = this.page.locator(`//div[contains(@class,'flex')]//div[normalize-space(text())='${period}']`);
    // await option.waitFor();
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

//Hub Creation
async HubCreation(hubData){
    await this.HubCreationBtn.click();
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(2000);
    await this.Hubname.fill(hubData.HubName);
    await this.page.waitForTimeout(2000);
    await this.Lattitude.fill(hubData.Lattitude);
    await this.page.waitForTimeout(2000);
    await this.Longitude.fill(hubData.Longitude);
    await this.page.waitForTimeout(2000);
    await this.GetAddressBtn.click();
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(2000);
    await this.loadType.click();
    await this.page.locator("//button[contains(text(),'kW')]").click();
    await this.page.waitForTimeout(2000);
    await this.SanctionLoad.fill(hubData.Sanctionload)
    await this.page.waitForTimeout(2000);
    await this.NextBtn.click();
    await this.page.waitForTimeout(2000);
    await this.ChrgerCheck1.click();
    await this.page.waitForTimeout(2000);
    await this.ChargerCheck2.click();
    await this.page.waitForTimeout(2000);
    await this.NxtBtn.click();
    await this.page.waitForTimeout(2000);
    await this.confirmbtn.click();
    await this.page.waitForTimeout(2000);
    await this.StateDropdown.click();
await this.page.locator(`text=${hubData.State}`).click();
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(2000);
     await this.discom.click();
    await this.page.locator(`text=${hubData.DISCOM}`).click();
     await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(2000);
   await this.BillNum.fill(String(hubData.BillNumber));;
    await this.page.waitForTimeout(2000);
    await this.ConnectorType.fill(hubData.ConnectorType);
    await this.page.waitForTimeout(2000);
    await this.PhoneNum.fill(hubData.PhoneNumber);
    await this.page.waitForTimeout(2000);
    await this.CreateHub.click();
    await this.page.waitForTimeout(5000);
}


//Hub Card Details
async getHubDetails() {
  const details = {};

  const cardText = await this.HubDetailsCard.innerText();

  const lines = cardText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== '');

  for (let i = 0; i < lines.length - 1; i++) {
    const label = lines[i];
    const value = lines[i + 1];

    // Avoid section titles like "Hub Detail", "Hub Location"
    if (
      !label.includes("Hub Detail") &&
      !label.includes("Hub Location") &&
      !label.includes("Hub Bill Detail")
    ) {
      details[label] = value;
      i++; // skip next line since it's value
    }
  }

  return details;
}


async compareHubDetails(beforeData, afterData) {

  console.log("\nHub Validation Started");

  const comparisons = [
    {
      label: "Hub Name",
      expected: beforeData.HubName,
      actual: afterData["Hub Name"]
    },
    {
      label: "Sanction Load",
      expected: beforeData.Sanctionload,
      actual: afterData["Sanction Load"]?.replace(" kw", "")
    },
    {
      label: "State",
      expected: beforeData.State,
      actual: afterData["State"]
    },
    {
      label: "DISCOM",
      expected: beforeData.DISCOM,
      actual: afterData["Name"]
    },
    {
      label: "Bill Number",
      expected: beforeData.BillNumber,
      actual: afterData["Bill No"]
    },
    {
      label: "Connector Type",
      expected: beforeData.ConnectorType,
      actual: afterData["Connection Type"]
    },
    {
      label: "Phone Number",
      expected: beforeData.PhoneNumber,
      actual: afterData["Phone number"]
        ?.replace("+91", "")
        .replace(/\s/g, "")
    }
  ];

  let hasMismatch = false;

  for (const field of comparisons) {
    if (field.expected === field.actual) {
      console.log(`${field.label}: MATCHED`);
    } else {
      console.log(
        `${field.label}: MISMATCHED (Expected: ${field.expected}, Actual: ${field.actual})`
      );
      hasMismatch = true;
    }
  }

  if (hasMismatch) {
    throw new Error("Hub Validation Failed");
  }
}


//Hub Deletion
async HubDeletion(hubData){
  await this.HubSearch.fill(hubData.HubName);
  await this.page.waitForLoadState("networkidle");
  await this.page.waitForTimeout(2000);
  await this.HubCard.click();
  await this.page.waitForLoadState("networkidle");

  // Fetch hub details (object format)
  console.log("Details of the Created Hub")
  const hubDetails = await this.getHubDetails();
  console.log(hubDetails);
  await this.page.waitForTimeout(2000);
  await this.compareHubDetails(hubData, hubDetails);
  await this.ChargeCheckbox1.click();
  await this.page.waitForTimeout(1000);
  await this.ChargeCheckbox2.click();
  await this.page.waitForTimeout(1000);
  await this.RemoveChargerBtn.click();
   await this.page.waitForLoadState("networkidle");
  await this.page.waitForTimeout(2000);
  await this.confirmbtn.click();
  await this.page.waitForTimeout(2000);
  await this.DeleteHub.click();
  await this.page.waitForTimeout(2000);
  await this.ConfirmBtn.click();
  await this.page.waitForTimeout(2000);

}
}