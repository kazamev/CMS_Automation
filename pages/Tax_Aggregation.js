import { test, expect } from "../fixtures/login.fixture";
export class TaxAggregationVal{
    constructor(page) {
        this.page = page;

        //Locators for Tax Aggregation Fee Creation
        this.AggregationBtn = page.locator("//span[normalize-space()='Aggregation Fee']");
        this.CreateAgregationBtn = page.locator("//button[normalize-space()='Create Aggregation Fee']");
        this.AggregationNameInput = page.locator("//input[@id='large-input']");
        this.TaxPercentageInput = page.locator("(//input[@type='number'])[1]");
        this.NextBtn = page.locator("//button[normalize-space()='Next']");
        this.ChargerCheckbox = page.locator("(//input[@id='link-checkbox'])[2]");
        this.SubmitBtn = page.locator("(//button[@type='submit'][normalize-space()='Create Aggregation Fee'])[2]");

        //Locators for Tax Aggregation Fee Validation
        this.SearchInput = page.locator("(//input[contains(@placeholder,'Search by aggregation fee name')])[1]");
        this.AggCard= page.locator("//div[@class='flex flex-col gap-8 h-max w-full p-3 rounded-lg border hover:cursor-pointer hover:bg-gray-50 border-purple-500']");
        this.AggreNameDate= page.locator("//*[@id='cms-app-main-content']/div/div[2]/div[2]/div/div[1]/div[1]");
        this.ChargerDropdown= page.locator("(//button[@type='button'])[1]");
        this.Chargerid= page.locator("//*[@id='cms-app-main-content']/div/div[2]/div[2]/div/div[3]/div/div/div/div/div/div[2]/div/p[1]");
        this.editBtn= page.locator("//button[@class='text-gray-600 hover:text-black']//*[name()='svg']");
        this.Nxtbtn2= page.locator("//button[normalize-space()='Next']");
        this.DltBtn= page.locator("//button[@class='text-red-600']//*[name()='svg']");
        this.ConfirmDltBtn= page.locator("//button[normalize-space()='Confirm']");
        this.SubmitBtn2= page.locator("//*[@id='cms-app-main-content']/div/div[3]/div/div/div/div/div[3]/div[2]/button");
        this.AggPer= page.locator("//*[@id='cms-app-main-content']/div/div[2]/div[2]/div/div[2]");

        //Tax Creation
        this.taxBtn = page.locator("//span[normalize-space()='Tax']");
        this.CreateTaxBtn = page.locator("//button[normalize-space()='Create Tax System']");
        this.TaxInputname = page.locator("(//input[@id='large-input'])[1]");
        this.TaxPolicyDropdown = page.locator("//*[@id='cms-app-main-content']/div/div[3]/div/div/div/div/div[2]/div/div[2]/div[1]/div/div/input");
        this.TaxNum= page.locator("(//input[@id='large-input'])[2]");
        this.TaxName= page.locator("(//input[@id='large-input'])[3]");
        this.TaxAddress= page.locator("(//input[@id='large-input'])[4]");
        this.TaxNextBtn = page.locator("//button[normalize-space()='Next']");
        this.SubCatDropdown = page.locator("//*[@id='cms-app-main-content']/div/div[3]/div/div/div/div/div[2]/div/div[3]/div/div[2]/div/select");
        this.TaxAmountInput = page.locator("(//input[@placeholder='amount'])[1]");
        this.AmountTypeDropdown = page.locator("(//select[@placeholder='Select Type'])[1]");
        this.ChergerSelect= page.locator("(//input[@id='link-checkbox'])[2]");
        this.TaxSubmitBtn = page.locator("(//button[@type='submit'][normalize-space()='Create Tax System'])[2]");

        //Locators for Tax Validation
        this.TaxSearchInput = page.locator("(//input[contains(@placeholder,'Search by tax system')])[1]");
        this.TaxCard= page.locator("//div[@class='flex flex-col gap-8 h-max w-full p-3 rounded-lg border hover:cursor-pointer hover:bg-gray-50 border-purple-500']");
        this.TaxName2= page.locator("(//p[@class='text-xl'])[1]");
        this.BusinessNameDate= page.locator("(//div[@class='flex flex-col gap-2'])[1]");
        this.TaxAddress2= page.locator("//div[contains(@class,'flex flex-col gap-8 w-full rounded-md border p-4 overflow-y-auto')]//div[contains(@class,'flex flex-col gap-1')]");
        this.AssignedChargerBtn= page.locator("(//button[contains(@type,'button')])[1]");
        this.AssChargerId= page.locator("//*[@id='cms-app-main-content']/div/div[2]/div[2]/div/div[4]/div/div/div/div/div/div[2]/div/p[1]");
        this.taxEditBtn= page.locator("(//*[name()='svg'][@class='feather feather-edit-2 '])[1]");
        this.EditNxtBtn= page.locator("(//button[normalize-space()='Next'])[1]");
        this.EditSubmitBtn= page.locator("//button[normalize-space()='Update Tax System']");

        //Locators for Tax Deletion
        this.TaxDltBtn= page.locator("(//*[name()='svg'][contains(@class,'feather feather-trash')])[1]");
        this.ConfirmTaxDltBtn= page.locator("//button[normalize-space()='Confirm']");


    }

