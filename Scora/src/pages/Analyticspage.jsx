import React, { useEffect, useState } from 'react';
import './Analyticspage.css';
import Sidebar from '../components/Sidebar';
import FullGraph from '../components/Fullgraph';
import PieChart from '../components/piechart';

const Analyticspage = () => {
  // State to hold MCQ result data
  const [mcqResult, setMcqResult] = useState(null);

  useEffect(() => {
    // Fetch the last MCQ result
    fetch('http://localhost:8000/mcq/last_result/')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched MCQ result:', data);
        setMcqResult(data);
      })
      .catch(error => console.error('Error fetching MCQ result:', error));
  }, []);

  return (
    <div className="analyticpage-container">
      <Sidebar />
      <div className="analyticpage">
        <div className="graphs">
          <div className="button-container c">
            <div className="button-c">
              <span>
                Correct <br /> Answers
              </span>
              <div className="badge">
                <div className="in-badge-c">
                  {mcqResult ? mcqResult.correct_count : 0}
                </div>
              </div>
            </div>
          </div>
          <div className="button-container w">
            <div className="button">
              <span>
                Wrong <br /> Answers
              </span>
              <div className="badge">
                <div className="in-badge">
                  {mcqResult ? mcqResult.incorrect_count : 0}
                </div>
              </div>
            </div>
          </div>
          <div className="button-container ut">
            <div className="button-ut">
              <span>
                Score <br /> Achieved
              </span>
              <div className="badge">
                <div className="in-badge-ut">
                  {mcqResult ? mcqResult.score : 0}
                </div>
              </div>
            </div>
          </div>
        </div>

        <br />
        <div className="second">
          <div className="fgraph">
            <FullGraph data={mcqResult} />
          </div>
          <br />
            <div className="pie-chart">
              <PieChart data={mcqResult} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default Analyticspage;
