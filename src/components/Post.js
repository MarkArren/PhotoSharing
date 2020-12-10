import './Post.scss';
import React, { useState } from 'react';
import { IconContext } from 'react-icons';
import { VscHeart } from 'react-icons/vsc';
import { BsChat } from 'react-icons/bs';
// import { firestore } from '../services/firebase';

// TODO replace placeholder text and images with real image

function Post(post) {
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState(null);
    const viewComments = () => {
        // Fetch data from server
        if (post.post.post) {
            // firestore.doc(post.post.post).get((querySnapshot) => {
            //     const data = querySnapshot.docs.map((doc) => doc.data());
            //     setComments(data);
            // });
            console.log('test 1');
            console.log(post.post.post);
            post.post.post
                .get((querySnapshot) => {
                    const data = querySnapshot.docs.map((doc) => doc.data());
                    setComments(data);
                    console.log('test 2');
                })
                .then(() => {
                    console.log(comments);
                    console.log('test 3');
                });
            // firestore
            //     .doc(post.post.post)
            //     .get((querySnapshot) => {
            //         const data = querySnapshot.docs.map((doc) => doc.data());
            //         setComments(data);
            //         console.log(data);
            //     })
            //     .then(() => {
            //         console.log(comments);
            //     });
        }
        // Flip show comments
        setShowComments(!showComments);
        console.log(comments);

        // Display comments on right hand side
    };

    return (
        <div className='post'>
            {console.log(post.post)}
            <div className='post-top'>
                <div className='post-top-profilepic'>
                    <img src={`${process.env.PUBLIC_URL}avatar.png`} alt='Avatar' />
                </div>
                <div className='post-top-username'>
                    <span className='username'>{post.post.user?.name}</span>
                    &nbsp;
                    {post.post.user?.username}
                </div>
                <div className='post-top-caption'>{post.post.caption}</div>
            </div>
            <div className='post-img'>
                <img src={post.post.url} alt='Post' />
            </div>
            <div className='post-interaction'>
                <IconContext.Provider
                    value={{
                        color: 'hsl(0,0%, 90%)',
                        style: { verticalAlign: 'middle' },
                        className: 'global-class-name',
                    }}
                >
                    <VscHeart size='30px' />
                    &nbsp;
                    {post.post.likeCount}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <BsChat size='27px' />
                    &nbsp;
                    {post.post.commentCount}
                </IconContext.Provider>
            </div>
            <div className='post-comments'>
                {post.post.topComments?.map((topComment) => (
                    <div>
                        <span className='username'>{topComment.split(' ', 2)[0]}</span>
                        &nbsp;
                        {topComment.split(' ', 2)[1]}
                    </div>
                ))}
                {post.post.commentCount > 0 && (
                    <span
                        onClick={viewComments}
                        onKeyDown={viewComments}
                        role='button'
                        tabIndex='0'
                    >
                        View all comments
                    </span>
                )}
            </div>
        </div>
    );
}
export default Post;
