/* eslint-disable react/no-this-in-sfc */
/* eslint-disable no-return-assign */
import React, { useRef, useState } from 'react';
import { useAuth } from '../../../context/AuthConext';

const EditProfile = () => {
    const { currentUser } = useAuth();
    const { currentUserInfo } = useAuth();
    const {
        changeUsername, changeName, changeBio, changeEmail, changeProfilePic,
    } = useAuth();
    // const [username, setUsername] = useState(null);
    const emailRef = useRef('test');
    const usernameRef = useRef();
    const nameRef = useRef();
    const bioRef = useRef();
    const imageRef = useRef();
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        // If username changed try to change username
        if (!(usernameRef.current.value === currentUserInfo.username)) {
            try {
                await changeUsername(usernameRef.current.value);
            } catch (exception) {
                setError(exception.message);
                return;
            }
        }

        // check if email is taken and required
        if (!(emailRef.current.value === currentUser.email)) {
            try {
                await changeEmail(emailRef.current.value);
            } catch (exception) {
                setError(exception.message);
            }
        }

        // Check if file has been uploaded and update it
        if (imageRef.current.files[0]) {
            try {
                await changeProfilePic(imageRef.current.files[0]);
            } catch (exception) {
                setError(exception.message);
            }
        }

        // Check if name changed and update
        if (!(nameRef.current.value === currentUserInfo.name)) {
            changeName(nameRef.current.value);
        }

        // Check if bio changed and update
        if (!(bioRef.current.value === currentUserInfo.bio)) {
            console.log('bio changed');
            changeBio(bioRef.current.value);
        }
    }

    // console.log(currentUser);
    return (
        <div>
            <form onSubmit={handleSubmit}>
                {error}
                <img
                    src={
                        currentUserInfo?.profile_pic
                            ? currentUserInfo?.profile_pic
                            : 'http://via.placeholder.com/200x200'
                    }
                    alt='profile-pic'
                />
                <input
                    type='file'
                    ref={imageRef}
                    accept='image/png, image/jpeg'
                    // onChange={(e) => setSelectedFile(e.target.files[0])}
                />
                Name
                <input type='text' ref={nameRef} defaultValue={currentUserInfo?.name} />
                Username
                <input
                    type='text'
                    ref={usernameRef}
                    defaultValue={currentUserInfo?.username}
                    // required
                />
                Bio
                <input type='text' ref={bioRef} defaultValue={currentUserInfo?.bio} />
                Email
                <input type='text' ref={emailRef} defaultValue={currentUser?.email} required />
                <button type='submit'>Save</button>
            </form>
        </div>
    );
};

export default EditProfile;
