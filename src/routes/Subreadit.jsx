import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import useSubreadit from "../hooks/useSubreadit";
import PostPreview from "../components/posts/PostPreview";
import SubreaditInfo from "../components/aside/SubreaditInfo";
import SubreaditRules from "../components/aside/SubreaditRules";

const colors = {
  background: "rgb(241, 236, 230)",
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  background: ${colors.background};
  padding: 3rem;
  height: 100%;
  flex: 1;
`;

const Container = styled.main`
  max-width: 40rem;
  flex: 1;

  & > * {
    margin-bottom: 1rem;
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;

const Aside = styled.aside`
  max-width: 20rem;
  margin-left: 3rem;
`;

function Subreadit({ match }) {
  const [subreadit, setSubreadit] = useState();
  const [posts, setPosts] = useState([]);
  const [limit, setLimit] = useState(20);
  const { getSubreaditByName, getSubreaditPosts } = useSubreadit();
  const subreaditName = match.params.subreadit;

  useEffect(() => {
    (async () => {
      const subreadit = await getSubreaditByName(subreaditName);
      const posts = await getSubreaditPosts(subreadit.id, limit);
      console.log(subreadit);
      setSubreadit(subreadit);
      setPosts(posts);
    })();
  }, []);

  return (
    <Wrapper>
      <Container>
      {posts.map((post) => {
        return <PostPreview key={post.id} postId={post.id} />;
      })}
      </Container>
      <Aside>
        {subreadit && (
          <>
            <SubreaditInfo subreaditId={subreadit.id} />
            <SubreaditRules subreaditId={subreadit.id} />
          </>
        )}
      </Aside>
    </Wrapper>
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
