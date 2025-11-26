from flask import request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from extensions import db, bcrypt
from models import User, Vereador

def register_auth_routes(app):
    @app.route('/api/auth/register', methods=['POST'])
    def register():
        try:
            data = request.get_json()
            
         
            required_fields = ['email', 'password', 'nome']
            for field in required_fields:
                if not data.get(field):
                    return jsonify({'error': f'{field} is required'}), 400
            
           
            if User.query.filter_by(email=data['email']).first():
                return jsonify({'error': 'Email already registered'}), 400
            
          
            password_hash = bcrypt.generate_password_hash(data['password']).decode('utf-8')
            
       
            new_user = User(
                email=data['email'],
                password_hash=password_hash,
                nome=data['nome'],
                tipo_usuario=data.get('tipo_usuario', 'cidadao'),
                telefone=data.get('telefone')
            )
            
            db.session.add(new_user)
            db.session.commit()
            
            access_token = create_access_token(identity=str(new_user.id))
            
            return jsonify({
                'message': 'User registered successfully',
                'token': access_token,
                'user': new_user.to_dict()
            }), 201
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

    @app.route('/api/auth/login', methods=['POST'])
    def login():
        try:
            data = request.get_json()
            
         
            if not data.get('email') or not data.get('password'):
                return jsonify({'error': 'Email and password are required'}), 400
            
        
            user = User.query.filter_by(email=data['email']).first()
            
            if not user or not bcrypt.check_password_hash(user.password_hash, data['password']):
                return jsonify({'error': 'Invalid email or password'}), 401
            
            access_token = create_access_token(identity=str(user.id))
            
            
            user_data = user.to_dict()
            if user.tipo_usuario == 'vereador':
                vereador = Vereador.query.filter_by(user_id=user.id).first()
                if vereador:
                    user_data['vereador_id'] = vereador.id
            
            return jsonify({
                'message': 'Login successful',
                'token': access_token,
                'user': user_data
            }), 200
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/api/auth/me', methods=['GET'])
    @jwt_required()
    def get_current_user():
        try:
            current_user_id = int(get_jwt_identity())
            user = User.query.get(current_user_id)
            
            if not user:
                return jsonify({'error': 'User not found'}), 404
            
            user_data = user.to_dict()
            
           
            if user.tipo_usuario == 'vereador':
                vereador = Vereador.query.filter_by(user_id=user.id).first()
                if vereador:
                    user_data['vereador_id'] = vereador.id
                    user_data['vereador_profile'] = vereador.to_dict()
            
            return jsonify({'user': user_data}), 200
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/api/auth/logout', methods=['POST'])
    @jwt_required()
    def logout():
        
        return jsonify({'message': 'Logout successful'}), 200
