import React, { useState, useEffect } from "react";
import styled from "styled-components";
import usePost from "../hooks/usePost";
import PostPreview from "../components/posts/PostPreview";

function All() {
  const [posts, setPosts] = useState([]);
  const [limit, setLimit] = useState(20);
  const { getPosts } = usePost();

  useEffect(() => {
    (async () => {
      const posts = await getPosts(limit);
      setPosts(posts);
    })();
  }, [limit]);

  return (
    <div>
      {posts.map((post) => {
        return (
          <PostPreview
            key={post.id}
            subreaditId={post.subreadit}
            author={post.author.name}
            date={post.date}
            title={post.title}
            content={post.content}
            id={post.id}
          />
        );
      })}
    </div>
  );
}

export default All;
