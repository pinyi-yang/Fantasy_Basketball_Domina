import React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {ILeague, ITeam, IMatchup} from '../interfaces';
import axios from 'axios';

interface IProps {
  myTeam: ITeam,
  scoreboard: IMatchup[],
  standings: ITeam[],
  rivals: ITeam[],
  week: string,
  setRivals: React.Dispatch<React.SetStateAction<ITeam[]>>
  setWeek: React.Dispatch<React.SetStateAction<string>>
}

const LeagueInfo: React.FC<IProps> = (props: IProps) => {
  let teamInfo = <p>Loading Team info</p>
  let scoreboard: JSX.Element | JSX.Element[] = <p>Loading Scoreboard</p>
  let standings: JSX.Element | JSX.Element[] = <p>Loading Standing</p>
  let rivalsKeys = props.rivals.map(rival => (
    rival.key
  ))
  let weekSelector = [];
  for (let i = 1; i<=23; i++) {
    weekSelector.push(<option value={i}>Week {i}</option>)
  }

  const handleRivalChange = (owner_yahooId: string, name: string, key: string, logo: string): void => {
    if (rivalsKeys.includes(key)) {
      // remove team from user rivalries
      axios.delete(`/api/rivals/${key}`).then(response => {
        console.log('removed rival, and new rivals are: ', response.data);
        props.setRivals(response.data.rivalries);
      })
    } else {
      // add team to user rivalries
      console.log('add team to user rivals with', owner_yahooId, name, key, logo);
      axios.post(`/api/rivals`, {owner_yahooId, name, key, logo}).then(response => {
        console.log('get new rivals back: ', response.data);
        props.setRivals(response.data.rivalries)
      })
    }
  }
  if (Object.keys(props.myTeam).length) {
    teamInfo = <>
      <img src={props.myTeam.logo} alt="" className="small-logo"/>
      <h3>{props.myTeam.name}, Ranking: {props.myTeam.rank}</h3>
    </>
  }

  if (props.scoreboard.length) {
    scoreboard = props.scoreboard.map((matchup, index) => (
      <div className="list-single-items-wrap">
        <div className="list-single-item" key={index}>
          <div className="list-single-item-1">
            <img src={matchup.teams[0].logo} alt="" className="small-logo"/>
            <button onClick={() => handleRivalChange(matchup.teams[0].owner_yahooId, matchup.teams[0].name, matchup.teams[0].key, matchup.teams[0].logo)}>
              {rivalsKeys.includes(matchup.teams[0].key)? '⚔️':'⚪️'}
            </button>
            <h4>{matchup.teams[0].name}</h4>
          </div>
          <h4>{matchup.teams[0].score}</h4>
        </div>
        <div className="list-single-item" key={index}>
          <div className="list-single-item-1">
            <img src={matchup.teams[1].logo} alt="" className="small-logo"/>
            <button onClick={() => handleRivalChange(matchup.teams[1].owner_yahooId, matchup.teams[1].name, matchup.teams[1].key, matchup.teams[1].logo)}>
              {rivalsKeys.includes(matchup.teams[1].key)? '⚔️':'⚪️'}
            </button>
            <h4>{matchup.teams[1].name}</h4>
          </div>
          <h4>{matchup.teams[1].score}</h4>
        </div>
      </div>
    ))
  }

  if (props.standings.length) {
    standings = props.standings.map(team => (
      <div className="list-single-item" key={team.key}>
        <div className="list-single-item-2">
          <img src={team.logo} alt="" className="small-logo"/>
          <button onClick={() => handleRivalChange(team.owner_yahooId, team.name, team.key, team.logo)}>
              {rivalsKeys.includes(team.key)? '⚔️':'⚪️'}
          </button>
          <h4>{team.name}</h4>
          <h4>{team.wins}-{team.ties}-{team.losses}</h4>
        </div>
        <h4>{team.rank}</h4>
      </div>
    ))
  }

  return(
    <div className='league-info'>
      <div className='league-info-sub'>
        <div className="team-info">
          <div className="weekselector-div">
            <select value={props.week} onChange={(e) => props.setWeek(e.target.value)}>
              {weekSelector}
            </select>
          </div>
          {teamInfo}
        </div>

        <div className="scoreboard">
          <div className="list-single-item">
            <h4>Matchups</h4>
            <h4>Score</h4>
          </div>
          {scoreboard}
        </div>
      </div>
      <div className='league-info-sub'>
        <div className="standings">
          <div className="list-single-item">
          <div className="list-single-item-2">
            <h4></h4>
            <h4></h4>
            <h4>Team</h4>
            <h4>Wins-Ties-Losses</h4>
          </div>
          <h4>Rank</h4>
        </div>
        {standings}
        </div>
      </div>
    </div>
  )
}

export default LeagueInfo;