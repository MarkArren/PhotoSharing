import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import {
    auth, firestore, googleProvider, storage,
} from '../services/firebase';
import { updatePostsAndStories } from '../FirebaseHelper';

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [currentUserInfo, setCurrentUserInfo] = useState();
    const [loading, setLoading] = useState(true);

    /**
     * Logs in user
     * @param {string} email Email
     * @param {string} password Password
     * @returns Promise
     */
    function login(email, password) {
        return auth.signInWithEmailAndPassword(email, password);
    }

    /**
     * Logs in user with google
     */
    async function loginWithGoogle() {
        const user = await auth.signInWithPopup(googleProvider).catch((error) => {
            throw new Error('Failed to signin', error);
        });

        // Checks if user is new user to add them to the database
        if (user.additionalUserInfo.isNewUser) {
            await firestore.collection('users').doc(user.user.uid)
                .set({
                    username: user.user.uid,
                    name: user.user.uid,
                })
                .catch(() => {
                    throw new Error('Failed to create user document');
                });
        }
    }

    /**
     * Signs up user with the parameters
     * @param {String} email Email
     * @param {String} password Password
     * @param {String} username Username
     * @param {String} name Name
     */
    async function signup(email, password, username, name) {
        // Check if username is unique
        const querySnapshot = await firestore
            .collection('users')
            .where('username', '==', username)
            .get();

        // Username not unique so throw error
        if (!querySnapshot.empty) {
            throw new Error('Username already exists');
        }

        // Create user as username is unique
        const user = await auth.createUserWithEmailAndPassword(email, password).catch((e) => {
            throw new Error(e.message);
        });

        // Create user in database
        firestore.collection('users').doc(user.user.uid)
            .set({
                username,
                name,
            })
            .catch(() => {
                throw new Error('Failed to create user document');
            });
    }

    /**
     * Changes username of user
     * @param {String} username Username
     */
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

        if (!querySnapshot.empty) {
            // Username not unique throw error
            throw new Error('Username already exists');
        }

        // Change username of current user as its unique
        await firestore
            .collection('users')
            .doc(currentUser.uid)
            .set({ username }, { merge: true })
            .catch((error) => {
                throw new Error('Failed to change username in document', error);
            });

        // Change username in currentUserInfo
        const newCurrentUserInfo = currentUserInfo;
        newCurrentUserInfo.username = username;
        setCurrentUserInfo(newCurrentUserInfo);

        // Update users posts to match
        await updatePostsAndStories(currentUser);
    }

    /**
     * Changes name of user
     * @param {String} name Name
     */
    async function changeName(name) {
        // Check if name is equal to current name
        if (name === currentUserInfo.name) throw new Error('Username not changed');

        // Update name
        await firestore
            .collection('users')
            .doc(currentUser.uid)
            .set({ name }, { merge: true })
            .catch(() => {
                throw new Error('Cant change name');
            });

        // Change name in currentUserInfo
        const newCurrentUserInfo = currentUserInfo;
        newCurrentUserInfo.name = name;
        setCurrentUserInfo(newCurrentUserInfo);

        // Update users posts to match
        await updatePostsAndStories(currentUser);
    }

    /**
     * Changes user bio
     * @param {String} bio Bio
     */
    async function changeBio(bio) {
        // Check if username is equal to current username
        if (bio === currentUserInfo.bio) throw new Error('Bio not changed');

        // Update bio
        await firestore
            .collection('users')
            .doc(currentUser.uid)
            .set({ bio }, { merge: true })
            .catch(() => {
                throw new Error('Failed to change bio in document');
            });

        // Change bio in currentUserInfo
        const newCurrentUserInfo = currentUserInfo;
        newCurrentUserInfo.bio = bio;
        setCurrentUserInfo(newCurrentUserInfo);
    }

    /**
     * Changes user email
     * @param {String} email
     * @returns
     */
    function changeEmail(email) {
        return currentUser.updateEmail(email).catch((error) => {
            if (error.code === 'auth/requires-recent-login') {
                // TODO Get user to log in again to change email
            }
            throw new Error(error.message);
        });
    }

    /**
     * Changes user profile picture
     * @param {File} image Profile picture
     */
    async function changeProfilePic(image) {
        // Check if image is empty and is an image
        if (!image) throw new Error('Image is empty');
        if (image.type !== 'image/png' && image.type !== 'image/jpeg') {
            throw new Error('Profile picture is not an image');
        }

        // Uploads image to storage with the filename
        const filename = `users/${currentUser.uid}/${uuidv4()}`;
        const uploadTask = storage.ref(filename).put(image);

        uploadTask.on('state_changed',
            // Handles progress
            null,
            // Handle error
            () => {
                throw new Error('Failed to upload image to storage');
            },
            // Handle successful upload
            async () => {
                // Get download url of image
                const downloadURL = await uploadTask.snapshot.ref.getDownloadURL().catch(() => {
                    throw new Error('Failed to get download url');
                });

                // Set profile pic to download url in documents
                await firestore.collection('users').doc(currentUser.uid)
                    .set({ profile_pic: downloadURL }, { merge: true })
                    .catch(() => {
                        throw new Error('Failed to set profile picture in document');
                    });

                // Change profile_pic in currentUserInfo
                const newCurrentUserInfo = currentUserInfo;
                newCurrentUserInfo.profile_pic = downloadURL;
                setCurrentUserInfo(newCurrentUserInfo);

                // Update users posts to match
                await updatePostsAndStories(currentUser);
            });
    }

    /**
     * Signs out user
     * @returns Promise
     */
    function logout() {
        return auth.signOut();
    }

    /**
     * Resets password with email
     * @param {String} email Email
     * @returns Promise
     */
    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email);
    }

    /**
     * Sets additional user information e.g. username, bio
     * @param {User} user
     * @returns Promise
     */
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

    /**
     * Sets current user after render
     */
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
