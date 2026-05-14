import { test as base } from '@playwright/test';
import { DashboardPage } from '../pages/DashBoard';

export const test = base.extend({
  dashboardData: async ({ page }, use) => {
    const dashboard = new DashboardPage(page);

    await page.goto('https://novo.kazam.in/org/ev_pump/3c30aea2-8e99-416e-803a-7c777a73e8f3/cpo');
    await page.waitForLoadState('networkidle');

    await dashboard.applyTimeFilterInDashboard("Yesterday");

    const dashboardCounts = await dashboard.getDashboardChargerCounts();
    const dashboardStatus = await dashboard.getDashboardConnectorStatusCounts();

    const data = {
      revenue: await dashboard.getRevenue(),
      sessions: await dashboard.getTotalSessions(),
      usage: await dashboard.getUsage(),
      online: await dashboard.getOnlinePercentage(),

      chargers: dashboardCounts.chargers,
      connectors: dashboardCounts.connectors,

      all: dashboardStatus.All,
      busy: dashboardStatus.Busy,
      available: dashboardStatus.Available,
      error: dashboardStatus.Error
    };

    await use(data);
  }
});