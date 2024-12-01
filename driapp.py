from flask import Flask, jsonify
from db_setup import db
import os

app = Flask(__name__)

# Configure database
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(basedir, 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Import models after db setup to avoid circular import
from models import User, SobrietyLog

# Health check route
@app.route('/health-check', methods=['GET'])
def health_check():
    return jsonify({"status": "App is running"}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(port=5001, debug=True)
