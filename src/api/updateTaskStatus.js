export const updateTaskStatus = async (taskId, newStatus) => {
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error('Нет токена');
    }

    const res = await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({status: newStatus})
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || 'Ошибка обновления статуса');
    }

    return data.task;
};