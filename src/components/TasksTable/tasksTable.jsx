import './tasksTable.css';

function TasksTable({tasks}) {
    return (
        <table>
            <thead>
                <tr>
                    <th>id</th>
                    <th>Создатель</th>
                    <th>Заголовок</th>
                    <th>Тело задачи</th>
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