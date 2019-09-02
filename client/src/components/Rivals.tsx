import React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {ILeague, IMatchup, ITeam, IPlayer, ITeamScore} from '../interfaces';

interface ITeams {
  [key:string]: ITeamScore
}

interface IProps {
  myTeam: ITeam,
  teams: ITeams,
  rivalsKeys: string[],
  week: string,
  setWeek: React.Dispatch<React.SetStateAction<string>>
}

const Rivals: React.FC<IProps> = (props: IProps) => {

  let weekSelector: JSX.Element[] = [];
  let teamInfo = <h3>Loading Team info</h3>
  let matchupsHeader: JSX.Element = <div className="rival-matchup-header"></div>;
  let rivalsMatchups: JSX.Element | JSX.Element[] = <h3>Loading Your Matchups with Your Rivals at Week {props.week}</h3>
    

  if (!props.rivalsKeys.length) {
    rivalsMatchups = <h3>Please Select Your Rivals First</h3>
  } else {
    if (!Object.keys(props.teams).includes(props.myTeam.key)) {
      rivalsMatchups = <h3>Sorry! You have been eliminated at this week</h3>
    } else {
      let myKey = props.myTeam.key
      rivalsMatchups = [];
      let statNames: string[];
      let myStat: JSX.Element[] = [];
      for (let key in props.teams[myKey].stat) {
        myStat.push(
          <div className="rival-matchup-stat">
            {props.teams[myKey].stat[key]}
          </div>
        )
      }
      for (let key in props.teams) {
        if (key !== myKey) {
          if (props.rivalsKeys.includes(key)) {
            let rivalStat: JSX.Element[] = [];
            let myScore = 0;
            let rivalScore = 0;
            for (let item in props.teams[key].stat) {
              rivalStat.push(
                <div className="rival-matchup-stat">
                  {props.teams[key].stat[item]}
                </div>
              )
              if (item === "TO") {
                if (props.teams[key].stat[item] !== props.teams[myKey].stat[item]) {
                  props.teams[key].stat[item] < props.teams[myKey].stat[item] ? rivalScore++ : myScore++;
                }
              } else if (!item.includes('/')) {
                if (props.teams[key].stat[item] !== props.teams[myKey].stat[item]) {
                  props.teams[key].stat[item] > props.teams[myKey].stat[item] ? rivalScore++ : myScore++
                }
              }
            }

            rivalsMatchups.push(
              <div className="rival-matchup">
                <div className="rival-matchup-team">
                  <div className="rival-matchup-name">
                    <img src={props.teams[key].logo} alt="" className="small-logo"/>
                    <h4>{props.teams[key].name}</h4>
                  </div >
                  {rivalStat}
                  <div>{rivalScore}</div>
                </div>
                <div className="rival-matchup-team">
                  <div className="rival-matchup-name">
                    <img src={props.teams[myKey].logo} alt="" className="small-logo"/>
                    <h4>{props.teams[myKey].name}</h4>
                  </div>
                  {myStat}
                  <div className="rival-matchup-stat">{myScore}</div>
                </div>
              </div>
            )
          }
        } else {
          statNames = Object.keys(props.teams[key].stat);
          matchupsHeader = (
            <div className="rival-matchup-header">
              <div>Name</div>
              {statNames.map(name => (
                <div>{name}</div>
                ))}
              <div>Score</div>
            </div>
          )
        }
      }
    }

  }


  for (let i = 1; i<=23; i++) {
    weekSelector.push(<option value={i}>Week {i}</option>)
  }
  
  if (Object.keys(props.myTeam).length) {
    teamInfo = <>
      <img src={props.myTeam.logo} alt="" className="small-logo"/>
      <h3>{props.myTeam.name}, Ranking: {props.myTeam.rank}</h3>
    </>
  }

  return (
    <div className="rivals">
      <div className="weekselector-div">
        <select value={props.week} onChange={(e) => props.setWeek(e.target.value)}>
          {weekSelector}
        </select>
      </div>
      <div className="team-info">
        {teamInfo}
      </div>
      <div className="rivals-matchups">
        {matchupsHeader}
        {rivalsMatchups}
      </div>
    </div>
  )
}

export default Rivals;