import { ErrorCodeVal } from "../pages/Error_Code_Validation";
import { test, expect } from "../fixtures/login.fixture";


test('Validate Error Code', async ({loggedInPage}) => {
  test.setTimeout(120000);
  const errorCodeVal = new ErrorCodeVal(page);
  const page = loggedInPage;
   await page.goto("https://novo.kazam.in/org/nikolev/46f85af4-f77d-4ea0-bbd2-955517ebad82/cpo/chargers");
  await page.waitForLoadState("networkidle");

  //edit table and get error code
  await errorCodeVal.ClickOnEditTableField();

  //validate error code
  await errorCodeVal.ValidateErrorCodeValue();
    
});