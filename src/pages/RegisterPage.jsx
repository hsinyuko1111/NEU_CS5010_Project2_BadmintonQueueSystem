import React, { useState, Link } from "react";
import "../assets/style/Auth.css";
import BaseTemplate from "../components/BaseTemplate";
import firestoreDB from "../db/fireStore";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // ✅ Store success message
  const [userId, setUserId] = useState(null); // ✅ Store user ID after registration

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { username, email, password } = formData;

    if (!username || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    // 🔹 Register user in Firestore
    const result = await firestoreDB.registerUser(username, email, password);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setError("");
    setUserId(result.userId); // ✅ Store registered user ID
    setSuccessMessage(`Welcome, ${username}! Your account has been created.`);
  };

  return (
    <BaseTemplate>
      <div className="auth-container">
        <h2>Join our Group</h2>
        
        {error && <p className="error">{error}</p>}

        {/* 🔹 Show success message after registration */}
        {successMessage ? (
          <div className="success-message">
            <h3>{successMessage}</h3>     
           
            <a href="/login"  className="button">Check in!!</a>
          
          </div>
        ) : (
          <form onSubmit={handleRegister}>
            <input
              type="text"
              name="username"
              placeholder="Name"
              value={formData.username}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <button type="submit" className="button">
              Register
            </button>
          </form>
        )}

        {!successMessage && (
          <p>
            Already have an account? <a href="/login">Login</a>
          </p>
        )}
      </div>
    </BaseTemplate>
  );
}

