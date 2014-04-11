window.Share = {
    adminNewSharesSubmit: function(event){
        event.preventDefault;
        _parent = $(this).closest('.admin-shares-form');
        var content = _parent.find('#content').val();
        var categoryId = _parent.find('#category').val();
        var userId = $('.user-info').data('user-id');

        $.post('/admin/shares', { share: { content: content, category_id: categoryId, user_id: userId } }, function(data){
            var seed = Math.floor(Math.random() * 1000);
            var templateId = 'article-' + seed;
            var articleTemplate = $(document.createElement('script')).attr({ 'type': 'text/html', 'id': templateId, 'display': 'none' }).text(data);
            $('#template-tmp').append(articleTemplate);
            var newTemp = $( template.render(templateId) );
            $('#article-lists').prepend(newTemp);
            articleTemplate.remove();
            _parent.find('#content').val('')
            _parent.find('#category').val('')
            $(newTemp).css('display', 'none');
            $(newTemp).slideDown("slow");
        });
    }
}

$(document).ready(function(){
    $('.admin-shares-form .admin-new-shares-submit').on('click', Share.adminNewSharesSubmit);
});
