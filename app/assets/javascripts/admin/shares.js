window.Share = {
    adminNewSharesSubmit: function(event){
        event.preventDefault;
        _parent = $(this).closest('.admin-shares-form');
        var content = _parent.find('#content').val();
        var categoryId = _parent.find('input[name="category"]:checked').val();
        var userId = $('.user-info').data('user-id');
        var likeCount = _parent.find("#like_count").val();
        var deserveCount = _parent.find("#deserve_count").val();

        var date = { content: content, category_id: categoryId, user_id: userId, like_count: likeCount, deserve_count: deserveCount }

        $.post('/admin/shares', { share: date }, function(data){
            $('#article-lists').prepend(data.share_template);
            $(".admin-shares-form").replaceWith(data.form_template);
            $('.admin-shares-form .admin-new-shares-submit').on('click', Share.adminNewSharesSubmit);
        });
    },
    adminUserRandom: function(){
        $.getJSON('/admin/sessions/random', function(data){
            $('.user-info').data('user-id', data.user.id);
            $('.user-info .user-name').text(data.user.username);
        });
    }
}

$(document).ready(function(){
    $('.admin-shares-form .admin-new-shares-submit').on('click', Share.adminNewSharesSubmit);
    $('.admin-user-random-link').on('click', Share.adminUserRandom);
});
