import { test, expect } from "../fixtures/login.fixture";
export class ErrorCodeVal{

    constructor(page) {
        this.page = page;
        this.ErrorCodeColumnHeader = page.locator("//div[text()='Error Code']");
        this.ErrorCodeValue = page.locator("//*[@id='scroll_listener']/table/tbody/tr[1]/td[11]/div/div");
        this.ChargerRow = page.locator("//*[@id='scroll_listener']/table/tbody/tr[1]");
        this.ErrorCodeRows = page.locator("//*[@id='cms-app-main-content']//div[contains(@class,'div')]//p[5]");
        this.TableFieldEdit = page.locator("//button[normalize-space()='Table Field']");
        this.ErrorCodeColumn = page.locator("//li[contains(@data-item_id,'error_code')]//div[contains(@class,'flex gap-1 items-center text-gray-500')]");
        this.SelectedColumnsList = page.locator("(//ul[@class='flex flex-col divide-y h-96 overflow-auto slim-scrollbar pb-20'])[2]");
        this.ApplyBtn = page.locator("//button[normalize-space()='Apply']");
    }

    // "Error Code" column is visible, if not, edit table fields to add it
    async ClickOnEditTableField() {
        if (await this.ErrorCodeColumnHeader.isVisible()) {
            console.log("Error Code column is already visible. No need to edit table fields.");
            return;
        }
        await this.TableFieldEdit.click();
        await this.page.waitForTimeout(2000);
        // Drag "Error Code" column to selected list
        await this.ErrorCodeColumn.dragTo(this.SelectedColumnsList);
        await this.page.waitForTimeout(2000);
        await this.ApplyBtn.click();
        await this.page.waitForTimeout(3000);
    }


    async getErrorCodeColumnIndex() {
  const headers = this.page.locator("//table//th");
  const count = await headers.count();

  for (let i = 0; i < count; i++) {
    const text = (await headers.nth(i).innerText()).trim();

    if (text === "Error Code") {
      return i + 1; // XPath is 1-based
    }
  }

  throw new Error("Error Code column not found");
}

    // // Get the "Error Code" value from the main table for the first charger
    // async GetErrorCodeValue() { 
    //     const errorCode = (await this.ErrorCodeValue.textContent())?.trim();
    //     console.log("Error Code Value: ",errorCode);
    //     await this.ChargerRow.click();
    //     await this.page.waitForLoadState("networkidle");
    //     return errorCode;
    // }


async GetErrorCodeValue() {
  const colIndex = await this.getErrorCodeColumnIndex();
  const errorCode = (await this.page.locator(`//*[@id='scroll_listener']//tr[1]/td[${colIndex}]`).textContent()).trim();
  const ChargeId = (await this.page.locator(`//*[@id="scroll_listener"]/table/tbody/tr[1]/td[2]`).textContent()).trim();
  console.log("Error Code Value in Chargers Table:", errorCode);
  console.log("Charge ID:", ChargeId);
  await this.ChargerRow.click();
  await this.page.waitForLoadState("networkidle");
  return errorCode;
}

// Get the list of "Error Codes" from the charger details page
  async GetErrorCode() {
  await this.ErrorCodeRows.first().waitFor({ state: "visible", timeout: 20000 });
  const elements = this.ErrorCodeRows;
  const count = await elements.count();
  const results = [];
  for (let i = 0; i < count; i++) {
    const text = (await elements.nth(i).textContent())?.trim();
    results.push(text); // trim for safe comparison
  }
  console.log("Error Codes in Charger Details: ",results);
  return results;
}  

// async GetErrorCode() {
//   await this.page.waitForSelector("//table/tbody/tr/td[5]");
//   const elements = this.ErrorCodeRows;
//   const count = await elements.count();
//   const results = [];
//   for (let i = 0; i < count; i++) {
//     const text = (await elements.nth(i).innerText())?.trim();
//     results.push(text);
//   }
//   console.log("Error Codes in Charger Details:", results);
//   return results;
// }
// Validate that the "Error Code" value from the main table is present in the list of "Error Codes" in the charger details page
async ValidateErrorCodeValue() {

  const singleValue = await this.GetErrorCodeValue(); // "NoError,NoError"
  const listValues = await this.GetErrorCode();       // ["NoError", "NoError"]

  const expectedValues = singleValue
    .split(",")
    .map(v => v.trim());

  try {
    expect(
      listValues,
      "Error Code value from main table is not present in charger details"
    ).toEqual(expectedValues);

    console.log("🟢 Error Code value from main table is present in charger details");

  } catch (error) {

    console.log("🔴 Error Code value from main table is NOT present in charger details");

    throw error; // keeps test failing properly
  }

  await this.page.waitForTimeout(3000);
}
}