class Share < ActiveRecord::Base
  belongs_to :category
  belongs_to :user
  has_many :comments

  serialize :favourite_user, Array
  serialize :like, Array
  serialize :deserve, Array

  validates_presence_of :content, :category_id
end
