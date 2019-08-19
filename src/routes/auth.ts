import express from 'express';
const router = express.Router();
import passport from '../config/ppConfig';

// GET /auth/github - displays the GH login page
router.get('/yahoo', passport.authenticate('oauth2'));

// GET /auth/github/callback - call URL that receives the token
router.get('/yahoo/callback', passport.authenticate('oauth2', {failureRedirect: '/'}), (req, res) => {
  //*Successful authentication
  console.log('👤👤👤this is the user info from db: ', req.user);
  res.render('success', {user: req.user});
});

export default router;

