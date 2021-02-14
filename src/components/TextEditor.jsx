import React, { useState } from "react";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import {
  Editor,
  EditorState,
  RichUtils,
  CompositeDecorator,
  convertToRaw,
} from "draft-js";
import styled from "styled-components";
import "draft-js/dist/Draft.css";
import "../styles/textEditor.css";

// Icons
import { ReactComponent as IconBold } from "../assets/icons/text_editor/icon-bold.svg";
import { ReactComponent as IconItalic } from "../assets/icons/text_editor/icon-italic.svg";
import { ReactComponent as IconUnderline } from "../assets/icons/text_editor/icon-underline.svg";
import { ReactComponent as IconStrike } from "../assets/icons/text_editor/icon-strike.svg";
import { ReactComponent as IconHeading } from "../assets/icons/text_editor/icon-heading.svg";
import { ReactComponent as IconOL } from "../assets/icons/text_editor/icon-ol.svg";
import { ReactComponent as IconUL } from "../assets/icons/text_editor/icon-ul.svg";
import { ReactComponent as IconLink } from "../assets/icons/text_editor/icon-link.svg";
import { ReactComponent as IconBlockQuote } from "../assets/icons/text_editor/icon-blockquote.svg";
import { ReactComponent as IconCode } from "../assets/icons/text_editor/icon-code.svg";
import { ReactComponent as IconBlockCode } from "../assets/icons/text_editor/icon-code-block.svg";

const colors = {
  primary: "black",
  secondary: "rgb(179, 72, 54)",
  background: "rgb(255, 255, 255)",
  buttons: "rgb(241, 236, 230)",
  hover: "rgb(235, 215, 199)",
  border: "rgb(242, 234, 230)",
};

const Wrapper = styled.div`
  border: 1px solid
    ${(props) => (props.isActive ? colors.secondary : colors.border)};
  border-radius: 5px;
`;

const Container = styled.div`
  min-height: 8rem;
  padding: 1rem;
  background: ${colors.background};
  cursor: text;
`;

const Buttons = styled.div`
  background: ${colors.buttons};
  display: flex;
  color: ${colors.primary};
`;

const Button = styled.button`
  padding: 0.2rem;
  margin: 0.2rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${colors.hover};
    border-radius: 3px;
  }
`;

const LinkContainer = styled.div`
  position: relative;
`;

const LinkBox = styled.div`
  position: absolute;
  background: ${colors.buttons};
  padding: 1rem;
  border-radius: 5px;
  left: 50%;
  transform: translate(-50%, 1rem);
  z-index: 2;

  &:before {
    content: "";
    border: 7px solid transparent;
    border-bottom: 10px solid ${colors.buttons};
    z-index: 3;
    position: absolute;
    top: calc(-0.75rem - 5px);
    left: 50%;
    transform: translateX(-50%);
  }
`;

const Input = styled.input`
  border: 1px solid ${colors.border};
  padding: 0.5rem;
  border-radius: 5px;
  margin-bottom: 0.5rem;

  &:focus {
    outline: none;
    border: 1px solid ${colors.primary};
  }
`;

const findLinkEntities = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === "LINK"
    );
  }, callback);
};
const Link = ({ contentState, entityKey, children }) => {
  const { url } = contentState.getEntity(entityKey).getData();
  // Must add a on click event because links in contentEditable don't work by default.
  return (
    <a
      href={url}
      onClick={(e) => {
        window.open(e.target.closest("a").href);
      }}
    >
      {children}
    </a>
  );
};

const decorator = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: Link,
  },
]);

const styleMap = {
  HEADING: {
    fontSize: "1.75rem",
  },
};

