import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import './Profile.scss';

function Profile() {
    return (
        <div>
            <Navbar />
            Profile
            <div>
                <Link to='/logout'>
                    <button type='button'>Logout</button>
                </Link>
            </div>
        </div>
    );
}

export default Profile;
