import os
from datetime import timedelta

class Config:
    """Base configuration class with common settings."""

    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-this-in-production-12345'
    DEBUG = False
    TESTING = False

    APP_NAME = 'UI/UX Designer Portfolio'
    APP_VERSION = '1.0.0'
  
    HOST = '0.0.0.0'
    PORT = int(os.environ.get('PORT', 5000))
    
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)
    
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static', 'uploads')
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'pdf', 'svg', 'webp'}
    
    STATIC_FOLDER = 'static'
    STATIC_URL_PATH = '/static'
    
    TEMPLATES_FOLDER = 'templates'
    TEMPLATES_AUTO_RELOAD = False
    
    JSON_SORT_KEYS = False
    JSONIFY_PRETTYPRINT_REGULAR = True
    JSON_AS_ASCII = False
    
    BASE_DIR = os.path.dirname(os.path.dirname(__file__))
    DATA_FOLDER = os.path.join(BASE_DIR, 'data')
    DATA_FILE = os.path.join(DATA_FOLDER, 'portfolio_data.json')
    
    FLOWISE_CHATBOT_URL = os.environ.get('FLOWISE_CHATBOT_URL', '')
    FLOWISE_API_KEY = os.environ.get('FLOWISE_API_KEY', '')
    
    MAIL_SERVER = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
    MAIL_PORT = int(os.environ.get('MAIL_PORT', 587))
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_DEFAULT_SENDER')
    
    WTF_CSRF_ENABLED = True
    WTF_CSRF_TIME_LIMIT = None

    LOG_LEVEL = 'INFO'
    LOG_FILE = 'portfolio.log'
    
    CACHE_TYPE = 'simple'
    CACHE_DEFAULT_TIMEOUT = 300
    
    RATELIMIT_ENABLED = True
    RATELIMIT_STORAGE_URL = 'memory://'
    
    @staticmethod
    def init_app(app):
        """Initialize application with configuration."""
        os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
        os.makedirs(Config.DATA_FOLDER, exist_ok=True)


class DevelopmentConfig(Config):
    """Development environment configuration."""
    
    DEBUG = True
    TESTING = False
    
    SESSION_COOKIE_SECURE = False
    WTF_CSRF_ENABLED = True
    
    TEMPLATES_AUTO_RELOAD = True

    LOG_LEVEL = 'DEBUG'
    
    SQLALCHEMY_DATABASE_URI = 'sqlite:///dev.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    @classmethod
    def init_app(cls, app):
        Config.init_app(app)
        print('🚀 Development mode enabled')


class ProductionConfig(Config):
    """Production environment configuration."""
    
    DEBUG = False
    TESTING = False
    
    SESSION_COOKIE_SECURE = True
    WTF_CSRF_ENABLED = True
    
    TEMPLATES_AUTO_RELOAD = False
    
    LOG_LEVEL = 'WARNING'
    
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///prod.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    @classmethod
    def init_app(cls, app):
        Config.init_app(app)
        
        if not os.environ.get('SECRET_KEY'):
            raise ValueError("SECRET_KEY environment variable must be set in production!")
    
        import logging
        from logging.handlers import RotatingFileHandler
        
        if not os.path.exists('logs'):
            os.mkdir('logs')
        
        file_handler = RotatingFileHandler(
            'logs/portfolio.log',
            maxBytes=10240000,
            backupCount=10
        )
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
        ))
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)
        app.logger.setLevel(logging.INFO)
        app.logger.info('Portfolio application startup')


class TestingConfig(Config):
    """Testing environment configuration."""
    
    TESTING = True
    DEBUG = True
    
    WTF_CSRF_ENABLED = False
    SESSION_COOKIE_SECURE = False
    
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    DATA_FILE = os.path.join(Config.BASE_DIR, 'tests', 'test_portfolio_data.json')
    
    @classmethod
    def init_app(cls, app):
        Config.init_app(app)
        print('🧪 Testing mode enabled')

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}


def get_config(config_name=None):
    """
    Get configuration object based on environment.
    
    Args:
        config_name (str): Configuration name ('development', 'production', 'testing')
        If None, reads from FLASK_ENV environment variable
        
    Returns:
        Config: Configuration class object
        
    Example:
        >>> config = get_config('development')
        >>> app.config.from_object(config)
    """
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')
    
    return config.get(config_name, DevelopmentConfig)

def is_production():
    """Check if running in production environment."""
    return os.environ.get('FLASK_ENV') == 'production'


def is_development():
    """Check if running in development environment."""
    return os.environ.get('FLASK_ENV', 'development') == 'development'


def is_testing():
    """Check if running in testing environment."""
    return os.environ.get('FLASK_ENV') == 'testing'