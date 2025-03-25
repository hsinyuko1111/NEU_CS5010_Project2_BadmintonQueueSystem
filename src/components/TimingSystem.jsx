import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import "../assets/style/style.css";
import firestoreDB from "../db/fireStore";

const DEFAULT_TIMER = 20 * 60; // 20 minutes in seconds
const DEFAULT_AUDIO_URL =
  "https://codeskulptor-demos.commondatastorage.googleapis.com/descent/gotitem.mp3";

export default function TimingSystem() {
  const pageMode = useMemo(
    () => (window.location.pathname.includes("timer") ? "timer" : "match"),
    [],
  );

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
  const [startTimes, setStartTimes] = useState(
    () => JSON.parse(localStorage.getItem("startTimes")) || [],
  );
  const [finalTimes, setFinalTimes] = useState(
    () => JSON.parse(localStorage.getItem("finalTimes")) || [],
  );
  const [timers, setTimers] = useState(() => {
    try {
      const savedStartTimes =
        JSON.parse(localStorage.getItem("startTimes")) || [];
      const savedRowStatus =
        JSON.parse(localStorage.getItem(`${pageMode}-rowStatus`)) || [];

      return savedStartTimes.map((start, index) => {
        if (start && savedRowStatus[index] === "started") {
          const elapsed = Math.floor((Date.now() - start) / 1000);
          return Math.max(DEFAULT_TIMER - elapsed, 0);
        }
        return DEFAULT_TIMER;
      });
    } catch (error) {
      console.error("Error loading timers from localStorage:", error);
      return [DEFAULT_TIMER];
    }
  });

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const timerRefs = useRef([]);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(`${pageMode}-rows`, JSON.stringify(rows));
  }, [rows, pageMode]);

  useEffect(() => {
    localStorage.setItem(`${pageMode}-rowStatus`, JSON.stringify(rowStatus));
  }, [rowStatus, pageMode]);

  useEffect(() => {
    localStorage.setItem("startTimes", JSON.stringify(startTimes));
  }, [startTimes]);

  useEffect(() => {
    localStorage.setItem("finalTimes", JSON.stringify(finalTimes));
  }, [finalTimes]);

  // On mount, resume running timers
  useEffect(() => {
    timers.forEach((time, index) => {
      if (time > 0 && rowStatus[index] === "started") {
        startTimer(index, startTimes[index]);
      }
    });
  }, []);

  const handleTimeout = useCallback(
    (rowIndex) => {
      setFinalTimes((prev) => {
        const updated = [...prev];
        updated[rowIndex] = 0;
        return updated;
      });
      setRowStatus((prev) => {
        const updated = [...prev];
        updated[rowIndex] = "ended";
        return updated;
      });
      setStartTimes((prev) => {
        const updated = [...prev];
        updated[rowIndex] = null;
        return updated;
      });
      playAlarm();
      setUsers((prev) => [...prev, ...rows[rowIndex]]);
    },
    [rows],
  );

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

  useEffect(() => {
    getCheckedInUsers();
  }, [getCheckedInUsers]);

  const startTimer = useCallback(
    (rowIndex, startTime) => {
      if (timerRefs.current[rowIndex]) {
        clearInterval(timerRefs.current[rowIndex]);
      }

      timerRefs.current[rowIndex] = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const newTime = Math.max(DEFAULT_TIMER - elapsed, 0);

        setTimers((prev) => {
          const updated = [...prev];
          updated[rowIndex] = newTime;
          if (newTime === 0) {
            clearInterval(timerRefs.current[rowIndex]);
            handleTimeout(rowIndex);
          }
          return updated;
        });
      }, 1000);
    },
    [handleTimeout],
  );

  const moveToRow = useCallback(
    (rowIndex) => {
      if (!selectedUser || rowStatus[rowIndex] !== "waiting") return;

      const emptyIndex = rows[rowIndex].findIndex((slot) => slot === null);
      if (emptyIndex !== -1) {
        setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
        setRows((prev) => {
          const newRows = [...prev];
          newRows[rowIndex] = [...newRows[rowIndex]];
          newRows[rowIndex][emptyIndex] = selectedUser;
          return newRows;
        });
        setSelectedUser(null);
      }
    },
    [selectedUser, rowStatus, rows],
  );

  const moveBackToList = useCallback(
    (rowIndex, slotIndex) => {
      if (rowStatus[rowIndex] !== "waiting") return;

      const user = rows[rowIndex][slotIndex];
      if (user) {
        setRows((prev) => {
          const newRows = [...prev];
          newRows[rowIndex] = [...newRows[rowIndex]];
          newRows[rowIndex][slotIndex] = null;
          return newRows;
        });
        setUsers((prev) => [...prev, user]);
      }
    },
    [rowStatus, rows],
  );

  const startRow = useCallback(
    (rowIndex) => {
      if (rows[rowIndex].every((slot) => slot !== null)) {
        const now = Date.now();
        setRowStatus((prev) => {
          const newStatus = [...prev];
          newStatus[rowIndex] = "started";
          return newStatus;
        });
        const newStartTimes = [...startTimes];
        newStartTimes[rowIndex] = now;
        setStartTimes(newStartTimes);
        startTimer(rowIndex, now);
      }
    },
    [rows, startTimes, startTimer],
  );

  const restartTimer = useCallback(
    (rowIndex) => {
      const now = Date.now();
      const newTimers = [...timers];
      newTimers[rowIndex] = DEFAULT_TIMER;
      setTimers(newTimers);

      const newStartTimes = [...startTimes];
      newStartTimes[rowIndex] = now;
      setStartTimes(newStartTimes);

      startTimer(rowIndex, now);
    },
    [timers, startTimes, startTimer],
  );

  const endRow = useCallback(
    (rowIndex) => {
      clearInterval(timerRefs.current[rowIndex]);
      setFinalTimes((prev) => {
        const updated = [...prev];
        updated[rowIndex] = timers[rowIndex];
        return updated;
      });
      setRowStatus((prev) => {
        const updated = [...prev];
        updated[rowIndex] = "ended";
        return updated;
      });
      setStartTimes((prev) => {
        const updated = [...prev];
        updated[rowIndex] = null;
        return updated;
      });
      playAlarm();
      setUsers((prev) => [...prev, ...rows[rowIndex]]);
    },
    [timers, rows],
  );

  const addNewRow = useCallback(() => {
    setRows((prev) => [...prev, Array(4).fill(null)]);
    setRowStatus((prev) => [...prev, "waiting"]);
    setTimers((prev) => [...prev, DEFAULT_TIMER]);
    setFinalTimes((prev) => [...prev, null]);
  }, []);

  const playAlarm = () => {
    const audio = new Audio(DEFAULT_AUDIO_URL);
    audio.play().catch((e) => console.warn("Playback failed", e));
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div className="container">
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
            {selectedUser && rowStatus[rowIndex] === "waiting" && (
              <button
                onClick={() => moveToRow(rowIndex)}
                className="add-button"
              >
                Add {selectedUser.name} to Row {rowIndex + 1}
              </button>
            )}
            <h3 className="timer-display">
              ⏳{" "}
              {formatTime(
                rowStatus[rowIndex] === "waiting"
                  ? DEFAULT_TIMER
                  : (finalTimes?.[rowIndex] ?? timers[rowIndex] ?? 0),
              )}
            </h3>
            {rowStatus[rowIndex] === "waiting" &&
              slots.every((slot) => slot !== null) && (
                <button
                  onClick={() => startRow(rowIndex)}
                  className="start-button"
                >
                  Start
                </button>
              )}
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
        <button onClick={addNewRow} className="add-row-button">
          + Add Row
        </button>
      </div>
    </div>
  );
}
