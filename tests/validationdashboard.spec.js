const { test, expect } = require('@playwright/test');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const {convertCsvToXlsx} = require ('@aternus/csv-to-xlsx');
const localDownloadPath = 'C:/Users/Admin/Downloads';
let downloadFilename
const filePath ='C:\Users\Admin\Pictures\aa1';
 
 test('Dashboard validation', async ({ page}) => {
  
    // Navigate to the login page
      await page.goto('https://novo.kazam.in');
  
    // Login
      await page.fill('#large-input','akhilesh@kazam.in');
      await page.fill('#password','Akbl@1724');
      await page.click("button[type='submit']");
      await page.click("//p[normalize-space()='NIKOL EV']");
    // Wait for a few seconds
      await page.waitForTimeout(5000); // 5000 milliseconds = 5 seconds

    // Print dashboard No of session value
    const dashboardValueSelector = "div[class='bg-white w-full flex flex-col h-full p-4 rounded-lg drop-shadow-sm border border-white hover:cursor-pointer hover:border-gray-200 z-9'] p[class='text-base font-medium']";
    global.dashboardValue = await page.$eval(dashboardValueSelector, el => parseFloat(el.innerText));
 
        console.log(`Total no of sessions(From Dashboard): ${dashboardValue}`);

    // Print dashboard Usage value
    const dashboardusageValueSelector = "div[class='bg-white w-full flex flex-col h-full p-4 rounded-lg drop-shadow-sm border border-white hover:cursor-pointer hover:border-gray-200 z-8'] p[class='text-base font-medium']";
    global.dashboardusageValue = await page.$eval(dashboardusageValueSelector, el => parseFloat(el.innerText));

       console.log(`Total Usage (From Dashboard In kWh): ${dashboardusageValue}`);

      await page.click("div[class='bg-white w-full flex flex-col h-full p-4 rounded-lg drop-shadow-sm border border-white hover:cursor-pointer hover:border-gray-200 z-9'] p[class='text-sm text-gray-800 font-normal']");
    // Wait for a few seconds
       await page.waitForTimeout(5000); // 5000 milliseconds = 5 seconds
    
    // Example: Applying a filter through an input field
       await page.click("button[class='w-full flex gap-1 items-center bg-white $bg-black py-1.5 px-3 border border-gray-300 rounded-lg']"); 
       await page.click('button:nth-child(4) div:nth-child(2) div:nth-child(1) div:nth-child(1) div:nth-child(1)'); // Replace with actual selector
    // Wait for a few seconds
      await page.waitForTimeout(6000); // 6000 milliseconds = 6 seconds
    // Click on the three dots menu
      await page.click("//div[@id='download']//*[name()='svg']");
      await page.waitForTimeout(4000); 
      await page.click(".text-sm.text-kazamGray-900");
      await page.waitForTimeout(10000); 
    
});


test("Email download",async ({ page }) => {
  
    const email = "akhilesh@kazam.in";
      await page.goto('https://mail.google.com');
  
    // Wait for the user to login 
      await page.waitForSelector('input[type="email"]', { visible: true });
      await page.fill('input[type="email"]', 'akhilesh@kazam.in');
      await page.click('div[id="identifierNext"]');
  
      await page.waitForTimeout(2000); // Waiting for next page to load
  
      await page.waitForSelector('input[type="password"]', { visible: true });
      await page.fill('input[type="password"]', 'Akbl@1724');
      await page.click('div[id="passwordNext"]');
  
      await page.waitForNavigation(); // Waiting for login to complete


    // Click on the first email in the inbox
      await page.waitForSelector('table[role="grid"] tr.zA', { visible: true });
    const firstEmail = await page.$('table[role="grid"] tr.zA');
      if (firstEmail) {
      await firstEmail.click();
    } else {
    console.log('No emails found in the inbox.');
    }
  
    // Wait for email content to load
      await page.waitForSelector('.a3s', { visible: true });
  
    // Find and click the first link in the email
    const firstLink = await page.$('.a3s a');
    // Trigger the download
        await page.getByRole('link', { name: 'Download Report' }).click();

    // Handle the download
      const localDownloadPath = 'C:/Users/Admin/Downloads';
      page.on('download', async (download) => {
      const downloadPath = path.join(localDownloadPath, download.suggestedFilename());
      await download.saveAs(downloadPath);
      downloadFilename= download.suggestedFilename()
   });
  
      await page.waitForTimeout(5000); // 5000 milliseconds = 5 seconds
       console.log(await page.title());
       
});

