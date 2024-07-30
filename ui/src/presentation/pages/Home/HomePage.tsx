import { useState } from "react";
import AddNewEmployeeModal from "../../components/modals/AddNewEmployeeModal"
import Dashboard from "../Dashboard/Dashboard"
import EmployeesComponent from "../../components/Employees/EmployeesComponent";

const HomePage = () => {
  const [isAddNewEmployeeModalOpen, setIsAddNewEmployeeModalOpen] = useState<boolean>(false);

  const closeAddNewEmployeeModal = () => {
    setIsAddNewEmployeeModalOpen(false);
  };
  return (
    <Dashboard route="/home">
      <EmployeesComponent setIsAddNewEmployeeModalOpen={setIsAddNewEmployeeModalOpen} />
      <AddNewEmployeeModal isModalOpen={isAddNewEmployeeModalOpen} onClose={closeAddNewEmployeeModal} />
    </Dashboard>
  )
}

export default HomePage