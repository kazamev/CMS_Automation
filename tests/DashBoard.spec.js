import { test, expect } from '../fixtures/login.fixture';
import { DashboardPage } from '../pages/DashBoard';

test('Verify Dashboard Values', async ({ loggedInPage }) => {
    const page = loggedInPage;
    const dashboard = new DashboardPage(page);

    // Navigate to dashboard URL here
    await page.goto("https://novo.kazam.in/org/zynetic_electric_vehicle_charging_llc/7aff5403-3de3-4273-9665-099574cf2048/cpo");
    await page.waitForLoadState("networkidle");
    
   await dashboard.applyTimeFilterInDashboard("Yesterday");

    console.log("Yesterday DashBoard Data");
    const revenue = await dashboard.getRevenue();
    console.log("Revenue:", revenue);

    const sessions = await dashboard.getTotalSessions();
    console.log("Sessions:", sessions);

    const usage = await dashboard.getUsage();
    console.log("Usage:", usage);

    const onlinePercentage = await dashboard.getOnlinePercentage();
    console.log("Online Percentage:", onlinePercentage);

      const dashboardCounts = await dashboard.getDashboardChargerCounts();
      const dashboardStatus = await dashboard.getDashboardConnectorStatusCounts();

      const dashboardData = {
        chargers: dashboardCounts.chargers,
        connectors: dashboardCounts.connectors,
        nonConfigured: dashboardCounts.nonConfigured,

        all: dashboardStatus.All,
        busy: dashboardStatus.Busy,
        available: dashboardStatus.Available,
        error: dashboardStatus.Error
      };

      console.log("Dashboard Data:", dashboardData);



   await dashboard.navigateToChargersPage();

   await dashboard.applyTimeFilterinChargerPage("Yesterday");

   const chargerCounts = await dashboard.getChargerCounts();
      const chargerStatus = await dashboard.getConnectorStatusCounts();

      const chargerData = {
        chargers: chargerCounts.chargers,
        connectors: chargerCounts.connectors,
        nonConfigured: chargerCounts.nonConfigured,

        all: chargerStatus.All,
        busy: chargerStatus.Busy,
        available: chargerStatus.Available,
        error: chargerStatus.Error
      };

      console.log("Charger Page Data:", chargerData);

// Compare Dashboard vs Charger page data
      expect(chargerData.chargers.trim()).toBe(dashboardData.chargers.trim());
      expect(chargerData.connectors.trim()).toBe(dashboardData.connectors.trim());
      expect(chargerData.nonConfigured.trim()).toBe(dashboardData.nonConfigured.trim());
      expect(chargerData.all.trim()).toBe(dashboardData.all.trim());
      expect(chargerData.busy.trim()).toBe(dashboardData.busy.trim());
      expect(chargerData.available.trim()).toBe(dashboardData.available.trim());
      expect(chargerData.error.trim()).toBe(dashboardData.error.trim());

      console.log(" Dashboard and Charger page counters Match");

});




// test('User Creation And Verification', async ({ loggedInPage }) => {
//     const page = loggedInPage;
//     const dashboard = new DashboardPage(page);
//     await page.goto("https://novo.kazam.in/org/Tyagi_Org/1b8d6bd0-22f5-4cd5-b794-1ce364573a30/cpo",{ waitUntil: "networkidle" });
//     await page.waitForLoadState("networkidle");

//     // Test Data
//     const Data ={
//         RoleName: "CMS View Role Only",
//         RoleDescription: "RoleDescription",
//         UserEmail: await dashboard.generateDummyEmail(),
//         UserDesignation: "QA Engineer"
        
//     }

//     // Create User Role
//     await dashboard.UserCreation(Data);
//     await page.waitForTimeout(3000);
//     console.log("User Role Created Successfully");

//     //Role Verification
//     const roleDetails = await dashboard.RoleValidation();
//     expect(roleDetails.name).toBe(Data.RoleName);
//     expect(roleDetails.description).toBe(Data.RoleDescription);
//     console.log("User Role Verified Successfully");
//     console.log("Role Name:", roleDetails.name);
//     console.log("Role Description:", roleDetails.description);


//     // User Invitation Verification
//     await dashboard.AddUser(Data);
//     await page.waitForTimeout(5000);
//     console.log("User Invitation Sent Successfully to:", Data.UserEmail);


//     // Delete User Role
//     // await dashboard.RoleDeletion();
//     // await page.waitForTimeout(3000);
//     // console.log("User Role Deleted Successfully");
    
