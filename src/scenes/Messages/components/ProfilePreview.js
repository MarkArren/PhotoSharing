import React from 'react';
import PropTypes from 'prop-types';
import './ProfilePreview.scss';

const ProfilePreview = ({ profile }) => (
    <div className='profile-preview'>

        <a href={profile?.username} className='profile-preview-profilepic'>
            <img src={profile?.profile_pic || 'https://via.placeholder.com/150'} alt='Avatar' />
        </a>
        <span href={profile?.username} className='profile-preview-username'>{profile?.username}</span>
        <span href={profile?.username} className='profile-preview-name'>{profile?.name}</span>
        {/* <span className='profile-preview-bio'>{profile?.bio}</span> */}

    </div>
);

ProfilePreview.propTypes = {
    profile: PropTypes.shape({
        bio: PropTypes.string,
        username: PropTypes.string,
        name: PropTypes.string,
        uid: PropTypes.string,
        profile_pic: PropTypes.string,
    }),
};

// Specifies the default values for props:
ProfilePreview.defaultProps = {
    profile: PropTypes.shape({
        bio: 'Loading...',
        username: 'Loading...',
        name: 'Loading...',
        uid: 'Loading...',
        profile_pic: 'https://via.placeholder.com/150',
    }),
};

export default ProfilePreview;
