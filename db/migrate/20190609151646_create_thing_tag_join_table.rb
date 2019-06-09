class CreateThingTagJoinTable < ActiveRecord::Migration
  def change
    create_join_table :things, :tags do |t|
      t.index [:tag_id, :thing_id], unique: true
    end
  end
end
