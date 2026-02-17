import { TASK_STATUSES } from '../../constants/taskStatus';
import './tasksTable.css';
import Select from 'react-select';
import AssigneeSelector from './AssigneeSelector/assigneeSelector';

function TasksTable({tasks, setTasks, users}) {

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

    const handleAssigneeChange = async (taskId, newAssigneeId) => {
        try {
            const token = localStorage.getItem('token');

            const res = await fetch(`http://localhost:5000/tasks/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ assignee_id: newAssigneeId })
            });

            const updateTask = await res.json();

            if (!res.ok) {
                console.error(updateTask.error);
                return;
            }

            setTasks(prev =>
                prev.map(t => t.id === taskId ? updateTask.task : t)
            );

        } catch (err) {
            console.error('Ошибка обновления исполнителя', err);
        }
    };

    
    return (
        <div className="table-wrapper">
            <table className='table-fixed'>
                <colgroup>
                    <col style={{ width: '60px' }} />
                    <col style={{ width: '240px' }} />
                    <col style={{ width: '200px' }} />
                    <col style={{ width: 'auto' }} />
                    <col style={{ width: '240px' }} />
                    <col style={{ width: '180px' }} />
                    <col style={{ width: '205px' }} />
                </colgroup>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>Создатель</th>
                        <th>Заголовок</th>
                        <th>Тело задачи</th>
                        <th>Ответственный</th>
                        <th>Статус</th>
                        <th>Дата и время создания</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(task => (
                        task ? (
                        <tr key={task.id}>
                            <td>{task.id}</td>
                            <td>{task.creator_full_name}</td>
                            <td>{task.title}</td>
                            <td>{task.body}</td>
                            <td>
                                <AssigneeSelector
                                    users={users}
                                    value={task.assignee_id}
                                    onChange={(newUserId) => handleAssigneeChange(task.id, newUserId)}
                                />
                            </td>
                            <td>
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
                                            backgroundColor: state.isFocused ? '#eee' : 'white'
                                        }),
                                        singleValue: (provided, state) => ({
                                            ...provided,
                                            color: state.data.color
                                        }),
                                        control: (provided) => ({
                                            ...provided,
                                            width: '100%',
                                            minHeight: 36,
                                            borderRadius: 6,
                                            borderColor: '#606381ff',
                                        })
                                    }}
                                />
                            </td>
                            <td>{new Date(task.created_at).toLocaleString('ru-RU', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                            })}</td>
                        </tr>
                        ) : null
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default TasksTable;