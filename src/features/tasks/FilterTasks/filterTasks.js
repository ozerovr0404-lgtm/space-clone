export function filteredTasks(tasks, {status = null, assigneeId = null}) {
    if (!Array.isArray(tasks)) return [];

    return tasks.filter(task => {
        let statusMatch = status 
        ? String(task.status) === String(status) 
        : true;

        let assigneeMatch = assigneeId 
        ? String(task.assignee_id) === String(assigneeId) 
        : true;

        console.log(tasks[0])
        return statusMatch && assigneeMatch;
    });
}

// Неактуально - выпилить