import { useState } from "react"
import { useAddClientMutation } from "../../../application/services/authApi"
import Modal from "./Modal"
import CustomInput2 from "../AppInputs/CustomInput2"
import { toast } from "react-toastify"
import Spinner from "../Spinner/Spinner"
type Props = {
    isModalOpen: boolean,
    onClose: () => void,
    
}
const AddClientModal = (props: Props) => {
      
    const [clientName, setClientName] =   useState<string>('')
    const[addNewClient] = useAddClientMutation()
    const [loading, setLoading] = useState<boolean>(false)
    const handleClose = () => {
      props.onClose();

      setClientName("");

    };

    const getClientName = (e: React.ChangeEvent<HTMLInputElement>) =>  {   
        setClientName(e.target.value);
    }
    const cancel = ()=>{
        props.onClose()
        setClientName("")
    }

    const addClient = ()=>{
        if(!clientName){
            toast.warning("Client name cannot be empty")
            setClientName("")
        }
        else{
            setLoading(true)
            addNewClient({
                clientName: clientName
            }).unwrap().then(res => {
                setLoading(false)
                toast.success(res.message)
                setClientName("")
                props.onClose()
                console.log(res)
            }).catch(err => {
                setLoading(false)
                toast.error(err.data.message)
                console.log(err)
            });
        }

          

    }

    return (
        <div>
            <Modal
            isOpen = {props.isModalOpen}
            onClose = {handleClose}
            Heading="Add Client"
            >
                <div className="addSkill">
                    <div className="addSkillInput">
                    <CustomInput2
                    type="text"
                    label="Client Name"
                    value={clientName}
                    name="client"
                    placeholder="E.g. PRISM HR"
                    errorMessage=""
                    required = {true}
                    onChange={getClientName}
                    >
                    </CustomInput2>
                    </div>

                    <div className="addSkillBtns">
                        {loading ?(
                           <Spinner/>
                        ):(
                            <div className="addSkillBtns">
                            <button className="add-skill" onClick={addClient}> Add </button>
                            <button className="cancel-skill" onClick={cancel}>Cancel</button>     
                            </div>
                        )}
                                      
                    </div>
                </div>

            </Modal>
        </div>
    )

}
export default AddClientModal;