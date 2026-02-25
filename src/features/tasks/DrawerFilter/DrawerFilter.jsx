import './DrawerFilter.css';
import { useState, useEffect } from 'react';
import StatusSelect from '../../../pages/TaskPage/Selectors/StatusSelector/statusSelect';
import UserSelectForFilter from '../../../pages/TaskPage/Selectors/UserSelectForFilter/userSelectForFilter';

function DrawerFilter( {open, onClose, onApply, users, assigneeId} ) {
    const [status, setStatus] = useState(null);
    const [localAssigneeId, setLocalAssigneeId] = useState(assigneeId);

    useEffect(() => {
        if (open) {
            setStatus(status);
            setLocalAssigneeId(assigneeId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, assigneeId]);

    const handleApply = () => {
        onApply({ status, assigneeId: localAssigneeId });
        onClose();
    };

    const handleReset = () => {
        setStatus(null);
        setLocalAssigneeId(null);
        onApply({ status: null, assigneeId: null });
        onClose();
    };
    

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
                        value={localAssigneeId}
                        onChange={setLocalAssigneeId}
                    />

                    <div className='down-line'>
                        <button
                            type="button"
                            className="reset-filtered"
                            onClick={handleReset}
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
                            onClick={handleApply}
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