test("Total No of session validation",async ({ page }) => {
   const XLSX = require('xlsx');({
    acceptDownloads: true,
  });

  let source = path.join(localDownloadPath, downloadFilename);
  console.log('source',source);
  let destination = path.join(localDownloadPath, 'converted_session_report.xlsx'); 
  console.log('destination',destination);
  try { 
   await convertCsvToXlsx(source, destination)
} catch (e) { 
    console.error(e.toString()); 
}

  
  // Path to the downloaded file
  const filePath = path.join(process.env.HOME || process.env.USERPROFILE, 'Downloads', 'converted_session_report.xlsx');
  
  // Check if the file exists
  if (fs.existsSync(filePath)) {
     // Read the Excel file
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0]; // Get the first sheet name
  const worksheet = workbook.Sheets[sheetName];

  // Convert sheet to JSON to easily access rows and columns
  const sheetJson = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  // Count non-empty cells in the second column excluding the first cell
  let nonEmptyCellCount = 0;
  for (let i = 1; i < sheetJson.length; i++) {
    if (sheetJson[i][1]) { // Index 1 corresponds to the second column
      nonEmptyCellCount++;
    }
  }

  console.log(`Total no of sessions(From Report): ${nonEmptyCellCount}`);
  console.log(`Total no of sessions(From dashboard): ${global.dashboardValue}`);
  if (global.dashboardValue == nonEmptyCellCount) {
    console.log('The no of sessions in the report is equal to the No of sessions on the dashbaoard.');
} else {
    console.log('The no of sessions in the report is equal to the No of sessions on the dashbaoard.');
}
}

});

test("Total usage validation",async ({ page }) => {
  const fs = require('fs');
  const path = require('path');
  const XLSX = require('xlsx');({
    acceptDownloads: true,
  });
    // Path to the downloaded file
  const filePath = path.join(process.env.HOME || process.env.USERPROFILE, 'Downloads', 'converted_session_report.xlsx');
  
  // Check if the file exists
  if (fs.existsSync(filePath)) {
     // Read the Excel file
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0]; // Get the first sheet name
  const worksheet = workbook.Sheets[sheetName];
    const sheet = workbook.Sheets[sheetName];

   // Convert sheet to JSON to easily access rows and columns
   const sheetJson = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

   // Initialize sum variable
   let sum = 0;
 
   // Loop through the eighth column (index 9) starting from the second row (index 1)
   for (let i = 1; i < sheetJson.length; i++) {
     let cellValue = sheetJson[i][9]; // Index 9 corresponds to the eighth column
 
     if (typeof cellValue == 'string') {
       // Remove "Kwh" and convert to number
       cellValue = parseFloat(cellValue.replace('kWh', '').trim());
     }
 
     if (!isNaN(cellValue)) {
       sum += cellValue;
     }
   }
 
   console.log(`Total Usage (From Dashboard In kWh): ${sum}`);


   console.log(`Total usage (From Report In kWh): ${global.dashboardusageValue}`);
   const final_value = (Math.abs(Math.round(global.dashboardusageValue,0) - Math.round(sum,0) ))
   if (final_value <=1) {
    console.log('The sum of usage in the excel is equal to the total usage of dashboard value.');
} else {
    console.log('The sum of usage in the excel is NOT equal to the total usage of dashboard value.');
}

  }


});

