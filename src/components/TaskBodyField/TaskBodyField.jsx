import "./TaskBodyField.css";

function TaskBodyField ({ value, onChange }) {

    return (
            <div className="title-body-field">
                <label>Тело задачи</label> 
                <textarea
                    className="body-field"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Описание задачи"
                />
            </div>
    )
}

export default TaskBodyField;