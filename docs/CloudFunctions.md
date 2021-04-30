# Cloud Functions
Cloud functions are important as they allow the database to automatically react to events and make the database more secure by running things server side inside of client side.

## createUser
<!-- TODO add reference to sign up page? -->
createUser is an event driven cloud function which is triggered when a new user is created with firebase authentication which is done on sign up. The function creates the user document in the user’s collection and sets the fields for followers, following, likes, posts, bio, profile_pic, and createdOn with their default values.

## deleteUser
Delete user is event driven which is triggered when a user deletes their account from firebase authentication. The function deletes the users unique document in the [users’ collection](./Firestore.md#User)

## createPostFeeds
createPostFeeds is a cruicial function which fans out posts to followers’ feeds when a post is created or edited. This function is event driven and is triggered when a document is created or edited in all users [posts](./Firestore.md#Posts) subcollection.

It does this by first getting all the user’s followers. Then with that list for every follower it writes or deletes the post to every follower’s feed with a batch write. If it is deleting it will delete the image stored in the storage bucket. After that it will write or remove the post from the users own feed.

## followUserFeed
followUserFeed is event driven which is triggered when a users [followers](./Firestore.md#Followers) subcollection is changed, by either a follow or unfollow.
The purpose of this function is to add or remove another users posts to the current user’s feed.

It does this by getting the users UID then checking if they are following or unfollowing. If following it will get all the posts from that [users subcollection](./Firestore.md#Posts) and in a batched write add them all to the user’s feed. 
If unfollowing it will get all posts in the users feed by that user and in a batched write delete them all.

## sendNotification
sendNotification is a callable HTTP function. Which is used to send a notification to a user.

When called it checks if all the parameters which are required are there. It accepts the following parameters:
* type - Type of notification (0: Following, 1: Like, 2: Comment)
* toUID - UID of user being sent notification
* idToken - ID token of authenticated user
* post - (If type>0) Post regarding notification
* remove - Sets if removing notification

Note the post parameters is only needed if the type > 0

The idToken is then verified which returns the users UID, from that the users name, username and profile_pic are fetched from the database. 
Then the notification document is added or removed from the users [notifications subcollection](./Firestore.md#Notifications).

## fanOutStory
Fans out stories to their followers’ story feed when a story is created or changed. This function is event driven and is triggered when a document is created or edited in all users [stories](./Firestore.md#Stories) subcollection. 

How this function works is the exact same as [createPostFeeds](#createPostFeeds)

## followUserStoryFeed
followUserStoryFeed is an event driven function which is triggered when a users [followers](./Firestore.md#Followers) subcollection is changed, by either a follow or unfollow.
The purpose of this function is to add or remove another users’ stories to the current users’ story feed.

How this function works is the exact same as [followUserFeed](#followUserFeed)

---
### [Chapter 4 Pages](./Pages.md)