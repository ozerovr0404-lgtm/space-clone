import './userWindow.css';
import { Link, useNavigate } from 'react-router-dom';

function UserWindow({ open, onClose }) {
    const navigate = useNavigate();

    if (!open) return null;

    const menuItems = [
        {
            label: "В разработке",
            path: ""
        },
        {
            label: "В разработке",
            path: ""
        },
        {
            label: "В разработке",
            path: ""
        },
        {
            label: "В разработке",
            path: ""
        },
        {
            label: "Выйти",
            action: "logout"
        },
    ]

    const handleItemClick = (item) => {
        
        if (item.action === 'logout') {
            localStorage.removeItem('token');
            onClose();
            console.log('Проверяем логаут')
            navigate('/login')
            return
        }

        if (item.path) {
            navigate(item.path);
            onClose();
            console.log('Не равен логауту')
        }
    }    

    return (
        <>
            
            <div className="user-window-overlay" onClick={onClose} />

            <div className="user-window">
                <div className='window-user-header'>
                    <div className='full-name'>
                        Озеров Р.С.
                    </div>
                    <div className='user-id'>
                        id 123456789
                    </div>
                </div>

                <div className='user-min-menu'>
                    {menuItems.map((item, index) => (
                        <div
                            key={index}
                            className="menu-item"
                            onClick={() => handleItemClick(item)}
                        >
                            {item.label}
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default UserWindow;