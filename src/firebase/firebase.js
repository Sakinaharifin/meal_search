// firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCC-E_38T7iEyWf1_EyzzRZBS3ZKNixPjI",
    authDomain: "authenticationfirebase-7f2e4.firebaseapp.com",
    projectId: "authenticationfirebase-7f2e4",
    storageBucket: "authenticationfirebase-7f2e4.appspot.com",
    messagingSenderId: "575115898304",
    appId: "1:575115898304:web:4a2f09197f6e005f9c6c25"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };