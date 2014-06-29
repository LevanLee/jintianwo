class CreateShares < ActiveRecord::Migration
  def change
    create_table :shares do |t|
      t.integer :user_id
      t.string :content
      t.references :category, index: true
      t.text :favourite_user
      t.text :liked
      t.integer :like_count, default: 0
      t.text :deserved
      t.integer :deserve_count, default: 0

      t.timestamps
    end
  end
end
