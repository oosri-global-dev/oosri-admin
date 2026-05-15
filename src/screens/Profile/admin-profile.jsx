import { SellersProfileWrapper } from './seller-profile.styles';
import { Tabs, Form, Input } from 'antd';
import { useState, useContext, useEffect } from 'react';
import TextField from '@/components/lib/TextField';
import { FlexibleDiv } from '@/components/lib/Box/styles';
import Button from '@/components/lib/Button';
import useNotification from '@/hooks/useNotification';
import { CustomUpload } from '@/components/lib/CustomUpload';
import { MainContext } from '@/context';
import { updateProfileData, UpdateProfilePicture } from '@/network/profile';

export default function AdminProfile() {
  const [file, setFile] = useState(null);
  const [activeTab, setActiveTab] = useState('1');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, error] = useNotification();
  const {
    state: { user },
    dispatch,
  } = useContext(MainContext);

  console.log(user, 'ORIGINAL USER');

  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      });
    }
  }, [user]);

  const handleDataUpdate = async (payload) => {
    try {
      const data = await updateProfileData(payload);
      return data;
    } catch (errors) {
      throw errors;
    }
  };

  const handleImageUpload = async () => {
    try {
      const response = await UpdateProfilePicture({ profilePicture: file });
      const updatedImage = response?.data?.data?.body?.profileImage;

      if (updatedImage) {
        dispatch({
          type: 'UPDATE_USER',
          payload: { profileImage: updatedImage },
        });
        success('Profile picture updated.');
      }

      setFile(null);
      return response;
    } catch (errors) {
      error('Failed to upload profile picture.');
      console.error(errors);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (file) {
        await handleImageUpload();
      }

      const payload = { phoneNumber: profileData.phoneNumber };
      await handleDataUpdate(payload);

      dispatch({
        type: 'UPDATE_USER',
        payload: { phoneNumber: profileData.phoneNumber },
      });

      success('Profile updated successfully.');
      setIsEditMode(false);
    } catch (err) {
      error('An error occurred while saving your details.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneNumberChange = (e) => {
    setProfileData((prev) => ({
      ...prev,
      phoneNumber: e.target.value,
    }));
  };

  return (
    <SellersProfileWrapper>
        <Tabs
          className="tabs__custom"
          defaultActiveKey="1"
          items={[{ key: '1', label: 'Personal Details' }]}
          onChange={(e) => {
            setActiveTab(e);
          }}
        />

        {activeTab === '1' && (
          <FlexibleDiv className="profile__details__section">
            <FlexibleDiv className="profile__info__wrapper">
              <h2>Personal Information</h2>
              <FlexibleDiv className="info_cont">
                <FlexibleDiv className="info__inner_cont1" flexDir="row">
                  <FlexibleDiv className="info1" flexDir="column">
                    <p>Full Legal Name</p>
                    <TextField
                      name="fullName"
                      placeholder="Full Name"
                      value={profileData.fullName}
                      disabled
                    />
                  </FlexibleDiv>
                </FlexibleDiv>
                <FlexibleDiv className="info__inner_cont2">
                  <FlexibleDiv className="info1">
                    <p>Email Address</p>
                    <TextField
                      name="email"
                      placeholder="Email"
                      value={profileData.email}
                      disabled
                    />
                  </FlexibleDiv>
                  <FlexibleDiv className="info2">
                    <p>Phone Number</p>
                    {isEditMode ? (
                      <Input
                        name="phoneNumber"
                        value={profileData.phoneNumber}
                        onChange={handlePhoneNumberChange}
                      />
                    ) : (
                      <p>{profileData.phoneNumber}</p>
                    )}
                  </FlexibleDiv>
                </FlexibleDiv>
              </FlexibleDiv>
            </FlexibleDiv>

            <FlexibleDiv
              className="profile__image__wrapper"
              flexDir="column"
              gap="29px"
            >
              <CustomUpload
                setFile={setFile}
                editable={isEditMode}
                initialImage={user?.profileImage}
              />

              <Button
                onClick={() => {
                  isEditMode ? handleSubmit() : setIsEditMode(true);
                }}
                width="50%"
                radius="8px"
                color="var(--oosriWhite)"
                backgroundColor="var(--oosriPrimary)"
                className="submit__btn"
                htmlType="submit"
                loading={isLoading}
              >
                {isEditMode ? 'Save Details' : 'Edit Details'}
              </Button>
            </FlexibleDiv>
          </FlexibleDiv>
        )}
      </SellersProfileWrapper>
  );
}
