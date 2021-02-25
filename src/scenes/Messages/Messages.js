/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { BiMessageAdd } from 'react-icons/bi';
import { AiOutlineClose } from 'react-icons/ai';
import Navbar from '../../components/Navbar';
import Chat from './components/Chat';
import MessagePreview from './components/MessagePreview';
import ProfilePreview from './components/ProfilePreview';
import './Messages.scss';
import { useAuth } from '../../context/AuthConext';
import { firestore } from '../../services/firebase';
import { pairUID } from '../../Helper';

const Messages = () => {
    const { currentUser, currentUserInfo } = useAuth();
    const [messagesList, setMessagesList] = useState(null); // Stores list of conversations
    const [selectedMessage, setSelectedMessage] = useState(null); // Stores convo uid

    const [showCompose, setShowCompose] = useState(false);
    const [composeInput, setComposeInput] = useState('');
    const [composeContacts, setComposeContacts] = useState(null);

    const getUserFromConvo = (conversation) => {
        if (conversation?.user1?.uid === currentUser?.uid) {
            return conversation?.user2;
        }
        return conversation?.user1;
    };

    // Composes a conversation with a user
    const composeConversation = (user) => {
        setShowCompose(false);
        const messagesListTemp = messagesList;
        let conversationTemp;

        // Check if user is already in conversation list
        const indexOfMessage = messagesListTemp.findIndex((contact) => contact.uid.includes(user.uid));
        if (indexOfMessage !== -1) {
            // TODO move conversation to top of array
            conversationTemp = messagesList[indexOfMessage];
            console.log('already in convo');
        } else {
            // Add user to messages list
            conversationTemp = { timestamp: { seconds: Date.now() / 1000 }, user };
            messagesListTemp.push(conversationTemp);
            setMessagesList(messagesListTemp);
        }

        setSelectedMessage(user);
    };

    // Change the selected message
    const changeSelectedMessage = (conversation) => {
        const contact = getUserFromConvo(conversation);
        setSelectedMessage(contact);
    };

    // Fetch user conversations
    useEffect(() => {
        const unsubscribe = firestore
            .collection('messages')
            .where('uid', 'array-contains', currentUser.uid)
            .orderBy('timestamp', 'desc')
            .get()
            .then((querySnapshot) => {
                const data = querySnapshot.docs.map((doc) => {
                    const conversation = doc.data();
                    conversation.id = doc.id;
                    return conversation;
                });
                setMessagesList(data);
                console.log(data);
            });
        return unsubscribe;
    }, [setMessagesList]);

    // Fetch all users on app
    useEffect(() => {
        if (showCompose) {
            console.log('show compose true');
            firestore.collection('users').where('__name__', '!=', currentUser.uid).get().then((querySnapshot) => {
                const data = querySnapshot.docs.map((doc) => {
                    const contact = doc.data();
                    contact.uid = doc.id;
                    return contact;
                });
                setComposeContacts(data);
                console.log(data);
            });
        }
    }, [showCompose]);

    return (
        <div>
            <Navbar />
            <div className='messages-wrapper'>
                <div className='messages'>
                    <h3>Messages</h3>
                    <span
                        role='button'
                        className='messages-compose'
                        onClick={() => setShowCompose(true)}
                        onKeyDown={() => setShowCompose(true)}
                        tabIndex='0'
                    >
                        <BiMessageAdd size='27px' type='submit' className='messages-compose-icon' />
                    </span>
                    {messagesList
                        ? messagesList?.map((conversation, index) => (
                            <div key={conversation.id} role='button' onClick={(e) => changeSelectedMessage(conversation)} onKeyDown={(e) => changeSelectedMessage(conversation)} tabIndex='0'>
                                <MessagePreview conversation={conversation} />
                            </div>
                        ))
                        : null}
                </div>
                <Chat contact={selectedMessage} />
            </div>
            {composeContacts && showCompose ? (
                <div
                    className='compose-container'
                    onClick={() => {
                        setShowCompose(false);
                    }}
                    onKeyPress={() => {
                        setShowCompose(false);
                    }}
                    tabIndex='0'
                    role='button'
                >
                    <div className='compose'>
                        <AiOutlineClose
                            className='close-icon'
                            onClick={() => {
                                setShowCompose(false);
                            }}
                        />
                        {/* <form onSubmit={composeConversation}>
                            <input value={composeInput} onChange={(e) => setComposeInput(e.target.value)} />
                            <button type='submit'>Submit</button>
                        </form> */}
                        <div className='compose-contacts'>
                            {composeContacts
                                ? composeContacts?.map((contact, index) => (
                                    <div key={contact.uid} className='compose-contact' role='button' onClick={(e) => composeConversation(contact)} onKeyDown={(e) => composeConversation(contact)} tabIndex='0'>
                                        <ProfilePreview profile={contact} />
                                    </div>
                                ))
                                : null}
                        </div>
                    </div>
                </div>
            ) : null }
        </div>
    );
};

export default Messages;
