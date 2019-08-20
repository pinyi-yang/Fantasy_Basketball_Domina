import React from 'react';
import {RouteComponentProps, Link} from 'react-router-dom'
import {ILeague} from '../interfaces';

interface IProps {
  index: number,
  leagues: ILeague[],
  displayLeague: React.Dispatch<React.SetStateAction<number>>
}

const Sidebar: React.FC<IProps> = (props: IProps) => {

  let leagues = props.leagues.map((league, index) => (
    <div className="side-league" key={league.key} onClick={() => props.displayLeague(index)}>
      <img src={league.logo} alt="league logo" className="side-league-logo"/> {" "}
      {league.name}
    </div>
  ))
  return (
    <aside>
      
      <div className="side-leagues">
        <Link to='/'>
          <div className="side-link-div">
            <h3>Leagues</h3>
          </div>
        </Link>
        {leagues}
      </div>

      <Link to='/matchup'>
        <div className="side-link-div">
          <h3>Matchup</h3>      
        </div>
      </Link>
      <Link to='/rivals'>
        <div className="side-link-div">
          <h3>Rivals</h3>
        </div>
      </Link>
      <Link to='/playground'>
        <div className="side-link-div">
          <h3>Playground</h3>
        </div>
      </Link>
    </aside>
  )
}

export default Sidebar;