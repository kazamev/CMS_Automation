export class DriverCreationDeactivationPage {
constructor(page) {
        this.page = page;
        this.AddDriverBtn = page.locator("//button[normalize-space()='Add Driver']");
        this.DriverNameInput = page.locator("(//input[@id='large-input'])[1]");
        this.PhoneNumberInput = page.locator("//input[@placeholder='Phone Number']");
        this.EmailInput = page.locator("(//input[@id='large-input'])[2]");
        this.AddDriverButton = page.locator("//button[normalize-space()='Add']");


        //Driver Validation
        this.DrverAlert = page.locator("//span[normalize-space()='Driver Alerts']");
        this.SearchInput = page.locator("//*[@id='simple-search']");
        //to count search results
        this.DriverPhoneNum = page.locator("//*[@id='scroll_listener']/table/tbody/tr/td[2]/div/div");
        this.DriverSection = page.locator("//span[normalize-space()='Drivers']");

        //Driver Deactivation
        this.DeactivateIcon = page.locator("//*[name()='path' and contains(@d,'M17 3a2.82')]");
        this.StatusDropdown = page.locator("//input[@placeholder='Select']");
        this.DeactivatedOption = page.locator("//div[normalize-space()='Deactivated']");
        this.DeactivationReasonInput = page.locator("//input[@id='large-input']");
        this.SaveButton = page.locator("//button[normalize-space()='Save Changes']");
    }

    async DummyNumber() {
        const randomNum = Math.floor(Math.random() * 9000000000) + 1000000000;
        return randomNum.toString();
    }

    async DummyMail() {
        const randomString = Math.random().toString(36).substring(2, 10);
        return `${randomString}@example.com`;
    }

    //Driver Creation
    async createDriver(DriverData) {
        await this.AddDriverBtn.click();
        await this.page.waitForTimeout(2000);
        await this.DriverNameInput.fill(DriverData.Name);
        const phoneNum = await this.DummyNumber();
        await this.page.waitForTimeout(2000);
        await this.PhoneNumberInput.fill(phoneNum);
        await this.page.waitForTimeout(2000);
        const email = await this.DummyMail();
        await this.page.waitForTimeout(2000);
        await this.EmailInput.fill(email);
        await this.page.waitForTimeout(2000);
        await this.AddDriverButton.click();
        await this.page.waitForTimeout(2000);
        await this.page.waitForLoadState("networkidle");
        console.log(`Driver created with Name: ${DriverData.Name}, Phone: ${phoneNum}, Email: ${email}`);
        return { phoneNum, email };
    }

    //Driver Deactivation
    async deactivateDriver(phoneNum) {
        // await this.DrverAlert.click();
        // await this.page.waitForLoadState("networkidle");
        // await this.DriverSection.click();
        // await this.page.waitForLoadState("networkidle");
        await this.SearchInput.fill(phoneNum);
        await this.page.waitForTimeout(2000);
        const driverRow = await this.DriverPhoneNum.filter({ hasText: phoneNum });
        await this.page.waitForTimeout(5000);
        console.log(`Number of drivers found with phone number ${phoneNum}: ${await driverRow.count()}`);
        if (await driverRow.count() === 0) {
            console.log(`No driver found with phone number: ${phoneNum}`);
            return;
        }
        await this.page.waitForTimeout(2000);
        await driverRow.click();
        await this.page.waitForTimeout(2000);
        await this.DeactivateIcon.click();
        await this.page.waitForTimeout(2000);
        await this.StatusDropdown.click();
        await this.page.waitForTimeout(2000);
        await this.DeactivatedOption.click();
        await this.DeactivationReasonInput.fill("Testing the driver deactivation Flow");
        await this.page.waitForTimeout(2000);
        await this.SaveButton.click();
        await this.page.waitForTimeout(2000);
        console.log(`Driver with phone number ${phoneNum} has been deactivated.`);
    }

}