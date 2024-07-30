import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react'
import CustomInput from '../../components/AppInputs/CustomInput'
import OnboardingScaffold from '../../components/OnboardingScaffold/OnboardingScaffold'
import { Link, useNavigate } from 'react-router-dom'
import SubmitButton from '../../components/Buttons/SubmitButton'
import { useLoginUserMutation, useLazySingleUserQuery } from '../../../application/services/authApi'
import Spinner from '../../components/Spinner/Spinner'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { setAccessToken, setUser, setUserProfile } from '../../../application/slices/authSlice'
import { User } from '../../../domain/models/user.model'
import { ApiResponse } from '../../../application/apiTypes'

const initialState = {
  email: "",
  password: "",
};

const LoginPage = () => {
  const [formValue, setFormValue] = useState(initialState);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { email, password } = formValue;
  const [loginUser, { data, isSuccess, isLoading }] =
    useLoginUserMutation();

  const [userById] = useLazySingleUserQuery();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors: { [key: string]: string } = {};

    // Validate email
    if (!formValue.email) {
      newErrors.email = "Email is required";
      isValid = false;
    }
    if (
      formValue.email &&
      !formValue.email.toLowerCase().includes("@griffinglobaltech.com")
    ) {
      newErrors.email = "Enter a valid email";
      isValid = false;
    }

    // Validate password
    if (!formValue.password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm() && email && password) {
      await loginUser({ email, password }).then((res: ApiResponse) => {
        if (res?.error) {
          console.log(res)
          toast.error(res?.error?.data?.message ?? "Invalid credentials! Please check and try again")
        }
      }).catch((e: Error) => {
        toast.error(e?.message)
      });
    }
  };

  const fetchUserProfile = useCallback(async (userId: string) => {

    await userById({ userId: userId }).then((res: ApiResponse) => {
      if (res?.error) {
        console.log(res)
      } else {
        console.log("res?.data", res?.data.data)
        dispatch(setUserProfile(res?.data.data));
      }
    }).catch((e: Error) => {
      toast.error(e?.message)
    });

    toast.success("Login Successful")
    navigate('/home')



  }, [userById, dispatch, navigate]);

  useEffect(() => {
    if (isSuccess) {
      const user: User = data?.data;
      dispatch(setUser(user));
      dispatch(setAccessToken(data?.message));

      if (user.accountStatus === "new") {
        toast.success("Login Successful, you can now set up a new password")
        navigate('/new-password')
      }
      else if (user.profileStatus === "pending") {
        toast.success("Login Successful, complete your profile to proceed")
        navigate('/complete-profile')
      }
      else {
        fetchUserProfile(user.userId)
      }
    }

  }, [isSuccess, fetchUserProfile, navigate, dispatch, data]);

  return (
    <OnboardingScaffold>
      <div className="onboardingForm">
        <h2>Login to G.E.R</h2>
        <form onSubmit={handleSubmit}>
          <CustomInput
            type="email"
            label="Email address"
            value={email}
            name="email"
            placeholder="E.g test@griffinglobaltech.com"
            errorMessage={errors.email}
            onChange={handleChange}
          />
          <CustomInput
            type="password"
            label="Password"
            value={password}
            name="password"
            placeholder="Please enter your password here"
            errorMessage={errors.password}
            onChange={handleChange}
          />

          {isLoading && <Spinner />}

          {!isLoading && <SubmitButton value="Login" disabled={false} />}
        </form>
        {!isLoading && (
          <Link className="link" to="/reset-password">
            Forgot Password
          </Link>
        )}
      </div>
    </OnboardingScaffold>
  );
};

export default LoginPage;
