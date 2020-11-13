import './Post.scss';
import { IconContext } from "react-icons";
import { VscHeart } from "react-icons/vsc";
import { BsChat } from "react-icons/bs";

// TODO replace placeholder text and images with real image

function Post(props) {
    return(
        <div className="post">
            <div className="post-top">
                <div className="post-top-profilepic">
                    <img src={process.env.PUBLIC_URL + 'avatar.png'} alt="Avatar"></img>
                </div>
                <div className="post-top-username">
                    <span className="username">Name</span> Username 
                </div>
                <div className="post-top-caption">
                    Caption Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur condimentum, mi eget porta rutrum, orci lorem malesuada metus, at bibendum lectus est vitae felis.
                </div>

            </div>
            <div className="post-img">
                <img src={process.env.PUBLIC_URL + 'placeholder.png'} alt="Post"></img>
            </div>
            <div className="post-interaction">
                <IconContext.Provider value={{ color: "hsl(0,0%, 90%)", style: { verticalAlign: "middle" }, className: "global-class-name" }}>
                <VscHeart size= "30px"/> 123,456 Likes &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<BsChat size= "27px"/> 12,0000 Comments
                </IconContext.Provider>
            </div>
            <div className="post-comments">
                <div><span className="username">Username</span> This is a comment </div>
                <div><span className="username">Username</span> This is a comment </div>
                <div><span className="username">Username</span> This is a comment </div>
            </div>
        </div>
    );
}
export default Post;