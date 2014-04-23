class CreateShares < ActiveRecord::Migration
  def change
    create_table :shares do |t|
      t.integer :user_id
      t.string :content
      t.references :category, index: true
      t.text :favourite_user
      t.text :like
      t.text :deserve

      t.timestamps
    end
  end
end
