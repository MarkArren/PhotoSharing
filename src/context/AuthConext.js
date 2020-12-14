import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { auth, firestore, googleProvider } from '../services/firebase';

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [currentUserInfo, setCurrentUserInfo] = useState();
    const [loading, setLoading] = useState(true);

    // Log in user
    function login(email, password) {
        return auth.signInWithEmailAndPassword(email, password);
    }

    // Log in user
    function loginWithGoogle() {
        return auth.signInWithPopup(googleProvider).then((user) => {
            // Create user after google sign in
            if (user) {
                console.log(user);
                // If user is new then create user in database
                if (user.additionalUserInfo.isNewUser) {
                    firestore
                        .collection('users')
                        .doc(user.user.uid)
                        .set({
                            username: user.user.uid,
                            name: user.user.uid,
                        })
                        .then(null, () => {
                            throw new Error('Cant create username');
                        });
                }
            } else {
                throw new Error('Promise did not return user');
            }
        });
    }

    // Sign up user
    async function signup(email, password, username, name) {
        // Check if username is unique
        const querySnapshot = await firestore
            .collection('users')
            .where('username', '==', username)
            .get();

        if (querySnapshot.empty) {
            // Create user as username is unique
            const user = await auth.createUserWithEmailAndPassword(email, password);

            // Create user in database
            if (user) {
                firestore
                    .collection('users')
                    .doc(user.user.uid)
                    .set({
                        username,
                        name,
                    })
                    .then(null, () => {
                        throw new Error('Cant create username');
                    });
            }
        } else {
            // Username not unique throw error
            throw new Error('Username already exists');
        }
    }

    // Logout user
    function logout() {
        return auth.signOut();
    }

    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email);
    }

    function getAdditionalUserInfo(user) {
        return firestore
            .collection('users')
            .doc(user.uid)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    setCurrentUserInfo(doc.data());
                }
            });
    }

    // Sets current user after render
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
            // Get additional user info (username, name)
            if (user) getAdditionalUserInfo(user);
            else setCurrentUserInfo();
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        currentUserInfo,
        login,
        loginWithGoogle,
        signup,
        logout,
        resetPassword,
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
    children: PropTypes.element.isRequired,
};
