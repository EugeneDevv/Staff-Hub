'./Modal.scss'
import { useEffect, useState, useCallback } from "react";
import Spinner from "../Spinner/Spinner";
import Modal from "./Modal"
import { useAddUserMutation,  useLazyGetClientsQuery,  useLazyGetProjectRolesQuery, useLazyGetProjectsQuery } from "../../../application/services/authApi";
import CustomInput from "../AppInputs/CustomInput";
import { toast } from "react-toastify";



interface Client {
  clientId: number,
  clientName: string
}
interface ProjectRole {
  projectRoleId: number,
  projectRoleName: string,
}

interface Project {
  clients: null,
  userProjectRoles: null
  projectId: number,
  projectName: string,
  clientsId: number
}


type Props = {
  isModalOpen: boolean,
  onClose: () => void;
}

const AddNewEmployeeModal = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [loadAddEmployee, setLoadAddEmployee] = useState<boolean>(false)
  const handleClose = () => {
    setLoading(false); // Reset loading state
    props.onClose(); // Trigger onClose

    setEmail("")
    setFirstName("")
    setLastName("")
    setUserType("User")
    setPhoneNumber("")
    setProjectId(0)
    setRoleId(0)
  };

  const [userId, setUserId] = useState(null)
  const [clients, setClients] = useState(null)
  const [projects, setProjects] = useState(null)
  const [projectsRoles, setProjectRoles] = useState(null)
  const [fetchClients] = useLazyGetClientsQuery({})
  const [fetchProjectRoles] = useLazyGetProjectRolesQuery({})
  const [fetchProjects] = useLazyGetProjectsQuery({})

  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [userType, setUserType] = useState("User")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [projectRoleId, setRoleId] = useState(0)
  const [projectId, setProjectId] = useState(0)


  const [addUser] = useAddUserMutation()

  const takeProjectRole = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleId(parseInt(e.target.value))

  }
  const takeAdmin = () => {
    setUserType("Admin")
  }
  const takeUser = () => {
    setUserType("User")
  }
  const takeClientId = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const projects = await fetchProjects({ id: parseInt(e.target.value) });
    setLoading(true)

   
    setProjects(projects.data.data)

    setLoading(false)
  }
  const takeProject = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProjectId(parseInt(e.target.value))


  };
  const takeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }
  const takePhoneNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value)
  }
  const takeFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value)
  }
  const takeLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value)
  }
 

  const AddUser = async () => {
    const data = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      role: userType,
      projectRoleId: projectRoleId,
      projectId: projectId
    }

  
    if (email && userId) {
     if(!firstName){
      toast.warn("Add first name to continue")
      return;
     }
      if(!lastName){
        toast.warn("Add last name to continue")
        return;
      }
      if (projectId && projectRoleId) {
        setLoading(true)
        setLoadAddEmployee(true)
        {
          await addUser(data).unwrap().then(res=>{
            setLoadAddEmployee(false)
            setLoading(false)
            toast.success(res.message)
            handleClose()
          }).catch(err=>{
            setLoading(false)
            setLoadAddEmployee(false)
            toast.warn(err.data.message);
            
          })
    

      }
    }
      else if (data.projectId || data.projectRoleId) {
        toast.warn("Ensure you have assigned a Client, Project and Project Role")
        return;
      }
      else {
        setLoading(true)
        addUser(data).unwrap().then(res => {
          console.log(res)
          toast.success(res.message)
          setLoading(false)
          handleClose()

        }).catch(err=>{
          setLoading(false)
          toast.warn(err.data.message)
        })
      }

    } else {
      toast.warn("Add an Email")
    }
  }

  const openModal = useCallback(async () => {
    try {
      setUserId(JSON.parse(localStorage.getItem("user") ?? ""));
      setLoading(true);
  
      const Clients = await fetchClients({});
      const ProjectRoles = await fetchProjectRoles({});
  
      if (Clients && ProjectRoles) {
        setLoading(false);
        setClients(Clients.data.data);
        setProjectRoles(ProjectRoles.data.data);
      }
    } catch (error) {
      // Handle any errors here
      console.error('Error in openModal:', error);
    }
  }, [fetchClients, fetchProjectRoles]);
  useEffect(()=>{
    openModal()
  }, [clients, openModal] )

  return (
    <Modal
      isOpen={props.isModalOpen}
      onClose={handleClose}
      Heading={"Add New Employee"}
    >
      {loading &&
        <div className="loader">
          <Spinner />

        </div>
      }
      <div className="AddEmployeeModal">
        <div className="contactDetails">
          <h3>1. Contact Details</h3>
          <div className="contDetSec">
            <CustomInput
              type="email"
              value={email}
              name={""}
              placeholder="E.g. test@griffinglobaltech.com"
              errorMessage=""
              onChange={takeEmail}
              required={true}
              label="Email"
            />

            <CustomInput
              type="text"
              value={phoneNumber}
              name={""}
              placeholder="E.g. +254703298507"
              errorMessage=""
              onChange={takePhoneNumber}
              label="Phone Number"
            />

          </div>
          <div className="contDetSec">

            <CustomInput
              type="text"
              value={firstName}
              name={""}
              placeholder="E.g. Jane"
              errorMessage=""
              onChange={takeFirstName}
              label="First Name"
              required={true}
            />


            <CustomInput
              type="text"
              value={lastName}
              name={""}
              placeholder="E.g.Doe"
              errorMessage=""
              onChange={takeLastName}
              label="Last Name"
              required={true}
            />
          </div>
          <h3>2. Project</h3>
          <div className="contDetSec">

            <label htmlFor="" className="labelPropertiesS">
              <p>Client Name</p>
              {clients && clients ? (
                <select className="selectOpts" onChange={takeClientId}>
                  <option value="" disabled selected>Tap to select a client</option>

                  {(clients as Client[]).map((client) => (
                    <option key={client.clientId} value={client.clientId}>
                      {client.clientName}
                    </option>
                  ))}
                </select>
              ) : (
                <p>No clients  available</p>
              )}
            </label>
            <label htmlFor="" className="labelPropertiesS">
              <p>Role</p>
              {projectsRoles && projectsRoles ? (
                <select onChange={takeProjectRole}>
                  <option value="" disabled selected className="disabledSel">Tap to select a role</option>
                  {(projectsRoles as ProjectRole[]).map((Role) => (
                    <option key={Role.projectRoleId} value={Role.projectRoleId}>
                      {Role.projectRoleName}
                    </option>
                  ))}
                </select>
              ) : (
                <p>No project roles available</p>
              )}
            </label>
          </div>
          <div className="contDetSec">
            <label htmlFor="" className="labelPropertiesS">
              <p>Project Name</p>
              {projects ? (

                <>
                  <select onChange={takeProject}>
                    <option value="" className="disabledSel">
                      Tap to select a project
                    </option>
                    {(projects as Project[]).map((Project) => {

                      return (
                        <option key={Project.projectId} value={Project.projectId}>
                          {Project.projectName}
                        </option>
                      );

                      // return null;
                    })}
                  </select>
                </>
                ):(
                  <p>Choose a Client to view projects</p>
                )
              }


            </label>
            <h3 className="userType">3.User Type</h3>
          </div>
          <div className="contDetSec">
            <div className="userType"></div>
            <div className="UserType">

              <div className="selUserType">
                <div onClick={takeAdmin} className="outerCircle">
                  <div className={`innerCircle${userType}`}></div>
                </div>
                <p>Admin User</p>
                <div onClick={takeUser} className="outerCircle" >
                  <div className={`innerCircles${userType}`}></div>
                </div>
                <p>Employee</p>
              </div>
            </div>
          </div>


          <div className="contDetSec">
           {loadAddEmployee ? (
            <Spinner/>
           ):(
            <button onClick={AddUser} className="addEmployee">Add Employee</button>
           )}
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default AddNewEmployeeModal