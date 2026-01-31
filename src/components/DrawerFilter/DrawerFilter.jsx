import './DrawerFilter.css';

function DrawerFilter( {open, onClose, children} ) {
    return (
        <>
            {open && <div className='drawer-backdrop-filter' onClick={onClose} />}

            <div className={`drawer-filter ${open ? 'drawer-filter-open' : ''}`}>
                <div className='drawer-filter-header'>
                    <h2>Фильтр задач</h2>
                        <button onClick={onClose} className="close-filter-cross">
                            <img
                                src="/cross-svgrepo-com.svg" /*Это кнопка "крестик" для закрытия дровера*/
                                alt="Close"
                                width={23}
                                height={25}
                            />
                        </button>
                </div>

                <div className='drawer-filter-body'>
                    {children}
                </div>
            </div>
        </>
    )
}

export default DrawerFilter;