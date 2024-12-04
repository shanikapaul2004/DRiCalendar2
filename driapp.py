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

    

"""need at least 5 routes... i am thinking we need 
1) log journal entry
2) log symptoms
3) fetch symptoms from date
4) fetch entry from date
5) fetch all info for user (?)


also need...
1) create account
2) update password
3) login

4) health check -- have above


--Sophia
"""

# not sure if this is the file you meant to create or not
# idk what the .db extension is


"""
from flask import Flask, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash #?????
import sqlite3
import requests
import logging
import os

load_dotenv()

app = Flask(__name__)

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default_secret')

get_db_connection

create_account

login

get_affirmation

log_sobriety

log_emotion

log_journal

"""
