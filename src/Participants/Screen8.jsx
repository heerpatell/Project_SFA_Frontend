import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
function Screen8() {
    const { pnumber, condition } = useParams();
    const navigate = useNavigate();

    const [ans, setAns] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showPrompt, setShowPrompt] = useState(false);
    const [promptMessage, setPromptMessage] = useState('');
    const [isCorrect, setIsCorrect] = useState(false);
    const [assignedCategory, setAssignedCategory] = useState('');

    const optionChange = (e) => {
        setAns(e.target.value);
    };

    const checkAns = () => {
        const currentQ = questions[currentQuestion];
        const isAnswerCorrect = ans === currentQ.correctAnswer;
        const errorMessage = currentQ.errorMessage;

        setIsCorrect(isAnswerCorrect);
        setPromptMessage(isAnswerCorrect ? 'Correct!' : errorMessage);
        setShowPrompt(true);
    };

    const closePrompt = () => {
        setShowPrompt(false);
        if (isCorrect) {
            const nextQuestion = getNextAccessibleQuestion(currentQuestion + 1);
            if (nextQuestion < questions.length) {
                setCurrentQuestion(nextQuestion);
                setAns('');
            } else {
                // Navigate to the next screen after the last question
                navigate(`/screen9/${pnumber}/${condition}`);
            }
        }
    };

  const verifyUser = () => {
    axios
      .post(`${REACT_APP_BACKEND_URL}/generate/getlink`,{'token': localStorage.getItem('token')}, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(21, res.data);
        if (res.data.msg === "access denied") {
          navigate("/notfound");
        }
      })
      .catch((e) => {
        navigate("/notfound");
      });
  };
    
    useEffect(() => {
        verifyUser()
        axios.post(`${REACT_APP_BACKEND_URL}/generate/getassignedcategory`, { pnumber , 'token': localStorage.getItem('token')}, {
            withCredentials: true,
        })
            .then((res) => {
                setAssignedCategory(res.data.assignedCategory);
                const nextQuestion = getNextAccessibleQuestion(0);
                setCurrentQuestion(nextQuestion);
            });
    }, [pnumber]);

    const questions = [
        {
            question: 'Your pay will depend on the sum of tokens you earn over all rounds.',
            correctAnswer: 'True',
            errorMessage: 'Your selection is incorrect. Your pay is determined by the sum of tokens you earn over ALL ROUNDS.',
        },
        {
            question: 'You will interact in the same pair for 10 rounds.',
            correctAnswer: 'False',
            errorMessage: 'Your selection is incorrect. You will be paired with a DIFFERENT participant after each round.',
        },
        {
            question: 'Workers will incur higher costs for higher effort levels.',
            correctAnswer: 'True',
            errorMessage: 'The higher the effort level a Worker chooses, the HIGHER the cost of his/her effort.',
        },
        {
            question: 'Customers’ level of satisfaction with Workers’ service increases with Workers’ effort levels. ',
            correctAnswer: 'True',
            errorMessage: 'Your selection is incorrect. Customers have higher level of satisfaction with Workers’ service if Workers choose higher effort levels.',
        },
        {
            question: 'Workers’ fixed wage is higher than the standard wage paid at similar restaurants.',
            correctAnswer: condition === 'Fixed Condition'? 'True' :'False',
            errorMessage: condition === 'Fixed Condition' ?
            'Your selection is incorrect. Workers’ fixed wage is HIGHER than the standard wage paid at similar restaurants.'
            :'Your selection is incorrect. Workers earn STANDARD wage paid at similar restaurants.',
        },
        {
            question: 'Customers pay Workers additional compensation for serving them.',
            correctAnswer: condition === 'Fixed Condition' ?'False':'True',
            errorMessage: condition === 'Fixed Condition' ?
            'Your selection is incorrect. Customers will NOT pay Workers additional compensation for serving them.'
            :'Your selection is incorrect. Customers will pay Workers ADDITIONAL compensation for serving them.',
        },
        {
            question: 'Workers’ compensation will be paid by:',
            options: ['Only the Customer', 'Only the restaurant', 'Both the Customer and the restaurant'],
            correctAnswer: condition === 'Fixed Condition' ? 'Only the restaurant' : 'Both the Customer and the restaurant',
            errorMessage: condition === 'Fixed Condition' ? 'Your selection is incorrect. Workers’ compensation is paid by the RESTAURANT.': 'Your selection is incorrect. Workers’ compensation is paid by BOTH the Customer and the restaurant.'
        },
        {
            question: 'Customers can decide how much to pay the Workers for serving them.',
            correctAnswer: condition === 'Service Charge' ? 'False' : 'True',
            errorMessage: condition === 'Service Charge'
                ? 'Your selection is incorrect. Customers pay a FIXED service charge amount to Workers in each round. Customers CANNOT decide how much to pay the Workers for serving them.'
                : 'Your selection is incorrect. Customers CAN decide how much to pay the Workers for serving them.',
        },
        {
            question: 'When do Customers tip the Workers for serving them?',
            options: [
                'Before the Workers serve them',
                'After the Workers serve them',
            ],
            correctAnswer: condition === 'Pre-Tip' ? 'Before the Workers serve them' : 'After the Workers serve them',
            errorMessage: condition === 'Pre-Tip'
                ? 'Your selection is incorrect. Customers will tip the Workers BEFORE the Workers serve them.'
                : 'Your selection is incorrect. Customers will tip the Workers AFTER the Workers serve them.',
        },
        {
            question: 'In each round, Customers will be informed of:',
            options: [
                'Worker’s effort level',
                'Worker’s cost of effort level',
                'Worker’s compensation',
                'None of the above',
            ],
            correctAnswer: 'Worker’s effort level',
            errorMessage: 'Your selection is incorrect. The Customer will only learn Worker’s choice of EFFORT LEVEL to serve the Customer. They will NOT learn Worker’s cost of effort level or Worker’s compensation.',
        },
        {
            question: 'In each round, Workers will be informed of',
            options: [
                'Customers’ level of satisfaction with the service',
                'How much Customers tip the Workers',
                'Customers’ payoff'
            ],
            correctAnswer: 'How much Customers tip the Workers',
            errorMessage: 'Your selection is incorrect. Workers will RECEIVE feedback about how much the Customers TIP them in each round',
        },
    ];

    const shouldDisplayQuestion = (questionIndex) => {
        if ([1, 2, 3, 4, 10].includes(questionIndex + 1)) {
            return true;
        }
        if ([5, 6].includes(questionIndex + 1) && assignedCategory === 'Worker') {
            return true;
        }
        if ([7].includes(questionIndex + 1) && assignedCategory === 'Worker') {
            return true;
        }
        if ([8].includes(questionIndex + 1) && condition !== 'Fixed Condition') {
            return true;
        }
        if ([9].includes(questionIndex + 1) && (condition === 'Pre-Tip' || condition === 'Post-Tip')) {
            return true;
        }
        if ([11].includes(questionIndex + 1) && (condition === 'Pre-Tip' || condition === 'Post-Tip')) {
            return true;
        }
        return false;
    };

    const getNextAccessibleQuestion = (startIndex) => {
        for (let i = startIndex; i < questions.length; i++) {
            if (shouldDisplayQuestion(i)) {
                return i;
            }
        }
        return questions.length; // Return length of questions if none are accessible
    };

    return (
        <>
            <div
                style={{
                    minHeight: '100vh',
                    backgroundColor: 'aliceblue',
                    color: '#1c1c1c',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <div
                    style={{
                        width: '100rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.4rem',
                        fontSize: '2.3rem',
                    }}
                >
                    <div
                        style={{
                            color: '#1c1c1c',
                            fontSize: '3rem',
                            textAlign: 'center',
                        }}
                    >
                        <u><b>COMPREHENSION CHECK QUESTIONS</b></u>
                    </div>

                    <div style={{fontSize:'2.3rem'}}>
                        Please select the most appropriate answer to the following questions. You will not be able to continue until you have answered each question correctly.
                    </div>
                    <hr />

                    <div style={{fontSize:'2.3rem'}}>
                        {shouldDisplayQuestion(currentQuestion) && (
                            <div>
                                <div>
                                    {/* {currentQuestion + 1}.{' '} */}
                                    {questions[currentQuestion].question}
                                </div>
                                {questions[currentQuestion].options ? (
                                    questions[currentQuestion].options.map((option, index) => (
                                        <div key={index}>
                                            <input
                                                style={{ marginRight: '0.5rem' , width: '20px', height: '20px'}}
                                                type="radio"
                                                value={option}
                                                name="ans"
                                                checked={ans === option}
                                                onChange={optionChange}
                                            />{' '}
                                            <label>{option}</label>
                                        </div>
                                    ))
                                ) : (
                                    <>
                                        <div>
                                            <input
                                                style={{ marginRight: '0.5rem' , width: '20px', height: '20px'}}
                                                type="radio"
                                                value="True"
                                                name="ans"
                                                checked={ans === 'True'}
                                                onChange={optionChange}
                                            />{' '}
                                            <label>True</label>
                                        </div>
                                        <div>
                                            <input
                                                style={{ marginRight: '0.5rem' , width: '20px', height: '20px'}}
                                                type="radio"
                                                value="False"
                                                name="ans"
                                                checked={ans === 'False'}
                                                onChange={optionChange}
                                            />{' '}
                                            <label>False</label>
                                        </div>
                                    </>
                                )}
                                <div
                                    style={{
                                        cursor: ans ? 'pointer' : 'not-allowed',
                                        opacity: ans? 1:0.5,
                                        margin: 'auto',
                                        marginTop: '2rem',
                                        width: '8rem',
                                        borderRadius: '0.2rem',
                                        height: '4rem',
                                        fontSize: '2.3rem',
                                        color: 'black',
                                        backgroundColor: '#1c1c1c',
                                        color:'aliceblue',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                        
                                    }}
                                    onClick={checkAns}
                                >
                                    Next
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showPrompt && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <div
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '0.5rem',
                            textAlign: 'center',
                            padding: '3rem', // Increased padding
                            width: 'auto',  // Set a fixed width
                            maxWidth: '90vw',
                            height: '10rem', // Set a fixed height  
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',           
                        }}
                    >
                        <p style={{ fontSize: '2rem' }}>{promptMessage}</p>
                        <button onClick={closePrompt} style={{
                            color:'aliceblue',
                            backgroundColor:'black',
                            padding:'0.8rem',
                            margin:'0.5rem',
                            fontSize:'2.3rem',
                            borderRadius:'0.2rem',
                            cursor:'pointer'
                        }}>OK</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default Screen8;

