class UsersController < ApplicationController
  def user_info
    num = 5
    @page_count = (Share.all.size / num.to_f).ceil
    offset = (params[:page].to_i - 1) * num
    @shares_page = Share.offset(offset).limit(num).order("created_at desc")
    user_info = render_to_string(:partial => "user_info", :formats => :html)
    render :json => { status: true, user_info: user_info}
  end
end
