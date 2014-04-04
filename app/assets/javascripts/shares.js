window.Share = {
    submitFrom : function(ele){
        var content = $('#'+ele).find("#share_content").val();
        var share_category_id = $('#'+ele).find("#share_category_id").val();
        $.post("/shares", {share: { content: content, category_id: share_category_id }}, function(data){
            var newArticle = $(template.render("article-template", data));
            $("#content .wrapper").prepend( newArticle );
            // 时间绑定
            newArticle.on("mouseenter",function(event){
              $(this).find('.more').css('display', 'block');
            });
            newArticle.on("mouseleave",function(event){
              $(this).find('.more').css('display', 'none');
            });

            newArticle.css('display', 'none');
            newArticle.fadeIn(2000);
            $("#background #operation").empty();
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
                // 时间绑定
                newArticle.on("mouseenter",function(event){
                  $(this).find('.article-like').css('display', 'block');
                });
                newArticle.on("mouseleave",function(event){
                  $(this).find('.article-like').css('display', 'none');
                });

                newArticle.css('display', 'none');
                newArticle.fadeIn(800);
            });
            $('.article .comment-link').on('click', Share.commentLink);
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
        var _this = $(this);
        var currentScrollTop = $(document).scrollTop();
        event.preventDefault();
        if( _this.data('switch') ){
            _this.data('switch', false);
            _this.parent().find('.comment-content').slideUp();
            _this.parent().find('.comment-content').empty();
        } else {
            _this.data('switch', true);
            $.get('/shares/comment',function(data){
                var newTemp = template.compile(data);
                //var newTemp = $(data);
                //console.log(template.compile(data));
                _this.parent().find('.comment-content').append(newTemp);
                _this.parent().find('.comment-content').slideDown("slow");
            });
        }
    }

};
$(document).ready(function(){
    $(".dashboard .sidebar-tag").on('click', Share.sidebarTagLink);
    $(".dashboard .sidebar-tag").on('click', Share.sidebarTagButton);
    $(".menu .nav-tag").on('click', Share.sidebarTagLink);
    $('.sign-in-link, .sign-up-link, .sign-out-link').on('click', Share.clearNewShareLink);
    $('.article .comment-link').on('click', Share.commentLink);
});
