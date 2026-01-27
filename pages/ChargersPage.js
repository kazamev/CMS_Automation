import fs from "fs";
import path from "path";
import * as excel from "xlsx";

export class ChargersPage {

    constructor(page) {
        this.page = page;

        // Top counters2
        this.chargersCount = page.locator("//div[contains(.,'Chargers')]/span[contains(@class,'text-black')]");
        this.connectorsCount = page.locator("//div[contains(., 'Connectors')]/span[contains(@class,'text-black')]");
        this.nonConfigCount = page.locator("//div[contains(., 'Non Configured')]/span[contains(@class,'text-black')]");

        // Connector status buttons
        this.btnAll = page.locator("(//div[starts-with(normalize-space(), 'All(')])[4]");
        this.btnBusy = page.locator("//button[.//div[contains(@class,'bg-[#6A8DE1]')]]");
        this.btnAvailable = page.locator("//button[.//div[contains(@class,'bg-[#56B588]')]]");
        this.btnError = page.locator("//button[.//div[contains(@class,'whitespace-nowrap')]]");

        // Add Charger
        this.btnAddCharger = page.locator("//button[@type='submit' and contains(., 'Add Charger')]");

        // Add charger page fields
        this.inputChargerName = page.locator("//input[@id='large-input']");
        this.inputHostPhoneNumber = page.locator("//input[@placeholder='Host phone number']");
        this.SegmentDropdown = page.locator("(//input[@placeholder='Select'])[1]");
        this.SubsegmentDropdown = page.locator("(//input[@type=\"text\"])[3]");
        this.Capacity = page.locator("(//input[@type=\"number\"])[2]");
        this.ACcharger = page.locator("(//p[@class=\"mx-auto\"])[1]");
        this.DCcharger = page.locator("(//p[@class=\"mx-auto\"])[2]");
        this.parkingTypeDropdown = page.locator("(//input[@type=\"text\"])[4]");
        this.nextButton1 = page.locator("//button[@type='submit']");
        this.numberOfConnectors = page.locator("(//p[@class=\"mx-auto\"])[1]");
        // this.numberOfConnectors = page.locator("(//p[@class=\"mx-auto\"])[2]");
        // this.numberOfConnectors = page.locator("(//p[@class=\"mx-auto\"])[3]");
        // this.numberOfConnectors = page.locator("(//p[@class=\"mx-auto\"])[4]");
        this.connectorTypeDropdown = page.locator("(//input[@placeholder='Select'])[1]");
        this.TotalCapacity = page.locator("(//input[@placeholder=\"eg: 3.3, 7.4. 22\"])[1]");
        this.nextButton2 = page.locator("//button[text()=\"Next\"]");
        this.PreviousButton1 = page.locator("//button[text()=\"Previous step\"]");
        this.inputLatitude = page.locator("(//input[@type=\"number\"])[1]");
        this.inputLongitude = page.locator("(//input[@type=\"number\"])[2]");
        this.GetAddressBtn = page.locator("//button[text()=\"Get Address\"]");  
        this.NextButton3 = page.locator("//button[text()=\"Next\"]");
        this.PreviousButton2 = page.locator("//button[text()=\"Previous step\"]");

        this.PrivateChargerDropDown = page.locator("(//input[@placeholder='Select'])[1]");
        this.Open24_7 = page.locator("(//input[@type=\"text\"])[2]");
        this.imageUpload = page.locator("//input[@type='file']");
        this.AddChargerbtn = page.locator("//button[text()=\"Add Charger\"]");
        this.PreviousButton3 = page.locator("//button[text()=\"Previous step\"]")
        this.chargerUrlInput = page.locator('#large-input');
    
        this.BackButton= page.locator("//span[text()='Back']");
        this.afterchargersCount= page.locator("//span[@class=\"text-sm text-black\"]");

        this.reconfigureButton= page.locator("//button[text()=\"Reconfigure Charger\"]"); 
        this.configuredButton= page.locator("//button[text()=\"Configure Charger\"]");
        this.reconfiguretoolButton = page.locator("//*[name()='path' and contains(@d,'M15.6613 6')]");
        this.installationDate = page.locator("//span[contains(@class,'flex') and contains(@class,'text-sm')]");
        this.reconfigurationDate = page.locator("(//span[contains(@class,'flex')])[8]");
        this.downloadQR= page.locator("//button[text()=\"Download QR Code\"]");
        this.sessionbtn= page.locator("//span[normalize-space()='Sessions']");
        this.chargersbtn= page.locator("//span[normalize-space()='Chargers']");
        this.BackAfterConfigCloseButton= page.locator("//button[normalize-space()='Back']");
        this.ConfigureClosebtn= page.locator("(//*[name()='path'][@clip-rule='evenodd'])[1]");
        this.downloadButton = page.locator("//div[@id='download']//*[name()='svg']");
        this.excelOption = page.locator("(//div[@class='flex items-center gap-2 m-1 hover:bg-kazamGray-100 p-2 rounded-md'])[2]");
    }


