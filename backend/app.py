from flask import Flask, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from dotenv import load_dotenv
import os

load_dotenv()
from routes.api import api
from routes.admin import admin_bp
from routes.chat import chat_bp
from routes.insights import insights_bp
from routes.analytics import analytics_bp
from routes.plans import plans_bp

app = Flask(__name__)
CORS(app)

from core.extensions import limiter
limiter.init_app(app)

@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify({"error": f"Rate limit exceeded: {e.description}"}), 429

@app.errorhandler(401)
def unauthorized_handler(e):
    return jsonify({"error": "Unauthorized"}), 401

# Register Blueprints
app.register_blueprint(api)
app.register_blueprint(admin_bp)
app.register_blueprint(chat_bp)
app.register_blueprint(insights_bp)
app.register_blueprint(analytics_bp)
app.register_blueprint(plans_bp)

@app.route('/')
def home():
    return "Eat Smart AI Plans API is running!"

if __name__ == '__main__':
    app.run(debug=True)
