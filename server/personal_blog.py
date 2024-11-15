import json
import os
from flask import Blueprint, request, jsonify

# Create a Blueprint for the blog
personal_blog_bp = Blueprint('personal_blog', __name__)

ARTICLES_FILE = 'articles.json'

# Utility function to load articles
def load_articles():
    if not os.path.exists(ARTICLES_FILE):
        with open(ARTICLES_FILE, 'w') as f:
            json.dump([], f)
    with open(ARTICLES_FILE, 'r') as f:
        return json.load(f)

# Utility function to save articles
def save_articles(articles):
    with open(ARTICLES_FILE, 'w') as f:
        json.dump(articles, f, indent=4)

# Guest Section Routes
@personal_blog_bp.route('/articles', methods=['GET'])
def get_articles():
    print("get artcles")
    articles = load_articles()
    print("get artcles-2", articles)
    return jsonify(articles), 200

@personal_blog_bp.route('/articles/<int:article_id>', methods=['GET'])
def get_article(article_id):
    articles = load_articles()
    article = next((a for a in articles if a['id'] == article_id), None)
    if article:
        return jsonify(article), 200
    return jsonify({"error": "Article not found"}), 404

# Admin Section Routes
@personal_blog_bp.route('/admin/add-article', methods=['POST'])
def add_article():
    new_article = request.json
    articles = load_articles()
    new_article['id'] = len(articles) + 1  # Simple ID increment
    articles.append(new_article)
    save_articles(articles)
    return jsonify(new_article), 201

@personal_blog_bp.route('/admin/edit-article/<int:article_id>', methods=['PUT'])
def edit_article(article_id):
    articles = load_articles()
    article = next((a for a in articles if a['id'] == article_id), None)
    if article:
        article.update(request.json)
        save_articles(articles)
        return jsonify(article), 200
    return jsonify({"error": "Article not found"}), 404

@personal_blog_bp.route('/admin/delete-article/<int:article_id>', methods=['DELETE'])
def delete_article(article_id):
    articles = load_articles()
    article = next((a for a in articles if a['id'] == article_id), None)
    if article:
        articles = [a for a in articles if a['id'] != article_id]
        save_articles(articles)
        return jsonify({"message": "Article deleted successfully"}), 200
    return jsonify({"error": "Article not found"}), 404
