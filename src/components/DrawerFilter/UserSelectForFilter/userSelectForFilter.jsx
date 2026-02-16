import Select from 'react-select';
import './userSelectForFilter.css'


function UserSelectForFilter({ users = [], value, onChange, }) {
    const options = users.map(u => ({
        label: `${u.last_name} ${u.first_name} ${u.middle_name ? u.middle_name : ''}`,  // Озеров Роман Сергеевич - first = Имя, middle = Отчество, last = Фамилия
        value: u.id 
    }));

    return(
        <div className='markup-for-assigner-in-filter'>
            <div className='task-assigner-in-filter'>Ответственный</div>

            <div className='select-wrapper-in-filter'>
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
                            width: '280px',
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

export default UserSelectForFilter;