import { db } from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

const addTodo = async ({ title, description, isCompleted }) => {
  try {
    await addDoc(collection(db, "todo"), {
      // user: userId,
      title: title,
      description: description,
      isCompleted: isCompleted,
      createdAt: new Date().getTime(),
    });
  } catch (err) {}
};

const updateTodo = async ({ docId, title, description, isCompleted }) => {
  try {
    const todoRef = doc(db, "todo", docId );
    await updateDoc(todoRef, {
      // user: userId,
      title,
      description,
      isCompleted,
      updatedAt: new Date().getTime(),
    });
  } catch (err) {}
};

const toggleTodoStatus = async ({ docId, isCompleted }) => {
  try {
    const todoRef = doc(db, "todo", docId);
    await updateDoc(todoRef, {
      isCompleted,
    });
  } catch (err) {
    console.log(err);
  }
};

const deleteTodo = async (docId) => {
  try {
    const todoRef = doc(db, "todo", docId);
    await deleteDoc(todoRef);
  } catch (err) {
    console.log(err);
  }
};

export { addTodo, toggleTodoStatus,updateTodo, deleteTodo };
