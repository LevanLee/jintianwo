module SharesHelper
  def like_link(share)
    if current_user && !share.like.include?(current_user.id)
      link_to "赞~", "javascript:void(0);", onclick: "return Share.likeLink(this)"
    else
      link_to "取消赞~", "javascript:void(0);", onclick: "return Share.cancelLikeLink(this)"
    end
  end

end
