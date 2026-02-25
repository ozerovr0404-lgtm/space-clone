import './addTask.css';
import { useState } from 'react';

function AddTask({onAddTask}) {

    const [title,setTitle] = useState("");

    const handleAddTask = () => {
        if (!title.trim()) return console.log('Привет');

        onAddTask({
            title: title,
        });

        setTitle("");
    }

    return (  // нужно подумать, как сделать дровер создания задачи.

            <button className="add-task" onClick={handleAddTask}>
                Создать задачу
            </button>
    )
}

export default AddTask;