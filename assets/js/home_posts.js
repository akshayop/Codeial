{
    // method to submit the form data for new post using AJAX
    let createPost = function() {
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function(e) {
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function(data) {
                    let newPost = newPostDom(data.data.post);
                    
                    $('#post-controller>ul').prepend(newPost);
                    deletePost($(' .delete-post-btn', newPost));

                    new Noty({
                        theme: 'relax',
                        text: "Post Published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500 
                    }).show();
                }, error: function(error) {
                    console.log(error.responseText);
                }
            });
            $('#content').val('');
        });
    }

    // method to create post in DOM

    let newPostDom = function(post) {
        
        return $(`<li id="post-${post._id}">
                    <p>     
                        <small>
                            <a class="delete-post-btn" href="/posts/destroy/${post._id}">
                                <i class="fa-solid fa-trash-can"></i>
                            </a>
                        </small>

                        ${post.content} 
                
                        <br>
                        <small>
                            ${post.user.name} 
                        </small>
                    </p>
                
                    <div id="post-comments">                            
                        <form action="/comments/create" method="POST">
                            <input type="text" name="content" placeholder="Type some Comments here......" required>
                            <input type="hidden" name="post" value="${post._id}>
                            <input type="submit" value="Add Comments">
                        </form>
            
                
                        <div id="post-comments-list">
                            <ul id="post-comments-${post._id}">
                            </ul>
                
                        </div>
                
                    </div>
                </li>`);
    }


    // method to delete a post from DOM

    let deletePost = function(deleteLink) {
        $(deleteLink).click(function(e) {
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data) {
                    $(`#post-${data.data.post_id}`).remove();

                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500 
                    }).show();
                }, error: function(error) {
                    console.log(error.responseText)
                }
            })
        })
    } 
    
    let allPost = $('#post-controller > ul > li');

    for(let i of allPost) {
        deletePost($(' .delete-post-btn', i));
    }

    createPost();
}


