module SharesHelper
  def like_link(share)
    ## 没有登录或者已经登录而没有点过赞
    if !current_user || ( current_user && !share.liked.include?(current_user.id) )
      link_to "赞~", "javascript:void(0);", onclick: "return Share.likeLink(this)", "data-liked" => true
    else
      link_to "取消赞~", "javascript:void(0);", onclick: "return Share.cancelLikeLink(this)", "data-liked" => false
    end
  end

  def deserve_link(share)
    ## 没有登录或者已经登录而没有点过赞
    if !current_user || ( current_user && !share.deserved.include?(current_user.id) )
      link_to "你活该~", "javascript:void(0);", onclick: "return Share.deserveLink(this)", "data-deserved" => true
    else
      link_to "取消~", "javascript:void(0);", onclick: "return Share.cancelDeserveLink(this)", "data-deserved" => false
    end
  end
end
