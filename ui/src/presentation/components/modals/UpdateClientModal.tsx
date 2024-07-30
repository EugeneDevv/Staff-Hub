import React, { useState } from 'react'
import Modal from './Modal';
import CustomInput2 from '../AppInputs/CustomInput2';
import CustomInput from '../AppInputs/CustomInput';

import { useUpdateClientMutation } from '../../../application/services/authApi';
import { toast } from 'react-toastify';
type Props= {
    ModalOpen: boolean;
    onClose:()=>void;
    clientId: number;
    exisitngClientName: string;
  }
export default function UpdateClientModal(props:Props) {
    const [clientName, setClientName] = useState<string>("")
    const [updateClient] = useUpdateClientMutation()
   
    
    const closeModal = ()=>{
        props.onClose();
        setClientName("")
    }
    const getClientName = (e: React.ChangeEvent<HTMLInputElement>)=>{
        setClientName(e.target.value.trimStart())
    }
    const handleUpdateClient = ()=>{
        if(!clientName){
            toast.warn("Client name is required")
        }else{
            updateClient({clientId:props.clientId, clientName: clientName}).unwrap().then((res)=>{
                toast.success(res.message);
                closeModal()
                
            }).catch(err=>{
                console.log(err);
                toast.error(err.data.message);
                
            })
        }
    }
  return (
    <div >        <Modal
        isOpen = {props.ModalOpen}
        onClose={closeModal}
        Heading='Update Client'
        >
           <div className='UpdateRole'>
           <div className='input'>
            <CustomInput
              type="text"
              value={props.exisitngClientName}
              name={""}
              placeholder={clientName}
              errorMessage=""
              onChange={getClientName}
              label="Current Client Name"
              disabled = {true}
            />
            </div>
           <div className='input'>
            <CustomInput2
              type="text"
              value={clientName}
              name={""}
              placeholder="E.g. Howard"
              errorMessage=""
              onChange={getClientName}
              label="New Client Name"
              required={true}
            />
            </div>
            <div className='updateDelBtn'>
                <button className='UpdateRoleBtn' onClick={handleUpdateClient}>Update</button>
                <button onClick={closeModal}>Cancel</button>
            </div>
           </div>
        </Modal>
    </div>
  )
}
