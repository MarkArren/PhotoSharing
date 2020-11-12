import firebase from 'firebase'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC6LhdFmXPlyx4_G4Ud53msX6t2Czec78A",
    authDomain: "ce301-capstone.firebaseapp.com",
    databaseURL: "https://ce301-capstone.firebaseio.com",
    projectId: "ce301-capstone",
    storageBucket: "ce301-capstone.appspot.com",
    messagingSenderId: "1037690889099",
    appId: "1:1037690889099:web:5f7255377559627bd7858e",
    measurementId: "G-HJHXR1WT5H"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase;
