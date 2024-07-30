import React, {useState} from 'react'
import { useResetPasswordMutation } from '../../../application/services/authApi';
import { checkPasswordStrength } from '../../../domain/valueObjects/utils';
import { toast } from 'react-toastify';
import CustomInput from '../AppInputs/CustomInput';
import Modal from './Modal';
import Spinner from '../Spinner/Spinner';
import '../Avator/Avatar.scss';

type Props= {
  ModalOpen: boolean;
  onClose:()=>void;
}

const ResetPasswordModal = (props:Props) => {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [currentPasswordMsg, setCurrentPasswordMsg] = useState("")
  const [newPasswordMsg, setNewPasswordMsg] = useState("")
  const [confirmPasswordMsg, setConfirmPasswordMsg] = useState("")
  const [typingTimer, setTypingTimer] = useState<NodeJS.Timeout | null>(null);
  const [loading, setLoading] = useState(false)
  const [resetPassword] = useResetPasswordMutation()

  const typingInterval: number = 1000;

  const closeModal = ()=>{
    props.onClose();
    setConfirmPassword("")
    setConfirmPasswordMsg("")
    setCurrentPassword("")
    setCurrentPasswordMsg("")
    setNewPassword("")
    setNewPasswordMsg("")
  }
  const takeCurrentPassword = (e:React.ChangeEvent<HTMLInputElement>)=>{
    setCurrentPassword(e.target.value)
    setCurrentPasswordMsg("")
    setNewPasswordMsg("")
    const passwordStrength = checkPasswordStrength(e.target.value)
    if (typingTimer) {
      clearTimeout(typingTimer);
    }
    const newTypingTimer = setTimeout(()=>{
      if(passwordStrength){
        setCurrentPasswordMsg(passwordStrength)
        }else{
          setConfirmPasswordMsg("")
        }
    }, typingInterval)
    setTypingTimer(newTypingTimer);
    
  }
  const takeNewPassword = (e:React.ChangeEvent<HTMLInputElement>)=>{
      setNewPassword(e.target.value)
    
      setNewPasswordMsg("")
      setCurrentPasswordMsg("")
  
        const passwordStrength = checkPasswordStrength(e.target.value)
        if (typingTimer) {
          clearTimeout(typingTimer);
        }
       const newTypingTimer =  setTimeout(()=>{
      
        if(passwordStrength){
          console.log(passwordStrength);
          
          setNewPasswordMsg(passwordStrength)
        }else{
          setNewPasswordMsg("")
        }
       }, typingInterval)
       setTypingTimer(newTypingTimer);

        
      
       
  }
  const takeConfirmNewPassword = (e:React.ChangeEvent<HTMLInputElement>)=>{
      setConfirmPassword(e.target.value)
      setConfirmPasswordMsg("")
      if (typingTimer) {
        clearTimeout(typingTimer);
      }
      const newTypingTimer = setTimeout(()=>{
        if(e.target.value !== newPassword){
          setConfirmPasswordMsg("New Password and confirm password do not match!")
        }
      }, typingInterval)

      setTypingTimer(newTypingTimer);
  }

  const updatePassword = ()=>{
    if(!currentPassword && !currentPasswordMsg){
      setCurrentPasswordMsg("Current password is required")
      return;
    }
    else if(!newPassword && !newPasswordMsg){
      setNewPasswordMsg("New password is required!")
    }else if(!confirmPassword && !confirmPasswordMsg){
      setConfirmPasswordMsg("Confirm password is required!")
    }else if(newPassword !== confirmPassword){
      setConfirmPasswordMsg("New Password and confirm password do not match!")
    }else if(newPassword === currentPassword){
      setNewPasswordMsg("Current password and new password can't be the same")
      setCurrentPasswordMsg("Current password and new password can't be the same")
    }else{
      const userId = localStorage.getItem("user");
      const userIdObj = userId ? JSON.parse(userId) : null;
      setConfirmPasswordMsg("")
      if(userIdObj){
        setLoading(true)
        const data = {
          userId: userIdObj.userId,
          password: confirmPassword,
          currentPassword: currentPassword,
        }
        resetPassword(data).unwrap().then(res=>{
          toast.success(`${res.message}`) 
          setLoading(false)
          closeModal()       
        }).catch((err:{status:number, data:{message:string}})=>{
            setLoading(false)
            toast.warn(err.data.message);
            setCurrentPasswordMsg(err.data.message)
        })
      }
    }
  }

  return (
    <div>
           {loading && 
      <div className="loader">
      <Spinner/>

    </div>
    }
        
          <Modal
            isOpen = {props.ModalOpen}
            onClose = {closeModal}
            Heading={"Reset Password"}
          >

            <div className="changePassword">
            <div className='changePasswordDiv'>
            <CustomInput
            type="password"
            value={currentPassword}
            name={""}
            placeholder="Enter your current password here"
            errorMessage={currentPasswordMsg}
            onChange={takeCurrentPassword}
            label="Current Password"
            required={true}
          />
            </div>
            <div className="changePasswordDiv">
            <CustomInput
            type="password"
            value={newPassword}
            name={""}
            placeholder="Enter your new password here"
            errorMessage={newPasswordMsg}
            onChange={takeNewPassword}
            label="New Password"
            required={true}
          />              
            </div>
            <div className="changePasswordDiv">
            <CustomInput
            type="password"
            value={confirmPassword}
            name={""}
            placeholder="Re-enter your new password here"
            errorMessage={confirmPasswordMsg}
            onChange={takeConfirmNewPassword}
            label="Confirm Password"
            required={true}
          />
            </div>
    
 
          <button onClick={updatePassword}>Update Password</button>
            </div>
          </Modal>
    </div>
  )
}

export default ResetPasswordModal