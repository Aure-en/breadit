/* eslint-disable react/display-name */
import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import {
  Editor,
  EditorState,
  RichUtils,
  CompositeDecorator,
  convertToRaw,
  convertFromRaw,
  ContentState,
} from "draft-js";
import styled from "styled-components";
import { Link } from "react-router-dom";
import uniqid from "uniqid";
import { BREADIT_URL } from "../../utils/const";
import "draft-js/dist/Draft.css";
import "../../styles/textEditor.css";

// Icons
import { ReactComponent as IconBold } from "../../assets/icons/text_editor/icon-bold.svg";
import { ReactComponent as IconItalic } from "../../assets/icons/text_editor/icon-italic.svg";
import { ReactComponent as IconUnderline } from "../../assets/icons/text_editor/icon-underline.svg";
import { ReactComponent as IconStrike } from "../../assets/icons/text_editor/icon-strike.svg";
import { ReactComponent as IconHeading } from "../../assets/icons/text_editor/icon-heading.svg";
import { ReactComponent as IconSubheading } from "../../assets/icons/text_editor/icon-subheading.svg";
import { ReactComponent as IconOL } from "../../assets/icons/text_editor/icon-ol.svg";
import { ReactComponent as IconUL } from "../../assets/icons/text_editor/icon-ul.svg";
import { ReactComponent as IconLink } from "../../assets/icons/text_editor/icon-link.svg";
import { ReactComponent as IconBlockQuote } from "../../assets/icons/text_editor/icon-blockquote.svg";
import { ReactComponent as IconCode } from "../../assets/icons/text_editor/icon-code.svg";
import { ReactComponent as IconBlockCode } from "../../assets/icons/text_editor/icon-code-block.svg";

const findLinkEntities = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === "LINK"
    );
  }, callback);
};

const LinkEntity = ({ contentState, entityKey, children }) => {
  const { url } = contentState.getEntity(entityKey).getData();
  // Must add a on click event because links in contentEditable don't work by default.
  return (
    <StyledLink
      href={url}
      onClick={(e) => {
        window.open(e.target.closest("a").href);
      }}
    >
      {children}
    </StyledLink>
  );
};

const findWithRegex = (regex, contentBlock, callback) => {
  const text = contentBlock.getText();
  let match;
  while ((match = regex.exec(text))) {
    callback(match.index, match.index + match[0].length);
  }
};

const mentionStrategy = (contentBlock, callback, contentState) => {
  findWithRegex(/\bu\/[-_a-zA-Z0-9]+\b/gi, contentBlock, callback);
};

const Mention = ({ children }) => {
  return (
    // Must add a on click event because links in contentEditable don't work by default.
    <LinkToUser
      to={children}
      onClick={() => {
        window.open(`https://breadit-296d8.web.app/${children[0].props.text}`);
      }}
    >
      {children}
    </LinkToUser>
  );
};

const decorator = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: LinkEntity,
  },
  {
    strategy: mentionStrategy,
    component: Mention,
  },
]);

const styleMap = {
  HEADING: {
    fontSize: "1.25rem",
  },

  SUBHEADING: {
    fontSize: "1.125rem",
  },
};

