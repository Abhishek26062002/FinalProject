import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import './Add.css';

const Popup = ({ message, onClose, onViewQuestions }) => (
  <div className="popup-overlay">
    <div className="popup-content">
      <p>{message}</p>
      <div className="popup-buttons">
        <button onClick={onClose} className="popup-close-button">Close</button>
        <button onClick={onViewQuestions} className="popup-view-button">View Questions</button>
      </div>
    </div>
  </div>
);

const QuestionsPopup = ({ questions, onDone }) => (
  <div className="popup-overlay">
    <div className="popup-content">
      <h3>Questions</h3>
      <ul>
        {questions.map((question, index) => (
          <li key={index}>{question}</li>
        ))}
      </ul>
      <button onClick={onDone} className="popup-done-button">Done</button>
    </div>
  </div>
);

const AddAssessments = () => {
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showQuestionsPopup, setShowQuestionsPopup] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    number_of_questions: '10',
    category: 'Theory',
    type: 'MCQ',
    file: null,
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      // Log file info for debugging
      console.log('File selected:', files[0]);
      setFormData((prev) => ({
        ...prev,
        file: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Debug: Check file before submitting
    console.log('Submitting file:', formData.file);
    if (!formData.file) {
      alert('Please select a file before submitting.');
      return;
    }

    setLoading(true);

    // Build query parameters
    const queryParams = new URLSearchParams({
      test_name: formData.name,
      type: formData.type,
      category: formData.category,
      number_of_questions: formData.number_of_questions,
    });

    // Prepare FormData for file upload
    const data = new FormData();
    data.append('file', formData.file);

    try {
      const response = await fetch(
        `http://localhost:8000/generate-questions/?${queryParams.toString()}`,
        {
          method: 'POST',
          body: data,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      // Expecting the backend to return a "questions" field
      setQuestions(result.questions || []);
      setShowPopup(true);
    } catch (error) {
      console.error('Error generating questions:', error);
      alert('Error generating questions');
    } finally {
      setLoading(false);
    }
  };

  const handleViewQuestions = () => {
    setShowPopup(false);
    setShowQuestionsPopup(true);
  };

  return (
    <div className="add-container">
      <AdminSidebar />
      <div className="add">
        <br />
        <p className="add-paragraph">
          Generate and add tests in just two clicks, using AI for easy and quick automation.
        </p>
        <div className="form-section">
          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>

            {/* Number of Questions */}
            <div className="form-group">
              <label htmlFor="number_of_questions">Number of questions</label>
              <select
                id="number_of_questions"
                name="number_of_questions"
                value={formData.number_of_questions}
                onChange={handleInputChange}
                className="form-control"
                required
              >
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="50">50</option>
              </select>
            </div>

            {/* Category */}
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-control"
                required
              >
                <option value="Theory">Theory</option>
                <option value="Coding">Coding</option>
              </select>
            </div>

            {/* Type */}
            <div className="form-group">
              <label htmlFor="type">Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="form-control"
                required
              >
                <option value="MCQ">MCQ</option>
                <option value="Descriptive">Descriptive</option>
              </select>
            </div>

            {/* File Upload */}
            <label className="form__container" id="upload-container">
              Choose or Drag &amp; Drop File
              <input
                name="file"
                className="form__file"
                id="upload-files"
                type="file"
                onChange={handleInputChange}
                required
              />
            </label>
            <div id="files-list-container"></div>

            <div className="form-button">
              <button type="submit" className="generate-button" disabled={loading}>
                {loading ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </form>
        </div>
      </div>
      {showPopup && (
        <Popup
          message="Assessment generated successfully!"
          onClose={() => setShowPopup(false)}
          onViewQuestions={handleViewQuestions}
        />
      )}
      {showQuestionsPopup && (
        <QuestionsPopup
          questions={questions}
          onDone={() => setShowQuestionsPopup(false)}
        />
      )}
    </div>
  );
};

export default AddAssessments;
