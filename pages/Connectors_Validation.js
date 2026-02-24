exports.ConnectorPage = class ConnectorPage {

    constructor(page) {
        this.page = page;
        this.ChargePagefilter=page.locator("//div[@class='flex gap-2 items-end']//button[2]");
        this.ConnectorSelect=page.locator("//input[@placeholder='Select connector type']");
        this.ApplyBtn=page.locator("//button[normalize-space()='Apply']");
        this.ChargerRow= page.locator("//*[@id='scroll_listener']/table/tbody/tr").first();
    }

    //HUB SELECTION IN CHARGERPAGE
    async applyStateFilter(Data) {
    await this.ChargePagefilter.click();
    await this.ConnectorSelect.click();
    await this.page.waitForTimeout(1000);
    const option = this.page.locator(`//span[normalize-space()='${Data.Connector}']`).first();
    await option.waitFor();
    await option.click();
    await this.ApplyBtn.click();
    await this.page.waitForTimeout(1000);
    await this.page.waitForLoadState("networkidle");
}
  
//SELECT FIRST ROW


}