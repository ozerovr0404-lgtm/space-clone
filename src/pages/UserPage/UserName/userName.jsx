import './userName.css';
import { useEffect, useState } from 'react';

function UserName() {

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchUserFullName = async () => {
            try {
                const res = await fetch("http://localhost:5000/me", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                const data = await res.json();
                setCurrentUser(data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchUserFullName();
    }, []);

    return (
        <div className='user-full-name'>
            {`${currentUser?.last_name} ${currentUser?.first_name} ${currentUser?.middle_name}`}
        </div>
    )
}

export default UserName;