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

app.get('/setting', (req, res) => {
  let config = {
    headers: {
      'Authorization': `Bearer ${req.user.accessToken}`
    }
  }
  axios.get('https://fantasysports.yahooapis.com/fantasy/v2/leagues;league_keys=385.l.24889/settings?format=json', config).then(response => {
    let stats = response.data.fantasy_content.leagues[0].league[1].settings[0].stat_categories.stats;
    let settings = {};
    stats.forEach(item => {
       settings[item.stat.stat_id] = item.stat.display_name;
    })
    res.json({settings});
  })
})



app.get('/standings', (req, res) => {
  let config = {
    headers: {
      'Authorization': `Bearer ${req.user.accessToken}`
    }
  }
  axios.get('https://fantasysports.yahooapis.com/fantasy/v2/leagues;league_keys=385.l.24889/standings?format=json', config).then(response => {
    let teams = response.data.fantasy_content.leagues[0].league[1].standings[0].teams;
    let standings = []
    for (let key in teams) {
      if (key !== 'count') {
        let team = {
          owner_yahooId: teams[key].team[0][19].managers[0].manager.guid, 
          key: teams[key].team[0][0].team_key,
          name: teams[key].team[0][2].name,
          logo: teams[key].team[0][5].team_logos[0].team_logo.url,
          rank: teams[key].team[2].team_standings.rank,
          wins: teams[key].team[2].team_standings.outcome_totals.wins,
          losses: teams[key].team[2].team_standings.outcome_totals.losses,
          ties: teams[key].team[2].team_standings.outcome_totals.ties,
          percentage: teams[key].team[2].team_standings.outcome_totals.percentage
        }
        standings.push(team);
      }
    }
    res.json({standings});
  })
})

app.get('/scoreboard', (req, res) => {
  let config = {
    headers: {
      'Authorization': `Bearer ${req.user.accessToken}`
    }
  }
  axios.get('https://fantasysports.yahooapis.com/fantasy/v2/leagues;league_keys=385.l.24889/scoreboard?format=json', config).then(response => {
    let matchups = response.data.fantasy_content.leagues[0].league[1].scoreboard[0].matchups;
    let results = [];
    for (let key in matchups) {
      if (key !== 'count') {
        let team0 = {
          key: matchups[key].matchup[0].teams[0].team[0][0].team_key,
          name: matchups[key].matchup[0].teams[0].team[0][2].name,
          logo: matchups[key].matchup[0].teams[0].team[0][5].team_logos[0].team_logo.url,
          score: 0
        }
        let team1 = {
          key: matchups[key].matchup[0].teams[1].team[0][0].team_key,
          name: matchups[key].matchup[0].teams[1].team[0][2].name,
          logo: matchups[key].matchup[0].teams[1].team[0][5].team_logos[0].team_logo.url,
          score: 0
        }
        
        matchups[key].matchup.stat_winners.forEach(stat => {
          if (stat.stat_winner.winner_team_key === team0.key) {
            team0.score++
          }

          if (stat.stat_winner.winner_team_key === team1.key) {
            team1.score++
          }
        })
        
        let matchup = {
          teams: [team0, team1]
        }
        results.push(matchup)
      }

    }    
  
  res.json({matchups: results});
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