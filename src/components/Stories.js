import './Stories.scss';
import StoryPreview from './StoryPreview.js';

function Stories(){
    return(
        <div className="stories">
        <h1>Stories</h1>
            <div class='row'>
                <div class='column'>
                    <StoryPreview />
                </div>
                <div class='column'>
                    <StoryPreview />
                </div>
            </div>
            <div class='row 2'>
                <div class='column'>
                    <StoryPreview />
                </div>
                <div class='column'>
                    <StoryPreview />
                </div>
            </div>
            <div class='row 3'>
                <div class='column'>
                    <StoryPreview />
                </div>
                <div class='column'>
                    <StoryPreview />
                </div>
            </div>
            <div class='row 4'>
                <div class='column'>
                    <StoryPreview />
                </div>
                <div class='column'>
                    <StoryPreview />
                </div>
            </div>
        </div>
    );
}

export default Stories;