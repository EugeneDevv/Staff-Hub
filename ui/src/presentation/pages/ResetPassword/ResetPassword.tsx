import { Link, useNavigate } from 'react-router-dom'
import OnboardingScaffold from '../../components/OnboardingScaffold/OnboardingScaffold'
import SubmitButton from '../../components/Buttons/SubmitButton'
import CustomInput from '../../components/AppInputs/CustomInput'
import { toast } from 'react-toastify'
import {
  ChangeEvent, FormEvent, useState
} from 'react'
import { useRequestPasswordResetMutation } from '../../../application/services/authApi'
import Spinner from '../../components/Spinner/Spinner'
import { friendlyErrorMessage } from '../../../domain/valueObjects/appStrings'
import { ApiResponse } from '../../../application/apiTypes'

const ResetPassword = () => {

  const [email, setEmail] = useState("")

  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate()

  const [requestPasswordReset, { isLoading }] = useRequestPasswordResetMutation()


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const validateForm = () => {
    let isValid = true;
    let newError = null

    // Validate email
    if (!email) {
      newError = "Email is required";
      isValid = false;
    }
    if (email && !email.toLocaleLowerCase().includes('@griffinglobaltech.com')) {

      newError = "Enter a valid Griffin email"
      isValid = false;
    }

    setError(newError);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm() && email) {
      await requestPasswordReset({ email: email.toLocaleLowerCase() }).then((res: ApiResponse) => {
        if (res?.error) {
          toast.error(res?.error?.data?.message ?? friendlyErrorMessage)
        } else {
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("email", email);
          toast.success(`An OTP has been sent to ${email}`)
          console.log(res);
          
          navigate('/verify-otp', {state:{id:res.data}})
        }

      }).catch((e: Error) => {
        toast.error(e?.message)
      })

    }
  }


  return <OnboardingScaffold>
    <div className="onboardingForm">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <CustomInput
          type="email"
          label="Enter your Griffin email "
          value={email}
          name="email"
          placeholder="Please enter your email here"
          errorMessage={error}
          onChange={handleChange} />
        {isLoading && <Spinner />}
        {!isLoading && <SubmitButton value='Continue' disabled={false} />}
      </form>
      {!isLoading && <Link className='link' to="/login" >Login instead</Link>}
    </div>
  </OnboardingScaffold>
}

export default ResetPassword