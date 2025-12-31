import { test, expect } from '../Fixtures/loginFixture';
import { ChargerTariffPage } from "../pages/ChargerTariff";

test.describe("Charger Tariff Flow", () => {
  test("Charger Tariff", async ({ loggedInPage }) => {
    const page = loggedInPage;
    const tariffPage = new ChargerTariffPage(page);
    const tariffName = `Auto_Tariff_${Date.now()}`;
    const chargerId = "244a95";
    const amount = "1";

    // Navigate
    await tariffPage.navigate();

    // Create tariff
    await tariffPage.createTariff(tariffName);
    await tariffPage.selectStartAndEndDate();
    await tariffPage.addPrice(amount);

    // Search & link charger
    await tariffPage.searchAndLinkCharger(chargerId);

    // Review page
    const reviewDetails = await tariffPage.getReviewAndConfirmDetailsAsTable();

    // Create tariff
    await tariffPage.createTariffFinal();


    await tariffPage.searchTariffAndGetDetailsAsTable(tariffName);

    // // Verify tariff after creation
    // const createdDetails = await tariffPage.verifyTariff(chargerId);
    // // Compare entered vs created values
    // expect(createdDetails).toContain(amount);
    // expect(reviewDetails).toContain(amount);
    // Edit and update tariff
    // await tariffPage.editAndUpdateTariff();
  })
  });
