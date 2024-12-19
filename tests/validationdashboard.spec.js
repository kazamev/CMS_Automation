const { test, expect } = require('@playwright/test');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { chromium } = require('playwright');
const {convertCsvToXlsx} = require ('@aternus/csv-to-xlsx');
const { text } = require('stream/consumers');
//const { console } = require('inspector');
const localDownloadPath = 'C:\Users\msg4a\Downloads';
let downloadFilename
const filePath ='C:\Users\msg4a\Downloads\aa1';
 
 test('Session validation', async ({ page}) => {

    const fs = require('fs');
    const xlsx = require('xlsx');
    const path = require('path');

  
    // Navigate to the login page
      await page.goto('https://novo.kazam.in');
  
    // Login
      await page.fill('#large-input','akhilesh@kazam.in');
      await page.fill('#password','Akbl@1724');
      await page.click("button[type='submit']");
      await page.click("//p[normalize-space()='ZYNETIC ELECTRIC VEHICLE CHARGING LLC']");
    // Wait for a few seconds
      await page.waitForTimeout(5000); // 5000 milliseconds = 5 seconds

    // Print dashboard No of session value
    const dashboardValueSelector = (
      "div[class='bg-white w-full flex flex-col h-full p-4 rounded-lg drop-shadow-sm border border-white hover:cursor-pointer hover:border-gray-200 z-9'] p[class='text-base font-medium']"
    );
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
      await page.click(
        "(//*[name()='svg'][contains(@class,'feather feather-chevron-down transform duration-500 $')])[1]"
      );
      await page.click("//div[contains(text(),'This month')]"); // Replace with actual selector
    // Wait for a few seconds
      await page.waitForTimeout(4000); // 4000 milliseconds = 4 seconds
    // Click on the three dots menu
      await page.click("//div[@id='download']//*[name()='svg']");
      await page.waitForTimeout(4000);
    // await page.click(".text-sm.text-kazamGray-900");
    // await page.waitForTimeout(8000);

    // Set up download listener and trigger download
    const [download] = await Promise.all([
      page.waitForEvent('download'), // wait for download event
      page.click(".text-sm.text-kazamGray-900")   // Download button selector
]);

    // Save the downloaded file to a specific path
    const filePath = path.join(__dirname, 'downloaded_file.xlsx');
      await download.saveAs(filePath);

    // Read and parse the Excel file
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
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
}   else {
    console.log('The no of sessions in the report is Not equal to the No of sessions on the dashbaoard.');
}

    // Convert the worksheet to JSON format
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    // Ensure there are at least 9 columns to avoid index errors
  if (jsonData[0].length >= 9) {
    // Initialize sum and iterate over rows starting from the second row (index 1)
    let sum = 0;
    for (let i = 1; i < jsonData.length; i++) {
      const cellValue = jsonData[i][8]; // 9th column, as index starts from 0
      if (typeof cellValue === 'number') { // ensure cell contains a number
        sum += cellValue;
      }
    }

  // Divide the sum by 1000
  global.result = sum / 1000;
  console.log(`Total Usage (From Report In kWh): ${global.result}`);
  }

  console.log(
    `Total usage (From Dashboard In kWh): ${global.dashboardusageValue}`
  );
  const final_value = Math.abs(
    Math.round(global.dashboardusageValue, 0) - Math.round(global.result, 0)
  );
  if (final_value <= 1) {
    console.log(
      "The sum of usage in the excel is equal to the total usage of dashboard value."
    );
  } else {
    console.log(
      "The sum of usage in the excel is NOT equal to the total usage of dashboard value."
    );
  }


    // Cleanup (optional): delete the downloaded file after processing
      fs.unlinkSync(filePath);
});
  
     
test("Online percentage validation",async ({ page }) => {
    const fs = require('fs');
    const xlsx = require('xlsx');
    const path = require('path');


    // Navigate to the login page
      await page.goto('https://novo.kazam.in');

    // Login
      await page.fill('#large-input','akhilesh@kazam.in');
      await page.fill('#password','Akbl@1724');
      await page.click("button[type='submit']");
      await page.click("//p[normalize-space()='Nikol Automotive Private Limited']");
    // Wait for a few seconds
      await page.waitForTimeout(5000); // 5000 milliseconds = 5 seconds

    // Print dashboard No of session value
    const dashboarduptimeSelector = (
  "div[class='bg-white w-full flex flex-col h-full p-4 rounded-lg drop-shadow-sm border border-white hover:cursor-pointer hover:border-gray-200 z-7'] p[class='text-base font-medium']"
);
    global.dashboarduptimeValue = await page.$eval(dashboarduptimeSelector, el => parseFloat(el.innerText));

        console.log(` Online percentage (From Dashboard in %): ${dashboarduptimeValue}`);

 
      await page.click(
    "div[class='bg-white w-full flex flex-col h-full p-4 rounded-lg drop-shadow-sm border border-white hover:cursor-pointer hover:border-gray-200 z-7'] p[class='text-base font-medium']"
  );
    // Wait for a few seconds
      await page.waitForTimeout(5000); // 5000 milliseconds = 5 seconds
 
    // Example: Applying a filter through an input field
    const dayfliter = page.locator("(//*[name()='svg'][contains(@class,'feather feather-chevron-down transform duration-500 $')])[2]");
      await dayfliter.click();
      await page.waitForTimeout(1000); // 1000 milliseconds = 1 second

      await page.click("//div[contains(text(),'This month')]"); // Replace with actual selector
    // Wait for a few seconds
      await page.waitForTimeout(4000); // 4000 milliseconds = 4 seconds
    // Click on the three dots menu
      await page.click(".feather.feather-more-vertical");
      await page.waitForTimeout(4000);

    // Set up download listener and trigger download
    const [download] = await Promise.all([
      page.waitForEvent('download'), // wait for download event
      page.click(
        "//div[contains(text(),'Download Report')]"
      )   // replace with actual download button selector
]);

    // Save the downloaded file to a specific path
    const filePath = path.join(__dirname, 'downloaded_file.xlsx');

    await download.saveAs(filePath);
    
    // Load the Excel file
    const workbook = xlsx.readFile(filePath);
    
    // Get the first worksheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert the worksheet to JSON for easier processing
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    // Exclude the header row and calculate for the 6th column (index 5 in 0-based indexing)
    const columnIndex = 5;
    const values = data.slice(1) // Skip the first row
        .map(row => row[columnIndex]) // Extract the 6th column
        .filter(value => !isNaN(value) && value !== undefined); // Filter valid numeric values

    // Calculate the sum and average
    const sum = values.reduce((acc, val) => acc + parseFloat(val), 0);
    const average = (sum / values.length) * 100;

    console.log(`The calculated result is: ${average}`);

    if(dashboarduptimeValue==average){
  console.log('Online percentage from dashboard is equal the online percentage from  the downloaded report.')
    }else{
  console.log('Online percentage from dashboard is Not equal the online percentage from  the downloaded report.')
}

  // Cleanup (optional): delete the downloaded file after processing
    fs.unlinkSync(filePath);

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
      await page.click("(//div[@class='flex flex-col gap-2 p-4'])[3]");
   // Wait for a few seconds
      await page.waitForTimeout(3000); // 3000 milliseconds = 3 seconds

   //click charger session module
      await page.click("//span[normalize-space()='Chargers & Sessions']");
      await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds
      await page.click("//button[normalize-space()='Add Charger']");
      await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds

    // enter charger name
      await page.locator("#large-input").fill("Kazam_Automation_test");

    // select host details
    const hostfield = page.locator("(//input[@placeholder='Select'])[1]");
      await hostfield.click();
      await hostfield.type("9495644454");
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
    const filePath = path.resolve('C:\\Users\\msg4a\\Downloads\\aa1.png');
  // if (!fs.existsSync(filePath)) {
  //   console.error('File does not exist:', filePath);
  //   return;
    
  // }

        console.log('File exists:', filePath);
      await page.setInputFiles('input[type="file"]',filePath); 
      await page.waitForTimeout(2000);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(3000);
  
  // // Execute the AutoIt script to press the Esc key
  //   exec('pressEsc.exe', (error, stdout, stderr) => {
  //    if (error) {
  //       console.error(`Error executing AutoIt script: ${error.message}`);
  //       return;
  //   }
  //    if (stderr) {
  //       console.error(`AutoIt script stderr: ${stderr}`);
  //       return;
  //   }
  //       console.log(`AutoIt script stdout: ${stdout}`);
  //   });

  //   // Wait for the dialog to be closed
  //   await page.waitForTimeout(2000);
 
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

      await page.waitForTimeout(2000); // 2000 milliseconds = 5 seconds

});


