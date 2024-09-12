const fs = require("fs");
const path = require("path");

class EmailPage {
  constructor(page) {
    this.page = page;
    this.emailField = 'input[type="email"]';
    this.passwordField = 'input[type="password"]';
    this.identifierNextButton = 'div[id="identifierNext"]';
    this.passwordNextButton = 'div[id="passwordNext"]';
    this.emailGrid = 'table[role="grid"] tr.zA';
    this.emailContent = ".a3s";
    this.downloadLinkRole = { name: "Download Report" };
  }

  async navigateToGmail() {
    await this.page.goto("https://mail.google.com");
  }

  async login(email, password) {
    await this.page.waitForSelector(this.emailField, { visible: true });
    await this.page.fill(this.emailField, email);
    await this.page.click(this.identifierNextButton);

    await this.page.waitForTimeout(2000);
    await this.page.waitForSelector(this.passwordField, { visible: true });
    await this.page.fill(this.passwordField, password);
    await this.page.click(this.passwordNextButton);

    await this.page.waitForNavigation();
  }

  async openFirstEmail() {
    await this.page.waitForSelector(this.emailGrid, { visible: true });
    const firstEmail = await this.page.$(this.emailGrid);
    if (firstEmail) {
      await firstEmail.click();
    } else {
      console.log("No emails found in the inbox.");
    }
  }

  async downloadReport(localDownloadPath) {
    await this.page.waitForSelector(this.emailContent, { visible: true });
    await this.page.getByRole("link", this.downloadLinkRole).click();

    this.page.on("download", async (download) => {
      const downloadPath = path.join(localDownloadPath, download.suggestedFilename());
      await download.saveAs(downloadPath);
      console.log(`Downloaded file to: ${downloadPath}`);
    });

    await this.page.waitForTimeout(5000);
  }

  async getPageTitle() {
    return await this.page.title();
  }
}

module.exports = { EmailPage };