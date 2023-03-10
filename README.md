# Web Scraping Backend

## Pre-requisites

**In order to successfully run the application, you need:**

1. Node.js installed on your machine with at least version 16 (specifically 16.13.2)
2. A PostgreSQL database server running

## Run the application locally

**Installation**

- First of all, install all the required packages:

```
npm install
```

**Environment variables**

- Next, add the `.env` file to root folder with the following keys:

```shell
DATABASE_URL=/*URL to the PostgreSQL Database*/
SHADOW_DATABASE_URL=/*URL to the PostgreSQL Shadow Database*/

ACCESS_TOKEN_SECRET=/*Secret for access token*/
REFRESH_TOKEN_SECRET=/*Secret for refresh token*/
```

**Database Migration**

1. Invoke the Prisma CLI:

```
npx prisma
```

2. Next migrate Prisma data models to the database:

```
npx prisma migrate dev
```

**Run the application**

- Run the application with the below command:

```
npm run start
```

## Run the test locally

Run the test with the below command:

```
npm run test
```
