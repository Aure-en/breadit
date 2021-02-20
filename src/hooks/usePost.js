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
    const ref = await firestore.collection("posts").add({
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
    });
    ref.update({ id: ref.id });
    return ref.id;
  };

  const deletePost = (postId) => {
    // Delete the post id from the subreadit's posts.
    return firestore.collection("posts").doc(postId).delete();
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
