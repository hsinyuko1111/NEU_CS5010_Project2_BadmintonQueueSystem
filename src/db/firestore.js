// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
//import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

  firestoreDB.getUsers = async () => {
    //const auth = getAuth(app);
    const usersSnapshot = await getDocs(collection(db, "users"));
    const usersList = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("users", usersList);
    return usersList;
  };

  return firestoreDB;
}

const firestoreDB = FirestoreDB();

export default firestoreDB;
