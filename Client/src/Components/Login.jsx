import React, { useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8181/auth/login", {
        username,
        password,
      });
      //console.log(response.data);// Assuming the backend sends back a response upon successful login

      if (response.data) {
        //console.log(response.data);
        localStorage.setItem("token", JSON.stringify(response.data));
        window.location.replace("/user");//dont switch to navigate nav bar wont update
        // Handle successful login (e.g., redirect to dashboard)
        toast.success("Login successful!");
      }
    } catch (error) {
      console.error("Login failed:", error.response.data);
      toast.error(error.response.data);

      // Handle login failure (e.g., show error message to user)
    }
  };
  return (
    <>
      <ToastContainer />
      <div className="dotted-bg">
        <div className="login-container">
          <span class="border border-dark">
            <div className="login-box">
              <form className="form-container ">
                <h1 className="text-center fw-lighter">LOGIN</h1>
                <div className="register-container">
                  <h6>
                    Don't Have an account ?{" "}
                    <Link to="/register">Sign up here.</Link>
                  </h6>
                </div>
                <label htmlFor="usenmane">Username</label>
                <div className="form-group fw-bold">
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
                <label htmlFor="password">Password</label>
                <div className="form-group input-group mb-3 fw-bold">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    className="form-control"
                    id="password"
                    placeholder="Enter your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div class="input-group-append">
                    <button className="btn btn-outline-secondary" id="basic-addon2" onClick={togglePasswordVisibility} >
                    {!passwordVisible ? (
                      <svg width="22px" height="19px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
                        ) : (
                        <svg width="22px" height="19px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g id="SVGRepo_bgCarrier" stroke-width="0" />
                          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
                          <g id="SVGRepo_iconCarrier"> <path d="M12 16.01C14.2091 16.01 16 14.2191 16 12.01C16 9.80087 14.2091 8.01001 12 8.01001C9.79086 8.01001 8 9.80087 8 12.01C8 14.2191 9.79086 16.01 12 16.01Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /> <path d="M2 11.98C8.09 1.31996 15.91 1.32996 22 11.98" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /> <path d="M22 12.01C15.91 22.67 8.09 22.66 2 12.01" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /> </g>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div className="forgot-container">
                  <h6>
                    <Link to="/">Forgot your password ?</Link>
                  </h6>
                </div>

                <div className="d-grid  col-8 mx-auto">
                  <button
                    className="btn btn-outline-dark"
                    type="button"
                    onClick={handleSubmit}
                  >
                    Login
                  </button>
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
