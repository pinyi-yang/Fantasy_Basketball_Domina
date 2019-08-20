import React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {ILeague, ITeam, IMatchup} from '../interfaces';

interface IProps {
  myTeam: ITeam,
  scoreboard: IMatchup[],
  standings: ITeam[]
}

const LeagueInfo: React.FC<IProps> = (props: IProps) => {

  let teamInfo = <p>Loading Team info</p>
  let scoreboard: JSX.Element | JSX.Element[] = <p>Loading Scoreboard</p>
  let standings: JSX.Element | JSX.Element[] = <p>Loading Standing</p>

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
            
            <h4>{matchup.teams[0].name}</h4>
          </div>
          <h4>{matchup.teams[0].score}</h4>
        </div>
        <div className="list-single-item" key={index}>
          <div className="list-single-item-1">
            <img src={matchup.teams[1].logo} alt="" className="small-logo"/>
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
        <div className="list-single-item-1">
          <img src={team.logo} alt="" className="small-logo"/>
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
          <div className="list-single-item-1">
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