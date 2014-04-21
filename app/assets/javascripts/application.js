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
        var newShareTemplate = $(template.render("sign-in-template"));
        $("#background #operation").empty().append(newShareTemplate);
        // 提交验证
        $("form#new_user").on("ajax:before", function(){
            if(Share.formFieldBorderAuth( "#new_user #user_username", "#new_user #user_username")){ return false; };
            if(Share.formFieldBorderAuth( "#new_user #user_password", "#new_user #user_password")){ return false; };
        });
        $("form#new_user").bind("ajax:success", function(e, data, status, xhr){
            if(data.success){
                $("#background #operation").empty();
                $(".sign-status").empty().append(template.render("sign-success-template"));
                $('.sign-status .sign-out-link').on('click', Sign.signOutLink);
            }
            else{
                console.log(data);
            }
        });
    },
    signUpLink: function(event){
        event.preventDefault();
        var newShareTemplate = $(template.render("sign-up-template"));
        $("#background #operation").empty().append(newShareTemplate);
        // 提交验证
        $("form#new_user").on("ajax:before", function(){
            if(Share.formFieldBorderAuth( "#new_user #user_username", "#new_user #user_username")){ return false; };
            if(Share.formFieldBorderAuth( "#new_user #user_email", "#new_user #user_email")){ return false; };
            if(Share.formFieldBorderAuth( "#new_user #user_password", "#new_user #user_password")){ return false; };
            if(Share.formFieldBorderAuth( "#new_user #user_password_confirmation", "#new_user #user_password_confirmation")){ return false; };
        });
        $("form#new_user").bind("ajax:success", function(e, data, status, xhr){
            if(data.success){
                $("#background #operation").empty();
                $(".sign-status").empty().append(template.render("sign-success-template"));
                $('.sign-status .sign-out-link').on('click', Sign.signOutLink);
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
                $(".sign-status").empty().append(template.render("sign-out-success-template"));
                $('.sign-status .sign-in-link').on('click', Sign.signInLink);
                $('.sign-status .sign-up-link').on('click', Sign.signUpLink);
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
    }
};

$(document).ready(function(){
    $('.sign-status .sign-in-link').on('click', Sign.signInLink);
    $('.sign-status .sign-up-link').on('click', Sign.signUpLink);
    $('.sign-status .sign-out-link').on('click', Sign.signOutLink);
    $(".item .new-share-link").on('click', Share.newShareLink);
    if (!Sign.isTouchDevice() ){
        $(".article[data-liked='false']").each(function(index,element){
            Sign.articleEventBind(element);
        });
    }
});

template.openTag = "<?";
template.closeTag = "?>";
