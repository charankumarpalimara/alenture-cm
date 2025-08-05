import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Form,
  Input,
  Button,
  Avatar,
  Row,
  Col,
  message,
  Modal,
  Spin,
  Typography,
  Select,
  Space
} from "antd";
import { Country } from 'country-state-city';

import {
  // EditOutlined,
  SaveOutlined,
  CloseOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import axios from "axios";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { tokens } from "../../../theme";
import { useTheme, Button as MuiButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Edit as EditIcon } from "@mui/icons-material";
import { getCreaterId } from "../../../config";

const CmProfile = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const Navigate = useNavigate();
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [cropModalVisible, setCropModalVisible] = useState(false);
  const [originalImage, setOriginalImage] = useState(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [profileImageBlob, setProfileImageBlob] = useState(null);

  const imgRef = useRef(null);
  const fileInputRef = useRef(null);

  const [userDetails, setUserDetails] = useState({});
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [imageLoadError, setImageLoadError] = useState(false);

  // Fetch CM profile data from backend
  const fetchCmProfile = useCallback(async () => {
    try {
      // const sessionData = JSON.parse(sessionStorage.getItem("CmDetails"));
      // console.log("Session data:", sessionData);
      // const cmid = sessionData?.cmid;
      
      if (!getCreaterId()) {
        console.error("CM ID not found in session storage");
        // console.error("Available session data:", sessionData);
        message.error("CM ID not found. Please login again.");
        return;
      }

      console.log("Fetching CM profile for cmid:", getCreaterId());
      
      // Try environment variable first, fallback to localhost
      const baseUrl = process.env.REACT_APP_API_URL;
      const apiUrl = `${baseUrl}/v1/getCmProfile/${getCreaterId()}`;
      
      console.log("API URL:", apiUrl);
      console.log("Environment API URL:", process.env.REACT_APP_API_URL);
      console.log("Base URL used:", baseUrl);
      
      const response = await fetch(apiUrl);
      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);
      
      if (!response.ok) {
        let errorText;
        try {
          errorText = await response.text();
          console.error("API Error Response:", errorText);
        } catch (e) {
          errorText = `Could not read error response: ${e.message}`;
        }
        
        // For 500 errors, the endpoint might not exist - let's try a different approach
        if (response.status === 500) {
          console.error("500 Error - Backend endpoint might not exist or have issues");
          console.error("Trying to call:", apiUrl);
          console.error("Make sure the backend has the getCmProfile endpoint");
        }
        
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      console.log("CM profile data received:", data);
      
      if (data && data.data) {
        const profileData = data.data;
        setUserDetails(profileData);
        setImageLoadError(false); // Reset image error state
        console.log("Profile data set:", profileData);
        
        // Explicitly set form values after data is loaded
        form.setFieldsValue({
          crmId: profileData.cmid || "",
          firstName: profileData.firstname || "",
          lastName: profileData.lastname || "",
          password: profileData.passwords || "",
          email: profileData.email || "",
          phoneCode: profileData.phonecode || "",
          PhoneNo: profileData.mobile || "",
          gender: profileData.extraind2 || "",
        });
        
        console.log("Form fields updated with backend data");
      } else {
        console.error("No profile data found");
        message.error("Profile data not found");
      }
    } catch (error) {
      console.error("Error fetching CM profile:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      // Fallback: Use session storage data if API fails
      console.log("API failed, trying to use session storage as fallback");
      const sessionData = JSON.parse(sessionStorage.getItem("CmDetails"));
      if (sessionData) {
        console.log("Using session storage data:", sessionData);
        setUserDetails(sessionData);
        
        form.setFieldsValue({
          crmId: sessionData.cmid || "",
          firstName: sessionData.firstname || "",
          lastName: sessionData.lastname || "",
          password: sessionData.passwords || "",
          email: sessionData.email || "",
          phoneCode: sessionData.phonecode || "",
          PhoneNo: sessionData.mobile || "",
          gender: sessionData.extraind2 || "",
        });
        
        message.warning("Using cached data - some information might be outdated");
      } else {
        message.error(`Failed to load profile data: ${error.message}`);
      }
    } finally {
      setIsLoadingProfile(false);
    }
  }, [form]);

  // Fetch profile data on component mount
  useEffect(() => {
    fetchCmProfile();
  }, [fetchCmProfile]);

  const profileImageUrl = userDetails.imageUrl;
  
  // Debug image URLs
  console.log("CM Profile - Image Debug:");
  console.log("profileImage (local):", profileImage);
  console.log("profileImageUrl (from backend):", profileImageUrl);
  console.log("userDetails.imageUrl:", userDetails.imageUrl);
  console.log("Final Avatar src:", profileImage || profileImageUrl || 'https://via.placeholder.com/150');

  // Update form fields when userDetails changes
  useEffect(() => {
    if (userDetails && Object.keys(userDetails).length > 0) {
      console.log("CM Profile - userDetails loaded:", userDetails);
      
      form.setFieldsValue({
        crmId: userDetails.cmid || "",
        firstName: userDetails.firstname || "",
        lastName: userDetails.lastname || "",
        password: userDetails.passwords || "",
        email: userDetails.email || "",
        phoneCode: userDetails.phonecode || "",
        PhoneNo: userDetails.mobile || "",
        gender: userDetails.extraind2 || "",
      });
      
      console.log("Form fields updated via useEffect");
      console.log("Current form values:", form.getFieldsValue());
    }
  }, [userDetails, form]);

  // Set initial form values
  const initialValues = {
    crmId: userDetails.cmid || "",
    firstName: userDetails.firstname || "",
    middleName: userDetails.middlename || "",
    lastName: userDetails.lastname || "",
    password: userDetails.passwords || "",
    email: userDetails.email || "",
    phoneCode: userDetails.phonecode || "",
    PhoneNo: userDetails.mobile || "",
    gender: userDetails.extraind2 || "",
  };

  console.log("CM Profile - initialValues:", initialValues);
  console.log("CM Profile - userDetails:", userDetails);
  console.log("CM Profile - isLoadingProfile:", isLoadingProfile);
  console.log("CM Profile - form instance:", form);
  console.log("CM Profile - isEditing:", isEditing);

  // Handle image upload and cropping
  const handleImageUpload = (event) => {
    if (!isEditing) return;
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setOriginalImage(reader.result);
        setCropModalVisible(true);
      };
      reader.readAsDataURL(file);
    }
  };

  function onImageLoad(e) {
    setCrop({
      unit: "%",
      x: 10,
      y: 10,
      width: 80,
      height: 80,
      aspect: 1,
    });
  }



  const handleCropComplete = (crop) => {
    setCompletedCrop(crop);
  };

  // Accept Formik helpers as argument for crop save
  const handleCropImage = async () => {
    if (!completedCrop || !imgRef.current) return;
    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) return;
        // Set preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileImage(reader.result);
        };
        reader.readAsDataURL(blob);
        setProfileImageBlob(blob); // <-- store blob in state
        resolve(blob);
      }, 'image/jpeg', 0.9);
    });
  };

  // Accept Formik helpers for crop save
  const handleSaveCroppedImage = async () => {
    await handleCropImage();
    setCropModalVisible(false);
  };

  // Handle form submit
  const handleFinish = async (values) => {
    setIsLoading(true);
    const sessionData = JSON.parse(sessionStorage.getItem("CmDetails"));
    const cmid = sessionData?.cmid || "";
    const formData = new FormData();
    formData.append("cmid", cmid);
    formData.append("password", values.password);
    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);
    formData.append("email", values.email);
    formData.append("phonecode", values.phoneCode);
    formData.append("PhoneNo", values.PhoneNo);
    formData.append("gender", values.gender);
    // Add photo if selected
    if (profileImageBlob) {
      // Convert blob to File object for better backend compatibility
      const imageFile = new File([profileImageBlob], "profile.jpg", { 
        type: "image/jpeg",
        lastModified: Date.now()
      });
      formData.append("cmProfileImage", imageFile);
      console.log("Image file added to form data:", imageFile);
    }
    
    // Debug: Log all form data entries
    console.log("FormData contents:");
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}:`, `File(${value.name}, ${value.size} bytes, ${value.type})`);
      } else {
        console.log(`${key}:`, value);
      }
    }
    
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/v1/updateCmProfile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      if (response.status === 200) {
        message.success("Profile updated successfully!");
        
        // Check if response contains imageUrl
        console.log("Update response:", response.data);
        
        // Update session storage with new firstName and lastName
        const updatedSessionData = {
          ...sessionData,
          firstname: values.firstName,
          lastname: values.lastName,
          email: values.email,
          mobile: values.PhoneNo,
          phonecode: values.phoneCode,
          extraind2: values.gender
        };
        
        // If response includes imageUrl, update it in session storage
        if (response.data && response.data.imageUrl) {
          console.log("New image URL from response:", response.data.imageUrl);
          updatedSessionData.imageUrl = response.data.imageUrl;
        }
        
        sessionStorage.setItem("CmDetails", JSON.stringify(updatedSessionData));
        console.log("Session storage updated:", updatedSessionData);
        
        // Clear the local profile image state so it shows the server image
        setProfileImage(null);
        setProfileImageBlob(null);
        
      } else {
        message.error("Profile update failed!");
      }
      
      // Refresh profile data from backend to get the latest imageUrl
      await fetchCmProfile();
      
      setIsEditing(false);
    } catch (error) {
      message.error("Error submitting form");
    } finally {
      setIsLoading(false);
    }
  };



  if (isLoadingProfile) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
          color: "#fff",
          fontSize: "20px",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            color: "#fff",
            fontSize: "20px",
          }}
        >
          <Spin size="large" fullscreen />
        </div>
      )}
      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          padding: 24,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          margin: 16,
        }}
      >
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
          <Button
            type="text"
            icon={<CloseOutlined style={{ fontSize: 20 }} />}
            onClick={() => Navigate(-1)}
            style={{
              // margin: "16px 0 0 8px",
              color: "#3e4396",
              fontWeight: 600,
              fontSize: 16,
              alignSelf: "flex-end"
            }}
          >
            {/* Back */}
          </Button>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
        >
          <Row justify="center" style={{ marginBottom: 24 }}>
            <Col>
              <Avatar
                size={120}
                src={!imageLoadError ? (profileImage || profileImageUrl) : null}
                style={{
                  border: "2px solid #1677ff",
                  cursor: isEditing ? "pointer" : "default",
                  opacity: isEditing ? 1 : 0.8,
                }}
                onClick={() => isEditing && fileInputRef.current?.click()}
                icon={<CameraOutlined />}
                onError={() => {
                  console.log("Avatar image failed to load:", profileImageUrl);
                  setImageLoadError(true);
                  return false;
                }}
              />
              
              {/* Debug image URL */}
              {profileImageUrl && (
                <div style={{ display: 'none' }}>
                  <img 
                    src={profileImageUrl} 
                    alt="test" 
                    onLoad={() => {
                      console.log("Direct image test - SUCCESS:", profileImageUrl);
                      setImageLoadError(false);
                    }}
                    onError={(e) => {
                      console.log("Direct image test - ERROR:", profileImageUrl);
                      console.log("Error details:", e);
                      setImageLoadError(true);
                    }}
                  />
                </div>
              )}
              {isEditing && (
                <div style={{ marginTop: 8, textAlign: "center" }}>
                  <Button
                    type="dashed"
                    icon={<CameraOutlined />}
                    size="small"
                    onClick={() => fileInputRef.current?.click()}
                    style={{ borderRadius: 8 }}
                  >
                    {profileImage ? "Change Photo" : "Add Photo"}
                  </Button>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                style={{ display: "none" }}
                disabled={!isEditing}
              />
            </Col>
          </Row>
          <Row justify="center" style={{ marginBottom: 15 }}>
            <Col>
              <Typography.Title
                level={4}
                style={{
                  color: "#3e4396",
                  fontWeight: "500",
                  // marginBottom: 20,
                  textAlign: "center",
                  letterSpacing: 1,
                }}
              >
                {initialValues.firstName} (Customer Manager)
              </Typography.Title>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={8} style={{display:"none"}}>
              <Form.Item
                label={<span className="custom-headding-12px">ID</span>}
                name="crmId"
                rules={[{ required: true, message: "ID is required" }]}
              >
                <Input   size="large" disabled />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={<span className="custom-headding-12px">First Name</span>}
                name="firstName"
                rules={[{ required: true, message: "First Name is required" }]}
              >
                <Input   size="large" disabled={!isEditing} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={<span className="custom-headding-12px">Last Name</span>}
                name="lastName"
                rules={[{ required: true, message: "Last Name is required" }]}
              >
                <Input   size="large" disabled={!isEditing} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={<span className="custom-headding-12px">Email</span>}
                name="email"
              
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Invalid email" },
                ]}
              >
                <Input   size="large" disabled={!isEditing} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label={<span className="custom-headding-12px">Phone Number</span>} required>
                <Space.Compact style={{ width: '100%' }}>
                  <Form.Item
                    name="phoneCode"
                    noStyle
                    rules={[{ required: true, message: "Code" }]}
                  >
                    <Select
                      showSearch
                      style={{ width: "40%" }}
                      placeholder="Code"
                      optionFilterProp="children"
                      disabled={!isEditing}
                      size="large"
                    >
                      {Country.getAllCountries().map((country) => (
                        <Select.Option 
                          key={country.isoCode} 
                          value={`+${country.phonecode}`}
                        >
                          +{country.phonecode}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="PhoneNo"
                    noStyle
                    rules={[
                      { required: true, message: "Phone number is required" },
                      { pattern: /^[0-9]+$/, message: "Only numbers allowed" },
                      { min: 10, message: "At least 10 digits" },
                    ]}
                  >
                    <Input
                      style={{ width: "60%" }}
                      placeholder="Phone Number"
                      disabled={!isEditing}
                      size="large"
                    />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={<span className="custom-headding-12px">Gender</span>}
                name="gender"
                rules={[{ required: true, message: "Gender is required" }]}
              >
                <Select
                  placeholder="Select Gender"
                  disabled={!isEditing}
                  size="large"
                >
                  <Select.Option value="Male">Male</Select.Option>
                  <Select.Option value="Female">Female</Select.Option>
                  <Select.Option value="Other">Other</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label={<span className="custom-headding-12px">Password</span>}
                name="password"
                rules={[{ required: true, message: "Password is required" }]}
              >
                <Input.Password size="large" disabled={!isEditing} />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end" gutter={16} style={{ marginTop: 24 }}>
            {isEditing ? (
              <>
                <Col>
                  <MuiButton
                    variant="contained"
                    startIcon={<SaveOutlined />}
                    disabled={isLoading}
                    // size="large"
                    sx={{
                      borderRadius: "8px",
                      background: colors.blueAccent[1000],
                      color:"#fff",
                      // "&:hover": {
                      //   background: colors.blueAccent[900],
                      // },
                    }}
                    type="submit"
                    className="form-button"
                  >
                    {isLoading ? "Saving..." : "Save"}
                  </MuiButton>
                </Col>
                <Col>
                  <MuiButton
                      type="button"
                      variant="outlined"
                      // starticon={<CloseOutlined />}
                      // size="large"
                      color="error"
                      style={{ marginLeft: "8px", fontWeight: '600', borderRadius: "8px", }}
                      onClick={() => {
                        setIsEditing(false);
                        // form.resetFields();
                        setProfileImage(null);
                      }}
                      className="form-button"
                  >
                    Cancel
                  </MuiButton>
                </Col>
              </>
            ) : null}
          </Row>
          {/* Crop Modal */}
          <Modal
            open={cropModalVisible}
            title="Crop Profile Picture"
            onCancel={() => setCropModalVisible(false)}
            onOk={handleSaveCroppedImage} // <-- No argument needed
            okText="Save Photo"
            cancelText="Cancel"
            width={400}
            styles={{ body: { height: 350 } }}
          >
            {originalImage && (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={handleCropComplete}
                aspect={1}
                circularCrop
              >
                <img
                  ref={imgRef}
                  src={originalImage}
                  onLoad={onImageLoad}
                  style={{ maxHeight: "70vh", maxWidth: "100%" }}
                  alt="Crop preview"
                />
              </ReactCrop>
            )}
          </Modal>
        </Form>


        {/* Debug info */}
        {/* <div style={{ 
          position: 'fixed', 
          top: 10, 
          right: 10, 
          background: 'black', 
          color: 'white', 
          padding: '10px', 
          zIndex: 9999,
          borderRadius: '4px'
        }}>
          isEditing: {isEditing ? 'true' : 'false'}
        </div> */}

        {/* Force show all buttons for testing */}
        <Row justify="end" gutter={16} style={{ padding: '10px' }}>
          <Col style={{display: isEditing ? "none" : "block"}}>
            <MuiButton
              variant="contained"
              startIcon={<EditIcon />}
              // size="large"
              sx={{
                background: colors.blueAccent[1000],
                color: "#fff",
                borderRadius: "8px",
                // "&:hover": {
                //   background: colors.blueAccent[900],
                // },
              }}
              onClick={() => {
                console.log("Edit button clicked! Setting isEditing to true");
                setIsEditing(true);
              }}
              className="form-button"
            >
              Edit
            </MuiButton>
          </Col>
          {/* <Col>
            <MuiButton
              variant="contained"
              startIcon={<SaveOutlined />}
              size="large"
              sx={{
                backgroundColor: colors.blueAccent[1000],
                color: "#fff",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: colors.blueAccent[900],
                },
                marginLeft: "8px",
              }}
              onClick={() => {
                console.log("Save button clicked!");
              }}
              type="submit"
            >
              Save
            </MuiButton>
          </Col>
          <Col>
            <MuiButton
              variant="outlined"
              color="error"
              startIcon={<CloseOutlined />}
              size="large"
              sx={{
                marginLeft: "8px",
                borderRadius: "8px",
              }}
              onClick={() => {
                console.log("Cancel button clicked!");
                setIsEditing(false);
                form.resetFields();
                setProfileImage(null);
              }}
            >
              Cancel
            </MuiButton>
          </Col> */}
        </Row>
      </div>
    </>
  );
};

export default CmProfile;