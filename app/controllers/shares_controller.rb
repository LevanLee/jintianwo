class SharesController < ApplicationController
  before_action :set_share, only: [:show, :edit, :update, :destroy]
  skip_before_action :verify_authenticity_token

  # GET /shares
  # GET /shares.json
  def index
    @shares = Share.all.order('id desc')
    @categories = Category.all
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
      @shares = Share.all.order("id desc")
    when "alone"
      @shares = Share.where(category_id: params[:category]).order('created_at desc')
    end
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
      render :json => { status: true, share: @share, liked: @share.favourite_user.include?(current_user.id) }
    else
      render :json => { status: false, share: @share }
    end
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
