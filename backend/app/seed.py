from app import create_app, db
from app.models import Guide


def seed():
    app = create_app()
    with app.app_context():
        # Create sample guides (joined-table inheritance will also create User rows)
        samples = [
            Guide(
                email='maria.santos@example.com',
                name_romanized='Maria Santos',
                bio='ガウディ建築と地元のタパス文化に精通した認定美術史家です。',
                specialties='art,food,architecture',
                rating=4.9,
                languages='es,en,ja',
                areas='barcelona,catalonia',
                price_range='8000-15000',
            ),
            Guide(
                email='kenji.tanaka@example.com',
                name_romanized='Kenji Tanaka',
                bio='元シェフで、隠れたラーメン店や伝統的な寺社の案内が得意です。',
                specialties='food,culture,temples',
                rating=4.8,
                languages='ja,en',
                areas='tokyo,kanto',
                price_range='9000-16000',
            ),
            Guide(
                email='youssef.elfassi@example.com',
                name_romanized='Youssef El-Fassi',
                bio='ベルベル文化に精通した三代目スーク商人です。',
                specialties='markets,history,culture',
                rating=4.9,
                languages='ar,fr,en,ja',
                areas='marrakech,morocco',
                price_range='7000-14000',
            ),
        ]

        # Set passwords and add to session
        for g in samples:
            g.set_password('password123')
            db.session.add(g)

        db.session.commit()
        print('Seed data inserted: {} guides'.format(len(samples)))


if __name__ == '__main__':
    seed()

