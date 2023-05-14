const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

// tell passport to use a new strategy for google login

passport.use(new googleStrategy({
        clientID: "222721594416-km9tb0n9q67f4bpsb7eemtafn3fgj206.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:8000/users/auth/google/callback"
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