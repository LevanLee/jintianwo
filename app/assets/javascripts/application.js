// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require semantic-ui
//= require_tree .

// $(document).ready(function(){
// 	$('.ui.dropdown').dropdown({
// 		on:'hover',
// 		action:'hide'
// 	});
// });
window.Sign = {
    signInLink: function(event){
        event.preventDefault();
        // 除了 share 发布框，其他的都删掉
        Tool.clearWithoutNewShare();
        var newShareTemplate = $(template.render("sign-in-template"));
        $("#background #operation").append(newShareTemplate);
        // 提交验证
        $("form#new_user").on("ajax:before", function(){
            if(Share.formFieldBorderAuth( "#new_user #user_username", "#new_user #user_username")){ return false; };
            if(Share.formFieldBorderAuth( "#new_user #user_password", "#new_user #user_password")){ return false; };
        });
        $("form#new_user").bind("ajax:success", function(e, data, status, xhr){
            if(data.success){
                Tool.clearWithoutNewShare();
                $(".topbar .sign-status").before("<div class='item user-name' style='cursor: pointer;' onclick='return Share.showUserInfo()' >"+ data.user.username +"</div>");
                $(".sign-status").empty().append(data.sign_success_template);
                $('.sign-status .sign-out-link').on('click', Sign.signOutLink);
                Sign.signInArticleReset();
                // 通知 notification switch
                Share.notificationSwitch = true;
                $(".notification-box").css("display", "inline-block");
                Share.selectNotification();
            }
            else{
                console.log(data);
            }
        });
    },
    signUpLink: function(event){
        event.preventDefault();
        // 除了 share 发布框，其他的都删掉
        Tool.clearWithoutNewShare();
        var newShareTemplate = $(template.render("sign-up-template"));
        $("#background #operation").append(newShareTemplate);
        // 提交验证
        $("form#new_user").on("ajax:before", function(){
            if(Share.formFieldBorderAuth( "#new_user #user_username", "#new_user #user_username")){ return false; };
            if(Share.formFieldBorderAuth( "#new_user #user_email", "#new_user #user_email")){ return false; };
            if(Share.formFieldBorderAuth( "#new_user #user_password", "#new_user #user_password")){ return false; };
            if(Share.formFieldBorderAuth( "#new_user #user_password_confirmation", "#new_user #user_password_confirmation")){ return false; };
        });
        $("form#new_user").bind("ajax:success", function(e, data, status, xhr){
            if(data.success){
                Tool.clearWithoutNewShare();
                $(".topbar .sign-status").before("<div class='item user-name' style='cursor: pointer;' onclick='return Share.showUserInfo()' >"+ data.user.username +"</div>");
                $(".sign-status").empty().append(template.render("sign-success-template"));
                $('.sign-status .sign-out-link').on('click', Sign.signOutLink);
                Sign.signInArticleReset();
                // 通知 notification switch
                Share.notificationSwitch = true;
                $(".notification-box").css("display", "inline-block");
                Share.selectNotification();
            }
            else{
                console.log(data);
            }
        });
    },
    signOutLink: function(event){
        event.preventDefault();
        $.ajax({url: '/users/sign_out', type: 'DELETE', success: function(data, result, xhr){
            if(xhr.status == 204){
                $(".topbar .user-name").remove();
                $(".sign-status").empty().append(template.render("sign-out-success-template"));
                $('.sign-status .sign-in-link').on('click', Sign.signInLink);
                $('.sign-status .sign-up-link').on('click', Sign.signUpLink);
                Sign.signOutArticleReset();
                // 通知 notification switch
                Share.notificationSwitch = false;
                $(".notification-box").css("display", "none");
            }
        }});
    },
    isTouchDevice: function(){
        var deviceAgent = navigator.userAgent.toLowerCase();

        var isTouchDevice =  deviceAgent.match(/(iphone|ipod|ipad)/) ||
            deviceAgent.match(/(android)/)||
            deviceAgent.match(/(iemobile)/) ||
            deviceAgent.match(/iphone/i) ||
            deviceAgent.match(/ipad/i) ||
            deviceAgent.match(/ipod/i) ||
            deviceAgent.match(/blackberry/i) ||
            deviceAgent.match(/bada/i);
        return isTouchDevice;
    },
    articleEventBind: function(element){
        $(element).on("mouseenter",function(event){
            $(this).find('.article-like').css('display', 'block');
        });
        $(element).on("mouseleave",function(event){
            $(this).find('.article-like').css('display', 'none');
        });
    },
    signInArticleReset: function(){
        var categoryId = null;
        var tagType    = null;
        if ( $(".sidebar-tag.green").length > 0 ) {
            categoryId = $(".sidebar-tag.green").data('id');
            tagType    = $(".sidebar-tag.green").data('type');
        } else {
            categoryId = 0;
            tagType    = 'all';
        }
        $.getJSON('/shares/tag', {tag_type: tagType, category: categoryId}, function(data){
            var articles_json = JSON.parse(data.articles);
            $("#content .wrapper").empty();
            $(articles_json).each(function(index, element){
                var newArticle = $(template.render("article-template", element));
                $("#content .wrapper").append(newArticle);
                if (!Sign.isTouchDevice() ){ Sign.articleEventBind(newArticle); }

                newArticle.css('display', 'none');
                newArticle.fadeIn(800);
            });
            $('.article, .article .comment-link').on('click', Share.commentLink);
            Share.articleFavouriteInit();
            $('.article .article-like').on("click", Share.favouriteLink);
        });
    },
    signOutArticleReset: function(){
        $(".article").each(function(index, element){
            $(element).find('.article-like i').css('color', 'black');
            $(element).find('.article-like').css('display', 'none');
            // 将被点过 赞 的连接初始化
            if ( !$(element).find("#voteidnumber a").data("liked") ){
                $(element).find("#voteidnumber a").text("赞~");
                $(element).find("#voteidnumber a").attr("onclick", "return Share.likeLink(this)");
            }
            // 将被点过 你活该 的连接初始化
            if ( !$(element).find("#votebfidnumber a").data("deserved") ){
                $(element).find("#votebfidnumber a").text("你活该~");
                $(element).find("#votebfidnumber a").attr("onclick", "return Share.deserveLink(this)");
            }
            // 将被点过 收藏 的连接初始化
            if ( $(element).data("favourited") ) {
                $(element).on("mouseenter",function(event){
                    $(this).find('.article-like').css('display', 'block');
                });
                $(element).on("mouseleave",function(event){
                    $(this).find('.article-like').css('display', 'none');
                });
            }
        });
    }
};

$(document).ready(function(){
    $('.sign-status .sign-in-link').on('click', Sign.signInLink);
    $('.sign-status .sign-up-link').on('click', Sign.signUpLink);
    $('.sign-status .sign-out-link').on('click', Sign.signOutLink);
    $(".item .new-share-link").on('click', Share.newShareLink);
    $(".mark h1").on('click', Share.newShareLink);
    if (!Sign.isTouchDevice() ){
        $(".article").each(function(index,element){
            if( !$(element).data('favourited') )
                Sign.articleEventBind(element);
        });
    }
});

template.openTag = "<?";
template.closeTag = "?>";
