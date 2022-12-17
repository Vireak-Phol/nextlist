import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA6TvYjnJIagnNo-PFm4x3zDDaVGd_7yWc",
  authDomain: "next-todo-list-14158.firebaseapp.com",
  databaseURL: "https://next-todo-list-14158-default-rtdb.firebaseio.com",
  projectId: "next-todo-list-14158",
  storageBucket: "next-todo-list-14158.appspot.com",
  messagingSenderId: "438306477406",
  appId: "1:438306477406:web:74743b4a7859e0a51bebcf",
  measurementId: "G-FSY7QZ69NC"
};

// authDomain: "next-todo-list-14158.firebaseapp.com",
// authDomain: "todo-list-woad-alpha.vercel.app",

const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
const db = getFirestore(app);

export {db };
