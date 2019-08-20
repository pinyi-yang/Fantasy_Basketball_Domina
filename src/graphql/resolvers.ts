import {IUser} from '../interfaces';
import User from '../models/user';
import leagueResolvers from './resolvers/leagueResolvers';


const createUser = async ({userInput}: {userInput: IUser}) => {
  // * working return format
  // return {
  //   yahooId: 'testId',
  //   name: 'test',
  //   avatar: ''
  // }
  console.log('try to create user: ', userInput.yahooId, userInput);
  
  //!! Always, always return a promise for graphql resolver
  return User.findOne({
    yahooId: userInput.yahooId
  }, (err, user) => {
    console.log('after checking user, user in db is:', user);
    if (!user) {
      // no user find in database, create it
      console.log('create user with following info: ', {...userInput});
      return User.create({
        yahooId: userInput.yahooId,
        name: userInput.name,
        avatar: userInput.avatar
      }, (err, user) => {
        console.log('created user from database', user.toObject());
        return user.toObject();
      })
    } else {
      //find user in database, return it;
      console.log('find user: ', user.toObject(), 'in database and return it');
      return user.toObject();
    }
  })
}

const getUser = async ({name}: {name: string}) => {
  console.log(`try to find ${name} with graphql`);
  return User.findOne({
    name
  }, (err, user) => {
    if (!user) {
      console.log(`user ${name} not found`);
    } else {
      console.log(`find ${name} in db: `, user);
      return user.toObject();
    }

  }).catch(err => {
    console.log('error in looking for user with graphql', err);
  })
}

const rootResolvers = {
  hello: () => ('Hello World!'),
  createUser: createUser,
  user: getUser,
  ...leagueResolvers
}

export default rootResolvers;