    // Top counters
    async getChargerCounts() {
    await this.page.waitForTimeout(500); // small buffer time
    await this.chargersCount.waitFor({ state: "visible", timeout: 5000 });
    await this.connectorsCount.waitFor({ state: "visible", timeout: 5000 });
    await this.nonConfigCount.waitFor({ state: "visible", timeout: 5000 });

    return {
        chargers: await this.chargersCount.textContent(),
        connectors: await this.connectorsCount.textContent(),
        nonConfigured: await this.nonConfigCount.textContent()
    };
}


// Get charger counts after adding/reconfiguring charger
   async getAfterChargerCounts() {
    await this.sessionbtn.click();
    await this.page.waitForLoadState("networkidle");
    await this.chargersbtn.click();
    await this.page.waitForLoadState("networkidle");
    await this.afterchargersCount.waitFor({ state: "visible" });
    await this.page.waitForTimeout(1500);
    const text = await this.afterchargersCount.textContent();
    return Number(text.trim());
}

    
// Connector status count
async getConnectorStatusCounts() {
    return {
            All: await this.btnAll.textContent(),
            Busy: await this.btnBusy.textContent(),
            Available: await this.btnAvailable.textContent(),
            Error: await this.btnError.textContent(),
        };
    }

    
// Add charger flow
async openAddCharger() {
        await this.btnAddCharger.click();
    }

async fillChargerDetails(data) {
    //Basic Charger Information
    await this.inputChargerName.fill(data.name);
    await this.inputHostPhoneNumber.type(data.hostPhone, { delay: 300 });
    
    // Segment
    await this.SegmentDropdown.click();
    await this.page.locator(`//div[text()="${data.segment}"]`).click();
    await this.page.waitForTimeout(1000);

    // Sub-segment
    await this.SubsegmentDropdown.click();
    await this.page.locator(`//div[text()="${data.subsegment}"]`).click();
    await this.page.waitForTimeout(1000);

    // Capacity
    await this.Capacity.fill(data.capacity);

    // Charger Type (AC / DC)
    if (data.type === "AC") {
        await this.ACcharger.click();
        await this.page.waitForTimeout(1000);
    } else {
        await this.DCcharger.click();
        await this.page.waitForTimeout(1000);
    }

    // Parking Type
    await this.parkingTypeDropdown.click();
    await this.page.locator(`//span[text()="${data.parkingType}"]`).click();
    await this.page.waitForTimeout(1000);
    await this.nextButton1.click();


    //Connector Information
    await this.numberOfConnectors.click();
    await this.page.waitForTimeout(1000);

    await this.connectorTypeDropdown.click();
    await this.page.locator(`//div[text()="${data.connectorType}"]`).click();
    await this.page.waitForTimeout(1000);

    await this.TotalCapacity.fill(data.totalCapacity);
    await this.page.waitForTimeout(1000);

    await this.nextButton2.click();


    //Location Details
    await this.inputLatitude.fill(data.lat);
    await this.page.waitForTimeout(1000);
    await this.inputLongitude.fill(data.long);
    await this.page.waitForTimeout(1000);
    await this.GetAddressBtn.click();
    await this.page.waitForTimeout(1000);

    await this.NextButton3.click();


    //Additional Info
    await this.PrivateChargerDropDown.click();
    await this.page.locator(`//div[text()="${data.privateCharger}"]`).click();
    await this.page.waitForTimeout(1000);
    await this.Open24_7.click();
    await this.page.locator(`//div[text()="${data.open247}"]`).click();

    // Image Upload
    await this.imageUpload.setInputFiles(data.imagePath);
  
    // Save/Add Charger
    await this.AddChargerbtn.click();
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(1000);
    // await this.page.pause();
}

// Fetch Charger ID from the URL input
async getChargerId() {
    const url = await this.chargerUrlInput.inputValue();
    if (!url) return null;
    const parts = url.split('/');
    const chargerId = parts[parts.length - 1]; // Last part of the URL
    return chargerId;
}

async ChargerReconfiguration(data){
    await this.reconfigureButton.waitFor({ state: "visible" });
   await this.reconfigureButton.click();

// Wait for the reconfiguration form fields to appear
await this.inputChargerName.waitFor({ state: "visible", timeout: 15000 });
    await this.inputChargerName.click();
    await this.inputChargerName.fill("");
    await this.inputChargerName.fill(data.newChargerName);
    await this.page.waitForTimeout(1000);
    

    await this.nextButton1.click();
    await this.page.waitForTimeout(1000);
    await this.connectorTypeDropdown.click();

    await this.page.locator(`//div[text()="${data.newConnectortype}"]`).click();
    await this.page.waitForTimeout(1000);

    await this.nextButton2.click();
    await this.page.waitForTimeout(1000);
    await this.NextButton3.click();
    await this.configuredButton.click();

    await this.page.waitForLoadState("networkidle");
    console.log("Charger Reconfigured Successfully");
    await this.BackButton.click();
    await this.page.waitForTimeout(5000);


}

async Validateconfiguration(chargerId, data) {
    // Search charger
    const searchField = this.page.locator('//input[@type="search"]');
    await searchField.fill(chargerId);

    // Locate charger row dynamically
    const chargerRow = this.page.locator(`//tr[.//p[text()="${chargerId}"]]`);
    await chargerRow.waitFor({ state: "visible", timeout: 10000 });
    await chargerRow.click();
    await this.page.waitForLoadState("networkidle");

    // Locators
    const devicename = this.page.locator("(//p[contains(@class, 'one_line_wrapper')])[2]");
    const connectortype = this.page.locator("//div[contains(@class,'one_line_wrapper')]");

    // Validations
    const deviceNameText = (await devicename.textContent()).trim();
    const connectorTypeText = (await connectortype.textContent());
    console.log("Device Name:", deviceNameText);
    console.log("Connector Type:", connectorTypeText);

    if (deviceNameText.toLowerCase() === data.newChargerName.toLowerCase()){
        console.log("Charger Name updated successfully");
    } else {
        console.log("Charger Name NOT updated");
    }

    if (connectorTypeText.toLowerCase() === data.newConnectortype.toLowerCase()) {
        console.log("Connector Type updated successfully");
    } else {
        console.log("Connector Type NOT updated");
    }
}

async ReconfigurationDates() {
    // Click the reconfigure tool button
    await this.reconfiguretoolButton.click();
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(500); // small buffer

    // Get dates
    const installDate = (await this.installationDate.textContent())?.trim();
    const reconfigDate = (await this.reconfigurationDate.textContent())?.trim();

    // Close modal & back
    await this.ConfigureClosebtn.click();
    await this.page.waitForTimeout(1000);
    await this.BackAfterConfigCloseButton.click();
    await this.page.waitForLoadState("networkidle");
    return { installDate, reconfigDate };
}

async downloadExcel() {
    const downloadPromise = this.page.waitForEvent("download");

    //Click download on 3dots menu
    await this.downloadButton.click();
    await this.page.waitForTimeout(1000);
    await this.excelOption.waitFor({ state: "visible", timeout: 5000 });
    await this.excelOption.click();

    //Wait for file
    const download = await downloadPromise;

    //Check "downloads" folder exists in current directory
    const downloadDir = path.join(__dirname, "downloads");
    if (!fs.existsSync(downloadDir)) {
        fs.mkdirSync(downloadDir);
    }
    //Save the file
    const filePath = path.join(downloadDir, "chargers.xlsx");
    await download.saveAs(filePath);
    console.log("Excel Downloaded ", filePath);
    return filePath;
}

// Count Charger IDs in Excel
async countChargerIdsInExcel(filePath) {
    const wb = excel.readFile(filePath);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const data = excel.utils.sheet_to_json(sheet, { header: 1 }); 
    const rows = data.slice(1);
    const chargerIDs = rows
        .map(r => r[0])       // change index based on required column
        .filter(id => id);
    console.log("Excel Charger ID Count :", chargerIDs.length);
    return chargerIDs.length;
}

// Verify Excel count matches UI count
 async verifyExcelCountMatchesUI(afterCount) {
        const filePath = await this.downloadExcel();
        const excelCount = await this.countChargerIdsInExcel(filePath);
        if (excelCount === afterCount) {
            console.log("Excel count matches UI count ", excelCount);
        } else {
            console.log(`Count mismatch  UI: ${afterCount}, Excel: ${excelCount}`);
        }
        return excelCount;
    }

}