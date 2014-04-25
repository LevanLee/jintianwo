module SharesHelper
  def like_link(share)
    ## 没有登录或者已经登录而没有点过赞
    if !current_user || ( current_user && !share.like.include?(current_user.id) )
      link_to "赞~", "javascript:void(0);", onclick: "return Share.likeLink(this)", "data-liked" => true
    else
      link_to "取消赞~", "javascript:void(0);", onclick: "return Share.cancelLikeLink(this)", "data-liked" => false
    end
  end

end
