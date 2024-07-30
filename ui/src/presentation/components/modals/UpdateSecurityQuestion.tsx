import React, { useEffect, useState, useCallback } from 'react'
import Modal from './Modal';
import { 
    useLazyGetSecurityQuestionAndAnswersQuery,
    useUpdateSecurityQuestionMutation
} from '../../../application/services/authApi';
import { toast } from 'react-toastify';
import CustomInput from '../AppInputs/CustomInput';

type Props= {
    isModalOpen : boolean;
    onClose : ()=>void
}

export const UpdateSecurityQuestion = (props:Props) => {
    interface QuestionAndAnswers {
        questionId: number,
        question:string,
        answer:string;
    
    }
    const [fetchQuestionsAndAnswers] = useLazyGetSecurityQuestionAndAnswersQuery({});
    const [questionAndAnswers, setQuestionAndAnswers] =  useState<QuestionAndAnswers[]>([])
    const [showInput, setShowInput] = useState<number>(0)
    const [answer, setAnswer] = useState<string>("")
    const [count, setCount] = useState<number>(3)
    const [loading, setLoading] = useState<boolean>(false)
    const [message, setMessage] = useState<string>("")
    const [updateSecurityQuestion]= useUpdateSecurityQuestionMutation()
    const fetchQuestions = useCallback(async () => {
     
        setLoading(true)
          const res = await fetchQuestionsAndAnswers({});
          console.log(res.data);
          console.log(res);
        
          if(res.error){
            toast.warn("An error occurred trying to load questions")
            setLoading(false)
            setMessage("No answered questions found")
          }
          if(res.data.data.length > 0){
            setMessage("")
            setLoading(false)
          }else{
            setMessage("No answered questions found")
            setLoading(false)
          }
          setQuestionAndAnswers(res.data.data);
    
      }, [setQuestionAndAnswers,fetchQuestionsAndAnswers]);
    
    const closeModal = ()=>{
     props.onClose();   
    }
    const ShowInput = (questionId:number)=>{
        
        if(showInput > 0){
            setShowInput(0)
           setAnswer("")
        }else{
         
        
            setShowInput(questionId)
        }
    }
    const takeAnswer = (Answer: React.ChangeEvent<HTMLInputElement>, questionId: number) => {
        const newAnswer = Answer.target.value.trimStart();
        setAnswer(newAnswer);
       
      
        const updatedQuestions: QuestionAndAnswers[] = questionAndAnswers.map((qa: QuestionAndAnswers) => {
          if (qa.questionId === questionId) {
            return { ...qa, answer: newAnswer };
          }
          return qa;
        });
       
        setQuestionAndAnswers(updatedQuestions);
      
      
        if (!newAnswer) {
         
          let Count = count
          Count-=1
          setCount(Count)
        }
      };
      
    const delAns = (event: React.ChangeEvent<HTMLInputElement>,questionId: number) => {
        if(showInput > 0){
            setShowInput(0)
            setAnswer("")
            const updatedQuestions:QuestionAndAnswers[] = questionAndAnswers.map((qa:QuestionAndAnswers)=>{
                if(qa.answer === "Add your answer"){
                    let Count = count
                    Count-=1

                    
                    setCount(Count)
                    return{...qa, answer: ""}
             
                }
                return qa;
            })
            setQuestionAndAnswers(updatedQuestions)
            return;
        }

        
        if(!event.target.checked){
           

            const updatedQuestions:QuestionAndAnswers[] = questionAndAnswers.map((qa:QuestionAndAnswers)=>{
                if(qa.questionId === questionId){
                    return{...qa, answer: ""}
                }
                return qa;
            })
            setQuestionAndAnswers(updatedQuestions)
            setShowInput(0)
            setAnswer("")
            let Count = count
                Count-=1
;
                
                setCount(Count)
           return;
        }
        if(count >= 3){
            toast.warn("Deselect a question to continue")
            return;
        }
       
        setShowInput(questionId)
        if(showInput === 0){
            let Count = count
            Count+=1
            setCount(Count)
            setShowInput(questionId)
            const updatedQuestions:QuestionAndAnswers[] = questionAndAnswers.map((qa:QuestionAndAnswers)=>{
                if(qa.questionId === questionId){
                    return{...qa, answer: "Add your answer"}
                }
                return qa;
            })
            setQuestionAndAnswers(updatedQuestions)
            return;
        }


      };
      const UpdateSecurityQuestions = () => {

        const unansweredQuestions = questionAndAnswers.filter((qa) => qa.answer === "Add your answer");
        if (unansweredQuestions.length !== 0) {
          toast.warn("All questions must have answers");
          return;
        }

        const answeredQuestions = questionAndAnswers.filter((qa) => qa.answer !== "" && qa.answer !== null);
        if (answeredQuestions.length !== 3) {
          toast.warn("Please answer exactly three questions");
          return;
        }
      
  
        const user = JSON.parse(localStorage.getItem("user") ?? "");
        const updatedData = answeredQuestions.map(({ questionId, ...rest }) => ({
          ...rest,
          securityQuestionId: questionId,
          userId: user.userId,
        }));
      

        updateSecurityQuestion(updatedData)
          .unwrap()
          .then((res) => {
            toast.success(res.message);
            closeModal();
          })
          .catch((err) => {
            toast.warn(err.error);
          });
      };
      
    useEffect(()=>{
    
        fetchQuestions()

    }, [fetchQuestions])
  return (
    <div>
        <Modal isOpen={props.isModalOpen}
            onClose={closeModal}
            Heading='Update Security Question'
        >
          <div className='UpdateSecurityQuestion'>
            <p className='selectSecurityQuestion'>Please select 3 of your preferred security question</p>
            {questionAndAnswers.length > 0 && questionAndAnswers.map((qa:QuestionAndAnswers)=>(
                <div className='mainQuestionDis'>
                          <div className='disQuestionAndAns'>
                   <div className='disCheckAndQuestion'>
                
                      <input type="checkbox" onChange={(e)=>delAns(e,qa.questionId)} checked = {qa.answer  ? true: false} />
             
                    <p>{qa.question}</p>
                   </div>
                   {qa.answer && qa.answer !== "Add your answer" && (
                    <div className='hideResponse'>
                        <p onClick={() => ShowInput(qa.questionId)}>
                        {qa.questionId === showInput ? 'Hide' : 'View'} Response
                        </p>
                        <p
                        className={qa.questionId === showInput ? 'downwardArrow' : 'upwardArrow'}
                        onClick={() => ShowInput(qa.questionId)}
                        ></p>
                    </div>
)}

                     
                </div>
                {showInput > 0 && showInput === qa.questionId && (
                  <div className='inputAns'>
                      <CustomInput
                    type="text"
                    value={answer}
                    name={""}
                    placeholder={qa.answer ? qa.answer : ""}
                    errorMessage=""
                    onChange={(e)=>takeAnswer(e,qa.questionId)}
                    label=""
                    required={true}
                  />
                  </div>
                )}
                </div>
            ))}
            {message.length > 0 &&
            <p>{message}</p>
            }
            {loading ? (
              <button className="adding">Loading....</button>
            ):(
              <>
                {message.length  > 0 ? (
              <button onClick={closeModal} className='updateSecurityQuestion'>Close</button>
            ):(
              <button onClick={UpdateSecurityQuestions} className='updateSecurityQuestion'>Update</button>
            )}
              </>

            )}
          </div>
        </Modal>
    </div>
  )
}