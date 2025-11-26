from extensions import db
from models import User, Vereador, Categoria, Bairro, Solicitacao
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta
import json

bcrypt = Bcrypt()

def seed_database():
    from app import app
    
    with app.app_context():
       
        db.drop_all()
        db.create_all()
        
        print("Seeding database...")
        
     
        categorias = [
            Categoria(nome='Pavimentação', icone='road'),
            Categoria(nome='Iluminação', icone='lightbulb'),
            Categoria(nome='Saúde', icone='heart'),
            Categoria(nome='Educação', icone='book'),
            Categoria(nome='Saneamento', icone='droplet'),
            Categoria(nome='Segurança', icone='shield'),
            Categoria(nome='Transporte', icone='bus'),
            Categoria(nome='Meio Ambiente', icone='tree'),
        ]
        db.session.add_all(categorias)
        db.session.commit()
        print(f"Created {len(categorias)} categories")
        
       
        bairros = [
            Bairro(nome='Centro'),
            Bairro(nome='Zona Norte'),
            Bairro(nome='Zona Sul'),
            Bairro(nome='Zona Leste'),
            Bairro(nome='Zona Oeste'),
            Bairro(nome='Periferia'),
        ]
        db.session.add_all(bairros)
        db.session.commit()
        print(f"Created {len(bairros)} neighborhoods")
        
    
        password_hash = bcrypt.generate_password_hash('senha123').decode('utf-8')
        
        cidadao1 = User(
            email='joao@email.com',
            password_hash=password_hash,
            nome='João Silva',
            tipo_usuario='cidadao',
            telefone='(11) 98765-4321'
        )
        
        cidadao2 = User(
            email='maria@email.com',
            password_hash=password_hash,
            nome='Maria Santos',
            tipo_usuario='cidadao',
            telefone='(11) 98765-1234'
        )
        
        db.session.add_all([cidadao1, cidadao2])
        db.session.commit()
        print("Created citizen users")
        
        
        vereador_users = []
        vereadores_data = [
            {'nome': 'Carlos Lima', 'partido': 'PSDB', 'email': 'carlos.lima@camara.gov.br'},
            {'nome': 'Maria Oliveira', 'partido': 'PT', 'email': 'maria.oliveira@camara.gov.br'},
            {'nome': 'João Santos', 'partido': 'PMDB', 'email': 'joao.santos@camara.gov.br'},
        ]
        
        for vdata in vereadores_data:
            user = User(
                email=vdata['email'],
                password_hash=password_hash,
                nome=vdata['nome'],
                tipo_usuario='vereador',
                telefone='(11) 3000-0000'
            )
            db.session.add(user)
            vereador_users.append((user, vdata))
        
        db.session.commit()
        print("Created vereador users")
        
      
        vereadores = []
        for user, vdata in vereador_users:
            vereador = Vereador(
                user_id=user.id,
                nome=vdata['nome'],
                partido=vdata['partido'],
                foto_url=f'/placeholder.svg?height=100&width=100'
            )
            db.session.add(vereador)
            vereadores.append(vereador)
        
        db.session.commit()
        print(f"Created {len(vereadores)} vereadores")
        
    
        solicitacoes = [
            Solicitacao(
                titulo='Buraco na Rua das Flores',
                categoria_id=1,
                descricao='Grande buraco na via principal causando acidentes',
                endereco='Rua das Flores, 123',
                bairro_id=1,
                cep='01234-567',
                latitude=-23.5505,
                longitude=-46.6333,
                fotos=json.dumps(['/placeholder.svg?height=300&width=400']),
                status='aberta',
                anonimo=False,
                user_id=cidadao1.id,
                created_at=datetime.utcnow() - timedelta(days=23)
            ),
            Solicitacao(
                titulo='Iluminação deficiente na Praça Central',
                categoria_id=2,
                descricao='Várias lâmpadas queimadas comprometem a segurança',
                endereco='Praça Central',
                bairro_id=1,
                cep='01234-567',
                latitude=-23.5515,
                longitude=-46.6343,
                fotos=json.dumps(['/placeholder.svg?height=300&width=400']),
                status='em_andamento',
                anonimo=False,
                user_id=cidadao2.id,
                vereador_id=vereadores[2].id,
                created_at=datetime.utcnow() - timedelta(days=45)
            ),
            Solicitacao(
                titulo='Falta de médicos no posto de saúde',
                categoria_id=3,
                descricao='Posto de saúde do bairro está sem médicos há semanas',
                endereco='Rua da Saúde, 456',
                bairro_id=2,
                cep='02345-678',
                latitude=-23.5525,
                longitude=-46.6353,
                fotos=json.dumps([]),
                status='resolvida',
                anonimo=False,
                user_id=cidadao1.id,
                vereador_id=vereadores[1].id,
                created_at=datetime.utcnow() - timedelta(days=30),
                updated_at=datetime.utcnow() - timedelta(days=20),
                tempo_resolucao=10
            ),
        ]
        
    
        for i in range(20):
            sol = Solicitacao(
                titulo=f'Solicitação #{i+4}',
                categoria_id=(i % 8) + 1,
                descricao=f'Descrição da solicitação {i+4}',
                endereco=f'Rua Exemplo, {i+100}',
                bairro_id=(i % 6) + 1,
                status=['aberta', 'em_andamento', 'resolvida'][i % 3],
                anonimo=i % 3 == 0,
                user_id=cidadao1.id if i % 2 == 0 else cidadao2.id,
                vereador_id=vereadores[i % 3].id if i % 2 == 0 else None,
                created_at=datetime.utcnow() - timedelta(days=60-i),
                tempo_resolucao=(10 + i) if i % 3 == 2 else None
            )
            solicitacoes.append(sol)
        
        db.session.add_all(solicitacoes)
        db.session.commit()
        print(f"Created {len(solicitacoes)} requests")
        
        print("\nDatabase seeded successfully!")
        print("\nTest credentials:")
        print("Citizen: joao@email.com / senha123")
        print("Vereador: carlos.lima@camara.gov.br / senha123")

if __name__ == '__main__':
    seed_database()
