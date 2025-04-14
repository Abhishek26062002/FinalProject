import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Sidebar.css';

const AdminSidebar = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isScreenSmall, setIsScreenSmall] = useState(window.innerWidth <= 1000);
  const [studentData, setStudentData] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsScreenSmall(window.innerWidth <= 1000);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchStudentData = async () => {
      const email = sessionStorage.getItem('user'); // Retrieve email from session storage
      if (email) {
        try {
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

  const toggleSidebar = () => {
    if (isScreenSmall) {
      setIsSidebarVisible(!isSidebarVisible);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div>
      <div className={`nav-container ${isSidebarVisible ? 'hidden' : ''}`}>
        <div className="navbar">
        <h1 className="heading">Smart Test</h1>
          <i className="nav-icon bx bx-menu" onClick={toggleSidebar}></i>
        </div>
      </div>
      <div className={`sidebar-container ${isSidebarVisible || !isScreenSmall ? '' : 'hidden'}`}>
        <div className="sidebar"><br />
        <h1 className="heading">Smart Test</h1><br /><br />
          <i className="bx bxs-face bx-flip-horizontal bi-profile"></i>
          <p className="sidebar-name">{studentData ? studentData.name : 'John Doe'}</p>
          <p className="sidebar-email">{studentData ? studentData.email : 'jhondoe12345@gmail.com'}</p>
          <div className="nav-items">
            <ul className="nav-list">
              <li className={`nav-list-items ${isActive('/admin') ? 'active' : ''}`}>
                <i className="nav-icons bx bxs-dashboard"></i>
                <a className="nav-items" href="/admin">Dashboard</a>
              </li>
              <li className={`nav-list-items ${isActive('/add') ? 'active' : ''}`}>
                <i className="nav-icons bx bxs-pencil"></i>
                <a className="nav-items" href="/add">Add Assessments</a>
              </li>
            </ul>
          </div>
          {isScreenSmall && <i className="nav-icon bx bxs-x-circle" onClick={toggleSidebar}></i>}
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
