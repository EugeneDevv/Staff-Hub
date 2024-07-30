import './ProjectsComponent.scss'
import CustomInput from '../AppInputs/CustomInput'
import { useEffect, useState, useRef, useCallback } from 'react'
import { useGetClientsQuery, useLazyGetProjectTeamQuery, useLazySingleUserQuery } from '../../../application/services/authApi'
import { useLazyGetProjectsQuery } from '../../../application/services/authApi'
import AddProject from '../modals/AddProject'
import { UpdateProject } from '../modals/UpdateProject'
import AddClientModal from '../modals/AddClientModal'
import UpdateClientModal from '../modals/UpdateClientModal'
import DeleteClientModal from '../modals/DeleteClientModal'
import DeleteProjectModal from '../modals/DeleteProject'
import RemoveTeamMember from '../modals/RemoveMemberModal'


import Spinner from '../Spinner/Spinner'
import { ApiResponse } from '../../../application/apiTypes'
import { UserProfile } from '../../../domain/models/user.model'
import { setSelectedUser } from '../../../application/slices/authSlice'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import ViewProfileModal from '../modals/ViewProfileModal'
import { getUser } from '../../../domain/valueObjects/utils'
import AddTeam from '../modals/AddTeam'

interface Client {
  clientId: number,
  clientName: string
}
interface Project {
  clients: null,
  userProjectRoles: null
  projectId: number,
  projectName: string,
  clientsId: number
}
interface IUserProjectRole {
  userId: string;
  firstName: string;
  lastName: string
  projectId: number;
  projectName: string;
  roleId: number;
  roleName: string;
}
interface LoggedInUser{
  role:string
}
const ProjectsComponent = () => {
  const [searchClient, setSearchClient] = useState("")
  const [showClientMenu, setShowClientMenu] = useState<number>(0)
  const [fetchProject] = useLazyGetProjectsQuery()
  const [projects, setProjects] = useState<Project[]>([])
  const [projectTeam, setProjectTeam] = useState<IUserProjectRole[]>([])
  const [showProjectTeam, setShowProjectTeam] = useState<number>(0)
  const [fetchProjectTeam] = useLazyGetProjectTeamQuery({})
  const [ShowProjectMenu, setShowProjectMenu] = useState<number>(0)

  const [selectedClients, setSelectedClients] = useState<string>("")
  const { data: clients } = useGetClientsQuery({})
  const [client, setClients] = useState<Client[]>([])
  const [clientId, setClientId] = useState<number>(0)
  const [showUserMenu, setShowUserMenu] = useState<string>("")
  const [count, setCount] = useState<number>(0)
  const [userRole, setUserRole] = useState<LoggedInUser>()
  const [openModalAddProject, setOpenModalAddProject] = useState(false)
  const [openModalUpdateProject, setOpenModalUpdateProject] = useState<boolean>(false)
  const [projectName, setProjectName] = useState<string>("")
  const [openModalAddClient, setOpenModalAddClient] = useState(false)
  const [showUpdateClientModal, setshowUpdateClientModal] = useState<boolean>(false)
  const [showDeleteClientModal, setshowDeleteClientModal] = useState(false)
  const [clientName, setClientName] = useState<string>("")
  const [showDeleteProjectModal, setshowDeleteProjectModal] = useState(false)
  const [openRemoveTeam, setOpenRemoveTeam] = useState<boolean>(false)
  const [userId, setUserId] = useState<string>("");
  const [roleId, setRoleId] = useState<number>(0)
  const [openModalAddTeam, setOpenModalAddTeam] = useState<boolean>(false)
  const [firstName, setFirstName] = useState<string>("")
  const [lastName,setLastname ] = useState<string>("")



  const removeTeamFromProject = async (userId: string, roleId: number, projectId: number, projectName: string, firstName: string, lastName: string) => {
     console.log(`roles: ${roleId} and project: ${projectId}`)
    setProjectId(projectId)
    setRoleId(roleId)
    setUserId(userId)
    setProjectName(projectName)
    setFirstName(firstName)
    setLastname(lastName)   
    setOpenRemoveTeam(true)

  }


  const [projectId, setProjectId] = useState<number>(0)
    const openAddClient = () => {
      setOpenModalAddClient(true)
    }
  const [loading, setLoading] = useState<boolean>(false)
  const [openModalViewProfile, setOpenModalViewProfile] = useState(false);
  const [userById] = useLazySingleUserQuery();
  const dispatch = useDispatch()
  const user = getUser();
 
  const isAdmin = (user?.role === "SuperAdmin" || user?.role === "Admin")
 
  const startSearchClient = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(4);
    
    const inputValue = e.target.value.trim().toLowerCase(); 
    setSearchClient(inputValue)
    console.log(inputValue);
    
    const Count = inputValue.length
    if(Count > count){
      setCount(Count)
    }
    if(Count< count){
    

        const filteredClients: Client[] = clients.data.filter((client:Client) =>
          client.clientName.toLowerCase().includes(inputValue)
        );
     
         setClients(filteredClients);
    
     
    }
    const filteredClients: Client[] = clients.data.filter((client:Client) =>
      client.clientName.toLowerCase().includes(inputValue)
    );
    setClients(filteredClients);
    if (inputValue.length === 0) {
      const sortedData = [...clients.data].sort((a:Client,b:Client)=> a.clientName.localeCompare(b.clientName))
        setClients(sortedData)
    }
  }
  const FetchProject = useCallback(async (id: number) => {
    try {
      const projects = await fetchProject({ id: id });
      const sortedProject = [...projects.data.data].sort((a:Project, b:Project)=> a.projectName.localeCompare(b.projectName))
      console.log(projects.data.data);
      setProjects(sortedProject);
      setLoading(false)
    } catch (error) {
      // Handle any fetch errors here
      console.error('Error fetching projects:', error);
    }
  }, [fetchProject]);
  const takeClient = (clientId: number, clientName: string) => {
    setLoading(true)
    setClientId(clientId)
    FetchProject(clientId)
    console.log(clientName);
    setSelectedClients(clientName)
    setShowProjectTeam(0)
  }
  const showMenu = (clientId: number) => {
    if (!showClientMenu) {
      setShowClientMenu(clientId)
    } else {
      setShowClientMenu(0)
    }
  }
  const showProjectMenu = (projectId: number) => {
    if (ShowProjectMenu > 0) {
      setShowProjectMenu(0)
    } else {
      setShowProjectMenu(projectId)
    }
  }
  const viewTeam = async (projectId: number) => {
    console.log(projectId);
    setLoading(true)
    const teamInProject = await fetchProjectTeam(projectId )
    setProjectTeam(teamInProject.data.data)
    setLoading(false)
    if (showProjectTeam > 0) {
      
      setShowProjectTeam(0)
    } else {

      setShowProjectTeam(projectId)
    }
  }
  const viewUserMenu = (userId: string, roleId:number) => {
 
      setShowUserMenu(userId)
      setRoleId(roleId)
    
  }
  const closeMenu = () => {

    setShowProjectMenu(0)
    setShowClientMenu(0)
  }
  const OpenModalAddProject = async () => {
    setOpenModalAddProject(true)


  }
  const openUpdateClientModal = async (id:number, clientName:string) => {
    setshowUpdateClientModal(true)
    setClientId(id)
    setClientName(clientName)

  }
  const deleteProject = (name: string, id: number)=> {
    setProjectName(name)
    setProjectId(id)
    setshowDeleteProjectModal(true)
  }

  const handleClose = async () => {
    setOpenModalAddProject(false)
    setOpenModalUpdateProject(false)
    setOpenModalAddClient(false)
    setshowDeleteProjectModal(false)
    setOpenRemoveTeam(false)
    setshowDeleteClientModal(false) //
    setShowProjectTeam(0)
    const projects = await fetchProject({ id: clientId });
    const sortedProject = [...projects.data.data].sort((a:Project, b:Project)=> a.projectName.localeCompare(b.projectName))
    setProjects(sortedProject);
    const teamInProject = await fetchProjectTeam(projectId )
    setProjectTeam(teamInProject.data.data)

  }
  const OpenModalUpdateProject = (project_name:string, project_id:number)=>{
      setOpenModalUpdateProject(true)
      setProjectId(project_id)
      setProjectName(project_name)
  }
  const deleteClient = (id:number, clientName: string)=>{
    setClientId(id);
    setClientName(clientName)
    setshowDeleteClientModal(true)
  }
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const Role = localStorage.getItem("user");
    const parsedRole = Role ? JSON.parse(Role) : "User";
    setUserRole(parsedRole)
    setLoading(true)
    if (clients) {
   
     
      const sortedData = [...clients.data].sort((a:Client,b:Client)=> a.clientName.localeCompare(b.clientName))
      setClients(sortedData)
      setLoading(false)
      setSelectedClients(clients.data[0].clientName)
      setClientId(clients.data[0].clientId)
      FetchProject(clients.data[0].clientId)
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {

        setShowClientMenu(0)
        setShowProjectMenu(0)
        setShowUserMenu("")
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };

  }, [FetchProject, clients])

  const closeUpdateClientModal = ()=>{
    console.log(clientId);
    
    setshowUpdateClientModal(false)
 }
 const closeAddTeam = ()=>{
  setOpenModalAddTeam(false)
  viewTeam(projectId)
 }
 const openProfile = async (userId: string) => {
  await userById({ userId: userId })
    .then((res: ApiResponse) => {
      if (res?.error) {
        console.log(res);
      } else {

        const userProfile: UserProfile = res?.data.data;

        console.log('userProfile', userProfile);
        
        dispatch(setSelectedUser(userProfile));

        setOpenModalViewProfile(true);
      }
    })
    .catch((e: Error) => {
      toast.error(e?.message);
    });
};
const closeProfile = () => {
  setOpenModalViewProfile(false);
};
const addTeam = (id:number, proJectName:string)=>{
    setProjectId(id)
      setOpenModalAddTeam(!openModalAddTeam)
      setProjectName(proJectName)
}
  return (
    <div className="addClientMain" >
       {loading &&
    <div className='loaderSpinner'>
    <Spinner/>
      </div>

    }
      <div className='AddClient' onClick={closeMenu}>
        <div className='searchClient'>
          <CustomInput
            type="text"
            value={searchClient}
            name={""}
            placeholder="E.g Howard"
            errorMessage=""
            onChange={startSearchClient}
            label="Search Client"
          />
        </div>
        <div className='AddClientBtn'>
        {userRole && userRole.role === "Admin" ? (
                     <button onClick={openAddClient}>Add Client</button>
                    ):(
                      <></>
                    )}
        </div>
      </div>
      <div className="displayClientProjects">
        <div className="clients">
          {client &&
            <p className='clientAvailable'>{client.length} Clients Available</p>
          }
          {client.map((clients: Client) => (
            <div className={clients.clientId === clientId ? "clientClicked" : "clientNotClicked"} >
              <div className='radioBtnClientName'
                onClick={() => takeClient(clients.clientId, clients.clientName)}
              >
                <p className='radioBtn'>
                  <p className='innerRadioBtn'></p>
                </p>
                <p className='clientNName'>{clients.clientName}</p>
              </div>
              <div className='moreIconDiv'>
              {userRole && userRole.role === "Admin" ? (
                    <p className='moreIcon' onClick={() => showMenu(clients.clientId)}></p>
                    ):(
                      <p className='moreIco'>ddd</p>
                    )}
             

              {showClientMenu > 0 && showClientMenu === clients.clientId &&
                <div className='menu' ref={menuRef}>
                  <ul>
                    <li onClick={()=>openUpdateClientModal(clients.clientId, clients.clientName)} >Update Client</li>
                    <li onClick={OpenModalAddProject}>Add Project</li>
                    <li className='delClient' onClick={()=> deleteClient(clients.clientId, clients.clientName)}>Delete Client</li>
                  </ul>
                </div>
                
              }
               </div>
            </div>
          ))}
        </div>
        <div className="clientProjects">
          <div className='clientSelHeading'>
            <p className='selectedClient'>{selectedClients}</p>
            <p>Projects</p>
          </div>
          <div className='mainProjectDisplay'>
            {projects.length > 0 && projects.map((projects: Project) => (
              <div>
                <div className='disProject'>
                  <p className='projectName'>{projects.projectName}</p>
                  <div className='viewTeam' onClick={() => viewTeam(projects.projectId)}>
                    {showProjectTeam > 0 && showProjectTeam === projects.projectId ? (
                      <p>Close</p>
                    ) : (
                      <p>View Team</p>
                    )}
                    <p className='viewTeamBtn'></p>
                  </div>
                  <div className='moreIconDiv2'>
                    {userRole && userRole.role === "Admin" ? (
                      <p className='moreIcon' onClick={() => { showProjectMenu(projects.projectId) }}></p>
                    ):(
                      <p className='moreIco'>ddd</p>
                    )}
                  
                  {ShowProjectMenu > 0 && ShowProjectMenu === projects.projectId && (
                    <div className='menu' ref={menuRef}>
                      <ul>
                        <li onClick={()=>addTeam(projects.projectId, projects.projectName)}>Add Team Member</li>
                        <li onClick={()=>OpenModalUpdateProject(projects.projectName, projects.projectId)}>Update Project</li>
                        <li className='delClient' onClick={()=> deleteProject(projects.projectName, projects.projectId)}>Delete Project</li>
                       
                     
                      </ul>
                    </div>
                  )}
                  </div>
                </div>
                {showProjectTeam > 0 && showProjectTeam === projects.projectId && (
                  <>
                    {projectTeam.length > 0 ? (
                      <div>
                        {projectTeam.map((team: IUserProjectRole) => (
                          <div key={team.userId} className='projectTeam'>
                            <p>{team.firstName} {team.lastName}</p>

                            <p>{team.roleName}</p>
                            <p className='viewProfile'  onClick={()=>openProfile(team.userId)}>View Profile</p>
                            {userRole && userRole.role === "Admin" ? (
                               <p className='moreIcon' onClick={() => viewUserMenu(team.userId, team.roleId)}></p>
                            ):(
                              <p className='MoreIcon'></p>
                            )}
                            <div className='moreIconDiv2'>
                            {showUserMenu.length > 0 && showUserMenu === team.userId && team.roleId === roleId &&
                              (
                                <div className='menuProjects' ref={menuRef}>
                                  <ul>
                                    <li className='delClient' onClick={()=> removeTeamFromProject(team.userId, team.roleId, team.projectId, team.projectName, team.firstName, team.lastName )}>Remove</li>
                                  </ul>
                                </div>
                              )
                            }
                          </div>
                          </div>

                        ))}
                      </div>
                    ) : (
                      <div>No team assigned to this project</div>
                    )}

                  </>
                )}

              </div>

            ))}

          </div>
        </div>
      </div>
    {openModalAddProject && 
    <AddProject isModalOpen={openModalAddProject} onClose={handleClose}
    clientName={selectedClients}
    clientId={clientId}
  />
    }
  {openModalAddTeam && 
  
  <AddTeam
  ModalOpen = {openModalAddTeam}
  onClose = {closeAddTeam}
  projectName= {projectName}
  projectId={projectId}
  />
  
  }
      
    {openModalUpdateProject && 
    
    <UpdateProject isModalOpen= {openModalUpdateProject} onClose={handleClose} ProjectName= {projectName} ProjectId={projectId}
    ClientId = {clientId}

  />
    }
        <AddClientModal isModalOpen={openModalAddClient} onClose={handleClose}
      />
       <UpdateClientModal
      ModalOpen = {showUpdateClientModal}
      onClose={closeUpdateClientModal}
      clientId = {clientId}
      exisitngClientName={clientName}
      />
      
      <DeleteClientModal 
      ModalOpen = {showDeleteClientModal}
      onClose={handleClose}
      clientId={clientId}
      clientName={clientName}
     
      />
      <DeleteProjectModal
      ModalOpen = {showDeleteProjectModal}
      onClose={handleClose}
      projectId={projectId}
      projectName={projectName}

      />
      <RemoveTeamMember
      ModalOpen = {openRemoveTeam}
      onClose={handleClose}
      projectId={projectId}
      userId={userId}
      roleId={roleId}
      projectName={projectName}
      firstName={firstName}
      lastName={lastName}

      />
      
        <ViewProfileModal
        isModalOpen={openModalViewProfile}
        onClose={closeProfile}
        isAdmin={isAdmin}
      />
    
    </div>
  )
}

export default ProjectsComponent