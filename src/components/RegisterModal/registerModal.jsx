import './registerModal.css'
import { useState } from 'react';

function RegisterModal({ onClose }) {
    const [login,setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [first_name, setFirst_name] = useState('');
    const [last_name, setLast_name] = useState('');
    const [middle_name, setMiddle_name] = useState('');
    const role = null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password === repeatPassword) {  //Но лучше сделать через (password !== repeatPassword) чтобы была возможность добавлять иные проверки и почистить код
            try {
                const response = await fetch('http://localhost:5000/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ login, password, first_name, last_name, middle_name, role })
                });
                
                const data = await response.json();

                if (!response.ok) {
                    setError(data.error || 'Ошибка регистрации');
                    return;
                } else {
                    onClose();
                }

            } catch (err) {
                setError('Ошибка соединения с сервером');
            }
        } else {
            setError('Пароли должны совпадать!')
        }

    }

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
                        className='register-login'
                    />

                    <input
                        type="text"
                        placeholder="Фамилия"
                        value={first_name}
                        onChange={(e) => setFirst_name(e.target.value)}
                        className='register-first-name'
                    />

                    <input
                        type="text"
                        placeholder="Имя"
                        value={last_name}
                        onChange={(e) => setLast_name(e.target.value)}
                        className='register-last-name'
                    />

                    <input
                        type="text"
                        placeholder="Отчество"
                        value={middle_name}
                        onChange={(e) => setMiddle_name(e.target.value)}
                        className='register-middle-name'
                    />

                    <input 
                        type="password"
                        placeholder='Пароль'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Повторите пароль"
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
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