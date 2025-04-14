import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
 // Adjust path to wherever your Sidebar component is located
import './courses.scss';
import Sidebar from '../components/Sidebar';

// This interface defines the shape of each recommended item
interface RecommendedItem {
  name: string;
  link: string;
}

const Courses: React.FC = () => {
  const [inputCourses, setInputCourses] = useState('');
  const [suggestedCourses, setSuggestedCourses] = useState<RecommendedItem[]>([]);
  const [suggestedJobs, setSuggestedJobs] = useState<RecommendedItem[]>([]);

  // Handle input changes in the form
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputCourses(e.target.value);
  };

  // Submit the form and call the backend for recommendations
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const coursesArray = inputCourses.split(',').map((course) => course.trim());

    try {
      // The endpoint should return a response in the form:
      // [
      //   [
      //     { "name": "Job 1", "link": "..." },
      //     { "name": "Job 2", "link": "..." }
      //   ],
      //   [
      //     { "name": "Course 1", "link": "..." },
      //     { "name": "Course 2", "link": "..." }
      //   ]
      // ]

      const response = await axios.post('http://127.0.0.1:8000/recommendations', {
        courses: coursesArray,
      });

      // jobs come in the first array, courses in the second
      const [jobsData, coursesData] = response.data;

      setSuggestedJobs(jobsData || []);
      setSuggestedCourses(coursesData || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main content area */}
      <div className="Courses" style={{ flex: 1 }}>
        <h1>Courses</h1>

        <form onSubmit={handleSubmit} className="courses-form">
          <input
            type="text"
            value={inputCourses}
            onChange={handleInputChange}
            placeholder="Enter courses or skills, separated by commas"
          />
          <button type="submit">Submit</button>
        </form>

        <div className="recommendations">
          <div className="suggested-jobs">
            <h2>Suggested Jobs</h2>
            <ul>
              {suggestedJobs.map((job, index) => (
                <li key={index}>
                  <a href={job.link} target="_blank" rel="noopener noreferrer">
                    {job.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="suggested-courses">
            <h2>Suggested Courses</h2>
            <ul>
              {suggestedCourses.map((course, index) => (
                <li key={index}>
                  <a href={course.link} target="_blank" rel="noopener noreferrer">
                    {course.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
