class CreateNotifications < ActiveRecord::Migration
  def change
    create_table :notifications do |t|
      t.string  :kind
      t.integer :receive_user_id
      t.string  :receive_user
      t.string  :send_user
      t.integer :content
      t.boolean :status, :default => false

      t.timestamps
    end

    add_index :notifications, :receive_user_id
  end
end
