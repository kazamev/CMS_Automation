class DashboardPage {
    constructor(page) {
        this.page = page;

        // Selectors for dashboard elements
        this.dashboardValueSelector = "div[class='bg-white w-full flex flex-col h-full p-4 rounded-lg drop-shadow-sm border border-white hover:cursor-pointer hover:border-gray-200 z-9'] p[class='text-base font-medium']";
        this.dashboardUsageValueSelector = "div[class='bg-white w-full flex flex-col h-full p-4 rounded-lg drop-shadow-sm border border-white hover:cursor-pointer hover:border-gray-200 z-8'] p[class='text-base font-medium']";
        this.sessionValueClickSelector = "div[class='bg-white w-full flex flex-col h-full p-4 rounded-lg drop-shadow-sm border border-white hover:cursor-pointer hover:border-gray-200 z-9'] p[class='text-sm text-gray-800 font-normal']";
        this.filterButtonSelector = "button[class='w-full flex gap-1 items-center bg-white $bg-black py-1.5 px-3 border border-gray-300 rounded-lg']";
        this.filterOptionSelector = "button:nth-child(4) div:nth-child(2) div:nth-child(1) div:nth-child(1) div:nth-child(1)";
        this.threeDotsMenuSelector = "//div[@id='download']//*[name()='svg']";
        this.downloadOptionSelector = ".text-sm.text-kazamGray-900";
    }

    // Method to get the dashboard session value
    async getDashboardValue() {
        return await this.page.$eval(this.dashboardValueSelector, (el) => parseFloat(el.innerText));
    }

    // Method to get the dashboard usage value
    async getDashboardUsageValue() {
        return await this.page.$eval(this.dashboardUsageValueSelector, (el) => parseFloat(el.innerText));
    }

    // Method to click on the session value
    async clickSessionValue() {
        await this.page.click(this.sessionValueClickSelector);
    }

    // Method to apply a filter
    async applyFilter() {
        await this.page.click(this.filterButtonSelector);
        await this.page.click(this.filterOptionSelector);
    }

    // Method to download a report
    async downloadReport() {
        await this.page.click(this.threeDotsMenuSelector);
        await this.page.waitForTimeout(4000); // Optionally wait for dropdown to load
        await this.page.click(this.downloadOptionSelector);
        await this.page.waitForTimeout(10000); // Wait for the download to complete
    }
}

module.exports = DashboardPage;

