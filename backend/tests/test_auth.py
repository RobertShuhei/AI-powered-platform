"""
Test suite for authentication endpoints in the AI Tour Guide Matcher platform.

This module contains comprehensive tests for user registration functionality
using pytest framework with Flask test client and proper database isolation.
"""

import pytest
import json
from flask import Flask
from app import create_app, db
from app.models.user import User


@pytest.fixture
def app():
    """
    Create and configure a new Flask application instance for testing.

    Uses an in-memory SQLite database for fast, isolated testing.
    Sets up test-specific configuration that differs from production.

    Returns:
        Flask: Configured Flask application instance for testing
    """
    test_app = create_app()

    # Override configuration for testing
    test_app.config.update(
        {
            "TESTING": True,
            "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",  # In-memory database for speed
            "SQLALCHEMY_TRACK_MODIFICATIONS": False,
            "WTF_CSRF_ENABLED": False,  # Disable CSRF for testing
            "SECRET_KEY": "test-secret-key",
            "JWT_SECRET_KEY": "test-jwt-secret",
        }
    )

    return test_app


@pytest.fixture
def client(app):
    """
    Create a test client for the Flask application.

    Args:
        app: Flask application fixture

    Returns:
        FlaskClient: Test client for making HTTP requests
    """
    return app.test_client()


@pytest.fixture
def clean_db(app):
    """
    Provide a clean database for each test.

    Creates all database tables before test execution and drops them after.
    Ensures complete test isolation with fresh database state for each test.

    Args:
        app: Flask application fixture

    Yields:
        SQLAlchemy: Database instance ready for testing
    """
    with app.app_context():
        # Create all database tables
        db.create_all()

        # Yield control to the test
        yield db

        # Clean up after test completion
        db.session.remove()
        db.drop_all()


@pytest.fixture
def sample_user_data():
    """
    Provide sample user data for testing.

    Returns:
        dict: Valid user registration data
    """
    return {"email": "test@example.com", "password": "testpassword123"}


