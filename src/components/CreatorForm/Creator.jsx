import "./Creator.css";

function Creator({value, onChange, hasError}) {

    return (
            <div className="creator"> 
                <label>Создатель</label>
                <input 
                    type="text" 
                    className={`creator-field ${hasError ? 'error' : ''}`}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Не указано"
                />
            </div>
    )
};

export default Creator;