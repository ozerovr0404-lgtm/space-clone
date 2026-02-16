import './DrawerFilter.css';
import { useState } from 'react';
import StatusSelect from '../StatusSelect/statusSelect';
import UserSelectForFilter from '../DrawerFilter/UserSelectForFilter/userSelectForFilter';

function DrawerFilter( {open, onClose, onApply, users, assigneeId, setAssigneeId} ) {
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
                    <UserSelectForFilter
                        className="user-select-for-filter"
                        users={users}
                        value={assigneeId}
                        onChange={setAssigneeId}
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
                            <img
                            src="/cross-svgrepo-com.svg" /*Это кнопка "крестик" для закрытия дровера*/
                            alt="Close"
                            width={23}
                            height={25}
                            className='button-close-cross'
                        />
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