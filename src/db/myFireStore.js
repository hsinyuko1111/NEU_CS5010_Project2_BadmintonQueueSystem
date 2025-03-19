// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import {
//   getFirestore,
//   collection,
//   getDocs,
//   doc,
//   updateDoc,
//   query,
//   where,
// } from "firebase/firestore/lite";

// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// function MyFireStoreHandler() {
//   const myFireStore = {};
//   // Your web app's Firebase configuration
//   const firebaseConfig = {
//     apiKey: "AIzaSyA3Dwh7sk-ufzTMLZrj8ljeA1wt0Dkde8M",
//     authDomain: "doge-analyzer.firebaseapp.com",
//     projectId: "doge-analyzer",
//     storageBucket: "doge-analyzer.firebasestorage.app",
//     messagingSenderId: "10399879569",
//     appId: "1:10399879569:web:faa843f530dc01deff4a30",
//   };

//   // Initialize Firebase
//   const app = initializeApp(firebaseConfig);
//   const db = getFirestore(app);

//   // Get a list of cities from your database
//   async function getProjects() {
//     const projectsCol = collection(db, "projects");
//     const projectSnapshot = await getDocs(projectsCol);
//     console.log("projectSnapshot", projectSnapshot);

//     const projectList = projectSnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));
//     return projectList;
//   }

//   async function updateProject(projectId, project) {
//     console.log("updating project", projectId, project);
//     try {
//       const projectRef = doc(db, "projects", projectId);
//       await updateDoc(projectRef, project);
//       return { success: true };
//     } catch (error) {
//       console.error("Error updating project:", error);
//       throw error;
//     }
//   }

//   async function getAuthors() {
//     const authorsCol = collection(db, "authors");

//     const authorsSnapshot = await getDocs(authorsCol);
//     const authorsList = authorsSnapshot.docs.map((doc) => doc.data());

//     console.log("authorsList", authorsList);
//     return authorsList;
//   }

//   myFireStore.getProjects = getProjects;
//   myFireStore.updateProject = updateProject;
//   myFireStore.getAuthors = getAuthors;
//   myFireStore.db = db;

//   return myFireStore;
// }

// const myDB = new MyFireStoreHandler();

// export { myDB };
