window.Tool = {
    clearWithoutNewShare: function(){
        // 除了 share 发布框，其他的都删掉
        $("#background #operation > *").each(function(index, element){
            if ( $(element).attr("id") != "new_share" ){
                $(element).remove();
            }
        });
    }
}