function TextEditor({ type, sendContent }) {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(decorator)
  );
  const [isLinkEditorOpen, setIsLinkEditorOpen] = useState(false);
  const [link, setLink] = useState("");

  // Allows the user to use keyboard shortcuts (ex: Ctrl + B to bold)
  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) setEditorState(newState);
  };

  // Allows the user to use Buttons to modify his text's style
  const onItalicClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "ITALIC"));
  };

  const onBoldClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "BOLD"));
  };

  const onUnderlineClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "UNDERLINE"));
  };

  const onCodeClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "CODE"));
  };

  const onStrikeThroughClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "STRIKETHROUGH"));
  };

  const onHeadingClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "HEADING"));
  };

  const onUnorderedListClick = () => {
    setEditorState(
      RichUtils.toggleBlockType(editorState, "unordered-list-item")
    );
  };

  const onOrderedListClick = () => {
    setEditorState(RichUtils.toggleBlockType(editorState, "ordered-list-item"));
  };

  const onQuoteBlockClick = () => {
    setEditorState(RichUtils.toggleBlockType(editorState, "quoteBlock"));
  };

  const onCodeBlockClick = () => {
    setEditorState(RichUtils.toggleBlockType(editorState, "codeBlock"));
  };

  const handleInsertLink = () => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      "LINK",
      "MUTABLE",
      { url: link }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });
    setEditorState(
      RichUtils.toggleLink(
        newEditorState,
        newEditorState.getSelection(),
        entityKey
      )
    );
  };

  // Nest lists
  const handleTab = (e) => {
    e.preventDefault(); // Prevents focus from going to another element
    const newState = RichUtils.onTab(e, editorState, 5);
    if (newState) setEditorState(newState);
  };

  // Blocks custom styles
  const customBlockFn = (contentBlock) => {
    const type = contentBlock.getType();
    if (type === "quoteBlock") {
      return "quoteBlock";
    }
    if (type === "codeBlock") {
      return "codeBlock";
    }
    return "";
  };

  return (
    <Wrapper isActive={editorState.getSelection().hasFocus}>
      {type === "comment" && (
        <Container>
          <Editor
            editorState={editorState}
            onChange={(editorState) => {
              setEditorState(editorState);
              sendContent(
                JSON.stringify(convertToRaw(editorState.getCurrentContent()))
              );
            }}
            customStyleMap={styleMap}
            handleKeyCommand={handleKeyCommand}
            onTab={handleTab}
            blockStyleFn={customBlockFn}
            placeholder="What are your thoughts?"
          />
        </Container>
      )}

      <Buttons>
        <Button
          type="button"
          // Using onMouseDown with e.preventDefault() prevents the text from being unselected when clicking on the Button.
          onMouseDown={(e) => {
            e.preventDefault();
            onBoldClick();
          }}
        >
          <IconBold data-tip="Bold" />
          <ReactTooltip effect="solid" delayShow={300} />
        </Button>

        <Button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            onItalicClick();
          }}
        >
          <IconItalic data-tip="Italic" />
        </Button>
        <Button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            onUnderlineClick();
          }}
        >
          <IconUnderline data-tip="Underline" />
        </Button>

        <LinkContainer>
          <Button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              setIsLinkEditorOpen(!isLinkEditorOpen);
            }}
          >
            <IconLink data-tip="Link" />
          </Button>

          {isLinkEditorOpen && (
            <LinkBox>
              <Input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Paste or type a link"
              />
              <Button type="button" onMouseDown={handleInsertLink}>
                Insert
              </Button>
            </LinkBox>
          )}
        </LinkContainer>

        <Button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            onCodeClick();
          }}
        >
          <IconCode data-tip="Code" />
        </Button>

        <Button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            onHeadingClick();
          }}
        >
          <IconHeading data-tip="Heading" />
        </Button>

        <Button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            onStrikeThroughClick();
          }}
        >
          <IconStrike data-tip="Strikethrough" />
        </Button>

        <Button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            onUnorderedListClick();
          }}
        >
          <IconUL data-tip="Bulleted List" />
        </Button>

        <Button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            onOrderedListClick();
          }}
        >
          <IconOL data-tip="Numbered List" />
        </Button>

        <Button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            onQuoteBlockClick();
          }}
        >
          <IconBlockQuote data-tip="Quote Block" />
        </Button>

        <Button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            onCodeBlockClick();
          }}
        >
          <IconBlockCode data-tip="Code Block" />
        </Button>
      </Buttons>

      {type === "post" && (
        <Container>
          <Editor
            editorState={editorState}
            onChange={(editorState) => {
              setEditorState(editorState);
              sendContent(
                JSON.stringify(convertToRaw(editorState.getCurrentContent()))
              );
            }}
            customStyleMap={styleMap}
            handleKeyCommand={handleKeyCommand}
            onTab={handleTab}
            blockStyleFn={customBlockFn}
            placeholder="Text (optional)"
          />
        </Container>
      )}
    </Wrapper>
  );
}

TextEditor.propTypes = {
  // Type is either "post" or "comment" (style changes depending on the type)
  type: PropTypes.string,
  sendContent: PropTypes.func,
};

TextEditor.defaultProps = {
  type: "post",
  sendContent: () => {},
};

export default TextEditor;
