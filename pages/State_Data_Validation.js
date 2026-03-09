exports.StateDataPage = class StateDataPage {

    constructor(page) {
        this.page = page;
        this.stateDropdown = page.locator("button:has-text('All States')");
        this.statefilter=page.locator("//div[@class='flex gap-2 items-end']//button[2]");
        this.SesFilter=page.locator("//div[@class='flex justify-between']//button[2]")
        this.StateSelect=page.locator("//input[@placeholder='Select state']");
        this.ApplyBtn=page.locator("//button[normalize-space()='Apply']");

    }

//HUB SELECTION IN DASHBOARD
    async StateSelection(Data){
    await this.stateDropdown.click();
     await this.page.locator(`//div[contains(text(),"${Data.State}")]`).click();
     await this.page.waitForLoadState("networkidle");
     console.log(`Selected State is : ${Data.State}`);
    
        }

//HUB SELECTION IN CHARGERPAGE
    async applyStateFilter(Data) {
    await this.statefilter.click();
    await this.StateSelect.click();
    await this.page.waitForTimeout(1000);
    const option = this.page.locator(`//span[normalize-space()='${Data.State}']`).first();
    await option.waitFor();
    await option.click();
    await this.ApplyBtn.click();
    await this.page.waitForTimeout(1000);
    await this.page.waitForLoadState("networkidle");
}

//HUB SELECTION IN SESSIONPAGE
async SesStateFilter(Data){
    await this.SesFilter.click();
    await this.page.locator("//input[@name='geo_state']").click();
    await this.page.waitForTimeout(1000);
    const upperState = Data.State.toUpperCase();
    const option = this.page.locator(`//span[normalize-space()='${upperState}']`).first();
    await option.waitFor({ state: 'visible' });
    await option.click();
    await this.ApplyBtn.click();
    await this.page.waitForTimeout(1000);
    await this.page.waitForLoadState("networkidle");
}
}