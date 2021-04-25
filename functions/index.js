const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();
const bucket = admin.storage().bucket();

/**
 * Creates user account with default stats
 */
exports.createUser = functions.auth.user().onCreate((event) => {
    const user = event.data;

    console.log(`Creating document in db for user ${user.uid}`);
    db.collection('users').doc(user.uid).set({
        bio: '',
        followers: 0,
        following: 0,
        likes: 0,
        posts: 0,
        profile_pic: '',
        uid: user.uid,
        createdOn: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
});

/**
 * Updates user profile
 */
exports.updateProfile = functions.https.onRequest((request, response) => {
    db.collection('users').doc(request.user.uid).set({
        bio: '',
        name: '',
        username: '',
        profile_pic: '',
        uid: request.user.uid,
        createdOn: admin.firestore.FieldValue.serverTimestamp(),
    });
});

/**
 * Remove user from database when account is deleted
 */
exports.deleteUser = functions.auth.user().onDelete((user) => {
    // TODO Delete users posts from storage bucket
    db.doc(`users/${user.uid}`).delete().then(() => {
        console.log(`Deleted user ${user.uid} from db`);
    });
});

/**
 * Sends a notification to a user
 * @param {number} type 0=following, 1=like, 2=Comment
 * @param {string} toUID UID of user recieving notification
 * @param {string} idToken ID token of logged in user
 * @param {post} post (If type>0) post regarding notification
 * @param {boolean} remove Sets if removing notification
 *
 */
exports.sendNotification = functions.https.onRequest(async (req, res) => {
    // Set CORS headers for preflight requests
    // Allows GETs from any origin with the Content-Type header
    // and caches preflight response for 3600s
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
    }

    let type;
    let idToken;
    let toUID;
    let post;
    let remove;

    ({
        // eslint-disable-next-line prefer-const
        type, toUID, idToken, post, remove = false,
    } = req.body);

    // functions.logger.info('Hello logs!', { structuredData: true });
    // const {
    //     type, toUID, idToken, post, remove = false,
    // } = req.body;

    console.log('Parsed variables:');
    console.log(type, toUID, idToken, post, remove);

    // Check if required varaibles are satisfied
    if (type == null || toUID == null || idToken == null) {
        // console.log('test', type, toUID, idToken, post, remove);
        console.log('error not all variables');
        res.status(422).send('ERROR: Not all varaibles are satisifed');
        return;
    }

    if (type === 1 && (post.id == null)) {
        console.log('error not all variables for specific type');
        res.status(422).send('ERROR: Not all varaibles are satisifed for post.id');
    }

    const notifCollection = db.collection(`users/${toUID}/notifications`);

    // Gets user from their user token
    const fromUID = await admin.auth().verifyIdToken(idToken);
    const userDoc = await db.doc(`users/${fromUID.uid}`).get();
    if (!userDoc.exists) {
        console.error(`ERROR: User doc does not exists - ${fromUID.uid}`);
        res.status(400).send('ERROR: User doc does not exists');
        return;
    }

    // Extract only required information from user
    const user = (({
        // eslint-disable-next-line camelcase
        name, username, profile_pic,
    }) => ({
        name, username, profile_pic,
    }))(userDoc.data());

    // Set user uid and check undfefined profile pic
    user.uid = fromUID.uid;
    if (user.profile_pic == null) user.profile_pic = '';

    console.log('Got user info:');
    console.log(fromUID.uid, user.name, user.username, user.profile_pic);

    if (type === 0) {
        if (remove) {
            // Remove notification
            await notifCollection.where('user.uid', '==', user.uid).where('type', '==', type).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        console.log(doc.id, ' => ', doc.data());
                        doc.ref.delete().then(() => {
                            console.log('Notifiction successfully deleted!');
                        })
                            .catch((error) => {
                                console.error('Error removing notification: ', error);
                            });
                    });
                })
                .catch((error) => {
                    console.error('Error getting notifications: ', error);
                });
        } else {
            // Add notification
            await notifCollection.add({
                type,
                user,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
            })
                .then((docRef) => {
                    console.log('Notification written with ID: ', docRef.id);
                })
                .catch((error) => {
                    console.error('Error adding notification: ', error);
                });
            console.log('sent notification for follow');
        }
    } else if (remove) {
        // Remove nofication
        await notifCollection.where('user.uid', '==', user.uid).where('type', '==', type).where('post.id', '==', post.id).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log(doc.id, ' => ', doc.data());
                    doc.ref.delete().then(() => {
                        console.log('Notifiction successfully deleted!');
                    })
                        .catch((error) => {
                            console.error('Error removing notification: ', error);
                        });
                });
            })
            .catch((error) => {
                console.error('Error getting notifications: ', error);
            });
    } else {
        console.log('sending notification');
        // Add notification
        await notifCollection.add({
            type,
            user,
            post,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
        })
            .then((docRef) => {
                console.log('Notification written with ID: ', docRef.id);
            })
            .catch((error) => {
                console.error('Error adding notification: ', error);
            });
        console.log('sent notification for others');
    }

    console.log('done');
    res.send('Success');
});

