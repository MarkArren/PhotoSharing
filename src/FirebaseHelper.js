import { v4 as uuidv4 } from 'uuid';
import { firestore, storage } from './services/firebase';

/**
 * Send notification to firebase cloud function
 *
 * @param {user} currentUser The current user logged in
 * @param {number} type The type of notification (0=following, 1=like, 2=comment)
 * @param {number} toUID The user recieving the notification
 * @param {post} post (If type>0) The post being liked/ commented
 * @param {boolean} remove Bool to remove notification
 *
 * @return {Promise} Post request
 *
 */
export async function sendNotification(currentUser, type, toUID, post = null, remove = false) {
    // Get id token of current user
    const idToken = await currentUser.getIdToken();

    // Create body paramters
    const body = {
        type,
        toUID,
        idToken,
        remove,
    };
    if (type > 0) {
        body.post = { id: post.id, url: post.url, user: { uid: post.user.uid } };
    }

    // Set request parameters
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    };

    // Send POST request
    return fetch('https://us-central1-ce301-capstone.cloudfunctions.net/sendNotification', requestOptions)
        .then((response) => {
            if (!response.ok) {
                console.error(response);
            }
        });
}

/**
 *
 * @param {user} currentUser Current logged in user
 * @param {user} currentUserInfo Current logged in user info
 * @param {user} user User to follow
 * @param {boolean} unfollow True if user is unfollowing
 *
 * @returns {Promise} 1 = Following, 2 = Unfollowing
 */
export async function followUser(currentUser, currentUserInfo, user, unfollow = false) {
    // Check for documents which show if user already is following/ is a follower
    const followersRef = firestore.collection('users')
        .doc(user?.uid)
        .collection('followers')
        .doc(currentUser?.uid);
    const followingRef = firestore.collection('users')
        .doc(currentUser?.uid)
        .collection('following')
        .doc(user?.uid);

    try {
        const docFollowers = await followersRef.get();

        // If already following then unfollow
        if (docFollowers.exists) {
            // Check if wanted to actually unfollow
            if (!unfollow) return 1;

            await firestore.runTransaction(async (t) => {
                // Delete follow from target users profile
                t.delete(followersRef);
                // Delete following from current users profile
                t.delete(followingRef);
                // Remove follow notification
                sendNotification(currentUser, 0, user?.uid, null, unfollow);
            });
            return 2;
        }

        // Check if wanted to actually follow
        if (unfollow) return 2;

        await firestore.runTransaction(async (t) => {
            // Add follow to target users profile
            t.set(followersRef, {
                user: {
                    username: currentUserInfo.username,
                    name: currentUserInfo.name,
                    uid: currentUser.uid,
                },
                timestamp: new Date(),
            });
            // Add following to current users profile
            t.set(followingRef, {
                user: {
                    username: user.username,
                    name: user.name,
                    uid: user.uid,
                },
                timestamp: new Date(),
            });
            // Send follow notification
            sendNotification(currentUser, 0, user?.uid, null, unfollow);
        });

        return 1;
    } catch (e) {
        console.error(`Follow/ Unfollow failure: ${e.message}`);
        return -1;
    }
}

/**
 * Uploads post to users 'posts' subcollection
 * @param {user} currentUser Current logged in user
 * @param {user} currentUserInfo Current logged in user info
 * @param {file} image Image to upload
 * @param {string} caption Caption for image
 * @returns {Promise} 1
 */
export async function uploadPost(currentUser, currentUserInfo, image, caption) {
    const filename = `users/${currentUser.uid}/${uuidv4()}`;
    const uploadTask = storage.ref(filename).put(image);

    // Function which is run when upload task is complete
    const complete = async () => {
        // Get url of image
        const url = await storage.ref(filename).getDownloadURL();

        // Upload post to DB
        await firestore
            .collection('users')
            .doc(currentUser.uid)
            .collection('posts')
            .add({
                url,
                caption,
                timestamp: new Date(),
                // Extra info for feed
                user: {
                    username: currentUserInfo.username,
                    name: currentUserInfo.name,
                    uid: currentUser.uid,
                    profile_pic: currentUserInfo?.profile_pic,
                },
                commentCount: 0,
                likeCount: 0,
                topComments: [],
            });

        return 1;
    };

    // Set callbacks for uploading task
    uploadTask.on(
        'state_changed',
        (snapshot) => {
            // setProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
        },
        (error) => { console.error(error); },
        () => complete(),
    );

    return 1;
}

/**
 * Uploads story to users 'storys' subcollection
 * @param {user} currentUser Current logged in user
 * @param {user} currentUserInfo Current logged in user info
 * @param {file} image Image to upload
 * @returns {Promise} 1
 */
export async function uploadStory(currentUser, currentUserInfo, image) {
    const filename = `users/${currentUser.uid}/stories/${uuidv4()}`;
    const uploadTask = storage.ref(filename).put(image);

    // Function which is run when upload task is complete
    const complete = async () => {
        // Get url of image
        const url = await storage.ref(filename).getDownloadURL();

        // Upload story to DB
        await firestore
            .collection('users')
            .doc(currentUser.uid)
            .collection('stories')
            .add({
                url,
                timestamp: new Date(),
                // Extra info for feed
                user: {
                    username: currentUserInfo.username,
                    name: currentUserInfo.name,
                    uid: currentUser.uid,
                    profile_pic: currentUserInfo?.profile_pic,
                },
            });

        return 1;
    };

    // Set callbacks for uploading task
    return uploadTask.on(
        'state_changed',
        (snapshot) => {
            // setProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
        },
        (error) => { console.error(error); },
        () => complete(),
    );
}
