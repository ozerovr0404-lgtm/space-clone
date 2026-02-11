import Select from 'react-select';
import './userSelect.css';


function UserSelect({ users = [], value, onChange }) {
    const options = users.map(u => ({
        label: `${u.first_name} ${u.last_name}`, 
        value: u.id 
    }));

    return(
        <div className='markup-for-assigner'>
            <div className='task-assigner'>Ответственный</div>

            <div className='select-wrapper'>
                <Select
                    options={options}
                    value={options.find(o => o.value === value) || null}
                    onChange={o => onChange(o.value)}
                    isClearable
                    placeholder="Выберите пользователя"
                    styles={{
                        menuPortal: base => ({
                            ...base,
                            zIndex: 900
                        }),
                        option: (provided, state) => ({
                            ...provided,
                            borderColor: '#e6e6e6ff',
                            fontSize: '15.8px',
                            cursor: 'pointer'
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
                            width: '770px',
                            borderRadius: 4,
                            borderColor: '#e6e6e6ff',
                            cursor: 'pointer',
                            margin: '3px',
                            fontSize: '15px',
                            padding: '0px 5px'
                        })
                    }}
                />
            </div>
        </div>
    );
}

export default UserSelect;