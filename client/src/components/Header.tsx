import React from 'react';
import {ILeague} from '../interfaces';

interface IProps {
  league: null | ILeague
}

const Header: React.FC<IProps> = (props: IProps) => {
  let league = props.league
  let content = <h1>Fantasy Basketball Domina</h1>
  if (league) {
    content = 
    <>
      <img src={league.logo} alt="league logo" id="header-logo"/>
      <h1>
        {league.name}
      </h1>
    </>
  }
  return (
    <header>
      {content}
    </header>
  )
}

export default Header;