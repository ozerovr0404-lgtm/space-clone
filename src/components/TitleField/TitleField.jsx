import "./TitleField.css";

function TitleTaskField({value, onChange}) {

    return (
            <div className="task-title-field-wrapper">
                <label>Заголовок</label>
                <textarea
                    className="task-title-field"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Укажите заголовок"
                />
            </div>
    )
}

export default TitleTaskField;