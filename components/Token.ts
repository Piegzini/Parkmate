import { Page } from 'puppeteer';
import logger from '../config/logger.config.js';

class Token {
  private value: string;
  private page: Page;
  readonly logInterval: NodeJS.Timer;

  constructor(page: Page) {
    this.page = page;
    this.value = '';
    this.logInterval = setInterval(this.tokenInfo.bind(this), 1000);
  }

  public getValue() {
    return new Promise<string>((resolve, reject) => {
      const checkToken = () => {
        if (this.value) {
          resolve(this.value);
        } else {
          setTimeout(checkToken, 100);
        }
      };
      checkToken();
    });
  }

  public setPageResponseListener() {
    this.page.on('response', this.findToken.bind(this));
  }
  private removePageResponseListener() {
    this.page.off('response', this.findToken.bind(this));
  }

  private tokenInfo() {
    if (this.value) {
      clearInterval(this.logInterval);
      return;
    }

    logger.warn('Token not yet found.');
  }

  private async findToken(response: any) {
    const url = response.url();
    const { 'content-type': contentType, 'content-length': contentLength } =
      response.headers();

    const loginUrlPattern = new RegExp('atman/login');

    const isRequestPayload = contentType && contentLength !== 0;
    const isLoginResponse = loginUrlPattern.test(url);

    if (isLoginResponse && isRequestPayload) {
      const { accessToken } = await response.json();
      this.value = accessToken;
      logger.info('Token successful found.');
      this.removePageResponseListener();
    }
  }
}

export default Token;
