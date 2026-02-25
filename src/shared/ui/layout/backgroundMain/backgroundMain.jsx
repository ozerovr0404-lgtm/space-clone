import './backgroundMain.css';

function BackgroundMain({ children }) {
    return (
        <div className="background">
            {children}
        </div>
    );
}
// for commit
export default BackgroundMain;