test.only("Newly added charger validation",async ({ page }) => {
    // Navigate to the login page
    await page.goto('https://novo.kazam.in');

  // Login
    await page.fill('#large-input','akhilesh@kazam.in');
    await page.fill('#password','Akbl@1724');
    await page.click("button[type='submit']");
    await page.click("(//div[@class='flex flex-col gap-2 p-4'])[3]");
  // Wait for a few seconds
    await page.waitForTimeout(3000); // 3000 milliseconds = 3 seconds

  //click charger session module
    await page.click("//span[normalize-space()='Chargers & Sessions']");
    await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds

  // Go to the search bar
    const search = page.locator("//input[@placeholder='Search']");
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
    "Device_name" : "//p[contains(@title,'Kazam_Automation_test')]",
    "Host_name" : "//p[@title='Akhilesh - 9495644454']",
    "Charger_type": "//div[@class='text-sm rounded-lg px-3 py-1 font-medium bg-sky-600/10 text-sky-600']",
    "Charger_status": "//div[@class='text-sm rounded-lg px-3 py-1 font-medium bg-red-600/10 text-red-600']",
    "Connector_1" : "(//div[contains(@class,'grid grid-cols-6 items-center text-xs py-1')])[1]",
    "Connector_2" : "(//div[@class='grid grid-cols-6 items-center text-xs py-1'])[2]"
  };

  const texts = [];
  const comparison = {
    'Device_name' : 'Kazam_Automation_test', 
    'Host_name' : 'testing (9495644454)',
    'Charger_type' : 'Private',
    'Charger_status': 'Offline',
    'Connector_1' : '1  three_pin 3.3 Unavailable ----',
    'Connector_2' : '2  three_pin 3.3 Unavailable ----'
    }
  //console.log('comparison is ',comparison)
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

let flattenedText = {};

for (let key in extractedTexts) {
  if (Array.isArray(extractedTexts[key])) {
    flattenedText[key] = extractedTexts[key][0];
  } else {
    flattenedText[key] = extractedTexts[key];
  }
}

//console.log("Data from charger details page is",flattenedText);
  console.log("comparison text is",comparison)
  if (JSON.stringify(flattenedText) == JSON.stringify(comparison)){
    console.log("Added data and charger detail page data are matching")
  }else{
    console.log("Added data and charger detail page data are Not matching")
  }
 
  
});


