import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { firestore, storage } from '../../services/firebase';
import { useAuth } from '../../context/AuthConext';

const UploadForm = () => {
    const { currentUser } = useAuth();
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
                            .then(() => console.log('sucessfully written to user posts'));
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
                onChange={(e) => {
                    if (e.target.files[0]) setImage(e.target.files[0]);
                }}
            />
            <button type='submit'>Upload</button>
        </form>
    );
};

export default UploadForm;
