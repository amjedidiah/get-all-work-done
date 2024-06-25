# Get All Work Done Stripe API Service

This project connects GetAllWorkDone to its Stripe Connect Platform.
This repo contains only the back-end code, for the front-end demo code, refer to [Additional Notes](#additional-notes)

![Security score](https://i.ibb.co/VBsp3Tg/Screenshot-2024-06-24-at-10-28-25.png)

## Table of Content

- [Live Demo](#live-demo)
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
- [Technologies Used](#technologies-used)
- [Additional Notes](#additional-notes)
- [Contributing](#contributing)

## Live Demo

[Demo video](https://drive.google.com/file/d/14ZM8RDvDsC4gDctcMYtZureyFIUBElSZ/view?usp=sharing)

You can test the live API deployed on Fly.io at:

<https://get-all-work-done.fly.dev>

## Features

- **Authentication:** Enables users to register, login and logout of the platform using [Magic.link](https://magic.link/docs/api/client-side-sdks/flutter)
- **Stripe Account Management:** Fetch, update and onboard an account on Stripe. Update account verification status and account credit, as well as create account session
- **External Account management:** Create, fetch, delete and make an external account default.
- **Refund:** Full and partial refund.
- **Manage Connected Account**
- **Manage Connected Account**
- **Tax Reporting:** list contractors tax reports, retrieve single contractor tax report, request contractor tax report.
- **Transfers:** pay contractors.
- **Security:**
  - Input validation, HTTPS.
  - JWT authentication for protected routes, etc

## API Endpoints

For a full list of API endpoints, refer to the [Postman Collection](/Get%20All%20Work%20Done.postman_collection.json)

## Getting Started

> Please make sure to use the specified node version for this project: v.18.18.2

1. **Install dependencies:** `yarn install`
2. **Environment Variables:**
    - Rename the [`.env.example` file](/.env.example) to `.env`.
    - Source ENVIRONMENT variables from @amjedidiah.
    - If you have issues with this, you can work with the live demo for testing
3. **Start the server in DEVELOPMENT mode:** `yarn dev`. Uses `nodemon` for fast refresh
4. **Start the server in PRODUCTION mode:** `yarn start`

## Technologies Used

- **Stripe:** For payment and Connect platform management.
- **TypeScript:** For type safety and maintainability.
- **Express:** For building the RESTful API.
- **MySQL:** For database management.
- **Sequelize:** Modern TypeScript and Node.js ORM for MySQL.
- **Amazon RDS:** Database service.
- **Helmet, cors, csurf:** For security.
- **Winston:** For logging.
- **jsonwebtoken:** For JWT authentication.

## Additional Notes

> The front-end application can be found [here](https://github.com/amjedidiah/get-all-work-done-stripe-client)

- **Frontend Responsibilities:**
  - Configure Magic for account creation and login on the FE
  - Stores the JWT received on account creation securely in localStorage.
  - Includes the JWT in the `Authorization` header for subsequent protected routes.
  - Handles authentication errors gracefully.

## Contributing

Contributions are welcome! Please open issues or submit pull requests.
