import { useState } from "react";
import Modal from "./Modal";
import { useDeleteClientMutation } from "../../../application/services/authApi";
import { toast } from "react-toastify";
type Props= {
    ModalOpen: boolean;
    onClose:()=>void;
    clientId: number;
    clientName: string;

  }

export default function DeleteClient(props:Props) {
const [deleteClient]= useDeleteClientMutation()
const [promptedDelete, setPromptedDelete] = useState<boolean>(false)
const [loading, setLoading] = useState<boolean>(false)
const closeModal = ()=>{
    props.onClose();
    setPromptedDelete(false)
        }
   
    const RemoveClient = ()=>{
        setLoading(true)
        deleteClient(props.clientId).unwrap().then(res=>{
            console.log(res);
            setLoading(false)
            toast.success(res.message)
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
        Heading={promptedDelete ? 'Warning!': "Delete Client"}
        >
           {!promptedDelete ? (
            <div>
                <div className='DeleteSkill'>
                <p className="setToAlign">Are you sure want to delete this `<p className="Strong">{props.clientName}</p>` client?</p>
            {!loading ?(
                     <div className='updateDelBtn'>
                     <button className='UpdateRoleBtn' onClick={RemoveClient}>Yes</button>
                     <button onClick={closeModal}>No</button>
                 </div>
            ):(
                <button className="adding">Deleting...</button>
            )}

           </div>
            </div>
           ):(
            <div>
                        <div className='DeleteSkill'>
                <p className="setToAlign2">This <p className="Strong">{` ${props.clientName} `}</p>  client cannot be deleted it has projects attached to it </p>
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
