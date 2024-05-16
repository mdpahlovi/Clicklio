// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB7MkoNk-M3GHPLKCsDpZyfHyE_AJVK3es",
    authDomain: "clicklio.firebaseapp.com",
    projectId: "clicklio",
    storageBucket: "clicklio.appspot.com",
    messagingSenderId: "794695788092",
    appId: "1:794695788092:web:f1bd7c94e744c7f1844539",
    measurementId: "G-E4Y4WJ6X4Z",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { app, auth, analytics };
