from extensions import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    nome = db.Column(db.String(100), nullable=False)
    tipo_usuario = db.Column(db.String(20), nullable=False, default='cidadao')  # cidadao or vereador
    telefone = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    solicitacoes = db.relationship('Solicitacao', backref='usuario', lazy=True, foreign_keys='Solicitacao.user_id')
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'nome': self.nome,
            'tipo_usuario': self.tipo_usuario,
            'telefone': self.telefone,
            'created_at': self.created_at.isoformat()
        }

class Vereador(db.Model):
    __tablename__ = 'vereadores'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    nome = db.Column(db.String(100), nullable=False)
    partido = db.Column(db.String(20), nullable=False)
    foto_url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    solicitacoes = db.relationship('Solicitacao', backref='vereador', lazy=True, foreign_keys='Solicitacao.vereador_id')
    user = db.relationship('User', backref='vereador_profile', lazy=True)
    areas_atuacao = db.relationship('VereadorArea', backref='vereador', lazy=True)
    
    def calculate_stats(self):
        total_assumidas = len([s for s in self.solicitacoes if s.vereador_id == self.id])
        total_resolvidas = len([s for s in self.solicitacoes if s.status == 'resolvida'])
        
        # Calculate average resolution time
        resolvidas_com_tempo = [s for s in self.solicitacoes if s.status == 'resolvida' and s.tempo_resolucao]
        tempo_medio = sum([s.tempo_resolucao for s in resolvidas_com_tempo]) / len(resolvidas_com_tempo) if resolvidas_com_tempo else 0
        
        return {
            'solicitacoes_assumidas': total_assumidas,
            'solicitacoes_resolvidas': total_resolvidas,
            'tempo_medio_resolucao': round(tempo_medio, 1),
            'taxa_resolucao': round((total_resolvidas / total_assumidas * 100) if total_assumidas > 0 else 0, 0)
        }
    
    def to_dict(self, include_stats=True):
        data = {
            'id': self.id,
            'nome': self.nome,
            'partido': self.partido,
            'foto_url': self.foto_url,
            'created_at': self.created_at.isoformat()
        }
        
        if include_stats:
            stats = self.calculate_stats()
            data.update(stats)
            
            # Get top areas
            areas = db.session.query(
                Categoria.nome,
                db.func.count(Solicitacao.id).label('count')
            ).join(
                Solicitacao, Solicitacao.categoria_id == Categoria.id
            ).filter(
                Solicitacao.vereador_id == self.id
            ).group_by(
                Categoria.nome
            ).order_by(
                db.desc('count')
            ).limit(3).all()
            
            data['principais_areas'] = [{'area': area.nome, 'count': area.count} for area in areas]
        
        return data

class Categoria(db.Model):
    __tablename__ = 'categorias'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(50), unique=True, nullable=False)
    icone = db.Column(db.String(50))
    
    solicitacoes = db.relationship('Solicitacao', backref='categoria', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'icone': self.icone
        }

class Bairro(db.Model):
    __tablename__ = 'bairros'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), unique=True, nullable=False)
    
    solicitacoes = db.relationship('Solicitacao', backref='bairro', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome
        }

class Solicitacao(db.Model):
    __tablename__ = 'solicitacoes'
    
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(200), nullable=False)
    categoria_id = db.Column(db.Integer, db.ForeignKey('categorias.id'), nullable=False)
    descricao = db.Column(db.Text, nullable=False)
    endereco = db.Column(db.String(255))
    bairro_id = db.Column(db.Integer, db.ForeignKey('bairros.id'))
    cep = db.Column(db.String(20))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    fotos = db.Column(db.Text)  # JSON array as string
    status = db.Column(db.String(20), nullable=False, default='aberta')  # aberta, em_andamento, resolvida
    anonimo = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    vereador_id = db.Column(db.Integer, db.ForeignKey('vereadores.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    tempo_resolucao = db.Column(db.Integer)  # in days
    
    def calculate_tempo_resolucao(self):
        if self.status == 'resolvida':
            delta = self.updated_at - self.created_at
            return delta.days
        return None
    
    def to_dict(self, include_user=False):
        import json
        
        data = {
            'id': self.id,
            'titulo': self.titulo,
            'categoria': self.categoria.nome if self.categoria else None,
            'categoria_id': self.categoria_id,
            'descricao': self.descricao,
            'endereco': self.endereco,
            'bairro': self.bairro.nome if self.bairro else None,
            'bairro_id': self.bairro_id,
            'cep': self.cep,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'fotos': json.loads(self.fotos) if self.fotos else [],
            'status': self.status,
            'anonimo': self.anonimo,
            'vereador_id': self.vereador_id,
            'vereador_nome': self.vereador.nome if self.vereador else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'tempo_resolucao': self.tempo_resolucao
        }
        
        if include_user and not self.anonimo:
            data['usuario'] = self.usuario.to_dict()
        
        return data

class VereadorArea(db.Model):
    __tablename__ = 'vereador_areas'
    
    id = db.Column(db.Integer, primary_key=True)
    vereador_id = db.Column(db.Integer, db.ForeignKey('vereadores.id'), nullable=False)
    categoria_id = db.Column(db.Integer, db.ForeignKey('categorias.id'), nullable=False)
    
    categoria = db.relationship('Categoria', backref='vereador_areas', lazy=True)
