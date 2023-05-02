import moment from 'moment';

class ReserveService {
  private accessToken: string;
  private weekDaysToBook: number[];
  private startHour: string;
  private endHour: string;

  constructor() {
    this.accessToken = '';
    this.weekDaysToBook = [1, 2, 3, 4];
    this.startHour = 'T08:00:36+02:00';
    this.endHour = 'T17:00:36+02:00';
  }

  getReservationDetails(startTime, endTime, parkingPlace) {
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

  async setReservation(page) {
    const dates = this.getReservationDates();

    for (const date of dates) {
      const body = this.getReservationDetails(
        date + this.startHour,
        date + this.endHour,
        514
      );

      await page.evaluate(this.sendRequest, this.accessToken, body);
    }
  }

  async sendRequest(token, body) {
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

    if (!response.ok) {
      //error handling
    }

    response = await response.json();
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

export default ReserveService;
