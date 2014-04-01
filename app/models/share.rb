class Share < ActiveRecord::Base
  belongs_to :category
  validates_presence_of :content, :category_id
end
