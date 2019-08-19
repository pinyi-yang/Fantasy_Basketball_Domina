import dotenv from 'dotenv';
dotenv.config();
import passport from 'passport';
import passportOAuth2 from 'passport-oauth2';
const OAuth2Strategy = passportOAuth2.Strategy;
import User from '../models/user';
import axios from 'axios';

passport.use(new OAuth2Strategy({
  clientID: process.env.YAHOO_CONSUMER_KEY,
  clientSecret: process.env.YAHOO_CONSUMER_SECRET,
  callbackURL: "/auth/yahoo/callback",
  authorizationURL: 'https://api.login.yahoo.com/oauth2/request_auth',
  tokenURL:'https://api.login.yahoo.com/oauth2/get_token'
},
function(accessToken: string, refreshToken: string, profile: any, cb) {
  console.log('authorized by yahoo with: ', accessToken);
  let config = {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  }

  axios.get('https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/profile?format=json', config).then(response => {
    let user = {
      yahooId: response.data.fantasy_content.users[0].user[0].guid,
      name: response.data.fantasy_content.users[0].user[1].profile.display_name,
      avatar: response.data.fantasy_content.users[0].user[1].profile.image_url 
    }
    console.log('get user info back: ', user);
    return cb(null, {...user, accessToken})
  }).catch(err => {
    console.log('error through authorization: ', err);
  })
}))

passport.serializeUser(function(user,cb) {
  cb(null, user);
});
passport.deserializeUser(function(obj, cb) {
  cb(null, obj)
})

export default passport;