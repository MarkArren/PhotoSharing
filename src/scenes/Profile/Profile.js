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

function Profile() {
    const { currentUser, currentUserInfo } = useAuth();
    const [posts, setPosts] = useState(null);
    const [currentPost, setCurrentPost] = useState();
    const [showPost, setShowPost] = useState(false);

    useEffect(() => {
        const unsubscribe = firestore
            .collection('users')
            .doc(currentUser.uid)
            .collection('posts')
            .orderBy('timestamp', 'desc')
            .get()
            .then((querySnapshot) => {
                const data = querySnapshot.docs.map((doc) => {
                    const post = doc.data();
                    post.id = doc.id;

                    // Add owner of post
                    post.user = {
                        name: currentUserInfo?.name,
                        username: currentUserInfo?.username,
                        uid: currentUser.uid,
                    };
                    return post;
                });
                setPosts(data);
                console.log(data);
            });

        return unsubscribe;
    }, [setPosts]);

    const loadPost = (e) => {
        setCurrentPost(posts[e.currentTarget.id]);
        setShowPost(true);
    };

    return (
        <div className='profile-page'>
            <Navbar />
            <div className='profile-container'>
                <div className='profile'>
                    <div className='profile-image'>
                        <img
                            src={
                                currentUserInfo?.profile_pic
                                    ? currentUserInfo?.profile_pic
                                    : 'http://via.placeholder.com/200x200'
                            }
                            alt='profile-pic'
                        />
                    </div>
                    <div className='profile-name'>
                        <span>{currentUserInfo?.username}</span>
                        &nbsp;
                        <span className='name'>{currentUserInfo?.name}</span>
                    </div>
                    <div className='profile-interaction'>
                        <Link to='/edit'>
                            <button type='button'>Edit Profile</button>
                        </Link>
                        <Link to='/logout'>
                            <button type='button'>Logout</button>
                        </Link>
                    </div>
                    <div className='profile-bio'>{currentUserInfo?.bio}</div>
                    <div className='profile-stats'>
                        <div>
                            <span className='profile-stat'>
                                {currentUserInfo?.followers}
                                &nbsp;
                            </span>
                            Followers
                        </div>
                        <div>
                            <span className='profile-stat'>
                                &nbsp;
                                {currentUserInfo?.following}
                                &nbsp;
                            </span>
                            Following
                        </div>
                        <div>
                            <span className='profile-stat'>
                                &nbsp;
                                {currentUserInfo?.likes}
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
                        <img src='http://via.placeholder.com/293x293' alt='placeholder' />
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
                <div className='current-post'>
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
    );
}

export default Profile;
