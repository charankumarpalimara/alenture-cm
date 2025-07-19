import React, { useState, useRef } from "react";
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
} from "antd";
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import axios from "axios";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

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

  // Load user details from sessionStorage
  const userDetails = JSON.parse(sessionStorage.getItem("CmDetails")) || {};
  const profileImageUrl = userDetails.imageUrl;

  // Set initial form values
  const initialValues = {
    crmId: userDetails.cmid || "",
    firstName: userDetails.firstname || "",
    middleName: userDetails.middlename || "",
    lastName: userDetails.lastname || "",
    password: userDetails.passwords || "",
    city: userDetails.extraind5 || "",
    state: userDetails.extraind4 || "",
    country: userDetails.extraind3 || "",
    email: userDetails.email || "",
    phonecode: userDetails.phonecode || "",
    PhoneNo: userDetails.mobile || "",
    gender: userDetails.extraind2 || "",
  };

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
    formData.append("PhoneNo", values.PhoneNo);
    formData.append("gender", values.gender);
    // Add photo if selected
    if (profileImageBlob) {
      formData.append("cmProfileImage", profileImageBlob, "profile.jpg");
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
      message.success("Profile updated successfully!");
      // Update sessionStorage with new imageUrl if present in response
      let updatedUserDetails = { ...sessionData, passwords: values.password, firstname: values.firstName, lastname: values.lastName, email: values.email, mobile: values.PhoneNo, extraind2: values.gender };
      if (response.data && response.data.imageUrl) {
        updatedUserDetails.imageUrl = response.data.imageUrl;
      }
      sessionStorage.setItem("CmDetails", JSON.stringify(updatedUserDetails));
      setIsEditing(false);
    } catch (error) {
      message.error("Error submitting form");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
    setProfileImage(null);
  };

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
          initialValues={initialValues}
          onFinish={handleFinish}
        >
          <Row justify="center" style={{ marginBottom: 24 }}>
            <Col>
              <Avatar
                size={120}
                src={profileImage || profileImageUrl || 'https://via.placeholder.com/150'}
                style={{
                  border: "2px solid #1677ff",
                  cursor: isEditing ? "pointer" : "default",
                  opacity: isEditing ? 1 : 0.8,
                }}
                onClick={() => isEditing && fileInputRef.current?.click()}
                icon={<CameraOutlined />}
              />
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
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item label="ID" name="crmId">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[{ required: true, message: "First Name is required" }]}
              >
                <Input disabled={!isEditing} />
              </Form.Item>
            </Col>
            {/* <Col xs={24} md={8}>
              <Form.Item label="Middle Name" name="middleName">
                <Input disabled={!isEditing} />
              </Form.Item>
            </Col> */}
            <Col xs={24} md={8}>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[{ required: true, message: "Last Name is required" }]}
              >
                <Input disabled={!isEditing} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Invalid email" },
                ]}
              >
                <Input disabled={!isEditing} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Phone Number"
                name="PhoneNo"
                rules={[
                  { required: true, message: "Phone number is required" },
                  { pattern: /^[0-9]+$/, message: "Only numbers allowed" },
                  { min: 10, message: "At least 10 digits" },
                ]}
              >
                <Input disabled={!isEditing} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Gender"
                name="gender"
                rules={[{ required: true, message: "Gender is required" }]}
              >
                <Input disabled={!isEditing} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Password is required" }]}
              >
                <Input.Password disabled={!isEditing} />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end" gutter={16} style={{ marginTop: 24 }}>
            {isEditing ? (
              <>
                <Col>
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    loading={isLoading}
                    size="large"
                    style={{
                      borderRadius: 8,
                      background: colors.blueAccent[1000],
                    }}
                    htmlType="submit"
                    className="form-button"
                  >
                    Save
                  </Button>
                </Col>
                <Col>
                  <Button
                    htmlType="button"
                    type="default"
                    icon={<CloseOutlined />}
                    danger
                    size="large"
                    style={{
                      marginLeft: 8,
                      borderRadius: 8,
                    }}
                    onClick={handleCancel}
                    className="form-button"
                  >
                    Cancel
                  </Button>
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


        {!isEditing && (
          <Row justify="end" gutter={16} style={{ marginTop: 24 }}>
            <Col>
              <Button
                htmlType="button"
                className="form-button"
                icon={<EditOutlined />}
                size="large"
                style={{
                  background: colors.blueAccent[1000],
                  color: "#fff",
                  borderRadius: 8,
                }}
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            </Col>
          </Row>
        )}
      </div>
    </>
  );
};

export default CmProfile;