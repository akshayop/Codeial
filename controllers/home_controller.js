const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async (req, res) => {

    try {
        // Populate the user of each post
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({ 
            path: 'comments',
            populate: {
                path: 'user'
            }
        })

        let users = await User.find({});
                    
        return res.render('home', {
            title: 'codeial | Home',
            posts: posts,
            all_users: users  
        });
    }catch(err) {
        console.log('error', err);
        return;
    }
    
}