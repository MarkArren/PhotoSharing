import React from 'react';
import PropTypes from 'prop-types';
import { firestore } from '../services/firebase';

const Comment = ({ comment }) => {
    const timeSince = (timestamp) => {
        const date = new Date(timestamp.seconds * 1000);

        const seconds = Math.floor((new Date() - date) / 1000);

        let interval = seconds / 31536000;

        if (interval > 1) {
            return `${Math.floor(interval)} years ago`;
        }
        interval = seconds / 2592000;
        if (interval > 1) {
            return `${Math.floor(interval)} months ago`;
        }
        interval = seconds / 86400;
        if (interval > 1) {
            return `${Math.floor(interval)} days ago`;
        }
        interval = seconds / 3600;
        if (interval > 1) {
            return `${Math.floor(interval)} hours ago`;
        }
        interval = seconds / 60;
        if (interval > 1) {
            return `${Math.floor(interval)} minutes ago`;
        }
        return `${Math.floor(seconds)} seconds ago`;
    };

    return (
        <div className='comment'>
            <div className='comment-profilepic'>
                <img src={`${process.env.PUBLIC_URL}avatar.png`} alt='Avatar' />
            </div>
            <div>
                <span className='comment-username'>{comment?.username}</span>
                &nbsp;
                {comment?.comment}
            </div>
            <span className='comment-timestamp'>{timeSince(comment?.timestamp)}</span>
        </div>
    );
};

Comment.propTypes = {
    comment: PropTypes.shape({
        username: PropTypes.string,
        comment: PropTypes.string,
        timestamp: PropTypes.shape({
            nanoseconds: PropTypes.number,
            seconds: PropTypes.number,
        }),
    }),
};

// Specifies the default values for props:
Comment.defaultProps = {
    comment: PropTypes.shape({
        username: 'Username loading...',
        comment: 'Comment loading...',
        timestamp: { seconds: 0, nanoseconds: 0 },
    }),
};

export default Comment;
