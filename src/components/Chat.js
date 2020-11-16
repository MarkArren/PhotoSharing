import './Chat.scss';
import { AiOutlineSend } from "react-icons/ai";

function Chat(){
    return(
        <div className="chat-wrapper">
            <div className="chat-top">
                <div><img src={process.env.PUBLIC_URL + 'avatar.png'} alt="Avatar"></img></div>
                <div>Username</div>
            </div>
            <div className="chat-middle">
                Message
            </div>
            <div className="chat-bottom">
                <input type="text" name="message" placeholder="Message..."/>
                <AiOutlineSend size="30px" />
            </div>
        </div>
    );
}

export default Chat;