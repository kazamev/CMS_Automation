import { test, expect } from '../fixtures/login.fixture';
const { OrganisationPage } = require('../pages/OrgListpage');
const { LoginPage } = require('../pages/loginPage');

// It ignored the default storage(cookies) to start with a clean session
test.use({ storageState: { cookies: [], origins: [] } });

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
    const orgData = await orgPage.getOrganisationDetailsByName("Atomz Power");
    console.log(orgData);

    // Click rquired organisation
    const requiredOrg = "Atomz Power";
    await orgPage.selectOrganisation(requiredOrg);
    await expect(page).toHaveTitle("Offerings - CMS");
    console.log("Navigated to the offerings page");
    

    // Click Continue to Dashboard
    await orgPage.clickContinueToDashboard();
    
    //Get organisation details from Manage Org page
   const dashData=await orgPage.getOrganisationDetails();


   //Validate organisation details between org list and dashboard
   await orgPage.validateOrgVsDashboard(orgData, dashData)

});
