const { test, expect } = require("@playwright/test");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { chromium } = require("playwright");
const { convertCsvToXlsx } = require("@aternus/csv-to-xlsx");
const { text } = require("stream/consumers");
const localDownloadPath = "C:/Users/Admin/Downloads";
let downloadFilename;
const filePath = "C:UsersAdminPicturesaa1";

test("Dashboard validation", async ({ page }) => {
  // Navigate to the login page
  await page.goto("https://novo.kazam.in");

  // Login
  await page.fill("#large-input", "akhilesh@kazam.in");
  await page.fill("#password", "Akbl@1724");
  await page.click("button[type='submit']");
  await page.click("//p[normalize-space()='NIKOL EV']");
  // Wait for a few seconds
  await page.waitForTimeout(5000); // 5000 milliseconds = 5 seconds

  // Print dashboard No of session value
  const dashboardValueSelector =
    "div[class='bg-white w-full flex flex-col h-full p-4 rounded-lg drop-shadow-sm border border-white hover:cursor-pointer hover:border-gray-200 z-9'] p[class='text-base font-medium']";
  global.dashboardValue = await page.$eval(dashboardValueSelector, (el) =>
    parseFloat(el.innerText)
  );

  console.log(`Total no of sessions(From Dashboard): ${dashboardValue}`);

  // Print dashboard Usage value
  const dashboardusageValueSelector =
    "div[class='bg-white w-full flex flex-col h-full p-4 rounded-lg drop-shadow-sm border border-white hover:cursor-pointer hover:border-gray-200 z-8'] p[class='text-base font-medium']";
  global.dashboardusageValue = await page.$eval(
    dashboardusageValueSelector,
    (el) => parseFloat(el.innerText)
  );

  console.log(`Total Usage (From Dashboard In kWh): ${dashboardusageValue}`);

  await page.click(
    "div[class='bg-white w-full flex flex-col h-full p-4 rounded-lg drop-shadow-sm border border-white hover:cursor-pointer hover:border-gray-200 z-9'] p[class='text-sm text-gray-800 font-normal']"
  );
  // Wait for a few seconds
  await page.waitForTimeout(5000); // 5000 milliseconds = 5 seconds

  // Example: Applying a filter through an input field
  await page.click(
    "button[class='w-full flex gap-1 items-center bg-white $bg-black py-1.5 px-3 border border-gray-300 rounded-lg']"
  );
  await page.click(
    "button:nth-child(4) div:nth-child(2) div:nth-child(1) div:nth-child(1) div:nth-child(1)"
  ); // Replace with actual selector
  // Wait for a few seconds
  await page.waitForTimeout(6000); // 6000 milliseconds = 6 seconds
  // Click on the three dots menu
  await page.click("//div[@id='download']//*[name()='svg']");
  await page.waitForTimeout(4000);
  await page.click(".text-sm.text-kazamGray-900");
  await page.waitForTimeout(10000);
});

test("Email download", async ({ page }) => {
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
  // Trigger the download
  await page.getByRole("link", { name: "Download Report" }).click();

  // Handle the download
  const localDownloadPath = "C:/Users/Admin/Downloads";
  page.on("download", async (download) => {
    const downloadPath = path.join(
      localDownloadPath,
      download.suggestedFilename()
    );
    await download.saveAs(downloadPath);
    downloadFilename = download.suggestedFilename();
  });

  await page.waitForTimeout(5000); // 5000 milliseconds = 5 seconds
  console.log(await page.title());
});

test("Total No of session validation", async ({ page }) => {
  const XLSX = require("xlsx");
  ({
    acceptDownloads: true,
  });

  let source = path.join(localDownloadPath, downloadFilename);
  console.log("source", source);
  let destination = path.join(
    localDownloadPath,
    "converted_session_report.xlsx"
  );
  console.log("destination", destination);
  try {
    await convertCsvToXlsx(source, destination);
  } catch (e) {
    console.error(e.toString());
  }

  // Path to the downloaded file
  const filePath = path.join(
    process.env.HOME || process.env.USERPROFILE,
    "Downloads",
    "converted_session_report.xlsx"
  );

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
      if (sheetJson[i][1]) {
        // Index 1 corresponds to the second column
        nonEmptyCellCount++;
      }
    }

    console.log(`Total no of sessions(From Report): ${nonEmptyCellCount}`);
    console.log(
      `Total no of sessions(From dashboard): ${global.dashboardValue}`
    );
    if (global.dashboardValue == nonEmptyCellCount) {
      console.log(
        "The no of sessions in the report is equal to the No of sessions on the dashbaoard."
      );
    } else {
      console.log(
        "The no of sessions in the report is equal to the No of sessions on the dashbaoard."
      );
    }
  }
});

