window.Share = {
    submitFrom : function(ele){
        var content = $('#'+ele).find("#share_content").val();
        var share_category_id = $(ele).find("#share_category_id").val();
        $.post("/shares", {share: { content: content, category_id: share_category_id }}, function(data){
            var newArticle = $(template.render("article-template", data));
            $("#content .wrapper").prepend( newArticle );
            newArticle.css('display', 'none');
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

    $(".dashboard .sidebar-tag").on('click', function(){
        var _this = $(this);
        var categoryId = _this.data('id');
        $.getJSON('/shares/tag', {category: categoryId}, function(data){
            $("#content .wrapper").empty();
            $(data).each(function(index, element){
                var newArticle = $(template.render("article-template", element));
                $("#content .wrapper").append(newArticle);
                newArticle.css('display', 'none');
                newArticle.fadeIn(800);
            });
        })
    });
});
