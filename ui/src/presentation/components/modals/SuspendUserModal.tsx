import React, {  useState } from "react"
import Modal from "./Modal"
import CustomInput2 from "../AppInputs/CustomInput2"
import { toast } from "react-toastify"
import { useSuspendUserMutation } from "../../../application/services/authApi"
import Spinner from "../Spinner/Spinner"
import { RootState } from "../../../infrastructure/app/store"
import { useDispatch, useSelector } from "react-redux"
import { friendlyErrorMessage } from "../../../domain/valueObjects/appStrings"
import { clearSelectedUser } from "../../../application/slices/authSlice"

type Props = {
    isModalOpen: boolean,
    onClose: () => void,
}
const SuspendUserModal: React.FC<Props> = ({ isModalOpen, onClose }) => {

    const authState = useSelector((state: RootState) => state.auth);
    const userId = authState.userState.selectedUser?.userId;

    const [reason, setReason] = useState<string>('')
    const [errors, setErrors] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false); // State to track loading status
    const [suspendUser] = useSuspendUserMutation();
    const dispatch = useDispatch();

    const handleClose = () => {
        onClose();
        setReason("");
        dispatch(clearSelectedUser())
    };

    const handleSuspendUser = async () => { // Modified to async function
        if (validateReason(reason.trim()) && userId) {
            setErrors("");
            setIsLoading(true); // Set loading state to true before making the mutation
            try {
                await suspendUser({ userId: userId, reason: reason }); // Await the suspendUser mutation
                toast.success('User suspended successfully');
                setReason('');
                handleClose();
            } catch (error) {
                toast.error(friendlyErrorMessage);
            } finally {
                setIsLoading(false); // Set loading state back to false after the mutation is complete
            }
        }
    };

    const validateReason = (value: string): boolean => {
        if (value.trim().length < 1) {
            setErrors("Please provide a reason")
            return false;
        } else if (value.length < 10) {
            setErrors("Reason must be at least 10 characters")
            return false;
        } else {
            setErrors("")
            return true;
        }
    }

    return (
        <div>
            <Modal
                isOpen={isModalOpen}
                onClose={handleClose}
                Heading="Suspend User"
            >
                <div className="addSkill">
                    <div className="addSkillInput">
                        <CustomInput2
                            type="text"
                            label="Reason for Suspension"
                            value={reason}
                            name="reason"
                            placeholder="E.g. Indiscipline"
                            errorMessage={errors}
                            required={true}
                            onChange={(e) => {
                                const tempVal = e.target.value;

                                validateReason(tempVal)
                                setReason(tempVal);
                            }}
                        />
                    </div>

                    {isLoading && <div className="addSkillLoader">
                        <Spinner />
                    </div>}

                    {!isLoading && <div className="addSkillBtns">
                        <button className="add-skill" onClick={handleSuspendUser}> Yes </button>
                        <button className="cancel-skill" onClick={handleClose}>No</button>
                    </div>}
                </div>

            </Modal>
        </div>
    )

}
export default SuspendUserModal;
