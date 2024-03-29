import './Navbar.scss';
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMessageCircle } from 'react-icons/fi';
import { MdNotifications } from 'react-icons/md';
import { AiOutlineUser, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { IoAddCircleOutline } from 'react-icons/io5';
import { IconContext } from 'react-icons';
import { useAuth } from '../context/AuthConext';
import Notification from './Notification';
import { firestore } from '../services/firebase';

function Navbar() {
    const { currentUser, currentUserInfo } = useAuth();
    const [navMobileOpen, setNavMobileOpen] = useState(false);
    const searchRef = useRef();

    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState(null);

    function handleSearch(e) {
        e.preventDefault();
        console.log(searchRef.current.value);
        return searchRef.current.value;
    }

    function openNavBar() {

    }

    /**
     * Sets notifications when notificationsOpen is set to true
     */
    useEffect(() => {
        if (notificationsOpen) {
            const unsubscribe = firestore
                .collection(`users/${currentUser.uid}/notifications`)
                .orderBy('timestamp', 'desc')
                .get()
                .then((querySnapshot) => {
                    const data = querySnapshot.docs.map((doc) => {
                        const notification = doc.data();
                        notification.id = doc.id;
                        return notification;
                    });
                    setNotifications(data);
                });
            return unsubscribe;
        }
        return null;
    }, [notificationsOpen]);

    const notificationBox = (

        <div className={notificationsOpen ? 'nav-notifications' : 'hide'}>
            <div className='notifications-container'>
                <span className='nav-notifications-title'>{notifications?.length > 0 ? 'Notifications' : 'No notifications'}</span>
                {notifications
            && notifications?.map((notification) => (
                <Notification notification={notification} key={notification.id} />
            ))}
            </div>
        </div>

    );

    return (
        <div className='nav'>
            <Link to='/' className='nav-left'>
                <h3>PhotoSharing</h3>
            </Link>
            <div className='nav-right'>
                {/* <form onSubmit={handleSearch}>
                    <input
                        type='text'
                        ref={searchRef}
                        placeholder='Search'
                        className='nav-right-search'
                    />
                </form> */}
                <Link to='/upload' className='nav-icon'>
                    <IoAddCircleOutline />
                </Link>
                <Link to='/messages' className='nav-icon'>
                    <FiMessageCircle />
                </Link>
                <div className='nav-icon'>
                    <MdNotifications onClick={() => {
                        setNotificationsOpen(!notificationsOpen);
                    }}
                    />
                    {notificationBox}
                </div>
                <Link to={`/${currentUserInfo?.username}`} className='nav-icon'>
                    <AiOutlineUser />
                </Link>
            </div>
            <div className='nav-right-mobile'>
                <div className='nav-icon'>
                    <MdNotifications onClick={() => {
                        setNotificationsOpen(!notificationsOpen);
                    }}
                    />
                    {notificationBox}
                </div>
                <div className='nav-mobile-toggle nav-icon'>
                    {navMobileOpen ? (
                        <AiOutlineClose
                            onClick={() => {
                                setNavMobileOpen(!navMobileOpen);
                            }}
                        />
                    ) : (
                        <AiOutlineMenu
                            onClick={() => {
                                setNavMobileOpen(!navMobileOpen);
                            }}
                        />
                    )}
                </div>
                <div className={navMobileOpen ? 'nav-mobile' : 'hide'}>
                    <Link to='/'>Home</Link>
                    <Link to='/upload'>Upload</Link>
                    <Link to='/messages'>Messages</Link>
                    <Link to={`/${currentUserInfo?.username}`}>Profile</Link>
                </div>
            </div>

        </div>
    );
}

export default Navbar;
