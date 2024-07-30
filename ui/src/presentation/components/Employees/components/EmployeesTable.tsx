import { useEffect, useState } from "react";
import { useLazyUsersQuery } from "../../../../application/services/authApi";
import { UserProfile } from "../../../../domain/models/user.model";
import Spinner from "../../Spinner/Spinner";
import EmployeeItem from "./EmployeeItem";
import { useDispatch, useSelector } from "react-redux";
import { setUserPagination, setUsers } from "../../../../application/slices/authSlice";
import { RootState } from "../../../../infrastructure/app/store";

type Props = {
  openSuspendUserModal: () => void;
  openDeleteUserModal: () => void;
  openViewUserModal: () => void;
  isAdmin: boolean,
  isLoadingUsers: boolean,
}

const EmployeesTable: React.FC<Props> = ({ openSuspendUserModal, openDeleteUserModal, openViewUserModal, isAdmin, isLoadingUsers }) => {

  const authState = useSelector((state: RootState) => state.auth);
  const users = authState.userState.users;

  const [fetchClients, { data, isSuccess, isLoading, error, }] = useLazyUsersQuery();
  const [showMenu, setShowMenu] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchClientData = async () => {
      await fetchClients({});
    };

    fetchClientData();
  }, [fetchClients]);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (event.target instanceof HTMLElement && !event.target.closest('.more')) {
        setShowMenu('');
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (data?.data) {
      dispatch(setUsers(data.data));
      dispatch(setUserPagination(data.pagination));
    }
  }, [data, dispatch, isSuccess])

  return (
    <div className="employeesTable">
      {error && <h2>Something went wrong </h2>}
      {(isLoadingUsers || isLoading) && <div className="loader"><Spinner /></div> }
      {(!(isLoadingUsers || isLoading) && isSuccess) && <div className="employeeTableBody">
        {users.map((employee: UserProfile) => (
          <EmployeeItem employee={employee} showMenu={showMenu} setShowMenu={setShowMenu} openSuspendUserModal={openSuspendUserModal} openDeleteUserModal={openDeleteUserModal} openViewUserModal={openViewUserModal} isAdmin={isAdmin} />
        ))}
      </div>}
    </div>
  )
}

export default EmployeesTable


