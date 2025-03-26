import React, { useState, useEffect } from "react";
import firestoreDB from "../db/fireStore";
import BaseTemplate from "../components/BaseTemplate";
import "../assets/style/Admin.css";
import AdminAuthGate from "../components/AdminAuthGate";

export default function AdminCheckoutPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchCheckedInUsers();
  }, []);

  const fetchCheckedInUsers = async () => {
    const allUsers = await firestoreDB.getUsers();
    const checkedInUsers = allUsers.filter((user) => user.checkedIn);
    setUsers(checkedInUsers);
  };

  const handleCheckOut = async (userId) => {
    await firestoreDB.checkOutUser(userId);
    setUsers(users.filter((user) => user.id !== userId)); // ✅ Remove from UI
  };

  return (
    <AdminAuthGate>
      <BaseTemplate>
        <div className="admin-container">
          <h2 className="admin-title">👤 User Management</h2>

          <button
            className="logout-btn"
            onClick={() => {
              sessionStorage.removeItem("adminPasscode");
              location.reload();
            }}
          >
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
                        <button
                          className="checkout-btn"
                          onClick={() => handleCheckOut(user.id)}
                        >
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
    </AdminAuthGate>
  );
}
