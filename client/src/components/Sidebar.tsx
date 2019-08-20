import React from 'react';
import {RouteComponentProps, Link} from 'react-router-dom'


const Sidebar: React.FC = () => {

  return (
    <aside>
      <Link to='/'>
        <div className="side-link-div">
          <h3>Leagues</h3>
        </div>
      </Link>
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