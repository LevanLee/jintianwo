window.Share = {
    submitFrom : function(ele){
        var content = $('#'+ele).find("#share_content").val();
        var share_category_id = $(ele).find("#share_category_id").val();
        $.post("/shares", {share: { content: content, category_id: share_category_id }}, function(data){
            console.log(data);
            var newArticle = $(template.render("article-template"));
            $("#content .wrapper").prepend( newArticle );
            newArticle.fadeIn(2000);
        });
    }
};
$(document).ready(function(){
    $(".item .new-share-link").on('click', function(event){
        event.preventDefault();
        var newShareTemplate = $(template.render("new-share-template"));
        $("#background #operation").empty().append(newShareTemplate);
    });
});
