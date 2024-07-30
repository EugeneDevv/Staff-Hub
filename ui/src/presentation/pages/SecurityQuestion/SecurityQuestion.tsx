import {  useState } from "react";
import CustomInput from "../../components/AppInputs/CustomInput";
import OnboardingScaffold from "../../components/OnboardingScaffold/OnboardingScaffold";
import { useNavigate } from "react-router-dom";
import {
  useSetSecurityQuestionsMutation,
  useGetSecurityQuestionQuery,
} from "../../../application/services/authApi";
import { toast } from 'react-toastify'
import "./SecurityQuestion.scss";
import Spinner from "../../components/Spinner/Spinner";
import { User } from "../../../domain/models/user.model";
function SecurityQuestion() {
  let user: User | null = null

  try {
    user = JSON.parse(localStorage.getItem("user") ?? "{}");

  } catch (e) {
    console.log(e)
  }

  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);

  const [setSecurityQuestions, { isLoading }] =
    useSetSecurityQuestionsMutation();
  const navigate = useNavigate()
  const {
    data: question,
    isLoading: fetchingQuestions
  } = useGetSecurityQuestionQuery({});

  const toggleQuestion = (id: number) => {
    if (selectedQuestions.includes(id)) {
      setSelectedQuestions(
        selectedQuestions.filter((questionId) => questionId !== id)
      );

    delete answers[id];
    const restAnswers = answers;
      setAnswers(restAnswers);
    } else if (selectedQuestions.length < 3) {
      setSelectedQuestions([...selectedQuestions, id]);
    } else if (selectedQuestions.length === 3) {
      toast.warn(
        "You can only answer three questions, Unselect to change"
      );
    }
  };

  const takeAnswer = (questionId: number, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleAddAnswers = () => {
    const securityAnswers = Object.entries(answers).map(
      ([questionId, answer]) => ({
        UserId: user?.userId ?? "",
        SecurityQuestionId: parseInt(questionId),
        Answer: answer,
      })
    );

    let hasEmptyAns = false;
    securityAnswers.forEach((e) => {
      if (e.Answer === "") {
        hasEmptyAns = true;
      }
    });
    if (securityAnswers.length < 3) {
      toast.error("Please answer three questions");
    } else if (hasEmptyAns) {
      toast.error("Please answer all selected questions");
    } else {
      setSecurityQuestions(securityAnswers)
        .unwrap()
        .then((res) => {
          toast.success(res.message);
          navigate("/login")
        })
        .catch((err) => {
          toast.error(err.message);
        });
    }
  };
  interface SecurityQuestions {
    questionId: number;
    questionName: string;
  }

  return (
    <div>
      {fetchingQuestions ? (
        <div className="disSpinner">
          <Spinner />
        </div>
      ) : (
        <OnboardingScaffold>
          <div className="SecurityQuestions">
            <div className="securityQuestions">
              <div>
                <h2>Set Security Question</h2>
                <h5 className="answer-three">
                  Please select 3 of your preferred security question
                </h5>
              </div>
              <div className="questions">
                {question &&
                  question.map((question: SecurityQuestions) => (
                    <div key={question.questionId} className="questionDisplay">
                      <div className="checkboxandQuestion">
                        <input
                          type="checkbox"
                          id={`question-${question.questionId}`}
                          checked={selectedQuestions.includes(
                            question.questionId
                          )}
                          onChange={() => toggleQuestion(question.questionId)}
                        />
                        <label htmlFor={`question-${question.questionId}`}>
                          {question.questionName}
                        </label>
                      </div>
                      {selectedQuestions.includes(question.questionId) && (
                        <div className="customInp">
                          <CustomInput
                            type="email"
                            value={answers[question.questionId] || ""}
                            name={`answer-${question.questionId}`}
                            placeholder="Please enter your answer here"
                            errorMessage=""
                            onChange={(e) =>
                              takeAnswer(question.questionId, e.target.value)
                            }
                            label=""
                          />
                        </div>
                      )}
                    </div>
                  ))}
                {!isLoading ? (
                  <button
                    onClick={handleAddAnswers}
                    className="submitQuestions"
                  >
                    Continue
                  </button>
                ) : (
                  <Spinner />
                )}
              </div>
            </div>
          </div>
        </OnboardingScaffold>
      )}
    </div>
  );
}

export default SecurityQuestion;
