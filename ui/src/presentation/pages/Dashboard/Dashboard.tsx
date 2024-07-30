import { useNavigate } from 'react-router-dom';
import './Dashboard.scss'
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { getSelectedTabRoute, getSelectedTabTitle, getUser } from '../../../domain/valueObjects/utils';
import { Avatar } from '../../components/Avator/Avatar';
import ViewProfileModal from '../../components/modals/ViewProfileModal';
import { useSelector } from 'react-redux';
import { RootState } from '../../../infrastructure/app/store';

const adminMenuItems: string[] = ['Employees', 'Projects', 'Skills', 'Roles']

const userMenuItems: string[] = ['Team', 'Projects', 'Skills']

interface DashboardProps {
  route: string;
}

const Dashboard: FC<PropsWithChildren<DashboardProps>> = ({ children, route }) => {

  const [isViewProfileModalOpen, setIsViewProfileModalOpen] = useState<boolean>(false);

  const closeViewProfileModal = () => {
    setIsViewProfileModalOpen(false);
  };

  const [showMenu, setShowMenu] = useState(false);

  // Event listener to close menu when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (event.target instanceof HTMLElement && !event.target.closest('.avatar-container')) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []); // Empty dependency array ensures the effect runs only once

  const navigate = useNavigate();

  const authState = useSelector((state: RootState) => state.auth);

  const loggedInUser = authState.userState.userProfile;
  const user = getUser();

  const isAdmin = (user?.role === "SuperAdmin" || user?.role === "Admin")

  const handleNavigate = (tab: string) => {
    navigate(getSelectedTabRoute(tab));
}

  return (
    <div className="dashboardWrapper">
      <header className="navbar">
        <div>
          <h2 onClick={() => { navigate('/') }}>G.E.R</h2>
          <h6>Welcome{(loggedInUser?.firstName ?? user?.firstName) && <span>, {loggedInUser?.firstName ?? user?.firstName}</span>}{!(loggedInUser?.firstName ?? user?.firstName) && <span> back</span>}!</h6>
        </div>

        <div className="menuBar">
          {isAdmin && adminMenuItems.map((item, index) => (
            <div key={index} className={`menuItem ${item === getSelectedTabTitle(route, isAdmin) ? "selectedMenuItem" : ""}`} onClick={() => handleNavigate(item)}>
              {item}
            </div>
          ))}
          {!isAdmin && userMenuItems.map((item, index) => (
            <div key={index} className={`menuItem ${item === getSelectedTabTitle(route, isAdmin) ? "selectedMenuItem" : ""}`} onClick={() => handleNavigate(item)}>
              {item}
            </div>
          ))}
          <Avatar firstName={user?.firstName ?? "G"} lastName={user?.lastName ?? "T"} showMenu={showMenu} setShowMenu={setShowMenu} setIsViewProfileModalOpen={setIsViewProfileModalOpen} />
        </div>
      </header>
      <div className="dashboardContent">
        {children}
        <ViewProfileModal isModalOpen={isViewProfileModalOpen} onClose={closeViewProfileModal} myProfile={true} />
      </div>
    </div>
  )
}

export default Dashboard