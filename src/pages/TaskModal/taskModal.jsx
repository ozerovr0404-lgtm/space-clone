import './taskModal.css';
import { TASK_STATUSES } from '../../constants/taskStatus';
import Select from 'react-select';

function TaskModal({open, onClose, task, setTasks}) {

    const handleStatusChange = async (taskId, newStatus) => {
        
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                console.error('Нет токена!');
                return;
            }

            const res = await fetch(`http://localhost:5000/tasks/${taskId}`, {
                method: 'PATCH', //для частичного обновления
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                 },
                body: JSON.stringify({ status: newStatus })
            });

            const updateTask = await res.json();
            if (!res.ok) {
                console.error('Ошибка сервера при обновлении задачи:', updateTask.error);
                return;
            }
            console.log('Обновлённая задача:', updateTask)

            setTasks(prevTasks => 
                prevTasks.map(t => t.id === taskId ? updateTask.task : t)
            );
        } catch (err) {
            console.error('Ошибка при обновлении статуса', err);
        }
    }

    if (!task) {
        return null;
    }

    return (
        <>
            {open && <div className='modal-window-backdrop' onClick={onClose} />}

            <div className={`background-modal ${open ? "background-modal-open" : ""}`}>
                <div className='modal-header'>
                    <h2>Задача #{task.id}</h2>
                    
                    <button onClick={onClose} className='close-modal-cross'>
                        <img
                            src="/cross-svgrepo-com.svg" /*Это кнопка "крестик" для закрытия дровера*/
                            alt="Close"
                            width={23}
                            height={25}
                        />
                    </button>
                </div>

                <div className='modal-window-body'>

                    <div className='group-task-creator'>
                        <div className='task-title-creator'>
                            Создатель
                        </div>
                        <div className='task-title-creator-field'>
                            {task.creator_full_name}
                        </div>
                    </div>

                    <div className='group-task-title-main'>
                        <div className='task-title-main'>
                            Заголовок
                        </div>
                        <div className='task-title-modal'>
                            {task.title}
                        </div>
                    </div>

                    <div className='group-assignee-modal'>
                        <div className='assignee-title-modal'>
                            Ответственный
                        </div>
                        <div className='assignee-name-modal'>
                            {task.assignee_full_name}
                        </div>
                    </div>
                    
                    <div className='group-task-status'>
                        <div className='status-title-modal'>Статус</div>
                        <div className='modal-task-status'>
                            <Select
                                value={TASK_STATUSES.find(o => o.value === task.status)}
                                onChange={selected => handleStatusChange(task.id, selected?.value || null)}
                                options={TASK_STATUSES}
                                menuPortalTarget={document.body}
                                menuPosition='fixed'
                                menuPlacement='auto'
                                styles={{
                                    menuPortal: base=> ({
                                        ...base,
                                        zIndex: 1000
                                    }),
                                    option: (provided, state) => ({
                                        ...provided,
                                        color: state.data.color,
                                        backgroundColor: state.isFocused ? '#eee' : 'white',
                                    }),
                                    singleValue: (provided, state) => ({
                                        ...provided,
                                        color: state.data.color
                                    }),
                                    control: (provided) => ({
                                        ...provided,
                                        width: '250px',
                                        minHeight: 36,
                                        borderRadius: 6,
                                        borderColor: '#eee',
                                        
                                    })
                                }}
                            />
                        </div>
                    </div>

                    <div className='group-task-body'>
                        <div className='title-task-body-modal'>Тело задачи</div>
                        <div className='task-body-modal'>
                            {task.body}
                        </div>
                    </div>
                    
                    <div className='group-date_time'>
                        <div className='task-date_time-title'>
                            Дата и время создания
                        </div>
                        <div className='task-date_time'>
                            {new Date(task.created_at).toLocaleString('ru-RU', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                            })}
                        </div>
                    </div>
                    
                </div>

                <div className='down-line-task-modal'>
                    
                </div>
                
            </div>
        </>
    )
}

export default TaskModal;