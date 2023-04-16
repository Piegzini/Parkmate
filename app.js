const puppeteer = require('puppeteer');
const moment = require('moment');
const { LoginService } = require('./services/LoginService');
const { ReserveService } = require('./services/ReserveService');
const rl = require('node:readline/promises').createInterface({
  input: process.stdin,
  output: process.stdout,
});
require('dotenv').config();

const init = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: './browser_profile',
  });

  const loginService = new LoginService(40, rl);
  const reserveService = new ReserveService();
  const bot = new Bot(browser, loginService, reserveService, process.env.URL);
};

class Bot {
  constructor(browser, loginService, reserveService, url) {
    this.browser = browser;
    this.loginService = loginService;
    this.reserveService = reserveService;
    this.url = url;

    this.init().then();
  }

  async init() {
    this.page = await this.browser.newPage();
    this.reserveService.setPageResponseListener(this.page);

    await this.page.goto(this.url);

    try {
      const microsoftButton = await this.page.waitForSelector(
        'button.btnWhite',
        { timeout: 3000 }
      );

      await microsoftButton.click();
    } catch (e) {
      await this.reserveService.setReservation(this.page);
    }

    await this.page.waitForTimeout(2000);

    const variant = await this.page.evaluate(this.checkVariant);

    switch (variant) {
      case 'login':
        await this.loginService.signIn(this.page);
        break;
      case 'auth':
        await this.loginService.auth();
        break;
    }
  }

  checkVariant() {
    if (document.querySelector('input[type=tel]')) return 'auth';

    if (document.querySelector('input[type=email]')) return 'login';

    return 'reserve';
  }
}

init();
