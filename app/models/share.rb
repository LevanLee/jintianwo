class Share < ActiveRecord::Base
  belongs_to :category
  belongs_to :user
  has_many :comments

  validates_presence_of :content, :category_id
end
