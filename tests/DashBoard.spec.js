import { test, expect } from '../fixtures/login.fixture';

import { DashboardPage } from '../pages/DashBoard';


test('Verify dashboard values', async ({ loggedInPage }) => {
    const page = loggedInPage;
    const dashboard = new DashboardPage(page);
  

const orgData=await orgPage.getOrganisationDetailsByName("Future Mobility")

    // Navigate to dashboard URL here
    await page.goto("https://novo.kazam.in/org/Tyagi_Org/1b8d6bd0-22f5-4cd5-b794-1ce364573a30/cpo");
    await page.waitForLoadState("networkidle");
    


    const revenue = await dashboard.getRevenue();
    console.log("Revenue:", revenue);

    const sessions = await dashboard.getTotalSessions();
    console.log("Sessions:", sessions);

    const usage = await dashboard.getUsage();
    console.log("Usage:", usage);

    const onlinePercentage = await dashboard.getOnlinePercentage();
    console.log("Online Percentage:", onlinePercentage);

    const totalChargers = await dashboard.getChargerCounters();
    console.log("Total Chargers:", totalChargers);

    const counters = await dashboard.getConnectorStatusCounts();
   console.log("Charger Counters:", counters);


});

