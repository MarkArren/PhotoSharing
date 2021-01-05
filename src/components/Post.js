/* eslint-disable react/prop-types */
import './Post.scss';
import React, { useState } from 'react';
import { IconContext } from 'react-icons';
import { VscHeart } from 'react-icons/vsc';
import { BsChat } from 'react-icons/bs';
import { AiOutlineSend } from 'react-icons/ai';
import { RiHeartFill } from 'react-icons/ri';

import PropTypes, { object } from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import Comment from './Comment';
import { firestore } from '../services/firebase';
import { useAuth } from '../context/AuthConext';
// import { firestore } from '../services/firebase';

function Post({ post }) {
    const { currentUser, currentUserInfo } = useAuth();
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState(null);
    const [commentCount, setCommentCount] = useState(post.commentCount);

    const [commentInput, setCommentInput] = useState('');
    const [hasLiked, setHasLiked] = useState(post.hasLiked);
    const [likeCount, setLikeCount] = useState(post.likeCount);

    const [height, setHeight] = useState(0);

    const viewComments = (refresh = false) => {
        setHeight(document.getElementById(post?.id).clientHeight);

        if (!post?.user?.uid) {
            console.log('no uid for post');
            return;
        }

        // Fetch comments from server
        if ((!showComments || !refresh) && post?.user?.uid) {
            firestore
                .collection('users')
                .doc(post?.user?.uid)
                .collection('posts')
                .doc(post.id)
                // post.post
                .collection('comments')
                .orderBy('timestamp', 'asc')
                .get()
                .then((querySnapshot) => {
                    const data = querySnapshot.docs.map((doc) => {
                        const comment = doc.data();
                        comment.id = doc.id;
                        return comment;
                    });
                    setComments(data);
                    setCommentCount(querySnapshot.size);
                });
        }
        // Toggle show comments
        if (refresh) setShowComments(!showComments);
    };

    const handleSubmitComment = (e) => {
        if (!currentUser) {
            // window.location.reload();
            return;
        }
        if (!commentInput) {
            return;
        }
        if (!post?.user?.uid) {
            return;
        }

        firestore
            .collection('users')
            .doc(post?.user?.uid)
            .collection('posts')
            .doc(post.id)
            // post.post
            .collection('comments')
            .add({
                comment: commentInput,
                user: {
                    username: currentUserInfo.username,
                    name: currentUserInfo.name,
                    uid: currentUser.uid,
                },
                timestamp: new Date(),
            })
            .then(() => {
                viewComments(false);
                setCommentInput('');
            });

        e.preventDefault();
    };

    const handleSubmitLike = (e) => {
        if (!currentUser) {
            return;
        }

        setHasLiked(!hasLiked);

        // TODO change to cloud function
        firestore
            .collection('users')
            .doc(post?.user?.uid)
            .collection('posts')
            .doc(post.id)
            // post.post
            .collection('likes')
            .where('uid', '==', currentUser.uid)
            .get()
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    // Unlike post
                    querySnapshot.docs.forEach((doc) => {
                        doc.ref.delete();
                    });
                    setLikeCount(likeCount - 1);

                    // Unlike post in feed
                    firestore
                        .collection('users')
                        .doc(currentUser.uid)
                        .collection('feed')
                        .doc(post.id)
                        .set({ hasLiked: false }, { merge: true });
                } else {
                    // Like post
                    firestore
                        .collection('users')
                        .doc(post?.user?.uid)
                        .collection('posts')
                        .doc(post.id)
                        // post.post
                        .collection('likes')
                        .add({
                            user: {
                                username: currentUserInfo.username,
                                name: currentUserInfo.name,
                                uid: currentUser.uid,
                            },
                            timestamp: new Date(),
                        })
                        .then();

                    // Like post in feed
                    firestore
                        .collection('users')
                        .doc(currentUser.uid)
                        .collection('feed')
                        .doc(post.id)
                        .set({ hasLiked: true }, { merge: true });
                    setLikeCount(likeCount + 1);
                }
            });

        e.preventDefault();
    };

    return (
        <div className='post-container'>
            <div className='post' id={post?.id}>
                <div className='top'>
                    <div className='post-top-profilepic'>
                        <img
                            src={
                                post?.user?.profile_pic
                                    ? post.user.profile_pic
                                    : 'http://via.placeholder.com/360x360'
                            }
                            alt='Avatar'
                        />
                    </div>
                    <div className='post-top-username'>
                        <span className='name'>{post?.user?.name}</span>
                        &nbsp;
                        <span className='username'>{post?.user?.username}</span>
                    </div>
                    <div className='post-top-caption'>{post.caption}</div>
                </div>
                <div className='post-img'>
                    <img src={post.url} alt='Post' />
                </div>
                <div className='post-interaction'>
                    <IconContext.Provider
                        value={{
                            color: 'hsl(0,0%, 90%)',
                            style: { verticalAlign: 'middle' },
                            className: 'global-class-name',
                        }}
                    >
                        <span
                            role='button'
                            className='cursor'
                            onClick={handleSubmitLike}
                            onKeyDown={handleSubmitLike}
                            tabIndex='0'
                        >
                            {hasLiked ? (
                                <RiHeartFill
                                    size='30px'
                                    type='submit'
                                    className='icon'
                                    style={{ fill: 'red' }}
                                />
                            ) : (
                                <VscHeart size='30px' type='submit' className='icon like' />
                            )}
                            {likeCount}
                        </span>

                        <span
                            role='button'
                            className='cursor'
                            onClick={viewComments}
                            onKeyDown={viewComments}
                            tabIndex='0'
                        >
                            <BsChat size='27px' type='submit' className='icon comment' />
                            {commentCount}
                        </span>
                    </IconContext.Provider>
                </div>
                <div className='post-comments'>
                    {post.topComments?.map((topComment) => (
                        <div key={topComment}>
                            <span className='name'>{topComment.split(' ', 2)[0]}</span>
                            &nbsp;
                            {topComment.split(' ', 2)[1]}
                        </div>
                    ))}
                    {commentCount > 0 && (
                        <span
                            onClick={viewComments}
                            onKeyDown={viewComments}
                            role='button'
                            tabIndex='0'
                            className='name username view-all cursor'
                        >
                            View all comments
                        </span>
                    )}
                </div>
            </div>
            {showComments ? (
                <div className='comment-container' style={{ height }}>
                    <div className='comments' refresh={comments}>
                        {comments
                            && comments?.map((comment) => (
                                <Comment comment={comment} key={comment.id} />
                            ))}
                    </div>
                    <form className='form' onSubmit={handleSubmitComment}>
                        <input
                            type='text'
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            placeholder='Enter Comment'
                        />
                        <AiOutlineSend
                            type='submit'
                            size='25px'
                            className='icon-send'
                            onClick={handleSubmitComment}
                        />
                    </form>
                </div>
            ) : null}
        </div>
    );
}

Post.propTypes = {
    // post: PropTypes.shape({caption: }),
};

export default Post;
