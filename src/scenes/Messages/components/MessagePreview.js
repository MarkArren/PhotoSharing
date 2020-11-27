import React from 'react';
import './MessagePreview.scss';

function MessagePreview() {
    return (
        <div className='message-preview'>
            <div className='message-preview-profilepic'>
                <img src={`${process.env.PUBLIC_URL}/avatar.png`} alt='Avatar' />
            </div>
            <div>Username</div>
            <div>This is a preview of a mesasge... 3d ago</div>
        </div>
    );
}

export default MessagePreview;
