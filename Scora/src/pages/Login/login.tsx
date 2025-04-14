import React, { useState } from 'react';
import './login.scss';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8000'; 

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setErrors({ name: '', email: '', password: '', confirmPassword: '' });
  };

  const validateForm = () => {
    let formErrors = { name: '', email: '', password: '', confirmPassword: '' };
    let isValid = true;

    if (isSignUp) {
      if (!name) {
        formErrors.name = 'Name is required';
        isValid = false;
      }
    }

    if (!email) {
      formErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      formErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!password) {
      formErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      formErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (isSignUp && password !== confirmPassword) {
      formErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        let response;
        if (isSignUp) {
          // Handle signup
          response = await axios.post(`${API_URL}/signup/`, {
            name,
            email,
            password,
            Type: "student" // Adjust as needed for different types
          });

          if (response.status === 200) {
            sessionStorage.setItem('user', email);
            sessionStorage.setItem('userType', 'student'); // Save userType
            navigate('/dashboard');
          } else {
            alert('Error signing up');
          }
        } else {
          // Handle login
          response = await axios.post(`${API_URL}/login/`, {
            email,
            password,
          });

          if (response.status === 200) {
            sessionStorage.setItem('user', email);
            sessionStorage.setItem('userType', response.data.student.Type); // Save userType from response
            localStorage.setItem('student_id', response.data.student.student_id); // Save student_id
            console.log(response);
            console.log(response.data.student.Type);
            if (response.data.student.student_id === 6) {
              navigate('/admin');
            } else {
              navigate('/dashboard');
            }
          } else {
            alert('Invalid Credentials');
          }
        }
      } catch (error) {
        console.error(error);
        alert('An error occurred');
      }
    }
  };

  return (
    <div className='loginPage'>
      <div className="big-circle">
        <div className="inner-circle"></div>
      </div>
      <img src="https://i.imgur.com/wcGWHvx.png" className="square" alt="" />
      <div className={`container ${isSignUp ? 'right-panel-active' : ''}`} id="container">
        <div className={`form-container sign-up-container ${isSignUp ? 'active' : ''}`}>
          <form onSubmit={handleSubmit}>
            <h1>Create Account</h1>
            <span>or use your email for registration</span>
            <div className="infield">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>
            <div className="infield">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
            <div className="infield">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <span className="error">{errors.password}</span>}
            </div>
            {isSignUp && (
              <div className="infield">
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
              </div>
            )}
            <button type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
          </form>
        </div>

        <div className={`form-container sign-in-container ${!isSignUp ? 'active' : ""}`}>
          <form onSubmit={handleSubmit}>
            <h1>Sign in</h1>
            <span>or use your account</span>
            <div className="infield">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
            <div className="infield">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <span className="error">{errors.password}</span>}
            </div>
            <a href="#" className="forgot">Forgot your password?</a>
            <button type="submit">Sign In</button>
          </form>
        </div>

        <div className="overlay-container" id="overlayCon">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button onClick={toggleForm}>Sign In</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>NextGenTest</h1>
              <p>Enter your personal details and start journey with us</p>
              <button onClick={toggleForm}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
