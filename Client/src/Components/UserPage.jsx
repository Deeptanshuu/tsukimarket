import React, { useState } from "react";
import "./UserPage.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { decodeToken, isExpired } from "react-jwt";

const UserPage = () => {

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("token"));

  if (!token || isExpired(token)) {
    localStorage.removeItem("token");
    toast.error("Session expired. Please login again.");
    navigate("/login");
    return null;
  }

  const UserData = decodeToken(token);
  //console.log(UserData);

  const handle_addressSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data ={
        token: token,
        address: address,
      }

      const response = await axios.post('http://localhost:8181/db/user_address', data );
      console.log(response);

      if (response.data) {
        toast.success('Address added successfully!');
        localStorage.clear('token');
        localStorage.setItem('token', JSON.stringify(response.data));
        window.location.reload();
        // Update local storage or state with new token if needed
      }
    } catch (error) {
      console.error('Address update failed:', error.response.data);
      toast.error(error.response.data);
    }
  };

  const handle_phoneSubmit = async (e) => {
    e.preventDefault();
    try {

    const data = {
      token: token,
      phone: phone
    };
    
    const response = await axios.post('http://localhost:8181/db/user_phone', data);
    

      console.log(response);

      if (response.data) {
        toast.success('Phone added successfully!');
        localStorage.removeItem('token'); // Remove the existing token
        localStorage.setItem('token', JSON.stringify(response.data));
        window.location.reload();
        // Update local storage or state with new token if needed
      }
    } catch (error) {
      console.error('Phone number update failed:', error.response.data);
      toast.error(error.response.data);
    }
  };



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
                <Link to="/user">Orders History</Link>
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
                    toast.success("Logged out successfully!");
                    navigate("/login");
                  }}
                >
                  Log out
                </button>
              </li>
            </ul>
          </div>

          <div className="user-details col-8">
            <div className="user-header">
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
            </div>

            <div className="details-page">
              <h4>Welcome,</h4>
              <p>{UserData.username}</p> <br />
              <h4>Email:</h4>
              <p>{UserData.email}</p> <br />
              {UserData.phone ? (
                <>
                  <h4>Phone Number:</h4>
                  <p>{UserData.phone}</p> <br />
                </>
              ) : (
                <>
                  <h4>Phone Number:</h4>
                  <form className="d-inline">
                    <div className="input-group mb-3">
                      <input
                        id="phone"
                        type="text"
                        className="form-control"
                        placeholder="Enter your Number"
                        aria-label="Mobile Number"
                        aria-describedby="basic-addon2"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                      <div className="input-group-append">
                        <button
                          id="edit"
                          className="btn btn-outline-dark"
                          type="button"
                          onClick={handle_phoneSubmit}
                        >
                          {" "}
                          ✏️{" "}
                        </button>
                      </div>
                    </div>
                  </form>
                  <br />
                </>
              )}

              {UserData.address ? (
                <>
                  <h4>Address:</h4>
                  <p>{UserData.address}</p> <br />
                </>
              ) : (
                <>
                  <h4>Address:</h4>
                  <form className="d-inline">
                    <div className="input-group mb-3">
                      <input
                        id="address"
                        type="text"
                        className="form-control"
                        placeholder="Enter your Address"
                        aria-label="Mobile Number"
                        aria-describedby="basic-addon2"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                      <div className="input-group-append">
                        <button
                          id="edit"
                          className="btn btn-outline-dark"
                          type="button"
                          onClick={handle_addressSubmit}
                        >
                          {" "}
                          ✏️{" "}
                        </button>
                      </div>
                    </div>
                  </form>
                  <br />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserPage;

