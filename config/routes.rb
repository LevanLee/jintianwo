Jintianwo::Application.routes.draw do
  resources :comments

  devise_for :users, :controllers => { sessions: 'sessions', registrations: 'registrations' }
  resources :categories
  resources :shares do
    get 'tag', on: :collection
    get 'favourite', on: :collection
    get 'comment', on: :collection
    get 'like',    on: :collection
    get 'cancel_like',    on: :collection
    get 'deserve', on: :collection
    get 'cancel_deserve',    on: :collection
    get 'article_sort',    on: :collection
    get 'notification',    on: :collection
    get 'clear_notification',    on: :collection
    get 'article_paging',    on: :collection
  end
  get "users/user_info"

  get "/jtw/admin" => redirect("/admin/shares")

  namespace :admin do
    resources :shares do
      get 'list_user', on: :collection
    end
    resources :sessions do
      get 'random', on: :collection
    end
  end
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  root 'shares#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
