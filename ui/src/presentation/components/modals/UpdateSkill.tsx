import React, { useState } from 'react'
import Modal from './Modal';
import CustomInput2 from '../AppInputs/CustomInput2';
import { useUpdateSkillMutation } from '../../../application/services/authApi';
import { toast } from 'react-toastify';
type Props= {
    ModalOpen: boolean;
    onClose:()=>void;
    skillId: string,
    skillName:string

  }
export default function UpdateSkill(props:Props) {
    const [skillName, setSkillName] = useState<string>("")
    const [updateSkill] = useUpdateSkillMutation()
    const [loading, setLoading] = useState<boolean>(false)
    const closeModal = ()=>{
        props.onClose();
        setSkillName("")
    }
    const takeSkillName = (e: React.ChangeEvent<HTMLInputElement>)=>{
        setSkillName(e.target.value.trim())
    }
    const UpdateSkill = ()=>{
        if(!skillName){
            toast.warn("Add a skill to continue")
        }else if(props.skillName === skillName){
            toast.warn("New role is the same as the current role. No changes made.")
        }
        else{
            setLoading(true)
            updateSkill({skillId:props.skillId, name:skillName}).unwrap().then((res)=>{
                setLoading(false)
                console.log(res);
                
                toast.success(res.message);
                closeModal()
                
            }).catch(err=>{
                setLoading(false)
                toast.error(err.data.message)
            })
        }
    }
  return (
    <div >        <Modal
        isOpen = {props.ModalOpen}
        onClose={closeModal}
        Heading='Update Skill'
        >
           <div className='UpdateRole'>
           <div className='input'>
            <CustomInput2
              type="text"
              value={skillName}
              name={""}
              placeholder={props.skillName}
              errorMessage=""
              onChange={takeSkillName}
              label="Skill Name"
              required={true}
            />
            </div>
            {!loading ? (
                     <div className='updateDelBtn'>
                     <button className='UpdateRoleBtn' onClick={UpdateSkill}>Update</button>
                     <button onClick={closeModal}>Cancel</button>
                 </div>
            ):(
                <button className="adding">Updating ....</button>
            )}
           </div>
        </Modal>
    </div>
  )
}
