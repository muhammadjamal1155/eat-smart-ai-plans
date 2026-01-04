from flask import Flask
from flask_cors import CORS
from routes.api import api
from routes.admin import admin_bp
from routes.chat import chat_bp
from routes.insights import insights_bp

app = Flask(__name__)
CORS(app)

# Register Blueprints
app.register_blueprint(api)
app.register_blueprint(admin_bp)
app.register_blueprint(chat_bp)
app.register_blueprint(insights_bp)

@app.route('/')
def home():
    return "Eat Smart AI Plans API is running!"

if __name__ == '__main__':
    app.run(debug=True)
