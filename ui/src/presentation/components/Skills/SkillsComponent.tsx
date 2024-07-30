import './SkillsComponent.scss'
import CustomInput from '../AppInputs/CustomInput'
import { useEffect, useState, useCallback, useRef } from 'react'
import { 
  useLazyGeSkillsQuery,
  useLazyGetUsersBySkillsQuery,
  useLazySingleUserQuery
 } from '../../../application/services/authApi'
import '../Projects/ProjectsComponent.scss'
import UpdateSkill from '../modals/UpdateSkill'
import AddSkillModal from '../modals/AddSkillModal'
import DeleteRole from '../modals/DeleteSkill'
import Spinner from '../Spinner/Spinner'
import { useDispatch } from 'react-redux'
import ViewProfileModal from '../modals/ViewProfileModal'
import { ApiResponse } from '../../../application/apiTypes'
import { UserProfile } from '../../../domain/models/user.model'
import { setSelectedUser } from '../../../application/slices/authSlice'
import { toast } from 'react-toastify'
import { getUser } from '../../../domain/valueObjects/utils'
 interface ISkills  {
   id: string,
   name:string
   deleted:false
 }
 interface IUser {
  userId: string;
  firstName: string;
  lastName:string,
  skills:IUserSkill[],

}
interface LoggedInUser{
  role:string
}
interface IUserSkill {
  skillId: string;
  name: string;
  proficiencyLevel: string;
}
const SkillsComponent= () => {
  const [searchSkill, setSearchSkill] = useState<string>("")
  const [skills, setSkills] = useState<ISkills[]>([])
  const [fetchSkills] = useLazyGeSkillsQuery({})
  const [skillId, setSkillId] = useState<string>("")
  const [fetchUsersBySkill] = useLazyGetUsersBySkillsQuery({})
  const [projectRoleName, setProjectRoleName] = useState<string>("")
  const [popupVisible, setPopupVisible] = useState(false);
  const [usersBySkill, setUsersBySkill] = useState<IUser[]>([])
  const [showUpdateRoleModal, setShowUpdateRoleModal] = useState<boolean>(false)
  const [openSkillModal, setOpenSkillModal]= useState<boolean>(false)
  const [openDelModal, setOpenDelModal] = useState<boolean>(false)
  const [count, setCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [userRole, setUserRole] = useState<LoggedInUser>()
  const [openModalViewProfile, setOpenModalViewProfile] = useState(false);
  const [userById] = useLazySingleUserQuery();
  const dispatch = useDispatch()
  const user = getUser();
 
  const isAdmin = (user?.role === "SuperAdmin" || user?.role === "Admin")
 
  const OpenModalAddSkill = ()=>{
    setOpenSkillModal(true)
  }
  const handleClose = ()=>{
    setOpenSkillModal(false)
    setOpenDelModal(false)
    FetchProjectRoles()
  
  }
  const togglePopup = (id:string, skillName:string) => {
    setPopupVisible(!popupVisible);
    setSkillId(id)
   
    setProjectRoleName(skillName)
    fetchUsersBySkill(id).then((res)=>{
      
      
      const proficiencyOrder: { [key: string]: number } = {
        Beginner: 4,
        Intermediate: 3,
        Expert: 1,
        Proficient:2
      };
      const sortByProficiency = (a: IUser, b: IUser) => {
        const proficiencyA = a.skills.length > 0 ? proficiencyOrder[a.skills[0].proficiencyLevel] : 0;
        const proficiencyB = b.skills.length > 0 ? proficiencyOrder[b.skills[0].proficiencyLevel] : 0;
        return proficiencyA - proficiencyB;
      };
    
      const sortedUsers = res.data.data.slice().sort(sortByProficiency);
      console.log(sortedUsers);
      setUsersBySkill(sortedUsers)
    }).catch((err)=>{
      console.log(err);
      
    })
  };

  function startSkillSearch(e: React.ChangeEvent<HTMLInputElement>) {

 
      const inputValue = e.target.value.trim().toLowerCase(); 
      setSearchSkill(inputValue);
      console.log(inputValue);
      
      const Count = inputValue.length
      if(Count > count){
        setCount(Count)
      }
      if(Count< count){
        fetchSkills({}).then(res => {
  
          const filteredSkills: ISkills[] = res.data.data.filter((skills:ISkills) =>
            skills.name.toLowerCase().includes(inputValue)
          );
       
           setSkills(filteredSkills);
        }).catch(err => {
          console.log(err);
        });
       
      }
      
      const filteredSkills: ISkills[] = skills.filter((skills:ISkills) =>
        skills.name.toLowerCase().includes(inputValue)
      );
   
       setSkills(filteredSkills);
    
     
      if (inputValue.length === 0) {
        FetchProjectRoles();
      }
    }
   
  
  const FetchProjectRoles = useCallback(() => {
    setLoading(true)
    fetchSkills({}).then(res => {
      console.log(res);
    
      const sortedSkills:ISkills[] = [...res.data.data].sort((a:ISkills,b:ISkills)=>a.name.localeCompare(b.name))
      setSkills(sortedSkills);
      console.log(res.data.data);
      setSkillId(sortedSkills[0].id);
      setProjectRoleName(sortedSkills[0].name);
     
      setLoading(false)
     
      fetchUsersBySkill(sortedSkills[0].id).then(res => {
        console.log(res);
       if(res.data.data){
        console.log(1);
        
        const proficiencyOrder: { [key: string]: number } = {
          Beginner: 4,
          Intermediate: 3,
          Expert: 1,
          Proficient:2
        };
        const sortByProficiency = (a: IUser, b: IUser) => {
          const proficiencyA = a.skills.length > 0 ? proficiencyOrder[a.skills[0].proficiencyLevel] : 0;
          const proficiencyB = b.skills.length > 0 ? proficiencyOrder[b.skills[0].proficiencyLevel] : 0;
          return proficiencyA - proficiencyB;
        };
      
        const sortedUsers = res.data.data.slice().sort(sortByProficiency);
        console.log(sortedUsers);
        setUsersBySkill(sortedUsers)
       }
       console.log(6);
       
       setLoading(false)
      
      }).catch(err => {
        console.log(err);
      });
    }).catch(err => {
      console.log(err);
      setLoading(false)
    });
  }, [fetchSkills, fetchUsersBySkill]);
  const showUsers = (skillId:string, skillName:string)=>{
    setLoading(true)
    setSkillId(skillId)
    setProjectRoleName(skillName)
    setPopupVisible(false)
    fetchUsersBySkill(skillId).then((res)=>{
     if(res.data.data){
      console.log(res.data.data);
      console.log(res);
      const proficiencyOrder: { [key: string]: number } = {
        Beginner: 4,
        Intermediate: 3,
        Expert: 1,
        Proficient:2
      };
      const sortByProficiency = (a: IUser, b: IUser) => {
        const proficiencyA = a.skills.length > 0 ? proficiencyOrder[a.skills[0].proficiencyLevel] : 0;
        const proficiencyB = b.skills.length > 0 ? proficiencyOrder[b.skills[0].proficiencyLevel] : 0;
        return proficiencyA - proficiencyB;
      };
    
      const sortedUsers = res.data.data.slice().sort(sortByProficiency);
      console.log(sortedUsers);
      setUsersBySkill(sortedUsers)
      setLoading(false)
     }else{
      setLoading(false)
      setUsersBySkill([])
     }


    }).catch((err)=>{
      console.log(err);
      
    })
  }
  const updateRole = ()=>{
    setPopupVisible(false)
    setShowUpdateRoleModal(true)
  }
  const deleteRole = (id:string)=>{
    setSkillId(id)
    setOpenDelModal(true)
  }

  const closeUpdateRole = ()=>{
    setShowUpdateRoleModal(false)
    setSearchSkill("")
    fetchUsersBySkill(skillId).then((res)=>{
      console.log(res);
      const proficiencyOrder: { [key: string]: number } = {
        Beginner: 4,
        Intermediate: 3,
        Expert: 1,
        Proficient:2
      };
      const sortByProficiency = (a: IUser, b: IUser) => {
        const proficiencyA = a.skills.length > 0 ? proficiencyOrder[a.skills[0].proficiencyLevel] : 0;
        const proficiencyB = b.skills.length > 0 ? proficiencyOrder[b.skills[0].proficiencyLevel] : 0;
        return proficiencyA - proficiencyB;
      };
    
      const sortedUsers = res.data.data.slice().sort(sortByProficiency);
      console.log(sortedUsers);
      setUsersBySkill(sortedUsers)

    }).catch((err)=>{
      console.log(err);
      
    })
    FetchProjectRoles()
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

  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const Role = localStorage.getItem("user");
    const parsedRole = Role ? JSON.parse(Role) : "User";

    setUserRole(parsedRole)
    FetchProjectRoles();
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {

       setPopupVisible(false)
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    
  },[FetchProjectRoles])
  return (
  <div>
    {loading &&
    <div className='main'>
    <Spinner/>
      </div>

    }
    <div className='RolePg'>
      
      <div className='AddRole'>
            <div className='searchRole'>
            <CustomInput
                    type="text"
                    value={searchSkill}
                    name={""}
                    placeholder="E.g Angular"
                    errorMessage=""
                    onChange={startSkillSearch}
                    label="Search Skill"
                  />
            </div>
            <div className='AddRoleBtn'>
            {userRole && userRole.role === "Admin" ? (
                     <button onClick={OpenModalAddSkill}>Add New Skill</button>
                    ):(
                      <></>
                    )}
            </div>
          </div>
            <div className='sec2'>
          <div className='addScroll'>
            
          <div className="displayRolesEmployee">
          <p className="rolesAvailable"> {skills.length} Skills Available</p>
              <div className="roles">
                {skills.length > 0 && skills.map((skills:ISkills)=>(
                 <div className={skills.id === skillId ? "roleClicked" : "roleNotClicked"} >
                  <p className='roleName'  onClick={()=>showUsers(skills.id, skills.name)}>{skills.name}</p>
                  
                            <div className="iconContainer">
                    {userRole && userRole.role  === "Admin" ?(
                         <p className="moreIcon" onClick={()=>togglePopup(skills.id, skills.name)} id="moreIcon"></p>  
                    ):(
                      <p className="moreIco" onClick={()=>togglePopup(skills.id, skills.name)} >ddd</p>  
                    )
                  }
                    {skills.id === skillId && popupVisible && (
              <div className="menuProjects" ref={menuRef}>
                <ul>
                  <li onClick={updateRole}>Update Skill</li>
                  <li onClick={()=>deleteRole(skills.id)} className='delClient'>Delete Skill</li>
                </ul>
              </div>
            )}
                  </div>
      
                 
                 </div>
                ))}
              </div>
            </div>
          </div>
            <div className="disEmployee">
                      
              <p className='employeeHeading'>Team proficient in <p className='RoleName'>'{projectRoleName}'</p></p>
              {usersBySkill &&usersBySkill.map((user:IUser)=>(
                <div className='disEmployeeViewProfile'>
                  <p>{user.firstName} {user.lastName}</p>
                  <p>{user.skills[0].proficiencyLevel}</p>
                <button className='viewProfile' onClick={()=>openProfile(user.userId)}>View Profile</button>
                </div>
              ))}
            
              </div>
            </div>
            <UpdateSkill
            ModalOpen = {showUpdateRoleModal}
            onClose={closeUpdateRole}
            skillId = {skillId}
            skillName={projectRoleName}
            />
            <AddSkillModal 
            isModalOpen = {openSkillModal}
            onClose={handleClose} 
            />
            {openDelModal &&
            <DeleteRole
              ModalOpen = {openDelModal}
              onClose={handleClose}
              skillId={skillId}
              skillName = {projectRoleName}
            />
            }
            <ViewProfileModal
        isModalOpen={openModalViewProfile}
        onClose={closeProfile}
        isAdmin={isAdmin}
      />
          </div>
      
  </div>  
  )
}

export default SkillsComponent

