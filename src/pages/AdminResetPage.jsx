import AdminAuthGate from "../components/AdminAuthGate";
import BaseTemplate from "../components/BaseTemplate";
import "../assets/style/Admin.css";

export default function AdminDeletePage() {
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

  return (
    <AdminAuthGate>
      <BaseTemplate>
        <div className="admin-container">
          <h2 className="admin-title">👤 User Management</h2>

          <button
            className="logout-btn"
            onClick={() => {
              sessionStorage.removeItem("adminPasscode");
              location.reload(); // Reload to trigger re-auth
            }}
          >
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
    </AdminAuthGate>
  );
}
