import { test, expect } from '../fixtures/login.fixture';
import { DashboardPage } from '../pages/DashBoard';

test('Verify Dashboard Values', async ({ loggedInPage }) => {
    const page = loggedInPage;
    const dashboard = new DashboardPage(page);

    // Navigate to dashboard URL here
    await page.goto("https://novo.kazam.in/org/nikolev/46f85af4-f77d-4ea0-bbd2-955517ebad82/cpo");
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

      console.log("Dashboard Charger Data(Offline and Online):", dashboardData);

       await dashboard.OnlineFilter()
        await page.waitForTimeout(3000);
         const dashboardOnlineCounts = await dashboard.getDashboardChargerCounts();
         const dashboardOnlineStatus = await dashboard.getDashboardConnectorStatusCounts();

        const dashboardOnlineData = {
        chargers: dashboardOnlineCounts.chargers,
        connectors: dashboardOnlineCounts.connectors,
        nonConfigured: dashboardOnlineCounts.nonConfigured,

        all: dashboardOnlineStatus.All,
        busy: dashboardOnlineStatus.Busy,
        available: dashboardOnlineStatus.Available,
        error: dashboardOnlineStatus.Error
      };


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

      console.log("Charger Page Data(Offline And Online):", chargerData);

     // Compare Dashboard vs Charger page data
      expect(chargerData.chargers.trim()).toBe(dashboardData.chargers.trim());
      expect(chargerData.connectors.trim()).toBe(dashboardData.connectors.trim());
      expect(chargerData.nonConfigured.trim()).toBe(dashboardData.nonConfigured.trim());
      expect(chargerData.all.trim()).toBe(dashboardData.all.trim());
      expect(chargerData.busy.trim()).toBe(dashboardData.busy.trim());
      expect(chargerData.available.trim()).toBe(dashboardData.available.trim());
      expect(chargerData.error.trim()).toBe(dashboardData.error.trim());
      console.log(" Dashboard and Charger page Offline and Online Chargers Counters Match");


      //dashboard online charger data
      console.log("Dashboard Online Chargers Data:", dashboardOnlineData);
      await dashboard.OnlineFilterCharger()
      await page.waitForTimeout(3000);
      const chargerOnlineCounts = await dashboard.getChargerCounts();
      const chargerOnlineStatus = await dashboard.getConnectorStatusCounts();

      const chargerOnlineData = {
        chargers: chargerOnlineCounts.chargers,
        connectors: chargerOnlineCounts.connectors,
        nonConfigured: chargerOnlineCounts.nonConfigured,

        all: chargerOnlineStatus.All,
        busy: chargerOnlineStatus.Busy,
        available: chargerOnlineStatus.Available,
        error: chargerOnlineStatus.Error
      };
      console.log("Charger Page Online Chargers Data:", chargerOnlineData);
      // Compare Dashboard vs Charger page data
      expect(chargerOnlineData.chargers.trim()).toBe(dashboardOnlineData.chargers.trim());
      expect(chargerOnlineData.connectors.trim()).toBe(dashboardOnlineData.connectors.trim());
      // expect(chargerOnlineData.nonConfigured.trim()).toBe(dashboardOnlineData.nonConfigured.trim());
      expect(chargerOnlineData.all.trim()).toBe(dashboardOnlineData.all.trim());
      expect(chargerOnlineData.busy.trim()).toBe(dashboardOnlineData.busy.trim());
      expect(chargerOnlineData.available.trim()).toBe(dashboardOnlineData.available.trim());
      expect(chargerOnlineData.error.trim()).toBe(dashboardOnlineData.error.trim());
      console.log(" Dashboard and Charger page Online Chargers Counters Match");

});

    test('User Creation And Verification', async ({ loggedInPage }) => {
        const page = loggedInPage;
        const dashboard = new DashboardPage(page);
        await page.goto("https://novo.kazam.in/org/Tyagi_Org/1b8d6bd0-22f5-4cd5-b794-1ce364573a30/cpo",{ waitUntil: "networkidle" });
        await page.waitForLoadState("networkidle");

        // Test Data
        const Data ={
            RoleName: "CMS View Role Only",
            RoleDescription: "RoleDescription",
            UserEmail: await dashboard.generateDummyEmail(),
            UserDesignation: "QA Engineer"
            
        }

        // Create User Role
        await dashboard.UserCreation(Data);
        await page.waitForTimeout(3000);
        console.log("User Role Created Successfully");

        //Role Verification
        const roleDetails = await dashboard.RoleValidation();
        expect(roleDetails.name).toBe(Data.RoleName);
        expect(roleDetails.description).toBe(Data.RoleDescription);
        console.log("User Role Verified Successfully");
        console.log("Role Name:", roleDetails.name);
        console.log("Role Description:", roleDetails.description);


        // // User Invitation Verification
        // await dashboard.AddUser(Data);
        // await page.waitForTimeout(5000);
        // console.log("User Invitation Sent Successfully to:", Data.UserEmail);


        // Delete User Role
        await dashboard.RoleDeletion();
        await page.waitForTimeout(3000);
        console.log("User Role Deleted Successfully");
        
      });

      


    //Hub Creation
    test.only("Hub Creation,Validation And Deletion",async ({ loggedInPage })=>{

       const page = loggedInPage;
        const dashboard = new DashboardPage(page);
        await page.goto("https://novo.kazam.in/org/Tyagi_Org/1b8d6bd0-22f5-4cd5-b794-1ce364573a30/cpo/settings/org/manage-hub",{ waitUntil: "networkidle" });
        
      // Test Data
     const hubData = {
      HubName: 'Bangalore Central Hub',
      Lattitude: '12.9715987',
      Longitude: '77.5945627',
      Sanctionload: '50',
      State: 'Karnataka',
      DISCOM: 'Bangalore Electricity Supply Company Limited',
      BillNumber: '2024021098',
      ConnectorType: 'CCS2',
      PhoneNumber: '8431273913'
    };

    
    //HUB CREATION

    console.log('\nHub Creation Started');
    await dashboard.HubCreation(hubData);
    console.log(hubData);
    console.log(`Hub Added Successfully -> ${hubData.HubName}`);

    
    //OPEN HUB & VALIDATE
    await dashboard.HubDeletion(hubData);
    console.log('\nHub Deletion Started');
    console.log(`Hub Deleted Successfully -> ${hubData.HubName}`);

    
    // VALIDATE HUB DELETED
    await dashboard.HubSearch.fill(hubData.HubName);
    await page.waitForLoadState('networkidle');
    await expect(dashboard.HubCard.filter({ hasText: hubData.HubName })).toHaveCount(0);
    console.log('\nHub Deletion Validation Passed');
    await page.waitForTimeout(5000)
  });

