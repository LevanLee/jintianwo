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
        var tagType    = _this.data('type');
        $.getJSON('/shares/tag', {tag_type: tagType, category: categoryId}, function(data){
            $("#content .wrapper").empty();
            $(data).each(function(index, element){
                var newArticle = $(template.render("article-template", element));
                $("#content .wrapper").append(newArticle);
                if (!Sign.isTouchDevice() ){ Sign.articleEventBind(newArticle) }

                newArticle.css('display', 'none');
                newArticle.fadeIn(800);
            });
            $('.article, .article .comment-link').on('click', Share.commentLink);
            Share.articleFavouriteInit();
            $('.article .article-like').on("click", Share.favouriteLink);
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
                    Share.upTopAndSignIn();
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
    },
    closeButton: function(){
        $("#operation").empty();
    },
    // articleShowFavourite 用户将 favourite start 显示出来
    articleShowFavourite: function(ele){
        $(ele).closest('.article').css('display', 'black');
        $(ele).find("i").css('color', 'yellow');
        $(ele).closest('.article').off('mouseenter');
        $(ele).closest('.article').off('mouseleave');
    },
    // 在初次加载页面时 将 favourite star 显示出来， 切换 tag 时也需要调用
    articleFavouriteInit: function(){
        $(".article").each(function(index,element){
            if ( $(element).data("favourited") ) {
                $(this).find(".article-like").css('display', 'black');
                $(this).find(".article-like i").css('color', 'yellow');
                $(this).off('mouseenter');
                $(this).off('mouseleave');
            }
        });
    },
    // 收藏 favourite
    favouriteLink: function(event){
        event.stopPropagation();
        var _this = $(this);
        var shareId = _this.data('share-id');
        var favouriteType = _this.closest(".article").data('favourited') ? "unfavourite" : "favourite";
        $.get('/shares/favourite', {favourite_type: favouriteType, share_id: shareId}, function(data){
            if (data.status) {
                if (data.favourited) {
                    _this.closest(".article").data('favourited', true);
                    Share.articleShowFavourite(_this);
                } else {
                    _this.find('i').css('color', 'black');
                    _this.closest(".article").data('favourited', false);
                    Sign.articleEventBind(_this.closest('.article'));
                }
            } else {
                Share.upTopAndSignIn();
            }
        });
    },
    // 赞 和 取消 功能
    likeLink: function(ele){
        event.stopPropagation();
        var _this = $(ele);
        var likeCount = _this.parent().find("span.dyn-vote-j-data").text();
        var shareId = $(ele).closest('.article').data('share-id');
        $.getJSON('/shares/like', {share_id: shareId}, function(data){
            switch(data.status){
                case 0: //成功
                    _this.data("liked", true);
                    _this.parent().find("span.dyn-vote-j-data").text(Number(likeCount) + 1);
                    _this.text("取消赞~");
                    _this.attr("onclick", "return Share.cancelLikeLink(this)");
                    break;
                case 1:  //没有登录
                    Share.upTopAndSignIn();
                    break;
            }
        });
    },
    cancelLikeLink: function(ele){
        event.stopPropagation();
        var _this = $(ele);
        var likeCount = _this.parent().find("span.dyn-vote-j-data").text();
        var shareId = $(ele).closest('.article').data('share-id');
        $.getJSON('/shares/cancel_like', {share_id: shareId}, function(data){
            switch(data.status){
                case 0: //成功
                    _this.data("liked", false);
                    _this.parent().find("span.dyn-vote-j-data").text(Number(likeCount) - 1);
                    _this.text("赞~");
                    _this.attr("onclick", "return Share.likeLink(this)");
                    break;
                case 1:  //没有登录
                    Share.upTopAndSignIn();
                    break;
            }
        });
    },
    // 你活该 和 取消
    deserveLink: function(ele){
        event.stopPropagation();
        var _this = $(ele);
        var deserveCount = _this.parent().find("span.dyn-vote-t-data").text();
        var shareId = $(ele).closest('.article').data('share-id');
        $.getJSON('/shares/deserve', {share_id: shareId}, function(data){
            switch(data.status){
                case 0: //成功
                    _this.data("deserved", true);
                    _this.parent().find("span.dyn-vote-t-data").text(Number(deserveCount) + 1);
                    _this.text("取消~");
                    _this.attr("onclick", "return Share.cancelDeserveLink(this)");
                    break;
                case 1:  //没有登录
                    Share.upTopAndSignIn();
                    break;
            }
        });
    },
    cancelDeserveLink: function(ele){
        event.stopPropagation();
        var _this = $(ele);
        var deserveCount = _this.parent().find("span.dyn-vote-t-data").text();
        var shareId = $(ele).closest('.article').data('share-id');
        $.getJSON('/shares/cancel_deserve', {share_id: shareId}, function(data){
            switch(data.status){
                case 0: //成功
                    _this.data("deserved", false);
                    _this.parent().find("span.dyn-vote-t-data").text(Number(deserveCount) - 1);
                    _this.text("你活该~");
                    _this.attr("onclick", "return Share.deserveLink(this)");
                    break;
                case 1:  //没有登录
                    Share.upTopAndSignIn();
                    break;
            }
        });
    },
    // 移到顶端并显示登陆框
    upTopAndSignIn: function(){
        $("body").animate({ scrollTop: 0 }, 1000 );
        $('.sign-status .sign-in-link').click();
    },
    articleSort: function(){
        var _this = $(this);
        var sortType = _this.data("sort-type");
        $.getJSON("/shares/article_sort", {sort_type: sortType}, function(data){
            $("#content .wrapper").empty();
            $(data).each(function(index, element){
                var newArticle = $(template.render("article-template", element));
                $("#content .wrapper").append(newArticle);
                if (!Sign.isTouchDevice() ){ Sign.articleEventBind(newArticle) }

                newArticle.css('display', 'none');
                newArticle.fadeIn(800);
            });
            $('.article, .article .comment-link').on('click', Share.commentLink);
            Share.articleFavouriteInit();
            $('.article .article-like').on("click", Share.favouriteLink);
        })
    },
    // 查询 notifications messages
    selectNotification: function(){
        var _title = $(".notification-box");
        $.getJSON("/shares/notification", function(data){
            _title.find(".message-count").text(data.size);
            var _listContent = _title.find(".list-body");
            $.each(data.notifications, function(index, element){
                var newNotification = template.render("notification-"+ element.kind +"-template");
                _listContent.prepend(newNotification);
            });
        });
    },
    // notifications 查询功能
    selectNotificationInit: function(){
        Share.selectNotification();
        setInterval(Share.selectNotification, 30000);
    },
    // 点击显示消息列表
    checkNotification: function(ele){
        var _this = $(ele);
        if ( _this.data("switch") ) {
            Share.notificationListPackUp();
        } else {
            var _parent = $(".notification-list");
            _parent.css("display", "block");
            _parent.find(".list-body, .list-foot").css("display", "block");
            _parent.find(".list-body").animate({"max-height": 230}, 800);
            _this.data("switch", true);
        }
    },
    // 列表右边用于清除用的按钮
    clearNotificationListCloseButton: function(ele){
        var _parent = $(ele).closest(".list-content");
        _parent.slideUp(500);
        setTimeout(function(){
            _parent.remove();
            if ( $(".notification-list .list-content").length == 0 ) {
                var _listContent = $(".notification-list .list-body");
                var newNotification = template.render("notification-empty-template");
                _listContent.prepend(newNotification);
            }
        }, 500)
    },
    // 收起按钮要用到的方法
    notificationListPackUp: function(ele){
        var _parent = $(".notification-list");
        _parent.find(".list-body").animate({"max-height": 0}, 800);
        setTimeout(function(){ _parent.find(".list-body, .list-foot").css("display", "none") },1000);
        $(".notification-box a.check-notification-link").data("switch", false);
    }
};


$(document).ready(function(){
    $(".dashboard .sidebar-tag").on('click', Share.sidebarTagLink);
    $(".dashboard .sidebar-tag").on('click', Share.sidebarTagButton);
    $(".menu .nav-tag").on('click', Share.sidebarTagLink);
    $('.sign-in-link, .sign-up-link, .sign-out-link').on('click', Share.clearNewShareLink);
    $('.article, .article .comment-link').on('click', Share.commentLink);
    $('.article .article-like').on("click", Share.favouriteLink);
    $(".title-box .sort-link").on("click", Share.articleSort);
    Share.articleFavouriteInit();
    Share.selectNotificationInit();
});
