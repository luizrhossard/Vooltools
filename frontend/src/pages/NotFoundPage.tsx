import { Link } from 'react-router-dom';

export function NotFoundPage() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80vh',
            textAlign: 'center',
            padding: '2rem'
        }}>
            <h1 style={{ fontSize: '6rem', fontWeight: 'bold', color: '#333' }}>404</h1>
            <p style={{ fontSize: '1.5rem', color: '#666', marginBottom: '2rem' }}>
                Página não encontrada
            </p>
            <Link
                to="/"
                style={{
                    padding: '0.75rem 2rem',
                    backgroundColor: '#f97316',
                    color: '#fff',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    fontWeight: 'bold'
                }}
            >
                Voltar para a loja
            </Link>
        </div>
    );
}
