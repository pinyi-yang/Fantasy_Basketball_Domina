import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {IUser} from './interfaces';

interface IProps {
  user: IUser
}

const Home: React.FC<IProps> = (props: IProps) => {
  const [user, setUser] = useState<IUser>({} as IUser)

  useEffect(() => {
    let userInput = {
      yahooId: props.user.yahooId,
      name: props.user.name,
      avatar: props.user.avatar
    }
    
    let body = {
      query: `mutation createUser($input: UserInput) {
        createUser(userInput: $input) {
          _id
          name
          yahooId
          rivalries
          watchPlayers
        }
      }`,
      variables: {
        input: userInput
      }
    }
    let options = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    console.log('ready to create user from graphql');
    axios.post('/graphql', body, options).then(response => {
      console.log('checking user with db, return', response.data.data);
    }).catch(err => {console.log('error: checking database: ', err);})
  }, [])

  return (
    <>
      {props.user.name}
      {props.user.yahooId}
    </>
  )
}

export default Home;