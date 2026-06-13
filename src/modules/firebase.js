import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBaZsVO2k9ngD8mJtIZYFxWMHE3cXmeebg",
    authDomain: "project-alpha-lab-data.firebaseapp.com",
    databaseURL: "https://project-alpha-lab-data.firebaseio.com",
    projectId: "project-alpha-lab-data",
    storageBucket: "project-alpha-lab-data.firebasestorage.app",
    messagingSenderId: "938576337893",
    appId: "1:938576337893:web:c1b22c7a058eb3b0216d0c",
    measurementId: "G-BE2GTSGS56"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);