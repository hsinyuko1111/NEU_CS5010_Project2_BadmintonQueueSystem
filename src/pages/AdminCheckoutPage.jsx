import React, { useState, useEffect } from "react";
import firestoreDB from "../db/fireStore"; 
import BaseTemplate from "../components/BaseTemplate";
import "../assets/style/Admin.css"; 

export default function AdminCheckoutPage() {
  const [users, setUsers] = useState([]);
  const [passcode, setPasscode] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const correctPasscode = "1234"; 

  useEffect(() => {
    if (sessionStorage.getItem("adminPasscode") === correctPasscode) {
      setIsAuthorized(true);
      fetchCheckedInUsers();
      startAutoLogout(); 
    }
  }, []);

  const fetchCheckedInUsers = async () => {
    const allUsers = await firestoreDB.getUsers();
    const checkedInUsers = allUsers.filter(user => user.checkedIn); 
    setUsers(checkedInUsers);
  };

  const handlePasscodeSubmit = () => {
    if (passcode === correctPasscode) {
      setIsAuthorized(true);
      sessionStorage.setItem("adminPasscode", correctPasscode); 
      fetchCheckedInUsers();
    } else {
      alert("❌ Incorrect passcode!");
    }
  };
  const handleAdminLogout = () => {
    sessionStorage.removeItem("adminPasscode"); 
    setIsAuthorized(false); 
    setPasscode(""); 
  };

  // ✅ Auto Logout After Inactivity (5 minutes)
  const startAutoLogout = () => {
    setTimeout(() => {
      handleAdminLogout();
      alert("⏳ Session expired. Please re-enter the passcode.");
    }, 5 * 60 * 1000); 
  };

  const handleCheckOut = async (userId) => {
    await firestoreDB.checkOutUser(userId);
    setUsers(users.filter(user => user.id !== userId)); // ✅ Remove from UI
  };

  if (!isAuthorized) {
      return (
        <BaseTemplate>
        <div className="admin-container">
          <h2 className="admin-title">🔐 Enter Admin Passcode</h2>
          <div className="passcode-input-group">
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Enter passcode"
          />
          <button onClick={handlePasscodeSubmit}>Submit</button>
          </div>
          
        </div>
        </BaseTemplate>
      );
    }

  return (
    <BaseTemplate>
      <div className="admin-container">
      <h2  className="admin-title">👤 Check Out Users</h2>

        <button className="logout-btn" onClick={handleAdminLogout}>
          🔒 Logout
        </button>

        {users.length === 0 ? (
          <p>No users currently checked in.</p>
        ) : (
        <div className="table-wrapper"> 
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <button className="checkout-btn" onClick={() => handleCheckOut(user.id)}>
                      ✅ Check Out
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </BaseTemplate>
  );
}
