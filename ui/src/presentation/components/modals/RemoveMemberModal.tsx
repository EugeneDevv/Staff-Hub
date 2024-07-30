import Modal from "./Modal";
import { useRemoveTeamMemberMutation } from "../../../application/services/authApi";
import { toast } from "react-toastify";

interface Props {
    ModalOpen: boolean;
    onClose:()=>void;
    projectId: number;
    roleId: number;
    userId: string;
    projectName:string
    firstName: string;
    lastName: string;

  }

export default function RemoveTeamMember(props:Props) {

const [removeTeamMember]= useRemoveTeamMemberMutation()

const closeModal = ()=>{
        props.onClose();

    }
   
const removeMember = ()=>{
    removeTeamMember({projectId:props.projectId, userId: props.userId, roleId: props.roleId}).unwrap().then(res=>{
        console.log(res);
        console.log(`projectId: ${props.projectId}, roleId: ${props.roleId} userId: ${props.userId} `);
        toast.success(res.message)
        closeModal()
    }).catch(err=>{
        console.log(`error: ${err}`);
    })
}
  return (
    <div >        <Modal
        isOpen = {props.ModalOpen}
        onClose={closeModal}
        Heading={"Remove from project"}
        >
            <div>
                <div className='DeleteSkill'>
                <p className="setToAlign">Are you sure want to remove  `<p className="Strong">{props.firstName} &nbsp; {props.lastName}</p>` from project?</p>
                <div className='updateDelBtn'>
                <button className='UpdateRoleBtn' onClick={removeMember}>Yes</button>
                <button onClick={closeModal}>No</button>
            </div>

           </div>
            </div>

        </Modal>
    </div>
  )
}
