import express = require('express')
import passportGithub = require('passport-github')
import passport = require('passport')
import session = require('express-session')
import RedisStore = require('connect-redis')
import nunjucks = require('nunjucks')
import bodyParser = require('body-parser')

import { ensureAuthenticated } from './passport-auth'
import { createGame, getGameStatus } from './game-server'

const Store = RedisStore(session);
const redisHost = process.env.REDIS_HOST || 'localhost'

// Need to setup sessions
const app = express()
app.use(session({
  secret: 'fi5e',
  store: new Store({
    host: redisHost,
    port: '6379'
  }),
  resave: true,
  saveUninitialized: false,
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}));

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.get('/auth/github', passport.authenticate('github'))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/protected')
})

app.get('/protected', ensureAuthenticated, (req, res) => {
  res.send('Congrats, sessions work')
})


// GAME TESTING STUFF
app.get('/start-game', (req, res) => {
  createGame(['https://dsnek.herokuapp.com', 'https://dsnek.herokuapp.com'], id => {
    res.send(id)
  })
})

app.get('/test-tournament', (req, res) => {
  res.render('test-tournament.html', {
    tournament: "test"
  })
})

app.post('/game-status', (req, res) => {
  getGameStatus(req.body.gameId, (json) => {
    res.render('test-tournament.html', {
      data: json
    })
  })
})

export default app
