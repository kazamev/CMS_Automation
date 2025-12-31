const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');
const { OrganisationPage } = require('../pages/OrgListpage');

test('Organisation List', async ({ page }) => {
    const login = new LoginPage(page);
    const orgPage = new OrganisationPage(page);

    //Go to login page
    await login.goTo();

    //Perform login
    await login.validLogin("shilpa@kazam.in", "Shilpa@1234567890");
    await page.waitForLoadState('networkidle');

    //Count total organisations
    const count = await orgPage.getOrganisationCount();
    console.log("Total organisations:", count);

    //Print details of a specific organisation
    const organisations = await orgPage.getOrganisationDetailsByName("Tyagi's Org");
    console.log(organisations);

    // Click rquired organisation
    const requiredOrg = "Tyagi's Org";
    await orgPage.selectOrganisation(requiredOrg);
    await expect(page).toHaveTitle("Offerings - CMS");
    console.log("Navigated to the offerings page");
    

    // Click Continue to Dashboard
    await orgPage.clickContinueToDashboard();
    await expect(page).toHaveTitle("Dashboard - CMS");
    console.log("Navigated to the Dashboard page");
    // await page.pause()

});
