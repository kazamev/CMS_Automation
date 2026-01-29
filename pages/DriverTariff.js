export class TariffPage {
    constructor(page) {
        this.page = page;
    
        this.driverTariffTab = page.locator("//span[normalize-space()='Driver Tariffs']");
        // Driver Group Creation Locators
        this.driversVehiclesModule = page.locator("//span[normalize-space()='Drivers & Vehicles']");
        this.driverGroupsTab = page.locator("//span[normalize-space()='Driver Groups']");
        this.createDriverGroupBtn = page.locator("//button[normalize-space()='Create Driver Group']");
        this.groupNameInput = page.locator("(//input[@id='large-input'])[1]");
        this.descriptionInput = page.locator("(//input[@id='large-input'])[2]");
        this.nextBtn = page.locator("//button[normalize-space()='Next']");
        this.driverCheckbox = page.locator("//tbody/tr[2]/td[1]/div[1]/input[1]");
        this.createFinalBtn = page.locator("//button[normalize-space()='Create']");


        //Driver Tariff Creation
        this.DriverTariff=page.locator("//span[normalize-space()='Driver Tariffs']");
        this.driverGroupSearchBar=page.locator("//input[@placeholder='Search by group name']");
        this.AddTariffBtn=page.locator("//button[normalize-space()='Add Tariff']");
        this.TariffSelectionDropdown=page.locator("(//input[@placeholder='Select'])[1]");
        this.NextButton=page.locator("//button[normalize-space()='Next']");
        this.SearchChargerInput=page.locator("(//input[contains(@placeholder,'Search by device id')])[1]");
        this.chargerCheckbox=page.locator("(//input[@id='link-checkbox'])[2]");
        this.AddTariffBtnFinal=page.locator("(//button[normalize-space()='Add Tariff'])[1]");


        //delete driver tariff 
        this.TariffDltBtn=page.locator("//*[name()='path' and contains(@d,'M19 6v14a2')]");
        this.DltConfirmBtn=page.locator("//button[normalize-space()='Confirm']");
        this.AssignedChargerBtn=page.locator("(//*[name()='svg'][@class='feather feather-edit-2 '])[1]");
        this.UpdateAssetBtn=page.locator("//button[normalize-space()='Update Assets']");
        this.hubCheckbox = page.locator("(//input[@id='link-checkbox'])[1]");


        //delete driver group locators
        this.driversVehiclesModule = page.locator("//span[normalize-space()='Drivers & Vehicles']");
        this.driverGroupsTab = page.locator("//span[normalize-space()='Driver Groups']");
        this.searchBar = page.locator("//input[@placeholder='Search by group name']");
         this.firstTariffRow = page.locator("//p[@class='text-lg']").first();
        this.drivercheck=page.locator("//input[@id='link-checkbox']");
        this.RemoveDriverBtn=page.locator("//button[normalize-space()='Remove Drivers']");
        this.confirmBtn=page.locator("//button[normalize-space()='Confirm']");
        this.GroupdltBtn=page.locator("(//*[name()='svg'][contains(@class,'feather feather-trash text-gray-500 hover:text-black')])[1]");
        this.ConfirmDeleteBtn=page.locator("//button[normalize-space()='Confirm']");

        // Cleanup Locators
        this.removeDriversBtn = page.locator("//button[normalize-space()='Remove Drivers']");
        this.deleteGroupBtn = page.locator("button:has(svg.feather-trash), .feather-trash-2").last();
    }

   
    //Create Driver Group Method
    async createDriverGroupFlow(name, desc) {
        await this.driversVehiclesModule.click();
        await this.page.waitForTimeout(2000);
        await this.driverGroupsTab.click();
        await this.page.waitForTimeout(2000);
        await this.createDriverGroupBtn.click();
        await this.page.waitForTimeout(2000);
        await this.groupNameInput.fill(name);
        await this.page.waitForTimeout(2000);       
        await this.descriptionInput.fill(desc);
        await this.page.waitForTimeout(2000);
        await this.nextBtn.click();
        await this.page.waitForTimeout(2000);
        await this.driverCheckbox.click();
        await this.page.waitForTimeout(2000);   
        await this.createFinalBtn.click();
        await this.page.waitForTimeout(2000);
        await this.page.waitForLoadState('networkidle');
        console.log("Driver Group created successfully");
    }

// Navigate to Tariff Page(Revenue)
     async navigate() {
        await this.page.goto('https://novo.kazam.in/org/Tyagi_Org/1b8d6bd0-22f5-4cd5-b794-1ce364573a30/cpo/revenue_management/overview', { waitUntil: 'networkidle' });
    }

// Navigate to Driver Tariffs Tab
    async navigateToDriverTariffs() {
        await this.driverTariffTab.click();
        await this.page.waitForLoadState('networkidle');
    }

// Create Driver Tariff
  async DriverTariffCreation(groupName) {
    console.log("Starting Driver Tariff Creation");
    await this.DriverTariff.click();
    await this.page.waitForLoadState('networkidle');

    // Search and open group
    await this.driverGroupSearchBar.click();
    await this.page.waitForTimeout(2000);
    await this.driverGroupSearchBar.fill(""); 
    await this.page.waitForTimeout(2000);
    await this.driverGroupSearchBar.fill(groupName);
    await this.page.keyboard.press('Enter');
    const groupRow = this.page.locator(`//p[normalize-space()='${groupName}']`).first();
    try {
        await groupRow.waitFor({ state: 'visible', timeout: 15000 });
        await groupRow.click();
        await this.page.waitForTimeout(2000);
        console.log(`Successfully opened Driver Group: ${groupName}`);
    } catch (error) {
        console.log(`Group "${groupName}" did not appear in search results.`);
        throw error;
    }

    
    //Select Tariff
    await this.AddTariffBtn.click();
    await this.page.waitForTimeout(2000);
    await this.TariffSelectionDropdown.click();
    await this.page.waitForTimeout(2000);
    const firstTariffOption = this.page.locator("div.flex-col.gap-2 ul li").nth(2);
    await firstTariffOption.waitFor({ state: 'visible', timeout: 10000 });
    
    // capture selected tariff name
    const tariffName = (await firstTariffOption.textContent()).trim();
    console.log(`Selecting available tariff: ${tariffName}`);
    await firstTariffOption.click(); 

    //Charger Selection
    await this.NextButton.click();
    await this.page.waitForTimeout(2000);
    await this.page.waitForLoadState('networkidle');
    const firstChargerCheckbox = this.page.locator("input[id='link-checkbox']").nth(1);
    await firstChargerCheckbox.waitFor({ state: 'visible', timeout: 10000 });
    await firstChargerCheckbox.click();

    //Finalize
    await this.AddTariffBtnFinal.click();
    await this.page.waitForTimeout(2000);
    await this.page.waitForLoadState('networkidle');
    console.log("Driver Tariff  Created Successfully");
    return {
        tariffName: tariffName,
    };
}


// Get Driver Details as Table
  async getDriverDetailsAsTables(groupName,title = "Driver Group Details") {
  // Open Driver Group
  await this.driverGroupSearchBar.click();
  await this.page.waitForTimeout(2000);
  await this.driverGroupSearchBar.fill(groupName);
  await this.page.waitForTimeout(2000);
  await this.page.keyboard.press("Enter");

  const groupRow = this.page.locator(`//p[normalize-space()='${groupName}']`).first();

  await groupRow.waitFor({ state: "visible", timeout: 15000 });
  await groupRow.click();
  await this.page.waitForTimeout(2000);
  console.log(`Successfully opened Driver Group: ${groupName}`);

  // Driver Group Container 
  const container = this.page.locator("(//div[contains(@class,'rounded') and .//text()='Driver Group Details'])[2]");
  await container.waitFor({ timeout: 30000 });
  const text = (await container.innerText())
    .split("\n")
    .map(t => t.trim())
    .filter(Boolean);
  const driverDetails = [];
  for (let i = 0; i < text.length; i++) {
    const key = text[i];
    const value = text[i + 1];
    if (["Name", "Description", "Total Drivers","Tariff Name"].includes(key)) {
      driverDetails.push({
        Field: key,
        Value: value ?? "N/A"
      });
      i++;
    }
  }

  // Print
  console.log(`\n${title}`);
  console.table(driverDetails);
  return driverDetails;
}

   
async tariffDeletionFlow() {
  // Open Assigned Chargers section
  await this.AssignedChargerBtn.click();
  await this.page.waitForTimeout(2000);
  await this.page.waitForLoadState('networkidle');

  // Grab all charger checkboxes
  const allChargers = this.page.locator("input[id='link-checkbox']");
  const count = await allChargers.count();
  await this.page.waitForTimeout(2000);
//   console.log(`Found ${count} chargers.`);

  // Uncheck all checked chargers until first unchecked
  for (let i = 1; i < count; i++) {
    const checkbox = allChargers.nth(i);

    await checkbox.waitFor({ state: 'visible', timeout: 10000 });

    const isChecked = await checkbox.isChecked();
      await this.page.waitForTimeout(2000);

    if (!isChecked) {
    //   console.log(`Stopping at charger ${i + 1}, already unchecked.`);
      break; // Stop after first unchecked
    }

    await checkbox.setChecked(false); // Safe uncheck
      await this.page.waitForTimeout(2000);
    // console.log(`Unchecked charger ${i + 1}`);
  }

  // Update assets
  await this.UpdateAssetBtn.click();
    await this.page.waitForTimeout(2000);
  await this.page.waitForLoadState('networkidle');

  // Delete tariff
  await this.TariffDltBtn.click();
  await this.page.waitForTimeout(2000);
  await this.DltConfirmBtn.click();
  await this.page.waitForTimeout(2000);
  await this.page.waitForLoadState('networkidle');

  console.log("Driver Tariff deleted successfully.");
}

// Driver Group Deletion
async DriverGroupDltion(groupName) {
      await this.driversVehiclesModule.click();
        await this.driverGroupsTab.click();
  // Search and open Driver Group
  await this.driverGroupSearchBar.click();
    await this.page.waitForTimeout(4000);
  await this.driverGroupSearchBar.fill(groupName);
  await this.page.keyboard.press("Enter");

  const groupRow = this.page.locator("//span[@class='one_line_wrapper']").first();
 await this.page.waitForTimeout(4000);
  await groupRow.waitFor({ state: "visible", timeout: 15000 });
  await groupRow.click();
     await this.page.waitForTimeout(4000);
  console.log(`Successfully opened Driver Group: ${groupName}`);

  //Remove all drivers
  await this.page.locator("//input[@id='link-checkbox']").click();

//   const driverCheckboxes = this.page.locator("input[type='checkbox']"); 
//   const count = await driverCheckboxes.count();
//     await this.page.waitForTimeout(2000);

//   console.log(`Total drivers found: ${count}`);

//   for (let i = 0; i < count; i++) {
//     const checkbox = driverCheckboxes.nth(i);
//       await this.page.waitForTimeout(2000);

//     await checkbox.waitFor({ state: "visible", timeout: 10000 });

//     if (await checkbox.isChecked()) {
//       await checkbox.setChecked(false);
//         await this.page.waitForTimeout(3000);
//       console.log(`Unselected driver ${i + 1}`);
//     }
//   }


  // Remove selected drivers
  await this.RemoveDriverBtn.click();
  await this.page.waitForTimeout(2000);
  await this.confirmBtn.click();
  await this.page.waitForTimeout(2000);
//   await this.page.waitForLoadState("networkidle");
  console.log("All drivers removed from the group.");

  // Delete Driver Group
  await this.GroupdltBtn.click();
  await this.page.waitForTimeout(2000);
  await this.ConfirmDeleteBtn.click();
  await this.page.waitForTimeout(2000);
//   await this.page.waitForLoadState("networkidle");
  console.log("Driver Group deleted successfully.");
    // await this.page.waitForTimeout(6000);
}


}























   