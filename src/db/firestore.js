// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";

// Your web app's Firebase configuration
function FirestoreDB() {
  const firestoreDB = {};
  const firebaseConfig = {
    apiKey: "AIzaSyC3UDi-KtH_AAnKkBdd6aIFcatjGed0coA",
    authDomain: "badminton-lining-system.firebaseapp.com",
    projectId: "badminton-lining-system",
    storageBucket: "badminton-lining-system.firebasestorage.app",
    messagingSenderId: "81991487009",
    appId: "1:81991487009:web:5a86813c9299b0e4f29d60",
  };
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  async function getUsers() {
    //const auth = getAuth(app);
    const usersSnapshot = await getDocs(collection(db, "users"));
    const usersList = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("users", usersList);
    return usersList;
  }

  async function verifyUser(email, password) {
    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return { success: false, error: "User not found." };
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      // Check password
      if (userData.password !== password) {
        return { success: false, error: "Incorrect password." };
      }

      // ✅ Return user ID and data
      return { success: true, user: { id: userDoc.id, ...userData } };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Login failed. Please try again." };
    }
  }

  async function checkInUser(userId) {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { checkedIn: true });
      return { success: true };
    } catch (error) {
      console.error("Check-in error:", error);
      return { success: false, error: "Check-in failed." };
    }
  }

  async function registerUser(name, email, password) {
    try {
      const userRef = await addDoc(collection(db, "users"), {
        name,
        email,
        password, // Note: Consider hashing passwords for security
        checkedIn: false,
      });

      return { success: true, userId: userRef.id };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        error: "Registration failed. Please try again.",
      };
    }
  }

  async function deleteUser(userId) {
    await deleteDoc(doc(db, "users", userId));
  }

  async function checkOutUser(userId) {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { checkedIn: false });
      return { success: true };
    } catch (error) {
      console.error("Check-out error:", error);
      return { success: false, error: "Check-out failed." };
    }
  }

  firestoreDB.getUsers = getUsers;
  firestoreDB.verifyUser = verifyUser;
  firestoreDB.checkInUser = checkInUser;
  firestoreDB.registerUser = registerUser;
  firestoreDB.deleteUser = deleteUser;
  firestoreDB.checkOutUser = checkOutUser;

  return firestoreDB;
}
const firestoreDB = FirestoreDB();

export default firestoreDB;
