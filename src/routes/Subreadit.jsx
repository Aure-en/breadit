import React, { useState, useEffect } from "react";
import styled from "styled-components";
import usePost from "../hooks/usePost";
import PropTypes from "prop-types";
import useSubreadit from "../hooks/useSubreadit";
import PostPreview from "../components/posts/PostPreview";

function Subreadit({ match }) {
  const [subreadit, setSubreadit] = useState({});
  const [posts, setPosts] = useState([]);
  const [limit, setLimit] = useState(20);
  const { getSubreaditByName, getSubreaditPosts } = useSubreadit();
  const subreaditName = match.params.subreadit;

  useEffect(() => {
    (async () => {
      const subreadit = await getSubreaditByName(subreaditName);
      const posts = await getSubreaditPosts(subreadit.id, limit);
      setSubreadit(subreadit);
      setPosts(posts);
    })();
  }, []);

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

Subreadit.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      subreadit: PropTypes.string,
    }),
  }).isRequired,
};

export default Subreadit;
