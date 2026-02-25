export function filteredTasks(tasks, {status = null, assigneeId = null}) {
    if (!Array.isArray(tasks)) return [];

    return tasks.filter(task => {
        let statusMatch = status ? task.status === status : true;
        let assigneeMatch = assigneeId ? task.assignee_id == assigneeId : true;
        return statusMatch && assigneeMatch;
    });
}