import './Stories.scss';
import StoryPreview from './StoryPreview.js';

function Stories(){
    return(
        <div className="stories">
        <h1>Stories</h1>
            <div className='row'>
                <div className='column'>
                    <StoryPreview />
                </div>
                <div className='column'>
                    <StoryPreview />
                </div>
            </div>
            <div className='row 2'>
                <div className='column'>
                    <StoryPreview />
                </div>
                <div className='column'>
                    <StoryPreview />
                </div>
            </div>
            <div className='row 3'>
                <div className='column'>
                    <StoryPreview />
                </div>
                <div className='column'>
                    <StoryPreview />
                </div>
            </div>
            <div className='row 4'>
                <div className='column'>
                    <StoryPreview />
                </div>
                <div className='column'>
                    <StoryPreview />
                </div>
            </div>
        </div>
    );
}

export default Stories;