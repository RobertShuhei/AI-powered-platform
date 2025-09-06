from flask import Blueprint, jsonify, request
from sqlalchemy import or_
from app.models import Guide


guides_bp = Blueprint('guides', __name__)


@guides_bp.get('/guides')
def list_guides():
    """Return guide profiles with optional filters.

    Query params:
      - languages: comma-separated string (e.g., 'ja,en')
      - areas: comma-separated string (e.g., 'tokyo,kyoto')
      - min_rating: float (e.g., '4.5')
    """
    query = Guide.query

    # Languages filter: match any token (case-insensitive, partial)
    languages_param = request.args.get('languages')
    if languages_param:
        tokens = [t.strip() for t in languages_param.split(',') if t.strip()]
        if tokens:
            lang_conditions = [Guide.languages.ilike(f"%{t}%") for t in tokens]
            query = query.filter(or_(*lang_conditions))

    # Areas filter: match any token (case-insensitive, partial)
    areas_param = request.args.get('areas')
    if areas_param:
        tokens = [t.strip() for t in areas_param.split(',') if t.strip()]
        if tokens:
            area_conditions = [Guide.areas.ilike(f"%{t}%") for t in tokens]
            query = query.filter(or_(*area_conditions))

    # Minimum rating filter
    min_rating_param = request.args.get('min_rating')
    if min_rating_param:
        try:
            min_rating_val = float(min_rating_param)
            query = query.filter(Guide.rating >= min_rating_val)
        except ValueError:
            # Ignore invalid min_rating values
            pass

    guides = query.all()
    return jsonify([g.to_dict() for g in guides]), 200


@guides_bp.get('/guides/<string:guide_id>')
def get_guide(guide_id: str):
    """Return a single guide profile by ID.

    Uses Guide.query.get_or_404 to return 404 when not found.
    """
    guide = Guide.query.get_or_404(guide_id)
    return jsonify(guide.to_dict()), 200
