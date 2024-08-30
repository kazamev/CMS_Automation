class DashboardPage {
    constructor(page) {
        this.page = page;
        this.nikolEvLinkSelector = "//p[normalize-space()='NIKOL EV']";
        this.dashboardValueSelector = "div[class='bg-white w-full flex flex-col h-full p-4 rounded-lg drop-shadow-sm border border-white hover:cursor-pointer hover:border-gray-200 z-9'] p[class='text-base font-medium']";
        this.dashboardUsageValueSelector = "div[class='bg-white w-full flex flex-col h-full p-4 rounded-lg drop-shadow-sm border border-white hover:cursor-pointer hover:border-gray-200 z-8'] p[class='text-base font-medium']";
        this.usageDetailsSelector = "div[class='bg-white w-full flex flex-col h-full p-4 rounded-lg drop-shadow-sm border border-white hover:cursor-pointer hover:border-gray-200 z-9'] p[class='text-sm text-gray-800 font-normal']";
        this.filterButtonSelector = "button[class='w-full flex gap-1 items-center bg-white $bg-black py-1.5 px-3 border border-gray-300 rounded-lg']";
        this.filterOptionSelector = "button:nth-child(4) div:nth-child(2) div:nth-child(1) div:nth-child(1) div:nth-child(1)";
        this.threeDotsMenuSelector = "//div[@id='download']//*[name()='svg']";
        this.downloadOptionSelector = ".text-sm.text-kazamGray-900";
        this.emailInputSelector = 'input[type="email"]';
        this.passwordInputSelector = 'input[type="password"]';
        this.nextButtonSelector = 'div[id="identifierNext"], div[id="passwordNext"]';
        this.inboxEmailSelector = 'table[role="grid"] tr.zA';
        this.emailContentSelector = '.a3s';
        this.downloadLinkSelector = "a:has-text('Download Report')";
    }

    async navigateToNikolEv() {
        await this.page.click(this.nikolEvLinkSelector);
    }

    async getDashboardValue() {
        return await this.page.$eval(this.dashboardValueSelector, el => parseFloat(el.innerText));
    }

    async getDashboardUsageValue() {
        return await this.page.$eval(this.dashboardUsageValueSelector, el => parseFloat(el.innerText));
    }

    async openUsageDetails() {
        await this.page.click(this.usageDetailsSelector);
    }

    async applyFilter() {
        await this.page.click(this.filterButtonSelector);
        await this.page.click(this.filterOptionSelector);
    }

    async downloadReport() {
        await this.page.click(this.threeDotsMenuSelector);
        await this.page.click(this.downloadOptionSelector);
    }

    async gotoGmail() {
        await this.page.goto('https://mail.google.com');
    }

    async login(email, password) {
        await this.page.waitForSelector(this.emailInputSelector, { visible: true });
        await this.page.fill(this.emailInputSelector, email);
        await this.page.click(this.nextButtonSelector);
        await this.page.waitForTimeout(2000); // Wait for transition
        await this.page.waitForSelector(this.passwordInputSelector, { visible: true });
        await this.page.fill(this.passwordInputSelector, password);
        await this.page.click(this.nextButtonSelector);
        await this.page.waitForNavigation(); // Wait for login to complete
    }

    async openFirstEmail() {
        await this.page.waitForSelector(this.inboxEmailSelector, { visible: true });
        const firstEmail = await this.page.$(this.inboxEmailSelector);
        if (firstEmail) {
            await firstEmail.click();
        } else {
            console.log("No emails found in the inbox.");
        }
    }

    async downloadReport(localDownloadPath) {
        await this.page.waitForSelector(this.emailContentSelector, { visible: true });
        await this.page.waitForSelector(this.downloadLinkSelector, { visible: true });
        await this.page.click(this.downloadLinkSelector);

        // Handle the download
        this.page.on('download', async (download) => {
            const downloadPath = path.join(localDownloadPath, download.suggestedFilename());
            await download.saveAs(downloadPath);
            console.log(`Downloaded file to: ${downloadPath}`);
        });

        await this.page.waitForTimeout(5000); // Give time for download to start
    }
}


module.exports = DashboardPage;