test("Reconfiguration Validation",async ({ page }) => 

  {

  // Navigate to the login page
      await page.goto('https://novo.kazam.in');

  // Login
      await page.fill('#large-input','akhilesh@kazam.in');
      await page.fill('#password','Akbl@1724');
      await page.click("button[type='submit']");
      await page.click("(//div[@class='flex flex-col gap-2 p-4'])[3]");
  // Wait for a few seconds
      await page.waitForTimeout(3000); // 3000 milliseconds = 3 seconds
  //click charger session module
      await page.click("//span[normalize-space()='Chargers & Sessions']");
      await page.waitForTimeout(3000); // 3000 milliseconds = 3 seconds


   // Go to the search bar
    const search = page.locator("//input[@placeholder='Search']");
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

  // enter charger name
  const chargername = page.locator("#large-input");
      await chargername.click();
      await chargername.clear();
      await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
      await chargername.type("Kazam_Automation")
    
  // enter total capacity
  const totalcapacity = page.locator("//input[contains(@placeholder,'eg: 3.3, 7.4. 22')]")
    totalcapacity.click();
      await totalcapacity.clear ();
      await totalcapacity.clear ();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second
      await totalcapacity.type("22");

  // click on next button
  const nextbutton = page.locator("//button[normalize-space()='Next']");
      await nextbutton.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second
      await page.waitForTimeout(3000); // 3000 milliseconds = 3 seconds 
    
  // change the connector 1 total capacity
  const totalcapacity1 = page.locator("(//input[contains(@placeholder,'eg: 3.3, 7.4. 22')])[1]");
      await totalcapacity1.click();
      await totalcapacity1.clear();
      await totalcapacity1.clear();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second
      await totalcapacity1.type("7.7");

  // change connector 2 total capacity
  const totalcapacity2 = page.locator("(//input[@placeholder='eg: 3.3, 7.4. 22'])[2]");
      await totalcapacity2.click();
      await totalcapacity2.clear();
      await totalcapacity2.clear();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second
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
    page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
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
     endtime3.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second
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


test("Reconfigured charger validation",async ({ page }) => {
  // Navigate to the login page
  await page.goto('https://novo.kazam.in');

// Login
  await page.fill('#large-input','akhilesh@kazam.in');
  await page.fill('#password','Akbl@1724');
  await page.click("button[type='submit']");
  await page.click("(//div[@class='flex flex-col gap-2 p-4'])[3]");
// Wait for a few seconds
  await page.waitForTimeout(3000); // 3000 milliseconds = 3 seconds

//click charger session module
  await page.click("//span[normalize-space()='Chargers & Sessions']");
  await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds

// Go to the search bar
  const search = page.locator("//input[@placeholder='Search']");
   await search.click();
   await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds
   await search.fill(content);
   await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds

// clcik on the search result
  const searchresult = page.locator("td:nth-child(3)");
  await searchresult.click(); 
  await page.waitForTimeout(5000); // 5000 milliseconds = 5 seconds

  // Print Device name
const dataSelectors2 = {
  "Device_name" : "//p[@title='Kazam_Automation']",
  "Host_name" : "//p[contains(@title,'testing - 9495644454')]",
  "Charger_type": "//div[@class='text-sm rounded-lg px-3 py-1 font-medium bg-sky-600/10 text-sky-600']",
  "Charger_status":"//div[@class='text-sm rounded-lg px-3 py-1 font-medium bg-red-600/10 text-red-600']",
  "Connector_1" : "body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)",
  "Connector_2" : "body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)"
};

const texts = [];
const comparison1 = {
  'Device_name' : 'Kazam_Automation', 
  'Host_name' : 'testing (9495644454)',
  'Charger_type' : 'Private',
  'Charger_status' : 'Offline',
  'Connector_1' : '1  three_pin 7.7 Unavailable ----',
  'Connector_2' : '2  three_pin 7.7 Unavailable ----'
  }
//console.log('comparison is ',comparison1)
// Extract and print data from each selector
const extractedTexts = {};

for (const [key, selector] of Object.entries(dataSelectors2)) {
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

let flattenedText = {};

for (let key in extractedTexts) {
if (Array.isArray(extractedTexts[key])) {
  flattenedText[key] = extractedTexts[key][0];
} else {
  flattenedText[key] = extractedTexts[key];
}
}

//console.log("Data from charger details page is",flattenedText);
console.log("comparison text is",comparison1)
if (JSON.stringify(flattenedText) == JSON.stringify(comparison1)){
  console.log("Added data and charger detail page data are matching")
}else{
  console.log("Added data and charger detail page data are Not matching")
}


});

test('Revenue Validation', async ({ page}) => {

  global.transaction=''
  
  // Navigate to the login page
      await page.goto('https://novo.kazam.in');

  // Login
      await page.fill('#large-input','akhilesh@kazam.in');
      await page.fill('#password','Akbl@1724');
      await page.click("button[type='submit']");
      await page.click("//p[normalize-space()='Nikol Automotive Private Limited']");
  // Wait for a few seconds
      await page.waitForTimeout(5000); // 5000 milliseconds = 5 seconds

  // Print dashboard revenue
 
    global.dashboardRevenue = await page.innerText("(//p[@class='text-base font-medium'])[1]");
        console.log(`Total Revenue(From Dashboard): ${global.dashboardRevenue}`);
  
  // click on the revenue card
    const revenuecard = page.locator("//p[normalize-space()='Revenue']");
      await revenuecard.click();
      await page.waitForTimeout(5000); // 5000 milliseconds = 5 seconds
   
  // Total Revenue from the RM Module
    const rmrevenue = await page.innerText("//body[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[2]/main[1]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/div[1]/h6[1]");
        console.log(`Total Revenue(From RM Module): ${rmrevenue}`);
      await page.waitForTimeout(1000); // 1000 milliseconds = 1 second

      if(global.dashboardRevenue==rmrevenue){
        console.log('Total Revenue in dashboard is equal to the Total revenue in RM Module')
      }else{
        console.log('Total Revenue in dashboard is Not equal to the Total revenue in RM Module')
      }
  // Total transactions from the   
    const totaltransaction = await page.innerText("button[class='flex items-center gap-1 w-full h-full px-4 py-2 rounded-l-lg bg-black text-white'] span"); 
    const start = totaltransaction.indexOf('(') + 1
    const end = totaltransaction.indexOf(')');
      transaction = totaltransaction.slice(start, end);
        console.log(`Total Transaction(From RM Module): ${transaction}`);
      await page.waitForTimeout(1000); // 1000 milliseconds = 1 second


  // withdrawal amount
    const withdrawalamount = await page.innerText("body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > h6:nth-child(2)");
        console.log(`Withdrawal amount : ${withdrawalamount}`);

  // Print Payout pending 
    const totalrevenue = await page.innerText('//div[3]//div[1]//div[1]//h6[1]');
        console.log(`Wallet balance: ${totalrevenue}`);
      await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds

  // Download revenue report
    const revenuereport = page.locator(".feather.feather-more-vertical");
      await revenuereport.click();
      await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds 
      
      
  // click Download buttton
    const downloadclick = page.locator("(//div[contains(text(),'Download Report')])[1]");
      await downloadclick.click();
      await page.waitForTimeout(1000); // 1000 milliseconds = 1 second


 // Find the first row containing the text "success"
    const successRow1 = page.locator("body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1)");
      await successRow1.click();
      await page.waitForTimeout(1000);


 // Data from the overview page 
    const overviewSelectors = {
 "Transaction id" : "body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > span:nth-child(2)",
 "Billed Amount" : "body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3)",
 "Host Details": "body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(9) > span:nth-child(1) > span:nth-child(1)",
 "Driver Details":"body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(10) > span:nth-child(1)",
 "Time stamp" : "body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(11) > span:nth-child(1)",
  };
    const extractedTexts0 = {};

  for (const [key, selector] of Object.entries(overviewSelectors)) {
    const elements = await page.$$(selector);
    const texts = [];
  for (const element of elements) {
    const text = await element.textContent();
    const trimmedText = String(text).trim();
    console.log(`${key} from the Overview page: ${trimmedText}`);
    texts.push(trimmedText); // Accumulate text for each selector
  }
  extractedTexts0[key] = texts; // Store the accumulated texts in the dictionary
  }

  await page.waitForTimeout(1000); // 1000 milliseconds = 1 second


 // Find the first row containing the text "success"
 const successRow = page.locator("(//span[normalize-space()='Success'])[1]");

 // Debug: Print the HTML content of the success row to verify the correct row is found
 console.log(await successRow.innerHTML());


  // Getting all transactions count
  const allTransactions = page.locator(
    "(//button[@class='flex items-center gap-1 w-full h-full px-4 py-2 rounded-l-lg bg-black text-white'])[1]//span"
  );
  const innerHTML = await allTransactions.innerHTML(); // Await innerHTML() because it is an asynchronous operation
  let allTransactions_count = innerHTML;
  let allTransactions_result = allTransactions_count.replace(/[()]/g, ""); // Removes both ( and )
  console.log("All Transaction count is : " + allTransactions_result);

  // Scroll until the element is visible or the maximum scrolling height is reached
  let previousHeight = await page.evaluate(() => document.body.scrollHeight);
  let totalTransactions = parseInt(allTransactions_result); // Convert count to integer

  // Loop through all transactions from 1 to totalTransactions
  for (let i = 1; i <= totalTransactions; i++) {
    try {
      // Construct paths dynamically
      let success_path = `(//div[@class='flex items-center p-4 gap-2 cursor-pointer hover:bg-gray-50 duration-150 w-full'])[${i}]//div[2]//span`;
      const successElement = page.locator(success_path);

      let billed_path = `(//div[@class='flex items-center p-4 gap-2 cursor-pointer hover:bg-gray-50 duration-150 w-full'])[${i}]//div[3]`;
      const billed = page.locator(billed_path);

      // Scroll down by a fixed amount
      await page.evaluate(() => window.scrollBy(0, window.innerHeight));

      // Wait for a short time for content to load
      await page.waitForTimeout(1000);

      // Check if the element is visible in the viewport
      const isVisible = await successElement.isVisible();
      if (isVisible) {
        const success = await successElement.innerHTML();
        console.log(
          "Found Payment Status for transaction " + i + " is: " + success
        );

        const billed_amount = await billed.innerHTML();
        console.log("Billed Amount (raw):", billed_amount.trim());
        if (
          success.trim() === "Success" 
          // &&
          // parseFloat(billed_amount.trim()) > 0.0
        ) {
          let invoice_path = `(//div[@class='flex items-center p-4 gap-2 cursor-pointer hover:bg-gray-50 duration-150 w-full'])[${i}]//div[1]//button`;
          const invoice = page.locator(invoice_path);
          await invoice.click();
          console.log(`Clicked on invoice for transaction ${i}`);

          // open invoice

          let openinvoicepath = `(//div[@class='grid grid-cols-10 items-center px-6 py-4 gap-4 text-xs text-gray-600 w-[80vw]'])[1]//p[2]`;
          const openinvoice = page.locator(openinvoicepath);
          await openinvoice.click();
          await page.waitForTimeout(4000); // 4000 milliseconds = 4 seconds

          // Data from the invoice page
          const invoiceSelectors = {
            "Transaction id":
              "body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(4) > div:nth-child(1) > div:nth-child(2) > p:nth-child(2) > span:nth-child(1)",
            "Billed Amount":
              "body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(4) > div:nth-child(2) > div:nth-child(4) > div:nth-child(2) > div:nth-child(4) > p:nth-child(2)",
            "Host Details":
              "body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > p:nth-child(2)",
            "Driver Details":
              "body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > p:nth-child(2)",
            "Time stamp": "p[class='text-black'] span[class='text-gray-600']",
          };
          const extractedTexts = {};

          for (const [key, selector] of Object.entries(invoiceSelectors)) {
            const elements = await page.$$(selector);
            const texts = [];
            for (const element of elements) {
              const text = await element.textContent();
              const trimmedText = String(text).trim();
              console.log(`${key} from the invoice page: ${trimmedText}`);
              texts.push(trimmedText); // Accumulate text for each selector
            }
            extractedTexts[key] = texts; // Store the accumulated texts in the dictionary
          }

          if (overviewSelectors == invoiceSelectors) {
            console.log("Overview data and invoice data are matching");
          } else {
            console.log("Overview data and invoice data are not matching");
          }

          // Invoice Related start working from here......

          // Invoice Related END here......

          //closing Invoice with mouse action to click on screen on right top corner
          // Get the viewport size
          const viewport = await page.evaluate(() => ({
            width: window.innerWidth,
            height: window.innerHeight,
          }));

          // Calculate the coordinates for the top-right corner
          const x = viewport.width - 1; // Right edge (you might adjust for padding)
          const y = 1; // Top edge (you might adjust for padding)

          // Click at the top-right corner
          await page.mouse.click(x, y);

          // Optional: Wait for a while to observe the click action
          await page.waitForTimeout(2000);

          console.log("Closed Invoice.");

          break;
        }
      }

      // Check if the page has stopped scrolling (no new content to load)
      const currentHeight = await page.evaluate(
        () => document.body.scrollHeight
      );
      if (currentHeight === previousHeight) {
        console.log("Reached the bottom of the page.");
      }

      previousHeight = currentHeight;
    } catch (error) {
      console.error("An error occurred during iteration " + i + ":", error);
    }
  }
});



test("Validation of Charging fees",async ({ page }) => {
    
  // Navigate to the login page
      await page.goto('https://novo.kazam.in');

  // Login
      await page.fill('#large-input','akhilesh@kazam.in');
      await page.fill('#password','Akbl@1724');
      await page.click("button[type='submit']");
      await page.click("(//div[@class='flex flex-col gap-2 p-4'])[3]");
  // Wait for a few seconds
      await page.waitForTimeout(5000); // 5000 milliseconds = 5 seconds

  // Go to RM Module
    const rmmodule = page.locator("//span[normalize-space()='Revenue Management']");
      await rmmodule.click();
      await page.waitForTimeout(3000); // 3000 milliseconds = 3 seconds

  // Select tariff section from the RM Module
    const tariff = page.locator("//span[normalize-space()='Charger Tariffs']");
      await tariff.click();
      await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds

  // Click on create tariff butoon
    const createtariff = page.locator(
    "//button[normalize-space()='Create Tariff']"
    );
      await createtariff.click();
      await page.waitForTimeout(2000); // 2000 millisecond = 2 seconds

  // Click and Enter the tariff name
    const tariffname = page.locator("(//input[@id='large-input'])[1]");
      await tariffname.click();
      await tariffname.fill("Flat Tariff");
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Enter tariff validity 
    const validity = page.locator("div[class='p-2 px-4 cursor-pointer'] svg");
      await validity.click();
    const selectdate = page.locator("//div[normalize-space()='29']");
      await selectdate.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Add Description
    const description = page.locator("(//input[@id='large-input'])[4]");
      await description.click();
      await description.type("Flat Tariff validation");
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second
   
  //Select tariff
    const flattariff = page.locator("(//button[contains(@type,'button')])[1]");
      await flattariff.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second     

  // click next button
    const nextbutton4 = page.locator("//button[normalize-space()='Next']");
      await nextbutton4.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Enter amount
    const amount1 = page.locator("input[placeholder='Enter Amount']");
      await amount1.click();
      await amount1.type("5");
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Add amount 
    const addamount = page.locator("(//button[normalize-space()='Add Price'])[1]");
      await addamount.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second   
      
  // Enter amount
    const enteramount2 = page.locator("(//input[contains(@placeholder,'Enter Amount')])[2]");
      await enteramount2.click();
      await enteramount2.fill("4");
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second
      
  // Add amount 
    const addamount1 = page.locator("(//button[normalize-space()='Add Price'])[1]");
      await addamount1.click();
      await page.waitForTimeout(1000);  // 1000 millisecond = 1 second 
      
  // Enter amount
    const enteramount3 = page.locator("(//input[contains(@placeholder,'Enter Amount')])[3]");
      await enteramount3.click();
      await enteramount3.fill("3");
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Parking fee
    const parkingfee = page.locator("//input[@id='link-checkbox']");
      await parkingfee.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second
      
  // Enter amount
    const enteramount4 = page.locator("//input[@placeholder='0']");
      await enteramount4.click();
      await enteramount4.fill("2")
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Click next button
    const nextbutton5 = page.locator("//button[normalize-space()='Next']");
      await nextbutton5.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Enter search button
    const searchbar1 = page.locator("div[class='flex px-4 items-center border border-gray-300 focus:border-kazamGray-300 focus:border-2 rounded-lg'] input[placeholder='Search']");
      await searchbar1.click();
      await searchbar1.type("1ti4kt");
      await page.waitForTimeout(2000); // 1000 millisecond = 1 second

  // click the check box
    const chargercheckbox1 = page.locator("(//input[@id='link-checkbox'])[2]");
      await chargercheckbox1.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  //click next button
    const nextbutton6 =page.locator("//button[normalize-space()='Next']");
      await nextbutton6.click();
      await page.waitForTimeout(2000); // 2000 millisecinds = 2 seconds

      console.log("Charger Tariff(Flat Tariff) Created Successfully");

  // Click back button
    const backbutton = page.locator("(//div[@class='flex cursor-pointer pb-4'])[1]");
      await backbutton.click();    
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second    

  // // Click create tariff button
  //   const createbutton = page.locator("(//button[normalize-space()='Create'])");
  //     await createbutton.click();
  //     await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds
  //       console.log("Charger tariff created successfully")
  //     await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds

  // Fast charging
    // Click on create tariff butoon
    const createtariff1 = page.locator(
      "//button[normalize-space()='Create Tariff']"
      );
        await createtariff1.click();
        await page.waitForTimeout(2000); // 2000 millisecond = 2 seconds
  
    // Click and Enter the tariff name
      const tariffname1 = page.locator("(//input[@id='large-input'])[1]");
        await tariffname1.click();
        await tariffname1.fill("Fast Charging");
        await page.waitForTimeout(1000); // 1000 millisecond = 1 second
  
    // Enter tariff validity 
      const validity1 = page.locator("div[class='p-2 px-4 cursor-pointer'] svg");
        await validity1.click();
      const selectdate1 = page.locator("//div[normalize-space()='29']");
        await selectdate1.click();
        await page.waitForTimeout(1000); // 1000 millisecond = 1 second
  
    // Add Description
      const description1 = page.locator("(//input[@id='large-input'])[4]");
        await description1.click();
        await description1.type("Fast Charging validation");
        await page.waitForTimeout(2000); // 1000 millisecond = 1 second
  
    // Select tariff type
      const tarifftype1 = page.locator("//body//div//button[2]");
        await tarifftype1.click();
        await page.waitForTimeout(1000); // 1000 millisecond = 1 second
  
    // Click Next button
      const next = page.locator("//button[normalize-space()='Next']");
        await next.click();
        await page.waitForTimeout(1000); // 1000 millisecond = 1 second

    // Enter amount
    const amount2 = page.locator("input[placeholder='Enter Amount']");
      await amount2.click();
      await amount2.type("6");
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Add amount 
    const addamount3 = page.locator("(//button[normalize-space()='Add Price'])[1]");
      await addamount3.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second   
      
  // Enter amount
    const enteramount5 = page.locator("(//input[contains(@placeholder,'Enter Amount')])[2]");
      await enteramount5.click();
      await enteramount5.fill("5");
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second
      
  // Add amount 
    const addamount2 = page.locator("(//button[normalize-space()='Add Price'])[1]");
      await addamount2.click();
      await page.waitForTimeout(1000);  // 1000 millisecond = 1 second 
      
  // Enter amount
    const enteramount6 = page.locator("(//input[contains(@placeholder,'Enter Amount')])[3]");
      await enteramount6.click();
      await enteramount6.fill("4");
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Parking fee
    const parkingfee1 = page.locator("//input[@id='link-checkbox']");
      await parkingfee1.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second
      
  // Enter amount
    const enteramount7 = page.locator("//input[@placeholder='0']");
      await enteramount7.click();
      await enteramount7.fill("3")
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Click next button
    const nextbutton14 = page.locator("//button[normalize-space()='Next']");
      await nextbutton14.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Enter search button
    const searchbar2 = page.locator(
      "div[class='flex px-4 items-center border border-gray-300 focus:border-kazamGray-300 focus:border-2 rounded-lg'] input[placeholder='Search']"
    );
      await searchbar2.click();
      await searchbar2.fill("au32ho");
      await page.waitForTimeout(2000); // 2000 millisecond = 2 seconds

  // click the check box
    const chargercheckbox2 = page.locator("(//input[@id='link-checkbox'])[2]");
      await chargercheckbox2.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  //click next button
    const nextbutton15 =page.locator("//button[normalize-space()='Next']");
      await nextbutton15.click();
      await page.waitForTimeout(2000); // 2000 millisecinds = 2 seconds

      console.log("Charger Tariff(Flat Tariff) Created Successfully");

  // Click back button
    const backbutton2 = page.locator("(//div[@class='flex cursor-pointer pb-4'])[1]");
      await backbutton2.click();    
      await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds    
    
    
  // Aggregation Fee creation
    const Aggregationfee = page.locator("//span[normalize-space()='Aggregation Fee']");
      await Aggregationfee.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Click Create Aggregation button
   const createaggregation = page.locator("//button[normalize-space()='Create Aggregation Fee']");
      await createaggregation.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Enter Fee name 
    const feename = page.locator("//input[@id='large-input']");
      await feename.click();
      await feename.fill("Automation Aggregation Fee")
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Select fee type
    const feetype = page.locator(
      "//body//div//div[@role='dialog']//div//div//div//div//div//div[2]//div[1]//div[1]//*[name()='svg']"
    );
      await feetype.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Select percentage from dropdown
    const percentagefee = page.locator("//div[normalize-space()='Percentage']");
      await percentagefee.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // set percentage
    const setpercentage = page.locator("input[type='number']");
      await setpercentage.click();
      await setpercentage.fill("9");
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // click on next button
    const Aggregationnextbutton = page.locator("//button[normalize-space()='Next']");
      await Aggregationnextbutton.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // select charger
    const searchbar = page.locator("//input[@placeholder='Search by device id']");
      await searchbar.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second
      await searchbar.fill("1ti4kt");
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // click the check box 
    const chargercheckbox = page.locator("(//input[@id='link-checkbox'])[2]");
      await chargercheckbox.click();
      await page.waitForTimeout(2000); // 2000 millisecond = 2 seconds

  
  // close button
    const closebutton2 = page.locator("//button[@aria-label='Close modal']//*[name()='svg']");
      await closebutton2.click();
      await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds

  // // Create Tariff
  //   const createtariff4 = page.locator("(//button[normalize-space()='Create'])");
  //     await createtariff4.click();
  //     await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds

    

  // // click next button
  //   const selectcharger = page.locator(
  //     "//div[@class='mt-auto flex items-center gap-4 ml-auto']//button[@type='submit'][normalize-space()='Create Aggregation Fee']"
  //   );
  //     await selectcharger.click();
  //     await page.waitForTimeout(3000); // 3000 milliseconds = 3 seconds 
        console.log("Aggregation fee created Successfully");
      await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds


  // create tax 
    const clicktaxbutton = page.locator("li:nth-child(5) div:nth-child(1) span:nth-child(2)");
      await clicktaxbutton.click();
      await page.waitForTimeout(1000); // 1000 milliseconds = 1 second

  // click create a tax system
    const createtaxsystem = page.locator("//button[normalize-space()='Create Tax System']");
      await createtaxsystem.click();
      await page.waitForTimeout(1000); // 1000 milliseconds = 1 second

  // tax system name
    const taxsystemname = page.locator("(//input[@id='large-input'])[1]");
      await taxsystemname.click();
      await taxsystemname.fill ("Kazam Automation Tax");
      await page.waitForTimeout(1000); // 1000 milliseconds = 1 second

  // clcik tax policy
    const taxpolicy = page.locator("(//*[name()='svg'])[21]");
      await taxpolicy.click();
      await page.waitForTimeout(1000); // 1000 milliseconds = 1 second

  // select tax policy
    const taxpolicyselect = page.locator("//div[normalize-space()='GST']");
      await taxpolicyselect.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Enter tax number
    const taxnumber = page.locator("//input[contains(@placeholder,'tax number')]");
      await taxnumber.click();
      await taxnumber.fill("29KANSJ123KDNRJ3");
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Enter Business name
    const businessname = page.locator("//input[@placeholder='tax name']");
      await businessname.click();
      await businessname.fill("Automation Tax System");
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Tax address
    const taxaddress = page.locator("(//input[@id='large-input'])[4]");
      await taxaddress.click();
      await taxaddress.fill("Kazam EV Tech Pvt Ltd,Enzyeme Tech park,Koramangala,Bangalore,Karnataka");
      await page.waitForTimeout(1000); // 1000 millisecond = 1 seconds

  // Tax Template1
    const subcategory = page.locator("(//select[@class='text-xs border border-gray-300 rounded-md focus:border-kazamGray-300 focus:ring-kazamGray-300'])[1]");
      await subcategory.click();
      await page.waitForTimeout(1000); //1000 millisecond =  1second
      await subcategory.type("gst");
      await subcategory.press('Enter');
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Enter the amount 
    const valueamount = page.locator("//input[@placeholder='amount']");
      await valueamount.click();
      await valueamount.fill("9");
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // select type
    const type = page.locator("//select[contains(@placeholder,'Select Type')]");
      await type.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second 
      await type.type("Percentage");
      await type.press('Enter');
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  //  Click on Next button 
    const nextbutton3 = page.locator("(//button[normalize-space()='Next'])[1]");
      await nextbutton3.click();
      await page.waitForTimeout(2000); // 1000 millisecond = 1 second

  // locate search bar
    const locatesearch = page.locator("//input[@placeholder='Search by device id']");    
      await locatesearch.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second
      await locatesearch.fill("1ti4kt");
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // locate check box
    const checkbox4 = page.locator("(//input[@id='link-checkbox'])[2]");
      await checkbox4.click();
      await page.waitForTimeout(1000); // 1000 millis  second = 1 second 

  // //  Click Create tax system 
  //   const createtaxbutton = page.locator("(//button[@type='submit'][normalize-space()='Create Tax System'])[2]");
  //     await createtaxbutton.click();
  //     await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds 

  // close button
    const closebutton1 = page.locator("//button[@aria-label='Close modal']//*[name()='svg']");
      await closebutton1.click();
      await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds

      console.log("Tax created Successfully");

});


test("Dynamic Tariff validation",async ({ page }) => {

  // Navigate to the login page
  await page.goto('https://novo.kazam.in');

  // Login
      await page.fill('#large-input','akhilesh@kazam.in');
      await page.fill('#password','Akbl@1724');
      await page.click("button[type='submit']");
      await page.click("(//div[@class='flex flex-col gap-2 p-4'])[3]");
  // Wait for a few seconds
      await page.waitForTimeout(5000); // 5000 milliseconds = 5 seconds
  
  
  // Go to RM Module
    const rmmodule = page.locator("//span[normalize-space()='Revenue Management']");
      await rmmodule.click();
      await page.waitForTimeout(3000);

  // Select tariff section from the RM Module
    const tariff = page.locator("//span[normalize-space()='Charger Tariffs']");
      await tariff.click();
      await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds

  // Click on create tariff butoon
    const createtariff = page.locator(
  "//button[normalize-space()='Create Tariff']"
  );
      await createtariff.click();
      await page.waitForTimeout(2000); // 2000 millisecond = 2 seconds

  // Click and Enter the tariff name
    const tariffname = page.locator("(//input[@id='large-input'])[1]");
      await tariffname.click();
      await tariffname.fill("Time of Day");
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Enter tariff validity 
    const validity = page.locator("div[class='p-2 px-4 cursor-pointer'] svg");
      await validity.click();
    const selectdate = page.locator("//div[normalize-space()='29']");
      await selectdate.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Add Description
    const description = page.locator("(//input[@id='large-input'])[4]");
      await description.click();
      await description.type("Time of Day validation");
      await page.waitForTimeout(2000); // 1000 millisecond = 1 second

  // Select Tariff type
    const tarifftype = page.locator("//body//div//button[3]");
      await tarifftype.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // click Next button
    const nextbutton7 = page.locator("//button[normalize-space()='Next']");
      await nextbutton7.click();
      await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds

  // Set time range
    const timerange1 = page.locator(
      "(//button[contains(@class,'text-kazamGray-700 w-full focus:border-kazamGray-300 border-y border-x border-gray-300 rounded-l-lg px-4 py-2 flex justify-between items-center false')])[1]");    
      await timerange1.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second
    
  // Select start time
    const starttime4 = page.locator("//button[normalize-space()='10:00 hrs']");
      await starttime4.click();    
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // End time
    const timerange2 = page.locator("button[class='text-kazamGray-700 w-full focus:border-kazamGray-300 border-y border-r border-gray-300 rounded-r-lg px-4 py-2 flex justify-between items-center focus:border-kazamRed-600 border-kazamRed-600']");
      await timerange2.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second
      
  // select end time
    const endtime4 =page.locator("//button[normalize-space()='12:00 hrs']");    
      await endtime4.click();
      await page.waitForTimeout(1000); // 1000 milliseconnd = 1 second

  // set day of week
    const dayofweek = page.locator("//button[normalize-space()='----']");
      await dayofweek.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // select date 1
    const day1 = page.locator("(//input[@id='link-checkbox'])[3]");
      await day1.click();    
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // select date 2
    const day2 = page.locator("(//input[@id='link-checkbox'])[5]");
      await day2.click();    
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // select date 3
    const day3 = page.locator("(//input[@id='link-checkbox'])[7]");
      await day3.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second    
  
  // Enter amount
    const enteramount = page.locator("//input[contains(@placeholder,'Enter Amount')]");
      await enteramount.click();
      await enteramount.fill("5");
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second   

  // Add parking fee
    const parkingfee = page.locator("//input[@id='link-checkbox']");
      await parkingfee.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Enter amount
    const parkingamount = page.locator("//input[@placeholder='0']");
      await parkingamount.click();
      await parkingamount.fill("2")
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Click next button
    const nextbutton8 = page.locator("//button[normalize-space()='Next']");
      await nextbutton8.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second   

  // Asset selection
    const searchbar2 = page.locator("(//input[contains(@placeholder,'Search')])[1]");
      await searchbar2.click();
      await searchbar2.fill("37fckj");
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Select charger
    const selectcharger1 = page.locator("(//input[@id='link-checkbox'])[2]");
      await selectcharger1.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second    
       
  // Click next button
    const nextbutton9 = page.locator("(//button[normalize-space()='Next'])[1]");
      await nextbutton9.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second  
      
  // Click back button
    const backbutton = page.locator("(//div[@class='flex cursor-pointer pb-4'])[1]");
      await backbutton.click();    
      await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds

  // // Create Tariff
  //   const createtimeofday = page.locator("(//button[normalize-space()='Create'])");
  //     await createtimeofday.click();
  //     await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds   
      
      console.log("Tariff (TOD) Created Successfully")

  // Charge by Hour

  // Select tariff section from the RM Module
    const tariff1 = page.locator("//span[normalize-space()='Charger Tariffs']");
      await tariff1.click();
      await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds

  // Click on create tariff butoon
    const createtariff1 = page.locator(
    "//button[normalize-space()='Create Tariff']"
    );
      await createtariff1.click();
      await page.waitForTimeout(2000); // 2000 millisecond = 2 seconds

  // Click and Enter the tariff name
    const tariffname1 = page.locator("(//input[@id='large-input'])[1]");
      await tariffname1.click();
      await tariffname1.fill("Charge by Hour");
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Enter tariff validity 
    const validity1 = page.locator("div[class='p-2 px-4 cursor-pointer'] svg");
      await validity1.click();
    const selectdate1 = page.locator("//div[normalize-space()='29']");
      await selectdate1.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Add Description
    const description1 = page.locator("(//input[@id='large-input'])[4]");
      await description1.click();
      await description1.type("Charge by Hour validation");
      await page.waitForTimeout(2000); // 1000 millisecond = 1 second

  // Select tariff type
    const tarifftype1 = page.locator("(//button[contains(@type,'button')])[4]");
      await tarifftype1.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Click Next button
    const next = page.locator("//button[normalize-space()='Next']");
      await next.click();
      await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds
  
  // Condition one 
  // Select hour range   
    const hourrange = page.locator("//div[@id='PlusIcon']//*[name()='svg']//*[name()='path' and contains(@d,'M5.59668 1')]");
      await hourrange.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second
      
  // Price 1
    const price1 = page.locator("(//input[@placeholder='Enter Amount'])[1]")
      await price1.click();
      await price1.fill("5");
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second
      
  // Add price 
    const addprice = page.locator("(//button[contains(text(),'Add Price')])[1]");
      await addprice.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second
      
  // Price 2
    const price2 = page.locator("(//input[contains(@placeholder,'Enter Amount')])[2]");
      await price2.click(); 
      await price2.fill("4");
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Condition 2
  // Select hour range
    const Condition = page.locator("//button[normalize-space()='Add Condition'] ");
      await Condition.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Add second hour rangr
    const secondhour = page.locator(
      "//div//div//div//div//div//div//div//div//div//div//div//div//div[2]//div[1]//div[1]//div[1]//div[1]//div[2]//div[2]//*[name()='svg']"
    );
      await secondhour.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second
  
  // Add price
    const addprice1 = page.locator(
      "body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > input:nth-child(2)"
    );
      await addprice1.click();
      await addprice1.fill("3");    
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second
  
  // Add second price
    const price2click = page.locator("(//button[contains(text(),'Add Price')])[2]");
      await price2click.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Add price
    const addprice2 = page.locator(
      "body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > input:nth-child(2)"
    );
      await addprice2.click();
      await addprice2.fill("2");
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

      
  // Condition 3
  // Select hour range
    const thirdhour = page.locator(
      "button[class='flex items-center justify-between w-full font-medium text-left group-first:rounded-t-xl border-gray-200 dark:border-gray-700 border-l border-r group-first:border-t border-b rounded-b-lg group-first:!rounded-t-lg border-gray-200 dark:border-gray-700 p-0 text-gray-500 dark:text-gray-400 hover:bg-gray-100 hover:dark:bg-gray-800 text-gray-900 bg-[#F7F9FB] hover:!bg-[#F7F9FB]'] div[class='p-5'] svg"
    );   
      await thirdhour.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Add price 
    const price3 = page.locator("(//input[@placeholder='Enter Amount'])[5]");
      await price3.click();
      await price3.fill("1");
      await page.waitForTimeout(1000); // 1000 millosecond = 1 second   

  // Click Next button
    const nextbutton10 = page.locator("(//button[normalize-space()='Next'])[1]");
      await nextbutton10.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Asset selection
    const searchbar3 = page.locator("(//input[@placeholder='Search'])[1]");   
      await searchbar3.click();
      await searchbar3.fill("37fckj");
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Select charger
    const selectcharger2 = page.locator("(//input[@id='link-checkbox'])[2]");
      await selectcharger2.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second
  
  // Click next button
    const nextbutton11 = page.locator("(//button[normalize-space()='Next'])[1]");
      await nextbutton11.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Click back button
    const backbutton1 = page.locator("(//div[@class='flex cursor-pointer pb-4'])[1]");
      await backbutton1.click();    
      await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds


  // // Create tariff
  //   const createtariff2 = page.locator("(//button[normalize-space()='Create'])");
  //     await createtariff2.click();
  //     await page.waitForTimeout(2000); // 2000 millisecond = 2 second 

      console.log("Tariff Charge by Hour(CBH) Created Successfully")

  // State of charge

  // Select tariff section from the RM Module
    const tariff2 = page.locator("//span[normalize-space()='Charger Tariffs']");
      await tariff2.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Click on create tariff butoon
    const createtariff3 = page.locator(
    "//button[normalize-space()='Create Tariff']"
   );
      await createtariff3.click();
      await page.waitForTimeout(2000); // 2000 millisecond = 2 seconds

  // Click and Enter the tariff name
    const tariffname2 = page.locator("(//input[@id='large-input'])[1]");
      await tariffname2.click();
      await tariffname2.fill("State of Charge");
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Enter tariff validity 
    const validity2 = page.locator("div[class='p-2 px-4 cursor-pointer'] svg");
      await validity2.click();
    const selectdate2 = page.locator("//div[normalize-space()='29']");
      await selectdate2.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Add Description
    const description2 = page.locator("(//input[@id='large-input'])[4]");
      await description2.click();
      await description2.type("State of Charge validation");
      await page.waitForTimeout(2000); // 1000 millisecond = 1 second

  // Select tariff type
    const tarifftype2 = page.locator("(//button[@type='button'])[5]");
      await tarifftype2.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Click Next button
    const next1 = page.locator("//button[normalize-space()='Next']");
      await next1.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Condition 1
  // Enter amount
    const enteramount1 = page.locator("//input[contains(@placeholder,'Enter Amount')]");
      await enteramount1.click();
      await enteramount1.fill("5");  
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Add condition
    const addcondition = page.locator("//button[normalize-space()='Add Condition']")
      await addcondition.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Add SOC range
    const socranage = page.locator(
      "body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > svg:nth-child(1)"
    );
      await socranage.dblclick();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Condition 2    
  // Add condition 
    const addcondition1 = page.locator("(//button[normalize-space()='Add Condition'])[1]"); 
      await addcondition.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second   

  // Second SOC range
    const secondsoc = page.locator(
      "body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > svg:nth-child(1)"
    );  
      await secondsoc.dblclick();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Enter amount
    const secondamount = page.locator("(//input[@placeholder='Enter Amount'])[2]");
      await secondamount.click();
      await secondamount.fill("2")
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Condition 3
    const thirdamount = page.locator("(//input[@placeholder='Enter Amount'])[3]");
      await thirdamount.click();
      await thirdamount.fill("1");
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Condition 4
    const fourthsoc = page.locator(
      "button[class='flex items-center justify-between w-full font-medium text-left group-first:rounded-t-xl border-gray-200 dark:border-gray-700 border-l border-r group-first:border-t border-b rounded-b-lg group-first:!rounded-t-lg border-gray-200 dark:border-gray-700 p-0 text-gray-500 dark:text-gray-400 hover:bg-gray-100 hover:dark:bg-gray-800 text-gray-900 bg-[#F7F9FB] hover:!bg-[#F7F9FB]'] div[class='p-5']"
    );
      await fourthsoc.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Enter amount
    const fourthamount = page.locator("(//input[@placeholder='Enter Amount'])[4]");
      await fourthamount.click();
      await fourthamount.fill("1");
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Next button
    const nextbutton12 = page.locator("(//button[normalize-space()='Next'])[1]");
      await nextbutton12.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Asset selection
    const searchbar4 = page.locator("(//input[contains(@placeholder,'Search')])[1]");
      await searchbar4.click();
      await searchbar4.fill("au32ho");
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Select charger
    const selectcharger4 = page.locator("(//input[@id='link-checkbox'])[2]");
      await selectcharger4.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second
  
  // Click next button
    const nextbutton13 = page.locator("(//button[normalize-space()='Next'])[1]");
      await nextbutton13.click();
      await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // // Create Tariff
  //   const createtariff4 = page.locator("(//button[normalize-space()='Create'])");
  //     await createtariff4.click();
  //     await page.waitForTimeout(2000); // 2000 millisecond = 2 second


  // Click back button
    const backbutton2 = page.locator("(//div[@class='flex cursor-pointer pb-4'])[1]");
      await backbutton2.click();    
      await page.waitForTimeout(2000); // 2000 millisecond = 2 second 



});


test("download and validate revenue Report",async ({ page }) => {

  const fs = require('fs');
  const path = require('path');
  const xlsx = require('xlsx');

  const downloadDir = path.join(__dirname, 'downloads'); // Directory for downloads

  // Ensure the download directory exists
  if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir);
  }

  // Start a Playwright browser instance
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
      acceptDownloads: true
  });
  //const page = await context.newPage();

  const email = "akhilesh@kazam.in";
  await page.goto("https://mail.google.com");

  // Wait for the user to login
  await page.waitForSelector('input[type="email"]', { visible: true });
  await page.fill('input[type="email"]', "akhilesh@kazam.in");
  await page.click('div[id="identifierNext"]');

  await page.waitForTimeout(2000); // Waiting for next page to load

  await page.waitForSelector('input[type="password"]', { visible: true });
  await page.fill('input[type="password"]', "Akbl@1724");
  await page.click('div[id="passwordNext"]');

  await page.waitForNavigation(); // Waiting for login to complete

  // Click on the first email in the inbox
  await page.waitForSelector('table[role="grid"] tr.zA', { visible: true });
  const firstEmail = await page.$('table[role="grid"] tr.zA');
  if (firstEmail) {
    await firstEmail.click();
  } else {
    console.log("No emails found in the inbox.");
  }

  // Wait for email content to load
  await page.waitForSelector(".a3s", { visible: true });

  // Find and click the first link in the email
  const firstLink = await page.$(".a3s a");

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    await page.getByRole("link", { name: "Download Report" }).click()

     // Replace with the actual selector for the download button
]);
  // // Trigger the download
  // await page.getByRole("link", { name: "Download Report" }).click();

  // Save the downloaded file
  const filePath = path.join(downloadDir, await download.suggestedFilename());
  await download.saveAs(filePath);

  // Process the Excel file
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // Convert sheet to JSON for easier manipulation
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 }); // Use header: 1 for a 2D array

  // Calculate the sum of the 16th column (index 15), skipping the first row
  const sum = data.slice(1).reduce((acc, row) => acc + (parseFloat(row[15]) || 0), 0);

  console.log('Total Revenue(From the report):', sum);

  // Delete the downloaded file
  fs.unlinkSync(filePath);

  // Close browser
  await browser.close();

  // Cleanup the download directory if needed
  if (fs.existsSync(downloadDir) && fs.readdirSync(downloadDir).length === 0) {
      fs.rmdirSync(downloadDir);
  
  console.log(`Total Revenue(From Dashboard): ${global.dashboardRevenue}`);

  const final_value = Math.abs(
    Math.round(global.dashboardRevenue, 0) - Math.round(sum, 0)
  );
  if (final_value <= 1) {
    console.log(
      "Total Revenue in the RM Module is equal to the Total revenue from the report"
    );
  } else {
    console.log(
      "Total Revenue in the RM Module is Not equal to the Total revenue from the report"
    );
  }
}

});
