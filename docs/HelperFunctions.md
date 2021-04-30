# **Helper Functions**
# sendNotification
This function is used to send a notification by calling the cloud function [sendNotification](./CloudFunctions#sendNotification) by sending a POST request with the parameters in a JSON for the body.

## Parameters
 * currentUser - The current user logged in
 * type - The type of notification (0: following, 1: like, 2: comment)
 * toUID - The user receiving the notification
 * post - (If type>0) The post being liked/ commented
 * remove - Bool to remove notification

---
 # followUser
 This function is used to follow/ unfollow a user. It updates the current users [following](./Firestore.md#Following) subcollection and the targets users [followers](./Firestore.md#Followers) subcollection in a batched write

 ## Parameters
 * currentUser - Current logged in user
 * currentUserInfo - Current logged in user info
 * user - User to follow
 * unfollow - True if user is unfollowing

 ## Returns
After the function has completed it returns:
* 1 - User is now following
* 2 - User is not unfollowing
* -1 - If an error has occurred

---
# uploadPost
This function uploads a post with the provided image and caption. 

The function first uploads the image to the storage bucket where it is stored and gets the URL of that image. With the URL it then creates a document for the post in the users [posts](./Firestore.md#Posts) subcollection.


## Parameters
 * currentUser - Current logged in user
 * currentUserInfo - Current logged in user info
 * image - Image to upload
 * caption - Caption for image



---
# uploadStory
This function uploads a story with the provided image.

The function first uploads the image to the storage bucket where it is stored and gets the URL of that image. With the URL it then creates a document for the story in the users [stories](./Firestore.md#Stories) subcollection.


## Parameters
 * currentUser - Current logged in user
 * currentUserInfo - Current logged in user info
 * image - Image to upload

# updatePostsandStories
This function updates all the users posts and stories with their new profile information. This is called when a user changes their name, username or profile picture.

The function first gets the users updated information from the database. With that information it then writes to all the users *posts* and *stories* in their  respective collections. This change is then automatically fanned out to all the users followers with the cloud functions [createPostFeeds](./CloudFunctions.md#createPostFeeds) and [fanOutStory](./CloudFunctions.md#fanOutStory)


## Parameters
 * currentUser - Current logged in user

### [Chapter 7 Storage Bucket](./StorageBucket.md)