import './findField.css';
import React from 'react';
import {ReactComponent as PlusIcon } from '../Plus_svg/magnifying-glass.svg';

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
                placeholder="Введите название задачи"
                maxLength={60}
            />
            <button className="find-button" type="submit">
                <PlusIcon className="find-icon"/>
            </button>
        </form>
    )
}

export default FindField;