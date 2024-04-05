import React, { useState, useEffect } from "react";
import "./UserPage.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { decodeToken, isExpired } from "react-jwt";

const UserPage = () => {
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [UserData, setUserData] = useState({});
  const [edit_phone, setEdit_phone] = useState(false);
  const [edit_address, setEdit_address] = useState(false);

  const token = JSON.parse(localStorage.getItem("token"));
  //console.log(UserData);

  useEffect(() => {
    if (!token || isExpired(token)) {
      localStorage.removeItem("token");
      toast.error("Session expired. Please login again.");
      window.location.replace("/login");
      return null;
    } 
    else {
      const userData = decodeToken(token);
      if (userData) {
        setUserData(userData);
        //Capital U is for display purpose Small u is for if else ladder
        toast.success("Welcome, " + userData.username);
      } 
      else {
        localStorage.removeItem("token");
        toast.error("Session expired. Please login again.");
        window.location.replace("/login");
        return null;
      }
    }
  }, [token]);

  const handle_addressSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = {
        token: token,
        address: address,
      };

      const response = await axios.post(
        "http://localhost:8181/db/user_address",
        data
      );
      //console.log(response);

      if (response.data) {
        toast.success("Address updated successfully!");
        localStorage.setItem("token", JSON.stringify(response.data));
        setTimeout(() => {
          window.location.reload();
        }, 600);
        // Update local storage or state with new token if needed
      }
    } catch (error) {
      console.error("Address update failed:", error.response.data);
      toast.error(error.response.data);
    }
  };

  const handle_phoneSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        token: token,
        phone: phone,
      };

      const response = await axios.post(
        "http://localhost:8181/db/user_phone",
        data
      );

      console.log(response);

      if (response.data) {
        toast.success("Phone updated successfully!");
        localStorage.setItem("token", JSON.stringify(response.data));
        setTimeout(() => {
          window.location.reload();
        }, 600);
      }
    } catch (error) {
      console.error("Phone number update failed:", error.response.data);
      toast.error(error.response.data);
    }
  };

  return (
    <>
      <div className="dotted-bg">
        <ToastContainer limit={1} />
        <div className="user-page">
          <div className="sidebar col-4">
            <ul>
              <li>
                <a href="/user">My Account</a>
              </li>
              <li>
                <Link to="/order_history">Orders History</Link>
              </li>
              <li>
                <Link to="/cart">Cart</Link>
              </li>

              <button
                type="button"
                class="btn btn-outline-danger"
                id="logout"
                onClick={() => {
                  localStorage.removeItem("token");
                  toast.success("Logged out successfully!");
                  setTimeout(() => {
                    window.location.replace("/login");
                  }, 600);
                }}
              >
                Log out
              </button>
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
              <h4>
                <b>Welcome,</b>
              </h4>
              <h4>{UserData.username}</h4> <br />
              <h4>Email:</h4>
              <p>{UserData.email}</p> <br />
              {UserData.phone && !edit_phone ? (
                <>
                  <h4>Phone Number:</h4>
                  <form className="d-inline">
                    <div className="input-group ">
                      <p>{UserData.phone}</p> <br />
                      <div className="input-group-append">
                        <button
                          id="edit"
                          className="btn btn-outline-dark"
                          type="button"
                          onClick={() => setEdit_phone(!edit_phone)}
                        >
                          {" "}
                          ✏️
                        </button>
                      </div>
                    </div>
                  </form>
                  <br />
                </>
              ) : (
                <>
                  <h4>Phone Number:</h4>
                  <form className="d-inline">
                    <div className="input-group ">
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
                          onClick={() => setEdit_phone(!edit_phone)}
                        >
                          {" "}
                          ❌
                        </button>
                        <button
                          id="edit"
                          className="btn btn-outline-dark"
                          type="button"
                          onClick={handle_phoneSubmit}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </form>
                  <br />
                </>
              )}
              {UserData.address && !edit_address ? (
                <>
                  <h4>Address:</h4>
                  <form className="d-inline">
                    <div className="input-group mb-3">
                      <p>{UserData.address}</p> <br />
                      <div className="input-group-append">
                        <button
                          id="edit"
                          className="btn btn-outline-dark"
                          type="button"
                          onClick={() => setEdit_address(!edit_address)}
                        >
                          {" "}
                          ✏️
                        </button>
                      </div>
                    </div>
                  </form>
                  <br />
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
                          onClick={() => setEdit_address(!edit_address)}
                        >
                          {" "}
                          ❌
                        </button>
                        <button
                          id="edit"
                          className="btn btn-outline-dark"
                          type="button"
                          onClick={handle_addressSubmit}
                        >
                          Submit
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
