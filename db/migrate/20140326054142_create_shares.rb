class CreateShares < ActiveRecord::Migration
  def change
    create_table :shares do |t|
      t.string :content
      t.references :category, index: true

      t.timestamps
    end
  end
end