/**
 * Cloud function which fans out posts to followers feed when post is created or changed
 */
exports.createPostFeeds = functions.firestore
    .document('users/{userID}/posts/{postID}')
    .onWrite(async (change, context) => {
        // Get the new post object and set the postID
        const newPost = change.after.data();

        // Parameters
        const { userID, postID } = context.params;

        // Create batch array to bypass 500 batch write limit
        const batchArray = [];
        batchArray.push(db.batch());
        let operationCounter = 0;
        let batchIndex = 0;

        // Adding additional data to new posts
        if (!change.before.exists) {
            newPost.hasLiked = false;
        }
        console.log(`new post being fanned out: ${postID}`);

        // Get all the users followers
        const followerRefs = await db.collection(`users/${userID}/followers`).get();

        followerRefs.docs.forEach((doc) => {
            console.log(`Adding to user feed: ${doc.id}`);
            const followerID = doc.id;
            const followerFeedRef = db.doc(`users/${followerID}/feed/${postID}`);

            if (!change.after.exists && change.before.exists) {
                // Check for delete
                batchArray[batchIndex].delete(followerFeedRef);
            } else {
                // Not deleting so use set
                batchArray[batchIndex].set(followerFeedRef, newPost);
            }

            // Split write batches if over 500
            operationCounter += 1;
            if (operationCounter === 499) {
                batchArray.push(db.batch());
                batchIndex += 1;
                operationCounter = 0;
            }
        });
        // Execute batch write
        batchArray.forEach((batch) => batch.commit());

        if (!change.after.exists && change.before.exists) {
            // Delete post from users own feed
            db.doc(`users/${userID}/feed/${postID}`).delete();

            // Get refence of image from URL
            const splitURL = change.before.data().url.split('/');
            let ref = unescape(splitURL[splitURL.length - 1]);
            // eslint-disable-next-line prefer-destructuring
            ref = ref.split('?')[0];

            // Delete image from storage bucket
            return bucket.file(ref).delete();
        }
        // Set post in users own feed
        return db.doc(`users/${userID}/feed/${postID}`).set(newPost);
    });

/**
 * When following/unfollowing a user add/remove their posts to/from your feed
 */
exports.followUserFeed = functions.firestore
    .document('users/{userID}/following/{followingID}')
    .onWrite(async (change, context) => {
        // Parameters
        const { userID, followingID } = context.params;

        // Create batch array to bypass 500 batch write limit
        const batchArray = [];
        batchArray.push(db.batch());
        let operationCounter = 0;
        let batchIndex = 0;

        // Check if following or unfollowing
        if (!change.after.exists && change.before.exists) {
            // UNFOLLOWING
            const feedCollectionRef = db.collection(`users/${userID}/feed`);
            const followingPosts = await feedCollectionRef.where('user.uid', '==', followingID).get();

            // Delete all posts from feed
            followingPosts.forEach((doc) => {
                batchArray[batchIndex].delete(doc.ref);

                // Split write batches if over 500
                operationCounter += 1;
                if (operationCounter === 499) {
                    batchArray.push(db.batch());
                    batchIndex += 1;
                    operationCounter = 0;
                }
            });
            // Execute batch delete
            batchArray.forEach((batch) => batch.commit());
        } else {
            // FOLLOWING
            // Get all following users posts
            const followingPostsRef = await db.collection(`users/${followingID}/posts`).get();

            // Add all of following users post to own users feed
            followingPostsRef.forEach((doc) => {
                const postID = doc.id;
                const usersFeedRef = db.doc(`users/${userID}/feed/${postID}`);

                batchArray[batchIndex].set(usersFeedRef, doc.data());

                // Split write batches if over 500
                operationCounter += 1;
                if (operationCounter === 499) {
                    batchArray.push(db.batch());
                    batchIndex += 1;
                    operationCounter = 0;
                }
            });
            // Execute batch write
            batchArray.forEach((batch) => batch.commit());
        }
    });

