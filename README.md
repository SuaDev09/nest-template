
## How to run Swagger UI
### In your terminal, run `npm run start` and go to `localhost:8734/api-docs`

### Example of .env.dev
```bash
# .env.dev
DB_SERVER=dev-server
DB_DATABASE=dev-db
DB_DOMAIN=dev-domain
DB_USER_NAME=dev-user
DB_PASSWORD=password
```


## Installation

```bash
$ npm install
```

## Running the app
This application runs in the port 3152
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

If the port already in use when application is running, add this in your terminal

```bash
$ netstat -ano | findstr :3152
```

A table like this will be displayed:

```bash 
TCP    0.0.0.0:3152           0.0.0.0:0              LISTENING       44408
TCP    [::]:3152              [::]:0                 LISTENING       44408
```

Then, kill the process with this command:

```bash
$ taskill /F /PID 44408
```
Please replace 44408  with your process number 

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```