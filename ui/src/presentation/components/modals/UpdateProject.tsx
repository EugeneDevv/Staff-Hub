import React, { useState } from 'react'
import Modal from './Modal'
import CustomInput2 from '../AppInputs/CustomInput2';
import { toast } from 'react-toastify';
import { useUpdateProjectMutation } from '../../../application/services/authApi';
type Props  ={
    isModalOpen : boolean;
    onClose : ()=>void;
    ProjectName: string,
    ProjectId:number,
    ClientId: number

}
export const UpdateProject = (props:Props) => {
    const [updatedProjectName, setUpdatedProjectName] = useState<string>("")
    const [displayErrorMsg, setErrorMsg] = useState<string>("")
    const [UpdateProject] = useUpdateProjectMutation()
    const [loading, setLoading] = useState<boolean>(false)
    const takeUpdatedProject = (e: React.ChangeEvent<HTMLInputElement>)=>{
        if(e.target.value.toLocaleLowerCase() === props.ProjectName.toLocaleLowerCase()){
            setErrorMsg("The current project name cannot be the same as the updated project name.")
        }else{
            setErrorMsg("")
        }
        setUpdatedProjectName(e.target.value.trimStart())

    }
    const updateProject = ()=>{
        if(updatedProjectName.trimEnd() === ""){
            toast.error("The project name cannot be empty")
        }else if(updatedProjectName.toLocaleLowerCase() === props.ProjectName.toLocaleLowerCase()){
            toast.error("The current project name cannot be the same as the updated project name.")
            setUpdatedProjectName("")
            setErrorMsg("")
        }else{
            setLoading(true)
            const data = {
                projectName: updatedProjectName,
                projectId: props.ProjectId,
                clientId: props.ClientId,
            }
           UpdateProject(data).unwrap().then(res=>{
            setLoading(false)
            toast.success(res.message)
            props.onClose()
            
           }).catch((err:{data:{message:string}})=>{
            setLoading(false)
             toast.error(err.data.message)
            console.log(err);
            
           })
        }
        
    }
    const TakeUpdatedProject = ()=>{}
    const close= ()=>{
        setUpdatedProjectName("")
        props.onClose()
    }

  return (
    <div>
        <Modal
           isOpen = {props.isModalOpen} 
           onClose={props.onClose}
           Heading='Update Project'
        >
            <div className="updateProject">
                <div className='updateProjectInput'>
                <CustomInput2
                 type="text"
                 value={props.ProjectName}
                 name={""}
                 placeholder={props.ProjectName}
                 errorMessage={ "" }
                 onChange={TakeUpdatedProject}
                 label="Current Project Name"
                />
                      <CustomInput2
                 type="text"
                 value={updatedProjectName}
                 name={""}
                 placeholder={`E.g ${props.ProjectName}`}
                 errorMessage={displayErrorMsg ? displayErrorMsg : "" }
                 onChange={takeUpdatedProject}
                 label="New Project Name"
                 required={true}
                />
                </div>
             {loading ?(
                <button className='adding'>Updating...</button>
             ):(
                <div className="updateProjectBtn">
                <button className='updateProjectBtn1' onClick={updateProject}>Update</button>
                <button onClick={close}>Cancel</button>
            </div>
             )}
            </div>
        </Modal>
    </div>
  )
}