test.only('Add charger flow validation', async ({ page}) => {
  

  const filepath1 = '.upload/aa1.png'
  // Navigate to the login page
    await page.goto('https://novo.kazam.in');

  // Login
    await page.fill('#large-input','akhilesh@kazam.in');
    await page.fill('#password','Akbl@1724');
    await page.click("button[type='submit']");
    await page.click("//a[2]//div[1]//div[1]//div[1]//div[2]//p[1]");
  // Wait for a few seconds
    await page.waitForTimeout(3000); // 3000 milliseconds = 3 seconds

  //click charger session module
    await page.click("//span[normalize-space()='Chargers & Sessions']");
    await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds
    await page.click("//button[normalize-space()='Add Charger']");
    await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds

  // enter charger name
    await page.locator("#large-input").fill("Kazam_Automation_Test");

  // select host details
  const hostfield = page.locator("(//input[@placeholder='Select'])[1]");
    await hostfield.click();
    await hostfield.type("Akhilesh");
    await page.waitForTimeout(4000); // 4000 milliseconds = 4 seconds
    await page.click("li:nth-child(1) div:nth-child(1)");
  
  // select segment 
  const segmentfield = page.locator("(//*[name()='svg'])[15]");
    await segmentfield.click();
    await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
    await page.click("//div[normalize-space()='Fleet']");

  // select subsegment
  const subsegment = page.locator("(//div[contains(@class,'flex flex-col gap-2 w-full')])[4]");
    await subsegment.click();
    await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
    await page.click("//div[normalize-space()='Kazam Hub']");
    
  // enter total capacity
  const totalcapacity = page.locator("//input[contains(@placeholder,'eg: 3.3, 7.4. 22')]")
    await totalcapacity.click();
    await totalcapacity.clear();
    await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
    await totalcapacity.type("7.4");

  // charger type
  const chargertype = page.locator("//p[normalize-space()='AC']");
    await page.waitForTimeout(1000); // 2000 milliseconds = 2 seconds
    await chargertype.click();
   

  // select parking type
  const parktype = page.locator("//input[@placeholder='Select Parking Type']");
    await page.waitForTimeout(1000); // 2000 milliseconds = 2 seconds
    await parktype.click();
    await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
    await page.click("(//span[normalize-space()='2W'])[1]");

  // click on next button
  const nextbutton = page.locator("//button[normalize-space()='Next']");
    await nextbutton.click();
    await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds


  // connectors page 
  const noofconnectors = page.locator("//p[normalize-space()='2']");
    await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
    await noofconnectors.click();
    
  // connector 1 details
  const connector1 = page.locator("(//input[contains(@placeholder,'Select')])[1]");
    await connector1.click();
    await page.click("//div[normalize-space()='3 Pin Socket']");
    await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
   

  const totalcapacity1 = page.locator("(//input[contains(@placeholder,'eg: 3.3, 7.4. 22')])[1]");
    await totalcapacity1.click();
    await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
    await totalcapacity1.type("3.3");
    

  // connector 2 details
  const connector2 = page.locator("//input[contains(@placeholder,'Select')]");
    await connector2.click();
    await page.waitForTimeout(1000); // 2000 milliseconds = 2 seconds
    await page.click("//div[normalize-space()='3 Pin Socket']");
    await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds

  const totalcapacity2 = page.locator("(//input[@placeholder='eg: 3.3, 7.4. 22'])[2]");
    await totalcapacity2.click();
    await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
    await totalcapacity2.type("3.3");
   
  // click on next button
  const nextbutton1 = page.locator("//button[normalize-space()='Next']");
    await nextbutton1.click();
   

  // Select location and longitude
  const latitude =  page.locator("//input[@placeholder='Latitude']");
    await latitude.click();
    await latitude.clear();
    await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
    await latitude.type("12.923");
   

  const longitude = page.locator("//input[@placeholder='Longitude']");
    await longitude.click();
    await longitude.clear();
    await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
    await longitude.type("77.462");
    await page.waitForTimeout(1000); // 2000 milliseconds = 2 seconds


  // get address
  const getaddress = page.locator("//button[normalize-space()='Get Address']");
    await getaddress.click();
    await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds

  // click on next button
  const nextbutton2 = page.locator("//button[normalize-space()='Next']");
    await nextbutton2.click();
    await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds

  // Additional details
  const privatecharger = page.locator("(//input[@placeholder='Select'])[1]");
    await privatecharger.click();
    await page.click("//div[normalize-space()='Yes']");
    await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds


  // charger timings
  const timings = page.locator("(//*[name()='svg'])[18]");    
    await timings.click();
    await page.waitForTimeout(1000); // 2000 milliseconds = 2 seconds
    await page.click("//div[normalize-space()='No']");
    await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
    

  
  // select timing
  const checkbox1 = page.locator("(//input[contains(@type,'checkbox')])[1]");
    await checkbox1.click();
  const starttime1 = page.locator("(//input[contains(@type,'time')])[1]"); 
    await starttime1.click();
    await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
    await starttime1.type("08:00");
    await page.waitForTimeout(1000); // 2000 milliseconds = 2 seconds

  const endtime1 = page.locator("(//input[contains(@type,'time')])[2]");
    await endtime1.click();
    await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
    await endtime1.type("18:00");
    await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds

  const checkbox2 = page.locator("(//input[contains(@type,'checkbox')])[3]");
    await checkbox2.click();
  const starttime2 = page.locator("(//input[contains(@type,'time')])[5]");
    await starttime2.click(); 
    await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds 
    await starttime2.type("08:00");
    

  const endtime2 = page.locator("(//input[contains(@type,'time')])[6]"); 
    await endtime2.click();
    await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
    await endtime2.type("18:00");
    await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds

  const checkbox3 = page.locator("(//input[@id='link-checkbox'])[5]");
    await checkbox3.click();
  const starttime3 = page.locator("(//input[@type='time'])[9]");
    await starttime3.click(); 
    await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
    await starttime3.type("08:00");
  const endtime3 = page.locator("(//input[contains(@type,'time')])[10]");
    await endtime3.click();
    await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
    await endtime3.type("18:00");
    

  const uploadimage = page.locator("//label[normalize-space()='Click to upload']"); 
    await uploadimage.click();
    await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds
    
  const imagePath = "C:\\Users\\Admin\\aa1.png"
  const filePath = path.resolve('C:\\Users\\Admin\\aa1.png');
  if (!fs.existsSync(filePath)) {
    console.error('File does not exist:', filePath);
    return;
    
  }

  console.log('File exists:', filePath);
  await page.setInputFiles('input[type="file"]',filePath); 
  await page.waitForTimeout(2000);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(3000);
  
  // Launch a browser instance
  const browser = await chromium.launch({ headless: false }); // Set headless to false for debugging
  const context = await browser.newContext();

  // Handle any new pages that open
  context.on('page', async newPage => {
    console.log('New page opened, closing it.');
    await newPage.close();
    
  })
  // Add charger button
  const addcharger = page.locator("//button[normalize-space()='Add Charger']");
    await addcharger.click();
    await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds
  //charger id:rdwsma
   console.log("charger configured successfully");

   const clickdownloadbutton = page.locator("//button[normalize-space()='Download QR Code']");
   await clickdownloadbutton.click();
   await page.waitForTimeout(5000); // 5000 milliseconds = 5 seconds

  // Directory to read from
  const downloadsDirectory = path.resolve('C:/Users/Admin/Downloads'); 
  // Function to read the directory and print the first file name
  function printFirstFileName(directory) {
  fs.readdir(directory, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    // Filter out directories
    const fileNames = files
      .filter(file => file.isFile())
      .map(file => file.name);

    if (fileNames.length === 0) {
      console.log('No files found in the directory.');
      return;
    }

    // Print the first file name
    console.log('First file name:', fileNames[0]);
  });
}

   // Call the function
   printFirstFileName(downloadsDirectory);

});



