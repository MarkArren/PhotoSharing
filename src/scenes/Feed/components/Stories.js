/* eslint-disable react/prop-types */
import './Stories.scss';
import React, { useState } from 'react';
import { AiOutlineClose, AiFillLeftCircle, AiFillRightCircle } from 'react-icons/ai';
import { stringFromTime } from '../../../Helper';

// eslint-disable-next-line react/prop-types
function Stories({ stories }) {
    const [showStory, setShowStory] = useState(false);
    const [currentStoryIndex, setCurrentStoryIndex] = useState();

    // Sets the story index to the id of the story
    const handleStoryClick = (e) => {
        setCurrentStoryIndex(stories.findIndex((x) => x.id === e.currentTarget.id));
        setShowStory(true);
        return 1;
    };

    const handlePreviousStory = (e) => {
        if (currentStoryIndex - 1 < 0) {
            setShowStory(false);
            setCurrentStoryIndex(null);
            return 1;
        }
        setCurrentStoryIndex(currentStoryIndex - 1);
        return 1;
    };

    const handleNextStory = (e) => {
        if (currentStoryIndex + 2 > stories.length) {
            setShowStory(false);
            setCurrentStoryIndex(null);
            return 1;
        }
        setCurrentStoryIndex(currentStoryIndex + 1);
        return 1;
    };

    const storyViewPopup = () => (
        <div
            className='story-view-container'
            onClick={(e) => { if (e.target.className === 'story-view-container') setShowStory(false); }}
            onKeyDown={(e) => { if (e.target.className === 'story-view-container') setShowStory(false); }}
            tabIndex='0'
            role='button'
        >
            <AiOutlineClose className='story-view-container-close' onClick={() => { setShowStory(false); }} />
            <AiFillLeftCircle className='story-view-control' onClick={handlePreviousStory} onKeyDown={handlePreviousStory} tabIndex='0' role='button' />
            <div className='story-view'>
                <img src={stories[currentStoryIndex]?.url} alt='Story' className='story-view-image' />
                <div className='story-view-info'>
                    <img className='story-view-profilepic' src={stories[currentStoryIndex]?.user?.profile_pic} alt='Story' />
                    <div className='story-view-username'>{stories[currentStoryIndex]?.user?.username}</div>
                    <div className='timestamp'>{stringFromTime(stories[currentStoryIndex]?.timestamp, true)}</div>
                </div>
            </div>

            <AiFillRightCircle className='story-view-control' onClick={handleNextStory} onKeyDown={handleNextStory} tabIndex='0' role='button' />
        </div>
    );

    return (
        <div className='stories-container'>
            {showStory && currentStoryIndex != null ? storyViewPopup() : null}
            <div className='stories'>
                {stories && stories?.map((story) => (
                    <div className='story-preview' key={story.id} id={story.id} onClick={handleStoryClick} onKeyDown={handleStoryClick} tabIndex='0' role='button'>
                        <img src={story?.url} alt='profile-pic' />
                        <div className='story-preview-text'>
                            <div className='username'>{story?.user?.username}</div>
                            <div className='timestamp'>{stringFromTime(story?.timestamp, true)}</div>
                        </div>
                    </div>
                ))}
                {/* <div className='story-preview'>
                    <img src='http://via.placeholder.com/168x280' alt='profile-pic' />
                    <div className='story-preview-text'>
                        <div className='username'>Username</div>
                        <div className='timestamp'>5m ago</div>
                    </div>
                </div>
                <div className='story-preview'>
                    <img src='http://via.placeholder.com/168x280' alt='profile-pic' />
                    <div className='story-preview-text'>
                        <div className='username'>Username</div>
                        <div className='timestamp'>5m ago</div>
                    </div>
                </div>
                <div className='story-preview'>
                    <img src='http://via.placeholder.com/168x280' alt='profile-pic' />
                    <div className='story-preview-text'>
                        <div className='username'>Username</div>
                        <div className='timestamp'>5m ago</div>
                    </div>
                </div>
                <div className='story-preview'>
                    <img src='http://via.placeholder.com/168x280' alt='profile-pic' />
                    <div className='story-preview-text'>
                        <div className='username'>Username</div>
                        <div className='timestamp'>5m ago</div>
                    </div>
                </div>
                <div className='story-preview'>
                    <img src='http://via.placeholder.com/168x280' alt='profile-pic' />
                </div>
                <div className='story-preview'>
                    <img src='http://via.placeholder.com/168x280' alt='profile-pic' />
                </div>
                <div className='story-preview'>
                    <img src='http://via.placeholder.com/168x280' alt='profile-pic' />
                </div>
                <div className='story-preview'>
                    <img src='http://via.placeholder.com/168x280' alt='profile-pic' />
                </div>
                <div className='story-preview'>
                    <img src='http://via.placeholder.com/168x280' alt='profile-pic' />
                </div> */}
            </div>
        </div>
    );
}

export default Stories;
