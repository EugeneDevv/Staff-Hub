import React, {   useState } from "react";
import { toast } from "react-toastify";
import { useDeleteUserMutation } from "../../../application/services/authApi";
import Spinner from "../Spinner/Spinner";
import { RootState } from "../../../infrastructure/app/store";
import { useDispatch, useSelector } from "react-redux";
import { friendlyErrorMessage } from "../../../domain/valueObjects/appStrings";
import Modal from "./Modal";
import { clearSelectedUser } from "../../../application/slices/authSlice";

type Props = {
    isModalOpen: boolean;
    onClose: () => void;
};

const DeleteUserModal: React.FC<Props> = ({ isModalOpen, onClose }) => {
    const authState = useSelector((state: RootState) => state.auth);
    const user = authState.userState.selectedUser;

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [deleteUser] = useDeleteUserMutation();
    const dispatch = useDispatch();

    const handleClose = () => {
        onClose();
        dispatch(clearSelectedUser());
    };

    const handleDeleteUser = async () => {
        if (user?.userId) {
            setIsLoading(true); // Set loading state to true before making the mutation
            try {
                await deleteUser(user.userId); // Await the deleteUser mutation
                toast.success('User deleted successfully');
                handleClose();
            } catch (error) {
                toast.error(friendlyErrorMessage);
            } finally {
                setIsLoading(false); // Set loading state back to false after the mutation is complete
            }
        }
    };

    return (
        <div>
            <Modal
                isOpen={isModalOpen}
                onClose={handleClose}
                Heading="Delete Employee"
            >
                <div className="addSkill">
                    <div className="deleteUserDesc">
                        Are you sure you want to delete '<span>{`${user?.firstName} ${user?.lastName}`}</span>' ?
                    </div>

                    {isLoading && <div className="addSkillLoader">
                        <Spinner />
                    </div>}

                    {!isLoading && <div className="addSkillBtns">
                        <button className="add-skill" onClick={handleDeleteUser}> Yes </button>
                        <button className="cancel-skill" onClick={handleClose}>No</button>
                    </div>}
                </div>

            </Modal>
        </div>
    );
};

export default DeleteUserModal;
