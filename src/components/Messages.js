import Navbar from './Navbar.js';
import Chat from './Chat.js'
import MessagePreview from './MessagePreview';
import './Messages.scss';

function Messages(){
    return(
        <div>
            <Navbar />
            <div className="messages-wrapper">
                <div className="messages">
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