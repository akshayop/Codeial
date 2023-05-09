const Comment = require('../models/comment');
const Post = require('../models/post');


module.exports.create = async (req, res) => {
    try{
        let post = await Post.findById(req.body.post);
    
        if(post) {
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            })

           
       
            post.comments.push(comment);
            post.save();

            if(req.xhr) {

                comment = await comment.populate('user', 'name');

                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "commented to the post"
                });
            }

            req.flash('success', 'commeted to the Post!')
            res.redirect('back');
        }

        
    }catch(err) {
        req.flash('error', err)
        return res.redirect('back');
    }
}

module.exports.destroy = async (req, res) => {
    
    try {
        let comment = await Comment.findById(req.params.id);//to find the comment
        let post = await Post.findById(comment.post); //to find the post from comment

        if((comment.user == req.user.id || post.user == req.user.id)) {
            let postId = comment.post;
            // deleting comment from commentSchema
            await Comment.deleteOne(comment);
            req.flash('success', 'comment is deleted!')


            // update the comments in postSchema    
            await Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});

            if(req.xhr) {

                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "commented Delete"
                });
            }
            return res.redirect('back');
            
        }

        else {
            req.flash('error', 'You cannot delete this post');
            return res.redirect('back');
        }
    }catch(err) {
        req.flash('error', err);
        return res.redirect('back');
    }

}