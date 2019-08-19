import {buildSchema} from 'graphql';

export default buildSchema(`
  type Test {
    hello: String
  }

  type RootQuery {
    hello: String
  }

  schema {
    query: RootQuery
  }
`)