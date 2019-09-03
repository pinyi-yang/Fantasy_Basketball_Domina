import express from 'express';
const router = express.Router();
import User, {DBIUser} from '../models/user';
import Team, {DBITeam} from '../models/team';
import Player, {DBIPlayer} from '../models/player';
import axios from 'axios';

// GET /api/rivals - return rivals
router.get('/userdetails', (req, res) => {
  console.log('get rivals for user: ', req.user.yahooId);
  // ! change back to req.user.yahooId after testing==================================
  User.findOne({yahooId: req.user.yahooId}).populate('rivalries watchPlayers').exec((err, user) => {
    console.log('find user in db:', user);
    if(err) res.json(err);
    let {rivalries, watchPlayers} = user.toObject()
    console.log('get rivals: ', rivalries);
    console.log('get watchPlayers', watchPlayers);
    res.json({rivalries, watchPlayers})
  })
})

// POST /api/rivals - return new rivals
router.post('/rivals', (req, res) => {
  let inputTeam = {
    owner_yahooId: req.body.owner_yahooId,
    name: req.body.name, 
    key: req.body.key, 
    logo: req.body.logo
  }
  Team.findOne({owner_yahooId: inputTeam.owner_yahooId}, function(err, team) {
    
    if (!team) {
      console.log('prepare to create team: ========================== \n', inputTeam);
      Team.create(inputTeam, function(err, team: DBITeam) {
        if (err) console.log('error: create team: ', err);
        User.findOne({yahooId: req.user.yahooId})
          .populate("rivalries")
          .exec((err, user: DBIUser) => {
            if (err) console.log('error: find user: ==================\n ', err);
            console.log('find user: ================= \n', user);
            user.rivalries.push(team)
            user.save(function(err, user:DBIUser) {
              console.log('add rival to user: ==================== \n ', user.toObject());
              res.json(user.toObject())
            })
        })
      }) 
    } else {
      console.log('find team in db: ============================ \n', team);
      User.findOne({yahooId: req.user.yahooId})
        .populate('rivalries')
        .exec((err, user: DBIUser) => {
          user.rivalries.push(team.toObject())
          user.save((err, user) => {
            res.json(user.toObject())
          })
        })
    }
  })
})

// DELETE /api/rivals/:key - return new rivals
router.delete('/rivals/:key', (req, res) => {
  Team.findOne({
    key: req.params.key
  }, (err, team) => {
    User.update({yahooId: req.user.yahooId}, {$pull: {rivalries: team._id}}, function(err, response) {
      console.log('deleted rival from team ======================');
      User.findOne({yahooId: req.user.yahooId})
        .populate('rivalries')
        .exec((err, user) => {
          console.log('after delete, user is:================== \n', user);
          res.json(user.toObject())
        })
    })
  })
})

// POST /api/players - create a new player
router.post('/players', (req, res) => {
  Player.create({
    key: "testKey",
    firstName: "test",
    lastName: "test",
    positions: "C",
    headshot: ""
  }, function(err, player) {
    console.log('created player: ============================', player);
    res.json(player)
  })
})

router.get('/leagues/:key/standings', (req, res) => {
  let config = {
    headers: {
      'Authorization': `Bearer ${req.user.accessToken}`
    }
  }
  console.log(`get standings for leagues ${req.params.key}`);
  axios.get(`https://fantasysports.yahooapis.com/fantasy/v2/leagues;league_keys=${req.params.key}/standings?format=json`, config).then(response => {
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
    console.log('get leagues standing ============================ \n', standings);
    res.json(standings);
  }).catch(err => console.log('error: getting league standings: =====================\n', err))
})

// GET /api/leagues/:key/scoreboard?week=
router.get('/leagues/:key/scoreboard', (req, res) => {
  let config = {
    headers: {
      'Authorization': `Bearer ${req.user.accessToken}`
    }
  }
  console.log(`get scoreboard for leagues ${req.params.key} at week ${req.query.week}`);
  axios.get(`https://fantasysports.yahooapis.com/fantasy/v2/leagues;league_keys=${req.params.key}/scoreboard;week=${req.query.week}?format=json`, config).then(response => {
    let matchups = response.data.fantasy_content.leagues[0].league[1].scoreboard[0].matchups;
    let results = [];
    for (let key in matchups) {
      if (key !== 'count') {
        let team0 = {
          owner_yahooId: matchups[key].matchup[0].teams[0].team[0][19].managers[0].manager.guid,
          key: matchups[key].matchup[0].teams[0].team[0][0].team_key,
          name: matchups[key].matchup[0].teams[0].team[0][2].name,
          logo: matchups[key].matchup[0].teams[0].team[0][5].team_logos[0].team_logo.url,
          score: 0,
          stat: {
            "FG%": matchups[key].matchup[0].teams[0].team[1].team_stats.stats[1].stat.value,
            "FT%": matchups[key].matchup[0].teams[0].team[1].team_stats.stats[3].stat.value,
            "3PTM": matchups[key].matchup[0].teams[0].team[1].team_stats.stats[4].stat.value,
            "PTS": matchups[key].matchup[0].teams[0].team[1].team_stats.stats[5].stat.value,
            "REB": matchups[key].matchup[0].teams[0].team[1].team_stats.stats[6].stat.value,
            "AST": matchups[key].matchup[0].teams[0].team[1].team_stats.stats[7].stat.value,
            "ST": matchups[key].matchup[0].teams[0].team[1].team_stats.stats[8].stat.value,
            "BLK": matchups[key].matchup[0].teams[0].team[1].team_stats.stats[9].stat.value,
            "TO": matchups[key].matchup[0].teams[0].team[1].team_stats.stats[10].stat.value,
            "FGM/A": matchups[key].matchup[0].teams[0].team[1].team_stats.stats[0].stat.value,
            "FTM/A": matchups[key].matchup[0].teams[0].team[1].team_stats.stats[2].stat.value
          }
        };
        let team1 = {
          owner_yahooId: matchups[key].matchup[0].teams[1].team[0][19].managers[0].manager.guid,
          key: matchups[key].matchup[0].teams[1].team[0][0].team_key,
          name: matchups[key].matchup[0].teams[1].team[0][2].name,
          logo: matchups[key].matchup[0].teams[1].team[0][5].team_logos[0].team_logo.url,
          score: 0,
          stat: {
            "FG%": matchups[key].matchup[0].teams[1].team[1].team_stats.stats[1].stat.value,
            "FT%": matchups[key].matchup[0].teams[1].team[1].team_stats.stats[3].stat.value,
            "3PTM": matchups[key].matchup[0].teams[1].team[1].team_stats.stats[4].stat.value,
            "PTS": matchups[key].matchup[0].teams[1].team[1].team_stats.stats[5].stat.value,
            "REB": matchups[key].matchup[0].teams[1].team[1].team_stats.stats[6].stat.value,
            "AST": matchups[key].matchup[0].teams[1].team[1].team_stats.stats[7].stat.value,
            "ST": matchups[key].matchup[0].teams[1].team[1].team_stats.stats[8].stat.value,
            "BLK": matchups[key].matchup[0].teams[1].team[1].team_stats.stats[9].stat.value,
            "TO": matchups[key].matchup[0].teams[1].team[1].team_stats.stats[10].stat.value,
            "FGM/A": matchups[key].matchup[0].teams[1].team[1].team_stats.stats[0].stat.value,
            "FTM/A": matchups[key].matchup[0].teams[1].team[1].team_stats.stats[2].stat.value
          }
        };
        
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
  
  res.json(results);
  })
})

export default router;