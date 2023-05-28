const Post = require('../models/post');
const User = require('../models/user');
const Friendship = require('../models/friendship');

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

        if(req.isAuthenticated()){
            let users = await User.find({});
            let user = await User.findById(req.user._id)
            .populate({
                path: 'friendships',
                populate: {
                    path: 'from_user to_user',
                }
            })


            let friends = await  user.friendships;
            // let friends = await user.populate('friendships');
            // console.log(friends)
            return res.render('home', {
                title: "posts",
                subtitle: "Home",
                posts: posts,
                all_users: users,
                friends: friends
            });

        }else{
            let users = await User.find({});
                    
            return res.render('home', {
                title: 'codeial | Home',
                posts: posts,
                all_users: users  
            });
        }

        
    }catch(err) {
        console.log('error', err);
        return;
    }
    
}