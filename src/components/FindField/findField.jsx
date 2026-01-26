import './findField.css';
import React from 'react';

function FindField({ onSearch }) {
    const [query, setQuery] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query)
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                className="find-field" 
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Укажите название задачи"
                maxLength={60}
            />
            <button className="find-button" type="submit">
                <img
                    src="/magnifying-glass.svg"
                    alt="Find"
                    width={37}
                    height={25}
                />
                
            </button>
        </form>
    )
}

export default FindField;