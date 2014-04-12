class Admin::SessionsController < ApplicationController
  include Auth
  before_filter :admin_validation
  def random
    user = User.all.sample
    render json: {status: true, user: user}
  end
end
