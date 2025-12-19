import './tasksTable.css';

function TasksTable({children}) {
    return (
        <table>
            <thead>
                <tr>
                    <th scope="col">Заголовок</th>
                    <th scope="col">Категория</th>
                    <th scope="col">Статус выполнения</th>
                    <th scope="col">Срок</th>
                    <th scope="col">Дата создания</th>
                    <th scope="col">Ответственный</th>
                    <th scope="col">Создатель</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">{children}</th>
                    <th scope="row">{children}</th>
                    <th scope="row">{children}</th>
                    <th scope="row">{children}</th>
                    <th scope="row">{children}</th>
                    <th scope="row">{children}</th>
                    <th scope="row">{children}</th>
                </tr>
            </tbody>
        </table>
    )
}

export default TasksTable;