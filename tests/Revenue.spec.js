import { test, expect } from '../Fixtures/loginFixture';
import { RevenuePage } from "../pages/RevenuePage";

test.describe("Revenue Validation", () => {
  test("Validate Revenue", async ({ loggedInPage }) => {
    const page = loggedInPage;

   
  const revenuePage = new RevenuePage(page);

 // Navigate to dashboard URL here
  await revenuePage.DashBoardURL();

//time filter in dashboard
   await revenuePage.applyTimeFilterInDashboard("Yesterday");
   const DashBoardrevenue = await revenuePage.getDashboardRevenue();
    console.log("DashboardRevenue:", DashBoardrevenue);

    
// Login fixture already logged in
  await revenuePage.goto();

  
function getYesterdayDate() {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const day = String(date.getDate()).padStart(2, "0");
    // const month = String(date.getMonth() + 1).padStart(2, "0");
    // const year = date.getFullYear();
    return `${day}`;
}

// Calendar: select particular date
  await revenuePage.selectSingleDate(getYesterdayDate());
 const revenueData = await revenuePage.printRevenueValues();


// Calendar: select full month (Nov 2025)
//   await revenuePage.selectFullMonth(2025, 11);

 // Download Excel
  const filePath4 = await revenuePage.downloadExcelFile();
  await revenuePage.sumOfRevenue(filePath4);


  // Validate Revenue Sum
    const RevenueResult = await revenuePage.verifyRevenueFromExcel(filePath4,revenueData.revenueText,DashBoardrevenue); 
    if (!RevenueResult.success) {
      console.error("Revenue Validation Failed:", RevenueResult.message);
    } else {
      console.log("Revenue Validation Passed:", RevenueResult.message);
    }

  // Search invoice and print first row
  await revenuePage.searchInvoiceAndPrint("30450113");
});

});