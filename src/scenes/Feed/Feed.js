import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Post from '../../components/Post';
import Stories from './components/Stories';
import { firestore } from '../../services/firebase';
import { useAuth } from '../../context/AuthConext';

import './Feed.scss';

function Feed() {
    const { currentUser } = useAuth();
    const [feed, setFeed] = useState(null);
    const [feedType, setFeedType] = useState(0);

    useEffect(() => {
        if (feedType === 0) {
            const unsubscribe = firestore
                .collection('users')
                .doc(currentUser.uid)
                .collection('feed')
                .orderBy('timestamp', 'desc')
                .get()
                .then((querySnapshot) => {
                    const data = querySnapshot.docs.map((doc) => {
                        const post = doc.data();
                        post.id = doc.id;
                        return post;
                    });
                    setFeed(data);
                    console.log(data);
                });

            return unsubscribe;
        } if (feedType === 1) {
            const unsubscribe = firestore
                .collection('users')
                .doc(currentUser.uid)
                .collection('feed')
                .orderBy('timestamp', 'desc')
                .get()
                .then((querySnapshot) => {
                    const data = querySnapshot.docs.map((doc) => {
                        const post = doc.data();
                        post.id = doc.id;
                        return post;
                    });
                    setFeed(data);
                    console.log(data);
                });
            return unsubscribe;
        }
    }, [setFeed]);

    // console.log(feed);

    return (
        <div>
            <Navbar />
            <div className='feed-selector'>
                <div>Following</div>
                <div>For You</div>
            </div>
            <div className='feed'>
                <div className='feed-posts'>
                    {feed && feed?.map((post) => <Post post={post} key={post.id} />)}
                </div>
                <Stories />
            </div>
        </div>
    );
}

export default Feed;