// Could be a bottleneck when there are a lot of likes
// Could use distrubuted counters
exports.updateLikeCount = functions.firestore
    .document('users/{userID}/posts/{postID}/likes/{likeID}')
    .onWrite((change, context) => {
        if (!change.before.exists) {
            // New like created : add one to count
            db.doc(`users/${context.params.userID}`)
                .doc(`/posts/${context.params.postID}`)
                .update({ likeCount: db.FieldValue.increment(1) });
        } else if (change.before.exists && change.after.exists) {
            // Updating existing document : Do nothing

        } else if (!change.after.exists) {
            // Like deleted : subtract one from count
            db.doc(`users/${context.params.userID}`)
                .doc(`/posts/${context.params.postID}`)
                .update({ likeCount: db.FieldValue.increment(-1) });
        }
    });

/**
 * Cloud function which fans out stories to followers story feed when a story is created or changed
 */
exports.fanOutStory = functions.firestore
    .document('users/{userID}/stories/{storyID}')
    .onWrite(async (change, context) => {
        // Get the new story object and set the storyID
        const newStory = change.after.data();

        // Parameters
        const { userID, storyID } = context.params;

        // Create batch array to bypass 500 batch write limit
        const batchArray = [];
        batchArray.push(db.batch());
        let operationCounter = 0;
        let batchIndex = 0;

        // Adding additional data to new story
        if (!change.before.exists) {
            newStory.hasViewed = false;
        }
        console.log(`new story being fanned out: ${storyID}`);

        // Get all the users followers
        const followerRefs = await db.collection(`users/${userID}/followers`).get();

        followerRefs.docs.forEach((doc) => {
            console.log(`Adding to users story feed: ${doc.id}`);
            const followerID = doc.id;
            const followerStoryFeedRef = db.doc(`users/${followerID}/storyFeed/${storyID}`);

            if (!change.after.exists && change.before.exists) {
                // Check for delete
                batchArray[batchIndex].delete(followerStoryFeedRef);
            } else {
                // Not deleting so use set
                batchArray[batchIndex].set(followerStoryFeedRef, newStory);
            }

            // Split write batches if over 500
            operationCounter += 1;
            if (operationCounter === 499) {
                batchArray.push(db.batch());
                batchIndex += 1;
                operationCounter = 0;
            }
        });
        // Execute batch write
        batchArray.forEach((batch) => batch.commit());

        if (!change.after.exists && change.before.exists) {
            // Delete story from users own story feed
            db.doc(`users/${userID}/storyFeed/${storyID}`).delete();

            // Get refence of image from URL
            const splitURL = change.before.data().url.split('/');
            let ref = unescape(splitURL[splitURL.length - 1]);
            // eslint-disable-next-line prefer-destructuring
            ref = ref.split('?')[0];

            // Delete image from storage bucket
            return bucket.file(ref).delete();
        }
        // Set story in users own story feed
        return db.doc(`users/${userID}/storyFeed/${storyID}`).set(newStory);
    });

/**
 * When following/unfollowing a user add/remove their stories to/from your feed
 */
exports.followUserStoryFeed = functions.firestore
    .document('users/{userID}/following/{followingID}')
    .onWrite(async (change, context) => {
        // Parameters
        const { userID, followingID } = context.params;

        // Create batch array to bypass 500 batch write limit
        const batchArray = [];
        batchArray.push(db.batch());
        let operationCounter = 0;
        let batchIndex = 0;

        // Check if following or unfollowing
        if (!change.after.exists && change.before.exists) {
            // UNFOLLOWING
            const feedCollectionRef = db.collection(`users/${userID}/storyFeed`);
            const followingStories = await feedCollectionRef.where('user.uid', '==', followingID).get();

            // Delete all posts from story feed
            followingStories.forEach((doc) => {
                batchArray[batchIndex].delete(doc.ref);

                // Split write batches if over 500
                operationCounter += 1;
                if (operationCounter === 499) {
                    batchArray.push(db.batch());
                    batchIndex += 1;
                    operationCounter = 0;
                }
            });
            // Execute batch delete
            batchArray.forEach((batch) => batch.commit());
        } else {
            // FOLLOWING
            // Get all following users stories
            const followingStoriesRef = await db.collection(`users/${followingID}/stories`).get();

            // Add all of following users stories to own users feed
            followingStoriesRef.forEach((doc) => {
                const storyID = doc.id;
                const usersStoryFeedRef = db.doc(`users/${userID}/storyFeed/${storyID}`);

                batchArray[batchIndex].set(usersStoryFeedRef, doc.data());

                // Split write batches if over 500
                operationCounter += 1;
                if (operationCounter === 499) {
                    batchArray.push(db.batch());
                    batchIndex += 1;
                    operationCounter = 0;
                }
            });
            // Execute batch write
            batchArray.forEach((batch) => batch.commit());
        }
    });