// test("Reconfiguration Validation",async ({ page }) => 

//   // Navigate to the login page
//     await page.goto('https://novo.kazam.in');

//   // Login
//     await page.fill('#large-input','akhilesh@kazam.in');
//     await page.fill('#password','Akbl@1724');
//     await page.click("button[type='submit']");
//     await page.click("//p[normalize-space()='NIKOL EV']");
//   // Wait for a few seconds
//     await page.waitForTimeout(3000); // 3000 milliseconds = 3 seconds
//   //click charger session module
//     await page.click("//span[normalize-space()='Chargers & Sessions']");
//     await page.waitForTimeout(3000); // 3000 milliseconds = 3 seconds


//   // search for a configured charger
//   const configuredcharger = page.locator("//input[@id='simple-search']");
//     await configuredcharger.click();
//     await configuredcharger.type("rdwsma");
//     await page.waitForTimeout(3000); // 3000 milliseconds = 3 seconds
//   const searchclick = page.locator("td:nth-child(2)");
//     await searchclick.click();
//     await page.waitForTimeout(3000); // 3000 milliseconds = 3 seconds

//   // click on reconfiguration button 
//   const reconfigurationcharger = page.locator("//button[normalize-space()='Reconfigure Charger']");
//     await reconfigurationcharger.click();
//     await page.waitForTimeout(3000); // 3000 milliseconds = 3 seconds

