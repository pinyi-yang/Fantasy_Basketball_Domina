import React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {IMatchup} from '../interfaces';

interface IProps {
  myMatchup: IMatchup | null
}

const Matchup: React.FC<IProps> = (props: IProps) => {
  return (
    <div className="matchup">
      here will render the match of this week
    </div>
  )
}

export default Matchup;