const TextEditor = forwardRef(
  ({ type, sendContent, prevContent, placeholder }, ref) => {
    const [editorState, setEditorState] = useState(() =>
      EditorState.createEmpty(decorator)
    );
    const [isLinkEditorOpen, setIsLinkEditorOpen] = useState(false);
    const [link, setLink] = useState("");
    // Gets the selection position so that the link window opens under it.
    const [selection, setSelection] = useState();
    // Gets coordinates to place the link window properly.
    const wrapperRef = useRef();
    const linkRef = useRef();

    // Reset the text editor after the user posts a comment.
    useImperativeHandle(ref, () => ({
      reset() {
        setEditorState(
          EditorState.push(
            editorState,
            ContentState.createFromText(""),
            "remove-range"
          )
        );
      },
    }));

    // If we provide a previous content (i.e : we are editing a comment / post), it is loaded in the Text Editor.
    useEffect(() => {
      if (!prevContent) return;
      const content = convertFromRaw(JSON.parse(prevContent));
      setEditorState(EditorState.createWithContent(content));
    }, []);

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

    const onSubheadingClick = () => {
      setEditorState(RichUtils.toggleInlineStyle(editorState, "SUBHEADING"));
    };

    const onUnorderedListClick = () => {
      setEditorState(
        RichUtils.toggleBlockType(editorState, "unordered-list-item")
      );
    };

    const onOrderedListClick = () => {
      setEditorState(
        RichUtils.toggleBlockType(editorState, "ordered-list-item")
      );
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
      <Wrapper
        isActive={editorState.getSelection().hasFocus}
        isPost={type === "post"}
        ref={wrapperRef}
      >
        <Buttons>
          <Button
            type="button"
            // Using onMouseDown with e.preventDefault() prevents the text from being unselected when clicking on the Button.
            onMouseDown={(e) => {
              e.preventDefault();
              onBoldClick();
            }}
            active={editorState.getCurrentInlineStyle().has("BOLD")}
          >
            <IconBold data-tip="Bold" />
          </Button>

          <Button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              onItalicClick();
            }}
            active={editorState.getCurrentInlineStyle().has("ITALIC")}
          >
            <IconItalic data-tip="Italic" />
          </Button>
          <Button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              onUnderlineClick();
            }}
            active={editorState.getCurrentInlineStyle().has("UNDERLINE")}
          >
            <IconUnderline data-tip="Underline" />
          </Button>

          <div>
            <Button
              ref={linkRef}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                let coords;
                const selection = window.getSelection();
                if (!selection.isCollapsed) {
                  const selectionCoords = selection
                    .getRangeAt(0)
                    .getBoundingClientRect();
                  coords = {
                    top:
                      selectionCoords.bottom -
                      wrapperRef.current.getBoundingClientRect().top,
                    left:
                      (selectionCoords.right - selectionCoords.left) / 2 +
                      selectionCoords.left -
                      wrapperRef.current.getBoundingClientRect().left,
                  };
                } else {
                  const linkCoords = linkRef.current.getBoundingClientRect();
                  coords = {
                    top:
                      linkCoords.bottom -
                      wrapperRef.current.getBoundingClientRect().top,
                    left:
                      (linkCoords.right - linkCoords.left) / 2 +
                      linkCoords.left -
                      wrapperRef.current.getBoundingClientRect().left,
                  };
                }
                setSelection(coords);
                setIsLinkEditorOpen(!isLinkEditorOpen);
              }}
              active={isLinkEditorOpen}
            >
              <IconLink data-tip="Link" />
            </Button>
          </div>

          <Button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              onCodeClick();
            }}
            active={editorState.getCurrentInlineStyle().has("CODE")}
          >
            <IconCode data-tip="Code" />
          </Button>

          <Button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              onHeadingClick();
            }}
            active={editorState.getCurrentInlineStyle().has("HEADING")}
          >
            <IconHeading data-tip="Heading" />
          </Button>

          <Button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              onSubheadingClick();
            }}
            active={editorState.getCurrentInlineStyle().has("SUBHEADING")}
          >
            <IconSubheading data-tip="Subheading" />
          </Button>

          <Button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              onStrikeThroughClick();
            }}
            active={editorState.getCurrentInlineStyle().has("STRIKETHROUGH")}
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

          <ReactTooltip effect="solid" delayShow={300} />
        </Buttons>

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
            placeholder={placeholder}
          />
        </Container>

        {isLinkEditorOpen && (
          <LinkBox selection={selection}>
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
      </Wrapper>
    );
  }
);

