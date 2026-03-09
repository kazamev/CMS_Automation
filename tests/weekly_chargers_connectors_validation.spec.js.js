import { test, expect } from '../fixtures/login.fixture';
import { NewDashboardPage } from '../pages/WeeklyChargersAndConnectors';

test('Verify Dashboard Values', async ({ loggedInPage }) => {
    const page = loggedInPage;
    const dashboard = new NewDashboardPage(page);

    // Navigate to dashboard URL here
    
   await page.goto("https://novo.kazam.in/org/zynetic_electric_vehicle_charging_llc/7aff5403-3de3-4273-9665-099574cf2048/cpo");
   await page.waitForLoadState("networkidle");
       
   
       const currentUrl = page.url();
       const orgName = currentUrl.split('/org/')[1].split('/')[0];
   
        //Print organisation name
       console.log(`\nOrganisation Name: ${orgName}\n`);
   
       await dashboard.applyTimeFilterInDashboard("Calendar");
       await page.waitForLoadState('networkidle');
       await page.waitForTimeout(5000);
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
   
        //Navigate to the Charger Page
        await dashboard.navigateToChargersPage();
   
        //apply the time filter in the charger page
        await dashboard.applyTimeFilterinChargerPage("Calendar");
   
       const chargerCounts = await dashboard.getChargerCounts();
       const chargerStatus = await dashboard.getConnectorStatusCounts();
   
       const chargerData = {
           chargers: chargerCounts.chargers,
           connectors: chargerCounts.connectors,
           // nonConfigured: chargerCounts.nonConfigured,
   
           all: chargerStatus.All,
           busy: chargerStatus.Busy,
           available: chargerStatus.Available,
           error: chargerStatus.Error
         };
   
         console.log("Charger Page Data(Offline And Online):", chargerData);
   
         // Compare Dashboard vs Charger page data
         expect(chargerData.chargers.trim()).toBe(dashboardData.chargers.trim());
         expect(chargerData.connectors.trim()).toBe(dashboardData.connectors.trim());
         // expect(chargerData.nonConfigured.trim()).toBe(dashboardData.nonConfigured.trim());
         expect(chargerData.all.trim()).toBe(dashboardData.all.trim());
         // expect(chargerData.busy.trim()).toBe(dashboardData.busy.trim());
         // expect(chargerData.available.trim()).toBe(dashboardData.available.trim());
         // expect(chargerData.error.trim()).toBe(dashboardData.error.trim());
         console.log("🟢 The Charger count(Offline and Online) matches on both the Dashboard and the Charger page.");
   
   
         //dashboard online charger data
         console.log("Dashboard Online Chargers Data:", dashboardOnlineData);
         await dashboard.OnlineFilterCharger()
         await page.waitForTimeout(3000);
         const chargerOnlineCounts = await dashboard.getChargerCounts();
         const chargerOnlineStatus = await dashboard.getConnectorStatusCounts();
   
         const chargerOnlineData = {
           chargers: chargerOnlineCounts.chargers,
           connectors: chargerOnlineCounts.connectors,
           // nonConfigured: chargerOnlineCounts.nonConfigured,
   
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
         // expect(chargerOnlineData.busy.trim()).toBe(dashboardOnlineData.busy.trim());
         // expect(chargerOnlineData.available.trim()).toBe(dashboardOnlineData.available.trim());
         // expect(chargerOnlineData.error.trim()).toBe(dashboardOnlineData.error.trim());
         console.log("🟢 The Online Charger count matches on both the Dashboard and the Charger page.");
   
   
       });
   