export const updateTaskAssignee = async (taskId, newAssigneeId) => {
    const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('Нет токена');
        }

        const res = await fetch(`http://localhost:5000/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({assignee_id: newAssigneeId})
        });

        const data = await res.json();

        if(!res.ok) {
            throw new Error(data.error || 'Ошибка обновления исполнителя')
        }

        return data.task
};