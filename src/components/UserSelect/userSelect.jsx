import Select from 'react-select';

function UserSelect({ users = [], value, onChange }) {
    const options = users.map(u => ({
        label: `${u.first_name} ${u.last_name}`, 
        value: u.id 
    }));

    return(
        <Select
            options={options}
            value={options.find(o => o.value === value) || null}
            onChange={o => onChange(o.value)}
            isClearable
            placeholder="Выберите пользователя"
        />
    );
}

export default UserSelect;