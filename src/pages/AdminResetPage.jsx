import { useEffect, useState } from "react";
import BaseTemplate from "../components/BaseTemplate";
import "../assets/style/Admin.css";

export default function AdminDeletePage() {
  const [passcode, setPasscode] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const correctPasscode = "1234";

  useEffect(() => {
    if (sessionStorage.getItem("adminPasscode") === correctPasscode) {
      setIsAuthorized(true);
      startAutoLogout();
    }
  }, []);

  const handlePasscodeSubmit = () => {
    if (passcode === correctPasscode) {
      setIsAuthorized(true);
      sessionStorage.setItem("adminPasscode", correctPasscode);
      startAutoLogout();
    } else {
      alert("❌ Incorrect passcode!");
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem("adminPasscode");
    setIsAuthorized(false);
    setPasscode("");
  };

  // Auto Logout After Inactivity (5 minutes)
  const startAutoLogout = () => {
    setTimeout(
      () => {
        handleAdminLogout();
        alert("⏳ Session expired. Please re-enter the passcode.");
      },
      5 * 60 * 1000,
    );
  };

  const clearAppStorage = () => {
    if (
      confirm(
        "Are you sure you want to clear all local storage data? This cannot be undone.",
      )
    ) {
      localStorage.clear();
      location.reload(); // Optionally refresh to reflect cleared state
    }
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
        <h2 className="admin-title">👤 User Management</h2>

        <button className="logout-btn" onClick={handleAdminLogout}>
          🔒 Logout
        </button>

        <button
          onClick={clearAppStorage}
          style={{
            backgroundColor: "red",
            color: "white",
            padding: "10px",
            border: "none",
            cursor: "pointer",
          }}
        >
          🚨 Clear Local Storage
        </button>
      </div>
    </BaseTemplate>
  );
}
