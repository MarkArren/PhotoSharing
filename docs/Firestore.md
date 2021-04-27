# **Firebase Database**
## Database Structure
    .
    ├── messages                        collection
    │   └── combinedUID                 document
    └── users                           collection
        └── UUID                        document
            ├── posts                   collection
            ├── feed                    collection
            ├── stories                 collection
            ├── storyFeed               collection
            ├── followers               collection
            ├── following               collection
            └── notifications           collection

# User
UUID - User Unique Identifier

Every user on the site is stored in a document in the `users` root-level collection with an ID of the UUID. 
This document is automatically created when the user signs up with the cloud function [createUser](./CloudFunctions.md#createUser).

## Fields
This document stores the following fields about the user
* username - A unique username which is used to indentify the user
* name - The name of the user
* bio - The biography
* profile_pic - The profile picture
* followers - A count of the user's followers
* following - A count of the user's following
* likes - A count of the user's likes
* posts - A count of the user’s posts

## Collections
The sub-collections are important as they store the majority of the user data

### Posts
Post stores all posts which are uploaded by the user themselves. Posts are added to the users `posts` collection by the helper function [`uploadPost`](./HelperFunctions.md#uploadPost). Each document uses an automatically generated UID for the ID please see [here](#Post) for more information on each post document.

### Feed
Feed stores duplicate documents of every post from the users that they follow but only includes the field values, see [post](#Post) for more information. The only additional field which is added is `hasLiked` which sets if the user has liked that post.


Feed is automatically generated with a cloud function which is triggered when a user they follow posts or when they follow a new user, please see [createPostFeed](./CloudFunctions.md#createPostFeed) and [followUserFeed](./CloudFunctions.md#followUserFeed) to see more information, respectively.

### Stories
Post stores all stories which are uploaded by the user themselves. Each document uses an automatically generated UID for the ID. Please see [here](#Post) for more information on each story document

### StoryFeed
StoryFeed is the exact same as [feed](#Feed) but is used for stories instead of posts. The additional field `hasLiked` is changed to `hasViewed` which is set if the user has viewed the story.
It is also automically generated with [fanOutStory](./CloudFunctions.md#fanOutStory) and [followUserStoryFeed](./CloudFunctions.md#followUserStoryFeed). 

### Followers
Followers is used to store the followers of a user. 
Each document has an ID of the UUID of the follower and stores the following:
* timestamp
* user
    * name
    * uid
    * username

### Following
Following is used to store the users following a user. This is the same as `Followers` above.

### Notifications
Notifications stores all the user’s notifications. This is updated with the cloud function [sendNotification](./CloudFunctions.md#sendNotification) and is triggered when a user likes/ comments on a post or when a user follows them.
Each document stores the following:
<!-- TODO explain more in separate file or cloud function? -->
* timestamp
* type
* user
    * name
    * uid
    * username
* post (optional)
    * id
    * url
    * user
        * uid

---
# Post
Post is a document which stores all information related to a post.

## Fields
* caption - Caption of post
* url - URL of image stored in storage bucket
* timestamp
* commentCount - Count of comments
* likeCount - Count of likes
* user
    * name
    * profile_pic
    * uid
    * username

Notice that as a field it stores the user (author) of the post even though its already in the user’s sub-collection this is because when the cloud function fans the post out to every follower feed it needs this extra information. See [here](./CloudFunctions.md#createPostFeeds) for more information regarding the cloud function.
<!-- TODO talk more about this maybe inside writeup? -->
<!-- TODO talk about helper function which uploads this maybe in upload component -->

## Collections
### Likes
This stores all the users who have commented on the posts. The fields stored are:
* timestamp
* user
    * name
    * profile_pic
    * uid
    * username

### Comments
This stores all the users who have liked the posts. The fields stored are the same as `Likes` with an addtional field:
* comment

---
# Story
Post is a document which stores all information related to a story.

## Fields
* url - URL of image stored in storage bucket
* timestamp
* user
    * name
    * profile_pic
    * uid
    * username

Notice that as a field it stores the user (author) of the post even though its already in the user’s sub-collection this is because when the cloud function fans the post out to every follower feed it needs this extra information. See [here](./CloudFunctions.md#fanOutStory) for more information regarding the cloud function.

## Collections
### Views
This stores all the users who have viwed the story. The fields stored are:
* timestamp
* user
    * name
    * profile_pic
    * uid
    * username

---
# Messages
Messages is a root-level collection which stores all message conversations. The ID of each document is created by taking both UUID of each user sorting them and joining them together with an `_` to create an ID, this allows a unique ID for every conversation between all users. 

## Fields
* lastMessage - Last message in conversation
* timestamp - Timestamp of last message
* uid (map) - Map containing both users UID
* user1
    * username
    * name
    * uid
    * profile_pic
* user2
    * username
    * name
    * uid
    * profile_pic

## Collections
### Messages
This collection stores all the messages in the conversation. Each document stored has the following fields:
* text
* timestamp
* user
    * uid


---
### [Chapter 3 Firebase Cloud Functions](./CloudFunctions.md)