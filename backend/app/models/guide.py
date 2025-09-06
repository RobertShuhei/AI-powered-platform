from app import db
from sqlalchemy.orm import relationship
from .user import User


class Guide(User):
    """
    Guide profile model using joined-table inheritance from User.

    Uses the same primary key as User (one-to-one), stored as a
    foreign key referencing users.id.
    """

    __tablename__ = 'guides'

    # Primary key is also a foreign key to users.id to enforce 1:1
    id = db.Column(db.String(36), db.ForeignKey('users.id'), primary_key=True)

    # Profile fields
    name_romanized = db.Column(db.String(120), nullable=True)
    bio = db.Column(db.String(1000), nullable=True)  # Short bio (e.g., Japanese)
    specialties = db.Column(db.String(255), nullable=True)  # comma-separated
    rating = db.Column(db.Float, nullable=True)
    languages = db.Column(db.String(255), nullable=True)  # comma-separated
    areas = db.Column(db.String(255), nullable=True)  # comma-separated
    price_range = db.Column(db.String(50), nullable=True)

    # Relationship back to the base User row
    user = relationship('User', back_populates='guide', uselist=False)

    def to_dict(self):
        base = super().to_dict()
        base.update({
            'name_romanized': self.name_romanized,
            'bio': self.bio,
            'specialties': self.specialties,
            'rating': self.rating,
            'languages': self.languages,
            'areas': self.areas,
            'price_range': self.price_range,
        })
        return base

    def __repr__(self):
        return f'<Guide {self.id}>'
