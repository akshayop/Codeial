const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const env = require('./environment');

// tell passport to use a new strategy for google login

passport.use(new googleStrategy({
        clientID: env.google_client_iD,
        clientSecret: env.google_client_secret,
        callbackURL: env.google_call_back_url
    },

    async (accessToken, refreshToken, profile, done) => {
        
        try{
            // find user
            let user = await User.findOne({email: profile.emails[0].value}).exec();
            console.log(profile);

            if(user) {
                // if found, set the user as req.user
                return done(null, user);
            }

            else {
                // if not found, create the user as req.user
                let newUser = await User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    passport: crypto.randomBytes[20].toString('hex')
                });

                return done(null, newUser);
            }
            
        }catch(err){
            console.log("error in google Strategy-passport", err);
        };
            
    }
));

module.exports = passport;