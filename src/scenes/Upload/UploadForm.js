import React, { useState } from 'react';
import { useAuth } from '../../context/AuthConext';
import { uploadPost, uploadStory } from '../../FirebaseHelper';

const UploadForm = () => {
    const { currentUser } = useAuth();
    const { currentUserInfo } = useAuth();
    const [image, setImage] = useState();
    const [caption, setCaption] = useState('');
    const [errors, setErrors] = useState('');
    const [messages, setMessages] = useState('');

    /**
     * Handles uploading the post
     * @param {event} e Event
     * @returns {Promise}
     */
    const handleSubmit = async (e) => {
        setErrors('');
        setMessages('');

        // Check if user logged in and if there is an image
        if (!currentUser) {
            window.location.reload();
        } else if (!image) {
            console.log('no  image');
            setErrors('Please select an image');
            e.preventDefault();
            return;
        }

        // Upload post and then set message or error
        const result = await uploadPost(currentUser, currentUserInfo, image, caption);
        if (!result) {
            setErrors('Failed to upload post');
        } else {
            setMessages('Post uploaded successfully');
        }

        e.preventDefault();
    };

    /**
     * Handles uploading the story
     * @param {event} e Event
     * @returns {Promise}
     */
    const handleStorySubmit = async (e) => {
        setErrors('');
        setMessages('');

        // Check if user logged in and if there is an image
        if (!currentUser) {
            window.location.reload();
        } else if (!image) {
            setErrors('Please select an image');
            e.preventDefault();
            return;
        }

        // Upload post and then set message or error
        const result = await uploadStory(currentUser, currentUserInfo, image);
        if (!result) {
            setErrors('Failed to upload story');
        } else {
            setMessages('Story uploaded successfully');
        }

        e.preventDefault();
    };

    return (
        <form onSubmit={handleSubmit} className='upload'>
            {errors ? <div className='upload-error'>{errors}</div> : null}
            {messages ? <div className='upload-message'>{messages}</div> : null}
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
            <button className='upload-button' type='button' onClick={handleStorySubmit}>Share to Story</button>
        </form>
    );
};

export default UploadForm;
