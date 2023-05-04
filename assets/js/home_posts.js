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
                }, error: function(error) {
                    console.log(error.responseText);
                }
            });
            
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

    createPost();
}