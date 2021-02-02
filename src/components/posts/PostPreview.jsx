import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { ReactComponent as IconUp } from "../../assets/icons/icon-upvote.svg";
import { ReactComponent as IconDown } from "../../assets/icons/icon-downvote.svg";

const Container = styled.div``;

const BoldPrimary = styled.div``;

const BoldSecondary = styled(BoldPrimary)``;

const Informations = styled.div``;

const Vote = styled.button``;

function PostPreview({ subreadit, author, date, content }) {
  return (
    <>
      <Container>
        <div>
          <Vote type="button">
            <IconUp />
          </Vote>
          <Vote type="button">
            <IconDown />
          </Vote>
        </div>
        <div>
          <BoldPrimary>{subreadit}</BoldPrimary>
          <Informations>
            Posted by u/
            {author}
            {date}
          </Informations>
          <div>{content}</div>
          <BoldSecondary>Comments</BoldSecondary>
        </div>
      </Container>
    </>
  );
}

PostPreview.propTypes = {
  subreadit: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  content: PropTypes.any.isRequred,
};
export default PostPreview;
