class Category < ActiveRecord::Base
	has_many :shares

	validates_uniqueness_of :name
end