//   // enter total capacity
//   const totalcapacity = page.locator("//input[contains(@placeholder,'eg: 3.3, 7.4. 22')]")
//     await totalcapacity.click();
//     await totalcapacity.clear ();
//     await totalcapacity.clear ();
//     await totalcapacity.type("22");

//   // click on next button
//   const nextbutton = page.locator("//button[normalize-space()='Next']");
//     await nextbutton.click();
//     await page.waitForTimeout(3000); // 3000 milliseconds = 3 seconds 
    
//   // change the connector 1 total capacity
//   const totalcapacity1 = page.locator("(//input[contains(@placeholder,'eg: 3.3, 7.4. 22')])[1]");
//     await totalcapacity1.click();
//     await totalcapacity1.clear();
//     await totalcapacity1.clear();
//     await totalcapacity1.type("7.7");

//   // change connector 2 total capacity
//   const totalcapacity2 = page.locator("(//input[@placeholder='eg: 3.3, 7.4. 22'])[2]");
//     await totalcapacity2.click();
//     await totalcapacity2.clear();
//     await totalcapacity2.clear();
//     await totalcapacity2.type("7.7");
//     await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds

//   // click on next button
//   const nextbutton1 = page.locator("//button[normalize-space()='Next']");
//     await nextbutton1.click();
//     await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds

//   // click on next button
//   const nextbutton2 = page.locator("//button[normalize-space()='Next']");
//     await nextbutton2.click();
//     await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds

//   // Additional details
//   const privatecharger = page.locator("(//input[@placeholder='Select'])[1]");
//     await privatecharger.click();
//     await page.click("//div[normalize-space()='Yes']");

//   // charger timings
//   const timings = page.locator("(//*[name()='svg'])[18]");    
//     await timings.click();
//     await page.click("//div[normalize-space()='No']");

//   // select timing
//   const checkbox1 = page.locator("(//input[contains(@type,'checkbox')])[1]");
//     await checkbox1.click();
//   const starttime1 = page.locator("(//input[contains(@type,'time')])[1]"); 
//     await starttime1.click();
//     await starttime1.type("09:00");
//   const endtime1 = page.locator("(//input[contains(@type,'time')])[2]");
//     await endtime1.click();
//     await endtime1.type("19:00");

//   const checkbox2 = page.locator("(//input[contains(@type,'checkbox')])[3]");
//     await checkbox2.click();
//   const starttime2 = page.locator("(//input[contains(@type,'time')])[5]");
//     await starttime2.click();  
//     await starttime2.type("09:00");
//   const endtime2 = page.locator("(//input[contains(@type,'time')])[6]"); 
//     await endtime2.click();
//     await endtime2.type("19:00");

//   const checkbox3 = page.locator("(//input[@id='link-checkbox'])[5]");
//     await checkbox3.click();
//   const starttime3 = page.locator("(//input[@type='time'])[9]");
//     await starttime3.click(); 
//     await starttime3.type("09:00");
//   const endtime3 = page.locator("(//input[contains(@type,'time')])[10]");
//     await endtime3.click();
//     await endtime3.type("19:00");

//   // // Add charger button
//   // const addcharger = page.locator("//button[normalize-space()='Add Charger']");
//   //   await addcharger.click();
//   //   await page.waitForTimeout(5000); // 2000 milliseconds = 2 seconds
//   // //charger id:rdwsma
//   //  console.log("charger reconfigured successfully");


// });