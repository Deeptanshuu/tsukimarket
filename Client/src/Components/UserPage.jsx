import React from "react";
import "./UserPage.css";
import { Link } from "react-router-dom";
import { decodeToken, isExpired } from "react-jwt";
const UserPage = () => {

  const token = localStorage.getItem("token");

  if (!token || isExpired(token)){
    localStorage.removeItem("token");
    return window.location.href = "/login";
  } 

  const UserData = decodeToken(token);
  //console.log(UserData);

  return (
    <>
      <div className="dotted-bg">
        <div className="user-page">
          <div className="sidebar col-4">
            <ul>
              <li>
                <Link to="/user">My Account</Link>
              </li>
              <li>
                <Link to="/cart">Cart</Link>
              </li>
              <li>
                <Link to="/user">Change password</Link>
              </li>
              <li>
                <button
                  type="button"
                  class="btn btn-outline-danger"
                  id="logout"
                  onClick={() => {
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                  }}
                >
                  Log out
                </button>
              </li>
            </ul>
          </div>

          <div className="user-details col-8">
            <h1>
              My Account{" "}
              <svg
                width="100px"
                height="100px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                  stroke="#000000"
                  stroke-width="0.7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </h1>
            <h3>
              Username: {UserData.username}
              <br />
              Email: {UserData.email}
            </h3>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserPage;
