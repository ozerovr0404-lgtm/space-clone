import './backgroundMain.css';

function BackgroundMain({ children }) {
    return (
        <div className="background">
            {children}
        </div>
    );
}

export default BackgroundMain;