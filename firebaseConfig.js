import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDst2RrpjGjJlxQy6deZ-XSx6vfpA5hKns",
    authDomain: "dryhaven-4e771.firebaseapp.com",
    databaseURL: "https://dryhaven-4e771-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "dryhaven-4e771",
    storageBucket: "dryhaven-4e771.appspot.com",
    messagingSenderId: "867317549986",
    appId: "1:867317549986:web:ee2db9d74be84adf1dc0fb",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };