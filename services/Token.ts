import { Page } from 'puppeteer';

class Token {
  private value: string;
  private page: Page;

  constructor(page: Page) {
    this.page = page;
    this.value = '';
  }

  public getValue() {
    return this.value;
  }

  public setPageResponseListener() {
    this.page.on('response', this.findToken.bind(this));
  }
  private removePageResponseListener() {
    this.page.off('response', this.findToken.bind(this));
  }

  private async findToken(response) {
    const url = response.url();
    const { 'content-type': contentType, 'content-length': contentLength } =
      response.headers();

    const loginUrlPattern = new RegExp('atman/login');

    const isRequestPayload = contentType && contentLength !== 0;
    const isLoginResponse = loginUrlPattern.test(url);

    if (isLoginResponse && isRequestPayload) {
      const { accessToken } = await response.json();
      this.value = accessToken;
      this.removePageResponseListener();
    }
  }
}

export default Token;