TextEditor.propTypes = {
  // Type is either "post" or "comment" (appearance changes depending on the type)
  type: PropTypes.string,
  sendContent: PropTypes.func,
  prevContent: PropTypes.string,
  placeholder: PropTypes.string,
};

TextEditor.defaultProps = {
  type: "post",
  sendContent: () => {},
  prevContent: "",
  placeholder: "",
};

export const renderers = {
  inline: {
    BOLD: (children) => <strong key={uniqid()}>{children}</strong>,
    ITALIC: (children) => <em key={uniqid()}>{children}</em>,
    UNDERLINE: (children) => <u key={uniqid()}>{children}</u>,
    CODE: (children) => (
      <span key={uniqid()} className="code">
        {children}
      </span>
    ),
    HEADING: (children) => (
      <div className="heading" key={uniqid()}>
        {children}
      </div>
    ),
    STRIKETHROUGH: (children) => (
      <span key={uniqid()} className="strikethrough">
        {children}
      </span>
    ),
  },
  blocks: {
    unstyled: (children) =>
      children.map((child) => (
        <p key={uniqid()} className="block">
          {child}
        </p>
      )),
    codeBlock: (children) =>
      children.map((child) => (
        <pre key={uniqid()} className="codeBlock">
          {child}
        </pre>
      )),
    quoteBlock: (children) =>
      children.map((child) => (
        <div key={uniqid()} className="quoteBlock">
          {child}
        </div>
      )),
    "unordered-list-item": (children) => (
      <ul key={uniqid()}>
        {children.map((child) => (
          <li key={uniqid()}>{child}</li>
        ))}
      </ul>
    ),
    "ordered-list-item": (children) => (
      <ol key={uniqid()}>
        {children.map((child) => (
          <li key={uniqid()}>{child}</li>
        ))}
      </ol>
    ),
  },
  entities: {
    LINK: (children, data) => (
      <StyledLink key={uniqid()} href={data.url}>
        {children}
      </StyledLink>
    ),
  },
  decorators: [
    {
      strategy: mentionStrategy,
      component: ({ children, decoratedText }) => (
        <StyledLink href={`${BREADIT_URL}/${decoratedText}`.toLowerCase()}>
          {children}
        </StyledLink>
      ),
    },
  ],
};

export default TextEditor;

const colors = {
  primary: "black",
  secondary: "rgb(179, 72, 54)",
  background: "rgb(255, 255, 255)",
  buttons: "rgb(241, 236, 230)",
  hover: "rgb(235, 215, 199)",
  border: "rgb(242, 234, 230)",
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: ${(props) => (props.isPost ? "column" : "column-reverse")};
  border: 1px solid
    ${(props) => props.isActive ? props.theme.borderHover : props.theme.border};
  border-radius: 5px;
  max-width: 40rem;
`;

const Container = styled.div`
  min-height: 8rem;
  padding: 1rem;
  background: ${(props) => props.theme.backgroundSecondary};
  cursor: text;
  display: flex;
  flex-direction: column;
  & > * {
    flex: 1;
  }
`;

const Buttons = styled.div`
  background: ${(props) => props.theme.backgroundPrimary};
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  justify-items: center;

  @media all and (min-width: 475px) {
    display: flex;
  }
`;

const Button = styled.button`
  padding: 0.2rem;
  margin: 0.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  background: ${props => props.active && colors.hover};

  &:hover {
    background: ${colors.hover};
  }
`;

const LinkBox = styled.div`
  position: absolute;
  background: ${colors.buttons};
  padding: 1rem;
  border-radius: 5px;
  top: ${(props) => props.selection && `calc(${props.selection.top}px + 1rem)`};
  left: ${(props) => props.selection && `${props.selection.left}px`};
  transform: translateX(-50%);
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

const StyledLink = styled.a`
  color: ${(props) => props.theme.accent};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const LinkToUser = styled(Link)`
  color: ${(props) => props.theme.accent};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
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
