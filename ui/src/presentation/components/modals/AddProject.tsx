import React, { useState } from 'react'
import Modal from './Modal'
import CustomInput2 from '../AppInputs/CustomInput2'
import { toast } from 'react-toastify';
import './Modal.scss'
import { useAddProjectMutation } from '../../../application/services/authApi';
import Spinner from '../Spinner/Spinner';
type Props = {
    isModalOpen: boolean,
    onClose: () => void;
    clientName:string,
    clientId: number
  }
const AddProject = (props: Props) => {
    const [ProjectName, setProjectName] = useState<string>("")
    const [AddProject] = useAddProjectMutation()
    const [loading, setLoading] = useState<boolean>(false)

  const handleClose = ()=>props.onClose()
  const takeClient = ()=>{

  }
  const takeProject = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setProjectName(e.target.value)
  }
  const addProject = ()=>{
    if(!ProjectName){
        toast.warn("Add Project to continue")
        setProjectName("")
      
    }else{
      setLoading(true)

        AddProject({clientId:props.clientId, projectName:ProjectName}).unwrap().then(res=>{
            handleClose()
            toast.success(res.message)
           setLoading(false)
        }).catch(err=>{
            toast.warn(err.data.message)
            setLoading(false)
        })
    }
  }
  const cancel = ()=>{
    props.onClose()
    setProjectName("")
}
    return (
    <div >
        <Modal
        isOpen = {props.isModalOpen}
        onClose={handleClose}
        Heading='Add Project'
        >
            <div className='addProject'>
            <div className='addProjectInput'>
            <CustomInput2
              type="text"
              value={props.clientName}
              name={""}
              placeholder="E.g. +254703298507"
              errorMessage=""
              onChange={takeClient}
              label="Client Name"
            />
                        <CustomInput2
              type="text"
              value={ProjectName}
              name={""}
              placeholder="E.g. DQB Data Loader"
              errorMessage=""
              onChange={takeProject}
              label="Project Name"
              required={true}
            />
            </div>
           {!loading ?(
             <div className='addProjectBtn'>
             <button onClick={addProject} className='add'>Add</button>
             <button className='cancel' onClick={cancel}>Cancel</button>
         </div>
           ):(
            <Spinner/>
           )}
                 </div>
        </Modal>
    </div>
  )
}

export default AddProject