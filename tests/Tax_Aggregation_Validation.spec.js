
import { test, expect } from "../fixtures/login.fixture";
import { TaxAggregationVal } from "../pages/Tax_Aggregation";

test.only('Create, Validate and Delete State Of Charge Tariff', async ({loggedInPage}) => {
  test.setTimeout(200000)
    const Aggregation = new TaxAggregationVal(page);
    const page = loggedInPage;
    await page.goto("https://novo.kazam.in/org/Tyagi_Org/1b8d6bd0-22f5-4cd5-b794-1ce364573a30/cpo/revenue_management/overview");
    await page.waitForLoadState("networkidle");

    const Data = {
        TariffName: "Test Aggregation",
        Amount:10
    }

    await Aggregation.CreateAggregationFee(Data.TariffName, Data.Amount);
    await Aggregation.ValidateAggregationFee(Data.TariffName);
    await Aggregation.DeleteAggregationFee();
    

});