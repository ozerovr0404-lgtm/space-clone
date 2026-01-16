import './taskTableSorted.css';

function TaskTableSorted({sortOrder, setSortOrder}) {
    return (
        <div className="table-control-wrapper">
            <select
                className="table-controls"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
            >
                <option value="desc">Сначала новые</option>
                <option value="asc">Сначала старые</option>
            </select>
            
        </div>
    )
}

export default TaskTableSorted;