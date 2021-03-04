import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "../../contexts/AuthContext";
import { useSave } from "../../contexts/SaveContext";
import usePost from "../../hooks/usePost";
import useComment from "../../hooks/useComment";
import Post from "../../components/user/content/Post";
import Comment from "../../components/user/content/Comment";

function Saved() {
  const { currentUser } = useAuth();
  const { saved, getSaved } = useSave();
  const { getPost } = usePost();
  const { getComment, getCommentsNumber } = useComment();
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    if (!currentUser.uid) return;
    (async () => {
      let saved = await getSaved(currentUser.uid);
      saved = await Promise.all(
        saved.map(async (doc) => {
          if (doc.type === "post") {
            const post = await getPost(doc.id);
            const comments = await getCommentsNumber(post.data().id);
            return { ...post.data(), comments };
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
          };
        })
      );
      setDocs(saved);
    })();
  }, [saved]);

  return (
    <List>
      {docs.map((article) => {
        return article.type === "post" ? (
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
  );
}

export default Saved;

const List = styled.div`
  @media all and (min-width: 992px) {
    grid-row: 2;
    grid-column: 2;
  }

  & > * {
    margin-bottom: 0.5rem;
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;
