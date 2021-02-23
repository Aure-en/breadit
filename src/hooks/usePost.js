import { firestore } from "../firebase";

function usePost() {
  const createPost = async (
    author,
    subreadit,
    title,
    type,
    content,
    spoiler
  ) => {
    const ref = await firestore.collection("posts").doc();
    return ref.set({
      author: {
        id: author.uid,
        name: author.displayName,
      },
      type,
      title,
      content,
      date: new Date(),
      votes: {
        list: {},
        sum: 0,
      },
      subreadit: {
        id: subreadit.id,
        name: subreadit.name,
      },
      spoiler,
      id: ref.id,
    });
  };

  const editPost = (postId, content) => {
    return firestore.collection("posts").doc(postId).update({ content });
  };

  const deletePost = async (postId) => {
    // Delete the post document.
    firestore.collection("posts").doc(postId).delete();

    // Delete the post from the users' saved posts/comments.
    const savedPost = await firestore
      .collectionGroup("saved")
      .where("id", "==", postId)
      .get();
    savedPost.forEach((doc) => doc.ref.delete());

    const commentsId = [];
    const comments = await firestore
      .collection("comments")
      .where("post", "==", postId)
      .get();
    comments.docs.forEach((comment) => commentsId.push(comment.data().id));

    // Delete the comments from the users' saved comments.
    await Promise.all(
      commentsId.map(async (commentId) => {
        const savedComment = await firestore
          .collectionGroup("saved")
          .where("id", "==", commentId)
          .get();
        savedComment.forEach((doc) => doc.ref.delete());
      })
    );

    // Delete all the comments written on that post.
    commentsId.forEach(async (id) => {
      await firestore.collection("comments").doc(id).delete();
    });
  };

  const getPost = (postId) => {
    return firestore.collection("posts").doc(postId).get();
  };

  const getPosts = async (limit) => {
    const posts = [];
    const postsDocs = await firestore.collection("posts").limit(limit).get();
    postsDocs.docs.forEach((doc) => posts.push(doc.data().id));
    return posts;
  };

  const getPostsByVotes = async (limit) => {
    const posts = [];
    const postsDocs = await firestore
      .collection("posts")
      .orderBy("votes.sum", "desc")
      .limit(limit)
      .get();
    postsDocs.docs.forEach((doc) => posts.push(doc.data().id));
    return posts;
  };

  const getPostsByDate = async (limit) => {
    const posts = [];
    const postsDocs = await firestore
      .collection("posts")
      .orderBy("date", "desc")
      .limit(limit)
      .get();
    postsDocs.docs.forEach((doc) => posts.push(doc.data().id));
    return posts;
  };

  // According to the Firebase documentation, "in" only combines up to 10 equality clauses.
  // So it might be problematic if subscriptions.length > 10.
  const getSubscriptionsPostsByVotes = async (subscriptions, limit) => {
    const posts = [];
    const postsDocs = await firestore
      .collection("posts")
      .where("subreadit.id", "in", subscriptions)
      .orderBy("votes.sum", "desc")
      .limit(limit)
      .get();
    postsDocs.docs.forEach((doc) => posts.push(doc.data().id));
    return posts;
  };

  const getSubscriptionsPostsByDate = async (subscriptions, limit) => {
    const posts = [];
    const postsDocs = await firestore
      .collection("posts")
      .where("subreadit.id", "in", subscriptions)
      .orderBy("date", "desc")
      .limit(limit)
      .get();
    postsDocs.docs.forEach((doc) => posts.push(doc.data().id));
    return posts;
  };

  const getRecentPosts = async (limit) => {
    let posts = [];
    const postsDocs = await firestore
      .collection("posts")
      .orderBy("date", "desc")
      .limit(limit)
      .get();
    postsDocs.docs.forEach((doc) => posts.push(doc.data()));

    // Counts comments
    posts = await Promise.all(
      posts.map(async (post) => {
        const comments = await firestore
          .collection("comments")
          .where("post", "==", post.id)
          .where("parent", "==", null)
          .get();
        return { ...post, comments: comments.docs.length };
      })
    );

    // Counts upvotes
    posts = posts.map((post) => {
      return {
        ...post,
        upvotes: Object.values(post.votes).reduce(
          (sum, current) => sum + current,
          0
        ),
      };
    });
    return posts;
  };

  return {
    createPost,
    deletePost,
    editPost,
    getPost,
    getPosts,
    getPostsByVotes,
    getPostsByDate,
    getRecentPosts,
    getSubscriptionsPostsByVotes,
    getSubscriptionsPostsByDate,
  };
}

export default usePost;
