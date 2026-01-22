import './registerModal.css'
import { useState } from 'react';

function RegisterModal({ onClose }) {
    const [login,setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login, password })
            });
            
            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Ошибка регистрации');
                return;
            }

            onClose();

        } catch (err) {
            setError('Ошибка соединения с сервером');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">

                <h3 className="reg-title">Регистрация</h3>

                <form onSubmit={handleSubmit} className="register-form">
                    <input
                        type="text"
                        placeholder="Логин"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                    />

                    <input 
                        type="password"
                        placeholder='Пароль'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                    />

                    <button type="submit" className="get-register">Зарегистрироваться</button>
                </form>

                {error && <p className="error">{error}</p>}

                <button className="close" onClick={onClose}>Закрыть</button>

            </div>
        </div>
    );
}

export default RegisterModal;