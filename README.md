# Breadit

[Breadit - View site](https://breadit.web.app/)

## Description

Breadit is a Reddit clone, made with React and Firebase, as my [final assignment](https://www.theodinproject.com/paths/full-stack-javascript/courses/javascript/lessons/final-project) from The Odin Project's JavaScript's section.

## Features

1. Exploration

- Routing with React Router
- Separate feeds:
  * All: Posts from any Subreadit will be displayed in this feed.
  * Main:
    * If the user is not logged in, the main feed will be identical to the all feed.
    * If the user is logged in, the main feed will only display posts from communities the user is subscribed to.
 - On the main / all page, the Top Subreadits (the ones with most subscribers) will be displayed. They will also be displayed on   the navigation dropdown, making exploration easier.
 - More posts from a feed will be loaded when the user scrolls to the end.

2. Communities

- Communities, or "Subreadits", can currently be created by any logged-in user. For now, only this user will be able to remove any post from this community or to change its settings.
- Its customizables settings includes:
  * Name (cannot be changed once defined)
  * Description
  * Icon / banner
  * Rules
 
3. Content and discussion

  ➢ <ins>Posts</ins>

- Users can create 3 different types of posts:
  * Text posts: must contain a title, any additional content is not required.
  * Image posts: must contain a title and one or several images.
  * Link posts: must contain a title and a valid link.
    * If the link is a youtube link, the video will be embed in the post.
    * If it is a link towards another Breadit Post, the post will be displayed.
    * Any other link simply shows the URL along the title.
  * Users can show their interest / lack of interest in a post by upvoting or downvoting it.
  
➢ <ins>Comment</ins>

- Users can discuss using comments.
- Comments can be left on a post, or on another comment (it will then be nested).
- Just like for posts, users can show their interest / lack of interest by upvoting or downvoting a comment.

<ins>Notes:</ins>

- A rich text editor allows the users to format their posts and comments with different styles, lists, and also allows them to insert links in their content.
- Any post / comment can be edited and deleted by their author.

4. Users

- Users can modify their settings and profile informations from the User Settings page :
  * Settings: they can modify their email address, password, and delete their accounts.
  * Profile: they can modify their avatar, banner and description.
- Users' profiles can be visited to see their:
  * Posts
  * Comments
  * Informations (avatar, banner, description, karma...)
- Users get karma depending on their contributions (how liked their posts / comments are)
- Users can save posts, which they can see on the "Saved" tab of their profile.

5. Communication

- Users can interact by mentioning each others (ex: u/Bread)
- Users can also send each other messages in the Inbox Page.

6. Notifications

- Users will be notified when:
  * Another user mentions them in a post or a comment.
  * Another user comments on their post or reply to their comment.
  * Another user messages them.
  
7. Display

- Responsive
- Light and dark mode
