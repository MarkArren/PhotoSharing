import React from 'react';
import Navbar from '../../components/Navbar';
import Chat from './components/Chat';
import MessagePreview from './components/MessagePreview';
import './Messages.scss';

function Messages() {
    return (
        <div>
            <Navbar />
            <div className='messages-wrapper'>
                <div className='messages'>
                    <h3>Messages</h3>
                    <MessagePreview />
                    <MessagePreview />
                    <MessagePreview />
                </div>
                <Chat />
            </div>
        </div>
    );
}

export default Messages;