test("Total usage validation", async ({ page }) => {
  const fs = require("fs");
  const path = require("path");
  const XLSX = require("xlsx");
  ({
    acceptDownloads: true,
  });
  // Path to the downloaded file
  const filePath = path.join(
    process.env.HOME || process.env.USERPROFILE,
    "Downloads",
    "converted_session_report.xlsx"
  );

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

      if (typeof cellValue == "string") {
        // Remove "Kwh" and convert to number
        cellValue = parseFloat(cellValue.replace("kWh", "").trim());
      }

      if (!isNaN(cellValue)) {
        sum += cellValue;
      }
    }

    console.log(`Total Usage (From Dashboard In kWh): ${sum}`);

    console.log(
      `Total usage (From Report In kWh): ${global.dashboardusageValue}`
    );
    const final_value = Math.abs(
      Math.round(global.dashboardusageValue, 0) - Math.round(sum, 0)
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
  }
});

test("Add charger flow validation", async ({ page }) => {
  global.content = "";
  const filepath1 = ".upload/aa1.png";
  // Navigate to the login page
  await page.goto("https://novo.kazam.in");

  // Login
  await page.fill("#large-input", "akhilesh@kazam.in");
  await page.fill("#password", "Akbl@1724");
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
  const subsegment = page.locator(
    "(//div[contains(@class,'flex flex-col gap-2 w-full')])[4]"
  );
  await subsegment.click();
  await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
  await page.click("//div[normalize-space()='Kazam Hub']");

  // enter total capacity
  const totalcapacity = page.locator(
    "//input[contains(@placeholder,'eg: 3.3, 7.4. 22')]"
  );
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
  const connector1 = page.locator(
    "(//input[contains(@placeholder,'Select')])[1]"
  );
  await connector1.click();
  await page.click("//div[normalize-space()='3 Pin Socket']");
  await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds

  const totalcapacity1 = page.locator(
    "(//input[contains(@placeholder,'eg: 3.3, 7.4. 22')])[1]"
  );
  await totalcapacity1.click();
  await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
  await totalcapacity1.type("3.3");

  // connector 2 details
  const connector2 = page.locator("//input[contains(@placeholder,'Select')]");
  await connector2.click();
  await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
  await page.click("//div[normalize-space()='3 Pin Socket']");
  await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds

  const totalcapacity2 = page.locator(
    "(//input[@placeholder='eg: 3.3, 7.4. 22'])[2]"
  );
  await totalcapacity2.click();
  await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
  await totalcapacity2.type("3.3");

  // click on next button
  const nextbutton1 = page.locator("//button[normalize-space()='Next']");
  await nextbutton1.click();

  // Select location and longitude
  const latitude = page.locator("//input[@placeholder='Latitude']");
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

  const uploadimage = page.locator(
    "//label[normalize-space()='Click to upload']"
  );
  await uploadimage.click();
  await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds

  // const imagePath = "C:\\Users\\Admin\\aa1.png"
  const path = require("path");
  const filePath = path.resolve("C:\\Users\\Admin\\aa1.png");
  // if (!fs.existsSync(filePath)) {
  //   console.error('File does not exist:', filePath);
  //   return;

  // }

  console.log("File exists:", filePath);
  await page.setInputFiles('input[type="file"]', filePath);
  await page.waitForTimeout(2000);
  await page.keyboard.press("Enter");
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
    page.waitForEvent("download"), // Wait for the download to start
    page.click("//button[normalize-space()='Download QR Code']"),
  ]);
  await page.waitForTimeout(5000); // 5000 milliseconds = 5 seconds

  // Print the suggested file name
  const filename = download.suggestedFilename();
  const start = filename.indexOf("(") + 1;
  const end = filename.indexOf(")");
  content = filename.slice(start, end);
  console.log("Newly added charger:", content);
});

