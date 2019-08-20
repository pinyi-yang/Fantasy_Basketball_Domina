import React, {useState, useEffect} from 'react';
import './App.css';
import aixos from 'axios';
import openNewAuthWindow from './openWindow';
import axios from 'axios';
import Home from './Home';
import {IUser} from './interfaces';

//We had to define this because TS needs to know
//the shape of our user object

const App: React.FC = () => {
  //useState can be used as generic, using IUser from above
  const [user, setUser] = useState<IUser>({} as IUser);

  // useEffect(() => {
    // console.log('checking user in db');
    // if (Object.keys(user).length && !Object.keys(user).includes('_id')) {
    //   let body = {
    //     query: `mutation createUser($user: UserInput) {
    //       createUser(userInput: $user) {
    //         _id
    //         name
    //         yahooId
    //         avatar
    //         rivalries
    //         watchPlayers
    //       }
    //     }`,
    //     variables: {
    //       user
    //     }
    //   }
      
    //   let options = {
    //     headers: {
    //       'Content-Type': 'application/json'
    //     }
    //   }
  
    //   console.log('ready to create user from graphql');
    //   axios.post('/graphql', body, options).then(response => {
    //     console.log('checking user with db, return', response.data.data.user);
    //   }).catch(err => {console.log('error: checking database: ', err);})
    // }
  // }, [user])

  function handleLogin(e: React.MouseEvent): void {
    e.preventDefault();
    // specify the type of data returned
    var message: Promise<IUser> = openNewAuthWindow('/auth/yahoo');
    message.then(response => {
      setUser(response);
    }).catch(err => {
      console.log(err);
    })
  }

  function getUserGraphQL(): void {
    // * working, passed
    let name = "test"
    let body = {
      query: `query user($name: String) {
        user(name: $name) {
          _id
          name
          yahooId
        }
      }`,
      variables: {
        name
      }
    }
    let options = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    console.log('ready to get user from graphql');
    axios.post('/graphql', body, options).then(response => {
      console.log('checking user with db, return', response.data);
      console.log('user info:', response.data.data.user); //? graphql wrap everything in data as well
    }).catch(err => {console.log('error: checking database: ', err);})
  }

  function createUserGraphQL():void {
    let userInput = {
      yahooId: 'testId2',
      name: 'test2',
      avatar: ''
    }
    
    let body = {
      query: `mutation createUser($input: UserInput) {
        createUser(userInput: $input) {
          _id
          name
          yahooId
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
      console.log('checking user with db, return', response.data);
    }).catch(err => {console.log('error: checking database: ', err);})
  }
  // function handleYhaoo(e: React.MouseEvent): void {
  //   var message: Promise
  // }
  let content = (
    <>
    <a onClick={handleLogin} href='/auth/yahoo'>Login with Yahoo!</a>
      <button onClick={getUserGraphQL}>Get User with GraphQL</button>
      <button onClick={createUserGraphQL}>Create User with GraphQL</button>
    </>  
  )
  if (Object.keys(user).includes('yahooId')) {
    content = <Home user={user}/>
  }

  return (
    <div className="App">
      {content}
    </div>
  );
}

export default App;
