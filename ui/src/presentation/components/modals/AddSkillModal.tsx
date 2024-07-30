import { useState } from "react"
import { useAddSkillMutation } from "../../../application/services/authApi"
import Modal from "./Modal"
import CustomInput2 from "../AppInputs/CustomInput2"
import { toast } from "react-toastify"


type Props = {
    isModalOpen: boolean,
    onClose: () => void,
}
const AddSkillModal = (props: Props) => {

    const [skillName, setSkillName] =   useState<string>('')
    const[addNewSkill] = useAddSkillMutation()
    const [loading, setLoading] = useState(false)

    const handleClose = () => {
      props.onClose();

      setSkillName("");

    };

    const getSkillName = (e: React.ChangeEvent<HTMLInputElement>) =>  {
        console.log(4);
        
        setSkillName(e.target.value);
    }
    const cancel = ()=>{
        props.onClose()
        setSkillName("")
    }

    const addSkill = ()=>{
        if(!skillName){
            toast.warning("Please add a skill")
            setSkillName("")
        }
        else{
            setLoading(true)
            addNewSkill({
                name: skillName
            }).unwrap().then(res => {
                toast.success(res.message)
                setSkillName("")
                setLoading(false)
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
            Heading="Add Skill"
            >
                <div className="addSkill">
                    <div className="addSkillInput">
                    <CustomInput2
                    type="text"
                    label="Skill Name"
                    value={skillName}
                    name="skill"
                    placeholder="E.g React"
                    errorMessage=""
                    required = {true}
                    onChange={getSkillName}
                    >
                    </CustomInput2>
                    </div>

                    {!loading ? (
                        <div className="addSkillBtns">
                        <button className="add-skill" onClick={addSkill}> Add </button>
                        <button className="cancel-skill" onClick={cancel}>Cancel</button>                    
                    </div>
                    ):(
                        <button className="adding">Adding...</button>
                    )}
                </div>

            </Modal>
        </div>
    )

}
export default AddSkillModal;