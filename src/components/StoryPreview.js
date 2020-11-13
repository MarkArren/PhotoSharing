import './StoryPreview.scss'

function StoryPreview(props) {
    return(
    <div className="story-preview">
        <img src={process.env.PUBLIC_URL + 'placeholderStory.png'} alt="Story"></img>
        <div className="story-preview-text">
            <div className="username">Username</div>
            <div>5m ago</div>
        </div>
        
    </div>
    );
}

export default StoryPreview