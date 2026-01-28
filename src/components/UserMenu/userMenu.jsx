import './userMenu.css';

function UserMenu({ onClick }) {


    return (
            <button onClick={onClick} className="user-icon">
                <img
                    src="/user.svg" //иконка юзера в левый нижний угол
                    alt="User"
                    width={25}
                    height={22}
                />
            </button>
    )
}

export default UserMenu;