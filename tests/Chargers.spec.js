import { test, expect } from '../Fixtures/loginFixture';
import { ChargersPage } from '../pages/ChargersPage';

test.describe("Charger & Session Dashboard Tests", () => {

  test("Validate charger counters & connector status counts", async ({ loggedInPage }) => {
    const page = loggedInPage;
    await page.goto("https://novo.kazam.in/org/Tyagi_Org/1b8d6bd0-22f5-4cd5-b794-1ce364573a30/cpo/chargers");
    await page.waitForLoadState("networkidle");
    const chargers = new ChargersPage(page);

    //Read top counters
    const counts = await chargers.getChargerCounts();
    console.log("Charger Counts:", counts);

    //Read connector status counts
    const status = await chargers.getConnectorStatusCounts();
    console.log("Status Counts:", status);

  });


  // Add Charger Flow
  test("Add Charger End-to-End Flow", async ({ loggedInPage }) => {
    const page = loggedInPage;
    test.setTimeout(120000);
     await page.goto("https://novo.kazam.in/org/Tyagi_Org/1b8d6bd0-22f5-4cd5-b794-1ce364573a30/cpo/chargers");
    await page.waitForLoadState("networkidle");
    const chargers = new ChargersPage(page);

    // Before count
    const before = await chargers.getChargerCounts();
    const beforeCount = Number(before.chargers);
    console.log("Before Count:", beforeCount);

    // Open Add Charger page
    await chargers.openAddCharger();
    await page.waitForTimeout(1000);

    // Test Data
    const data = {
      name: "EV Charger",
      hostPhone: "7007916033",
      segment: "Fleet",
      subsegment: "Kazam Hub",
      capacity: "3.3",
      type: "AC",
      parkingType:"4W",

      connectorType: "CCS",
      totalCapacity: "3.3",

      lat: "12.9716",
      long: "77.5946",

      privateCharger: "No",
      open247: "Yes",
      imagePath: "tests/testdata/charger.png",
      newChargerName: "Charger Updated",
      newHostPhone: "8431273913",
      newConnectortype:"Industrial"
    };

    //step charger form
    await chargers.fillChargerDetails(data);


    console.log(`Charger added successfully → ${data.name}`);

    const chargerId = await chargers.getChargerId();
    console.log("Generated Charger ID:", chargerId);


    //Check if charger appears in list

    // Click Back button
    await page.locator('//span[text()="Back"]').click();
    await page.waitForLoadState("networkidle");
   

    // Enter chargerId in search field
    const searchField = page.locator('//input[@type="search"]');
    await searchField.click();
    await searchField.fill(chargerId);
    

    // Check if <tr> with this charger exists
   const chargerRow = page.locator(`//tr[.//p[text()="${chargerId}"]]`);

try {
    await chargerRow.waitFor({ state: "visible", timeout: 10000 });
    console.log("New charger added to list");
} catch (err) {
    console.log("Charger not added to list");
}


  await chargerRow.click();
await page.waitForLoadState("networkidle");
await page.waitForTimeout(2000);


    // Charger Reconfiguration Flow 
 await chargers.ChargerReconfiguration(data);

 await page.reload({ waitUntil: "networkidle" });
 await page.waitForTimeout(2000);


// Latest Charge Counts
 const afterCount = await chargers.getAfterChargerCounts();
console.log("After Count:", afterCount);

//Verify if count increased
    if (afterCount > beforeCount) {
        console.log("Charger count increased");
    } else {
        console.log("Charger count did NOT increase");
    }

// Validate configuration
 await chargers.Validateconfiguration(chargerId, data);


// Get Installation & Reconfiguration dates
 const { installDate, reconfigDate } = await chargers.ReconfigurationDates();
console.log("Installation Date:", installDate);
console.log("Reconfiguration Date:", reconfigDate);

// Excel Download Flow
const filePath = await chargers.downloadExcel();
    console.log("Downloaded Excel file path:", filePath);
    

    // Read Charger IDs from Excel
 const chargerIdCount = await chargers.countChargerIdsInExcel(filePath);
    console.log("Number of Charger IDs in Excel:", chargerIdCount);


// Excel Download & Validate count
await chargers.verifyExcelCountMatchesUI(afterCount);


});

  });


