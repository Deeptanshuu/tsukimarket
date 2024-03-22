import React from 'react'
import './Register.css'
import { Link } from 'react-router-dom'

const Register = () => {
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
                    <label htmlFor="email">Name</label>
                    <input
                      type="name"
                      name="name"
                      className="form-control"
                      id="email"
                      aria-describedby="nameHelp"
                      placeholder="Enter your Name"
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
                  <div className="d-grid  col-8 mx-auto p-4">
                      <button className="btn btn-outline-dark" type="button">Sign Up</button>
                    </div>
                </form>
              </div>
    
            </span>
          </div>
          </div>
      );
}

export default Register
