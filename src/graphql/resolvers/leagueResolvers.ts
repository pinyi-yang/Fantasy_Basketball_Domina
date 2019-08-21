import {ILeague, ITeam, IMatchup, ILeagueInfo} from '../../interfaces';
import axios from 'axios';

const getLeagues = ({token}: {token: string}): Promise<ILeague[] | void> => {
  let config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
  return axios.get('https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_code=nba/leagues?format=json', config).then(response => {
    let games = response.data.fantasy_content.users[0].user[1].games
    let leagues1 = games[Object.keys(games).length-2].game[1].leagues;
    let leagues2 = games[Object.keys(games).length - 3].game[1].leagues;
    let results = [];
    for (let key in leagues1) {
        if (key !== 'count') {
            let league = {
                key: leagues1[key].league[0].league_key,
                name: leagues1[key].league[0].name,
                logo: leagues1[key].league[0].logo_url || "./img/Fantasy_ICON.png",
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
                logo: leagues2[key].league[0].logo_url || "./img/Fantasy_ICON.png",
                totalWeeks: leagues2[key].league[0].end_week,
                week: leagues2[key].league[0].current_week,
                season: leagues2[key].league[0].season
            };
            results.push(league);
        }
    }
    console.log('user are in leagues: ', results);
    return results as ILeague[];
  }).catch(err => {console.log('error in get leagues for user: ', err);})
}

const getStanding = (token:string, leagueKey: string): Promise<ITeam[]> => {
  let config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
  return axios.get(`https://fantasysports.yahooapis.com/fantasy/v2/leagues;league_keys=${leagueKey}/standings?format=json`, config).then(response => {
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
    return standings as ITeam[];
  })
}

const getScoreBoard = (token: string, week: string, leagueKey: string): Promise<IMatchup[]> => {
  let config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
  return axios.get(`https://fantasysports.yahooapis.com/fantasy/v2/leagues;league_keys=${leagueKey}/scoreboard;week=${week}?format=json`, config).then(response => {
    let matchups = response.data.fantasy_content.leagues[0].league[1].scoreboard[0].matchups;
    let results = [];
    for (let key in matchups) {
      if (key !== 'count') {
        let team0 = {
          key: matchups[key].matchup[0].teams[0].team[0][0].team_key,
          owner_yahooId: matchups[key].matchup[0].teams[0].team[0][19].managers[0].manager.guid,
          name: matchups[key].matchup[0].teams[0].team[0][2].name,
          logo: matchups[key].matchup[0].teams[0].team[0][5].team_logos[0].team_logo.url,
          score: 0
        }
        let team1 = {
          key: matchups[key].matchup[0].teams[1].team[0][0].team_key,
          owner_yahooId: matchups[key].matchup[0].teams[1].team[0][19].managers[0].manager.guid,
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
  return results as IMatchup[];
  })
}

const leagueInfo = ({token, leagueKey, week}: {token:string, leagueKey: string, week: string}) => {
  return {
    standings: getStanding(token, leagueKey),
    scoreboard: getScoreBoard(token, week, leagueKey)
  }
}


const leagueResolvers = {
  leagues: getLeagues,
  leagueInfo
}

export default leagueResolvers;