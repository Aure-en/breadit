import React, { useState, useEffect } from "react";
import styled from "styled-components";
import usePost from "../hooks/usePost";
import useSubreadit from "../hooks/useSubreadit";
import PostPreview from "../components/posts/PostPreview";

function All() {
  const [posts, setPosts] = useState([]);
  const [limit, setLimit] = useState(20);
  const { getPosts } = usePost();
  const { getSubreadit } = useSubreadit();

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
            subreadit={post.subreadit}
            author={post.author.name}
            date="2/2"
            content={post.content}
          />
        );
      })}
    </div>
  );
}

export default All;
