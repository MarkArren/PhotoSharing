import React from 'react';
import PropTypes from 'prop-types';
import { firestore } from '../services/firebase';
import { stringFromTime } from '../Helper';

const Comment = ({ comment }) => (
    <div className='comment'>
        <a href={comment?.user?.username} className='comment-profilepic'>
            <img src={comment?.user?.profile_pic || 'https://via.placeholder.com/150'} alt='Avatar' />
        </a>
        <div>
            <a href={comment?.user?.username} className='comment-username'>{comment?.user?.username}</a>
            <span className='comment-text'>{comment?.comment}</span>
            <span className='comment-timestamp'>{comment?.timestamp ? stringFromTime(comment.timestamp, true) : '...'}</span>
        </div>
    </div>
);

Comment.propTypes = {
    comment: PropTypes.shape({
        comment: PropTypes.string,
        user: PropTypes.shape({
            username: PropTypes.string,
            name: PropTypes.string,
            uid: PropTypes.string,
            profile_pic: PropTypes.string,
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
        user: PropTypes.shape({
            username: '...', name: '...', uid: 0, profile_pic: 'https://via.placeholder.com/150',
        }),
        timestamp: { seconds: 0, nanoseconds: 0 },
    }),
};

export default Comment;
