import { useState, useEffect, useCallback, useMemo } from "react";
import firestoreDB from "../db/fireStore.js";
const DEFAULT_AUDIO_URL =
  "https://codeskulptor-demos.commondatastorage.googleapis.com/descent/gotitem.mp3";

export default function MatchSystem() {
  const pageMode = useMemo(
    () => (window.location.pathname.includes("timer") ? "timer" : "match"),
    [],
  );

  // State initialization with localStorage
  const [users, setUsers] = useState([]);
  const [rows, setRows] = useState(
    () =>
      JSON.parse(localStorage.getItem(`${pageMode}-rows`)) || [
        Array(4).fill(null),
      ],
  );

  const [rowStatus, setRowStatus] = useState(
    () =>
      JSON.parse(localStorage.getItem(`${pageMode}-rowStatus`)) || ["waiting"],
  );

  const [selectedUser, setSelectedUser] = useState(null);

  // Persist rows and row status to localStorage
  useEffect(() => {
    localStorage.setItem(`${pageMode}-rows`, JSON.stringify(rows));
  }, [rows, pageMode]);

  useEffect(() => {
    localStorage.setItem(`${pageMode}-rowStatus`, JSON.stringify(rowStatus));
  }, [rowStatus, pageMode]);

  // Fetch checked-in users
  const getCheckedInUsers = useCallback(async () => {
    try {
      const _users = await firestoreDB.getUsers();
      const checkedInUsers = _users.filter((user) => user.checkedIn);

      const rowsData = JSON.parse(localStorage.getItem(`${pageMode}-rows`)) || [
        [],
      ];
      const currentRowStatus = JSON.parse(
        localStorage.getItem(`${pageMode}-rowStatus`),
      ) || ["waiting"];

      const usersInActiveRows = rowsData
        .flat()
        .filter(Boolean)
        .filter(
          (user, index) => currentRowStatus[Math.floor(index / 4)] !== "ended",
        )
        .map((user) => user.id);

      setUsers(
        checkedInUsers.filter((user) => !usersInActiveRows.includes(user.id)),
      );
    } catch (error) {
      console.error("Error fetching checked-in users:", error);
    }
  }, [pageMode]);

  // Fetch users on component mount
  useEffect(() => {
    getCheckedInUsers();
  }, [getCheckedInUsers]);

  // Move user into selected row
  const moveToRow = useCallback(
    (rowIndex) => {
      if (!selectedUser || rowStatus[rowIndex] !== "waiting") return;

      const emptyIndex = rows[rowIndex].findIndex((slot) => slot === null);
      if (emptyIndex !== -1) {
        setUsers((prevUsers) =>
          prevUsers.filter((u) => u.id !== selectedUser.id),
        );
        setRows((prevRows) => {
          const newRows = [...prevRows];
          newRows[rowIndex] = [...newRows[rowIndex]];
          newRows[rowIndex][emptyIndex] = selectedUser;
          return newRows;
        });
        setSelectedUser(null);
      }
    },
    [selectedUser, rowStatus, rows],
  );

  // Move user back to list (only in "waiting" rows)
  const moveBackToList = useCallback(
    (rowIndex, slotIndex) => {
      if (rowStatus[rowIndex] !== "waiting") return;

      const user = rows[rowIndex][slotIndex];
      if (user) {
        setRows((prevRows) => {
          const newRows = [...prevRows];
          newRows[rowIndex] = [...newRows[rowIndex]];
          newRows[rowIndex][slotIndex] = null;
          return newRows;
        });
        setUsers((prevUsers) => [...prevUsers, user]);
      }
    },
    [rowStatus, rows],
  );

  // Add a new row
  const addNewRow = useCallback(() => {
    setRows((prevRows) => [...prevRows, Array(4).fill(null)]);
    setRowStatus((prevStatus) => [...prevStatus, "waiting"]);
  }, []);

  // Start a row (lock it)
  const startRow = useCallback(
    (rowIndex) => {
      if (rows[rowIndex].every((slot) => slot !== null)) {
        setRowStatus((prevStatus) => {
          const newStatus = [...prevStatus];
          newStatus[rowIndex] = "started";
          return newStatus;
        });
      }
    },
    [rows],
  );

  // End a row (reset but keep it visible)
  const endRow = useCallback(
    (rowIndex) => {
      setRowStatus((prevStatus) => {
        const newStatus = [...prevStatus];
        newStatus[rowIndex] = "ended";
        return newStatus;
      });
      playAlarm();

      // Move users back to the list
      setUsers((prevUsers) => [...prevUsers, ...rows[rowIndex]]);
    },
    [rows],
  );

  const playAlarm = () => {
    const audio = new Audio(DEFAULT_AUDIO_URL);
    audio.play().catch((e) => console.warn("Playback failed", e));
  };

  return (
    <div className="container">
      {/* Left Side: User List */}
      <div className="user-list">
        <h3>Available Users</h3>
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => setSelectedUser(user)}
            className={`user-item ${selectedUser === user ? "selected-user" : ""}`}
          >
            {user.name}
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
