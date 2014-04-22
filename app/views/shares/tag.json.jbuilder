json.array! @shares do |share|
  json.extract! share, :id, :content, :category_id
  json.set! :status, true
  json.set! :created_at, share.created_at.strftime("%Y/%m/%d at %H:%M %P")
  json.set! :username, share.user.username
  json.set! :comments_size, share.comments.size
  if current_user
    json.set! :liked, share.favourite_user.include?(current_user.id) ? true : false
  else
    json.set! :liked, false
  end
end
