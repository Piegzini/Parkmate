import * as dotenv from 'dotenv';
import { PuppeteerLaunchOptions } from 'puppeteer';

dotenv.config();

let puppeteerLaunchOptions: PuppeteerLaunchOptions = {
  headless: false,
  userDataDir: './browser_profile',
};

if (process.env.NODE_ENV === 'PROD') {
  puppeteerLaunchOptions = {
    headless: true,
    userDataDir: './browser_profile',
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  };
}

export default puppeteerLaunchOptions;
