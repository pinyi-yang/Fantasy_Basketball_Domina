import {ILeague} from '../../interfaces';
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

const leagueResolvers = {
  leagues: getLeagues
}

export default leagueResolvers;