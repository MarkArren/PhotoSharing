/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { stringFromTime } from '../Helper';
import { useAuth } from '../context/AuthConext';
import { followUser } from '../FirebaseHelper';

const Notification = ({ notification }) => {
    const [doesFollow, setDoesFollow] = useState(false);
    const { currentUser, currentUserInfo } = useAuth();

    let text;
    if (notification?.type === 0) {
        text = 'started following you';
    } else if (notification?.type === 1) {
        text = 'liked your post';
    } else if (notification?.type === 2) {
        text = 'commented on your post';
    }

    /**
     * Handles the follow button being pressed
     * @returns {Promise}
     */
    async function handleFollow() {
        if (!currentUser || !notification?.user) {
            return;
        }

        const result = await followUser(currentUser,
            currentUserInfo, notification.user, doesFollow);

        if (result === 1) {
            // User now following
            setDoesFollow(true);
        } else if (result === 2) {
            // User now unfollowing
            setDoesFollow(false);
        }
    }

    const followButton = <button className='notification-follow' type='button' onClick={handleFollow}>{doesFollow ? 'Following' : 'Follow'}</button>;

    const postPreview = (
        <a href={notification?.id} className='notification-post'>
            <img src={notification?.post?.url ? notification.post.url : 'https://via.placeholder.com/150'} alt='Post' />
        </a>
    );

    return (
        <div className='notification'>
            <a href={notification?.user?.username} className='notification-profilepic'>
                <img src={notification?.user?.profile_pic || 'https://via.placeholder.com/150'} alt='Avatar' />
            </a>
            <div>
                <a href={notification?.user?.username} className='notification-username'>{notification?.user?.username}</a>
                <span className='notification-text'>{text}</span>
                <span className='notification-timestamp'>{notification?.timestamp ? stringFromTime(notification.timestamp, true) : '...'}</span>
            </div>
            {/* Follow Button */}
            {notification?.type === 0 ? followButton : null}

            {/* Post image */}
            {notification?.type === 1 || notification?.type === 2 ? postPreview : null}
        </div>
    );
};

export default Notification;
