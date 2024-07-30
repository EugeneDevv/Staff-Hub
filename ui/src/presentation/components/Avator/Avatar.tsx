import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Avatar.scss'
import ResetPasswordModal from '../modals/ResetPasswordModal';
import { UpdateSecurityQuestion } from '../modals/UpdateSecurityQuestion';
interface AvatarProps {
  firstName: string;
  lastName: string;
  showMenu: boolean; // Pass showMenu as prop
  setShowMenu: (showMenu: boolean) => void; // Pass setShowMenu as prop
  setIsViewProfileModalOpen?: (showMenu: boolean) => void; // Pass setShowMenu as prop
}

export const Avatar: React.FC<AvatarProps> = ({ firstName, lastName, showMenu, setShowMenu, setIsViewProfileModalOpen }) => {
  const [openModalResetPassword, setOpenModalResetPassword] = useState(false)
  const [openModalUpdateSecurityQuestion, setOpenModalSecurityQuestion] = useState<boolean>(false)
  const navigate = useNavigate();

  const handleAvatarClick = () => {
    setShowMenu(!showMenu);
  };

  const handleViewProfile = () => {
    // Handle view profile action
    setShowMenu(false);
    if (setIsViewProfileModalOpen) {
      setIsViewProfileModalOpen(true);
    }
  };

  const handleLogout = () => {
    setShowMenu(false);
    // Handle logout action
    localStorage.clear();
    navigate('/login');
  };
  const handleResetPassword = ()=>{
    setOpenModalResetPassword(true)
  }
  const closeModalResetPassword = ()=>{
    setOpenModalResetPassword(false)
  }
  const openSecurityQuestion = ()=>{
    setOpenModalSecurityQuestion(true)
  }
  const closeModalUpdateSecurityQuestion = ()=>{
    setOpenModalSecurityQuestion(false)
  }
  return (
    <div className="avatar-container">
      <div className="avatar" onClick={handleAvatarClick}>
        <span>{firstName.length > 0 ? firstName[0].toUpperCase() : "G"}</span>
        <span>{lastName.length > 0 ? lastName[0].toUpperCase() : "T"}</span>
      </div>
      {showMenu && (
        <div className="menu">
          <h2 className="menuTitle">Profile Settings</h2>
          <ul>
            <li onClick={handleViewProfile}>View Profile</li>
            <li onClick={handleResetPassword}>Reset Password</li>
            <li onClick={openSecurityQuestion}>Update Security Question</li>
            <li className='logoutButton' onClick={handleLogout}>Logout</li>
          </ul>
        </div>
      )}
    <ResetPasswordModal ModalOpen = {openModalResetPassword} onClose={closeModalResetPassword} />
   {openModalUpdateSecurityQuestion &&
    <UpdateSecurityQuestion isModalOpen = {openModalUpdateSecurityQuestion}
    onClose={closeModalUpdateSecurityQuestion}
   />
   }
    </div>
  );
};