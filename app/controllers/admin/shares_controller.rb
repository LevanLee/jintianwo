class Admin::SharesController < ApplicationController
  layout "admin"

  def index
    @shares = Share.all
    @categories = Category.all.map{|cate| [cate.name, cate.id] }
  end

  def create
    @share = Share.new(params.require(:share).permit!)
    #params.require(:comment_share).permit(:share_id)
    @share.save
    render layout: false
  end
end
