class LoginPage {
    constructor(page) {
        this.page = page;
        this.usernameInput = page.locator("//input[@id='large-input']");
        this.passwordInput = page.locator("//input[@id='password']");
        this.loginButton = page.locator("//button[normalize-space()='Login']");
        this.toastMessage = page.locator("//div[contains(@class,'toastify')]");
        this.error = page.locator("//p[normalize-space()='Email and password is required !']");
    }

    //navigate to the login page
    async goTo() {
        await this.page.goto("https://novo.kazam.in/auth/login");
    }

    //perform valid login
    async validLogin(username, password) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
// invalid login 
    async invalidLogin(username, password) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();  
    }




}

module.exports = { LoginPage };
