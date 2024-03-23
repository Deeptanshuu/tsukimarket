import React from 'react';
import './UserPage.css';

const UserPage = () => {

    const userData = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
        window.location.href = '/login'
    }
    
  return (
    <>
    <div className="dotted-bg">
      <div className="user-page">
        <div className="col-4">
            <h2>this is side bar</h2>
            <button type='button' class="btn btn-outline-danger" id = "logout" onClick={() => { localStorage.removeItem('userData'); window.location.href = '/login' }}>Log out</button>
        </div>

        <div className="col-8">
        <h1>My Account</h1>
        <h3>
            Username: {userData.username}<br />
            Email: {userData.email}
        </h3>
        </div>
    </div>

      
    </div>
    </>
  )
}

export default UserPage