class TestUserRegistration:
    """Test class for user registration endpoint functionality."""

    def test_successful_registration(self, client, clean_db, sample_user_data):
        """
        Test successful user registration with valid data.

        Verifies that:
        - POST request with valid email/password returns status 201
        - Response contains success message and user data
        - User is actually created in database
        - Password is properly hashed (not stored as plain text)
        - Email is normalized to lowercase

        Args:
            client: Flask test client fixture
            clean_db: Clean database fixture
            sample_user_data: Sample user data fixture
        """
        # Make POST request to registration endpoint
        response = client.post(
            "/api/auth/register",
            data=json.dumps(sample_user_data),
            content_type="application/json",
        )

        # Assert successful response
        assert response.status_code == 201, f"Expected 201, got {response.status_code}"

        # Parse response data
        response_data = json.loads(response.data)

        # Verify response structure and content
        assert "message" in response_data, "Response should contain success message"
        assert "user" in response_data, "Response should contain user data"
        assert response_data["message"] == "User registered successfully"

        # Verify user data in response
        user_data = response_data["user"]
        assert "id" in user_data, "Response should contain user ID"
        assert "email" in user_data, "Response should contain user email"
        assert user_data["email"] == sample_user_data["email"].lower()

        # Verify user was actually created in database
        created_user = User.query.filter_by(
            email=sample_user_data["email"].lower()
        ).first()
        assert created_user is not None, "User should be created in database"
        assert created_user.email == sample_user_data["email"].lower()

        # Verify password was hashed (not stored as plain text)
        assert created_user.hashed_password != sample_user_data["password"]
        assert created_user.check_password(sample_user_data["password"]) is True

    def test_duplicate_email_registration(self, client, clean_db, sample_user_data):
        """
        Test registration attempt with already existing email.

        Verifies that:
        - First registration succeeds
        - Second registration with same email returns status 409
        - Error message indicates email already exists
        - Only one user exists in database

        Args:
            client: Flask test client fixture
            clean_db: Clean database fixture
            sample_user_data: Sample user data fixture
        """
        # First registration - should succeed
        first_response = client.post(
            "/api/auth/register",
            data=json.dumps(sample_user_data),
            content_type="application/json",
        )
        assert first_response.status_code == 201, "First registration should succeed"

        # Second registration with same email - should fail
        second_response = client.post(
            "/api/auth/register",
            data=json.dumps(sample_user_data),
            content_type="application/json",
        )

        # Assert conflict response
        assert (
            second_response.status_code == 409
        ), f"Expected 409, got {second_response.status_code}"

        # Parse error response
        response_data = json.loads(second_response.data)
        assert "error" in response_data, "Response should contain error message"
        assert "already exists" in response_data["error"].lower()

        # Verify only one user exists in database
        user_count = User.query.filter_by(
            email=sample_user_data["email"].lower()
        ).count()
        assert user_count == 1, "Only one user should exist with this email"

    def test_missing_password_registration(self, client, clean_db):
        """
        Test registration attempt without password field.

        Verifies that:
        - POST request without password returns status 400
        - Error message indicates missing required fields
        - No user is created in database

        Args:
            client: Flask test client fixture
            clean_db: Clean database fixture
        """
        # Registration data missing password
        incomplete_data = {
            "email": "test@example.com"
            # password field intentionally missing
        }

        # Make POST request with incomplete data
        response = client.post(
            "/api/auth/register",
            data=json.dumps(incomplete_data),
            content_type="application/json",
        )

        # Assert bad request response
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"

        # Parse error response
        response_data = json.loads(response.data)
        assert "error" in response_data, "Response should contain error message"
        assert "required" in response_data["error"].lower()

        # Verify no user was created in database
        user_count = User.query.count()
        assert user_count == 0, "No user should be created with incomplete data"

    def test_missing_email_registration(self, client, clean_db):
        """
        Test registration attempt without email field.

        Verifies that:
        - POST request without email returns status 400
        - Error message indicates missing required fields
        - No user is created in database

        Args:
            client: Flask test client fixture
            clean_db: Clean database fixture
        """
        # Registration data missing email
        incomplete_data = {
            "password": "testpassword123"
            # email field intentionally missing
        }

        # Make POST request with incomplete data
        response = client.post(
            "/api/auth/register",
            data=json.dumps(incomplete_data),
            content_type="application/json",
        )

        # Assert bad request response
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"

        # Parse error response
        response_data = json.loads(response.data)
        assert "error" in response_data, "Response should contain error message"
        assert "required" in response_data["error"].lower()

        # Verify no user was created in database
        user_count = User.query.count()
        assert user_count == 0, "No user should be created with incomplete data"

    def test_empty_json_registration(self, client, clean_db):
        """
        Test registration attempt with empty JSON payload.

        Verifies that:
        - POST request with empty JSON returns status 400
        - Error message indicates missing required fields
        - No user is created in database

        Args:
            client: Flask test client fixture
            clean_db: Clean database fixture
        """
        # Make POST request with empty JSON
        response = client.post(
            "/api/auth/register", data=json.dumps({}), content_type="application/json"
        )

        # Assert bad request response
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"

        # Parse error response
        response_data = json.loads(response.data)
        assert "error" in response_data, "Response should contain error message"
        assert "required" in response_data["error"].lower()

        # Verify no user was created in database
        user_count = User.query.count()
        assert user_count == 0, "No user should be created with empty data"

    def test_invalid_email_format_registration(self, client, clean_db):
        """
        Test registration attempt with invalid email format.

        Verifies that:
        - POST request with invalid email returns status 400
        - Error message indicates invalid email format
        - No user is created in database

        Args:
            client: Flask test client fixture
            clean_db: Clean database fixture
        """
        # Registration data with invalid email format
        invalid_data = {
            "email": "invalid-email-format",  # Missing @ symbol
            "password": "testpassword123",
        }

        # Make POST request with invalid email
        response = client.post(
            "/api/auth/register",
            data=json.dumps(invalid_data),
            content_type="application/json",
        )

        # Assert bad request response
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"

        # Parse error response
        response_data = json.loads(response.data)
        assert "error" in response_data, "Response should contain error message"
        assert "email" in response_data["error"].lower()

        # Verify no user was created in database
        user_count = User.query.count()
        assert user_count == 0, "No user should be created with invalid email"

    def test_short_password_registration(self, client, clean_db):
        """
        Test registration attempt with password that's too short.

        Verifies that:
        - POST request with short password returns status 400
        - Error message indicates password length requirement
        - No user is created in database

        Args:
            client: Flask test client fixture
            clean_db: Clean database fixture
        """
        # Registration data with short password
        invalid_data = {
            "email": "test@example.com",
            "password": "12345",  # Only 5 characters (minimum is 6)
        }

        # Make POST request with short password
        response = client.post(
            "/api/auth/register",
            data=json.dumps(invalid_data),
            content_type="application/json",
        )

        # Assert bad request response
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"

        # Parse error response
        response_data = json.loads(response.data)
        assert "error" in response_data, "Response should contain error message"
        assert "password" in response_data["error"].lower()
        assert "characters" in response_data["error"].lower()

        # Verify no user was created in database
        user_count = User.query.count()
        assert user_count == 0, "No user should be created with short password"

    def test_email_case_insensitive_registration(self, client, clean_db):
        """
        Test that email registration is case-insensitive.

        Verifies that:
        - Registration with uppercase email succeeds
        - Email is stored in lowercase in database
        - Attempting to register with same email in different case fails

        Args:
            client: Flask test client fixture
            clean_db: Clean database fixture
        """
        # Registration data with uppercase email
        uppercase_email_data = {
            "email": "TEST@EXAMPLE.COM",
            "password": "testpassword123",
        }

        # First registration with uppercase email
        response = client.post(
            "/api/auth/register",
            data=json.dumps(uppercase_email_data),
            content_type="application/json",
        )

        # Assert successful registration
        assert (
            response.status_code == 201
        ), "Registration with uppercase email should succeed"

        # Verify email is stored in lowercase
        created_user = User.query.first()
        assert (
            created_user.email == "test@example.com"
        ), "Email should be stored in lowercase"

        # Attempt registration with same email in lowercase
        lowercase_email_data = {
            "email": "test@example.com",
            "password": "anotherpassword123",
        }

        response = client.post(
            "/api/auth/register",
            data=json.dumps(lowercase_email_data),
            content_type="application/json",
        )

        # Should fail due to duplicate email (case-insensitive)
        assert (
            response.status_code == 409
        ), "Should detect duplicate email regardless of case"

    def test_no_content_type_registration(self, client, clean_db, sample_user_data):
        """
        Test registration attempt without proper content type.

        Verifies that the endpoint handles requests without JSON content type gracefully.

        Args:
            client: Flask test client fixture
            clean_db: Clean database fixture
            sample_user_data: Sample user data fixture
        """
        # Make POST request without content-type header
        response = client.post(
            "/api/auth/register",
            data=json.dumps(sample_user_data),
            # content_type intentionally not set
        )

        # Should return 400 or handle gracefully
        # The exact behavior depends on Flask's request parsing
        assert response.status_code in [400, 500], "Should handle missing content type"

        # Verify no user was created
        user_count = User.query.count()
        assert user_count == 0, "No user should be created with improper request format"