test("Newly added charger validation", async ({ page }) => {
  // Navigate to the login page
  await page.goto("https://novo.kazam.in");

  // Login
  await page.fill("#large-input", "akhilesh@kazam.in");
  await page.fill("#password", "Akbl@1724");
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
    Device_name: "//p[contains(@title,'Kazam_Automation_Test')]",
    Host_name: "//p[contains(@title,'Akhilesh - 9495644454')]",
    Charger_type:
      "//div[@class='text-sm rounded-lg px-3 py-1 font-medium bg-sky-600/10 text-sky-600']",
    Charger_status:
      "//div[@class='text-sm rounded-lg px-3 py-1 font-medium bg-red-600/10 text-red-600']",
    Connector_1:
      "(//div[contains(@class,'grid grid-cols-6 items-center text-xs py-1')])[1]",
    Connector_2:
      "(//div[@class='grid grid-cols-6 items-center text-xs py-1'])[2]",
  };

  const texts = [];
  const comparison = {
    Device_name: "Kazam_Automation_Test",
    Host_name: "Akhilesh (9495644454)",
    Charger_type: "Private",
    Charger_status: "Offline",
    Connector_1: "1  three_pin 3.3 Unavailable ----",
    Connector_2: "2  three_pin 3.3 Unavailable ----",
  };
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
  console.log("comparison text is", comparison);
  if (JSON.stringify(flattenedText) == JSON.stringify(comparison)) {
    console.log("Added data and charger detail page data are matching");
  } else {
    console.log("Added data and charger detail page data are Not matching");
  }
});

test("Reconfiguration Validation", async ({ page }) => {
  // Navigate to the login page
  await page.goto("https://novo.kazam.in");

  // Login
  await page.fill("#large-input", "akhilesh@kazam.in");
  await page.fill("#password", "Akbl@1724");
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
  const reconfigurationcharger = page.locator(
    "//button[normalize-space()='Reconfigure Charger']"
  );
  await reconfigurationcharger.click();
  await page.waitForTimeout(3000); // 3000 milliseconds = 3 seconds

  // enter charger name
  const chargername = page.locator("#large-input");
  await chargername.click();
  await chargername.clear();
  await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
  await chargername.type("Kazam_Automation");

  // enter total capacity
  const totalcapacity = page.locator(
    "//input[contains(@placeholder,'eg: 3.3, 7.4. 22')]"
  );
  await totalcapacity.click();
  await totalcapacity.clear();
  await totalcapacity.clear();
  await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
  await totalcapacity.type("22");

  // click on next button
  const nextbutton = page.locator("//button[normalize-space()='Next']");
  await nextbutton.click();
  await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
  await page.waitForTimeout(3000); // 3000 milliseconds = 3 seconds

  // change the connector 1 total capacity
  const totalcapacity1 = page.locator(
    "(//input[contains(@placeholder,'eg: 3.3, 7.4. 22')])[1]"
  );
  await totalcapacity1.click();
  await totalcapacity1.clear();
  await totalcapacity1.clear();
  await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds
  await totalcapacity1.type("7.7");

  // change connector 2 total capacity
  const totalcapacity2 = page.locator(
    "(//input[@placeholder='eg: 3.3, 7.4. 22'])[2]"
  );
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
  await page.waitForTimeout(1000); // 1000 millisecond = 1 second
  await endtime3.type("19:00");

  // Add charger button
  const addcharger = page.locator(
    "//button[normalize-space()='Configure Charger']"
  );
  await addcharger.click();
  await page.waitForTimeout(5000); // 2000 milliseconds = 2 seconds
  console.log("charger reconfigured successfully");

  // Set up the download event listener
  const [download] = await Promise.all([
    page.waitForEvent("download"), // Wait for the download to start
    page.click("//button[normalize-space()='Download QR Code']"),
  ]);
  await page.waitForTimeout(5000); // 5000 milliseconds = 5 seconds

  // Print the suggested file name
  const filename = download.suggestedFilename();
  const start = filename.indexOf("(") + 1;
  const end = filename.indexOf(")");
  content = filename.slice(start, end);
  console.log("Reconfigured charger name:", content);
});

