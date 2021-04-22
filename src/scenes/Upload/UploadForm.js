import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { firestore, storage } from '../../services/firebase';
import { useAuth } from '../../context/AuthConext';
import { uploadPost } from '../../FirebaseHelper';

const UploadForm = () => {
    const { currentUser } = useAuth();
    const { currentUserInfo } = useAuth();
    const [image, setImage] = useState();
    const [caption, setCaption] = useState('');
    const [progress, setProgress] = useState(0);
    const [domId, setDomId] = useState(1231312313);
    const [errors, setErrors] = useState();

    const handleSubmit = async (e) => {
        if (!currentUser) {
            window.location.reload();
        } else if (!image) {
            console.log('no  image');

            e.preventDefault();
            return;
        }

        await uploadPost(currentUser, currentUserInfo, image, caption);

        e.preventDefault();
    };

    return (
        <form onSubmit={handleSubmit} className='upload'>
            <h3 className='title'> Upload Post</h3>
            <div className='image'>
                <img src={image ? URL.createObjectURL(image) : null} alt='' />
                <input
                    type='file'
                    id='file'
                    accept='image'
                    onChange={(e) => {
                        if (e.target.files[0]) setImage(e.target.files[0]);
                    }}
                />
                <label htmlFor='file' className='image-label'>
                    {image ? 'Change image' : 'Upload an image'}
                </label>

            </div>

            <div className='inputs'>
                <input
                    type='text'
                    rows='40'
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder='Enter Caption'
                />
            </div>

            {/* <progress className='upload-progress' value={progress} max='100' /> */}
            <button className='upload-button' type='submit'>Share</button>
        </form>
    );
};

export default UploadForm;
