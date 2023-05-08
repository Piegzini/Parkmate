import moment from 'moment';
import { Page } from 'puppeteer';
import logger from '../config/logger.config.js';

class ReservationService {
  private weekDaysToBook: number[];
  readonly startHour: string;
  readonly endHour: string;

  constructor() {
    this.weekDaysToBook = [1, 2, 3, 4, 5];
    this.startHour = 'T08:00:36+02:00';
    this.endHour = 'T17:00:36+02:00';
  }

  getReservationDetails(
    startTime: string,
    endTime: string,
    parkingPlace: number
  ) {
    return {
      emailAddress: process.env.EMAIL,
      dates: [
        {
          startTime: startTime,
          endTime: endTime,
        },
      ],
      startTime: startTime,
      endTime: endTime,
      extras: [],
      plateNumber: 'KCH4GP3',
      app: 'web',
      resources: [parkingPlace],
    };
  }

  async setReservation(page: Page, token: string) {
    const dates = this.getReservationDates();

    for (const date of dates) {
      logger.info('Preparing a request for reservations for ' + date);
      const body = this.getReservationDetails(
        date + this.startHour,
        date + this.endHour,
        514
      );

      try {
        const res = await page.evaluate(this.sendRequest, token, body);

        if (res.status !== 200) {
          throw new Error(`${res.error} ${res.message ?? ''}`);
        }
        logger.info('Successfully created a reservation for ' + date);
      } catch (error: any) {
        logger.error(error.message);
      }
    }
  }

  async sendRequest(token: string, body: any) {
    let response = await fetch(
      'https://smartoffice-api.ringieraxelspringer.pl/atman/api/2.0/create-event',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    return await response.json();
  }

  getReservationDates() {
    let dates = [];

    for (let i = 0; i < 4; i++) {
      const date = moment().add(i, 'days');
      dates.push(date);
    }

    dates = dates.filter((date) =>
      this.weekDaysToBook.includes(date.weekday())
    );

    return dates.map((date) => date.format('YYYY-MM-DD'));
  }
}

export default ReservationService;
