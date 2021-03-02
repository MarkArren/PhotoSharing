const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

// Create user account in db on acc creation
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

// Remove user from database when account is deleted
exports.deleteUser = functions.auth.user().onDelete((user) => {
    db.doc(`users/${user.uid}`).delete().then(() => {
        console.log(`Deleted user ${user.uid} from db`);
    });
});

// exports.uploadPost = functions.https.onRequest((request, response) => {
//     functions.logger.info("Hello logs!", {structuredData: true});
//     response.send("Hello from Firebase!");
//     // Get all users followers

//     // duplicated post to all of followers feed
// });

exports.createPostFeeds = functions.firestore
    .document('users/{userID}/posts/{postID}')
    .onWrite(async (change, context) => {
        // Get the new post object and set the postID
        const newPost = change.after.data();
        newPost.postID = context.params.postID;

        // Parameters
        const { userID, postID } = context.params;

        // Create batch array to bypass 500 batch write limit
        const batchArray = [];
        batchArray.push(db.batch());
        let operationCounter = 0;
        let batchIndex = 0;

        // Get all the users followers
        const followerRefs = await db.collection(`users/${userID}/followers`).get();

        followerRefs.docs.forEach((doc) => {
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
            return db.doc(`users/${userID}/feed/${postID}`).delete();
        }
        // Set post in users own feed
        return db.doc(`users/${userID}/feed/${postID}`).set({ newPost });
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
