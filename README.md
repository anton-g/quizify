# Quizify

💃 Quizify is a real time multiplayer music quiz, using Spotify for music and any browser as a buzzer 🕺

## Developing

Quizify consists of three parts. A client written in [Vue](https://github.com/vuejs/vue), a server in [Nest](https://github.com/nestjs/nest) and a [MongoDB](https://www.mongodb.com) database.

Before setting up the development environment you should start by creating a Spotify application in the [Spotify Developer Portal](http://developer.spotify.com/) and [setting up a local mongodb instance](https://docs.mongodb.com/guides/server/install/).

### Server

The server is written in [Nest](https://github.com/nestjs/nest) and exposes a RESTish API and a WebSocket API (using socket.io).

To set up the server start by making a copy of `template.env` in the `server` directory named `development.env` and enter your own information (like the Spotify app id and secret).

> Every field except `SENTRY_DSN` is required. If you would like to use Sentry for error reporting. Create an account at [sentry.io](https://sentry.io).

The next step is to run an `npm install` (in the `server` directory) and then starting the server with `npm run dev`.

All available npm scripts:

``` bash
# serve with nodemon at localhost:3000
npm run dev

# rebuild solution
npm run build

# serve at localhost:3000 in production mode
npm run start

# run unit tests
npm run test

# run unit tests with coverage report
npm run test:cov

# deploy to [zeit](zeit.co)
npm run deploy
```

### Client

When the server is up and running we can also start the client. The setup process is very similar:

- Install dependencies by running `npm install` in the `client` directory.
- Start the client by running `npm run dev`.

> If you decide to use Sentry you can enter the DSN in the `.env.development` file.

All available npm scripts:

``` bash
# serve with hot reload at localhost:8080
npm run dev

# run eslint
npm run lint

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# deploy to [zeit](zeit.co)
npm run deploy
```

### Deploying

> You should be aware that according to Spotifys Developer Terms of Service, you are not allowed to create "[Games and trivia quizzes. Unless you receive Spotify’s written approval, you shall not use the Spotify Platform to incorporate Spotify Content into any game functionality (including trivia quizzes).](https://developer.spotify.com/terms/#iv)"

> Zeit has recently released [Now 2.0](https://zeit.co/blog/now-2). This is using the old, sort of deprecated, version of Now but will be updated in the future.

The current solution has built in deployment support to the [zeit](zeit.co) `now` cloud for the client and server, but not for the database. There are a lot of different MongoDb-as-a-Service providers out there however, and Quizify should work with whatever you choose.

Before deploying to production there are also a couple of preparation steps:

For the server:

- Create a `server/production.env` file with appropriate values
- Update the `server/now.json` with your domain (or a [`now.sh` subdomain](https://zeit.co/docs/features/aliases))

For the client:

- Create a `client/.env.production` file with appropriate values
- Update the `client/now.json` with your domain (or a [`now.sh` subdomain](https://zeit.co/docs/features/aliases))

When that's done you are ready to run `npm run deploy` in the `server` and `client` directories respectively 🚀

## License
See the [LICENSE file](https://github.com/anton-g/quizify/blob/master/LICENSE)
