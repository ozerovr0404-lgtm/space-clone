import './userWindow.css';
import { Link } from 'react-router-dom';

function UserWindow({ open, onClose }) {

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
            path: "/login"
        },
    ]

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
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="menu-item"
                            target="_blank"
                            onclick={onClose}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>
        </>
    )
}

export default UserWindow;