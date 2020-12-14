import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import './Profile.scss';
import { useAuth } from '../../context/AuthConext';

function Profile() {
    const { currentUser, currentUserInfo } = useAuth();
    return (
        <div>
            <Navbar />
            Profile
            <span>
                UID:&nbsp;
                {currentUser?.uid}
            </span>
            <br />
            <span>
                Username:&nbsp;
                {currentUserInfo?.username}
            </span>
            <br />
            <span>
                Name:&nbsp;
                {currentUserInfo?.name}
            </span>
            <div>
                <Link to='/logout'>
                    <button type='button'>Logout</button>
                </Link>
            </div>
        </div>
    );
}

export default Profile;
