from flask import Flask, Blueprint, request, jsonify
from flask_sqlalchemy import SQLAlchemy




# Initialize the database
db = SQLAlchemy()

# Define the Blueprint
blog_bp = Blueprint('blog', __name__)

# Define the BlogPost model
class BlogPost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content
        }

# Routes for the Blueprint

# Create a new blog post
@blog_bp.route('/create', methods=['POST'])
def create_post():
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')

    if not title or not content:
        return jsonify({"error": "Title and content are required"}), 400

    new_post = BlogPost(title=title, content=content)
    db.session.add(new_post)
    db.session.commit()

    return jsonify({"message": "Blog post created", "post": new_post.to_dict()}), 201

# Get all blog posts
@blog_bp.route('/get_all', methods=['GET'])
def get_all_posts():
    search = request.args.get('search', '')
    query = BlogPost.query

    if search:
        query = query.filter(
            BlogPost.title.contains(search) | BlogPost.content.contains(search)
        )

    posts = query.all()
    return jsonify({"posts": [post.to_dict() for post in posts]})

# Get a single blog post
@blog_bp.route('/<int:id>', methods=['GET'])
def get_post(id):
    post = BlogPost.query.get_or_404(id)
    return jsonify(post.to_dict())

# Update a blog post
@blog_bp.route('/<int:id>', methods=['PUT'])
def update_post(id):
    post = BlogPost.query.get_or_404(id)
    data = request.get_json()

    post.title = data.get('title', post.title)
    post.content = data.get('content', post.content)

    db.session.commit()
    return jsonify({"message": "Blog post updated", "post": post.to_dict()})

# Delete a blog post
@blog_bp.route('/delete/<int:id>', methods=['DELETE'])
def delete_post(id):
    post = BlogPost.query.get_or_404(id)
    db.session.delete(post)
    db.session.commit()
    return jsonify({"message": "Blog post deleted"})

