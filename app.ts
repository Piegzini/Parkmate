import puppeteer, { Browser, Page } from 'puppeteer';
import LoginService from './services/LoginService';
import ReserveService from './services/ReserveService';
import Token from './services/Token';
import * as readline from 'node:readline/promises';
import * as dotenv from 'dotenv';

dotenv.config();

const cout = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const init = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: './browser_profile',
  });

  const loginService = new LoginService(40, cout);
  const reserveService = new ReserveService();
  const bot = new Bot(
    browser,
    loginService,
    reserveService,
    process.env.URL ?? ''
  );
};

class Bot {
  private browser: Browser;
  private page?: Page;

  private loginService: LoginService;
  private reserveService: ReserveService;
  private url: string;

  constructor(
    browser: Browser,
    loginService: LoginService,
    reserveService: ReserveService,
    url: string
  ) {
    this.browser = browser;
    this.loginService = loginService;
    this.reserveService = reserveService;
    this.url = url;

    this.init().then();
  }

  async init() {
    this.page = await this.browser.newPage();

    const token = new Token(this.page);
    token.setPageResponseListener();

    await this.page.goto(this.url);

    try {
      const microsoftButton = await this.page.waitForSelector(
        'button.btnWhite',
        { timeout: 5000 }
      );

      await microsoftButton?.click();
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
