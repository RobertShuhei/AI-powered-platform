from flask import Blueprint, jsonify
from app.models import Guide


guides_bp = Blueprint('guides', __name__)


@guides_bp.get('/guides')
def list_guides():
    """Return all guide profiles as JSON.

    For MVP, this endpoint returns all guides without filters.
    """
    guides = Guide.query.all()
    return jsonify([g.to_dict() for g in guides]), 200

