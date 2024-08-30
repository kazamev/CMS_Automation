const { test } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');

const NovoLogin = async () => {
test('Login and navigate to Nikol EV', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Go to the login page
    await loginPage.gotoLoginPage();

    // Perform login
    await loginPage.login('akhilesh@kazam.in', 'Akbl@1724');

    // Navigate to Nikol EV section
    await loginPage.selectNikolEv();
});
}

module.exports = { NovoLogin, };
