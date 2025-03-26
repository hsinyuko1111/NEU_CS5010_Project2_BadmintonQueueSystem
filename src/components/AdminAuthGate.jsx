import { useEffect, useState } from "react";
import BaseTemplate from "./BaseTemplate";

export default function AdminAuthGate({ children }) {
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

  const startAutoLogout = () => {
    setTimeout(() => {
      handleAdminLogout();
      alert("⏳ Session expired. Please re-enter the passcode.");
    }, 5 * 60 * 1000);
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

  return children;
}