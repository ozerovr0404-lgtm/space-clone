import Select from 'react-select';
import { TASK_STATUSES } from '../../constants/taskStatus';

function StatusSelect({ value, onChange }) {
    return (
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
                width: 350,
                borderRadius: 6,
                borderColor: '#606381ff',
                cursor: 'pointer',
                margin: '30px 30px 0px'
                })
            }}
            isClearable
            placeholder="Статус"
        />
    )
}

export default StatusSelect;