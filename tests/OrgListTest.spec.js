import { test, expect } from '../fixtures/login.fixture';
const { OrganisationPage } = require('../pages/OrgListpage');

  test('Organisation List', async ({ loggedInPage }) => {
    const page = loggedInPage;  
    const orgPage = new OrganisationPage(page);

    //Count total organisations
    const count = await orgPage.getOrganisationCount();
    console.log("Total organisations:", count);

    //Print details of a specific organisation
    const orgData = await orgPage.getOrganisationDetailsByName("Tyagi's Org");
    console.log(orgData);

    // Click rquired organisation
    const requiredOrg = "Tyagi's Org";
    await orgPage.selectOrganisation(requiredOrg);
    await expect(page).toHaveTitle("Offerings - CMS");
    console.log("Navigated to the offerings page");
    

    // Click Continue to Dashboard
    await orgPage.clickContinueToDashboard();
    await expect(page).toHaveTitle("Dashboard - CMS");
    

    //Get dashboard organisation details
   const dashData=await orgPage.getOrganisationDetails();



//Validate organisation details between org list and dashboard
   await orgPage.validateOrgVsDashboard(orgData, dashData)




});
