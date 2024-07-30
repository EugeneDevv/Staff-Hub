import { Link, useNavigate } from 'react-router-dom'
import OnboardingScaffold from '../../components/OnboardingScaffold/OnboardingScaffold'
import SubmitButton from '../../components/Buttons/SubmitButton'
import CustomInput from '../../components/AppInputs/CustomInput'
import { toast } from 'react-toastify'
import {
  ChangeEvent, FormEvent, useState
} from 'react'
import { useSetNewPasswordMutation } from '../../../application/services/authApi'
import Spinner from '../../components/Spinner/Spinner'
import { confirmPasswordRequiredString, friendlyErrorMessage, passwordsDoNotMatchString } from '../../../domain/valueObjects/appStrings'
import { checkPasswordStrength } from '../../../domain/valueObjects/utils'
import { ApiResponse } from '../../../application/apiTypes'
import { User } from '../../../domain/models/user.model'

const initialState = {
  password: "",
  confirmPassword: ""
};

const SetNewPasswordPage = () => {
  const [formValue, setFormValue] = useState(initialState)

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [passError, setPassError] = useState<string | null>(null);

  const navigate = useNavigate()

  const { password, confirmPassword } = formValue

  const [setNewPassword, { isLoading }] = useSetNewPasswordMutation()


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value, })
    if (e.target.name === "password") {



      setPassError(checkPasswordStrength(e.target.value))

    }
  }


  const validateForm = () => {
    let isValid = true;
    const newErrors: { [key: string]: string } = {};

    const newPasswordError = checkPasswordStrength(password);
    setPassError(newPasswordError)

    if (newPasswordError) {
      isValid = false;
    }




    if (!confirmPassword) {
      newErrors.confirmPassword = confirmPasswordRequiredString;
      isValid = false;
    }

    // Validate password
    if (isValid && formValue.password !== confirmPassword) {
      newErrors.confirmPassword = passwordsDoNotMatchString;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm() && password && confirmPassword) {
      await setNewPassword({ password: formValue.password }).then((res: ApiResponse) => {
        if (res?.error) {
          toast.error(res?.error?.data?.message ?? friendlyErrorMessage)
        } else {
          toast.success(`New password has been set successfully`)
          let user: User | null = null

          try {
            user = JSON.parse(localStorage.getItem("user") ?? "{}");

          } catch (e) {
            console.log(e)
          }

          if (!(user?.securityQuestion ?? true)) {
            navigate('/security-question')
          } else {
            navigate('/login')
          }
          localStorage.setItem("email", "");
        }
      }).catch((e: Error) => {
        toast.error(e?.message)
      })

    }
  }


  return <OnboardingScaffold>
    <div className="onboardingForm">
      <h2>Set New Password</h2>
      <form onSubmit={handleSubmit}>

        <CustomInput
          type="password"
          label="New Password"
          value={password}
          name="password"
          placeholder="Enter your new password here"
          errorMessage={passError}
          onChange={handleChange} />

        <CustomInput
          type="password"
          label="Confirm Password"
          value={confirmPassword}
          name="confirmPassword"
          placeholder="Confirm your password here"
          errorMessage={errors.confirmPassword}
          onChange={handleChange} />
        {isLoading && <Spinner />}
        {!isLoading && <SubmitButton value='Continue' disabled={false} />}
      </form>
      {!isLoading && <Link className='link' to="/login" >Login instead</Link>}
    </div>
  </OnboardingScaffold>
}

export default SetNewPasswordPage