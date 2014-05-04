class UsersController < ApplicationController
  def user_info
    render :json => { status: true, content: render_to_string(:partial => "user_info", :formats => :html) }
  end
end
