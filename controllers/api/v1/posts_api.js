const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async (req, res) => {

    let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({ 
            path: 'comments',
            populate: {
                path: 'user'
            }
        })

    return res.json(200, {
        message: "List of posts",
        posts: posts
    });
}


module.exports.destroy = async (req, res) => {

    try {
        let post = await Post.findById(req.params.id);

        if(post.user == req.user.id) {

            // to delete post
            await Post.deleteOne(post);//delete the post in Post Schema
            // console.log("deleted Post");

            //to delete comments related to post
            await Comment.deleteMany({post: req.params.id});//deletes many comments from Comment Schema

            return res.json(200, {
                message: "Postman associated comments deleted successfully"
            });
        }
        else {
            return res.json(401, {
                message: "You cannot delete this post!"
            })
        }
    }catch(err) {
        console.log('*****************error', err);
        return res.json(500, {
            message: "Internal server error"
        }); 
    }
}