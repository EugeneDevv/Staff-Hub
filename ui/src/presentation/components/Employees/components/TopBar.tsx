import { useSelector } from "react-redux";
import { RootState } from "../../../../infrastructure/app/store";

interface Props {
  setIsAddNewEmployeeModalOpen: (showMenu: boolean) => void; 
  isAdmin: boolean;
}
const TopBar: React.FC<Props> = ({ setIsAddNewEmployeeModalOpen, isAdmin }) => {

  const authState = useSelector((state: RootState) => state.auth);

  const usersCount = authState?.userPagination?.totalRecords ?? 0;

  return (
    <div className="topBar">
      {isAdmin && <div className="employeeCount">
        <div className="description">Total Employees:</div>
        <div className="count">{usersCount}</div>
      </div>}
      {isAdmin  && <button className="normalButton" onClick={()=>setIsAddNewEmployeeModalOpen(true)} >Add New Employee</button>}
    </div>
  )
}

export default TopBar