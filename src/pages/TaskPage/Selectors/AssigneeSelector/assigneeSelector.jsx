import Select from "react-select";
import './assigneeSelector.css';

function AssigneeSelector({ users = [], value, onChange }) {
    const options = users.map(u => ({
        label: `${u.last_name} ${u.first_name} ${u.middle_name ? u.middle_name : ''}`,
        value: u.id
    }))

    return(
        <Select
            options={options}
            value={options.find(o => o.value === value) || null}
            onChange={o => onChange(o?.value ?? null)}
            isClearable
            placeholder="Выберите пользователя"
            menuPortalTarget={document.body}
            menuPosition="fixed"
            styles={{
                menuPortal: base => ({
                    ...base,
                    zIndex: 1000
                }),
                option: (provided, state) => ({
                    ...provided,
                    borderColor: '#e6e6e6ff',
                    fontSize: '15.8px',
                    cursor: 'pointer',
                    zIndex: 1000
                }),
                singleValue: (provided, state) => ({
                    ...provided,
                    color: state.data.color
                }),
                placeHolder: (provided) => ({
                    ...provided
                }),
                control: (provided) => ({
                    ...provided,
                    width: '240px',
                    borderRadius: 4,
                    borderColor: '#606381ff',
                    cursor: 'pointer',
                    margin: '0px',
                    fontSize: '16px',
                    padding: '0px'
                })
            }}
        />        
    )
}

export default AssigneeSelector;