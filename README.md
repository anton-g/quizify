# Quizify

💃 Quizify is a real time multiplayer music quiz, using Spotify for music and any browser as a buzzer 🕺

![Screenshot 2](assets/screenshot2.png)
![Screenshot 1](assets/screenshot1.png)

## Developing

Quizify consists of three parts. A client written in [Vue](https://github.com/vuejs/vue), a server in [Nest](https://github.com/nestjs/nest) and a [MongoDB](https://www.mongodb.com) database.

Before setting up the development environment you should start by creating a Spotify application in the [Spotify Developer Portal](http://developer.spotify.com/) and [setting up a local mongodb instance](https://docs.mongodb.com/guides/server/install/).

### Server

The server is written in [Nest](https://github.com/nestjs/nest) and exposes a RESTish API and a WebSocket API (using socket.io).

To set up the server start by making a copy of `template.env` in the `server` directory named `development.env` and enter your own information (like the Spotify app id and secret).

#### Configuration Options
* `CLIENT_URL`: URL of your frontend (default: `http://localhost:8080` when running client in development mode) (`required`)
* `SPOTIFY_CLIENT_ID`: Client ID (see [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications)) (`required`)
* `SPOTIFY_CLIENT_SECRET`: Client Secret (see [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications)) (`required`)
* `SPOTIFY_REDIRECT_URI`: URL of your server's OAuth callback endpoint, which Spotify redirects you to. This requires the server to be publicly available, as it is when you deploy it (see below). For development purposes, you can use tools like [ngrok](https://ngrok.com/) to establish a tunnel that assigns your local machine a public endpoint. (`required`)
* `JWT_SECRET`: A random string to be used as a secret for login tokens. (`required`)
* `MONGODB_URL`: Your MongoDB's connection string (i.e. `mongodb://myuser:mypassword@myserver.tld:27017/quizify_db`). You can either set up a MongoDB yourself (see above) or use a free, hosted one at [mlab](https://mlab.com/). (`required`)
* `SENTRY_DSN`: DSN to use to connect to a [Sentry](https://sentry.io) instance for error reporting. (`optional`)

The next step is to run an `npm install` (in the `server` directory) and then starting the server with `npm run dev`.

All available npm scripts:

```bash
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

```bash
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

The client and server both come with a Dockerfile for easy deployment. There is a npm script (`npm run deploy`) for deploying to Heroku via their CLI, but you need to update it with names of your own projects. You'll also need to set up a database. There are a lot of different MongoDb-as-a-Service providers out there however, and Quizify should work with whatever you choose.

Before deploying to production you should set up the environement variables:

- Create a `server/production.env` file with appropriate values
- Create a `client/.env.production` file with appropriate values

## License

See the [LICENSE file](https://github.com/anton-g/quizify/blob/master/LICENSE)
