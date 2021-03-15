import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import formatDistanceStrict from "date-fns/formatDistanceStrict";
import { useAuth } from "../../../contexts/AuthContext";
import useDraft from "../../../hooks/useDraft";
import useLoading from "../../../hooks/useLoading";

// Icons
import { ReactComponent as IconClose } from "../../../assets/icons/general/icon-x.svg";
import { ReactComponent as IconComment } from "../../../assets/icons/general/icon-comment.svg";
import { ReactComponent as IconDelete } from "../../../assets/icons/content/icon-delete.svg";

function Drafts({ select }) {
  const [drafts, setDrafts] = useState([]);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const { currentUser } = useAuth();
  const { getDrafts, draftsListener } = useDraft();
  const loading = useLoading(drafts);

  useEffect(() => {
    const unsubscribe = draftsListener(currentUser.uid, async () => {
      const drafts = await getDrafts(currentUser.uid);
      setDrafts(drafts);
    });
    return unsubscribe;
  }, []);

  return (
    <>
      <Button type="button" onClick={() => setIsDraftModalOpen(true)}>
        Drafts
        <Number>{drafts.length}</Number>
      </Button>

      {isDraftModalOpen && (
        <Overlay>
          <Modal>
            <ButtonClose onClick={() => setIsDraftModalOpen(false)}>
              <IconClose />
            </ButtonClose>
            <Header>
              Drafts
              {" "}
              {drafts.length > 0 && <Secondary>({drafts.length})</Secondary>}
            </Header>
            {!loading && (
              <>
                {drafts.length > 0 ? (
                  <div>
                    {drafts.map((draft) => {
                      return (
                        <Draft
                          draft={draft}
                          key={draft.id}
                          onSelect={() => {
                            select(draft);
                            setIsDraftModalOpen(false);
                          }}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <Empty>
                    <Icon>
                      <IconComment />
                    </Icon>
                    <div>Your drafts will live here.</div>
                  </Empty>
                )}
              </>
            )}
          </Modal>
        </Overlay>
      )}
    </>
  );
}

function Draft({ draft, onSelect }) {
  const [confirm, setConfirm] = useState(false);
  const { deleteDraft } = useDraft();

  return (
    <Container type="button" key={draft.id} onClick={onSelect}>
      <IconComment />
      <Title>{draft.title || "Untitled"}</Title>
      <Informations>
        {draft.subreadit.name && (
          <>
            <strong>
              b/
              {draft.subreadit.name}
            </strong>
            <span> ᐧ </span>
          </>
        )}
        Draft saved{" "}
        {formatDistanceStrict(new Date(draft.date.seconds * 1000), new Date())}
        {" "}
        ago
      </Informations>
      {confirm ? (
        <ButtonConfirm
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            deleteDraft(draft.id);
          }}
        >
          Confirm
        </ButtonConfirm>
      ) : (
        <ButtonDelete
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setConfirm(true);
          }}
        >
          <IconDelete />
        </ButtonDelete>
      )}
    </Container>
  );
}

export default Drafts;

Drafts.propTypes = {
  select: PropTypes.func.isRequired,
};

Draft.propTypes = {
  draft: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    subreadit: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }),
    date: PropTypes.shape({
      seconds: PropTypes.number,
    }),
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
};

const Button = styled.button`
  text-transform: uppercase;
  font-size: 0.825rem;
  color: ${(props) => props.theme.accent};
`;

const Number = styled.span`
  color: ${(props) => props.theme.bg_app};
  background: ${(props) => props.theme.text_secondary};
  padding: 0.1rem 0.2rem;
  margin-left: 0.5rem;
`;

const Header = styled.div`
  padding: 0rem 1rem 1rem 1rem;
  border-bottom: 1px solid ${(props) => props.theme.accent_soft};
`;

const Secondary = styled.span`
  color: ${(props) => props.theme.text_secondary};
  font-size: 0.825rem;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${(props) => props.theme.overlay};
  z-index: 99;
`;

const Modal = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  background: ${(props) => props.theme.bg_container};
  width: 80vw;
  max-width: 25rem;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
  padding: 1rem 0;

  &:focus {
    outline: none;
  }

  @media all and (min-width: 500px) {
    width: 100vw;
  }
`;

const ButtonClose = styled.span`
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;
`;

const Container = styled.button`
  width: 100%;
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: repeat(2, auto);
  grid-column-gap: 1rem;
  color: ${(props) => props.theme.text_secondary};
  text-align: left;
  padding: 0.5rem 1rem;

  & > svg:first-child {
    grid-row: 1 / span 2;
  }

  & > button:last-child {
    grid-row: 1 / span 2;
    grid-column: 3;
  }

  &:hover {
    background: ${(props) => props.theme.header_bg_secondary};
  }
`;

const Title = styled.div`
  color: ${(props) => props.theme.text_primary};
`;

const Informations = styled.div`
  font-size: 0.825rem;
`;

const ButtonDelete = styled.button`
  color: ${(props) => props.theme.text_secondary};
  align-self: center;
`;

const ButtonConfirm = styled.button`
  color: ${(props) => props.theme.accent};
  align-self: center;
`;

const Empty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  align-self: center;
  padding: 1rem;
`;

const Icon = styled.div`
  color: ${(props) => props.theme.accent};
`;
