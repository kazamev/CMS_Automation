import { test, expect } from '../fixtures/login.fixture';
import { ChargerTariffPage } from "../pages/ChargerTariff";

  test("Charger Tariff Creation And Deletion", async ({ loggedInPage }) => {
    const page = loggedInPage;
    const tariffPage = new ChargerTariffPage(page);
      await page.goto("https://novo.kazam.in/org/zynetic_electric_vehicle_charging_llc/7aff5403-3de3-4273-9665-099574cf2048/cpo");
     const currentUrl = page.url();
        const orgName = currentUrl.split('/org/')[1].split('/')[0];

        //Print organisation name
        console.log(`\nOrganisation Name: ${orgName}\n`);
    
         
    const tariffName = `Auto_Tariff_${Date.now()}`;
    const amount = "1";

    // Create tariff
    console.log(`Start Flat Tariff Creation : ${tariffName}`);
    await tariffPage.createTariff(tariffName);
    await tariffPage.selectStartAndEndDate();
    await tariffPage.addPrice(amount);

    // Search & link charger
    await tariffPage.searchAndLinkCharger();

    // Review page
    const reviewDetails = await tariffPage.getReviewAndConfirmDetailsAsTable();

    // Create tariff
    await tariffPage.createTariffFinal();
    console.log(`\nFlat Tariff Created Successfully: ${tariffName}\n`);
    console.log(`Remove the linked charger successfully to delete the tariff`);

    //delete tariff after creation
    await tariffPage.deleteTariff(tariffName);
    console.log("\nFlatTariff deleted successfully\n");
   
     // Create Fast Charging tariff
     const fastTariffName = `Auto_Fast_Tariff_${Date.now()}`;
    

    console.log(`Start Fast Charging Tariff Creation : ${fastTariffName}`);
    await tariffPage.createTariff(fastTariffName);
    await tariffPage.selectStartAndEndDateForFastCharging();
    await tariffPage.addPrice(amount);

    // Search & link charger
    await tariffPage.searchAndLinkCharger();

    // Review page
    const reviewDetailsforFastCharging = await tariffPage.getReviewAndConfirmDetailsAsTable();

    // Create tariff
    await tariffPage.createTariffFinal();
    console.log(`\nFast Charging Tariff Created Successfully: ${fastTariffName}\n`);
    console.log(`Remove the linked charger successfully to delete the tariff`);

    //delete tariff after creation
    await tariffPage.deleteTariff(fastTariffName);
    console.log("\nFast Charging Tariff deleted successfully\n");


// Create Time Of Day tariff
     const timeOfDayTariffName = `Auto_TimeOfDay_Tariff_${Date.now()}`;
    

    console.log(`Start Time Of Day Tariff Creation : ${timeOfDayTariffName}`);
    await tariffPage.createTariff(timeOfDayTariffName);
    await tariffPage.selectStartAndEndDateForTimeOfDay();

  await tariffPage.setTimeRangeForTimeOfDay("10:00 hrs", "12:00 hrs");
    
    await tariffPage.addPrice(amount);

    // Search & link charger
    await tariffPage.searchAndLinkCharger();

    // Review page
    const reviewDetailsforTimeOfDay = await tariffPage.getReviewAndConfirmDetailsAsTable();

    // Create tariff
    await tariffPage.createTariffFinal();
    console.log(`\nTime Of Day Tariff Created Successfully: ${timeOfDayTariffName}\n`);
    console.log(`Remove the linked charger successfully to delete the tariff`);

    //delete tariff after creation
    await tariffPage.deleteTariff(timeOfDayTariffName);
    console.log("\nTime Of Day Tariff deleted successfully\n");

    // Create Charge By Hour tariff
     const chargeByHourTariffName = `Auto_ChargeByHour_Tariff_${Date.now()}`;
    
    console.log(`Start Charge By Hour Tariff Creation : ${chargeByHourTariffName}`);
    await tariffPage.createTariff(chargeByHourTariffName);

    // Select hour range and add price  
    await tariffPage.selectStartAndEndDateForHourTariff();

    // Set price for hour range
    await tariffPage.setChargeByHour(amount);


    // Search & link charger
    await tariffPage.searchAndLinkCharger();

    // Review page
    const reviewDetailsforChargeByHour = await tariffPage.getReviewAndConfirmDetailsAsTable();

    // Create tariff
    await tariffPage.createTariffFinal();
    console.log(`\nCharge By Hour Tariff Created Successfully: ${chargeByHourTariffName}\n`);
    console.log(`Remove the linked charger successfully to delete the tariff`);

    //delete tariff after creation
    await tariffPage.deleteTariff(chargeByHourTariffName);
    console.log("\nCharge By Hour Tariff deleted successfully\n");

    // await tariffPage.searchTariffAndGetDetailsAsTable(tariffName);

    // // Verify tariff after creation
    // const createdDetails = await tariffPage.verifyTariff(chargerId);
    // // Compare entered vs created values
    // expect(createdDetails).toContain(amount);
    // expect(reviewDetails).toContain(amount);
    // Edit and update tariff
    // await tariffPage.editAndUpdateTariff();
  });
  
