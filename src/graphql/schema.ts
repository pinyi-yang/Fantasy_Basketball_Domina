import {buildSchema} from 'graphql';

export default buildSchema(`
  type Test {
    hello: String
  }

  type Player {
    _id: ID
    key: String!
    firstName: String
    lastName: String
    positions: String
    headshot: String
  }

  type Team {
    _id: ID
    key: String!
  }

  type User {
    _id: ID
    yahooId: String!
    name: String
    avatar: String
    rivalries: [Team]
    watchPlayers: [Player]
  }

  type League {
    key: String
    name: String
    logo: String
    totalWeeks: String
    week: String
    season: String
  }
  
  input UserInput {
    yahooId: String!
    name: String
    avatar: String
  }
  
  type RootQuery {
    hello: String
    user(name: String): User
    leagues(token: String): [League]
  }


  type RootMutation {
    createUser(userInput: UserInput): User
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`)