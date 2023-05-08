import { Browser, Page } from 'puppeteer';
import LoginService from '../services/LoginService.js';
import ReserveService from '../services/ReservationService.js';
import Token from './Token.js';
import logger from '../config/logger.config.js';

class Bot {
  private browser: Browser;
  private page: Page;
  private loginService: LoginService;
  private reserveService: ReserveService;
  private token: Token;
  private url: string = process.env.URL ?? '';

  constructor(
    browser: Browser,
    loginService: LoginService,
    reserveService: ReserveService
  ) {
    this.browser = browser;
    this.loginService = loginService;
    this.reserveService = reserveService;
  }

  async setPage() {
    this.page = await this.browser.newPage();

    this.token = new Token(this.page);
    this.token.setPageResponseListener();

    await this.page.goto(this.url);

    if (!this.page) {
      throw new Error('Page is undefined');
    }
    logger.info('Successful initialize page.');
  }

  async init() {
    await this.setPage();
    const tokenValue = await this.token.getValue();

    try {
      const microsoftButton = await this.page?.waitForSelector(
        'button.btnWhite',
        { timeout: 5000 }
      );

      await microsoftButton?.click();
    } catch (e) {
      await this.reserveService.setReservation(this.page, tokenValue);
    }

    await this.page?.waitForTimeout(2000);

    const variant = await this.page?.evaluate(this.checkVariant);

    switch (variant) {
      case 'login':
        await this.loginService.signIn(this.page);
        break;
      case 'auth':
        await this.loginService.setAuthCode(this.page);
        break;
    }
  }

  checkVariant() {
    if (document.querySelector('input[type=tel]')) return 'auth';

    if (document.querySelector('input[type=email]')) return 'login';

    return 'reserve';
  }
}

export default Bot;
