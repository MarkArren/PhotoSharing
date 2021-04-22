import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
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
import { followUser } from '../../FirebaseHelper';

function Profile(props) {
    const { currentUser, currentUserInfo } = useAuth();
    const [posts, setPosts] = useState(null);
    const [currentPost, setCurrentPost] = useState();
    const [showPost, setShowPost] = useState(false);
    const [user, setUser] = useState(null);
    const [userExists, setUserExists] = useState(true);
    const [doesFollow, setDoesFollow] = useState(false);

    async function handleFollow() {
        if (!currentUser || !user) {
            return;
        }

        const result = await followUser(currentUser, currentUserInfo, user, doesFollow);

        if (result === 1) {
            // User now following
            const tempUser = user;
            tempUser.followers += 1;
            setUser({ ...tempUser });
            setDoesFollow(true);
        } else if (result === 2) {
            // User now unfollowing
            const tempUser = user;
            tempUser.followers -= 1;
            setUser({ ...tempUser });
            setDoesFollow(false);
        }
    }

    function messageUser() {
        console.log('message button pressed');
    }

    useEffect(() => {
        if (!props.match.params.username) {
            setUserExists(false);
            return false;
        }

        const unsubscribe = firestore
            .collection('users')
            .where('username', '==', props.match.params.username)
            .get()
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    // Couldn't find username
                    setUserExists(false);
                } else {
                    // Set target user info
                    const tempUser = querySnapshot.docs[0].data();
                    tempUser.uid = querySnapshot.docs[0].id;
                    setUser(tempUser);

                    // Get targer users posts
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

                    // Check if user followers target user
                    firestore.doc(`users/${tempUser.uid}/followers/${currentUser?.uid}`).get().then((doc) => {
                        if (doc.exists) { setDoesFollow(true); }
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
                                    <button type='button' onClick={handleFollow}>
                                        {doesFollow ? 'Following' : 'Follow'}
                                    </button>
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
                        </div>
                    </div>
                    {currentPost && showPost ? (
                        <div
                            className='current-post'
                            onClick={(e) => {
                                if (e.target.className === 'current-post') {
                                    setShowPost(false);
                                }
                            }}
                            onKeyPress={(e) => {
                                if (e.target.className === 'current-post') {
                                    setShowPost(false);
                                }
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

Profile.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            username: PropTypes.string,
        }),
    }),
};

Profile.defaultProps = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            username: '',
        }),
    }),
};

export default Profile;
