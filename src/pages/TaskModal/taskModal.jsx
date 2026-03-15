import './taskModal.css';
import { TASK_STATUSES } from '../../constants/taskStatus';
import Select from 'react-select';
import AssigneeSelector from '../TaskPage/Selectors/AssigneeSelector/assigneeSelector';

function TaskModal({open, onClose, task}) {
    if (!task || !open) {
        return null;
    }

    return (
        <>

            {open && <div className='modal-window' onClick={onClose} />}

            <div className={`background-modal ${open ? "background-modal-open" : ""}`}>
                <div className='modal-header'>
                    <h2>{task.title}</h2>
                    
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
                    <p>Ответственный: {task.assignee_full_name}</p>
                    <p>Статус: {task.status}</p>
                    <p>{task.body}</p>
                    
                </div>

            </div>
        </>
    )
}

export default TaskModal;