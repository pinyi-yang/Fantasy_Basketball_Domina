import {buildSchema} from 'graphql';

export default buildSchema(`
  type Test {
    hello: String
  }

  type RootQuery {
    hello: String
  }

  type RootMutation {

  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`)