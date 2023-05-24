const User = require('../models/user');
const fs = require('fs');
const path = require('path');

module.exports.profile = (req, res) => {
    User.findById(req.params.id).then( (user) => {
        res.render('user_profile', {
            title: 'profile',
            profile_user: user
        });
    }).catch( (err) => {
        console.log( err, "Error");
    })  
}

module.exports.update = async (req, res) => {
    if(req.user.id == req.params.id) {
            try {

                let user = await User.findByIdAndUpdate(req.params.id, req.body);
                User.uploadedAvatar(req, res, function(err) {
                    if(err) {
                        console.log('************Multer Error: ', err);
                    }

                    user.name = req.body.name;
                    user.email = req.body.email;

                    if(req.file) {

                        if(user.avatar) {
                            fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                        }
                        // this is saving the path of the uploaded file into the avatar field in the user 
                        user.avatar = User.avatarPath + '/' + req.file.filename;
                    }
                    user.save();
                    return res.redirect('back');

                });

            }catch(err) {
                req.flash('error', err);
                return res.redirect('back');
            }
    }

    else {
        req.flash('error', 'Unauthorized!..')
        return res.status(401).send('unauthorized')
    }
}


// render the signup page
module.exports.signUp = function(req, res) {

    if(req.isAuthenticated()) {
        return res.redirect('/users/profile')
    }

    return res.render('user_sign_up', {
        title: 'Codeial | Sign Up'
    });
}
// render the signin page

module.exports.signIn = (req, res) => {

    if(req.isAuthenticated()) {
        return res.redirect('/users/profile')
    }

    return res.render('user_sign_in', {
        title: 'Codeial | Sign In'
    });
}

// get the sign up data

module.exports.create = async (req, res) => {
   
    try{
        if(req.body.password != req.body.confirmPassword) {
            req.flash('error', "Password didn't matched");
            return res.redirect('back');
        }
    
        let user = await User.findOne({email: req.body.email}); //find the user by email
        // if user not found
    
        if(!user) {

            // create new user
            User.create(req.body).then (() => {
                req.flash('success', 'Successfully signed up ');
                return res.redirect('/users/sign-in')
            })
            .catch( (err) => {
                req.flash('error', err);
                return res.redirect('back');
            });
        }
        else {
            // return to back or sign-in page
            req.flash('error', 'You are already signed up')
            return res.redirect('back');
        }
    }catch(err) {
        req.flash('error', err);
        return res.redirect('back');
    }


}

// sign in create the session for the user

module.exports.createSession = (req, res) => { 
    req.flash('success', 'Logged in Succefully');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res, next) {
    req.logout( (err) => {
        if(err) {
            return next();
        }
        req.flash('success', 'You have logged out!')
        return res.redirect('/');
    });
    
}

