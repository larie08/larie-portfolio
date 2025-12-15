from flask import Flask, render_template, jsonify, request
import json
import os
import smtplib

app = Flask(__name__)

# Load portfolio data from JSON file
def load_portfolio_data():
    data_path = os.path.join('data', 'portfolio_data.json')
    if os.path.exists(data_path):
        with open(data_path, 'r') as f:
            return json.load(f)
    return get_default_data()

def get_default_data():
    """Default data if JSON file doesn't exist"""
    return {
        "name": "Your Name",
        "title": "UI/UX Designer",
        "email": "your.email@example.com",
        "linkedin": "linkedin.com/in/yourprofile",
        "behance": "behance.net/yourprofile",
        "bio": "Passionate UI/UX designer with expertise in creating intuitive and visually stunning digital experiences.",
        "skills": ["UI Design", "UX Research", "Figma", "Prototyping", "User Testing", "Wireframing"],
        "projects": []
    }

# Load data on startup
PORTFOLIO_DATA = load_portfolio_data()

@app.route('/')
def index():
    """Render main portfolio page"""
    return render_template('index.html', data=PORTFOLIO_DATA)

@app.route('/api/projects')
def get_projects():
    """API endpoint to get all projects"""
    return jsonify(PORTFOLIO_DATA['projects'])

@app.route('/api/projects/<int:project_id>')
def get_project(project_id):
    """API endpoint to get a specific project"""
    project = next((p for p in PORTFOLIO_DATA['projects'] if p['id'] == project_id), None)
    if project:
        return jsonify(project)
    return jsonify({"error": "Project not found"}), 404

@app.route('/api/contact', methods=['POST'])
def contact():
    """Handle contact form submissions (no email sending)"""
    data = request.get_json()

    if not data:
        return jsonify({
            "status": "error",
            "message": "No data received"
        }), 400

    print("📩 Inquiry received:", data)

    return jsonify({
        "status": "success",
        "message": "Your inquiry has been received. Thank you!"
    }), 200

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({"error": "Not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)