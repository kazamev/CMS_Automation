import { test, expect } from '../fixtures/login.fixture';
const { OrganisationPage } = require('../pages/OrgListpage');

  test('Organisation Validation', async ({ loggedInPage }) => {
    const page = loggedInPage;  
    const orgPage = new OrganisationPage(page);

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
    
    

    //Get dashboard organisation details
   const dashData=await orgPage.getOrganisationDetails();


   //Validate organisation details between org list and dashboard
   await orgPage.validateOrgVsDashboard(orgData, dashData)




});
