import React, { useEffect } from "react"
import { UserProfile } from "../../../../domain/models/user.model"
import MoreIcon from "../../../../assets/MoreIcon"
import { useUnSuspendUserMutation } from "../../../../application/services/authApi";
import { useDispatch } from "react-redux";
import { setSelectedUser } from "../../../../application/slices/authSlice";
import { friendlyErrorMessage } from "../../../../domain/valueObjects/appStrings";
import { toast } from "react-toastify";
import { summarizeClients, summarizeProjects, summarizeSkills } from "../../../../domain/valueObjects/utils";
import OutlinedButton from "../../Buttons/OutlinedButton";

type Props = {
  employee: UserProfile;
  showMenu: string;
  isAdmin: boolean;
  setShowMenu: (showMenu: string) => void;
  openSuspendUserModal: () => void;
  openDeleteUserModal: () => void;
  openViewUserModal: () => void;
}

const EmployeeItem: React.FC<Props> = ({ employee, showMenu, isAdmin,setShowMenu, openSuspendUserModal, openDeleteUserModal, openViewUserModal }) => {



  const [unSuspendUser, { isSuccess, isError }] = useUnSuspendUserMutation();
  const dispatch = useDispatch();


  const handleViewUser = () => {
    setShowMenu('');
    dispatch(setSelectedUser(employee));
    openViewUserModal();
  };
  const handleSuspendUser = () => {
    setShowMenu(employee.userId);

    if (employee.suspended) {
      unSuspendUser(employee.userId,);
    } else {
      dispatch(setSelectedUser(employee));
      openSuspendUserModal();
    }


  };
  const handleDeleteUser = () => {
    setShowMenu('');

    dispatch(setSelectedUser(employee));
    openDeleteUserModal();
  };


  useEffect(() => {
    if (isSuccess) {
      toast.success('User suspension lifted successfully');

    } else if (isError) {
      toast.error(friendlyErrorMessage);
    }
  }, [isSuccess, isError])
  const userProjects = summarizeProjects(employee.userProjects);
  const userClients = summarizeClients(employee.userProjects);
  return (
    <div key={employee.userId} className="employeeItem">
      {isAdmin  && <div className="checkBox">
        <input type="checkbox" />
      </div>}
      <div className="item name">
        <span>{`${employee.firstName} ${employee.lastName}`}</span>
        {
          employee.suspended && <span className="suspensionStatus">
            suspended
        </span>}
        </div>
      <div className="item role">{employee.userProjects.length > 0 ? employee.userProjects[0]?.roleName : ""}</div>
      <div className="item skills">
        {employee.userSkills.length > 0 && (
          <div className="skill-list">
            {summarizeSkills(employee.userSkills).map((skill) => (
              <span className="individualskill">{skill}</span>
            ))}
          </div>
        )}
      </div>
      <div className="item clients">
        {userClients.length > 0 && <span className="clientlist">{userClients[0]}</span>}
        {userClients.length > 1 && <span className="individualskill">{userClients[1]}</span>}

        {/* {employee.userProjectRoles.length > 0 && (
              <span className="clientlist">{employee.userProjectRoles[0]}</span>
            )} */}
        {/* {employee.clients.length > 1 && (
              <span className="individualclient">+{employee.clients.length - 1}</span>
            )}  */}
      </div>
      <div className="item projects">
        {userProjects.length > 0 && <span className="clientlist">{userProjects[0]}</span>}
        {userProjects.length > 1 && <span className="individualskill">{userProjects[1]}</span>}
        {/* {employee.projects}
            {employee.projects.length > 0 && (
              <span className="projectlist">{employee.projects[0]}</span>
            )}
            {employee.clients.length > 1 && (
              <span className="individualclient">+{employee.clients.length - 1}</span>
            )} */}
      </div>
      <div className={`item  ${isAdmin ? 'more' : 'view' }`} onClick={() => setShowMenu(showMenu === employee.userId ? '' : employee.userId)}>
   
        {isAdmin ? <MoreIcon /> : <OutlinedButton text="View Profile" onClick={handleViewUser} className="viewButton" /> }
      </div>
      {(showMenu == employee.userId) && (
        <div className="menu">
          <ul>
            <li onClick={handleViewUser} >View Profile</li>
            <li onClick={handleSuspendUser}>{employee.suspended ? "Unsuspend" : "Suspend"} User</li>
            <li className='logoutButton' onClick={handleDeleteUser}>Delete User</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default EmployeeItem