    async CreateAggregationFee(AggregationName,TaxPercentage) {
        await this.AggregationBtn.click();
        await this.page.waitForTimeout(2000);
        await this.CreateAgregationBtn.click();
        await this.page.waitForTimeout(2000);
        await this.AggregationNameInput.fill(AggregationName);
        await this.TaxPercentageInput.fill(String(TaxPercentage));
        await this.NextBtn.click();
        await this.page.waitForTimeout(2000);
        await this.ChargerCheckbox.click();
        await this.SubmitBtn.click();
        await this.page.waitForLoadState("networkidle");
        console.log(`"${AggregationName}" created successfully with Tax Percentage: ${TaxPercentage}%`);
    }

    // async ValidateAggregationFee(AggregationName) {
    //     await this.SearchInput.fill(AggregationName);
    //     await this.page.waitForTimeout(2000);   
    //     if (await this.AggCard.isVisible()) {
    //         await this.AggCard.click();
    //         const nameDateText = await this.AggreNameDate.textContent();
    //         console.log("Aggregation Fee Name and Creation Date: ", nameDateText.trim());
    //         const aggPerText = await this.AggPer.textContent();
    //         console.log("Tax Percentage: ", aggPerText.trim());
    //         await this.ChargerDropdown.click();
    //          await this.page.waitForTimeout(2000);
    //         const chargerId = await this.Chargerid.textContent();
    //         console.log("Associated Charger ID: ", chargerId.trim());

    //     }
    // }



    async ValidateAggregationFee(AggregationName,TaxPercentage) {
    await this.SearchInput.fill(AggregationName);
    await this.page.waitForTimeout(2000);   
    if (await this.AggCard.isVisible()) {
        await this.AggCard.click();

        // Get Name + Date
        const nameDateText = (await this.AggreNameDate.textContent())?.trim();
        

        // Split name and date
        const [name, date] = nameDateText.split("Created on").map(t => t.trim());
        // console.log("Aggregation Fee Name:", name);
        // console.log("Creation Date:", date);

        //Get Percentage
        const aggPerText = (await this.AggPer.textContent())?.trim();
       

        const percentage = aggPerText.match(/\d+/)?.[0]; // extracts 10
        // console.log("Tax Percentage:", percentage);

        //Get Charger ID
        await this.ChargerDropdown.click();
        await this.page.waitForTimeout(2000);

        const chargerId = (await this.Chargerid.textContent())?.trim();
        // console.log("Associated Charger ID:", chargerId);

        //Return all values
        return {
            name,
            date,
            percentage,
            chargerId
        };
    }
}

   async DeleteAggregationFee() {
        await this.editBtn.click();
        await this.page.waitForTimeout(2000);
        await this.Nxtbtn2.click();
        await this.page.waitForTimeout(2000);
        await this.ChargerCheckbox.click();
        await this.page.waitForTimeout(2000);
        await this.SubmitBtn2.click();
        await this.page.waitForLoadState("networkidle");
        console.log("Aggregation Fee updated successfully by removing the associated charger");
        await this.DltBtn.click();
        await this.page.waitForTimeout(2000);
        await this.ConfirmDltBtn.click();
        await this.page.waitForLoadState("networkidle");
        console.log("Aggregation Fee deleted successfully");
    }
    

