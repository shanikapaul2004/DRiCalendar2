from db_setup import db
from sqlalchemy.dialects.sqlite import TEXT

# User table for account management
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False, unique=True)
    salt = db.Column(db.String(32), nullable=False)
    hashed_password = db.Column(db.String(128), nullable=False)

# Sobriety log table
class SobrietyLog(db.Model):
    __tablename__ = 'sobriety_logs'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date = db.Column(db.String(10), nullable=False)  # Format: YYYY-MM-DD
    status = db.Column(db.String(20), nullable=False)  # 'sober' or 'not_sober'
    thoughts = db.Column(TEXT, nullable=True)
    symptoms = db.Column(TEXT, nullable=True)

    # Relationship with User table
    user = db.relationship('User', backref=db.backref('logs', lazy=True))


    """ I think we should divide the sobriety log part into different data bases:
    for example we could split into 3 -- 
    1) Sober = yes or no
    2) Symptoms
    3) journal log


    copied:

    class SobrietyLog(db.Model):
        __tablename__ = 'sobriety_logs'
        id = db.Column(db.Integer, primary_key=True)
        user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
        date = db.Column(db.String(10), nullable=False)  # Format: YYYY-MM-DD
        status = db.Column(db.String(20), nullable=False)  # 'sober' or 'not_sober'

    class SymptomsLog(db.Model):
        __tablename__ = 'symptom_logs'
        id = db.Column(db.Integer, primary_key=True)
        user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
        date = db.Column(db.String(10), nullable=False)
        symptoms = db.Column(db.String(50), nullable=False)
        note = db.Column(db.Text, nullable=True)

    class Journal(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
        date = db.Column(db.String(10), nullable=False)
        entry = db.Column(db.Text, nullable=False)
       
    
    --Sophia
         """
