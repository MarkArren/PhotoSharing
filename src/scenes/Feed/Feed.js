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
    const [storyFeed, setStoryFeed] = useState(null);

    /**
     * Fecthes user feed depending on feedType
     */
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
                });
            return unsubscribe;
        }
        const unsubscribe = firestore
            .collectionGroup('posts')
            .orderBy('timestamp', 'desc')
            .get()
            .then((querySnapshot) => {
                const data = querySnapshot.docs.map((doc) => {
                    const post = doc.data();
                    post.id = doc.id;
                    return post;
                });
                setFeed(data);
            });
        return unsubscribe;
    }, [feedType]);

    /**
     * Fetches users story feed from database
     */
    useEffect(() => {
        const date = new Date();
        date.setDate(date.getDate() - 1);

        const unsubscribe = firestore
            .collection('users')
            .doc(currentUser.uid)
            .collection('storyFeed')
            .where('timestamp', '>', date)
            .orderBy('timestamp', 'desc')
            .get()
            .then((querySnapshot) => {
                const data = querySnapshot.docs.map((doc) => {
                    const story = doc.data();
                    story.id = doc.id;
                    return story;
                });
                setStoryFeed(data);
            });
        return unsubscribe;
    }, []);

    return (
        <div>
            <Navbar />
            <div className='feed-selector'>
                <div className={feedType === 0 ? 'feed-selector-text active' : 'feed-selector-text'} onClick={() => setFeedType(0)} onKeyPress={() => setFeedType(0)} role='button' tabIndex='0'>Following</div>
                <div className='feed-selector-divider' />
                <div className={feedType === 0 ? 'feed-selector-text' : 'feed-selector-text active'} onClick={() => setFeedType(1)} onKeyPress={() => setFeedType(1)} role='button' tabIndex='0'>For You</div>
            </div>
            <div className='feed'>
                <div className='feed-posts'>
                    {feed && feed?.map((post) => <Post post={post} key={post.id} />)}
                    {feed && feed.length === 0
                        ? (
                            <h3>
                                No posts please follow someone to see posts
                                or explore posts by clicking &quot;For You&quot; above
                            </h3>
                        )
                        : null}
                </div>
                {storyFeed && storyFeed.length > 0 ? <Stories stories={storyFeed} /> : null}

            </div>
        </div>
    );
}

export default Feed;
