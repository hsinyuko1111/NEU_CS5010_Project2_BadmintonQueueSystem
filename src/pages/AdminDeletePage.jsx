import { useEffect, useState } from "react";
import firestoreDB from "../db/fireStore";
import BaseTemplate from "../components/BaseTemplate";
import "../assets/style/Admin.css";

export default function AdminDeletePage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
      fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const fetchedUsers = await firestoreDB.getUsers();
    setUsers(fetchedUsers);
  };

  const deleteUser = async (userId) => {
    await firestoreDB.deleteUser(userId);
    setUsers(users.filter((user) => user.id !== userId));
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
          <p>No users available.</p>
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
                        className="delete-btn"
                        onClick={() => deleteUser(user.id)}
                      >
                        ❌ Delete
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
