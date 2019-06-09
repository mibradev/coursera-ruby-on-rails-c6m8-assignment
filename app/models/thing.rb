class Thing < ActiveRecord::Base
  include Protectable
  validates :name, :presence=>true

  has_many :thing_images, inverse_of: :thing, dependent: :destroy
  has_and_belongs_to_many :tags

  scope :not_linked, ->(image) { where.not(:id=>ThingImage.select(:thing_id)
                                                          .where(:image=>image)) }

  def self.tagged(tag)
    joins("join tags_things on things.id = tags_things.thing_id")
    .joins("join tags on tags.id = tags_things.tag_id")
    .where("tags.name = ?", tag)
  end
end
