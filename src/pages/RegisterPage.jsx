import React, { useState } from "react";
//import { auth, db, createUserWithEmailAndPassword, setDoc, doc } from "./firebase";
import "../assets/style/Auth.css";
import BaseTemplate from "../components/BaseTemplate";

export default function RegisterPage({ onRegister }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const { username, email, password } = formData;

    if (!username || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    onRegister(username, email);
  };

  return (
    <BaseTemplate>
      <div className="auth-container">
        <h2>Join our Group</h2>
        {error && <p className="error">{error}</p>}
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
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </BaseTemplate>
  );
}
