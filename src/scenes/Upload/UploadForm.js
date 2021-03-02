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

        const filename = `users/${currentUser.uid}/${uuidv4()}`;
        const uploadTask = storage.ref(filename).put(image);

        // Function which is run when upload task is complete
        const complete = async () => {
            // Get url of image
            const url = await storage.ref(filename).getDownloadURL();

            // Upload post to DB
            firestore
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
        };

        // Set callbacks for uploading task
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                setProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
            },
            (error) => { console.log(error); },
            () => complete(),
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
