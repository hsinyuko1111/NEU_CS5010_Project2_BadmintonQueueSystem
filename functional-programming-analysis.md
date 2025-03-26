# Functional Programming Analysis in Badminton Queue System

## Functional Programming Principles

### 1. Pure Functions

Pure functions return the same output for the same input and have no side effects.

Example from `TimingSystem.jsx`:

```javascript
const formatTime = (seconds) => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
};
```

**Why it's Pure:**

- Always produces the same output for given input
- Does not modify external state
- No side effects

**Hypothetical Break Example:**

```javascript
// Impure version that modifies external state
let timezone = "UTC";
function formatTime(seconds) {
  timezone = "Local"; // Side effect: changing external state
  return `${hours}:${minutes}`; // Inconsistent output
}
```

### 2. Immutability

Immutability ensures that data cannot be changed after creation, promoting predictable state management.

Example from `TimingSystem.jsx`:

```javascript
const moveToRow = useCallback(
  (rowIndex) => {
    if (!selectedUser || rowStatus[rowIndex] !== "waiting") return;

    // Create new arrays instead of modifying existing ones
    setUsers((prevUsers) => prevUsers.filter((u) => u.id !== selectedUser.id));
    setRows((prevRows) => {
      const newRows = [...prevRows];
      newRows[rowIndex] = [...newRows[rowIndex]];
      const emptyIndex = newRows[rowIndex].findIndex((slot) => slot === null);
      newRows[rowIndex][emptyIndex] = selectedUser;
      return newRows;
    });
  },
  [selectedUser, rowStatus, rows],
);
```

**Why it's Immutable:**

- Creates new arrays instead of mutating existing ones
- Uses functional update patterns with `prevUsers` and `prevRows`
- Preserves original state while creating new state

**Hypothetical Break Example:**

```javascript
// Mutating version that changes original state
function moveToRow(rowIndex) {
  users.splice(selectedUserIndex, 1); // Directly mutates users array
  rows[rowIndex][emptyIndex] = selectedUser; // Directly mutates rows
}
```

### 3. First-Class and Higher-Order Functions

Functions are treated as first-class citizens, can be passed as arguments, returned, and stored in variables.

Example from `TimingSystem.jsx`:

```javascript
const startTimer = useCallback(
  (rowIndex, startTime) => {
    if (timerRefs.current[rowIndex]) {
      clearInterval(timerRefs.current[rowIndex]);
    }

    // Higher-order function using setInterval
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
```

**Why it's First-Class/Higher-Order:**

- `startTimer` is a higher-order function that creates and manages an interval
- Uses `useCallback` to memoize the function
- Accepts functions as arguments (`handleTimeout`)

**Hypothetical Break Example:**

```javascript
// Restricting function as first-class citizen
function startTimer() {
  // Cannot pass timer logic as parameter
  // Tightly coupled implementation
}
```

### 4. Declarative Programming

Focus on describing WHAT should happen, not HOW it should happen.

Example from `MatchSystem.jsx`:

```javascript
const getCheckedInUsers = useCallback(async () => {
  try {
    const _users = await firestoreDB.getUsers();
    const checkedInUsers = _users.filter((user) => user.checkedIn);

    // Declaratively describing user filtering
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
```

## Array Functional Programming Methods

### 1. `.filter()`

```javascript
// Filtering checked-in users
const checkedInUsers = _users.filter((user) => user.checkedIn);
```

### 2. `.map()`

```javascript
// Extracting user IDs from active rows
const usersInActiveRows = rowsData
  .flat()
  .filter(Boolean)
  .map((user) => user.id);
```

### 3. `.findIndex()`

```javascript
const emptyIndex = rows[rowIndex].findIndex((slot) => slot === null);
```

## Design Patterns

### 1. Strategy Pattern — Game Modes

#### Proof in Code

##### Structural Similarity with Different Implementations

In `TimingSystem.jsx` and `MatchSystem.jsx`, we can see the strategy pattern in action:

```javascript
// Common pattern across both game modes
const pageMode = useMemo(
  () => (window.location.pathname.includes("timer") ? "timer" : "match"),
  [],
);

// Similar state management, but different implementations
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
```

##### Key Differences in Strategy

**Timer Mode Strategy:**

```javascript
// TimingSystem.jsx
const startTimer = useCallback(
  (rowIndex, startTime) => {
    timerRefs.current[rowIndex] = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const newTime = Math.max(DEFAULT_TIMER - elapsed, 0);

      // Countdown with fixed 20-minute timer
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
```

**Match Mode Strategy:**

```javascript
// MatchSystem.jsx
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

const endRow = useCallback(
  (rowIndex) => {
    setRowStatus((prevStatus) => {
      const newStatus = [...prevStatus];
      newStatus[rowIndex] = "ended";
      return newStatus;
    });
    playAlarm();
    setUsers((prevUsers) => [...prevUsers, ...rows[rowIndex]]);
  },
  [rows],
);
```

### 2. Memento Pattern — localStorage State Preservation

#### Proof in Code

##### State Saving Mechanism

The app uses localStorage to save and restore the app state (e.g., timers, startTimes, rowStatus) across page refreshes.

Example:
State is restored on app load and updated when players interact.

```javascript
const [timers, setTimers] = useState(() => {
  const saved = JSON.parse(localStorage.getItem("timers")) || [20 * 60];
  const startTimes = JSON.parse(localStorage.getItem("startTimes")) || [];
  return saved.map((time, i) => {
    if (startTimes[i] && rowStatus[i] === "started") {
      const elapsed = Math.floor((Date.now() - startTimes[i]) / 1000);
      return Math.max(time - elapsed, 0);
    }
    return time;
  });
});
```

### 3. Singleton Pattern

`firestoreDB` acts as a singleton for database interactions.

```javascript
import firestoreDB from "../db/fireStore";
```

## Conclusion

By applying functional programming principles, we've created a more predictable, maintainable, and scalable application. The code focuses on immutability, pure functions, and declarative programming, which reduces side effects and makes the logic easier to understand and test.
