import React, { useState } from "react";
import PropTypes from "prop-types";
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

const Wrapper = styled.div`
  border: 1px solid blue;
`;

const Container = styled.div`
  border: 1px solid red;
  min-height: 10rem;
  padding: 1rem;
`;

const Buttons = styled.div``;

const Button = styled.button``;

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
    <Wrapper>
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
          type="Button"
          // Using onMouseDown with e.preventDefault() prevents the text from being unselected when clicking on the Button.
          onMouseDown={(e) => {
            e.preventDefault();
            onItalicClick();
          }}
        >
          Italic
        </Button>

        <Button
          type="Button"
          onMouseDown={(e) => {
            e.preventDefault();
            onBoldClick();
          }}
        >
          Bold
        </Button>

        <Button
          type="Button"
          onMouseDown={(e) => {
            e.preventDefault();
            onUnderlineClick();
          }}
        >
          Underline
        </Button>

        <Button
          type="Button"
          onMouseDown={(e) => {
            e.preventDefault();
            onCodeClick();
          }}
        >
          Code
        </Button>

        <Button
          type="Button"
          onMouseDown={(e) => {
            e.preventDefault();
            onHeadingClick();
          }}
        >
          Heading
        </Button>

        <Button
          type="Button"
          onMouseDown={(e) => {
            e.preventDefault();
            onStrikeThroughClick();
          }}
        >
          Strike
        </Button>

        <span>
          <Button
            type="Button"
            onMouseDown={(e) => {
              e.preventDefault();
              setIsLinkEditorOpen(!isLinkEditorOpen);
            }}
          >
            Link
          </Button>

          {isLinkEditorOpen && (
            <div>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Paste or type a link"
              />
              <Button type="Button" onMouseDown={handleInsertLink}>
                Insert
              </Button>
            </div>
          )}
        </span>

        <Button
          type="Button"
          onMouseDown={(e) => {
            e.preventDefault();
            onUnorderedListClick();
          }}
        >
          UL
        </Button>

        <Button
          type="Button"
          onMouseDown={(e) => {
            e.preventDefault();
            onOrderedListClick();
          }}
        >
          OL
        </Button>

        <Button
          type="Button"
          onMouseDown={(e) => {
            e.preventDefault();
            onQuoteBlockClick();
          }}
        >
          Quote Block
        </Button>

        <Button
          type="Button"
          onMouseDown={(e) => {
            e.preventDefault();
            onCodeBlockClick();
          }}
        >
          Code Block
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
