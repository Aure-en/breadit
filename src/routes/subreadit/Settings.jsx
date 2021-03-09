import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import useStorage from "../../hooks/useStorage";
import useSubreadit from "../../hooks/useSubreadit";
import useSubreaditSettings from "../../hooks/useSubreaditSettings";

// Icons
import { ReactComponent as IconClose } from "../../assets/icons/general/icon-x.svg";

function SubreaditSettings({ match }) {
  const [subreadit, setSubreadit] = useState();
  const [icon, setIcon] = useState();
  const [banner, setBanner] = useState();
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState([
    {
      title: "",
      description: "",
    },
  ]);
  const [message, setMessage] = useState("");
  const { getSubreaditByName } = useSubreadit();
  const {
    updateIcon,
    updateBanner,
    updateDescription,
    updateRules,
  } = useSubreaditSettings();
  const { uploadSubreaditImage } = useStorage();
  const subreaditName = match.params.subreadit;

  useEffect(() => {
    (async () => {
      const subreadit = await getSubreaditByName(subreaditName);
      setSubreadit(subreadit);
      setIcon(subreadit.icon);
      setBanner(subreadit.banner);
      setRules(subreadit.rules);
      setDescription(subreadit.description);
    })();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (icon !== subreadit.icon) updateIcon(icon, subreadit.id);
      if (banner !== subreadit.banner) updateBanner(banner, subreadit.id);
      if (description !== subreadit.description)
        updateDescription(description, subreadit.id);
      if (rules !== subreadit.rules) updateRules(rules, subreadit.id);
      setMessage("The subreadit settings have been updated.");
    } catch (err) {
      setMessage("Sorry, we were unable to save the settings.");
    }
  };

  return (
    <Wrapper>
      <Container>
        {subreadit && (
          <form onSubmit={handleSubmit}>
            <Heading>
              b/{subreadit.name_sensitive}
              {' '}
              Settings
            </Heading>
            <Category>General Settings</Category>

            <Setting>
              <SettingType>Name</SettingType>
              <div>{subreadit.name_sensitive}</div>
            </Setting>

            <Setting>
              <SettingType>Description</SettingType>
              <label htmlFor="description">
                <Textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </label>
            </Setting>

            <Setting>
              <SettingType>Rules</SettingType>
              <Rules>
                {rules.map((rule, index) => {
                  return (
                    <div key={index}>
                      <Row>
                        <RuleNumber>
                          Rule
                          {index + 1}
                        </RuleNumber>
                        <IconButton
                          type="button"
                          onClick={() => {
                            setRules((prevRules) => {
                              const rules = [...prevRules];
                              rules.splice(index, 1);
                              return rules;
                            });
                          }}
                        >
                          <IconClose />
                        </IconButton>
                      </Row>
                      <label htmlFor={`title-${index}`}>
                        <Input
                          type="text"
                          id={`title-${index}`}
                          name={`title-${index}`}
                          value={rules[index].title}
                          placeholder="Title"
                          onChange={(e) =>
                            setRules((prev) => {
                              const rules = [...prev];
                              rules[index].title = e.target.value;
                              return rules;
                            })}
                          required
                        />
                      </label>

                      <label htmlFor={`description-${index}`}>
                        <Textarea
                          type="text"
                          id={`description-${index}`}
                          name={`description-${index}`}
                          value={rules[index].description}
                          placeholder="Description (optional)"
                          onChange={(e) =>
                            setRules((prev) => {
                              const rules = [...prev];
                              rules[index].description = e.target.value;
                              return rules;
                            })}
                        />
                      </label>
                    </div>
                  );
                })}
              </Rules>
              <RuleButton
                type="button"
                onClick={() => {
                  setRules([...rules, { title: "", description: "" }]);
                }}
              >
                Add a rule
              </RuleButton>
            </Setting>

            <Category>Appearance</Category>

            <Setting>
              <SettingType>Icon and banner image</SettingType>
              <Message>Images must be .png or .jpg format</Message>
              <Images>
                <ImageInput
                  type="file"
                  id="Icon"
                  name="Icon"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={async (e) => {
                    if (e.target.files.length > 0) {
                      const iconUrl = await uploadSubreaditImage(
                        subreadit.id,
                        e.target.files[0]
                      );
                      setIcon(iconUrl);
                    }
                  }}
                />
                <label htmlFor="Icon">
                  <Icon src={icon} alt="Current Icon" />
                </label>

                <ImageInput
                  type="file"
                  id="banner"
                  name="banner"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={async (e) => {
                    if (e.target.files.length > 0) {
                      const bannerUrl = await uploadSubreaditImage(
                        subreadit.id,
                        e.target.files[0]
                      );
                      setBanner(bannerUrl);
                    }
                  }}
                />
                <label htmlFor="banner">
                  <Banner src={banner} alt="Current banner" />
                </label>
              </Images>
            </Setting>
            <ButtonFilled type="submit">Save Changes</ButtonFilled>
          </form>
        )}
        {message === "The subreadit settings have been updated." && (
          <MessageSuccess>{message}</MessageSuccess>
        )}
        {message === "Sorry, we were unable to save the settings." && (
          <MessageError>{message}</MessageError>
        )}
      </Container>
    </Wrapper>
  );
}

