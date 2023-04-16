const moment = require('moment');

class ReserveService {
  constructor() {
    this.accessToken = '';
    this.weekDaysToBook = [1, 2, 3, 4];
    this.startHour = 'T08:00:36+02:00';
    this.endHour = 'T17:00:36+02:00';
  }

  setPageResponseListener(page) {
    page.on('response', this.findToken);
  }
  removePageResponseListener(page) {
    page.off('response', this.findToken);
  }

  findToken = async (response) => {
    const url = response.url();
    const { 'content-type': contentType, 'content-length': contentLength } =
      response.headers();

    const loginUrlPattern = new RegExp('atman/login');

    const isRequestPayload = contentType && contentLength !== 0;
    const isLoginResponse = loginUrlPattern.test(url);

    if (isLoginResponse && isRequestPayload) {
      const { accessToken } = await response.json();
      this.accessToken = accessToken;
    }
  };

  getReservationDetails(startTime, endTime, parkingPlace) {
    // startTime: '2023-04-16T23:15:36+02:00',
    // endTime: '2023-04-16T23:30:36+02:00',
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

module.exports = { ReserveService };
