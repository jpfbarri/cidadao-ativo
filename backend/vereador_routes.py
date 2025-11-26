from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Vereador, Solicitacao, User

def register_vereador_routes(app):
    @app.route('/api/vereadores', methods=['GET'])
    def get_vereadores():
        try:
       
            ranking = request.args.get('ranking', 'geral')  # geral, semestre, mes
            
            vereadores = Vereador.query.all()
            vereadores_data = []
            
            for vereador in vereadores:
                vereador_dict = vereador.to_dict(include_stats=True)
                vereadores_data.append(vereador_dict)
            
            
            vereadores_data.sort(key=lambda x: x.get('taxa_resolucao', 0), reverse=True)
            
            return jsonify({
                'vereadores': vereadores_data,
                'total': len(vereadores_data)
            }), 200
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/api/vereadores/<int:id>', methods=['GET'])
    def get_vereador(id):
        try:
            vereador = Vereador.query.get(id)
            
            if not vereador:
                return jsonify({'error': 'Vereador not found'}), 404
            
            return jsonify({
                'vereador': vereador.to_dict(include_stats=True)
            }), 200
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/api/vereadores/<int:id>/solicitacoes', methods=['GET'])
    def get_vereador_solicitacoes(id):
        try:
            vereador = Vereador.query.get(id)
            
            if not vereador:
                return jsonify({'error': 'Vereador not found'}), 404
            
          
            status = request.args.get('status')
            
            query = Solicitacao.query.filter_by(vereador_id=id)
            
            if status:
                query = query.filter_by(status=status)
            
            solicitacoes = query.order_by(Solicitacao.created_at.desc()).all()
            
            return jsonify({
                'solicitacoes': [sol.to_dict() for sol in solicitacoes],
                'total': len(solicitacoes)
            }), 200
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/api/vereadores/stats', methods=['GET'])
    def get_vereadores_stats():
        try:
            
            total_solicitacoes = Solicitacao.query.filter(Solicitacao.vereador_id.isnot(None)).count()
            total_resolvidas = Solicitacao.query.filter(
                Solicitacao.status == 'resolvida',
                Solicitacao.vereador_id.isnot(None)
            ).count()
            total_abertas = Solicitacao.query.filter(
                Solicitacao.status == 'aberta',
                Solicitacao.vereador_id.isnot(None)
            ).count()
            total_em_andamento = Solicitacao.query.filter(
                Solicitacao.status == 'em_andamento',
                Solicitacao.vereador_id.isnot(None)
            ).count()
            
            
            resolvidas = Solicitacao.query.filter(
                Solicitacao.status == 'resolvida',
                Solicitacao.tempo_resolucao.isnot(None),
                Solicitacao.vereador_id.isnot(None)
            ).all()
            
            tempo_medio_geral = sum([s.tempo_resolucao for s in resolvidas]) / len(resolvidas) if resolvidas else 0
            
            
            cidadaos_engajados = db.session.query(Solicitacao.user_id).filter(
                Solicitacao.vereador_id.isnot(None)
            ).distinct().count()
            
            return jsonify({
                'total_solicitacoes': total_solicitacoes,
                'solicitacoes_resolvidas': total_resolvidas,
                'tempo_medio_resolucao': round(tempo_medio_geral, 1),
                'taxa_resolucao': round((total_resolvidas / total_solicitacoes * 100) if total_solicitacoes > 0 else 0, 0),
                'cidadaos_atendidos': cidadaos_engajados,
                'status_breakdown': {
                    'aberta': total_abertas,
                    'em_andamento': total_em_andamento,
                    'resolvida': total_resolvidas
                }
            }), 200
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
