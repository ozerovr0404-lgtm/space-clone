import { TASK_STATUSES } from '../../constants/taskStatus';
import './tasksTable.css';
import Select from 'react-select';

function TasksTable({tasks, setTasks}) {

    const handleStatusChange = async (taskId, newStatus) => {
        
        try {
            const res = await fetch(`http://localhost:5000/tasks/${taskId}`, {
                method: 'PATCH', //для частичного обновления
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            const updateTask = await res.json();
            console.log('Обновлённая задача:', updateTask)

            setTasks(prevTasks => 
                prevTasks.map(t => t.id === taskId ? updateTask.task : t)
            );
        } catch (err) {
            console.error('Ошибка при обновлении статуса', err);
        }
    }
    return (
        <table>
            <thead>
                <tr>
                    <th>id</th>
                    <th>Создатель</th>
                    <th>Заголовок</th>
                    <th>Тело задачи</th>
                    <th>Статус</th>
                    <th>Дата и время создания</th>
                </tr>
            </thead>
            <tbody>
                {tasks.map(task => (
                    <tr key={task.id}>
                        <td>{task.id}</td>
                        <td>{task.creator}</td>
                        <td>{task.title}</td>
                        <td>{task.body}</td>
                        <td>
                            <Select
                                value={TASK_STATUSES.find(o => o.value === task.status)}
                                onChange={selected => handleStatusChange(task.id, selected.value)}
                                options={TASK_STATUSES}
                                menuPortalTarget={document.body}
                                menuPosition='fixed'
                                menuPlacement='auto'
                                styles={{
                                    menuPortal: base=> ({
                                        ...base,
                                        zIndex: 10
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
                                        minWidth: 160,
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
                ))}
            </tbody>
        </table>
    )
}

export default TasksTable;