import React from 'react';
import './Login.css';
import { Link } from 'react-router-dom';

const Login = () => {
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
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  id="email"
                  aria-describedby="emailHelp"
                  placeholder="Enter your Email"
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
                />
              </div>
              <div className="forgot-container">
            <h6><Link to='/'>Forgot your password ?</Link></h6>
            </div>

              <div className="d-grid  col-8 mx-auto">
                  <button className="btn btn-outline-dark" type="button">Login</button>
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
