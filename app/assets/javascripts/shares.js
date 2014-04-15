window.Share = {
    submitFrom : function(ele){
        var content = $('#'+ele).find("#share_content").val();
        var share_category_id = $('#'+ele).find(".fields-category input[type='radio']:checked").val();
        // 提交验证
        if(Share.formFieldColorAuth( ".fields-category input[type='radio']:checked", ".field-category label")){ return false; };
        if(Share.formFieldBorderAuth( "#new_share #share_content", "#new_share #share_content")){ return false; };
        $.post("/shares", {share: { content: content, category_id: share_category_id }}, function(data){
            if (data.status) {
                var newArticle = $(template.render("article-template", data));
                $("#content .wrapper").prepend( newArticle );
                // 时间绑定
                if (!Sign.isTouchDevice() ){ Sign.articleEventBind(newArticle) }

                newArticle.css('display', 'none');
                newArticle.fadeIn(2000);
                $("#background #operation").empty();
                $(".new-share-link").click();
            } else {
                $('.new-share-link').click();
                $('.sign-in-link').click();
                $('#operation input').animate({ 'border-color': "red" }, 500,'linear').animate({ 'border-color': "#ccc" }, 500,'linear');
            }
        });
    },
    // newShareLink
    newShareLink: function(event){
        var _this = $(this);
        event.preventDefault();
        if( _this.data('switch') ){
            _this.data('switch', false);
            var color = _this.data('switch') ? 'green' : 'rgba(0, 0, 0, 0.75)';
            _this.css('color', color);
            $("#background #operation").empty();
            _this.off();
            _this.on('click', Share.newShareLink);
        } else {
            _this.data('switch', true);
            var color = _this.data('switch') ? 'green' : 'rgba(0, 0, 0, 0.75)';
            _this.css('color', color);
            event.preventDefault();
            var newShareTemplate = $(template.render("new-share-template"));
            $("#background #operation").empty().append(newShareTemplate);
            _this.off();
            _this.on('click', Share.newShareLink);
            $('.ui.radio.checkbox').checkbox();
        }
    },
    // sidebarTagLink
    sidebarTagLink: function(event){
        event.preventDefault();
        var _this = $(this);
        $('div[data-id='+ _this.data('id') +']').addClass('green');
        $('div[data-id='+ _this.data('id') +']').siblings().each(function(index, element){
            $(element).removeClass('green');
        });
        var categoryId = _this.data('id');
        $.getJSON('/shares/tag', {category: categoryId}, function(data){
            $("#content .wrapper").empty();
            $(data).each(function(index, element){
                var newArticle = $(template.render("article-template", element));
                $("#content .wrapper").append(newArticle);
                if (!Sign.isTouchDevice() ){ Sign.articleEventBind(newArticle) }

                newArticle.css('display', 'none');
                newArticle.fadeIn(800);
            });
            $('.article, .article .comment-link').on('click', Share.commentLink);
        })
    },
    // sidebarTagButton
    sidebarTagButton: function(){
        var _this = $(this);
        $(".dashboard .sidebar-tag").each(function(index, element){
            $(element).removeClass('green');
        });
        _this.addClass('green');
    },
    // clearNewShareLink
    clearNewShareLink: function(){
        $('a.new-share-link').data('switch', false);
        $('a.new-share-link').css('color', 'rgba(0, 0, 0, 0.75)');
    },
    // commentLink
    commentLink: function(event){
        event.preventDefault();
        var _parent = $(this).closest('.article');
        var _this = _parent.find('.comment-link');
        if( _this.data('switch') ){
            _this.data('switch', false);
            _parent.find('.comment-content').slideUp();
            _parent.find('.comment-content').empty();
            event.stopPropagation();
        } else {
            _this.data('switch', true);
            $.get('/shares/comment',{ comment_share: { share_id: _parent.data('share-id') } },function(data){
                var newTemp = template.compile(data);
                //var newTemp = $(data);
                //console.log(template.compile(data));
                _parent.find('.comment-content').append(newTemp);
                _parent.find('.comment-input').on('click', function(event){ event.stopPropagation() });
                $('.article .comment-submit-link').on('click', Share.commentSubmitLink);
                _parent.find('.comment-content').slideDown("slow");
            });
            event.stopPropagation();
        }
    },
    // commentSubmitLink
    commentSubmitLink: function(event){
        var _this = $(this);
        var _parent = _this.closest('.article');
        var shareId = _parent.data('share-id');
        var contentInput = _parent.find('.comment-input').val();
        if (contentInput == '') {
            _parent.find('.comment-input').animate({ 'border-color': "red" }, 500,'linear').animate({ 'border-color': "#ccc" }, 500,'linear');
            return false;
        }

        $.post('/comments',{comment: { share_id: shareId, content: contentInput }}, function(data){
            switch (data.status) {
                case 0: {
                    _parent.find('.comment-input').val('');
                    var newTemp = $(template.render('article-comment-template',data));
                    newTemp.css('display', 'none');
                    _parent.find('.comment-main').prepend(newTemp);
                    newTemp.fadeIn('slow');
                    _parent.find('.comment-link').text(data.comment_size + ' 评论');
                    break;
                }
                case 1: {
                    $(document).scrollTop(0);
                    $('.sign-status .sign-in-link').click();
                    break;
                }
            }
        });
        event.stopPropagation();
    },
    // 两种验证，color 将 color 高亮
    formFieldColorAuth: function(field, fieldError){
        if( $(field).val() == "" || $.trim( $(field).val() ) == "" ){
            var startColor = $(fieldError).css('color');
            $(fieldError).animate({ 'color': "red" }, 500,'linear').delay(500).animate({ 'color': startColor }, 500,'linear')
            return true;
        }
    },
    // 两种验证，border 将 border 高亮
    formFieldBorderAuth: function(field, fieldError){
        if( $(field).val() == "" || $.trim( $(field).val() ) == "" ){
            var startColor = $(fieldError).css('border-color');
            $(fieldError).animate({ 'border-color': "red" }, 500,'linear').delay(500).animate({ 'border-color': startColor }, 500,'linear');
            return true;
        }
    }
};


$(document).ready(function(){
    $(".dashboard .sidebar-tag").on('click', Share.sidebarTagLink);
    $(".dashboard .sidebar-tag").on('click', Share.sidebarTagButton);
    $(".menu .nav-tag").on('click', Share.sidebarTagLink);
    $('.sign-in-link, .sign-up-link, .sign-out-link').on('click', Share.clearNewShareLink);
    $('.article, .article .comment-link').on('click', Share.commentLink);
});
