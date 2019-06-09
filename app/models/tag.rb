class Tag < ActiveRecord::Base
  has_and_belongs_to_many :things

  validates :name, presence: true
  validates :name, length: { maximum: 100 }
  validates :name, uniqueness: true
end
