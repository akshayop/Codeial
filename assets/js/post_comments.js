// Let's implement this via classes

// this class would be initialized for every post on the page
// 1. When the page loads
// 2. Creation of every post dynamically via AJAX

class PostComments {
    // constructor is used to initialize the instance of the class whenever a new instance is created
    constructor(postId) {
        this.postId = postId;
        this.postContainer = $(`#post-${postId}`);
        this.newCommentForm = $(`#post-${postId}-comments-form`);

        this.createComment(postId);

        let self = this;
        // call for all the existing comments
        $(' .delete-comment-btn', this.postContainer).each(function () {
            self.deleteComment($(this));
        });
    }


    createComment(postId) {
        let pSelf = this;
        this.newCommentForm.submit(function (e) {
            e.preventDefault();
            let self = this;

            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: $(self).serialize(),
                success: async function (data) {
                    let newComment = await pSelf.newCommentDom(data.data.comment);
                    $(`#post-comments-${ postId }`).prepend(newComment);

                    pSelf.deleteComment($(' .delete-comment-btn', newComment));

                    new Noty({
                        theme: 'relax',
                        text: "Comment published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500

                    }).show();

                }, error: function (error) {
                    console.log(error.responseText);
                }
            });


        });
    }


    newCommentDom(comment) {
        // I've added a class 'delete-comment-button' to the delete comment link and also id to the comment's li
        return $(`<li id="comment-${comment._id}">
                    <p>
                        <small>
                            <a class="delete-comment-btn" href="/comments/destroy/${comment._id}">
                                <i class="fa-solid fa-trash-can"></i>
                            </a>
                        </small>
                
                        ${comment.content}
                        
                        <br>
                
                        <small>
                            ${comment.user.name}
                        </small>
                    
                    </p>
                    
                </li>`);
    }


    deleteComment(deleteLink) {
        $(deleteLink).click(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function (data) {
                    console.log(data);
                    $(` #comment-${data.data.comment_id}`).remove();

                    new Noty({
                        theme: 'relax',
                        text: "Comment Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500

                    }).show();
                }, error: function (error) {
                    console.log(error.responseText);
                }
            });

        });
    }
}