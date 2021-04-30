/* eslint-disable react/prop-types */
import './Post.scss';
import React, { useState } from 'react';
import { IconContext } from 'react-icons';
import { VscHeart, VscChevronLeft } from 'react-icons/vsc';
import { BsChat } from 'react-icons/bs';
import { AiOutlineSend, AiOutlineEllipsis } from 'react-icons/ai';
import { RiHeartFill } from 'react-icons/ri';
import PropTypes, { object } from 'prop-types';
import { sendNotification } from '../FirebaseHelper';
import Comment from './Comment';
import { firestore } from '../services/firebase';
import { useAuth } from '../context/AuthConext';
import { stringFromTime } from '../Helper';

function Post({ post }) {
    const { currentUser, currentUserInfo } = useAuth();
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState(null);
    const [commentCount, setCommentCount] = useState(post.commentCount);

    const [commentInput, setCommentInput] = useState('');
    const [hasLiked, setHasLiked] = useState(post.hasLiked);
    const [likeCount, setLikeCount] = useState(post.likeCount);

    const [moreOpen, setMoreOpen] = useState(false);

    const viewComments = (refresh = false) => {
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

    const handleSubmitComment = async (e) => {
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
                    profile_pic: currentUserInfo?.profile_pic || '',
                },
                timestamp: new Date(),
            })
            .then(() => {
                viewComments(false);
                setCommentInput('');
            });

        // Send comment notification
        sendNotification(currentUser, 2, post?.user?.uid, post);
        e.preventDefault();
    };

    const handleSubmitLike = async (e) => {
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
            .collection('likes')
            .doc(currentUser.uid)
            .get()
            .then(async (doc) => {
                if (doc.exists) {
                    // Unlike post
                    doc.ref.delete();
                    setLikeCount(likeCount - 1);

                    // Unlike post in feed
                    firestore
                        .collection('users')
                        .doc(currentUser.uid)
                        .collection('feed')
                        .doc(post.id)
                        .set({ hasLiked: false }, { merge: true });

                    // Remove like notification
                    sendNotification(currentUser, 1, post?.user?.uid, post, true);
                } else {
                    // Like post
                    firestore
                        .collection('users')
                        .doc(post?.user?.uid)
                        .collection('posts')
                        .doc(post.id)
                        // post.post
                        .collection('likes')
                        .doc(currentUser.uid)
                        .set({
                            user: {
                                username: currentUserInfo.username,
                                name: currentUserInfo.name,
                                uid: currentUser.uid,
                            },
                            timestamp: new Date(),
                        });

                    // Like post in feed
                    firestore
                        .collection('users')
                        .doc(currentUser.uid)
                        .collection('feed')
                        .doc(post.id)
                        .set({ hasLiked: true }, { merge: true });
                    setLikeCount(likeCount + 1);

                    console.log(currentUser);
                    console.log(currentUser.getIdToken().then());

                    // Send like notification
                    sendNotification(currentUser, 1, post?.user?.uid, post);
                }
            });

        e.preventDefault();
    };

    const handleDeletePost = () => {
        // Delete post from database, cloud functions will handle deleting it from other user feeds
        firestore
            .collection('users')
            .doc(currentUser?.uid)
            .collection('posts')
            .doc(post.id)
            .delete()
            .then(() => {
                console.log('Document successfully deleted!');
            })
            .catch((error) => {
                console.error('Error removing document: ', error);
            });
    };

    return (
        <div className='post-container'>
            <div className='post' id={post?.id}>
                <div className='post-top'>
                    <a className='post-top-profilepic' href={post?.user?.username}>
                        <img
                            alt='test'
                            src={post?.user?.profile_pic || 'https://via.placeholder.com/200'}
                        />
                    </a>
                    <a className='post-top-name' href={post?.user?.username}>{post?.user?.name}</a>
                    <a className='post-top-username' href={post?.user?.username}>{post?.user?.username}</a>
                    <span className='post-top-timestamp'>{post?.timestamp ? stringFromTime(post.timestamp) : '...'}</span>
                    <span className='post-top-caption'>{post.caption}</span>
                </div>
                <div className='post-middle'>
                    <img
                        alt='test'
                        src={post.url}
                    />
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
                            className='post-interaction-like'
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
                                <VscHeart size='30px' type='submit' className='post-interaction-icon' />
                            )}
                            {likeCount}
                        </span>

                        <span
                            role='button'
                            className='post-interaction-comment'
                            onClick={viewComments}
                            onKeyDown={viewComments}
                            tabIndex='0'
                        >
                            <BsChat size='27px' type='submit' className='post-interaction-icon' />
                            {commentCount}
                        </span>
                        <span
                            role='button'
                            className='post-interaction-more'
                            onClick={() => { setMoreOpen(!moreOpen); }}
                            onKeyDown={() => { setMoreOpen(!moreOpen); }}
                            tabIndex='0'
                        >
                            <AiOutlineEllipsis size='20px' type='submit' />

                        </span>
                    </IconContext.Provider>
                </div>
                {moreOpen ? (
                    <div className='popup-container'>
                        <div className='popup'>
                            {post?.user?.username === currentUserInfo?.username ? <button type='button' onClick={handleDeletePost}>Delete</button> : null}
                            <button type='button' onClick={() => { setMoreOpen(false); }}>Cancel</button>
                        </div>
                    </div>
                ) : null}
            </div>
            <div className='comments-container' style={{ visibility: showComments ? 'visible' : 'hidden' }}>

                <div className='comments-top'>
                    <button type='button' className='comments-top-back' onClick={viewComments}>
                        <VscChevronLeft size='30px' />
                    </button>
                    <h3 className='comments-top-title'>Comments</h3>
                </div>
                <div className='comments' refresh={comments}>
                    {comments
                        && comments?.map((comment) => (
                            <Comment comment={comment} key={comment.id} />
                        ))}
                </div>
                <form className='comments-form' onSubmit={handleSubmitComment}>
                    <input
                        type='text'
                        className='comments-form-input'
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder='Enter Comment'
                    />
                    <AiOutlineSend
                        type='submit'
                        size='25px'
                        className='comments-form-send'
                        onClick={handleSubmitComment}
                    />
                </form>
            </div>

        </div>
    );
}

Post.propTypes = {
    // post: PropTypes.shape({caption: }),
};

export default Post;
