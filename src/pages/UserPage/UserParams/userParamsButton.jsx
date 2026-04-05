import './userParamsButton.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import UserPhoto from '../UserPhoto/userPhoto';
import UserName from '../UserName/userName';

function ParamsButton() {
    const [activeSection, setActiveSection] = useState('user-info');

    const sectionContent = {
        'user-info': (
            <div>
                <h2>Личная информация</h2>
                <p>Имя</p>
                <p>Фамилия</p>
                <p>Отчество</p>
                <p>Email</p>
            </div>
        ),
        'user-settings': (
            <div>
                <h2>Параметры пользователя</h2>
                <div className='user-settings-field'>
                    <label>Тема:</label>
                    <select>
                        <option>Светлая</option>
                        <option>Темная</option>
                    </select>
                </div>
                <div className='user-settings-field'>
                    <label>Уведомления</label>
                    <input type='checkbox' defaultChecked />
                </div>
            </div>
        ),
        'user-security': (
            <div>
                <h2>Безопасность</h2>
                <div className='user-settings-field'>
                    <label>Смена пароля</label>
                    <input type='password' placeholder='Новый пароль' />
                    <input type='password' placeholder='Повторите пароль' />
                </div>
            </div>
        )
    }

    return (
        <div className='params-container'>
            <div className='params-conteiner-controller'>
                <UserPhoto />
                <UserName />

                <div className='user-sidebar'>
                    <button
                        className={activeSection === 'user-info' ? 'active' : ''}
                        onClick={() => setActiveSection('user-info')}
                    >
                        Личная информация
                    </button>
                    <button
                        className={activeSection === 'user-settings' ? 'active' : ''}
                        onClick={() => setActiveSection('user-settings')}
                    >
                        Параметры пользователя
                    </button>
                    <button
                        className={activeSection === 'user-security' ? 'active' : ''}
                        onClick={() => setActiveSection('user-security')}
                    >
                        Безопасность
                    </button>
                </div> 
            </div>

            <div className='user-content'>
                {sectionContent[activeSection] || <div>Выберите раздел</div>}
            </div>
        </div>
    )
}

export default ParamsButton;