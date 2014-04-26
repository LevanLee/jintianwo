class Share < ActiveRecord::Base
  belongs_to :category
  belongs_to :user
  has_many :comments

  serialize :favourite_user, Array
  serialize :liked, Array
  serialize :deserved, Array

  validates_presence_of :content, :category_id
end
