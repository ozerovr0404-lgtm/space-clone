import './addTask.css';

function AddTask({text, onClick}) {
    return (
        <button className="add-task" onClick={onClick}>
            {text}
        </button>
    )
}

export default AddTask;