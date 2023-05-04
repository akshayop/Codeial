const Post = require('../models/post');
const Comment = require('../models/comment')

module.exports.create = async (req, res) => {
    
    try {
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        if(req.xhr) {
            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post Created!"
            });
        }
        
        req.flash('success', 'Post Published!')
        return res.redirect('back');
    }catch(err) {
        req.flash('error', err)
        return res.redirect('back');
    }

}

module.exports.destroy = async (req, res) => {

    try {
        let post = await Post.findById(req.params.id);

        if(post.user == req.user.id) {

            // to delete post
            await Post.deleteOne(post);//delete the post in Post Schema
            console.log("deleted Post");

            //to delete comments related to post
            await Comment.deleteMany({post: req.params.id});//deletes many comments from Comment Schema

            req.flash('success', 'Post and associated comments deleted!')
            return res.redirect('back');
        }
        else {
            req.flash('error', 'You cannot delete this post')
            return res.redirect('back');
        }
    }catch(err) {
        req.flash('error', err)
        return res.redirect('back'); 
    }
}
        