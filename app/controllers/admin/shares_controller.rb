class Admin::SharesController < ApplicationController
  include Auth
  before_filter :admin_validation
  layout "admin"

  def index
    @shares = Share.includes(:user, :comments).paginate(:page => params[:page], :per_page => 30)
    @categories = Category.all.map{|cate| [cate.name, cate.id] }
  end

  def create
    @share = Share.new(params.require(:share).permit!)
    #params.require(:comment_share).permit(:share_id)
    @share.save
    share_template = render_to_string(partial: "article", object: @share, as: :share)
    form_template  = render_to_string(partial: "form")
    render :json => {share_template: share_template, form_template: form_template}
  end

  def list_user
    @users = User.paginate(:page => params[:page], :per_page => 30)
  end
end
