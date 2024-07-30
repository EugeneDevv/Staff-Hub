import { Link, useNavigate, useLocation } from 'react-router-dom'
import CustomInput from '../../components/AppInputs/CustomInput'
import OnboardingScaffold from '../../components/OnboardingScaffold/OnboardingScaffold'
import SubmitButton from '../../components/Buttons/SubmitButton'
import { ChangeEvent, FormEvent, useEffect, useState, useCallback } from 'react'
import {  useLazyFetchSecurityQuestionsQuery,  useAnswerSecurityQuestionMutation } from '../../../application/services/authApi'
import { toast } from 'react-toastify'
import Spinner from '../../components/Spinner/Spinner'
import './VerifyOpt.scss'

const VerifyOtpPage = () => {
  interface Questions  {
    answer: string | null;
    questionId: number,
    question:string

  }
  const [otp, setOtp] = useState("")
  const location = useLocation()
 
  
  const [error, setError] = useState<string | null>(null);
  const email: string = localStorage.getItem("email") ?? ""
  const navigate = useNavigate()

  const [fetchSecurityQuestion, {isLoading}] = useLazyFetchSecurityQuestionsQuery()
  const [questions, setQuestions] =useState<Questions[]>([])
  const [selectedQuestion, setSelectedQuestions] = useState<Questions>()
  const [showPopUp, setPopupVisible] = useState<boolean>(false)
  const [answer, setAnswer] = useState<string>("")
  const[answerSecurityQuestions] = useAnswerSecurityQuestionMutation()
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value)
  }

  const validateForm = () => {
    let isValid = true;
    let newError = null

    // Validate email
    if (!otp || otp.trim().length === 0) {
      newError = "OTP is required";
      isValid = false;
    }

    setError(newError);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(otp.length !== 6){
      toast.warn("Invalid verification code")
      return ;
    }
    if (validateForm() && otp) {
      console.log(1);
      
      const data = {
        userId: location.state.id.data,
        securityQuestionId: selectedQuestion?.questionId,
        answer: answer,
        otp:otp,
        email:email
      }
      console.log(data);
      
      if(answer){
        answerSecurityQuestions(data).unwrap().then(res=>{
          navigate('/new-password')
          toast.success(res.message)
          console.log(res);
          
        }).catch((err:{message:string})=>{
          toast.warn(err.message)
          console.log(err);
          
        })  
      }else{
        toast.error("answer question to proceed")
      }

    }
  }
  const fetchQuestions = useCallback(() => {
    fetchSecurityQuestion(location.state.id.data).unwrap().then(res => {
      console.log(res);
      const filteredQuestions = res.data.filter((q:Questions) => q.answer !== null);
      setQuestions(filteredQuestions);
      console.log(filteredQuestions[0]);
      console.log(filteredQuestions);
      setSelectedQuestions(filteredQuestions[0]);
    }).catch(err => {
      toast.error(err.message)
    });
  }, [fetchSecurityQuestion, location.state.id.data, setQuestions, setSelectedQuestions]);

  const ShowPopUp = ()=>{
    setPopupVisible(!showPopUp)
  }
  const setQuestion = (q:Questions)=>{
    setSelectedQuestions(q)
    setPopupVisible(false)
  }
  const handleTakeAns = (e: React.ChangeEvent<HTMLInputElement>)=>{
  
        setAnswer(e.target.value)
    
  }
  useEffect(()=>{
    fetchQuestions()
  },[fetchQuestions])
  return <OnboardingScaffold>
    <div className="onboardingForm">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
      <div className='mainResetPassword'>
      <CustomInput
          type="text"
          label="Enter the verification code in your email"
          value={otp}
          name="text"
          placeholder="Please enter the verification code here"
          errorMessage={error}
          onChange={handleChange} />
           <div className="ansSecurityQuestion">
           <p className='securityQuestion'>Security Question</p>
           <p className='clickArrow'>Click arrow to change security question</p>
            <div className="selQuestion">
              <p>{selectedQuestion?.question}</p>
              <p className='dropDownIcon' onClick={ShowPopUp}></p>
              {showPopUp &&
              
              <div className="questionsContainer">
                {questions && questions.map(q=>{
                  return(
                    <div>
                      <p onClick={()=>setQuestion(q)}>{q.question}</p>
                    </div>
                  )
                })}
              </div>
              
              }
            </div>
            <CustomInput
          type="text"
          label=""
          value={answer}
          name="text"
          placeholder="Please enter your answer here"
          errorMessage={""}
          onChange={handleTakeAns} />
           </div>
        {isLoading && <Spinner />}
        {!isLoading && <SubmitButton value='Next' disabled={false} />}
     
      </div>
      </form>
     
      {!isLoading && <Link className='link' to="/login" >Login instead</Link>}
    </div>
  </OnboardingScaffold>
}


export default VerifyOtpPage