import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "../../contexts/AuthContext";
import { useSave } from "../../contexts/SaveContext";
import usePost from "../../hooks/usePost";
import useComment from "../../hooks/useComment";
import Post from "../../components/user/content/Post";
import Comment from "../../components/user/content/Comment";

function Saved({ username }) {
  const { currentUser } = useAuth();
  const { saved, getSaved } = useSave([]);
  const { getPost } = usePost();
  const { getComment, getCommentsNumber } = useComment();
  const [docs, setDocs] = useState();

  useEffect(() => {
    if (!currentUser.uid) return;
    if (currentUser.displayName !== username) return;
    (async () => {
      let saved = await getSaved(currentUser.uid);
      saved = await Promise.all(
        saved.map(async (doc) => {
          if (doc.type === "post") {
            const post = await getPost(doc.id);
            const comments = await getCommentsNumber(post.data().id);
            return { ...post.data(), comments, doc: "post" };
          }
          const comment = await getComment(doc.id);
          const post = await getPost(comment.data().post);
          return {
            ...comment.data(),
            post: {
              id: post.data().id,
              author: post.data().author,
              subreadit: post.data().subreadit,
              title: post.data().title,
            },
            doc: "comment",
          };
        })
      );
      setDocs(saved);
    })();
  }, [saved, username]);

  const renderWrongUser = () => {
    return (
      <Empty>
        <h4>You do not have permission to access this resource</h4>
        <div>You can only look at your own saved posts and comments</div>
      </Empty>
    );
  };

  const renderCorrectUser = () => {
    return docs.length > 0 ? (
      <List>
        {docs.map((article) => {
          return article.doc === "post" ? (
            <Post
              key={article.id}
              author={article.author}
              id={article.id}
              subreadit={article.subreadit}
              type={article.type}
              title={article.title}
              content={article.content}
              date={article.date}
              comments={article.comments}
            />
          ) : (
            <Comment
              key={article.id}
              id={article.id}
              author={article.author}
              content={article.content}
              date={article.date}
              post={article.post}
            />
          );
        })}
      </List>
    ) : (
      <Empty>
        <h4>Nothing to see here.</h4>
        {username} hasn't shared anything yet.
      </Empty>
    );
  };

  return (
    <>
      {currentUser.displayName !== username && renderWrongUser()}

      {currentUser.displayName === username &&
        docs &&
        renderCorrectUser()}
    </>
  );
}

export default Saved;

const List = styled.div`
  margin-top: 0.5rem;
  width: 100vw;
  max-width: 100%;

  & > * {
    display: block;
    margin-bottom: 0.5rem;
  }

  & > *:last-child {
    margin-bottom: 0;
  }

  @media all and (min-width: 992px) {
    margin-top: 0;
  }
`;

const Empty = styled.div`
  margin-top: 0.5rem;
  width: 100vw;
  max-width: 100%;
  background: ${(props) => props.theme.backgroundSecondary};
  border-bottom: 1px solid ${(props) => props.theme.border};
  border-top: 1px solid ${(props) => props.theme.border};
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;
  padding: 1rem;
  border-radius: 0.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media all and (min-width: 768px) {
    border: 1px solid ${(props) => props.theme.neutral};
    align-items: center;
    margin: 1rem;
    max-width: 40rem;
  }
`;
