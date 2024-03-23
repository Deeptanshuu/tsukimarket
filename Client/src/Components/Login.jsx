import React, { useState } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:8181/auth/login', { username, password });
      //console.log(response.data);// Assuming the backend sends back a response upon successful login
      if(response.data){      
        // Handle successful login (e.g., redirect to dashboard)
        toast.success(response.data);

        //localStorage.setItem('status', response.data);
        //window.location.href = '/users';
      }
    } 
    catch (error) {
      console.error('Login failed:', error.response.data);
      toast.error(error.response.data);
  
      // Handle login failure (e.g., show error message to user)
    }
  };
  return (
    <>
    <div className="dotted-bg">
    <div className="login-container">
      <span class="border border-dark">

        <div className="login-box">
          <form className="form-container ">
          <h1 className='text-center fw-lighter' >LOGIN</h1>
          <div className="register-container">
            <h6>Don't Have an account ? <Link to='/register'>Sign up here.</Link></h6>
            </div>
              <div className="form-group fw-bold">
                <label htmlFor="usenmane">Username</label>
                <input
                  type="username"
                  name="username"
                  className="form-control"
                  id="username"
                  aria-describedby="usernameHelp"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setusername(e.target.value)}
                />
              </div>
              <div className="form-group fw-bold">
                <label htmlFor="password">Password</label>
                <input
                  type="text"
                  name="password"
                  className="form-control"
                  id="password"
                  placeholder="Enter your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="forgot-container">
            <h6><Link to='/'>Forgot your password ?</Link></h6>
            </div>

              <div className="d-grid  col-8 mx-auto">
                  <button className="btn btn-outline-dark" type="button" onClick={handleSubmit}>Login</button>
                </div>


            </form>
          </div>

        </span>
      </div>
      </div>
      </>
  );
};

export default Login;
