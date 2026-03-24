import './userWindow.css';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function UserWindow({ open, onClose }) {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("http://localhost:5000/me", {
                    headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                
                const data = await res.json();
                setCurrentUser(data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchUser();
    }, []);
    
    if (!open) return null;

    const menuItems = [
        {
            label: "ЛК пользователя",
            path: "profile"
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
        
        if (item.path === 'profile') {
            if (!currentUser?.id) return;

            navigate(`/user/${currentUser.id}`);
            onClose();
            return;
        }

        if (item.action === 'logout') {
            localStorage.removeItem('token');
            onClose();
            console.log('Пользователь разовтаризован!')
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
                        
                        {`${currentUser?.last_name} ${currentUser?.first_name?.split("").splice(0, 1).join("")}. ${currentUser?.middle_name?.split("").splice(0, 1).join("")}.`}
                    </div>
                    <div className='user-id'>
                        {`Идентификатор: ${currentUser?.id}`}
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