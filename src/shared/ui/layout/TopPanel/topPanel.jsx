import './topPanel.css';

function TopPanel({ children }) {
    return (
        <div className="top-panel">
            {children}
        </div>
    )
}

export default TopPanel;