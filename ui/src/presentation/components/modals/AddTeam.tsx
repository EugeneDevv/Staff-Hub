import React, {  useState } from 'react'
import Modal from './Modal'
import CustomInput from '../AppInputs/CustomInput';
import { useLazySearchUserTeamQuery, useLazyGetProjectRolesQuery, useAddEmployeeToTeamMutation } from '../../../application/services/authApi';
import { UserProfile } from '../../../domain/models/user.model';
import { toast } from 'react-toastify';
type Props= {
    ModalOpen: boolean;
    onClose:()=>void;
    projectName: string;
    projectId: number
  }
const AddTeam = (props:Props) => {
    interface ProjectRoles {
        projectRoleId: number;
        projectRoleName: string;
      } 
    const [employees, setEmployees] = useState<UserProfile[]>([])
    const [searchUser] = useLazySearchUserTeamQuery()
    const [searchedUser, setSearchedUser] = useState<string>("")
    const [userId, setUserId] = useState<string>("")
    const [showRoles, setShowRoles] = useState<boolean>(false)
    const [fetchRoles] = useLazyGetProjectRolesQuery()
    const [addEmployeeToTeam] = useAddEmployeeToTeamMutation()
    const [roles, setRoles] = useState<ProjectRoles[]>([])
    const [roleId, setRoleId] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false)
    const closeModal = ()=>{
        props.onClose()
        setEmployees([])
        setSearchedUser("")
        setRoleId(0)
        setRoles([])
    }
    
    const takeTeamMember = (e: React.ChangeEvent<HTMLInputElement>)=>{
        setShowRoles(false)
        console.log("change");
        if(e.target.value === ""){
            setEmployees([])
        }
        setSearchedUser(e.target.value)
            searchUser(e.target.value).then(res=>{
                console.log(res.data.data);
                setEmployees(res.data.data)
            }).catch(err=>{
                console.log(err);
            })
    }
    const startSearchUser = (id:string, firstName:string, lastName:string)=>{
    
        setSearchedUser(`${firstName} ${lastName} `)
        setUserId(id)
        setShowRoles(true)
        fetchRoles({}).unwrap().then(res=>{
            console.log(res);
            setRoles(res.data)
            
        }).catch(err=>{
            console.log(err);
            
        })
    }
    const addToTeam = ()=>{
        if(!userId){
            toast.error("Add a user to continue")
        }
        else if(!roleId){
            toast.error("Add a role to continue")
        }else{
            setLoading(true)
            const data = {
              userId:userId,
              projectId: props.projectId,
              projectRoleId:roleId  
            }
            addEmployeeToTeam(data).unwrap().then(res=>{
                toast.success(res.message);
                props.onClose()
                setLoading(false)
            }).catch(err=>{
                setLoading(false)
                toast.error(err.data.message)                
            })
        }

    }

  return (
    <div className='mainAddTeam'>
        <Modal
         isOpen = {props.ModalOpen}
         onClose={closeModal}
         Heading={"Add Team"}
        
        >
            <div className='addTeam'>
            <div className="employeess">
           <div className='setToAlignAddTeam'>
           <p>Search Employee to add to  </p>
           <p className='addTeamProjectName'>{props.projectName}</p>
            </div>    
           
           <CustomInput
              type="text"
              value={searchedUser}
              name={""}
              placeholder="E.g. Jane Doe"
              errorMessage=""
              onChange={takeTeamMember}
              label=""
            />
           </div>
            {!showRoles ?( 
                <div>
                    {employees.length > 0 &&
                    
                    <div className='employeeList'>
                {employees.length > 0 &&  employees.map(e=>{
                    return(
                        <div className='employees' onClick={()=>startSearchUser(e.userId, e.firstName, e.lastName)}>
                           
                           
                            <p>{e.firstName} {e.lastName}</p>
                            {userId === e.userId ? (
                                <div className='outerCircle'>
                                <div className='clickedinnerCircle'></div>
                                </div>
                            ):(
                                <div className='outerCircle'>
                            <div className='innerCircle'></div>
                            </div>
                            )}
                        </div>
                    )
                })}
            </div>
                    }
                </div>
            ):(
                <div className='employeeList'>
                    <p>Select role of the user in {props.projectName}</p>
                    {roles.length > 0 &&  roles.map(e=>{
                    return(
                        <div className='roles' onClick={()=>setRoleId(e.projectRoleId)}>
                           
                           
                            <p> {e.projectRoleName}</p>
                            {roleId === e.projectRoleId ? (
                                <div className='outerCircle'>
                                <div className='clickedinnerCircle'></div>
                                </div>
                            ):(
                                <div className='outerCircle'>
                            <div className='innerCircle'></div>
                            </div>
                            )}
                        </div>
                    )
                })}
           
                </div>
            )}
                 {loading ? (
                    <button className='adding'>Adding...</button>
                 ):(
                    <div className='AddTeamBtn'>
                    <button className='addToTeamBtn' onClick={addToTeam}>Add</button>
                    <button onClick={closeModal}>Cancel</button>
                </div>
                 )}
            </div>
        </Modal>
    </div>
  )
}

export default AddTeam