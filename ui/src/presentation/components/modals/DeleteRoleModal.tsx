import { useState } from "react";
import Modal from "./Modal";
import { useDeleteRoleMutation } from "../../../application/services/authApi";
import { toast } from "react-toastify";
type Props= {
    ModalOpen: boolean;
    onClose:()=>void;
    roleId: string;
    roleName: string;

  }

export default function DeleteRole(props:Props) {
        const [deleteRole]= useDeleteRoleMutation()
        const [promptedDelete, setPromptedDelete] = useState<boolean>(false)
    const closeModal = ()=>{
        props.onClose();
    }
   
    const DeleteRole = ()=>{
        deleteRole(props.roleId).unwrap().then(res=>{
            console.log(res);
            toast.success(res.message)
            closeModal()
        }).catch(err=>{
            setPromptedDelete(true)
            console.log(err);
            
        })
    }
  return (
    <div >        <Modal
        isOpen = {props.ModalOpen}
        onClose={closeModal}
        Heading={promptedDelete ? 'Warning!': "Delete Role"}
        >
           {!promptedDelete ? (
            <div>
                <div className='DeleteSkill'>
                <p className="setToAlign">Are you sure want to delete this `<p className="Strong">{props.roleName}</p>` skill?</p>
                <div className='updateDelBtn'>
                <button className='UpdateRoleBtn' onClick={DeleteRole}>Yes</button>
                <button onClick={closeModal}>No</button>
            </div>

           </div>
            </div>
           ):(
            <div>
                        <div className='DeleteSkill'>
                <p className="setToAlign2">This <p className="Strong">{` ${props.roleName} `}</p>  skill cannot be deleted it has employees attached to it </p>
                <div className='updateDelBtn'>
                <button className='UpdateRoleBtn' onClick={closeModal}>Yes</button>
              
            </div>
                
           </div>
            </div>
           )}
        </Modal>
    </div>
  )
}
