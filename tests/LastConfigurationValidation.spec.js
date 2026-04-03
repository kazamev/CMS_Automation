import { test, expect } from "../fixtures/login.fixture";
import { LastConfigurationVal } from "../pages/LastConfigurationVal";


  // Add Charger Flow
  test("Validate Last Configuration Date", async ({ loggedInPage }) => {
    const page = loggedInPage;
    test.setTimeout(120000);
     await page.goto("https://novo.kazam.in/org/ev_pump/3c30aea2-8e99-416e-803a-7c777a73e8f3/cpo/chargers");
    await page.waitForLoadState("networkidle");
    const lastConfigVal = new LastConfigurationVal(page);

    // click on any charger
    await lastConfigVal.ClickOnFirstCharger();

    //Last Configuration value
    await lastConfigVal.getLastConfigurationValue();

    //Reconfiguration Value
    await lastConfigVal.getLastConfigurationValueInCharger();

    //Validation
    await lastConfigVal.ValidateLastConfigurationValue();

  });