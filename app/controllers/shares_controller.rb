class SharesController < ApplicationController
  before_action :set_share, only: [:show, :edit, :update, :destroy]
  skip_before_action :verify_authenticity_token

  # GET /shares
  # GET /shares.json
  def index
    @shares = Share.limit(20).order('id desc')
    @categories = Category.all
    @favourite_users = {}
    @shares.map do |share|
      @favourite_users[share.id] = share.favourite_user.include?(current_user) ? true : false
    end
  end

  def comment
    @comments = Comment.where(:share_id => share_comment_params[:share_id])
    render layout: false
  end

  # GET /shares/1
  # GET /shares/1.json
  def show
  end

  # GET /shares/new
  def new
    @share = Share.new
  end

  # GET /shares/1/edit
  def edit
  end

  # POST /shares
  # POST /shares.json
  def create
    @share = Share.new(share_params)
    @share.user_id = current_user.id if current_user

    respond_to do |format|
      if current_user && @share.save
        format.json { render action: 'show', status: :created, location: @share }
      else
        format.json { render json: {status: false, share: @share} }
      end
    end
  end

  # PATCH/PUT /shares/1
  # PATCH/PUT /shares/1.json
  def update
    respond_to do |format|
      if @share.update(share_params)
        format.html { redirect_to @share, notice: 'Share was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @share.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /shares/1
  # DELETE /shares/1.json
  def destroy
    @share.destroy
    respond_to do |format|
      format.html { redirect_to shares_url }
      format.json { head :no_content }
    end
  end

  def tag
    case params[:tag_type]
    when "all"
      @shares_count = Share.all.size
      @shares = Share.order("id desc").limit(20)
    when "alone"
      @shares_count = Share.where(category_id: params[:category]).size
      @shares = Share.where(category_id: params[:category]).order('created_at desc').limit(20)
    end

    articles_json = render_to_string( action: :tag)
    shares_pageaction_element = render_to_string(:partial => "shares/article_paging")
    render :json => { :articles => articles_json, :shares_pageaction_element => shares_pageaction_element }
  end

  def favourite
    case params[:favourite_type]
    when "favourite"
      @share = Share.find(params[:share_id])
      @share.favourite_user.push(current_user.id) if current_user
    when "unfavourite"
      @share = Share.find(params[:share_id])
      @share.favourite_user.delete(current_user.id) if current_user
    end

    if current_user && @share.save
      render :json => { status: true, share: @share, favourited: @share.favourite_user.include?(current_user.id) }
    else
      render :json => { status: false, share: @share }
    end
  end

  def like
    share = Share.find_by(id: params[:share_id])
    unless current_user
      return render :json => {status: 1}
    end
    share.liked.push current_user.id if current_user
    if share.save
      Share.increment_counter(:like_count, share.id)
      User.increment_counter(:like_count, current_user.id)
      receive_user = share.user
      ## TODO
      #if receive_user.username != current_user.username
        Notification.create( kind: "like", receive_user_id: receive_user.id, receive_user: receive_user.username, send_user: current_user.username )
      #end
      return render :json => {status: 0}
    end
  end

  def cancel_like
    share = Share.find_by(id: params[:share_id])
    unless current_user
      return render :json => {status: 1}
    end
    share.liked.delete current_user.id if current_user
    if share.save
      Share.decrement_counter(:like_count, share.id)
      return render :json => {status: 0}
    end
  end

  def deserve
    share = Share.find_by(id: params[:share_id])
    unless current_user
      return render :json => {status: 1}
    end
    share.deserved.push current_user.id if current_user
    if share.save
      Share.increment_counter(:deserve_count, share.id)
      User.increment_counter(:deserve_count, current_user.id)
      ## TODO
      receive_user = share.user
      #if receive_user.username != current_user.username
        Notification.create( kind: "deserve", receive_user_id: receive_user.id, receive_user: receive_user.username, send_user: current_user.username )
      #end
      return render :json => {status: 0}
    end
  end

  def cancel_deserve
    share = Share.find_by(id: params[:share_id])
    unless current_user
      return render :json => {status: 1}
    end
    share.deserved.delete current_user.id if current_user
    if share.save
      Share.decrement_counter(:deserve_count, share.id)
      return render :json => {status: 0}
    end
  end

  def article_sort
    shares = Share.order("id desc").limit(300).sample(30)
    case params[:sort_type]
    when "like"
      @shares = shares.sort{|a,b| b.liked.size <=> a.liked.size }
    when "deserve"
      @shares = shares.sort{|a,b| b.deserved.size <=> a.deserved.size }
    end
    @shares_count = Share.all.size

    articles_json = render_to_string( action: :tag)
    shares_pageaction_element = render_to_string(:partial => "shares/article_paging")
    render :json => { :articles => articles_json, :shares_pageaction_element => shares_pageaction_element }
  end

  def notification
    if user_signed_in?
      @notifications = Notification.where(:receive_user_id => current_user.id, :status => false)
      render "notification", object: @notifications, formats: :json
    else
      render :json => { status: false }
    end
  end

  def clear_notification
    notification = Notification.find_by(id: params[:notification_id])
    notification.update(status: true)
    notification_size = Notification.where(:receive_user_id => current_user.id, :status => false).size
    render :json => {:status => true, :notification_size => notification_size}
  end

  def article_paging
    num = 20
    offset = (params[:page].to_i - 1) * num
    @favourite_users = {}

    case params[:type]
    when "tag"
      if params[:categories].to_i == 0
        @shares_count = Share.all.size
        @shares_page = Share.order("created_at desc").offset(offset).limit(num)
      else
        @shares_count = Share.where(:category_id => params[:categories]).size
        @shares_page = Share.where(:category_id => params[:categories]).offset(offset).limit(num).order("created_at desc")
      end
    when "sort-link"
      if params[:sort_type] == "like"
        @shares_count = Share.all.size
        @shares_page = Share.order("like_count desc").offset(offset).limit(num)
      elsif params[:sort_type] == "deserve"
        @shares_count = Share.all.size
        @shares_page = Share.order("deserve_count desc").offset(offset).limit(num)
      end
    end
    @shares_page.map do |share|
      @favourite_users[share.id] = share.favourite_user.include?(current_user) ? true : false
    end
    shares_pageaction_element = render_to_string( :partial => "article_paging" )
    shares_page_string = render_to_string( :partial => "article", :collection => @shares_page, :as => :share )
    render :json => { shares_pageaction_element: shares_pageaction_element ,shares_content: shares_page_string }
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_share
      @share = Share.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def share_params
      params.require(:share).permit(:content, :category_id)
    end

    def share_comment_params
      params.require(:comment_share).permit(:share_id)
    end
end
