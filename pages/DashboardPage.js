class DashboardPage {
    constructor(page) {
        this.page = page;

        // Selectors for dashboard elements
        this.dashboardValueSelector = "div[class='bg-white w-full flex flex-col h-full p-4 rounded-lg drop-shadow-sm border border-white hover:cursor-pointer hover:border-gray-200 z-9'] p[class='text-base font-medium']";
        this.dashboardUsageValueSelector = "div[class='bg-white w-full flex flex-col h-full p-4 rounded-lg drop-shadow-sm border border-white hover:cursor-pointer hover:border-gray-200 z-8'] p[class='text-base font-medium']";
        this.sessionValueClickSelector = "div[class='bg-white w-full flex flex-col h-full p-4 rounded-lg drop-shadow-sm border border-white hover:cursor-pointer hover:border-gray-200 z-9'] p[class='text-sm text-gray-800 font-normal']";
        this.filterButtonSelector = "(//button[contains(@class,'bg-white')])[4]";
        this.filterOptionSelector = "//div[contains(text(),'This month')]";
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
    async filterButton() {
        await this.page.click(this.filterButtonSelector);
    }

    async selectFilter() { 
        await this.page.click(this.filterOptionSelector);
    }

    async threeDots(){
        await this.page.click(this.threeDotsMenuSelector);
    }

    async downloadReport() {
        await this.page.click(this.downloadOptionSelector)
    }
}

module.exports = DashboardPage;

