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
  console.log('prepare to create team: ', inputTeam);
  Team.create(inputTeam, function(err, team: DBITeam) {
    if (err) console.log('error: create team: ', err);
    User.findOne({yahooId: req.user.yahooId}, function(err, user: DBIUser) {
      if (err) console.log('error: find user: ', err);
      console.log('find user: ', user);
      user.rivalries.push(team)
      user.save(function(err, user:DBIUser) {
        console.log('add rival to user: ', user.toObject());
        res.json(team.toObject())
      })
    })
  }) 
  
  // Team.find({
  //   owner_yahooId: inputTeam.owner_yahooId
  // }, function(err, team: DBITeam) {
  //   if (err) res.json(err)
  //   if (!team) {
  //     console.log('team is not find in db');
  //     Team.create({...inputTeam}, function(err, team: DBITeam) {
  //       if (err) console.log('error in creating team: ', err);
  //       console.log('create team: ', team);
  //       User.findOne({yahooId: req.user.yahooId}, function(err, user: DBIUser) {
  //         user.rivalries.push(team);
  //         user.save();
  //         res.json(team)
  //       })
  //     })
  //   } else {
  //     console.log('find team in db: ', team);
  //     User.findOne({yahooId: req.user.yahooId}, function(err, user: DBIUser) {
  //       user.rivalries.push(team);
  //       user.save();
  //       res.json(team)
  //     })
  //   }
  // })
})

// DELETE /api/rivals/:key - return new rivals
router.delete('/rivals/:key', (req, res) => {
  Team.findOne({
    key: req.params.key
  }, (err, team) => {
    User.update({yahooId: req.user.yahooId}, {$pull: {rivalries: team._id}}, function(err, response) {
      res.json(response)
    })
  })
})

// POST /api/players - create a new player
router.get('/players', (req, res) => {
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


export default router;