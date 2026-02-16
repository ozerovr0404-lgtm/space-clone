import Select from 'react-select';
import { TASK_STATUSES } from '../../constants/taskStatus';
import './statusSelect.css';

function StatusSelect({ value, onChange }) {
    return (
        <>
            <div className='drawer-filter-body-for-fields'>
                <div className='status-in-filter'>Статус</div>

                <Select 
                    className='status-select-in-drower-filter'
                    value={TASK_STATUSES.find(o => o.value === value) || null}
                    onChange={option => onChange(option?.value || null)}
                    options={TASK_STATUSES}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    menuPlacement="auto"
                    styles={{
                        menuPortal: base => ({
                        ...base,
                        zIndex: 900
                        }),
                        option: (provided, state) => ({
                        ...provided,
                        color: state.data.color,
                        backgroundColor: state.isFocused ? '#eee' : 'white'
                        }),
                        singleValue: (provided, state) => ({
                        ...provided,
                        color: state.data.color
                        }),
                        control: (provided) => ({
                        ...provided,
                        width: 280,
                        borderRadius: 4,
                        borderColor: '#e6e6e6ff',
                        cursor: 'pointer',
                        margin: '5px 3px',
                        fontSize: '15px',
                        padding: '0px 5px'
                        })
                    }}
                    isClearable
                    placeholder="Статус"
                />
            </div>
        </>
    )
}

export default StatusSelect;