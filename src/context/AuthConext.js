import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import {
    auth, firestore, googleProvider, storage,
} from '../services/firebase';

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

    async function changeUsername(username) {
        // Check if username is not blank
        if (!username || username.trim().length === 0) throw new Error('Username empty');

        // Check if username is equal to current username
        if (username === currentUserInfo.username) throw new Error('Username not changed');

        // Check if username is unique
        const querySnapshot = await firestore
            .collection('users')
            .where('username', '==', username)
            .get();

        if (querySnapshot.empty) {
            // Change username of current user as its unique
            firestore
                .collection('users')
                .doc(currentUser.uid)
                .set(
                    {
                        username,
                    },
                    { merge: true },
                )
                .then(null, () => {
                    throw new Error('Cant create username');
                });
        } else {
            // Username not unique throw error
            throw new Error('Username already exists');
        }
    }

    function changeName(name) {
        // Check if username is equal to current username
        if (name === currentUserInfo.name) throw new Error('Username not changed');

        // Update name
        firestore
            .collection('users')
            .doc(currentUser.uid)
            .set(
                {
                    name,
                },
                { merge: true },
            )
            .then(null, () => {
                throw new Error('Cant change name');
            });
    }

    function changeBio(bio) {
        // Check if username is equal to current username
        if (bio === currentUserInfo.bio) throw new Error('Bio not changed');

        // Update bio
        firestore
            .collection('users')
            .doc(currentUser.uid)
            .set(
                {
                    bio,
                },
                { merge: true },
            )
            .then(null, () => {
                throw new Error('Cant change bio');
            });
    }

    function changeEmail(email) {
        const updateEmailPromise = currentUser.updateEmail(email);
        updateEmailPromise.then(null, (error) => {
            if (error.code === 'auth/requires-recent-login') {
                // TODO Get user to log in again to change email
            }
            throw new Error(error.message);
        });
    }

    function changeProfilePic(image) {
        // Check if image is empty
        if (!image) throw new Error('Image is empty');
        // Check if file is image
        if (image.type !== 'image/png' && image.type !== 'image/jpeg') throw new Error('Profile picture is not an image');

        const filename = `users/${currentUser.uid}/${uuidv4()}`;
        const uploadTask = storage.ref(filename).put(image);

        uploadTask.on(
            'state_changed',
            null,
            (error) => {
                throw new Error(error);
            },
            () => {
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    // Update profile pic url in DB
                    firestore
                        .collection('users')
                        .doc(currentUser.uid)
                        .set(
                            {
                                profile_pic: downloadURL,
                            },
                            { merge: true },
                        )
                        .then(null, () => {
                            throw new Error('Cant change profile picture');
                        });
                });
            },
        );
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
        changeUsername,
        changeName,
        changeBio,
        changeEmail,
        changeProfilePic,
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
    children: PropTypes.element.isRequired,
};
