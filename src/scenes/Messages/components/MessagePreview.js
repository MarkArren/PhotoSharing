import React, { useEffect, useState } from 'react';
import './MessagePreview.scss';
import PropTypes from 'prop-types';
import { stringFromTime } from '../../../Helper';
import { useAuth } from '../../../context/AuthConext';

function MessagePreview({ conversation }) {
    const { currentUser } = useAuth();
    const [contact, setContact] = useState(null);

    useEffect(() => {
        if (conversation?.user1?.uid === currentUser?.uid) {
            setContact(conversation.user2);
        } else {
            setContact(conversation.user1);
        }
        // console.log(conversation);
        // console.log(conversation?.user1 === currentUser?.uid);
    }, [conversation, currentUser]);

    return (
        <span className='message-preview'>
            <img className='message-preview-profilepic' src={contact?.profile_pic ? contact.profile_pic : 'https://via.placeholder.com/150'} alt='Avatar' />
            <span href={contact?.username} className='message-preview-username'>{contact?.username}</span>
            <span className='message-preview-text'>{conversation?.lastMessage}</span>
            <span className='message-preview-timestamp'>{conversation?.timestamp ? stringFromTime(conversation.timestamp, true) : '...'}</span>
        </span>
    );
}

MessagePreview.propTypes = {
    conversation: PropTypes.shape({
        lastMessage: PropTypes.string,
        user1: PropTypes.shape({
            username: PropTypes.string,
            name: PropTypes.string,
            uid: PropTypes.string,
            profile_pic: PropTypes.string,
        }),
        user2: PropTypes.shape({
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
MessagePreview.defaultProps = {
    conversation: PropTypes.shape({
        lastMessage: 'Loading',
        user1: PropTypes.shape({
            username: '...', name: '...', uid: 0, profile_pic: 'https://via.placeholder.com/150',
        }),
        user2: PropTypes.shape({
            username: '...', name: '...', uid: 0, profile_pic: 'https://via.placeholder.com/150',
        }),
        timestamp: { seconds: 0, nanoseconds: 0 },
    }),
};

export default MessagePreview;
