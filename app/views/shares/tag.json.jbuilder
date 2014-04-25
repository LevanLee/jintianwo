json.array! @shares do |share|
  json.extract! share, :id, :content, :category_id
  json.set! :status, true
  json.set! :created_at, share.created_at.strftime("%Y/%m/%d at %H:%M %P")
  json.set! :username, share.user.username
  json.set! :comments_size, share.comments.size
  json.set! :like_count, share.like.size
  if current_user
    json.set! :liked, share.favourite_user.include?(current_user.id) ? true : false
  else
    json.set! :liked, false
  end

  if !current_user || ( current_user && !share.like.include?(current_user.id) )
    json.set! :like_link_content, '<a href="javascript:void(0);" onclick="return Share.likeLink(this)">赞~</a>'
  else
    json.set! :like_link_content, '<a href="javascript:void(0);" onclick="return Share.cancelLikeLink(this)">取消赞~</a>'
  end
end
