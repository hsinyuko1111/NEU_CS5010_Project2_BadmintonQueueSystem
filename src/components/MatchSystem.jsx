import { useState, useEffect } from "react";
import firestoreDB from "../db/fireStore";

export default function MatchSystem() {
  // Example list of logged-in users
  //const [users, setUsers] = useState(["Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Hank"]);

  const [users, setUsers] = useState([]);
  const pageMode = window.location.pathname.includes("timer")
    ? "timer"
    : "match";

  async function getCheckedInUsers() {
    console.log("Getting checked-in users...");

    const _users = await firestoreDB.getUsers(); // Fetch checked-in users
    const checkedInUsers = _users.filter((user) => user.checkedIn);

    const rowsData = JSON.parse(localStorage.getItem(`${pageMode}-rows`)) || [
      [],
    ];
    const rowStatus = JSON.parse(
      localStorage.getItem(`${pageMode}-rowStatus`),
    ) || ["waiting"];

    // Get users who are in active rows (not "ended")
    const usersInActiveRows = rowsData
      .flat()
      .filter(Boolean) // Remove null values
      .filter((user, index) => rowStatus[Math.floor(index / 4)] !== "ended") // Keep only users in active rows
      .map((user) => user.id);

    // Set available users (excluding those in rows)
    setUsers(
      checkedInUsers.filter((user) => !usersInActiveRows.includes(user.id)),
    );
  }

  useEffect(() => {
    getCheckedInUsers();
  }, []);

  // State for multiple rows of slots
  // const [rows, setRows] = useState([Array(4).fill(null)]);
  const [rows, setRows] = useState(() => {
    return (
      JSON.parse(localStorage.getItem(`${pageMode}-rows`)) || [
        Array(4).fill(null),
      ]
    );
  });

  const [rowStatus, setRowStatus] = useState(() => {
    return (
      JSON.parse(localStorage.getItem(`${pageMode}-rowStatus`)) || ["waiting"]
    );
  });

  // Save to localStorage when rows or rowStatus changes
  useEffect(() => {
    localStorage.setItem(`${pageMode}-rows`, JSON.stringify(rows));
  }, [rows]);

  useEffect(() => {
    localStorage.setItem(`${pageMode}-rowStatus`, JSON.stringify(rowStatus));
  }, [rowStatus]);

  // Track selected user for placing in a row
  const [selectedUser, setSelectedUser] = useState(null);

  // Move user into selected row
  const moveToRow = (rowIndex) => {
    if (!selectedUser || rowStatus[rowIndex] !== "waiting") return;

    const emptyIndex = rows[rowIndex].findIndex((slot) => slot === null);
    if (emptyIndex !== -1) {
      setUsers(users.filter((u) => u.id !== selectedUser.id));
      setRows((prevRows) => {
        const newRows = [...prevRows];
        newRows[rowIndex] = [...newRows[rowIndex]];
        newRows[rowIndex][emptyIndex] = selectedUser;
        return newRows;
      });
      setSelectedUser(null);
    }
  };

  // Move user back to list (only in "waiting" rows)
  const moveBackToList = (rowIndex, slotIndex) => {
    if (rowStatus[rowIndex] !== "waiting") return;

    const user = rows[rowIndex][slotIndex];
    if (user) {
      setRows((prevRows) => {
        const newRows = [...prevRows];
        newRows[rowIndex] = [...newRows[rowIndex]];
        newRows[rowIndex][slotIndex] = null;
        return newRows;
      });
      setUsers([...users, user]);
    }
  };

  // Add a new row
  const addNewRow = () => {
    setRows([...rows, Array(4).fill(null)]);
    setRowStatus([...rowStatus, "waiting"]);
  };

  // Start a row (lock it)
  const startRow = (rowIndex) => {
    if (rows[rowIndex].every((slot) => slot !== null)) {
      setRowStatus((prevStatus) => {
        const newStatus = [...prevStatus];
        newStatus[rowIndex] = "started";
        return newStatus;
      });
    }
  };

  // End a row (reset but keep it visible)
  const endRow = (rowIndex) => {
    setRowStatus((prevStatus) => {
      const newStatus = [...prevStatus];
      newStatus[rowIndex] = "ended";
      return newStatus;
    });

    // Move users back to the list
    setUsers([...users, ...rows[rowIndex]]);
  };

  return (
    <div className="container">
      {/* Left Side: User List */}
      <div className="user-list">
        <h3>Available Users</h3>
        {users.map((user) => (
          <div
            key={user}
            onClick={() => setSelectedUser(user)}
            className={`user-item ${selectedUser === user ? "selected-user" : ""}`}
          >
            {user.name}
            {console.log(user)}
          </div>
        ))}
      </div>

      {/* Right Side: Slot Grid */}
      <div className="slot-grid">
        {rows.map((slots, rowIndex) => (
          <div key={rowIndex} className="row-container">
            <div className={`slot-row ${rowStatus[rowIndex]}`}>
              {slots.map((slot, slotIndex) => (
                <div
                  key={slotIndex}
                  onClick={() => moveBackToList(rowIndex, slotIndex)}
                  className={`slot ${rowStatus[rowIndex] === "waiting" && slot ? "clickable" : ""} ${slot ? "filled" : ""}`}
                >
                  {slot ? slot.name : "Empty"}
                </div>
              ))}
            </div>

            {/* Row selection button */}
            {selectedUser && rowStatus[rowIndex] === "waiting" && (
              <button
                onClick={() => moveToRow(rowIndex)}
                className="add-button"
              >
                Add {selectedUser.name} to Row {rowIndex + 1}
              </button>
            )}

            {/* Start Button (Only if row is full and hasn't started) */}
            {rowStatus[rowIndex] === "waiting" &&
              slots.every((slot) => slot !== null) && (
                <button
                  onClick={() => startRow(rowIndex)}
                  className="start-button"
                >
                  Start
                </button>
              )}

            {/* End Button (Only if row is started) */}
            {rowStatus[rowIndex] === "started" && (
              <button onClick={() => endRow(rowIndex)} className="end-button">
                End
              </button>
            )}
          </div>
        ))}

        {/* Add Row Button */}
        <button onClick={addNewRow} className="add-row-button">
          + Add Row
        </button>
      </div>
    </div>
  );
}
