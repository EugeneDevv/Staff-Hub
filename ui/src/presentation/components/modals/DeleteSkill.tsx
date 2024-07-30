import { useState } from "react";
import Modal from "./Modal";
import { useDeleteSkillMutation } from "../../../application/services/authApi";
import { toast } from "react-toastify";
type Props= {
    ModalOpen: boolean;
    onClose:()=>void;
    skillId: string;
    skillName: string;

  }

export default function DeleteSkill(props:Props) {
        const [deleteSkill]= useDeleteSkillMutation()
        const [promptedDelete, setPromptedDelete] = useState<boolean>(false)
        const [loading, setLoading] = useState<boolean>(false)
    const closeModal = ()=>{
        props.onClose();
    }
   
    const DeleteRole = ()=>{
        setLoading(true)
        deleteSkill(props.skillId).unwrap().then(res=>{
            console.log(res);
            toast.success(res.message)
            setLoading(false)
            closeModal()
        }).catch(err=>{
            setLoading(false)
            setPromptedDelete(true)
            console.log(err);
            
        })
    }
  return (
    <div >        <Modal
        isOpen = {props.ModalOpen}
        onClose={closeModal}
        Heading={promptedDelete ? 'Warning!': "Delete Skill"}
        >
           {!promptedDelete ? (
            <div>
                <div className='DeleteSkill'>
                <p className="setToAlign">Are you sure want to delete this `<p className="Strong">{props.skillName}</p>` skill?</p>
                {loading ?(
                    <button className="adding">Deleting...</button>
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
                <p className="setToAlign2">This <p className="Strong">{` ${props.skillName} `}</p>  skill cannot be deleted it has employees attached to it </p>
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
