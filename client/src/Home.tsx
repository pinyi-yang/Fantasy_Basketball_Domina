import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import {IUser} from './interfaces';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LeagueInfo from './components/LeagueInfo';
import Matchup from './components/Matchup';
import Rivals from './components/Rivals';
import Playground from './components/Playground';

import {ILeague, IMatchup, ITeam} from './interfaces';

interface IProps {
  user: IUser
}

const Home: React.FC<IProps> = (props: IProps) => {
  const [user, setUser] = useState<IUser>({} as IUser);
  const [leagues, setLeauges] = useState<ILeague[]>([] as ILeague[]);
  const [leagueIndex, setLeagueIndex] = useState(0);
  const [week, setWeek] = useState('');
  const [scoreboard, setScoreboard] = useState<IMatchup[]>([] as IMatchup[]);
  const [standings, setStandings] = useState<ITeam[]>([] as ITeam[]);
  const [myTeam, setMyTeam] =useState<ITeam>({} as ITeam)
  const statName = {
    5: "FG%",
    8: "FT%",
    10: "3PTM",
    12: "PTS",
    15: "REB",
    16: "AST",
    17: "ST",
    18: "BLK",
    19: "TO",
    9004003: "FGM/A",
    9007006: "FTM/A"
  }
  useEffect(() => {
    //* get or create user in DB, passed
    let userInput = {
      yahooId: props.user.yahooId,
      name: props.user.name,
      avatar: props.user.avatar
    }
    
    let body = {
      query: `mutation createUser($input: UserInput) {
        createUser(userInput: $input) {
          _id
          name
          yahooId
          avatar
          rivalries{
            key
            name
            logo
          }
          watchPlayers {
            key
            firstName
            lastName
            positions
            headshot
          }
        }
      }`,
      variables: {
        input: userInput
      }
    }
    let options = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    console.log('ready to create user from graphql');
    axios.post('/graphql', body, options).then(response => {
      console.log('checking user with db, return', response.data.data);
    }).catch(err => {console.log('error: checking database: ', err);})
  }, [])

  useEffect(() => {
    //*Queries:
    // 1. get user's leagues in recent 2 seasons
    let body = {
      query: `query leagues($token: String) {
        leagues(token: $token) {
          key
          name
          logo
          totalWeeks
          week
          season
        }
      }`,
      variables: {
        token: props.user.accessToken
      }
    }

    let options = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    console.log('ready to get leagues for user from graphql');
    axios.post('/graphql', body, options).then(response => {
      console.log('get user leagues from api', response.data.data.leagues);
      setLeauges(response.data.data.leagues);
      setLeagueIndex(0);
      setWeek(response.data.data.leagues[0].week)
    }).catch(err => {console.log('error: api getting leagues: ', err);})
  }, [])

  useEffect(() => {
    //*Queries:
    // 1. get current league standing and scoreboard
    if (week) {
      let body = {
        query: `query leagueInfo($token: String, $leagueKey: String, $week: String) {
          leagueInfo(token: $token, leagueKey: $leagueKey, week: $week) {
            scoreboard {
              teams {
                name
                logo
                score
              }
            }
            standings {
              owner_yahooId
              name
              logo
              rank
              wins
              ties
              losses
            }
          }
        }`,
        variables: {
          token: props.user.accessToken,
          leagueKey: leagues[leagueIndex].key,
          week
        }
      }
      let options = {
        headers: {
          'Content-Type': 'application/json'
        }
      }
      console.log('ready to current leagueInfo from graphql');
      axios.post('/graphql', body, options).then(response => {
        console.log('get current leagueInfo from api', response.data.data.leagueInfo);
        setScoreboard(response.data.data.leagueInfo.scoreboard);
        setStandings(response.data.data.leagueInfo.standings);
        response.data.data.leagueInfo.standings.forEach((team: ITeam) => {
          if (team.owner_yahooId === props.user.yahooId) {
            setMyTeam(team);
            console.log(`user's teams is: `, team);
          }
        })
      }).catch(err => {console.log('error: api getting leagueInfo: ', err);})
    }
  }, [week, leagueIndex])

  let currentLeague = leagues.length? leagues[leagueIndex] : null;

  return (
    <Router>
      <Header league={currentLeague}/>


      <div className='body'>
        <Sidebar  leagues={leagues} 
                  index={leagueIndex}
                  displayLeague={setLeagueIndex}/>

        <div className="content">
          <Route exact path='/' render={() => (
            <LeagueInfo myTeam={myTeam} 
                        scoreboard={scoreboard}
                        standings={standings}
                        />
          )} />
          <Route exact path='/matchup' render={() => (
            <Matchup />
          )} />
          <Route exact path='/rivals' render={() => (
            <Rivals />
          )} />
          <Route excat path='/playground' render={() => (
            <Playground />
          )} />
        </div>
      </div>
    </Router>
  )
}

export default Home;