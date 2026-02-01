import './DrawerFilter.css';
import { useState } from 'react';
import StatusSelect from '../StatusSelect/statusSelect';

function DrawerFilter( {open, onClose, onApply} ) {
    const [status, setStatus] = useState(null);

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
                    <StatusSelect
                        value={status}
                        onChange={setStatus}
                    />
                    <div className='down-line'>
                        <button
                            type="button"
                            className="reset-filtered"
                            onClick={() => {
                                setStatus(null)
                                onApply({ status: null })
                                onClose()
                            }}
                        >
                            Сбросить
                        </button>
                        
                        <button 
                            type="button" 
                            className="apply-filter"
                            onClick={() => {
                                onApply({ status })
                                onClose()
                            }}
                        >
                            Применить
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DrawerFilter;