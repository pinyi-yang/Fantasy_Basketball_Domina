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
    _id: String
    owner_yahooId: String
    key: String!
    name: String
    logo: String
    rank: Int
    wins: String
    losses: String
    ties: String
    percentage: String
    score: Int
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

  type Matchup {
    teams: [Team]
  }

  type LeagueInfo {
    standings: [Team]
    scoreboard: [Matchup]
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
    leagueInfo(token: String, leagueKey: String, week: String): LeagueInfo
  }


  type RootMutation {
    createUser(userInput: UserInput): User
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`)