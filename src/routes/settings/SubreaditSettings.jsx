import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import useStorage from "../../hooks/useStorage";
import useSubreadit from "../../hooks/useSubreadit";
import useSubreaditSettings from "../../hooks/useSubreaditSettings";

const colors = {
  primary: "black",
  secondary: "grey",
  accent: "red",
  disabled: "blue",
  background: "white",
  overlay: "rgba(0, 0, 0, .8)",
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 3rem;
  flex: 1;
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
  color: ${colors.secondary};
  border-bottom: 1px solid ${colors.secondary};
`;

const Setting = styled.div`
  margin: 2rem 0;
`;

const SettingType = styled.h3`
  font-weight: 500;
  font-size: 1rem;
  line-height: 2rem;
`;

const Message = styled.div`
  font-size: 0.75rem;
  color: ${colors.secondary};
  margin-bottom: 0.5rem;
`;

const Textarea = styled.textarea`
  width: 100%;
`;

const Button = styled.button`
  border: 1px solid ${colors.accent};
  color: ${colors.accent};
  border-radius: 5rem;
  padding: 0.45rem 1.25rem;
  font-weight: 500;
  align-self: center;
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
`;

function SubreaditSettings({ match }) {
  const [subreadit, setSubreadit] = useState();
  const [icon, setIcon] = useState();
  const [banner, setBanner] = useState();
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState([""]);
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
    if (icon !== subreadit.icon) updateIcon(icon, subreadit.id);
    if (banner !== subreadit.banner) updateBanner(banner, subreadit.id);
    if (description !== subreadit.description)
      updateDescription(description, subreadit.id);
    if (rules !== subreadit.rules) updateRules(rules, subreadit.id);
  };

  return (
    <Wrapper>
      <Container>
        {subreadit && (
          <form onSubmit={handleSubmit}>
            <Heading>b/{subreaditName} Settings</Heading>
            <Category>General Settings</Category>

            <Setting>
              <SettingType>Name</SettingType>
              <div>{subreadit.name}</div>
            </Setting>

            <Setting>
              <SettingType>Description</SettingType>
              <label htmlFor="description">
                <Textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)} />
              </label>
            </Setting>

            <Setting>
              <SettingType>Rules</SettingType>
              {rules.map((rule, index) => {
                return (
                  <React.Fragment key={rule}>
                    <div>{index + 1}</div>
                    <label htmlFor="rules">
                      <Textarea
                        id="rules"
                        name="rules"
                        value={rules[index]}
                        onChange={(e) =>
                          setRules((prev) => {
                            const rules = [...prev];
                            rules[index] = e.target.value;
                            return rules;
                          })}
                      />
                    </label>
                    <Button
                      type="button"
                      onClick={() => {
                        setRules(prevRules => {
                          const rules = [...prevRules];
                          rules.splice(index, 1);
                          return rules;
                        });
                      }}
                    >
                      x
                    </Button>
                  </React.Fragment>
                );
              })}
              <Button
                type="button"
                onClick={() => {
                  setRules([...rules, ""]);
                }}
              >
                Add a rule
              </Button>
            </Setting>

            <Category>Appearance</Category>

            <Setting>
              <SettingType>Icon and banner image</SettingType>
              <Message>Images must be .png or .jpg format</Message>
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
            </Setting>
            <Button type="submit">Save Changes</Button>
          </form>
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
