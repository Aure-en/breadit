import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import NestedPostPreview from "./NestedPostPreview";

// Icons
import { ReactComponent as IconExternalLink } from "../../assets/icons/general/icon-external-link.svg";
import { ReactComponent as IconLink } from "../../assets/icons/general/icon-link-med.svg";

function LinkPreview({ link, title }) {
  const youtubeRegex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const breaditRegex = /^.*(breadit-296d8.web.app)\/b\/.+\/([a-zA-Z0-9]+)/;

  // Youtube Links
  const getYoutubeId = (url) => {
    const match = url.match(youtubeRegex);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const renderYoutubeLink = (link, title) => {
    const videoId = getYoutubeId(link);
    return (
      <>
        <Title>{title}</Title>
        <Link href={link}>
          <Url>{link}</Url>
          <IconExternalLink />
        </Link>
        <VideoWrapper>
          <iframe
            title={link}
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${videoId}`}
            frameBorder="0"
            allowFullScreen
          />
        </VideoWrapper>
      </>
    );
  };

  // Breadit links
  const renderBreaditLink = (url, title) => {
    const match = url.match(breaditRegex);
    if (match) {
      return (
        <>
          <Title>{title}</Title>
          <NestedPostPreview postId={match[2]} />
        </>
      );
    }
    return <></>;
  };

  return (
    <div>
      {/* Youtube links are detected through a regex and the video is embed. */}
      {link.match(youtubeRegex) && renderYoutubeLink(link, title)}

      {/* Breadit posts are detected through a regex and a post preview is displayed */}
      {link.match(breaditRegex) && renderBreaditLink(link, title)}

      {/* Any other type of link is only displayed along the title */}
      {!link.match(youtubeRegex) && !link.match(breaditRegex) && (
        <Row>
          <div>
            <Title>{title}</Title>
            <Link href={link}>
              <Url>{link}</Url>
              <IconExternalLink />
            </Link>
          </div>
          <a href={link}>
            <Preview>
              <IconLink />
              <ExternalLinkIcon>
                <IconExternalLink />
              </ExternalLinkIcon>
            </Preview>
          </a>
        </Row>
      )}
    </div>
  );
}

LinkPreview.propTypes = {
  link: PropTypes.string.isRequired,
};

export default LinkPreview;

const Link = styled.a`
  color: ${(props) => props.theme.accent};
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  margin: 0 0 0.5rem 0.5rem;

  &:hover {
    text-decoration: underline;
  }
`;

const Url = styled.span`
  max-width: 12.5rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 500;
  padding: 0.5rem;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
`;

const Preview = styled.div`
  position: relative;
  border: 1px solid ${(props) => props.theme.accent};
  border-radius: 5px;
  color: ${(props) => props.theme.accent};
  width: 9rem;
  height: 6rem;
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ExternalLinkIcon = styled.div`
  background: ${(props) => props.theme.accent};
  color: ${(props) => props.theme.accent};
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 0.25rem;
  border-radius: 4px;
`;

const VideoWrapper = styled.div`
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  padding-top: 25px;
  height: 0;

  & iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;