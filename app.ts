import puppeteer, { Browser } from 'puppeteer';
import puppeteerLaunchOptions from './config/browser.config.js';
import logger from './config/logger.config.js';
import ReserveService from './services/ReservationService.js';
import { createInterface } from 'node:readline/promises';
import LoginService from './services/LoginService.js';
import Bot from './components/Bot.js';
const app = async () => {
  let browser: Browser;

  const consoleInterface = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const loginService = new LoginService(consoleInterface);
  const reserveService = new ReserveService();

  try {
    browser = await puppeteer.launch(puppeteerLaunchOptions);
    logger.info('Puppeteer browser initialized successfully.');
  } catch (error: any) {
    logger.error(error.message);
  }

  // @ts-ignore
  const bot = new Bot(browser, loginService, reserveService);
  bot.init().catch((error: any) => logger.error(error.messages));
};

app();
