"""
Profile routes blueprint for the AI Tour Guide Matcher API.
Contains guide profile endpoints for retrieving guide information and profiles.
"""

from flask import Blueprint, jsonify

# Create blueprint for profile routes
profile_bp = Blueprint('profile', __name__)


@profile_bp.route('/guides/<int:guide_id>', methods=['GET'])
def get_guide_profile(guide_id):
    """
    Get guide profile endpoint for the AI Tour Guide Matcher platform.
    
    Retrieves detailed information about a specific tour guide including
    their biography, specialties, rating, and other profile details.
    
    Args:
        guide_id (int): The unique identifier for the guide
        
    Returns:
        200: Guide profile data successfully retrieved
        404: Guide not found (future implementation)
        500: Server error retrieving guide profile
    """
    try:
        # For now, ignore guide_id and return hardcoded dummy data
        # This will be replaced with database lookup in future implementation
        
        guide_profile = {
            'id': guide_id,
            'name': '田中 美穂',
            'name_romaji': 'Tanaka Miho',
            'bio': '東京生まれ、東京育ちのプロフェッショナル観光ガイドです。10年以上の経験を持ち、日本の伝統文化と現代文化の両方に深い知識を持っています。特に浅草、銀座、渋谷エリアでの案内を得意としており、食文化と伝統工芸品に関する豊富な知識をお客様に提供いたします。英語と中国語での案内も可能で、海外からのお客様にも心温まるサービスをお届けします。',
            'specialties': [
                '伝統文化ツアー',
                '食べ歩きツアー',
                '現代文化体験',
                '寺院・神社巡り',
                '地元グルメ案内',
                '伝統工芸品ショッピング'
            ],
            'rating': 4.8,
            'total_reviews': 127,
            'years_experience': 12,
            'languages': ['日本語', 'English', '中文'],
            'areas_covered': [
                '浅草・上野',
                '銀座・築地',
                '渋谷・原宿',
                '新宿・歌舞伎町',
                '東京駅・皇居周辺'
            ],
            'tour_types': [
                'cultural',
                'food',
                'shopping',
                'traditional',
                'modern'
            ],
            'availability_status': 'available',
            'profile_image_url': '/images/guides/tanaka_miho.jpg',
            'verified': True,
            'joined_date': '2022-03-15',
            'contact_info': {
                'response_time': '平均2時間以内',
                'booking_advance_notice': '24時間前まで'
            },
            'pricing': {
                'half_day': 15000,
                'full_day': 25000,
                'currency': 'JPY'
            },
            'recent_reviews': [
                {
                    'rating': 5,
                    'comment': '素晴らしいガイドでした！とても親切で、日本文化について多くを学びました。',
                    'date': '2024-08-20',
                    'reviewer': 'Mike S.'
                },
                {
                    'rating': 5,
                    'comment': '美穂さんは最高のガイドです。食べ物の知識が豊富で、隠れた名店を教えてくれました。',
                    'date': '2024-08-18',
                    'reviewer': 'Sarah L.'
                }
            ]
        }
        
        return jsonify({
            'success': True,
            'message': 'Guide profile retrieved successfully',
            'data': guide_profile
        }), 200
        
    except Exception as e:
        # Log error in production environment
        # For now, return generic error message
        return jsonify({
            'success': False,
            'error': 'Failed to retrieve guide profile',
            'message': 'An unexpected error occurred while retrieving the guide profile'
        }), 500


@profile_bp.errorhandler(404)
def not_found(error):
    """
    Handle 404 errors for the profile blueprint.
    
    Args:
        error: The 404 error object
        
    Returns:
        JSON response with error details
    """
    return jsonify({
        'success': False,
        'error': 'Not Found',
        'message': 'The requested guide profile does not exist',
        'status_code': 404
    }), 404


@profile_bp.errorhandler(500)
def internal_error(error):
    """
    Handle 500 errors for the profile blueprint.
    
    Args:
        error: The 500 error object
        
    Returns:
        JSON response with error details
    """
    return jsonify({
        'success': False,
        'error': 'Internal Server Error',
        'message': 'An unexpected error occurred while processing the request',
        'status_code': 500
    }), 500