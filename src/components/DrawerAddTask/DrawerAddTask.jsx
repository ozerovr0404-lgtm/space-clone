import "./DrawerAddTask.css";



function Drawer({ open, onClose, children }) {
    return (

        <>
            
            {open && <div className="drawer-backdrop" onClick={onClose} />}

            <div className={`drawer ${open ? "drawer-open" : "" }`}>
                <div className="drawer-header">
                    <h2>Новая задача</h2>
                    <button onClick={onClose} className="close-cross">
                        <img
                            src="/cross-svgrepo-com.svg"
                            alt="Close"
                            width={23}
                            height={25}
                        />
                    </button>
                </div>

                <div className="drawer-body">
                    {children}
                </div>
            </div>
        </>
    );
}

export default Drawer;