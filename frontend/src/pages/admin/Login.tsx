import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { getApiErrorMessage } from '../../lib/apiClient';
import './Login.css';

export function AdminLogin() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAdminAuth();
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const password = passwordRef.current?.value ?? '';

        try {
            await login(email, password);
            navigate('/admin');
        } catch (error: unknown) {
            setError(getApiErrorMessage(error, 'Erro ao fazer login. Verifique suas credenciais.'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="login-container">
                <div className="login-box">
                    <div className="login-header">
                        <img src="/static/logo-volttools.png" alt="VoltTools" className="login-logo" />
                        <h1>Área Administrativa</h1>
                        <p>Faça login para acessar o painel</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        {error && <div className="error-message">{error}</div>}

                        <div className="form-group">
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@volttools.com.br"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Senha</label>
                            <input
                                type="password"
                                id="password"
                                ref={passwordRef}
                                placeholder="••••••••"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <button type="submit" className="login-btn" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <span className="spinner"></span>
                                    Entrando...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-sign-in-alt"></i>
                                    Entrar
                                </>
                            )}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>&copy; 2026 VoltTools. Todos os direitos reservados.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
