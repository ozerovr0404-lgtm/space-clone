import './userPage.css';
import { useParams } from 'react-router-dom';
import {useEffect, useState} from 'react'
import UserPageBackground from './UserPageBackground/userPageBackground';
import LeftPanel from '../../shared/ui/layout/LeftPanel/leftPanel';
import UserWindow from '../../features/user/UserWindow/userWindow';
import UserMenu from '../../shared/icons/UserIconMenu/userMenu';
import UserPhoto from './UserPhoto/userPhoto';
import UserPageSeparator from './UserPageSeparator/userPageSeparator';
import RightPartUserPage from './RightPartUserPage/rightPartUserPage';
import ParamsButton from './UserParams/userParamsButton';
import MainLogo from '../../shared/ui/layout/LeftPanel/LogoMain/logoMain';
import UserName from './UserName/userName';


function UserPage() {

    const { id } = useParams();
    const [isUserOpen,setIsUserOpen] = useState(false);

    return (
        <UserPageBackground>
            

            <LeftPanel>
                <UserMenu onClick={() => setIsUserOpen(prev => !prev)}/>
            </LeftPanel>

            <UserWindow
                open={isUserOpen}
                onClose={() => setIsUserOpen(false)}
            />

                <UserPageSeparator>
                    <UserPhoto />

                    <UserName />

                    <ParamsButton />
                </UserPageSeparator>
                
                <RightPartUserPage>

                </RightPartUserPage>
            
        </UserPageBackground>
    )
}

export default UserPage;