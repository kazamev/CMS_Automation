import { test, expect } from '../fixtures/login.fixture';
import { DashboardPage } from '../pages/DashBoard';

test('Verify Dashboard Values', async ({ loggedInPage }) => {
    const page = loggedInPage;
    const dashboard = new DashboardPage(page);

    // Navigate to dashboard URL here
    await page.goto("https://novo.kazam.in/org/zynetic_electric_vehicle_charging_llc/7aff5403-3de3-4273-9665-099574cf2048/cpo");
    await page.waitForLoadState("networkidle");
    

    console.log("This month DashBoard Data");
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

