from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Solicitacao, Categoria, Bairro, User
from datetime import datetime
import json

def register_solicitacao_routes(app):
    @app.route('/api/solicitacoes', methods=['GET'])
    def get_solicitacoes():
        try:
            
            categoria = request.args.get('categoria')
            bairro = request.args.get('bairro')
            status = request.args.get('status')
            search = request.args.get('search')
            vereador_id = request.args.get('vereador_id')
            
           
            query = Solicitacao.query
            
           
            if categoria:
                categoria_obj = Categoria.query.filter_by(nome=categoria).first()
                if categoria_obj:
                    query = query.filter_by(categoria_id=categoria_obj.id)
            
            if bairro:
                bairro_obj = Bairro.query.filter_by(nome=bairro).first()
                if bairro_obj:
                    query = query.filter_by(bairro_id=bairro_obj.id)
            
            if status:
                query = query.filter_by(status=status)
            
            if vereador_id:
                query = query.filter_by(vereador_id=vereador_id)
            
            if search:
                search_pattern = f'%{search}%'
                query = query.filter(
                    db.or_(
                        Solicitacao.titulo.like(search_pattern),
                        Solicitacao.descricao.like(search_pattern),
                        Solicitacao.endereco.like(search_pattern)
                    )
                )
            
           
            solicitacoes = query.order_by(Solicitacao.created_at.desc()).all()
            
            return jsonify({
                'solicitacoes': [sol.to_dict() for sol in solicitacoes],
                'total': len(solicitacoes)
            }), 200
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/api/solicitacoes/<int:id>', methods=['GET'])
    def get_solicitacao(id):
        try:
            solicitacao = Solicitacao.query.get(id)
            
            if not solicitacao:
                return jsonify({'error': 'Solicitação not found'}), 404
            
            return jsonify({'solicitacao': solicitacao.to_dict(include_user=True)}), 200
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/api/solicitacoes', methods=['POST'])
    @jwt_required()
    def create_solicitacao():
        try:
            try:
                current_user_id = int(get_jwt_identity())
                print(f"[Backend] Current user ID from JWT: {current_user_id}")
            except Exception as jwt_error:
                print(f"[Backend] JWT decode error: {str(jwt_error)}")
                return jsonify({'error': 'Invalid or expired token. Please login again.'}), 401
            
            data = request.get_json()
            print(f"[Backend] Received data: {json.dumps(data, indent=2)}")
            
          
            required_fields = ['titulo', 'categoria_id', 'descricao']
            for field in required_fields:
                if not data.get(field):
                    return jsonify({'error': f'{field} is required'}), 400
            
           
            bairro_id = None
            if data.get('bairro'):
                bairro = Bairro.query.filter_by(nome=data['bairro']).first()
                if not bairro:
                    bairro = Bairro(nome=data['bairro'])
                    db.session.add(bairro)
                    db.session.flush()
                bairro_id = bairro.id
            
           
            new_solicitacao = Solicitacao(
                titulo=data['titulo'],
                categoria_id=data['categoria_id'],
                descricao=data['descricao'],
                endereco=data.get('endereco'),
                bairro_id=bairro_id,
                cep=data.get('cep'),
                latitude=data.get('latitude'),
                longitude=data.get('longitude'),
                fotos=json.dumps(data.get('fotos', [])),
                anonimo=data.get('anonimo', False),
                user_id=current_user_id,
                status='aberta'
            )
            
            db.session.add(new_solicitacao)
            db.session.commit()
            
            print(f"[Backend] Successfully created solicitação ID: {new_solicitacao.id}")
            
            return jsonify({
                'message': 'Solicitação created successfully',
                'solicitacao': new_solicitacao.to_dict()
            }), 201
            
        except Exception as e:
            db.session.rollback()
            print(f"[Backend] Error creating solicitação: {str(e)}")
            return jsonify({'error': str(e)}), 500

    @app.route('/api/solicitacoes/<int:id>', methods=['PUT'])
    @jwt_required()
    def update_solicitacao(id):
        try:
            current_user_id = int(get_jwt_identity())
            solicitacao = Solicitacao.query.get(id)
            
            if not solicitacao:
                return jsonify({'error': 'Solicitação not found'}), 404
            
          
            user = User.query.get(current_user_id)
            if user.tipo_usuario != 'vereador' and solicitacao.user_id != current_user_id:
                return jsonify({'error': 'Unauthorized'}), 403
            
            data = request.get_json()
            
          
            if 'status' in data:
                old_status = solicitacao.status
                solicitacao.status = data['status']
                
              
                if data['status'] == 'resolvida' and old_status != 'resolvida':
                    solicitacao.tempo_resolucao = solicitacao.calculate_tempo_resolucao()
            
            if 'vereador_id' in data:
                solicitacao.vereador_id = data['vereador_id']
            
            if 'descricao' in data:
                solicitacao.descricao = data['descricao']
            
            solicitacao.updated_at = datetime.utcnow()
            
            db.session.commit()
            
            return jsonify({
                'message': 'Solicitação updated successfully',
                'solicitacao': solicitacao.to_dict()
            }), 200
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

    @app.route('/api/solicitacoes/recent', methods=['GET'])
    def get_recent_solicitacoes():
        try:
            limit = request.args.get('limit', 10, type=int)
            
            solicitacoes = Solicitacao.query.order_by(
                Solicitacao.created_at.desc()
            ).limit(limit).all()
            
            return jsonify({
                'solicitacoes': [sol.to_dict() for sol in solicitacoes]
            }), 200
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/api/categorias', methods=['GET'])
    def get_categorias():
        try:
            categorias = Categoria.query.all()
            return jsonify({
                'categorias': [cat.to_dict() for cat in categorias]
            }), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/api/bairros', methods=['GET'])
    def get_bairros():
        try:
            bairros = Bairro.query.all()
            return jsonify({
                'bairros': [bairro.to_dict() for bairro in bairros]
            }), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/api/upload', methods=['POST'])
    @jwt_required()
    def upload_file():
        try:
            if 'file' not in request.files:
                return jsonify({'error': 'No file provided'}), 400
            
            file = request.files['file']
            
            if file.filename == '':
                return jsonify({'error': 'No file selected'}), 400
            
       
            import os
            from werkzeug.utils import secure_filename
            
            filename = secure_filename(file.filename)
            timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
            filename = f"{timestamp}_{filename}"
            
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            return jsonify({
                'message': 'File uploaded successfully',
                'url': f'/uploads/{filename}'
            }), 200
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