    //Tax Creation
        async CreateTax(TaxName, TaxNum,TaxPolicy, BusinessName, BusinessAddress, SubCategory, Amount, AmountType) {
        await this.taxBtn.click();
        await this.page.waitForTimeout(2000);
        await this.CreateTaxBtn.click();    
        await this.page.waitForTimeout(2000);
        await this.TaxInputname.fill(TaxName);
        await this.TaxPolicyDropdown.click();
        await this.page.locator(`//li[normalize-space()='${TaxPolicy}']`).click();
        await this.TaxNum.fill(TaxNum);
        await this.TaxName.fill(BusinessName);
        await this.TaxAddress.fill(BusinessAddress);
        await this.SubCatDropdown.click();
        await this.page.waitForTimeout(2000);
        await this.SubCatDropdown.selectOption(SubCategory);
        await this.TaxAmountInput.fill(String(Amount));
        await this.AmountTypeDropdown.click();
        await this.AmountTypeDropdown.selectOption(AmountType);
        await this.TaxNextBtn.click();
        await this.page.waitForTimeout(2000);
        await this.ChergerSelect.click();
        await this.TaxSubmitBtn.click();
        await this.page.waitForLoadState("networkidle");
        console.log(`"${TaxName}" created successfully with Tax Number: ${TaxNum}`);

        }
        
    //Tax Validation
    // async ValidateTax(TaxName, TaxNum,TaxPolicy, BusinessName, BusinessAddress, SubCategory,Amount, AmountType) {
    //     await this.TaxSearchInput.fill(TaxName);
    //     await this.page.waitForTimeout(2000);
    //     if (await this.TaxCard.isVisible()) {
    //         await this.TaxCard.click(); 
    //         const taxName = await this.TaxName.textContent();
    //         console.log("Tax Name: ", taxName.trim());
    //         const businessNameDate = await this.BusinessNameDate.textContent();
    //         console.log("Business Name and Creation Date: ", businessNameDate.trim());
    //         const taxAddress = await this.TaxAddress.textContent();
    //         console.log("Business Address: ", taxAddress.trim());
    //         await this.AssignedChargerBtn.click();
    //         await this.page.waitForTimeout(2000);
    //         const assignedChargerId = await this.AssChargerId.textContent();
    //         console.log("Assigned Charger ID: ", assignedChargerId.trim());
    //     }
    // }


    async ValidateTax(TaxName, TaxNum, TaxPolicy, BusinessName, BusinessAddress, SubCategory, Amount, AmountType) {

    await this.TaxSearchInput.fill(TaxName);
    await this.page.waitForTimeout(2000);

    if (await this.TaxCard.isVisible()) {
        await this.TaxCard.click();

        //Tax Name
        const taxName = (await this.TaxName2.textContent())?.trim();
        // console.log("Tax Name:", taxName);

        //Business Name + taxid
        const text = (await this.BusinessNameDate.textContent())?.trim();
       const businessName = text.match(/Business Name\s*:\s*(.*?)\s*Tax id/i)?.[1];
       const taxid = text.match(/Tax id\s*:\s*(.*)/i)?.[1];
       
    //   console.log("Business Name:", businessName);
    //    console.log("Tax ID:", taxid);

        // Address
        const taxAddress = (await this.TaxAddress2.textContent())?.trim();
        const address = taxAddress.replace(/Address\s*/i, "").trim();
        // console.log("Business Address:", address);

        // Assigned Charger
        await this.AssignedChargerBtn.click();
        await this.page.waitForTimeout(2000);

        const assignedChargerId = (await this.AssChargerId.textContent())?.trim();
        // console.log("Assigned Charger ID:", assignedChargerId);

        //Return structured object
        return {
            taxName,
            businessName,
            taxid,
            address,
            assignedChargerId
        };
    }
}

    //Tax Deletion
    async DeleteTax() {
        await this.taxEditBtn.click();
        await this.page.waitForTimeout(2000);
        await this.EditNxtBtn.click();
        await this.page.waitForTimeout(2000);
        await this.ChergerSelect.click();
        await this.EditSubmitBtn.click();
        await this.page.waitForLoadState("networkidle");
        console.log("Tax updated successfully by removing the associated charger");
        await this.TaxDltBtn.click();
        await this.page.waitForTimeout(2000);
        await this.ConfirmTaxDltBtn.click();
        await this.page.waitForTimeout(2000);
        await this.page.waitForLoadState("networkidle");
        console.log("Tax deleted successfully");    
    }
}
       

