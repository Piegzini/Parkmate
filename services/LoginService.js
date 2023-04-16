require('dotenv').config();

class LoginService {
  constructor(passingDelay, readline) {
    this.rl = readline;
    this.delay = passingDelay;
  }

  async setEmail(page) {
    const emailInput = await page.waitForSelector('input[type=email]');
    await emailInput.type(process.env.EMAIL, { delay: this.delay });

    await page.keyboard.press('Enter');
  }

  async setPassword(page) {
    const passwordInput = await page.waitForSelector('input[type=password]');

    await page.waitForTimeout(1000);

    await passwordInput.type(process.env.PASSWORD, { delay: this.delay });
    await page.keyboard.press('Enter');
  }

  async setAuthCode(page) {
    const authCodeInput = await page.waitForSelector('input[type=tel]');
    const authCode = await this.rl.question('Wprowadź kod: ');
    await authCodeInput.type(authCode, { delay: this.delay });

    await page.keyboard.press('Enter');

    await page.waitForTimeout(500);
    const submit = await page.waitForSelector('input[type=submit]');
    await submit.click();
  }

  async signIn(page) {
    await this.setEmail(page);
    await this.setPassword(page);
    await this.setAuthCode(page);
  }
}

module.exports = { LoginService };
