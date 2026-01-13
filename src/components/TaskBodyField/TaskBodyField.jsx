import "./TaskBodyField.css";
import { useState } from 'react';

function TaskBodyField (value) {
    const [bodyField, setBodyField] = useState("");

    return (
        <form>
            <div className="title-body-field">
                <label>Тело задачи</label> 
                <input
                    type="textarea"
                    className="body-field"
                    value={bodyField}
                    onChange={(e) => setBodyField(e.target.value)}
                    placeholder="Описание задачи"
                />

            </div>
        </form>
    )
}

export default TaskBodyField;