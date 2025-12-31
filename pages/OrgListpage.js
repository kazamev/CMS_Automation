class OrganisationPage {
    constructor(page) {
        this.page = page;
        this.orgCards = page.locator("//div[contains(@class,'flex') and contains(@class,'cursor-pointer')]");
        this.continueBtn = page.locator("//div[contains(text(),'Continue to Dashboard')]");
    }

    // go to the organisation page
    async goTo() {await this.page.goto("https://novo.kazam.in/org");
    }

    //total card count
    async getOrganisationCount() {
         await this.orgCards.first().waitFor({state: 'visible', timeout: 30000})
        return await this.orgCards.count();
    }

    // Print text from Desired card
    async getOrganisationDetailsByName(orgName) {

    const count = await this.orgCards.count();
    for (let i = 0; i < count; i++) {

        const card = this.orgCards.nth(i);
        const nameText = (await card.locator("p.two_line_wrapper").textContent()).trim();
        if (nameText !== orgName) continue;
        const safe = async (locator) =>
            (await locator.count()) ? (await locator.first().textContent()).trim() : "NA";

        const users    = await safe(card.locator("p:text-matches('Users')"));
        const date     = await safe(card.locator("div svg.feather-calendar + p"));
        const plan     = await safe(card.locator("div svg.feather-award + p"));
        const country  = await safe(card.locator("div svg.feather-globe + p"));
        const timezone = await safe(card.locator("div svg.feather-clock + p"));
        const currencyBlock = card.locator("xpath=.//div[count(.//p)=2 and not(.//svg)]");
        const currencySymbol = await safe(currencyBlock.locator("xpath=.//p[1]"));
        const currencyName   = await safe(currencyBlock.locator("xpath=.//p[2]"));
        return {
            name: nameText,
            users,
            date,
            plan,
            country,
            currency: {
                symbol: currencySymbol,
                name: currencyName
            },
            timezone
        };
    }

    return null;
}



   // Click a required organisation card by name
   async selectOrganisation(orgName) {
    await this.page.getByText(orgName, { exact: true }).click();   
  }

   // Click Continue to Dashboard button
    async clickContinueToDashboard() {
        const continueBtn = this.continueBtn;
        await continueBtn.waitFor({ state: "visible", timeout: 15000 });
        await continueBtn.click();
        console.log("Clicked on 'Continue to Dashboard'");
    }
}
module.exports = { OrganisationPage };
