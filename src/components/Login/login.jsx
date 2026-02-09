import './login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterModal from '../RegisterModal/registerModal'

function Login() {

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [openRegister, setOpenRegister] = useState(false);


    const handleSubmit = async (e) => {

        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ login, password })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Ошибка авторизации');
                return
            }

            localStorage.setItem('token', data.token);

            navigate('/tasks');
            
        } catch (err) {
            console.error(err);
            setError('Ошибка соединения с сервером');
        }
    };


    return (
    <div className='login-page-body'>
        <div className='backgorund-login-page'>
            <div className="login-page">
                <h2 className="auth-title">Авторизация</h2>

                <form onSubmit={handleSubmit} className="login-form">
                        <input
                            className="login-text"
                            type="text"
                            placeholder="Логин"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                    <button type="submit" className="auth-button">Войти</button>
                </form>

                <button type="button" onClick={() => setOpenRegister(true)} className="register-button">
                    Зарегистрироваться
                </button>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                {openRegister && (
                    <RegisterModal onClose={() => setOpenRegister(false)} />
                )}
            </div>
        </div>
    </div>
    );
}

export default Login;