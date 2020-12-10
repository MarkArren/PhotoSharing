import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyC6LhdFmXPlyx4_G4Ud53msX6t2Czec78A',
    authDomain: 'ce301-capstone.firebaseapp.com',
    databaseURL: 'https://ce301-capstone.firebaseio.com',
    projectId: 'ce301-capstone',
    storageBucket: 'ce301-capstone.appspot.com',
    messagingSenderId: '1037690889099',
    appId: '1:1037690889099:web:5f7255377559627bd7858e',
    measurementId: 'G-HJHXR1WT5H',
};
// Initialize Firebase

const app = firebase.initializeApp(firebaseConfig);
// firebase.analytics();

export const auth = app.auth();

export const firestore = app.firestore();
export const storage = app.storage();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export default app;