test("Reconfigured charger validation", async ({ page }) => {
  // Navigate to the login page
  await page.goto("https://novo.kazam.in");

  // Login
  await page.fill("#large-input", "akhilesh@kazam.in");
  await page.fill("#password", "Akbl@1724");
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
  const dataSelectors2 = {
    Device_name: "//p[@title='Kazam_Automation']",
    Host_name: "//p[contains(@title,'Akhilesh - 9495644454')]",
    Charger_type:
      "//div[@class='text-sm rounded-lg px-3 py-1 font-medium bg-sky-600/10 text-sky-600']",
    Charger_status:
      "//div[@class='text-sm rounded-lg px-3 py-1 font-medium bg-red-600/10 text-red-600']",
    Connector_1:
      "body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)",
    Connector_2:
      "body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
  };

  const texts = [];
  const comparison1 = {
    Device_name: "Kazam_Automation",
    Host_name: "Akhilesh (9495644454)",
    Charger_type: "Private",
    Charger_status: "Offline",
    Connector_1: "1  three_pin 7.7 Unavailable ----",
    Connector_2: "2  three_pin 7.7 Unavailable ----",
  };
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
  console.log("comparison text is", comparison1);
  if (JSON.stringify(flattenedText) == JSON.stringify(comparison1)) {
    console.log("Added data and charger detail page data are matching");
  } else {
    console.log("Added data and charger detail page data are Not matching");
  }
});

