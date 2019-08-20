import React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {ILeague} from '../interfaces';

interface IProps {
  index: number,
  leagues: ILeague[]
}

const LeagueInfo: React.FC<IProps> = (props: IProps) => {
  return(
    <div className='league-info'>
      here will render matchups and standings
    </div>
  )
}

export default LeagueInfo;