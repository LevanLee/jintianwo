json.array!(@shares) do |share|
  json.extract! share, :id, :content, :category_id
  json.url share_url(share, format: :json)
end
