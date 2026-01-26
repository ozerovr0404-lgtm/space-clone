import "./Creator.css";

function Creator({value, onChange, hasError}) {

    return (
            <div className="creator"> 
                <label className="label-creator">Создатель</label>
                <input 
                    type="text" 
                    className={`creator-field ${hasError ? 'error' : ''}`}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Не указано"
                    maxLength={55}
                />
            </div>
    )
};

export default Creator;