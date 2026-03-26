import './leftPanel.css';
import MainLogo from './LogoMain/logoMain';

function LeftPanel({ children }) {
    return (
        <div className="left-panel">
            <MainLogo />
            {children}
        </div>
    );
}

export default LeftPanel;