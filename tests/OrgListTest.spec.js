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

      const count = await orgPage.getOrganisationCount();
      console.log("Total organisations:", count);
    
      const orgData =
        await orgPage.getOrganisationDetailsByName("Atomz Power");
    
      console.log(orgData);
    
      const requiredOrg = "Atomz Power";
      await orgPage.selectOrganisation(requiredOrg);
    
      await expect(page).toHaveTitle("Offerings - CMS");
    
      await orgPage.clickContinueToDashboard();
    
      console.log("Navigated to the Manage Org");
    
      const dashData =
        await orgPage.getOrganisationDetails();
    
      const validation =
        await orgPage.validateOrgVsDashboard(orgData, dashData);
    
      expect(
        validation.success,
        validation.message
      ).toBeTruthy();
    

});
