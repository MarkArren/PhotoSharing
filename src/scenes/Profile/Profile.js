import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import './Profile.scss';
import { useAuth } from '../../context/AuthConext';
import Stories from '../Feed/components/Stories';

function Profile() {
    const { currentUser, currentUserInfo } = useAuth();

    return (
        <div>
            <Navbar />
            <div className='profile-container'>
                <div className='profile'>
                    <div className='profile-image'>
                        <img src='http://via.placeholder.com/200x200' alt='profile-pic' />
                    </div>
                    <div className='profile-name'>
                        <span>{currentUserInfo?.username}</span>
                        &nbsp;
                        <span className='name'>{currentUserInfo?.name}</span>
                    </div>
                    <div className='profile-interaction'>
                        <Link to='/logout'>
                            <button type='button'>Edit Profile</button>
                        </Link>
                        <Link to='/logout'>
                            <button type='button'>Logout</button>
                        </Link>
                    </div>
                    <div className='profile-bio'>{currentUserInfo?.bio}</div>
                    <div className='profile-stats'>
                        <div>
                            <span className='profile-stat'>
                                {currentUserInfo?.followers}
                                &nbsp;
                            </span>
                            Followers
                        </div>
                        <div>
                            <span className='profile-stat'>
                                &nbsp;
                                {currentUserInfo?.following}
                                &nbsp;
                            </span>
                            Following
                        </div>
                        <div>
                            <span className='profile-stat'>
                                &nbsp;
                                {currentUserInfo?.likes}
                                &nbsp;
                            </span>
                            Likes
                        </div>
                    </div>
                </div>
                <Stories />
                <div className='gallery'>
                    <div className='gallery-item'>
                        <img src='http://via.placeholder.com/293x293' alt='placeholder' />
                    </div>
                    <div className='gallery-item'>
                        <img src='http://via.placeholder.com/293x293' alt='placeholder' />
                    </div>
                    <div className='gallery-item'>
                        <img src='http://via.placeholder.com/293x293' alt='placeholder' />
                    </div>
                    <div className='gallery-item'>
                        <img src='http://via.placeholder.com/293x293' alt='placeholder' />
                    </div>
                    <div className='gallery-item'>
                        <img src='http://via.placeholder.com/293x293' alt='placeholder' />
                    </div>
                    <div className='gallery-item'>
                        <img src='http://via.placeholder.com/293x293' alt='placeholder' />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
