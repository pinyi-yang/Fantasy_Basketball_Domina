//* when use TS on the backend, use ES6 style imports
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import axios from 'axios';
import session from 'express-session';
import mongoose from 'mongoose';
import graphqlHTTP from 'express-graphql';
import passport from './config/ppConfig';


const app = express();
app.use(express.static(__dirname + '/../client/build/'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set('view engine', 'ejs');

// The mongoose connection string needs to be typed as string
mongoose.connect(process.env.MONGOOB_URI)
const db = mongoose.connection;
// COnnection types don't seem to support db.host and db.port
db.once('open', () => {
  console.log('Connected to mongo');
})

db.on('eeror', (err) => {
  console.log('An error occured: ', err);
})

// Configure the express-session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}))

// Configure the passport middleware
app.use(passport.initialize());
app.use(passport.session()); 

import authRouter from './routes/auth';
import apiRouter from './routes/api';
import { buildSchema } from 'graphql';
app.use('/auth', authRouter);
app.use('/api', apiRouter);

import schema from './graphql/schema';
import root from './graphql/resolvers';
// var schema = buildSchema(`
//   type Query {
//     hello: String
//   }
// `)

// var root = {
//   hello: () => ('Hello World!')
// }

app.get('/leagues', (req, res) => {
  let config = {
    headers: {
      'Authorization': `Bearer ${req.user.accessToken}`
    }
  }
  axios.get('https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_code=nba/leagues?format=json', config).then(response => {
    let games = response.data.fantasy_content.users[0].user[1].games
    let leagues1 = games[Object.keys(games).length-2].game[1].leagues;
    let leagues2 = games[Object.keys(games).length - 3].game[1].leagues;
    let results = [];
    for (let key in leagues1) {
        if (key !== 'count') {
            let league = {
                key: leagues1[key].league[0].league_key,
                name: leagues1[key].league[0].name,
                logo: leagues1[key].league[0].logo_url || "../public/img/Fantasy_ICON.png",
                totalWeeks: leagues1[key].league[0].end_week,
                week: leagues1[key].league[0].current_week,
                season: leagues1[key].league[0].season
            };
            results.push(league);
        }
    }

    for (let key in leagues2) {
        if (key !== 'count') {
            let league = {
                key: leagues2[key].league[0].league_key,
                name: leagues2[key].league[0].name,
                logo: leagues2[key].league[0].logo_url || "../public/img/Fantasy_ICON.png",
                totalWeeks: leagues2[key].league[0].end_week,
                week: leagues2[key].league[0].current_week,
                season: leagues2[key].league[0].season
            };
            results.push(league);
        }
    }
    console.log('user are in leagues: ', results);
    res.json(results);
  })
})

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}))

app.get('*', (req, res) => {
  res.redirect('/');
  // res.sendFile(__dirname + '/../client/build/index.html');
})

//* proxy won't work with OAuth. We will run react and express at 3000.
app.listen(process.env.PORT || 3000)