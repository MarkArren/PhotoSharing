# Photo Sharing via Cloud
Hosted at https://ce301-capstone.web.app/

# Abstract
Social media is more popular than ever and with everyone having a camera in their pocket I created a platform where users can share parts of their life through photos. My project is a photo sharing social media platform. Users can post photos and videos to their profile or stories for their followers to see and interact with by liking and commenting. Users can interact with other users by following them or messaging them. With the numerous devices that are being used today the project was designed from the ground up to be responsive to accommodate multiple screen sizes.
The technologies used are React, a JavaScript library used to create interactive UIs and build a modern single page application, Firebase, a backend as a service allowing rapid development which handles authentication, the database, storage buckets, cloud functions and hosting, Sass, a pre-processor scripting language.


# Contents
* 1 [Introduction](./docs/Introduction.md)
* 2 Firebase Database
    * 2.1 [User](./docs/Firestore.md#User)
    * 2.2 [Post](./docs/Firestore.md#Post)
    * 2.3 [Story](./docs/Firestore.md#Story)
    * 2.4 [Messages](./docs/Firestore.md#Messages)
* 3 Firebase Cloud Functions
    * 3.1 [createUser](./docs/CloudFunctions.md#createUser)
    * 3.2 [deleteUser](./docs/CloudFunctions.md#deleteUser)
    * 3.3 [sendNotification](./docs/CloudFunctions.md#sendNotification)
    * 3.4 [createPostFeeds](./docs/CloudFunctions.md#createPostFeeds)
    * 3.5 [followUserFeed](./docs/CloudFunctions.md#followUserFeed)
    * 3.6 [fanOutStory](./docs/CloudFunctions.md#fanOutStory)
    * 3.7 [followUserStoryFeed](./docs/CloudFunctions.md#followUserStoryFeed)
* 4 Pages
    * 4.1 [Login/ Signup](./docs/Pages.md#Login%2F%20Signup)
    * 4.2 [Feed](./docs/Pages.md#Feed)
    * 4.3 [Messages](./docs/Pages.md#Messages)
    * 4.4 [Profile](./docs/Pages.md#Profile)
    * 4.5 [Upload](./docs/Pages.md#Upload)
* 5 Components
    * 5.1 [Navbar](./docs/Components.md#Navbar)
    * 5.2 [Post](./docs/Components.md#Post)
    * 5.3 [Notification](./docs/Components.md#Notification)
    * 5.4 [UploadForm](./docs/Components.md#UploadForm)
    * 5.4 [Stories](./docs/Components.md#Stories)
* 6 Helper Functions
    * 6.1 [sendNotification](./docs/HelperFunctions.md#sendNotification)
    * 6.2 [followUser](./docs/HelperFunctions.md#followUser)
    * 6.3 [uploadPost](./docs/HelperFunctions.md#uploadPost)
    * 6.4 [uploadStory](./docs/HelperFunctions.md#uploadStory)

