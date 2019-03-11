import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import constants from "./constants";
firebase.initializeApp(constants.firebaseConfig);

// firebase utils
const db = firebase.firestore();
const auth = firebase.auth();
const currentUser = auth.currentUser;

// firebase collections
const personCollection = db.collection("persons");
const expenseCollection = db.collection("expenses");
const settings = db.collection("settings");
const photos = db.collection("photos");

export default {
  db,
  auth,
  currentUser,
  personCollection,
  expenseCollection,
  settings,
  photos
};
