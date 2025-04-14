import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './Assessments.css';

const TestList = ({ title, tests, refProp, onScroll, onTestClick }) => (
  <div className="test-section">
    <div className="test-head">
      <p className="test-main">{title}</p>
      <div className="toggle">
        <i
          className="bx tog bx-chevron-left-circle"
          onClick={() => onScroll(refProp, -1)}
        ></i>
        <i
          className="bx tog bx-chevron-right-circle"
          onClick={() => onScroll(refProp, 1)}
        ></i>
      </div>
    </div>
    <div className="test-list" ref={refProp}>
      {tests.length > 0 ? (
        tests.map((test, index) => (
          <div className="test" key={index} onClick={() => onTestClick(test.test_id)}>
            <div className="test-data">
              <p className="test-data-category">{test.category}</p>
              <p className="test-data-head">{test.test_name}</p>
            </div>
            <div className="vector">
              <i className="bx bx-code-alt"></i>
            </div>
          </div>
        ))
      ) : (
        <p>No {title} available</p>
      )}
    </div>
  </div>
);

const Assessments = () => {
  const mcqListRef = useRef(null);
  const descriptiveListRef = useRef(null);
  const [mcqTests, setMcqTests] = useState([]);
  const [descriptiveTests, setDescriptiveTests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const scroll = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({ left: direction * 200, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/test/', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const tests = await response.json();
        const mcq = tests.filter((test) => test.type === 'MCQ');
        const descriptive = tests.filter((test) => test.type === 'Descriptive');

        sessionStorage.setItem('mcqTests', JSON.stringify(mcq));
        sessionStorage.setItem('descriptiveTests', JSON.stringify(descriptive));
        
        setMcqTests(mcq);
        setDescriptiveTests(descriptive);
        
      } catch (error) {
        console.error('Failed to fetch tests:', error);
      } finally {
        setLoading(false);
      }
    };
    
    const storedMcqTests = sessionStorage.getItem('mcqTests');
    const storedDescriptiveTests = sessionStorage.getItem('descriptiveTests');
    
    if (storedMcqTests && storedDescriptiveTests) {
      setMcqTests(JSON.parse(storedMcqTests));
      setDescriptiveTests(JSON.parse(storedDescriptiveTests));
      setLoading(false);
    } else {
      fetchTests();
    }
  }, []);

  const handleTestClick = (testId) => {
    const storedMcqTests = JSON.parse(sessionStorage.getItem('mcqTests'));
    const storedDescriptiveTests = JSON.parse(sessionStorage.getItem('descriptiveTests'));

    

    const allTests = [...(storedMcqTests || []), ...(storedDescriptiveTests || [])];
    const selectedTest = allTests.find((test) => test.test_id === testId);

    if (selectedTest) {
      sessionStorage.setItem('selectedTestId', selectedTest.test_id);
      navigate(`/tests/${selectedTest.test_id}`);
    } else {
      console.error('Test ID not found:', testId);
    }
  };

  const filteredMcqTests = mcqTests.filter((test) =>
    test.test_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDescriptiveTests = descriptiveTests.filter((test) =>
    test.test_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="assessments-container">
      <Sidebar />
      <div className="assessments">
        <div className="search">
          <input
            className="search-input"
            type="text"
            placeholder="Search here..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="search-icon bx bx-search"></i>
        </div>
        <div className="tests">
          {loading ? (
            <p>Loading tests...</p>
          ) : (
            <>
              <TestList
                title="MCQ's Assessments"
                tests={filteredMcqTests}
                refProp={mcqListRef}
                onScroll={scroll}
                onTestClick={handleTestClick}
              />
              <TestList
                title="Descriptive Assessments"
                tests={filteredDescriptiveTests}
                refProp={descriptiveListRef}
                onScroll={scroll}
                onTestClick={handleTestClick}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Assessments;