SubreaditSettings.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      subreadit: PropTypes.string,
    }),
  }).isRequired,
};

export default SubreaditSettings;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 3rem;
  flex: 1;
  background: ${(props) => props.theme.backgroundSecondary};
`;

const Container = styled.div`
  width: 100%;
  max-width: 50rem;
`;

const Heading = styled.h1`
  font-weight: 500;
  font-size: 1.5rem;
  line-height: 3rem;
  margin-bottom: 1rem;
`;

const Category = styled.h2`
  font-weight: 500;
  font-size: 0.75rem;
  text-transform: uppercase;
  line-height: 1.5rem;
  color: ${(props) => props.theme.secondary};
  border-bottom: 1px solid ${(props) => props.theme.secondary};
`;

const Setting = styled.div`
  display: flex;
  flex-direction: column;
  margin: 2rem 0;
`;

const SettingType = styled.h3`
  font-weight: 500;
  font-size: 1rem;
  line-height: 2rem;
`;

const Message = styled.div`
  font-size: 0.75rem;
  color: ${(props) => props.theme.secondary};
  margin-bottom: 0.5rem;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 8rem;
  border: 1px solid ${(props) => props.theme.secondary};
  padding: 0.5rem;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border: 1px solid ${(props) => props.theme.accent};
  }
`;

const IconButton = styled.button`
  color: ${(props) => props.theme.secondary};

  &:hover {
    color: ${(props) => props.theme.backgroundQuaternary};
  }
`;

const RuleButton = styled.button`
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  color: ${(props) => props.theme.accent};
  align-self: flex-end;

  &:hover {
    color: ${(props) => props.theme.accentHover};
  }
`;

const Button = styled.button`
  display: block;
  border: 1px solid ${(props) => props.theme.accent};
  color: ${(props) => props.theme.accent};
  border-radius: 5rem;
  padding: 0.45rem 1.25rem;
  font-weight: 500;
  align-self: center;
  text-align: center;
`;

const ButtonFilled = styled(Button)`
  color: ${(props) => props.theme.backgroundSecondary};
  background-color: ${(props) => props.theme.accent};
  border: 1px solid ${(props) => props.theme.accent};
  margin-left: auto;
`;

const Images = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  font-size: 0.75rem;
  color: ${(props) => props.theme.secondary};

  @media all and (min-width: 400px) {
    flex-direction: row;
  }

  & > label {
    margin-bottom: 2rem;

    @media all and (min-width: 400px) {
      margin-right: 2rem;
      margin-bottom: 0;
    }
  }

  & > label:last-child {
    margin-bottom: 0;

    @media all and (min-width: 400px) {
      margin-right: 0;
    }
  }
`;

const ImageInput = styled.input`
  display: none;
`;

const Icon = styled.img`
  width: 5rem;
  height: 5rem;
  border-radius: 5px;
  cursor: pointer;
`;

const Banner = styled.img`
  width: 15rem;
  height: 5rem;
  border-radius: 5px;
  cursor: pointer;
  object-fit: cover;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Rules = styled.div`
  & > * {
    margin-bottom: 1.5rem;
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;

const RuleNumber = styled.div`
  text-transform: uppercase;
  font-weight: 500;
  font-size: 0.75rem;
  color: ${(props) => props.theme.accent};
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${(props) => props.theme.secondary};
  width: 100%;
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    border: 1px solid ${(props) => props.theme.accent};
  }
`;

const MessageSuccess = styled.div`
  font-size: 0.75rem;
  color: ${(props) => props.theme.success};
  margin-bottom: 0.5rem;
`;

const MessageError = styled(MessageSuccess)`
  color: ${(props) => props.theme.error};
  top: -0.5rem;
`;
