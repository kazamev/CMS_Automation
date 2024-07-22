const { test, expect } = require('@playwright/test');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const {convertCsvToXlsx} = require ('@aternus/csv-to-xlsx');
const { text } = require('stream/consumers');
const localDownloadPath = 'C:/Users/Admin/Downloads';
let downloadFilename
const filePath ='C:\Users\Admin\Pictures\aa1';
 
 test.only('Dashboard validation', async ({ page}) => {
  
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


test.only("Email download",async ({ page }) => {
  
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

test.only("Total No of session validation",async ({ page }) => {
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

test.only("Total usage validation",async ({ page }) => {
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
  
  global.content=''
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
    await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
    await chargertype.click();
   

  // select parking type
  const parktype = page.locator("//input[@placeholder='Select Parking Type']");
    await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
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
    await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
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
    await page.waitForTimeout(1000); // 11000 milliseconds = 1 seconds


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
    await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
    await page.click("//div[normalize-space()='No']");
    await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
    

  
  // select timing
  const checkbox1 = page.locator("(//input[contains(@type,'checkbox')])[1]");
    await checkbox1.click();
  const starttime1 = page.locator("(//input[contains(@type,'time')])[1]"); 
    await starttime1.click();
    await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
    await starttime1.type("08:00");
    await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds

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
    
 // const imagePath = "C:\\Users\\Admin\\aa1.png"
 const path = require('path');
  const filePath = path.resolve('C:\\Users\\Admin\\aa1.png');
  // if (!fs.existsSync(filePath)) {
  //   console.error('File does not exist:', filePath);
  //   return;
    
  // }

  console.log('File exists:', filePath);
  await page.setInputFiles('input[type="file"]',filePath); 
  await page.waitForTimeout(2000);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(3000);
  
  
(async () => {
  try{
  // Launch the browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  console.log('Browser context created');

  // Handle any new pages that open
  context.on('page', async (page) => {
    console.log('New page opened, closing it.');
    await page.close();
    console.log('Closed page');
  })} catch(error){
      console.error('Error:', error)}});
  // Add charger button
  const addcharger = page.locator("//button[normalize-space()='Add Charger']");
    await addcharger.click();
    await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds

   console.log("charger configured successfully");

  // Set up the download event listener
  const [download] = await Promise.all([
    page.waitForEvent('download'), // Wait for the download to start
    page.click("//button[normalize-space()='Download QR Code']")
    
  ]);
  await page.waitForTimeout(5000); // 5000 milliseconds = 5 seconds

  
  // Print the suggested file name
  const filename = download.suggestedFilename()
  const start = filename.indexOf('(') + 1
  const end = filename.indexOf(')');
  content = filename.slice(start, end);
  console.log('Newly added charger:', content);

});


test.only("Newly added charger validation",async ({ page }) => {
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

  // Go to the search bar
    const search = page.locator("//input[@id='simple-search']");
     await search.click();
     await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds
     await search.fill(content);
     await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds

  // clcik on the search result
    const searchresult = page.locator("td:nth-child(3)");
    await searchresult.click(); 
    await page.waitForTimeout(5000); // 5000 milliseconds = 5 seconds

    // Print Device name
  const dataSelectors1 = {
    "Device_name" : "//p[contains(@title,'Kazam_Automation_Test')]",
    "Host_name" : "//p[contains(@title,'Akhilesh - 9495644454')]",
    "Charger_type": "//div[@class='text-sm rounded-lg px-3 py-1 font-medium bg-sky-600/10 text-sky-600']",
    "Connector_1" : "(//div[contains(@class,'grid grid-cols-6 items-center text-xs py-1')])[1]",
    "Connector_2" : "(//div[@class='grid grid-cols-6 items-center text-xs py-1'])[2]"
  };

  const texts = [];
  const trimmedText = [];
  const comparison = {
    'Device_name' : 'Kazam_Automation_Test', 
    'Host_name' : 'Akhilesh (9495644454)',
    'Charger_type' : 'Private',
    'Connector_1' : '1  three_pin 3.3 Unavailable ----',
    'Connector_2' : ' 2  three_pin 3.3 Unavailable ----'
    }
  console.log('comparison is ',comparison)
  // Extract and print data from each selector
  const extractedTexts = {};

for (const [key, selector] of Object.entries(dataSelectors1)) {
  const elements = await page.$$(selector);
  const texts = [];
  for (const element of elements) {
    const text = await element.textContent();
    const trimmedText = String(text).trim();
    console.log(`${key} from the details page: ${trimmedText}`);
    texts.push(trimmedText); // Accumulate text for each selector
  }
  extractedTexts[key] = texts; // Store the accumulated texts in the dictionary
}

  if (JSON.stringify({dataSelectors1}) == JSON.stringify(comparison)){
    console.log("All the keys matched")
  }else{
    console.log("False")
  }
 
  
});


test.only("Reconfiguration Validation",async ({ page }) => 

  {

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
    await page.waitForTimeout(3000); // 3000 milliseconds = 3 seconds


   // Go to the search bar
    const search = page.locator("//input[@id='simple-search']");
     await search.click();
     await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds
     await search.fill(content);
     await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds

  // clcik on the search result
    const searchresult = page.locator("td:nth-child(3)");
    await searchresult.click(); 
    await page.waitForTimeout(5000); // 5000 milliseconds = 5 seconds

  // click on reconfiguration button 
  const reconfigurationcharger = page.locator("//button[normalize-space()='Reconfigure Charger']");
    await reconfigurationcharger.click();
    await page.waitForTimeout(3000); // 3000 milliseconds = 3 seconds

  // enter total capacity
  const totalcapacity = page.locator("//input[contains(@placeholder,'eg: 3.3, 7.4. 22')]")
    await totalcapacity.click();
    await totalcapacity.clear ();
    await totalcapacity.clear ();
    await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
    await totalcapacity.type("22");

  // click on next button
  const nextbutton = page.locator("//button[normalize-space()='Next']");
    await nextbutton.click();
    await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
    await page.waitForTimeout(3000); // 3000 milliseconds = 3 seconds 
    
  // change the connector 1 total capacity
  const totalcapacity1 = page.locator("(//input[contains(@placeholder,'eg: 3.3, 7.4. 22')])[1]");
    await totalcapacity1.click();
    await totalcapacity1.clear();
    await totalcapacity1.clear();
    await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
    await totalcapacity1.type("7.7");

  // change connector 2 total capacity
  const totalcapacity2 = page.locator("(//input[@placeholder='eg: 3.3, 7.4. 22'])[2]");
    await totalcapacity2.click();
    await totalcapacity2.clear();
    await totalcapacity2.clear();
    await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
    await totalcapacity2.type("7.7");
    await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds

  // click on next button
  const nextbutton1 = page.locator("//button[normalize-space()='Next']");
    await nextbutton1.click();
    await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds

  // click on next button
  const nextbutton2 = page.locator("//button[normalize-space()='Next']");
    await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
    await nextbutton2.click();
    await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds

  // Additional details
  const privatecharger = page.locator("(//input[@placeholder='Select'])[1]");
    await privatecharger.click();
    await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
    await page.click("//div[normalize-space()='Yes']");

  // charger timings
  const timings = page.locator("(//*[name()='svg'])[18]");    
    await timings.click();
    await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
    await page.click("//div[normalize-space()='No']");

  // select timing
  const checkbox1 = page.locator("(//input[contains(@type,'checkbox')])[1]");
    await checkbox1.click();
    await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
  const starttime1 = page.locator("(//input[contains(@type,'time')])[1]"); 
    await starttime1.click();
    await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
    await starttime1.type("09:00");
  const endtime1 = page.locator("(//input[contains(@type,'time')])[2]");
    await endtime1.click();
    await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
    await endtime1.type("19:00");

  const checkbox2 = page.locator("(//input[contains(@type,'checkbox')])[3]");
    await checkbox2.click();
    await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
  const starttime2 = page.locator("(//input[contains(@type,'time')])[5]");
    await starttime2.click();  
    await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
    await starttime2.type("09:00");
  const endtime2 = page.locator("(//input[contains(@type,'time')])[6]"); 
    await endtime2.click();
    await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
    await endtime2.type("19:00");

  const checkbox3 = page.locator("(//input[@id='link-checkbox'])[5]");
    await checkbox3.click();
    await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
  const starttime3 = page.locator("(//input[@type='time'])[9]");
    await starttime3.click(); 
    await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
    await starttime3.type("09:00");
  const endtime3 = page.locator("(//input[contains(@type,'time')])[10]");
    await endtime3.click();
    await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
    await endtime3.type("19:00");

  // Add charger button
  const addcharger = page.locator("//button[normalize-space()='Configure Charger']");
    await addcharger.click();
    await page.waitForTimeout(5000); // 2000 milliseconds = 2 seconds
   console.log("charger reconfigured successfully");

   // Set up the download event listener
  const [download] = await Promise.all([
    page.waitForEvent('download'), // Wait for the download to start
    page.click("//button[normalize-space()='Download QR Code']")
    
  ]);
  await page.waitForTimeout(5000); // 5000 milliseconds = 5 seconds

  
  // Print the suggested file name
  const filename = download.suggestedFilename()
  const start = filename.indexOf('(') + 1
  const end = filename.indexOf(')');
  content = filename.slice(start, end);
  console.log('Reconfigured charger name:', content);

});


