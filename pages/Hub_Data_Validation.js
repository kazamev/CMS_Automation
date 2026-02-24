exports.HubDataPage = class HubDataPage {

    constructor(page) {
        this.page = page;
        this.hubDropdown = page.locator("button:has-text('All Hubs')");
        this.HubFilterInCharger=page.locator("//div[contains(@class,'flex gap-2 items-end')]//button[2]");
        this.HubSelectDropDown=page.locator("//input[@placeholder='Select hub']");
        this.ApplyBtn=page.locator("//button[normalize-space()='Apply']");
        this.HubFilterInSes=page.locator("//div[contains(@class,'flex gap-2')]//button[2]");
        this.HubDropdownSes=page.locator("//input[contains(@name,'zone')]");
        this.HubfilterInRevenue=page.locator("//button[@class='w-full flex gap-1 items-center bg-white py-2 px-3 border rounded-md bg-white']//*[name()='svg']");
        this.SelectSucessTrans=page.locator("//select[@class='border border-gray-300 bg-white rounded-lg text-sm focus:border-kazamGray-300 focus:ring-kazamGray-300']");


    }

    //HUB SELECTION IN DASHBOARD
    async HubSelection(Data){
    await this.hubDropdown.click();
     await this.page.locator(`//div[contains(text(),"${Data.Hub}")]`).click();
     await this.page.waitForTimeout(4000);
     await this.page.waitForLoadState("networkidle");
     console.log(`Selected Hub is : ${Data.Hub}`);
    
        }



     //HUB SELECTION IN CHARGERPAGE
    async applyHubFilter(Data) {
    await this.HubFilterInCharger.click();
    await this.HubSelectDropDown.click();
    await this.page.waitForTimeout(1000);
    const option = this.page.locator(`//span[contains(normalize-space(), '${Data.Hub}')]`).first();
    await option.waitFor();
    await option.click();
     await this.page.waitForTimeout(3000);
    await this.ApplyBtn.click();
    await this.page.waitForTimeout(1000);
    await this.page.waitForLoadState("networkidle");
  }

// //HUB SELECTION IN SESSIONPAGE
     async HubFilter(Data){
      await this.HubFilterInSes.click();
    await this.HubDropdownSes.click();
    await this.page.waitForTimeout(1000);
    const upperState = Data.Hub.toUpperCase(); 
    const option = this.page.locator(`//span[contains(normalize-space(),'${upperState}')]`).first();
    await option.waitFor({ state: 'visible' });
    await option.click();
    await this.ApplyBtn.click();
    await this.page.waitForTimeout(1000);
    await this.page.waitForLoadState("networkidle");


     }



    //hub selection in Revenue Page
    async HubRevenueFilter(Data){
await this.HubfilterInRevenue.click();
await this.page.waitForTimeout(3000);
const UPPERSTATE = Data.Hub.toUpperCase(); 
    const option = this.page.locator(`//div[contains(text(),'${UPPERSTATE}')]`).first();
    await option.waitFor({ state: 'visible' });
    await option.click();
await this.page.waitForTimeout(1000);
    await this.page.waitForLoadState("networkidle");


    }

//Select only sucess Transactions in Revenue Page
async selectSuccessTransactions(){  
await this.SelectSucessTrans.click();
await this.page.waitForTimeout(3000);
await this.SelectSucessTrans.selectOption({ label: "Success" });
await this.page.waitForTimeout(4000);
await this.page.waitForLoadState("networkidle");    
}

}