/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import './Chat.scss';
import { AiOutlineSend } from 'react-icons/ai';
import { VscChevronLeft } from 'react-icons/vsc';
import { firestore } from '../../../services/firebase';
import { pairUID } from '../../../Helper';
import { useAuth } from '../../../context/AuthConext';

function Chat({ contact, inMessage, setInMessage }) {
    const { currentUser, currentUserInfo } = useAuth();
    const [messageInput, setMessageInput] = useState('');

    const [messages, setMessages] = useState();

    // Gets the messages between the user and contact
    const getMessages = () => {
        const collection = `messages/${pairUID(currentUser.uid, contact?.uid)}/messages`;
        firestore.collection(collection).orderBy('timestamp', 'asc').get().then((querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => {
                const message = doc.data();
                message.id = doc.id;
                return message;
            });
            setMessages(data);
            // console.log(data);
        });
    };

    // Send a message
    const sendMessage = (e) => {
        const pairedUID = pairUID(currentUser?.uid, contact.uid);
        const collection = `messages/${pairedUID}`;

        // Create users to add to database
        const user1 = {
            username: currentUserInfo.username,
            name: currentUserInfo.name,
            uid: currentUser.uid,
            profile_pic: currentUserInfo?.profile_pic || '',
        };
        const user2 = {
            username: contact.username,
            name: contact.name,
            uid: contact.uid,
            profile_pic: contact?.profile_pic || '',
        };

        // Add message temporarly to messages array to avoid reading DB again
        const tempMessages = messages;
        tempMessages.push({
            id: Math.floor(Math.random() * 1000),
            text: messageInput,
            timestamp: new Date(),
            user: { uid: currentUser.uid },
        });
        setMessages(tempMessages);

        // Add message to array
        firestore.collection(`${collection}/messages`).add({
            text: messageInput,
            user: user1,
            timestamp: new Date(),
        }).then(() => {
            // Update last message and both user profiles
            firestore.collection('messages').doc(pairedUID).set({
                uid: [currentUser.uid, contact.uid],
                user1,
                user2,
                timestamp: new Date(),
                lastMessage: messageInput,
            }, { merge: true });
        });

        // Clear input
        setMessageInput('');
        e.preventDefault();
    };

    useEffect(() => {
        getMessages();
    }, [contact]);

    if (contact) {
        return (
            <div className={inMessage ? 'chat-wrapper ' : 'chat-wrapper hide'}>
                <div className='chat-top'>
                    <button type='button' className={inMessage ? 'chat-top-back ' : 'chat-top-back hide'} onClick={(e) => setInMessage(false)}>
                        <VscChevronLeft size='30px' />
                    </button>

                    <div>
                        <img src={contact?.profile_pic || 'https://via.placeholder.com/150'} alt='Avatar' />
                    </div>
                    <div>{contact?.username}</div>
                </div>
                <div className='chat-middle'>
                    {messages
                        ? messages?.map((message) => (
                            <div className={message?.user?.uid === currentUser?.uid ? 'bubble me' : 'bubble you'} key={message.id}>
                                {message?.text}
                            </div>
                        ))
                        : null}
                </div>
                <form className='chat-bottom' onSubmit={sendMessage}>
                    <input value={messageInput} onChange={(e) => setMessageInput(e.target.value)} type='text' name='message' placeholder='Message...' />
                    <AiOutlineSend size='30px' type='submit' onClick={sendMessage} />
                </form>
            </div>
        );
    }
    return (
        <div className='chat-empty'>
            <h3>Compose new message</h3>
            <h3>Or select conversation</h3>
        </div>
    );
}

export default Chat;