class TestUserLogin:
    """Test class for user login endpoint functionality."""

    def test_successful_login(self, client, clean_db, sample_user_data):
        """
        Test successful user login with valid credentials.

        Verifies that:
        - User registration succeeds first
        - POST request with correct email/password returns status 200
        - Response contains access_token
        - Response contains user data
        - JWT token is present and not empty

        Args:
            client: Flask test client fixture
            clean_db: Clean database fixture
            sample_user_data: Sample user data fixture
        """
        # First register a user
        registration_response = client.post(
            "/api/auth/register",
            data=json.dumps(sample_user_data),
            content_type="application/json",
        )
        assert (
            registration_response.status_code == 201
        ), "User registration should succeed"

        # Now attempt login with same credentials
        login_response = client.post(
            "/api/auth/login",
            data=json.dumps(sample_user_data),
            content_type="application/json",
        )

        # Assert successful login response
        assert (
            login_response.status_code == 200
        ), f"Expected 200, got {login_response.status_code}"

        # Parse response data
        response_data = json.loads(login_response.data)

        # Verify response structure and content
        assert "access_token" in response_data, "Response should contain access_token"
        assert "user" in response_data, "Response should contain user data"
        assert "message" in response_data, "Response should contain success message"

        # Verify access token is not empty
        assert response_data["access_token"], "Access token should not be empty"
        assert (
            len(response_data["access_token"]) > 20
        ), "Access token should be substantial length"

        # Verify user data in response
        user_data = response_data["user"]
        assert "id" in user_data, "Response should contain user ID"
        assert "email" in user_data, "Response should contain user email"
        assert user_data["email"] == sample_user_data["email"].lower()

        # Verify success message
        assert response_data["message"] == "Login successful"

    def test_incorrect_password_login(self, client, clean_db, sample_user_data):
        """
        Test login attempt with correct email but incorrect password.

        Verifies that:
        - User registration succeeds first
        - POST request with correct email but wrong password returns status 401
        - Response contains appropriate error message
        - No access token is provided

        Args:
            client: Flask test client fixture
            clean_db: Clean database fixture
            sample_user_data: Sample user data fixture
        """
        # First register a user
        registration_response = client.post(
            "/api/auth/register",
            data=json.dumps(sample_user_data),
            content_type="application/json",
        )
        assert (
            registration_response.status_code == 201
        ), "User registration should succeed"

        # Attempt login with wrong password
        wrong_password_data = {
            "email": sample_user_data["email"],
            "password": "wrongpassword123",
        }

        login_response = client.post(
            "/api/auth/login",
            data=json.dumps(wrong_password_data),
            content_type="application/json",
        )

        # Assert unauthorized response
        assert (
            login_response.status_code == 401
        ), f"Expected 401, got {login_response.status_code}"

        # Parse error response
        response_data = json.loads(login_response.data)
        assert "error" in response_data, "Response should contain error message"
        assert (
            "invalid" in response_data["error"].lower()
            or "incorrect" in response_data["error"].lower()
        )

        # Verify no access token is provided
        assert (
            "access_token" not in response_data
        ), "No access token should be provided for failed login"

    def test_nonexistent_user_login(self, client, clean_db):
        """
        Test login attempt with unregistered email address.

        Verifies that:
        - POST request with unregistered email returns status 401
        - Response contains appropriate error message
        - No access token is provided
        - Database remains clean (no user created)

        Args:
            client: Flask test client fixture
            clean_db: Clean database fixture
        """
        # Attempt login with unregistered email
        unregistered_user_data = {
            "email": "nonexistent@example.com",
            "password": "anypassword123",
        }

        login_response = client.post(
            "/api/auth/login",
            data=json.dumps(unregistered_user_data),
            content_type="application/json",
        )

        # Assert unauthorized response
        assert (
            login_response.status_code == 401
        ), f"Expected 401, got {login_response.status_code}"

        # Parse error response
        response_data = json.loads(login_response.data)
        assert "error" in response_data, "Response should contain error message"
        assert (
            "invalid" in response_data["error"].lower()
            or "not found" in response_data["error"].lower()
        )

        # Verify no access token is provided
        assert (
            "access_token" not in response_data
        ), "No access token should be provided for failed login"

        # Verify no user was created in database
        user_count = User.query.count()
        assert user_count == 0, "No user should be created during failed login attempt"

    def test_missing_password_login(self, client, clean_db):
        """
        Test login attempt without password field.

        Verifies that:
        - POST request without password returns status 400
        - Error message indicates missing required fields
        - No access token is provided

        Args:
            client: Flask test client fixture
            clean_db: Clean database fixture
        """
        # Login data missing password
        incomplete_data = {
            "email": "test@example.com"
            # password field intentionally missing
        }

        # Make POST request with incomplete data
        response = client.post(
            "/api/auth/login",
            data=json.dumps(incomplete_data),
            content_type="application/json",
        )

        # Assert bad request response
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"

        # Parse error response
        response_data = json.loads(response.data)
        assert "error" in response_data, "Response should contain error message"
        assert "required" in response_data["error"].lower()

        # Verify no access token is provided
        assert (
            "access_token" not in response_data
        ), "No access token should be provided for malformed request"

    def test_missing_email_login(self, client, clean_db):
        """
        Test login attempt without email field.

        Verifies that:
        - POST request without email returns status 400
        - Error message indicates missing required fields
        - No access token is provided

        Args:
            client: Flask test client fixture
            clean_db: Clean database fixture
        """
        # Login data missing email
        incomplete_data = {
            "password": "testpassword123"
            # email field intentionally missing
        }

        # Make POST request with incomplete data
        response = client.post(
            "/api/auth/login",
            data=json.dumps(incomplete_data),
            content_type="application/json",
        )

        # Assert bad request response
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"

        # Parse error response
        response_data = json.loads(response.data)
        assert "error" in response_data, "Response should contain error message"
        assert "required" in response_data["error"].lower()

        # Verify no access token is provided
        assert (
            "access_token" not in response_data
        ), "No access token should be provided for malformed request"

    def test_empty_json_login(self, client, clean_db):
        """
        Test login attempt with empty JSON payload.

        Verifies that:
        - POST request with empty JSON returns status 400
        - Error message indicates missing required fields
        - No access token is provided

        Args:
            client: Flask test client fixture
            clean_db: Clean database fixture
        """
        # Make POST request with empty JSON
        response = client.post(
            "/api/auth/login", data=json.dumps({}), content_type="application/json"
        )

        # Assert bad request response
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"

        # Parse error response
        response_data = json.loads(response.data)
        assert "error" in response_data, "Response should contain error message"
        assert "required" in response_data["error"].lower()

        # Verify no access token is provided
        assert (
            "access_token" not in response_data
        ), "No access token should be provided for empty request"

    def test_email_case_insensitive_login(self, client, clean_db, sample_user_data):
        """
        Test that email login is case-insensitive.

        Verifies that:
        - Registration with email in one case succeeds
        - Login with same email in different case succeeds
        - Response contains access token and user data

        Args:
            client: Flask test client fixture
            clean_db: Clean database fixture
            sample_user_data: Sample user data fixture
        """
        # Register user with lowercase email
        registration_response = client.post(
            "/api/auth/register",
            data=json.dumps(sample_user_data),
            content_type="application/json",
        )
        assert (
            registration_response.status_code == 201
        ), "User registration should succeed"

        # Attempt login with uppercase email
        uppercase_login_data = {
            "email": sample_user_data["email"].upper(),
            "password": sample_user_data["password"],
        }

        login_response = client.post(
            "/api/auth/login",
            data=json.dumps(uppercase_login_data),
            content_type="application/json",
        )

        # Assert successful login despite case difference
        assert (
            login_response.status_code == 200
        ), "Login should succeed regardless of email case"

        # Parse response data
        response_data = json.loads(login_response.data)

        # Verify response contains required fields
        assert "access_token" in response_data, "Response should contain access_token"
        assert "user" in response_data, "Response should contain user data"

        # Verify user email is normalized in response
        user_data = response_data["user"]
        assert (
            user_data["email"] == sample_user_data["email"].lower()
        ), "Email should be normalized to lowercase"
