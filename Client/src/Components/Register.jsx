import React, { useState } from 'react';
import './Register.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [username, setusername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:8181/auth/signup', { username, email, password });

      if(response.data){      
        // Handle successful login (e.g., redirect to dashboard)
        toast.success('Sign up successful!');
        window.location.href = '/login';
      }
    } 
    catch (error) {
      console.error('Login failed:', error.response.data);
      toast.error(error.response.data);
  
      // Handle login failure (e.g., show error message to user)
    }
  };
    return (
      <div className="dotted-bg">
        <div className="login-container">
          <span class="border border-dark">
    
            <div className="col align-items-center">
              <form className="form-container ">
              <h1 className='text-center fw-lighter' >SIGN UP</h1>
              <div className="register-container">
              <h6>Already Have an account ? <Link to='/login'>Log in here.</Link></h6>
                </div>
                <div className="form-group fw-bold">
                    <label htmlFor="email">Userame</label>
                    <input
                      type="name"
                      name="name"
                      className="form-control"
                      id="email"
                      aria-describedby="nameHelp"
                      placeholder="Enter your Name"
                      value={username}
                      onChange={(e) => setusername(e.target.value)}
                    />
                  </div>
                  <div className="form-group fw-bold">
                    <label htmlFor="email">Email address</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      id="email"
                      aria-describedby="emailHelp"
                      placeholder="Enter your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-group fw-bold">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      id="password"
                      placeholder="Enter your Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="d-grid  col-8 mx-auto p-4">
                      <button className="btn btn-outline-dark" type="button" onClick={handleSubmit}>Sign Up</button>
                    </div>
                </form>
              </div>
    
            </span>
          </div>
          </div>
      );
}

export default Register
