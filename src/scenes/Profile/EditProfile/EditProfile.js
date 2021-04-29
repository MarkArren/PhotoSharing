import React, { useRef, useState } from 'react';
import { useAuth } from '../../../context/AuthConext';
import Navbar from '../../../components/Navbar';
import './EditProfile.scss';

const EditProfile = () => {
    const { currentUser } = useAuth();
    const { currentUserInfo } = useAuth();
    const {
        changeUsername, changeName, changeBio, changeEmail, changeProfilePic,
    } = useAuth();
    const emailRef = useRef('test');
    const usernameRef = useRef();
    const nameRef = useRef();
    const bioRef = useRef();
    const imageRef = useRef(currentUserInfo?.profile_pic);
    const [image, setImage] = useState(currentUserInfo?.profile_pic);
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        try {
            // If username changed try to change username
            if (!(usernameRef.current.value === currentUserInfo.username)) {
                await changeUsername(usernameRef.current.value);
            }
            // check if email is taken and required
            if (!(emailRef.current.value === currentUser.email)) {
                await changeEmail(emailRef.current.value);
            }

            // Check if file has been uploaded and update it
            if (imageRef.current.files[0]) {
                await changeProfilePic(imageRef.current.files[0]);
            }

            // Check if name changed and update
            if (!(nameRef.current.value === currentUserInfo.name)) {
                changeName(nameRef.current.value);
            }

            // Check if bio changed and update
            if (!(bioRef.current.value === currentUserInfo.bio)) {
                changeBio(bioRef.current.value);
            }
        } catch (exception) {
            setError(exception.message);
            return;
        }

        setError('Profile Updated');
    }

    return (
        <div>
            <Navbar />

            <form onSubmit={handleSubmit} className='edit'>
                {error ? (
                    <div className='errors'>
                        {error}
                    </div>
                ) : null}
                <img
                    src={image || currentUserInfo?.profile_pic}
                    alt='profile-pic'
                />
                <span>
                    {currentUserInfo?.username}
                    <br />
                    <input
                        type='file'
                        id='file'
                        ref={imageRef}
                        accept='image/png, image/jpeg'
                        onChange={(e) => {
                            if (e.target.files[0]) setImage(URL.createObjectURL(e.target.files[0]));
                        }}
                    />
                    <label htmlFor='file' className='edit-pic-label'>
                        Change Profile Picture
                    </label>
                </span>

                <label htmlFor='name'>Name</label>
                <input type='text' id='name' ref={nameRef} defaultValue={currentUserInfo?.name} />

                <label htmlFor='username'>Username</label>
                <input
                    type='text'
                    id='username'
                    ref={usernameRef}
                    defaultValue={currentUserInfo?.username}
                    // required
                />

                <label htmlFor='bio'>Bio</label>
                <input type='text' id='bio' ref={bioRef} defaultValue={currentUserInfo?.bio} />

                <label htmlFor='email'>Email</label>
                <input type='text' id='bio' ref={emailRef} defaultValue={currentUser?.email} required />

                <button className='edit-submit' type='submit'>Save</button>
            </form>
        </div>
    );
};

export default EditProfile;
