class Admin::SharesController < ApplicationController
  include Auth
  before_filter :admin_validation
  layout "admin"

  def index
    @shares = Share.paginate(:page => params[:page], :per_page => 30)
    @categories = Category.all.map{|cate| [cate.name, cate.id] }
  end

  def create
    @share = Share.new(params.require(:share).permit!)
    #params.require(:comment_share).permit(:share_id)
    @share.save
    render layout: false
  end

  def list_user
    @users = User.paginate(:page => params[:page], :per_page => 30)
  end
end
