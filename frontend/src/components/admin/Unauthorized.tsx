import { Link } from 'react-router-dom';

export function Unauthorized() {
  return (
    <div className="dashboard-loading" role="alert">
      <h2>Acesso não autorizado</h2>
      <p>Seu usuário está autenticado, mas não possui permissão para esta área.</p>
      <Link to="/" className="btn-primary" style={{ textDecoration: 'none' }}>
        Voltar para a loja
      </Link>
    </div>
  );
}

