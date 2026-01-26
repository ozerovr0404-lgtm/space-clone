import "./TitleField.css";

function TitleTaskField({value, onChange, hasError}) {

    return (
            <div className="task-title-field-wrapper">
                <label className="task-title-label">Заголовок</label>
                <textarea
                    className={`task-title-field ${hasError ? 'error' : ''}`}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Укажите заголовок"
                    maxLength={95}
                />
            </div>
    )
}

export default TitleTaskField;