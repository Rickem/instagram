import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBVpgjwQ4-coRNAgPPNmkWPr0vvs5kr2pk",
  authDomain: "secret-dawa.firebaseapp.com",
  projectId: "secret-dawa",
  storageBucket: "secret-dawa.appspot.com",
  messagingSenderId: "91490486034",
  appId: "1:91490486034:web:9b49b1e696a1bb33aed5cb",
  measurementId: "G-EF21C4P4VY"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const firestore = getFirestore();
const storage = getStorage();

export { app, firestore, storage };