exports.ConnectorPage = class ConnectorPage {

    constructor(page) {
        this.page = page;
        this.ChargePagefilter=page.locator("//div[@class='flex gap-2 items-end']//button[2]");
        this.ConnectorSelect=page.locator("//input[@placeholder='Select connector type']");
        this.ApplyBtn=page.locator("//button[normalize-space()='Apply']");
        this.ChargerRow= page.locator("//*[@id='scroll_listener']/table/tbody/tr").first();
        this.ChargerCount= page.locator("(//div[starts-with(normalize-space(),'All(')])[4]");

        
    }

    //CONNECTOR SELECTION IN CHARGERPAGE
    async applyStateFilter(Data) {
    await this.ChargePagefilter.click();
     await this.page.waitForTimeout(2000);
    await this.ConnectorSelect.click();
    await this.page.waitForTimeout(1000);
    const option = this.page.locator(`//span[normalize-space()='${Data.Connector}']`).first();
    await option.waitFor();
    await option.click();
    await this.page.waitForTimeout(2000);
    await this.ApplyBtn.click();
    await this.page.waitForTimeout(2000);
    await this.page.waitForLoadState("networkidle");
    console.log(`Selected Connector is : ${Data.Connector}`);
    const chargerCountText = await this.ChargerCount.textContent();
    const chargerCount = parseInt(chargerCountText.replace(/[^0-9]/g, ''));
    console.log('Total Chargers displayed for the selected connector type: ', chargerCount);
}
  
//SELECT FIRST ROW
async selectFirstRow(Data) {
     await this.page.waitForTimeout(2000);
    if (await this.ChargerRow.isVisible()) {
        await this.ChargerRow.click();
        await this.page.waitForLoadState("networkidle");
         await this.page.waitForTimeout(2000);
          const Connectors=await this.page.locator(`//div[@title="${Data.Connector}"]`);
          await this.page.waitForTimeout(5000);
          console.log("Number of Selected Connectors in the particuler charger: ", await Connectors.count());
        if (Connectors) {
        console.log("🟢Connector filter applied successfully");
         } else {
        console.log("🔴Connector filter not applied");
    }

    } else {
        console.log(`No Chargers available for the selected connector type: ${Data.Connector}`);
    }

    
   
}
 
}