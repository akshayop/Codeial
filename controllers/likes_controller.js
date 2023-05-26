const Like = require('../models/likes');
const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.toggleLike = async (req, res) => {
    try{

        // likes/toggle/?id=abcdefg&type=post
        let likeable;
        let deleted = false;

        if(req.query.type == 'Post') {
            likeable = await Post.findById(req.query.id).populate('likes');
        }

        else {
            likeable = await Comment.findById(req.query.id).populate('likes');
        }


        // check if alike is already exists

        let existingLike = await Like.findOne({
            user: req.user._id,
            likeable: req.query.id,
            onModel: req.query.type,
           
        });

        // console.log(existingLike);
        // if a like already exists
        if(existingLike) {
            likeable.likes.pull(existingLike._id);
            likeable.save();

            existingLike.deleteOne();
            deleted = true;

            if(req.xhr) {
                return res.json(200, {
                    message: "Request Successfull!",
                    data: {
                        deleted: deleted
                    }
                });
            }

            req.flash('success', `${existingLike.onModel} disliked`);
            return res.redirect('back');
        } 

        // else make a like
        else {
            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type
            });

            likeable.likes.push(newLike._id);
            likeable.save();

            if(req.xhr) {
                return res.json(200, {
                    message: "Request Successfull!",
                    data: {
                        deleted: deleted
                    }
                });
            }

            req.flash('success', `${newLike.onModel} Liked`);
            return res.redirect('back');

        }
        
        

    }catch(err) {
        console.log("Error", err);
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}
