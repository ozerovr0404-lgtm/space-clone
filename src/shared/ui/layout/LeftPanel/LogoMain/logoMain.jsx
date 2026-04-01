import './logoMain.css';
import { Link } from 'react-router-dom';

function MainLogo() {
    return (
        <div className='main-logo'>
            <Link to="/tasks">
                <img
                        src="/ai-hub.svg" //иконка юзера в левый нижний угол
                        alt="logo"
                        width={40}
                        height={50}
                />
            </Link>
        </div>
    )
}

export default MainLogo;