const Comment = require('../models/comment');
const Post = require('../models/post');
const Like = require('../models/likes');
const commentsMailer = require('../mailers/comments_mailer');
const commentEmailWorker = require('../workers/comment_email_worker');
const queue = require('../config/kue');


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

            comment = await comment.populate('user', 'name email');
            // commentsMailer.newComment(comment);
            let job = queue.create('emails', comment).save( (err) => {
                if(err) {
                    console.log('error in creating a queue', err);
                    return;
                }

                console.log('job enquede', job.id);
            })

            if(req.xhr) {

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

            // destroy the associated likes for this comment

            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});

            // send the comment id which was deleted back to the views
            if(req.xhr) {

                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "commented Delete"
                });
            }

            req.flash('success', 'Comment Deleted')
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