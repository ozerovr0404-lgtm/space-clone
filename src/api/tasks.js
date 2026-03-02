export async function searchTasks(search) {
    const response = await fetch(
        `http://localhost:5000/tasks?search=${encodeURIComponent(search)}`
    );

    if (!response.ok) {
        throw new Error('Ошибка при получении задач');
    }

    return response.json();
}