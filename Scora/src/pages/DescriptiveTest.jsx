



import { useParams } from 'react-router-dom';
import './Tests.css'; // Reuse the same CSS for consistent styling

const DescriptiveTest = () => {
  const { testId } = useParams(); // Fetching testId from URL params
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/test/${testId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Expected JSON response but got something else.');
        }

        const data = await response.json();
        console.log('Fetched data:', data);

        if (Array.isArray(data)) {
          setQuestions(data.filter((q) => q.test_type === 'Descriptive')); // Filter only Descriptive questions
        } else {
          throw new Error('Fetched data is not an array.');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [testId]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timerId);
    } else {
      handleFinishQuiz(); // Automatically finish quiz when timer reaches zero
    }
  }, [timeLeft]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const clearSelectedOptions = () => {
    const currentQuestion = questions[currentQuestionIndex];
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestion.question_id]: undefined,
    }));
  };

  const handleSubmit = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handleFinishQuiz = () => {
    setCurrentQuestionIndex(questions.length); // Ends the quiz
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) {
    return <div className="loading">Loading questions...</div>;
  }

  if (error) {
    return (
      <div className="error">
        Error: {error}
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (currentQuestionIndex >= questions.length) {
    return (
      <div className="quiz-container">
        <div className='card'>
          <h1>Quiz Completed</h1>
          <br />
          <div className='card-btns'>
            <a href="/assessments">
              <button className='test-btn'>Home</button>
            </a>
            <a href="/analytics">
              <button className='test-btn'>Analytics</button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className='tests-container'>
      <div className="test-navbar">
        <img className="test-navbar-image" src="\src\assets\scorawhite.svg" alt="Logo" />
      </div>
      <div className='time'><div className="timer">Time Left: {formatTime(timeLeft)}</div></div>
      <hr />
      
      <div className='q-box'>
        <h3 className='question'>
          Question {currentQuestionIndex + 1} of {questions.length}
        </h3>
        <h2>{currentQuestion.question}</h2>
        
        {/* Textarea for descriptive answer input */}
        <textarea
          className='text-area'
          rows="5"
          placeholder="Enter your answer here..."
          value={answers[currentQuestion.question_id] || ""}
          onChange={(e) => handleAnswerChange(currentQuestion.question_id, e.target.value)}
        />

        <div className="button-group">
          <button className='test-btn' onClick={clearSelectedOptions}>Clear Answer</button>
          <button className='test-btn' onClick={handleSubmit}>
            {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DescriptiveTest;
