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
  Typography,
} from "antd";
import {
  // EditOutlined,
  SaveOutlined,
  CloseOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import axios from "axios";
import "antd/dist/reset.css";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useTheme, Button as MuiButton } from "@mui/material";
import { tokens } from "../../../theme";
import { Edit as EditIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";


const HobProfile = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const Navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [cropModalVisible, setCropModalVisible] = useState(false);
  const [originalImage, setOriginalImage] = useState(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);

  const [form] = Form.useForm();

  const userDetails = JSON.parse(sessionStorage.getItem("hobDetails")) || {};
  const firstName = userDetails.firstname;
  const lastName = userDetails.lastname;
  const email = userDetails.email;
  const phoneNo = userDetails.mobile;
  const userGender = userDetails.extraind2;
  const country = userDetails.extraind3;
  const state = userDetails.extraind4;
  const city = userDetails.extraind5;
  const password = userDetails.passwords;
  const profileImageUrl = userDetails.imageUrl;

  const initialValues = {
    firstName: firstName || "",
    lastName: lastName || "",
    password: password || "",
    city: city || "",
    state: state || "",
    country: country || "",
    email: email || "",
    PhoneNo: phoneNo || "",
    gender: userGender || "",
    profileImageFile: null,
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);
    const sessionData = JSON.parse(sessionStorage.getItem("hobDetails"));
    const hobid = sessionData?.hobid || "";
    const password = values.password;
    const formData = new FormData();
    formData.append("hobid", hobid);
    formData.append("password", password);
    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);
    formData.append("email", values.email);
    formData.append("PhoneNo", values.PhoneNo);
    formData.append("gender", values.gender);
    if (values.profileImageFile) {
      formData.append("hobProfileImageBySelf", values.profileImageFile);
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/v1/HobUpdateByitsSelf`,
        // `http://127.0.0.1:8080/v1/HobUpdateByitsSelf`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      message.success("Profile updated successfully!");
      let updatedUserDetails = { ...sessionData, passwords: password, firstname: values.firstName, lastname: values.lastName, email: values.email, mobile: values.PhoneNo, extraind2: values.gender };
      if (response.data && response.data.imageUrl) {
        updatedUserDetails.imageUrl = response.data.imageUrl;
      }
      sessionStorage.setItem("hobDetails", JSON.stringify(updatedUserDetails));
      setIsEditing(false);
    } catch (error) {
      message.error("Error submitting form");
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleCropImage = async () => {
    if (!completedCrop || !imgRef.current) return;
    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext("2d");
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
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const reader = new FileReader();
          reader.onloadend = () => {
            setProfileImage(reader.result);
            resolve(reader.result);
          };
          reader.readAsDataURL(blob);
        },
        "image/jpeg",
        0.9
      );
    });
  };

  const handleSaveCroppedImage = async () => {
    const croppedImageData = await handleCropImage();
    if (croppedImageData) {
      // Convert base64 to blob for file upload
      const arr = croppedImageData.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const file = new Blob([u8arr], { type: mime });
      const profileImageFile = new File([file], "profile.jpg", { type: mime });
      
      // Set the file in form values
      form.setFieldsValue({ profileImageFile });
    }
    setCropModalVisible(false);
  };

  const cardStyle = {
    background: "#fff",
    borderRadius: 8,
    padding: 24,
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    margin: 16,
    maxWidth: 1100,
    marginLeft: "auto",
    marginRight: "auto",
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

      <div style={cardStyle}>
        {/* <Typography.Title
          level={3}
          style={{
            color: "#3e4396",
            fontWeight: "bold",
            marginBottom: 32,
            textAlign: "center",
            letterSpacing: 1,
          }}
        >
          Profile Details
        </Typography.Title> */}

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
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Row justify="center" style={{ marginBottom: 24 }}>
            <Col>
              <Avatar
                size={120}
                src={
                  profileImage ||
                  profileImageUrl ||
                  "https://via.placeholder.com/150"
                }
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
              {initialValues.firstName} (HOB)
              </Typography.Title>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                label="First Name"
                className="custom-placeholder-12px"
                name="firstName"
                disabled={true}
                rules={[{ required: true, message: "Required" }]}
              >
                <Input disabled={true} size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Last Name"
                className="custom-placeholder-12px"
                name="lastName"
                disabled={true}
                rules={[{ required: true, message: "Required" }]}
              >
                <Input disabled={true} size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Email"
                className="custom-placeholder-12px"
                name="email"
                disabled={true}
                rules={[
                  { required: true, message: "Required" },
                  { type: "email", message: "Invalid email" },
                ]}
              >
                <Input disabled={true} size="large" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                label="Phone Number"
                className="custom-placeholder-12px"
                name="PhoneNo"
                disabled={true}
                rules={[
                  { required: true, message: "Required" },
                  { pattern: /^[0-9]+$/, message: "Only numbers are allowed" },
                  { min: 10, message: "Must be at least 10 digits" },
                ]}
              >
                <Input disabled={true} size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Gender"
                className="custom-placeholder-12px"
                name="gender"
                disabled={true}
                rules={[{ required: true, message: "Required" }]}
              >
                <Input disabled={true} size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Password"
                className="custom-placeholder-12px"
                name="password"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input.Password disabled={!isEditing} size="large" />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end" gutter={16} style={{ marginTop: 24 }}>
            {isEditing && (
              <>
                <Col>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={isLoading}
                    // size="large"
                    className="form-button"
                    style={{
                      background: colors.blueAccent[1000],
                      borderColor: colors.blueAccent[1000],
                      color: "#fff",
                      // minWidth: 120,
                    }}
                  >
                    Save
                  </Button>
                </Col>
                <Col>
                  <MuiButton
                    htmlType="button"
                    variant="outlined"
                    icon={<CloseOutlined />}
                    // size="large"
                    color="error"
                    className="form-button"
                    sx={{
                      marginLeft: "8px",
                      // fontWeight: "bold",
                      borderRadius: "8px",
                    }}
                    onClick={() => {
                      setIsEditing(false);
                      form.resetFields();
                      setProfileImage(null);
                    }}
                  >
                    Cancel
                  </MuiButton>
                </Col>
              </>
            )}
          </Row>
        </Form>
        <Row justify="end" gutter={16} style={{ marginTop: 16 }}>
          {!isEditing && (
            <Col>
              <Button
                htmlType="button"
                icon={<EditIcon />}
                // size="large"
                className="form-button"
                style={{
                  background: colors.blueAccent[1000],
                  borderColor: colors.blueAccent[1000],
                  color: "#fff",
                  // minWidth: 120,
                }}
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            </Col>
          )}
        </Row>
        {/* Crop Modal */}
        <Modal
          open={cropModalVisible}
          title="Crop Profile Picture"
          onCancel={() => setCropModalVisible(false)}
          onOk={handleSaveCroppedImage}
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
      </div>
    </>
  );
};

export default HobProfile;
