import { TASK_STATUSES } from '../../../constants/taskStatus';
import './tasksTable.css';
import Select from 'react-select';
import AssigneeSelector from '../Selectors/AssigneeSelector/assigneeSelector';
import { updateTaskAssignee } from '../../../api/updateTaskAssignee';
import { updateTaskStatus } from '../../../api/updateTaskStatus';

function TasksTable({tasks, setTasks, users, onTaskClick}) {

    const handleStatusChange = async (taskId, newStatus) => {
        
        try {
            const updateTask = await updateTaskStatus(taskId, newStatus);

            setTasks(prevTasks => 
                prevTasks.map(task => task.id === taskId ? updateTask : task)
            );

        } catch (err) {
            console.error('Ошибка при обновлении статуса', err);
        }
    }

    const handleAssigneeChange = async (taskId, newAssigneeId) => {
        try {
            const updateTaskAss = await updateTaskAssignee(taskId, newAssigneeId);

            setTasks(prev =>
                prev.map(task => task.id === taskId ? updateTaskAss : task)
            );
            console.log(updateTaskAss)

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
                    <col style={{ width: '600px'}} />
                    <col style={{ width: '260px' }} />
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
                            <td
                                className='task-body-ceil'
                                onClick={() => onTaskClick(task)}
                            >
                                {task.body}
                            </td>
                            <td>
                                <AssigneeSelector
                                    users={users}
                                    value={task.assignee_id}
                                    onChange={(newAssigneeId) => handleAssigneeChange(task.id, newAssigneeId)}
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