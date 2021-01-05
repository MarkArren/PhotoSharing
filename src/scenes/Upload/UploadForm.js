import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { firestore, storage } from '../../services/firebase';
import { useAuth } from '../../context/AuthConext';

const UploadForm = () => {
    const { currentUser } = useAuth();
    const { currentUserInfo } = useAuth();
    const [image, setImage] = useState(null);
    const [caption, setCaption] = useState('');
    const [progress, setProgress] = useState(0);

    const handleSubmit = (e) => {
        if (!currentUser) {
            window.location.reload();
        } else if (!image) {
            return;
        }
        console.log(currentUser);

        const filename = `users/${currentUser.uid}/${uuidv4()}`;
        const uploadTask = storage.ref(filename).put(image);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                setProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
            },
            (error) => {
                console.log(error);
            },
            () => {
                storage
                    .ref(filename)
                    .getDownloadURL()
                    .then((url) => {
                        console.log(url);
                        // Creates post with url
                        firestore
                            .collection('users')
                            .doc(currentUser.uid)
                            .collection('posts')
                            .add({
                                url,
                                caption,
                                timestamp: new Date(),
                            })
                            .then((doc) => {
                                console.log('sucessfully written to user posts');

                                // TODO Client side fan out of data to all users feed
                                const { id } = doc;
                                console.log(doc);
                                // Get all users
                                firestore
                                    .collection('users')
                                    .get()
                                    .then((users) => {
                                        if (!users.empty) {
                                            // Loop through all users
                                            users.forEach((userDoc) => {
                                                const user = userDoc.data();
                                                console.log(user);
                                                console.log(userDoc);

                                                // Add post to each users feed collection
                                                firestore
                                                    .collection('users')
                                                    .doc(userDoc.id)
                                                    .collection('feed')
                                                    .doc(id)
                                                    .set({
                                                        caption,
                                                        post: doc,
                                                        url,
                                                        user: {
                                                            username: currentUserInfo.username,
                                                            name: currentUserInfo.name,
                                                            uid: currentUser.uid,
                                                        },
                                                        commentCount: 0,
                                                        likeCount: 0,
                                                        hasLiked: false,
                                                        topComments: [],
                                                        timestamp: new Date(),
                                                    });
                                            });
                                        }
                                    });
                            });
                    });
            },
        );

        e.preventDefault();
    };

    return (
        <form onSubmit={handleSubmit}>
            <progress value={progress} max='100' />
            <input
                type='text'
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder='Enter Caption'
            />
            <input
                type='file'
                className='comment'
                onChange={(e) => {
                    if (e.target.files[0]) setImage(e.target.files[0]);
                }}
            />
            <button type='submit'>Upload</button>
        </form>
    );
};

export default UploadForm;
