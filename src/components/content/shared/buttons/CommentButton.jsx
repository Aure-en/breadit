import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import useComment from "../../../../hooks/useComment";
import useWindowSize from "../../../../hooks/useWindowSize";

// Icons
import { ReactComponent as IconComment } from "../../../../assets/icons/general/icon-comment.svg";

function CommentButton({ subreadit, postId }) {
  const [commentsNumber, setCommentsNumber] = useState(0);
  const { getCommentsNumber } = useComment();
  const { windowSize } = useWindowSize();

  useEffect(() => {
    (async () => {
      const comments = await getCommentsNumber(postId);
      setCommentsNumber(comments);
    })();
  }, []);

  return (
    <Button to={`/b/${subreadit}/${postId}`}>
      <IconComment />
      {commentsNumber}
      {windowSize.width > 768 && " Comment"}
      {windowSize.width > 768 && commentsNumber !== 1 && "s"}
    </Button>
  );
}

export default CommentButton;

CommentButton.propTypes = {
  subreadit: PropTypes.string.isRequired,
  postId: PropTypes.string.isRequired,
};

const Button = styled(Link)`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(props) => props.theme.text_secondary};

  & > *:first-child {
    margin-right: 0.15rem;
  }

  & > a {
    height: 100%;
  }
`;
