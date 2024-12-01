from driapp import app, db
from models import User, SobrietyLog

# Use application context
with app.app_context():
    # Insert a test user
    user = User(username="test_user", salt="random_salt", hashed_password="hashed_password")
    db.session.add(user)
    db.session.commit()

    # Insert a test sobriety log
    log = SobrietyLog(user_id=user.id, date="2024-11-24", status="sober", thoughts="Feeling great!", symptoms="")
    db.session.add(log)
    db.session.commit()

    print("Test data inserted successfully!")
