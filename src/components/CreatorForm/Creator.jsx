import "./Creator.css";
import { useState } from 'react';

function Creator(value) {

    const [creator, setCreator] = useState("");

    return (
        <form>
            <div className="creator"> 
                <label>Создатель</label>
                <input 
                    type="text"
                    className="creator-field"
                    value={creator}
                    onChange={(e) => setCreator(e.target.value)}
                    placeholder="Не указано"
                />
            </div>
        </form>
    )
};

export default Creator;