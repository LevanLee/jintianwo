# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

categories = Category.create([{ name: '爱情'}, { name: '动物'}, { name: '金钱'}, { name: '孩子'}, { name: '工作'}, { name: '健康'}, { name: 'XXOO'}, { name: '杂项'}])
user0 = User.create!(username: "Levan", 
					name: "Li Fan", 
					gender: "man", 
					email: "levanlifan@gmail.com", 
					password: "asdfasdf")

p user0