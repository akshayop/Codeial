const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt  = require('passport-jwt').ExtractJwt ;
const User = require('../models/user');
const env = require('./environment');



let opts = {
    jwtFromRequest: ExtractJwt .fromAuthHeaderAsBearerToken(),
    secretOrKey: env.jwt_secret
}


passport.use(new JWTStrategy(opts, async (jwtPayload, done) => {

    try{
        let user = await User.findById(jwtPayload._id);

        if(user) {
            return done(null, user);
        } else {
            return done(null, false);
        }

    }catch {
        console.log("error in finding user from jwt");
        return;
    }
}));


module.exports = passport;

