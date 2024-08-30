class LoginPage {
    constructor(page) {
        this.page = page;
        this.emailInputSelector = '#large-input';
        this.passwordInputSelector = '#password';
        this.submitButtonSelector = "button[type='submit']";
        this.nikolEvLinkSelector = "//p[normalize-space()='NIKOL EV']";
    }

    async gotoLoginPage() {
        await this.page.goto('https://novo.kazam.in');
    }

    async login(email, password) {
        await this.page.fill(this.emailInputSelector, email);
        await this.page.fill(this.passwordInputSelector, password);
        await this.page.click(this.submitButtonSelector);
    }

    async selectNikolEv() {
        await this.page.click(this.nikolEvLinkSelector);
    }
}

module.exports = LoginPage;
