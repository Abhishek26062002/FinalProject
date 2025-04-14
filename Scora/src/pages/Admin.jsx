import React, { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { Link } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
  const [studentData, setStudentData] = useState(null);
  const [testData, setTestData] = useState([]);

  useEffect(() => {
    let isMounted = true; // track if the component is still mounted

    const fetchStudentData = async () => {
      const email = sessionStorage.getItem('user');
      if (email) {
        try {
          const response = await fetch(`https://finalproject-llyf.onrender.com/student/?email=${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          console.log(response);

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const data = await response.json();
          if (isMounted) setStudentData(data);
        } catch (error) {
          console.error('Failed to fetch student data:', error);
        }
      }
    };

    const fetchTestData = async () => {
      try {
        const response = await fetch('https://finalproject-llyf.onrender.com/test/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (isMounted) setTestData(data);
      } catch (error) {
        console.error('Failed to fetch test data:', error);
      }
    };

    fetchStudentData();
    fetchTestData();

    return () => {
      isMounted = false; // cleanup
    };
  }, []);

  return (
    <div className='admin-container'>
      <AdminSidebar />
      <div className='admin'>
        <div className="admin-profile">
          {/* Dynamically display the student's name */}
          <h1 className='dashboard-heading'>Hi, {studentData ? studentData.name : 'John'}</h1>
          <p className='admin-paragraph'>Here you can track your activity and find a suitable course to learn new skills</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Test Id</th>
              <th>Test Name</th>
              <th>Type</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {testData.map(test => (
              <tr key={test.test_id}>
                <td>{test.test_id}</td>
                <td>{test.test_name}</td>
                <td>{test.type}</td>
                <td>{test.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link to="/add">
          <button className="add-more-button" aria-label='Add More Tests'>ADD MORE</button>
        </Link>
      </div>
    </div>
  );
}

export default Admin;
