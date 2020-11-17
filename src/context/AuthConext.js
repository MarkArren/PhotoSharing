import React, { useState, useEffect, useContext } from 'react';
import { auth, googleProvider } from '../services/firebase'

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider ({children}) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);

    // Log in user
    function login(email, password){
        return auth.signInWithEmailAndPassword(email, password);
    }

    // Log in user
    function loginWithGoogle(email, password){
        return auth.signInWithPopup(googleProvider);
    }

    // Sign up user
    function signup(email, password){
       return auth.createUserWithEmailAndPassword(email, password);
    }

    // Logout user
    function logout(){
        return auth.signOut();
    }

    function resetPassword(email){
        return auth.sendPasswordResetEmail(email);
    }

    // Sets current user after render
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
        })
    
        return unsubscribe
      }, [])

    const value = {
        currentUser,
        login,
        loginWithGoogle,
        signup,
        logout,
        resetPassword
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

