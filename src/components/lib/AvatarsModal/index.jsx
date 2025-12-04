import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import {
  GridContainer,
  Grid,
  ImageContainer,
  StyledImage,
  SelectedAvatars,
  CheckIcon,
} from "./index.styles";

const AvatarsModal = ({ open, setOpen, setAvatarIndex, avatarIndex }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const avatars = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    url: `https://oosri.com/profile_pictures/Avatar${i + 1}.jpg`,
  }));

  const handleSelectAvatar = (id) => {
    setAvatarIndex(id);
    setSelectedAvatar(selectedAvatar === id ? null : id);
  };

  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  useEffect(() => {
    setSelectedAvatar(avatarIndex);
  }, [avatarIndex]);

  return (
    <Modal
      title="Select Avatar"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      width={800}
    >
      <GridContainer>
        <Grid>
          {avatars.map((avatar) => (
            <ImageContainer
              key={avatar.id}
              onClick={() => handleSelectAvatar(avatar.id)}
            >
              <StyledImage
                src={avatar.url}
                alt={`Avatar ${avatar.id}`}
                isSelected={selectedAvatar === avatar.id}
              />
              {selectedAvatar === avatar.id && (
                <CheckIcon>
                  <CheckCircleFilled />
                </CheckIcon>
              )}
            </ImageContainer>
          ))}
        </Grid>
      </GridContainer>
      <SelectedAvatars>
        Selected Avatar: {selectedAvatar ? `Avatar ${selectedAvatar}` : "None"}
      </SelectedAvatars>
    </Modal>
  );
};

export default AvatarsModal;
