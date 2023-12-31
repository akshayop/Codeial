const User = require('../../../models/user');
const jwt = require('jsonwebtoken');
const env = require('../../../config/environment');

module.exports.createSession = async (req, res) => { 
    try{
        let user = await User.findOne({email: req.body.email});

        if(!user || user.password != req.body.password) {
            return res.json(422, {
                message: 'Invalid username or password'
            })
        }

        return res.json(200, {
            message: 'Sign in successful, here is your token, please keep it safe!',
            data: {
                token: jwt.sign(user.toJSON(), env.development.jwt_secret, {expiresIn: 100000})
            }
        })
    }catch{
        console.log('*****************error', err);
        return res.json(500, {
            message: "Internal server error"
        }); 
    }
}