import React, { useState } from 'react'
import Modal from './Modal';
import CustomInput2 from '../AppInputs/CustomInput2';
import { useUpdateProjectRoleMutation } from '../../../application/services/authApi';
import { toast } from 'react-toastify';
type Props= {
    ModalOpen: boolean;
    onClose:()=>void;
    roleId: number,
    roleName:string
  }
export default function UpdateRole(props:Props) {
    const [roleName, setRoleName] = useState<string>("")
    const [updateProjectRole] = useUpdateProjectRoleMutation()
    const [loading, setLoading] = useState<boolean>(false)
    const closeModal = ()=>{
        props.onClose();
        setRoleName("")
    }
    const takeRoleName = (e: React.ChangeEvent<HTMLInputElement>)=>{
        setRoleName(e.target.value.trimStart())
    }
    const UpdateRole = ()=>{
        if(!roleName){
            toast.warn("Add a role to continue")
        }else if(props.roleName.toLocaleLowerCase() === roleName.toLocaleLowerCase()){
            toast.warn("New role is the same as the current role. No changes made.")
        }
        else{
            setLoading(true)
            updateProjectRole({roleId:props.roleId, roleName:roleName}).unwrap().then(res=>{
               setLoading(false)
                console.log(res);
                
                toast.success("Role updated");
                closeModal()
                
            }).catch(err=>{
                setLoading(false)
                console.log(err);
                toast.warn(err.data.message)
                closeModal()
                
            })
        }
    }
  return (
    <div >        <Modal
        isOpen = {props.ModalOpen}
        onClose={closeModal}
        Heading='Update Role'
        >
           <div className='UpdateRole'>
           <div className='input'>
            <CustomInput2
              type="text"
              value={roleName}
              name={""}
              placeholder={props.roleName}
              errorMessage=""
              onChange={takeRoleName}
              label="Role Name"
              required={true}
            />
            </div>
            {loading ?(
                <button className='adding'>Updating...</button>
            ):(
                <div className='updateDelBtn'>
                <button className='UpdateRoleBtn' onClick={UpdateRole}>Update</button>
                <button onClick={closeModal}>Cancel</button>
            </div>
            )}
           </div>
        </Modal>
    </div>
  )
}