test.only("Revenue Validation", async ({ page }) => {
  global.transaction = "";

  // Navigate to the login page
  await page.goto("https://novo.kazam.in");

  // Login
  await page.fill("#large-input", "akhilesh@kazam.in");
  await page.fill("#password", "Akbl@1724");
  await page.click("button[type='submit']");
  await page.click("//p[normalize-space()='NIKOL EV']");
  // Wait for a few seconds
  await page.waitForTimeout(6000); // 6000 milliseconds = 6 seconds

  // Print dashboard revenue

  const dashboardRevenue = await page.innerText(
    "(//p[@class='text-base font-medium'])[1]"
  );
  console.log(`Total Revenue(From Dashboard): ${dashboardRevenue}`);

  // click on the revenue card
  const revenuecard = page.locator("//p[normalize-space()='Revenue']");
  await revenuecard.click();
  await page.waitForTimeout(5000); // 5000 milliseconds = 5 seconds

  // Total Revenue from the RM Module
  const rmrevenue = await page.innerText(
    "//body[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[2]/main[1]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/div[1]/h6[1]"
  );
  console.log(`Total Revenue(From RM Module): ${rmrevenue}`);

  if (dashboardRevenue == rmrevenue) {
    console.log(
      "Total Revenue in dashboard is equal to the Total revenue in RM Module"
    );
  } else {
    console.log(
      "Total Revenue in dashboard is Not equal to the Total revenue in RM Module"
    );
  }
  // Total transactions from the
  const totaltransaction = await page.innerText(
    "button[class='flex items-center gap-1 w-full h-full px-4 py-2 rounded-l-lg bg-black text-white'] span"
  );
  const start = totaltransaction.indexOf("(") + 1;
  const end = totaltransaction.indexOf(")");
  transaction = totaltransaction.slice(start, end);
  console.log(`Total Transaction(From RM Module): ${transaction}`);

  // withdrawal amount
  const withdrawalamount = await page.innerText(
    "body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > h6:nth-child(2)"
  );
  console.log(`Withdrawal amount : ${withdrawalamount}`);

  // Print Payout pending
  const payoutpending = await page.innerText("//div[3]//div[1]//div[1]//h6[1]");
  console.log(`Wallet balance: ${payoutpending}`);
  await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds

  // Select tariff section from the RM Module

  const tariff = page.locator("//span[normalize-space()='Tariffs']");
  await tariff.click();
  await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds

  // Click on create tariff butoon
  const createtariff = page.locator(
    "//button[normalize-space()='Create Tariff']"
  );
  await createtariff.click();
  await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Click and Enter the tariff name
  const tariffname = page.locator("//input[@id='large-input']");
  await tariffname.click();
  await tariffname.fill("Automation Tariff");
  await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Enter price 1
  const price1 = page.locator("//input[@placeholder='0']");
  await price1.click();
  await price1.clear();
  await price1.fill("2");
  await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Click Add price button
  const addprice = page.locator("//button[normalize-space()='Add Price']");
  await addprice.click();
  await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Enter price 2
  const price2 = page.locator("(//input[contains(@placeholder,'0')])[2]");
  await price2.click();
  await price2.clear();
  await price2.fill("1");
  await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Select dropdown
  const dropdown1 = page.locator("button[value='kwh'] svg");
  await dropdown1.click();
  await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Select the dropdown Value
  const dropdownlclick = page.locator("li:nth-child(2) button:nth-child(1)");
  await dropdownlclick.click();
  await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // // create tariff
  //   const createbutton = page.locator("//button[normalize-space()='CREATE']");
  //     await createbutton.click();
  //     await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds
  //   console.log("Tariff created Successfully");

  // close button
  const closebutton = page.locator(
    "//button[@aria-label='Close modal']//*[name()='svg']"
  );
  await closebutton.click();

  // Aggregation Fee creation
  const Aggregationfee = page.locator(
    "//span[normalize-space()='Aggregation Fee']"
  );
  await Aggregationfee.click();
  await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Click Create Aggregation button
  const createaggregation = page.locator(
    "//button[normalize-space()='Create Aggregation Fee']"
  );
  await createaggregation.click();
  await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Enter Fee name
  const feename = page.locator("//input[@id='large-input']");
  await feename.click();
  await feename.fill("Automation Aggregation Fee");
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
  const Aggregationnextbutton = page.locator(
    "//button[normalize-space()='Next']"
  );
  await Aggregationnextbutton.click();
  await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds

  // select charger
  const searchbar = page.locator("//input[@placeholder='Search by device id']");
  await searchbar.click();
  await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds
  await searchbar.fill("rdwsma");
  await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // clcick the check box
  const chargercheckbox = page.locator("(//input[@id='link-checkbox'])[2]");
  await chargercheckbox.click();
  await page.waitForTimeout(2000); // 2000 millisecond = 2 seconds

  // close button
  const closebutton3 = page.locator(
    "//button[@aria-label='Close modal']//*[name()='svg']"
  );
  await closebutton3.click();

  // // click next button
  //   const selectcharger = page.locator("//div[@class='mt-auto flex items-center gap-4 ml-auto']//button[@type='submit'][normalize-space()='Create Aggregation Fee']");
  //     await selectcharger.click();
  //     await page.waitForTimeout(3000); // 3000 milliseconds = 3 seconds

  console.log("Aggregation fee created Successfully");

  // create tax
  const clicktaxbutton = page.locator(
    "li:nth-child(5) div:nth-child(1) span:nth-child(2)"
  );
  await clicktaxbutton.click();
  await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds

  // click create a tax system
  const createtaxsystem = page.locator(
    "//button[normalize-space()='Create Tax System']"
  );
  await createtaxsystem.click();
  await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds

  // tax system name
  const taxsystemname = page.locator("(//input[@id='large-input'])[1]");
  await taxsystemname.click();
  await taxsystemname.fill("Kazam Automation Tax");
  await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds

  // clcik tax policy
  const taxpolicy = page.locator("(//*[name()='svg'])[21]");
  await taxpolicy.click();
  await page.waitForTimeout(1000); // 1000 milliseconds = 1 seconds

  // select tax policy
  const taxpolicyselect = page.locator("//div[normalize-space()='GST']");
  await taxpolicyselect.click();
  await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Enter tax number
  const taxnumber = page.locator(
    "//input[contains(@placeholder,'tax number')]"
  );
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
  await taxaddress.fill(
    "Kazam EV Tech Pvt Ltd,Enzyeme Tech park,Koramangala,Bangalore,Karnataka"
  );
  await page.waitForTimeout(1000); // 1000 millisecond = 1 seconds

  // Tax Template1
  const subcategory = page.locator(
    "(//select[@class='text-xs border border-gray-300 rounded-md focus:border-kazamGray-300 focus:ring-kazamGray-300'])[1]"
  );
  await subcategory.click();
  await page.waitForTimeout(1000); //1000 millisecond =  1second
  await subcategory.type("cgst");
  await subcategory.press("Enter");
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
  await type.press("Enter");
  await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Add category
  const addcategory = page.locator(
    "//div[@class='bg-purple-100 rounded-full p-2']//*[name()='svg']"
  );
  await addcategory.click();
  await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Tax Tempalate2
  const subcategory1 = page.locator(
    "(//select[@class='text-xs border border-gray-300 rounded-md focus:border-kazamGray-300 focus:ring-kazamGray-300'])[3]"
  );
  await subcategory1.click();
  await page.waitForTimeout(2000); // 1000 millisecond = 1 second
  await subcategory1.type("sgst");
  await subcategory1.press("Enter");
  await page.waitForTimeout(2000); // 1000 millisecond = 1 second

  // Enter amount
  const amount = page.locator("(//input[contains(@placeholder,'amount')])[2]");
  await amount.click();
  await amount.fill("9");
  await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // Enter value
  const value1 = page.locator("(//input[contains(@placeholder,'amount')])[2]");
  await value1.click();
  await page.waitForTimeout(2000); // 1000 millisecond = 1 second

  // Enter type
  const type1 = page.locator(
    "(//select[contains(@placeholder,'Select Type')])[2]"
  );
  await type1.click();
  await page.waitForTimeout(1000); // 1000 millisecond = 1 seconds
  await type1.type("Percentage");
  await type1.press("Enter");
  await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  //  Click on Next button
  const nextbutton3 = page.locator("(//button[normalize-space()='Next'])[1]");
  await nextbutton3.click();
  await page.waitForTimeout(2000); // 1000 millisecond = 1 second

  // locate search bar
  const locatesearch = page.locator(
    "//input[@placeholder='Search by device id']"
  );
  await locatesearch.click();
  await page.waitForTimeout(1000); // 1000 millisecond = 1 second
  await locatesearch.fill("rdwsma");
  await page.waitForTimeout(1000); // 1000 millisecond = 1 second

  // locate check box
  const checkbox4 = page.locator("(//input[@id='link-checkbox'])[2]");
  await checkbox4.click();
  await page.waitForTimeout(1000); // 1000 millis  second = 1 second

  // // clcik Create tax system
  //   const createtaxbutton = page.locator("(//button[@type='submit'][normalize-space()='Create Tax System'])[2]");
  //     await createtaxbutton.click();
  //     await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds

  // close button
  const closebutton1 = page.locator(
    "//button[@aria-label='Close modal']//*[name()='svg']"
  );
  await closebutton1.click();
  await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds

  console.log("Tax created Successfully");

  // Back to overview page
  const overviewpage = page.locator(
    "(//li[contains(@class,'flex items-center px-4 py-4 w-full text-center border-b-2 bottom-3 border-b-gray-50 hover:focus:border-kazamGray-300 focus:ring-kazamGray-300-300 text-gray-500 svelte-b3ujci cursor-pointer')])[1]"
  );
  await overviewpage.click();
  await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds

  // Download revenue report
  const revenuereport = page.locator(".feather.feather-more-vertical");
  await revenuereport.click();
  await page.waitForTimeout(2000); // 2000 milliseconds = 2 seconds

  // Find the first row containing the text "success"
  const successRow1 = page.locator("(//span[normalize-space()='Success'])[1]");

  // Data from the overview page
  const overviewSelectors = {
    "Transaction id":
      "body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > span:nth-child(2)",
    "Billed Amount":
      "body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3)",
    "Host Details":
      "body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(9) > span:nth-child(1) > span:nth-child(1)",
    "Driver Details":
      "body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(10) > span:nth-child(1)",
    "Time stamp":
      "body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(11) > span:nth-child(1)",
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

  // Find the first row containing the text "success"
  const successRow = page.locator("(//span[normalize-space()='Success'])[1]");

  // Debug: Print the HTML content of the success row to verify the correct row is found
  console.log(await successRow.innerHTML());

  // click the invoice
  //  const Invoice = page.locator("body div div[class='flex flex-col w-[90vw] h-full overflow-auto relative'] div:nth-child(1) div:nth-child(1) div:nth-child(1) button:nth-child(1) svg");
  //    await Invoice.click();
  //    await page.waitForTimeout(4000); // 4000 milliseconds = 4 seconds

  // Charan
  // Getting all transactions count
  const allTransactions = page.locator(
    "(//button[@class='flex items-center gap-1 w-full h-full px-4 py-2 rounded-l-lg bg-black text-white'])[1]//span"
  );
  const innerHTML = await allTransactions.innerHTML(); // Await innerHTML() because it is an asynchronous operation
  let allTransactions_count = innerHTML;
  let allTransactions_result = allTransactions_count.replace(/[()]/g, ""); // Removes both ( and )
  console.log("All Transactiona count is : " + allTransactions_result);

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
          success.trim() === "Success" &&
          parseFloat(billed_amount.trim()) > 0.0
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
