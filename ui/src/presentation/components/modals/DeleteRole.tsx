import { useState } from "react";
import Modal from "./Modal";
import { useDeleteRoleMutation } from "../../../application/services/authApi";
import { toast } from "react-toastify";
type Props= {
    ModalOpen: boolean;
    onClose:()=>void;
    RoleId: number;
    RoleName: string;

  }

export default function DeleteRole(props:Props) {
const [deleteRole]= useDeleteRoleMutation()
const [promptedDelete, setPromptedDelete] = useState<boolean>(false)
const [loading, setLoading] = useState<boolean>(false)
const closeModal = ()=>{
        props.onClose();
        setPromptedDelete(false)
    }
   
    const DeleteRole = ()=>{
        setLoading(true)
        deleteRole(props.RoleId).unwrap().then(res=>{
            console.log(res);
            setLoading(false)
            toast.success(res.message)
            closeModal()
        }).catch((err)=>{
            setLoading(false)
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
                <p className="setToAlign">Are you sure want to delete this `<p className="Strong">{props.RoleName}</p>` role?</p>
               {loading ? (
                <button className="adding">Deleting....</button>
               ):(
                <div className='updateDelBtn'>
                <button className='UpdateRoleBtn' onClick={DeleteRole}>Yes</button>
                <button onClick={closeModal}>No</button>
            </div>
               )}

           </div>
            </div>
           ):(
            <div>
                        <div className='DeleteSkill'>
                <p className="setToAlign2">
                    <p>This</p> 
                    <p className="Strong">{` ${props.RoleName} `}</p> 
                     <p>Role cannot be deleted it has employees attached to it </p>
                    </p>
                <div className='updateDelBtn'>
                <button className='UpdateRoleBtn' onClick={closeModal}>Ok</button>
              
            </div>
                
           </div>
            </div>
           )}
        </Modal>
    </div>
  )
}
