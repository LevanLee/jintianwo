class Admin::SessionsController < ApplicationController
  def random
    user = User.all.sample
    render json: {status: true, user: user}
  end
end
