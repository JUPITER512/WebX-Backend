# Node.js Backend Repository

Welcome to the Node.js backend repository for your WebXAi. This repository contains the backend logic and API endpoints necessary for your application.

## Important Information

- **Use gmail email and app password using your gmail account :**
  ```for more information check this
  https://support.google.com/mail/answer/185833?hl=en

## Environment Variables

To run this application locally or in a deployment environment, you need to set up the following environment variables:

- **PORT**: The port on which the server will run. Default is `3000`.
- **CORS_ORIGIN**: CORS origin allowed for requests. Default is `*`.
- **DATABASE_CONNECTION_STRING**: Connection string for your database.
- **email**: Email configuration for sending emails.
- **passwordForEmail**: Password for the email configuration.
- **ACCESS_TOKEN_SECRET**: Secret key for generating access tokens.
- **ACCESS_TOKEN_EXPIRY**: Expiry duration for access tokens.
- **REFRESH_TOKEN_SECRET**: Secret key for generating refresh tokens.
- **REFRESH_TOKEN_EXPIRY**: Expiry duration for refresh tokens.
- **CLOUDINARY_NAME**: Cloudinary account name.
- **CLOUDINARY_API_KEY**: API key for Cloudinary integration.
- **CLOUDINARY_SECRET**: Secret key for Cloudinary integration.

## Mongo Db Database
   you need mongo db instance url

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/JUPITER512/WebX-Backend.git
   cd your-repo
2. **Create a .env file:**
   ```bash
   ADD ALL THE .env key value pairs
3. **Install Dependencies:**
   ```bash
   run this command in terminal of repofolder: npm install
4. **Run Backend Using Dockers:**
   ```bash
   https://hub.docker.com/r/syedalimurtaza12/webxaibackend
