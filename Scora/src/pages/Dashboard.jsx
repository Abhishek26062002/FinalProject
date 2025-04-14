import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';
import Analytics from '../components/Analytics';

const Dashboard = () => {
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      const email = sessionStorage.getItem('user'); // Retrieve email from session storage
      if (email) {
        try {
          // Fetch student data using email as a query parameter
          const response = await fetch(`https://finalproject-llyf.onrender.com/student/?email=${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const data = await response.json();
          setStudentData(data);
        } catch (error) {
          console.error('Failed to fetch student data:', error);
        }
      }
    };

    fetchStudentData();
  }, []);

  return (
    <div className='dashboard-container'>
      <Sidebar />
      <div className='dashboard-content'>
        <div className="dashboard">
          <div className="dashboard-profile">
            {/* Dynamically display the student's name */}
            <h1 className='dashboard-heading'>Hi, {studentData ? studentData.name : 'John'}</h1><br />
            <p className='dashboard-paragraph'>Here you can track your activity and find a suitable course to learn new skills</p>
          </div>
          <div className="weekly-progress">
            <Analytics />
          </div>
        </div>
        <div className='error-masg'>
          <i className='bx bx-info-circle info-icon'></i>
          <p>Take your first assessment to track your activity and find a suitable course to learn new skills.</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
