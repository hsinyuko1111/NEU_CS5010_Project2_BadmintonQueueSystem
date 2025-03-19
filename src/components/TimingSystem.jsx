import { useEffect, useState, useRef } from "react";
import "../assets/style/style.css"; // Import external CSS file
import firestoreDB from "../db/fireStore";

export default function TimingSystem() {

  /*comment out line below to clean the storage*/
  localStorage.clear();

  const pageMode = window.location.pathname.includes("timer")
    ? "timer"
    : "match";

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

  

  const [timers, setTimers] = useState(() => {
    try {
        const savedTimers = JSON.parse(localStorage.getItem("timers")) || [20 * 60];
        const startTimes = JSON.parse(localStorage.getItem("startTimes")) || [];
        
        return savedTimers.map((time, index) => {
          if (startTimes[index] && rowStatus[index] === "started") {
            const elapsed = Math.floor((Date.now() - startTimes[index]) / 1000);
            return Math.max(time - elapsed, 0); // Ensure non-negative timer values
          }
          return time;
        });
      } catch (error) {
        console.error("Error loading timers from localStorage:", error);
        return [20 * 60];
      }
    });

  //Restart timer when component mounts!
  useEffect(() => {
    timers.forEach((time, index) => {
      if (time > 0 && rowStatus[index] === "started") {
        startTimer(index); // Restart the timer interval
      }
    });
  }, []);
// const restoreTimers = () => {
//     const startTimes = JSON.parse(localStorage.getItem("startTimes")) || [];
//     const storedTimers = JSON.parse(localStorage.getItem("timers")) || [];
//     const newTimers = [...storedTimers];

//     startTimes.forEach((startTime, index) => {
//       if (startTime && rowStatus[index] === "started") {
//         const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
//         newTimers[index] = Math.max(storedTimers[index] - elapsedTime, 0); // Prevent negative timer
//       }
//     });

//     setTimers(newTimers);
//   };

//   // 🚀 Restart timers when the component mounts (persists on navigation)
//   useEffect(() => {
//     restoreTimers();
//     timers.forEach((time, index) => {
//       if (time > 0 && rowStatus[index] === "started") {
//         startTimer(index);
//       }
//     });
//   }, []);

  // Final Times (Store separately for each mode)
  const [finalTimes, setFinalTimes] = useState(() => {
    return JSON.parse(localStorage.getItem("finalTimes")) || [];
  });

  // Function to start the countdown timer
  const startTimer = (rowIndex) => {
    if (timerRefs.current[rowIndex]) clearInterval(timerRefs.current[rowIndex]); // Clear existing timer

    // Save start time in localStorage
    const newStartTimes = JSON.parse(localStorage.getItem("startTimes")) || [];
    newStartTimes[rowIndex] = Date.now();
    localStorage.setItem("startTimes", JSON.stringify(newStartTimes));

    timerRefs.current[rowIndex] = setInterval(() => {
      setTimers((prevTimers) => {
        const newTimers = [...prevTimers];
        if (newTimers[rowIndex] > 0) {
          newTimers[rowIndex] -= 1;
          // localStorage.setItem("timers", JSON.stringify(newTimers)); // Persist timers

        } else {
          clearInterval(timerRefs.current[rowIndex]);
          handleTimeout(rowIndex);
        }
        return newTimers;
      });
    }, 1000);
  };

  const timerRefs = useRef([]); // Store setInterval IDs for timers

  // Track selected user for placing in a row
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);

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

  // Function to move a user to a row
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

  // Function to start a row (lock it and start the timer)
  const startRow = (rowIndex) => {
    if (rows[rowIndex].every((slot) => slot !== null)) {
      setRowStatus((prevStatus) => {
        const newStatus = [...prevStatus];
        newStatus[rowIndex] = "started";
        return newStatus;
      });
      startTimer(rowIndex);
    }
  };

  // Function to restart the timer
  const restartTimer = (rowIndex) => {
    const newTimers = [...timers];
    newTimers[rowIndex] = 20 * 60; 
    setTimers(newTimers);
    localStorage.setItem("timers", JSON.stringify(newTimers));

    // Reset start time
    const newStartTimes = JSON.parse(localStorage.getItem("startTimes")) || [];
    newStartTimes[rowIndex] = Date.now();
    localStorage.setItem("startTimes", JSON.stringify(newStartTimes));

    startTimer(rowIndex);
  };

  // Function to handle timeout (auto end at 00:00)
  const handleTimeout = (rowIndex) => {
    setFinalTimes((prevFinalTimes) => {
      const newFinalTimes = [...prevFinalTimes];
      newFinalTimes[rowIndex] = 0; // Store timeout as 00:00

      // Persist finalTimes in localStorage
      localStorage.setItem("finalTimes", JSON.stringify(newFinalTimes));

      return newFinalTimes;
    });

    // Update rowStatus to "ended"
    setRowStatus((prevStatus) => {
      const newStatus = [...prevStatus];
      newStatus[rowIndex] = "ended";
      // Persist rowStatus
      localStorage.setItem(`${pageMode}-rowStatus`, JSON.stringify(newStatus));
      return newStatus;
    });
    playAlarm();
    // Move users back to the available list (only if it's the timed mode)
    setUsers([...users, ...rows[rowIndex]]);
  };

  // Function to manually end a row (before 00:00)
  const endRow = (rowIndex) => {
    clearInterval(timerRefs.current[rowIndex]); // Stop timer

    setFinalTimes((prevFinalTimes) => {
      const newFinalTimes = [...prevFinalTimes];
      newFinalTimes[rowIndex] = timers[rowIndex]; // Store last recorded time
      localStorage.setItem("finalTimes", JSON.stringify(newFinalTimes));
      return newFinalTimes;
    });

    setRowStatus((prevStatus) => {
      const newStatus = [...prevStatus];
      newStatus[rowIndex] = "ended";
      return newStatus;
    });
    playAlarm();
    // Move users back to the left list
    setUsers([...users, ...rows[rowIndex]]);
  };

  // Function to add a new row
  const addNewRow = () => {
    setRows([...rows, Array(4).fill(null)]);
    setRowStatus([...rowStatus, "waiting"]);
    setTimers([...timers, 20 * 60]); 
    setFinalTimes(finalTimes ? [...finalTimes, null] : [null]);
  };

  // Convert time in seconds to MM:SS format
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Function to play an alarm when time reaches 0
  const playAlarm = () => {
    const audio = new Audio("https://www.soundjay.com/button/beep-07.wav");
    audio.play();
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

            {/* Timer Display */}
            <h3 className="timer-display">
              {console.log(rowIndex, finalTimes[rowIndex])}
              {console.log("here")}⏳{" "}
              {formatTime(finalTimes?.[rowIndex] ?? timers[rowIndex] ?? 0)}
            </h3>

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
            {rowStatus[rowIndex] === "started" && timers[rowIndex] > 0 && (
              <>
                <button
                  onClick={() => restartTimer(rowIndex)}
                  className="restart-button"
                >
                  Restart
                </button>
                <button onClick={() => endRow(rowIndex)} className="end-button">
                  End
                </button>
              </>
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