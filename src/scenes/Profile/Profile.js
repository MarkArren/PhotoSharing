/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai';
import { VscHeart } from 'react-icons/vsc';
import { BsChat } from 'react-icons/bs';
import Navbar from '../../components/Navbar';
import './Profile.scss';
import { useAuth } from '../../context/AuthConext';
import Stories from '../Feed/components/Stories';
import Post from '../../components/Post';
import { firestore } from '../../services/firebase';

function Profile(props) {
    const { currentUser, currentUserInfo } = useAuth();
    const [posts, setPosts] = useState(null);
    const [currentPost, setCurrentPost] = useState();
    const [showPost, setShowPost] = useState(false);
    const [user, setUser] = useState(null);
    const [userExists, setUserExists] = useState(true);

    async function followUser() {
        if (!currentUser || !user) {
            return;
        }

        const followersRef = firestore.collection('users')
            .doc(user?.uid)
            .collection('followers')
            .doc(currentUser?.uid);
        const followingRef = firestore.collection('users')
            .doc(currentUser?.uid)
            .collection('following')
            .doc(user?.uid);

        try {
            await firestore.runTransaction(async (t) => {
                const docFollowers = await t.get(followersRef);

                if (docFollowers.exists) {
                    // Delete follow from target users profile
                    t.delete(followersRef);
                    // Delete following from current users profile
                    t.delete(followingRef);
                    const tempUser = user;
                    tempUser.followers -= 1;
                    setUser({ ...tempUser });
                } else {
                    // Add follow to target users profile
                    t.set(followersRef, {
                        user: {
                            username: currentUserInfo.username,
                            name: currentUserInfo.name,
                            uid: currentUser.uid,
                        },
                        timestamp: new Date(),
                    });
                    // Add following to current users profile
                    t.set(followingRef, {
                        user: {
                            username: user.username,
                            name: user.name,
                            uid: user.uid,
                        },
                        timestamp: new Date(),
                    });
                    const tempUser = user;
                    tempUser.followers += 1;
                    setUser({ ...tempUser });
                }
            });
            console.log('Follow/ Unfollow successful!');
        } catch (e) {
            console.log('Follow/ Unfollow failure:', e);
        }

        // TODO change to cloud function
        // TODO could add transaction
        // Check if user is following already
        // firestore
        //     .collection('users')
        //     .doc(user?.uid)
        //     .collection('followers')
        //     .doc(currentUser?.uid)
        //     .get()
        //     .then((doc) => {
        //         if (doc.exists) {
        //             // Unfollow user
        //             doc.ref.delete();
        //             const tempUser = user;
        //             tempUser.followers -= 1;
        //             setUser({ ...tempUser });
        //         } else {
        //             // Follow user
        //             doc.ref.set({
        //                 user: {
        //                     username: currentUserInfo.username,
        //                     name: currentUserInfo.name,
        //                     uid: currentUser.uid,
        //                 },
        //                 timestamp: new Date(),
        //             });
        //             const tempUser = user;
        //             tempUser.followers += 1;
        //             setUser({ ...tempUser });
        //         }
        //     });
    }

    function messageUser() {
        console.log('message button pressed');
    }

    useEffect(() => {
        if (!props.match.params.username) {
            setUserExists(false);
            return false;
        }

        setUser({ username: props.match.params.username });
        const unsubscribe = firestore
            .collection('users')
            // eslint-disable-next-line react/prop-types
            .where('username', '==', props.match.params.username)
            .get()
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    // Couldn't find username
                    setUserExists(false);
                } else {
                    const tempUser = querySnapshot.docs[0].data();
                    tempUser.uid = querySnapshot.docs[0].id;
                    setUser(tempUser);

                    firestore.doc(`users/${tempUser.uid}`).collection('posts').orderBy('timestamp', 'desc')
                        .get()
                        .then((querySnapshot2) => {
                            const data = querySnapshot2.docs.map((doc) => {
                                const post = doc.data();
                                post.id = doc.id;

                                // Add owner of post
                                post.user = {
                                    name: tempUser?.name,
                                    username: tempUser?.username,
                                    uid: tempUser?.uid,
                                };
                                return post;
                            });
                            setPosts(data);
                            console.log(data);
                        });
                }
            }, () => {
                // Couldn't find username
                setUserExists(false);
                return false;
            });
        return unsubscribe;
    }, [setPosts]);

    const loadPost = (e) => {
        setCurrentPost(posts[e.currentTarget.id]);
        setShowPost(true);
    };

    return (
        userExists
            ? (
                <div className='profile-page'>
                    <Navbar className={showPost ? 'blur' : ''} username={currentUserInfo?.username} />
                    <div className={`profile-container ${showPost ? 'blur' : ''}`}>
                        <div className='profile'>
                            <div className='profile-image'>
                                <img
                                    src={
                                        user?.profile_pic
                                            ? user?.profile_pic
                                            : 'https://via.placeholder.com/200x200'
                                    }
                                    alt='profile-pic'
                                />
                            </div>
                            <div className='profile-name'>
                                <span>{user?.username}</span>
                        &nbsp;
                                <span className='name'>{user?.name}</span>
                            </div>
                            {(currentUserInfo?.username === user?.username) ? (
                                <div className='profile-interaction'>
                                    <Link to='/edit'>
                                        <button type='button'>Edit Profile</button>
                                    </Link>
                                    <Link to='/logout'>
                                        <button type='button'>Logout</button>
                                    </Link>
                                </div>
                            ) : (
                                <div className='profile-interaction'>
                                    <button type='button' onClick={followUser}>Follow</button>
                                    <button type='button' onClick={messageUser}>Message</button>
                                </div>
                            )}

                            <div className='profile-bio'>{user?.bio}</div>
                            <div className='profile-stats'>
                                <div>
                                    <span className='profile-stats-stat'>
                                        {user?.followers ? user.followers : 0}
                                &nbsp;
                                    </span>
                                    Followers
                                </div>
                                <div>
                                    <span className='profile-stats-stat'>
                                &nbsp;
                                        {user?.following ? user.following : 0}
                                &nbsp;
                                    </span>
                                    Following
                                </div>
                                <div>
                                    <span className='profile-stats-stat'>
                                &nbsp;
                                        {user?.likes ? user.likes : 0}
                                &nbsp;
                                    </span>
                                    Likes
                                </div>
                            </div>
                        </div>
                        <Stories />
                        <div className='gallery'>
                            {posts
                        && posts?.map((post, index) => (
                            <div
                                className='gallery-item'
                                key={post.id}
                                id={index}
                                onClick={loadPost}
                                onKeyPress={loadPost}
                                role='button'
                                tabIndex='0'
                            >
                                <img src={post.url} alt='post' />
                                <div className='gallery-item-info'>
                                    <span>
                                        <VscHeart className='icon' />
                                        {post.likeCount ? post.likeCount : 0}
                                    </span>
                                    <span>
                                        <BsChat className='icon' />
                                        {post.commentCount ? post.likeCount : 0}
                                    </span>
                                </div>
                            </div>
                        ))}
                            <div className='gallery-item'>
                                <img src='https://via.placeholder.com/293x293' alt='placeholder' />
                                <div className='gallery-item-info'>
                                    <span>
                                        <VscHeart className='icon' />
                                        0
                                    </span>
                                    <span>
                                        <BsChat className='icon' />
                                        0
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {currentPost && showPost ? (
                        <div
                            className='current-post'
                            onClick={() => {
                                setShowPost(false);
                            }}
                            onKeyPress={() => {
                                setShowPost(false);
                            }}
                            tabIndex='0'
                            role='button'
                        >
                            <AiOutlineClose
                                className='close-icon'
                                onClick={() => {
                                    setShowPost(false);
                                }}
                            />
                            <Post post={currentPost} />
                        </div>
                    ) : null}
                </div>
            )

            : <h1>Page does not exist</h1>
    );
}

export default Profile;
