import Navbar from './Navbar.js';
import Post from './Post.js';
import Stories from './Stories.js';

import './Feed.scss';

function Feed() {
    return(
        <div>
            <Navbar />
            <div className="feed-selector">
                <div>Following</div>
                <div>For You</div>
            </div>
            <h1> </h1>
            <div className="posts-container"> 
                <Post />
            </div>
            <div className="stories-container"> 
                <Stories />
            </div>
        </div>
    );
}

export default Feed;