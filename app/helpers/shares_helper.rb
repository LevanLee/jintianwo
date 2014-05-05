module SharesHelper
  def like_link(share)
    ## 没有登录或者已经登录而没有点过赞
    if !current_user || ( current_user && !share.liked.include?(current_user.id) )
      link_to "赞~", "javascript:void(0);", onclick: "return Share.likeLink(this)", "data-liked" => true
    else
      link_to "取消赞~", "javascript:void(0);", onclick: "return Share.cancelLikeLink(this)", "data-liked" => false
    end
  end

  def deserve_link(share)
    ## 没有登录或者已经登录而没有点过赞
    if !current_user || ( current_user && !share.deserved.include?(current_user.id) )
      link_to "你活该~", "javascript:void(0);", onclick: "return Share.deserveLink(this)", "data-deserved" => true
    else
      link_to "取消~", "javascript:void(0);", onclick: "return Share.cancelDeserveLink(this)", "data-deserved" => false
    end
  end

  def show_username_helper
    if user_signed_in?
      content_tag(:div, current_user.username, :class => "item user-name")
    else
      nil
    end
  end

  def paging
    current_page = params[:page].to_i
    if @page_count <= 5
      first_num = 1
      last_num = @page_count
    else
      if (current_page - 2) <= 1
        first_num = 1
      elsif (current_page + 2) > @page_count
        first_num = @page_count - 5 + 1
      else
        first_num = current_page - 2
      end
      last_num = first_num + 5 - 1
    end

    link = ""

    link << ( link_to "首页", users_user_info_path(:page => 1), "onclick" => "return Share.pageLink(this)", "data-page" => 1 )
    (first_num..last_num).each do |i|
      if i == current_page
        link << ( link_to i, users_user_info_path(:page => i), :class => "current_page", "onclick" => "return Share.pageLink(this)", "data-page" => i )
      else
        link << ( link_to i, users_user_info_path(:page => i), "onclick" => "return Share.pageLink(this)", "data-page" => i )
      end
    end
    link << ( link_to "末页", users_user_info_path(:page => @page_count), "onclick" => "return Share.pageLink(this)", "data-page" => @page_count )
    raw link
  end
end
