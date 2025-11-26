from flask import Flask
from flask_cors import CORS
from datetime import timedelta
import os

from extensions import db, bcrypt, jwt

app = Flask(__name__)
CORS(app)


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///cidadao_ativo.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your-secret-key-change-in-production'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)
app.config['UPLOAD_FOLDER'] = 'uploads'

db.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)


os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

from auth_routes import register_auth_routes
from solicitacao_routes import register_solicitacao_routes
from vereador_routes import register_vereador_routes

register_auth_routes(app)
register_solicitacao_routes(app)
register_vereador_routes(app)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        print("\n" + "="*50)
        print("✓ Database created successfully!")
        print("✓ Server running at http://127.0.0.1:5000")
        print("✓ Ready to accept connections")
        print("="*50 + "\n")
    app.run(debug=True, port=5000)
