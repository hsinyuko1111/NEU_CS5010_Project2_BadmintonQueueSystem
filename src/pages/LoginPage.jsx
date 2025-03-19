import React, { useState } from "react";
import "../assets/style/Auth.css";
import BaseTemplate from "../components/BaseTemplate";
import firestoreDB from "../db/fireStore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null); // ✅ Store the logged-in user
  const [checkedIn, setCheckedIn] = useState(false); // ✅ Track check-in status

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    // 🔹 Verify user credentials
    const result = await firestoreDB.verifyUser(email, password);

    if (!result.success) {
      setError(result.error);
      return;
    }

    // ✅ Set `checkedIn: true` in Firestore
    await firestoreDB.checkInUser(result.user.id);

    setError("");
    setUser(result.user); // ✅ Store user data
    setCheckedIn(true); // ✅ Indicate successful check-in
  };

  return (
    <BaseTemplate>
      <div className="auth-container">
        <h2>Check-In</h2>
        
        {error && <p className="error">{error}</p>}

        {checkedIn ? (
          <div className="success-message">
            <h3>✅ You are checked in, {user.name}! 🎉</h3>
            <p>Enjoy your game now!</p>
            <a href="/match-mode" className="button">Start Playing</a> 
          </div>
        ) : (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="button">
              Play now!!
            </button>
          </form>
        )}

        {!checkedIn && (
          <p>
            Don't have an account? <a href="/register">Register</a>
          </p>
        )}
      </div>
    </BaseTemplate>
  );
}

