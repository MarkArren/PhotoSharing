import React from 'react';
import PropTypes from 'prop-types';
import { firestore } from '../services/firebase';

const Comment = ({ comment }) => {
    const timeSince = (timestamp) => {
        const date = new Date(timestamp.seconds * 1000);

        const seconds = Math.floor((new Date() - date) / 1000);

        let interval = seconds / 31536000;

        if (interval > 1) {
            return `${Math.floor(interval)}y`;
        }
        interval = seconds / 2592000;
        if (interval > 1) {
            return `${Math.floor(interval)}mo`;
        }
        interval = seconds / 86400;
        if (interval > 1) {
            return `${Math.floor(interval)}d`;
        }
        interval = seconds / 3600;
        if (interval > 1) {
            return `${Math.floor(interval)}h`;
        }
        interval = seconds / 60;
        if (interval > 1) {
            return `${Math.floor(interval)}m`;
        }
        return `${Math.floor(seconds)}s`;
    };

    return (
        <div className='comment'>
            <a href={comment?.user?.username} className='comment-profilepic'>
                <img src={`${process.env.PUBLIC_URL}avatar.png`} alt='Avatar' />
            </a>
            <div>
                <a href={comment?.user?.username} className='comment-username'>{comment?.user?.username}</a>
                <span className='comment-text'>{comment?.comment}</span>
                <span className='comment-timestamp'>{timeSince(comment?.timestamp)}</span>
            </div>

        </div>
    );
};

Comment.propTypes = {
    comment: PropTypes.shape({
        comment: PropTypes.string,
        user: PropTypes.shape({
            username: PropTypes.string,
            name: PropTypes.string,
            uid: PropTypes.string,
        }),
        timestamp: PropTypes.shape({
            nanoseconds: PropTypes.number,
            seconds: PropTypes.number,
        }),
    }),
};

// Specifies the default values for props:
Comment.defaultProps = {
    comment: PropTypes.shape({
        comment: 'Comment loading...',
        user: { username: '...', name: '...', uid: 0 },
        timestamp: { seconds: 0, nanoseconds: 0 },
    }),
};

export default Comment;
