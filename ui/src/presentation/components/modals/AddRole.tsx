import React, { useState } from 'react'
import Modal from './Modal';
import CustomInput2 from '../AppInputs/CustomInput2';
import { useAddRoleMutation } from '../../../application/services/authApi';
import { toast } from 'react-toastify';
type Props= {
    ModalOpen: boolean;
    onClose:()=>void;
    

  }
export default function AddRole(props:Props) {
    const [roleName, setRoleName] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [addRole] = useAddRoleMutation()
    const closeModal = ()=>{
        props.onClose();
        setRoleName("")
    }
    const takeRoleName = (e: React.ChangeEvent<HTMLInputElement>)=>{
        setRoleName(e.target.value.trimStart())
    }
    const UpdateRole = ()=>{
        console.log(roleName);
        
        if(!roleName){
            toast.warn("Add a role to continue")
        }else{
            setLoading(true)
            addRole(roleName).unwrap().then(res=>{
                console.log(res);
                setLoading(false)
                toast.success(res.message);
                closeModal()
                
            }).catch(err=>{
                setLoading(false)
                console.log(err);
                toast.warn(err.data.message)
                
            })
        }
    }
  return (
    <div >        <Modal
        isOpen = {props.ModalOpen}
        onClose={closeModal}
        Heading='Add Role'
        >
           <div className='UpdateRole'>
           <div className='input'>
            <CustomInput2
              type="text"
              value={roleName}
              name={""}
              placeholder="E.g. Scurm Master"
              errorMessage=""
              onChange={takeRoleName}
              label="Role Name"
              required={true}
            />
            </div>
            {loading ? (
                <div className='updateDelBtn'>
                <button>Adding...</button>
                </div>
            ):(
                <div className='updateDelBtn'>
                <button className='UpdateRoleBtn' onClick={UpdateRole}>Add</button>
                <button onClick={closeModal}>Cancel</button>
            </div>
            )}
           </div>
        </Modal>
    </div>
  )
}
