# Parking Reservation Automation
This is a test version of an application that automates the process of reserving parking spaces in an office.

## Table of Contents
- [Introduction]()
- [Installation]()
- [Usage]()
- [Future Improvements]()
- [License]()
 
## Introduction
The Parking Reservation Automation application is designed to streamline the process of reserving parking spaces in an office building. The application utilizes Puppeteer, a Node.js library, to automate the process of logging into the parking reservation system, selecting a parking space, and confirming the reservation.

This is a test version of the application, and there may be bugs and issues that need to be resolved. However, the application is functional and can be used to reserve parking spaces.

## Installation
To install the Parking Reservation Automation application, follow these steps:

1. Clone the repository to your local machine.
2. Install the dependencies by running npm install in the terminal.
3. Create a .env file in the root directory of the project and add the following variables:


```
PARKING_SYSTEM_URL=<url-of-the-parking-reservation-system>
USERNAME=<your-username> 
PASSWORD=<your-password>
```


## Usage
To use the Parking Reservation Automation application, follow these steps:

1. Make sure the **PARKING_SYSTEM_URL**, **USERNAME**, and **PASSWORD** variables are set in the **.env** file.
2. Run **npm start** in the terminal to start the application.
3. The application will log into the parking reservation system, select a parking space, and confirm the reservation.
4. The reservation details will be logged in the console.

## Puppeteer Browser Profile
Puppeteer is a popular Node.js library for automating headless Chrome or Chromium browsers. When launching a new instance of a browser using Puppeteer, a new folder called browser_profile is created automatically by default. This folder contains all the settings and configurations related to the launched browser instance.

## Future Improvements
This is a test version of the Parking Reservation Automation application, and there are many improvements that can be made, such as:

* Adding a web interface for users to input their reservation details
* Allowing users to reserve desks in addition to parking spaces
* Improving the error handling and logging to make the application more robust
* Adding support for different parking reservation systems
* Adding tests to ensure the application works as expected

## License
The Parking Reservation Automation application is licensed under the [MIT License](https://opensource.org/license/mit/).