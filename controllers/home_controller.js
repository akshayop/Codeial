const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async (req, res) => {

    try {
        // Populate the user of each post
        // populate the likes of each post and comment
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({ 
            path: 'comments',
            populate: {
                path: 'user'
            },
            populate: {
                path: 'likes'
            }
        }).populate('comments')
        .populate('likes')

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