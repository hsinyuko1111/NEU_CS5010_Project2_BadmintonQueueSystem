import React, { useState, useEffect } from "react";
import firestoreDB from "../db/fireStore"; // Firestore functions
import BaseTemplate from "../components/BaseTemplate";
import "../assets/style/Admin.css"; // ✅ Import the CSS file

export default function AdminCheckoutPage() {
  const [users, setUsers] = useState([]);
  const [passcode, setPasscode] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const correctPasscode = "1234"; // Change this to your admin passcode

  useEffect(() => {
    // Check if session storage has the correct passcode
    if (sessionStorage.getItem("adminPasscode") === correctPasscode) {
      setIsAuthorized(true);
      fetchCheckedInUsers();
      startAutoLogout(); // ✅ Start auto logout countdown
    }
  }, []);

  const fetchCheckedInUsers = async () => {
    const allUsers = await firestoreDB.getUsers();
    const checkedInUsers = allUsers.filter(user => user.checkedIn); // ✅ Only checked-in users
    setUsers(checkedInUsers);
  };

  const handlePasscodeSubmit = () => {
    if (passcode === correctPasscode) {
      setIsAuthorized(true);
      sessionStorage.setItem("adminPasscode", correctPasscode); // ✅ Store in session storage
      fetchCheckedInUsers();
    } else {
      alert("❌ Incorrect passcode!");
    }
  };
  const handleAdminLogout = () => {
    sessionStorage.removeItem("adminPasscode"); // ✅ Remove passcode from session
    setIsAuthorized(false); // ✅ Force re-entry of passcode
    setPasscode(""); // Clear input
  };

  // ✅ Auto Logout After Inactivity (5 minutes)
  const startAutoLogout = () => {
    setTimeout(() => {
      handleAdminLogout();
      alert("⏳ Session expired. Please re-enter the passcode.");
    }, 5 * 60 * 1000); // 5 minutes (300,000 ms)
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

        {/* 🔹 Logout Button */}
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
