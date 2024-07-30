import { useState } from 'react'
import SuspendUserModal from '../modals/SuspendUserModal'
import './EmployeesComponent.scss'
import EmployeesFilter from './components/EmployeesFilter'
import EmployeesTable from './components/EmployeesTable'
import PaginationFooter from './components/PaginationFooter'
import TopBar from './components/TopBar'
import DeleteUserModal from '../modals/DeleteUserModal'
import ViewProfileModal from '../modals/ViewProfileModal'
import { getUser } from '../../../domain/valueObjects/utils'

interface Props {
  setIsAddNewEmployeeModalOpen: (showMenu: boolean) => void;
}


const EmployeesComponent: React.FC<Props> = ({ setIsAddNewEmployeeModalOpen }) => {

  const user = getUser();

  const isAdmin = (user?.role === "SuperAdmin" || user?.role === "Admin")
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(false)
  const [searchCount, setSearchCount] = useState(0)

  const [openAddUserModal, setOpenAddUserModal] = useState<boolean>(false)
  const [openDeleteUserModal, setOpenDeleteUserModal] = useState<boolean>(false)
  const [openViewProfileModal, setOpenViewProfileModal] = useState<boolean>(false)

  const handleClose = () => {
    setOpenAddUserModal(false)
    setOpenDeleteUserModal(false)
    setOpenViewProfileModal(false)
  }

  return (
    <div className='employeesWrapper'>
      <div className="topBarWrapper">
        <TopBar setIsAddNewEmployeeModalOpen={setIsAddNewEmployeeModalOpen} isAdmin={isAdmin} />
        <EmployeesFilter setIsLoadingUsers={setIsLoadingUsers} setSearchCount={() => {
          setSearchCount((prev) => prev + 1)
        }} />
        <div className="header">
          {isAdmin && <div className="checkBox">
            <input type="checkbox" />
          </div>}
          <div className="item">
            Name
          </div>
          <div className="item">
            Role
          </div>
          <div className="item skills">
            Skills
          </div>
          <div className="item">
            Client
          </div>
          <div className="item">
            Project
          </div>
          <div className="item more">
          </div>
        </div>
      </div>
      <EmployeesTable openSuspendUserModal={() => setOpenAddUserModal(true)} openDeleteUserModal={() => setOpenDeleteUserModal(true)} openViewUserModal={() => setOpenViewProfileModal(true)} isAdmin={isAdmin} isLoadingUsers={isLoadingUsers} />
      <PaginationFooter setIsLoadingUsers={setIsLoadingUsers} searchCount={searchCount} />
      <SuspendUserModal isModalOpen={openAddUserModal}
        onClose={handleClose} />
      <DeleteUserModal isModalOpen={openDeleteUserModal}
        onClose={handleClose} />
      <DeleteUserModal isModalOpen={openDeleteUserModal}
        onClose={handleClose} />
      <ViewProfileModal isModalOpen={openViewProfileModal} onClose={handleClose} isAdmin={isAdmin} />
    </div>
  )
}

export default EmployeesComponent