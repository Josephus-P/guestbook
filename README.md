# Table of Contents

- [Getting Started](#getting-started)
  - [What You Need](#what-you-need)
  - [Running The App Locally](#running-the-app-locally)

# Getting Started

## What You Need

### Firebase Account

- Sign up for a Firebase Account
- Create a Firebase Project
- Find your project's configuration in the `General` tab of your project's settings dashboard
- Copy the config settings into a `.env` file placed in the `/client` directory of your project's codebase.

The environment variable names should look like this:

```
REACT_APP_API_KEY=
REACT_APP_AUTH_DOMAIN=
REACT_APP_DATABASE_URL=
REACT_APP_PROJECT_ID=
REACT_APP_STORAGE_BUCKET=
REACT_APP_MESSAGING_SENDER_ID=
```

- Go to the `Service accounts` tab in your Firebase project settings and generate a new private key
- Copy the the keys into a new `.env` file that will be placed in the root directory of your project's codebase

The environment variable names should look like this:

```
FIREBASE_DB_URL=
FIREBASE_TYPE=
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
FIREBASE_CLIENT_ID=
FIREBASE_AUTH_URI=
FIREBASE_TOKEN_URI=
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=
FIREBASE_CLIENT_X509_CERT_URL=
```
