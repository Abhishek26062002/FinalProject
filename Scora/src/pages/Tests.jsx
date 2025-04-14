import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Tests.css";

const Tests = () => {
  const { testId } = useParams();
  const navigate = useNavigate();

  // State declarations
  const [questions, setQuestions] = useState([]);
  const [testType, setTestType] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState({ correct: 0, wrong: 0, unattempted: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes countdown
  const [interrupted, setInterrupted] = useState(false);
  const [showInterruptionModal, setShowInterruptionModal] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const finalResultsRef = useRef([]);

  // --- Helper Functions ---

  // Request full screen mode
  const enableFullScreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  };

  // Track if the user switches tabs or exits full screen.
  const handleInterruption = () => {
    if (!interrupted && (document.hidden || !document.fullscreenElement)) {
      setInterrupted(true);
      setShowInterruptionModal(true);
      handleSubmit(true);
    }
  };

  const trackInterruption = () => {
    document.addEventListener("visibilitychange", handleInterruption);
    document.addEventListener("fullscreenchange", handleInterruption);
  };

  // Clear the selected answer for the current question
  const clearSelectedOptions = () => {
    const currentQuestion = questions[currentQuestionIndex];
    setAnswers((prev) => ({ ...prev, [currentQuestion.question_id]: "" }));
  };

  // Update the answer for a given question
  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  // Evaluate the answer for the current question and update score and results
  const evaluateCurrentAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const studentAnswer = answers[currentQuestion.question_id];
    const correctAnswer = currentQuestion.correct_answer; // Assumes a property "correct_answer"
    let newScore = { ...score };

    if (!studentAnswer || studentAnswer === "") {
      newScore.unattempted += 1;
    } else if (studentAnswer === correctAnswer) {
      newScore.correct += 1;
    } else {
      newScore.wrong += 1;
    }
    setScore(newScore);

    // Save the result for this question
    finalResultsRef.current.push({
      Q_id: currentQuestion.question_id,
      Student_answer: studentAnswer || "",
      Correct_answer: correctAnswer,
    });
  };

  // Move to the next question
  const handleNextQuestion = () => {
    evaluateCurrentAnswer();
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  // Handle submission of the quiz (normal or on interruption)
  const handleSubmit = (isInterruption = false) => {
    // Remove event listeners so further interruptions are ignored
    document.removeEventListener("visibilitychange", handleInterruption);
    document.removeEventListener("fullscreenchange", handleInterruption);
    evaluateCurrentAnswer();
    setQuizCompleted(true);
    submitResults(isInterruption);
  };

  // Submit the quiz results to the backend
  const submitResults = async (isInterruption = false) => {
    const studentId = localStorage.getItem("student_id");
    if (!studentId) {
      console.error("Student ID not found.");
      navigate("/analytics");
      return;
    }

    const resultPayload = {
      student_id: parseInt(studentId),
      test_id: parseInt(testId),
      Q_id: finalResultsRef.current.map((r) => r.Q_id),
      Student_answer: finalResultsRef.current.map((r) => r.Student_answer),
      correct_answer: finalResultsRef.current.map((r) => r.Correct_answer),
      score: score.correct,
      correct_count: score.correct,
      incorrect_count: score.wrong,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/mcq_results/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resultPayload),
      });
      if (!response.ok) throw new Error("Failed to submit results.");
      console.log("Results submitted:", await response.json());
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      if (!isInterruption) {
        console.log("Quiz completed. Please check your score.");
      }
    }
  };

  // --- Fetch Questions and Setup ---
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/test/${testId}`);
        if (!response.ok) throw new Error("Failed to fetch questions.");
        const data = await response.json();
        if (Array.isArray(data[0])) {
          setQuestions(data[0]);
          setTestType(data[1]);
        } else {
          throw new Error("Unexpected response format.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
    enableFullScreen();
    trackInterruption();

    // Cleanup event listeners on unmount
    return () => {
      document.removeEventListener("visibilitychange", handleInterruption);
      document.removeEventListener("fullscreenchange", handleInterruption);
    };
  }, [testId]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // --- Rendering Logic ---
  if (loading)
    return <div className="loading">Loading questions...</div>;
  if (error)
    return (
      <div className="error">
        Error: {error}{" "}
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );

  // Render modal when an interruption occurs
  if (showInterruptionModal) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <h2>Error: Test Interrupted</h2>
          <p>
            You have left the test screen. Your test has been automatically
            terminated.
          </p>
          <button onClick={() => navigate("/analytics")}>
            Go to Analytics
          </button>
        </div>
      </div>
    );
  }

  // When quiz is complete, show the score card
  if (quizCompleted) {
    return (
      <div className="quiz-container">
        <div className="card">
          <h1>Quiz Completed</h1>
          <div className="score">
            <h2>Score</h2>
            <p className="green">Correct: {score.correct}</p>
            <p className="red">Wrong: {score.wrong}</p>
            <p className="blue">Unattempted: {score.unattempted}</p>
          </div>
          <br />
          <button className="test-btn" onClick={() => navigate("/analytics")}>
            Go to Analytics
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="tests-container">
      <div className="test-navbar">
        <h1 className="heading">Smart Test</h1>
        <br />
        <br />
      </div>
      <div className="time">
        <div className="timer">Time Left: {formatTime(timeLeft)}</div>
      </div>
      <hr />
      <div className="q-box">
        <h3 className="question">
          Question {currentQuestionIndex + 1} of {questions.length}
        </h3>
        <h2>{currentQuestion.question}</h2>

        {testType === "Descriptive" ? (
          <textarea
            className="text-area"
            rows="5"
            placeholder="Enter your answer here..."
            value={answers[currentQuestion.question_id] || ""}
            onChange={(e) =>
              handleAnswerChange(currentQuestion.question_id, e.target.value)
            }
          />
        ) : (
          currentQuestion.options.map((option) => (
            <div className="options" key={option}>
              <input
                type="radio"
                id={`${currentQuestion.question_id}_${option}`}
                name={currentQuestion.question_id}
                value={option}
                checked={answers[currentQuestion.question_id] === option}
                onChange={() =>
                  handleAnswerChange(currentQuestion.question_id, option)
                }
              />
              <label htmlFor={`${currentQuestion.question_id}_${option}`}>
                {option}
              </label>
            </div>
          ))
        )}

        <div className="button-group">
          <button className="test-btn" onClick={clearSelectedOptions}>
            Clear Answer
          </button>
          <button
            className="test-btn"
            onClick={() => {
              if (currentQuestionIndex === questions.length - 1) {
                handleSubmit();
              } else {
                handleNextQuestion();
              }
            }}
          >
            {currentQuestionIndex === questions.length - 1
              ? "Finish Quiz"
              : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tests;
