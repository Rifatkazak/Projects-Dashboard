# server/main_server.py
from flask import Flask, jsonify
from expense_tracker import expense_tracker_bp
from github_activities import github_activity_bp
from task_manager import task_manager_bp
from converter import converter_bp
from guess_number import guessnumber_bp
from personal_blog import personal_blog_bp
from weather_api import weather_bp
from blog_platform import blog_bp
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

CORS(app, origins="http://localhost:3000")

# Configure the app
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///blog.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db = SQLAlchemy(app)

# Her bir proje için Blueprint'i (Flask alt uygulaması) dahil et
app.register_blueprint(expense_tracker_bp, url_prefix='/expense-tracker')
app.register_blueprint(github_activity_bp, url_prefix='/github-activities')
app.register_blueprint(task_manager_bp, url_prefix='/task-manager')
app.register_blueprint(converter_bp, url_prefix='/converter')
app.register_blueprint(guessnumber_bp, url_prefix='/guess-number')
app.register_blueprint(personal_blog_bp, url_prefix='/personal-blog')
app.register_blueprint(weather_bp, url_prefix='/weather')
app.register_blueprint(blog_bp, url_prefix='/blog_platform')

@app.route('/')
def home():
    return jsonify({
        "message": "Welcome to the Multi-Project API",
        "projects": ["Expense Tracker", "GitHub User Activity", "Task Manager", "Units Converter" , "Guess Number", "Personal Blog", "Weather API", "Blog Platform"]
    })

if __name__ == '__main__':
    app.run(port=5000)