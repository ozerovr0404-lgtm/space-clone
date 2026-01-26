import './userMenu.css';

function UserMenu({ open, onClose, children }) {


    return (

        <>
            {open && <div className="user-window" onClick={onClose} />}

            <div className={`window ${open ? "window-open" : ""}`}>

            

                <button onClick={onClose} className="user-icon">
                    <img
                        src="/user.svg" //иконка юзера в левый нижний угол
                        alt="User"
                        width={25}
                        height={22}
                    />
                </button>

                <div className="window-body">
                    {children}
                </div>
            </div>
        </>
    )
}

export default UserMenu;