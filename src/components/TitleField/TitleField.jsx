import "./TitleField.css";
import { useState } from 'react';

function TitleTaskField(value) {
    const [title, setTitle] = useState("");

    return (
        <form>
            <div>
                <label>Заголовок</label>
                <input
                    type="textarea"
                    className="task-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Укажите заголовок"
                />
            </div>
        </form>
    )
}

export default TitleTaskField;