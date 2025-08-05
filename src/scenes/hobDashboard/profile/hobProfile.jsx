import React, { useState, useRef, useEffect } from "react";
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
  Space,
} from "antd";
import {
  // EditOutlined,
  SaveOutlined,
  CloseOutlined,
  CameraOutlined,
  UserOutlined,
} from "@ant-design/icons";
import axios from "axios";
import "antd/dist/reset.css";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useTheme, Button as MuiButton } from "@mui/material";
import { tokens } from "../../../theme";
import { Edit as EditIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Country, State, City } from 'country-state-city';


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
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);

  const [form] = Form.useForm();
  const [userDetails, setUserDetails] = useState({});
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Test function to verify country-state-city library
  const testCountryStateCity = () => {
    console.log("=== Testing country-state-city library ===");
    const india = Country.getAllCountries().find(c => c.name === "India");
    console.log("India country object:", india);
    if (india) {
      const indianStates = State.getStatesOfCountry(india.isoCode);
      console.log("Indian states count:", indianStates.length);
      console.log("First 5 Indian states:", indianStates.slice(0, 5).map(s => s.name));
    }
    console.log("=== End test ===");
  };

  // Fetch HOB profile data from backend
  const fetchHobProfile = async () => {
    try {
      const sessionData = JSON.parse(sessionStorage.getItem("hobDetails"));
      const hobid = sessionData?.hobid;
      
      if (!hobid) {
        console.error("HOB ID not found in session storage");
        message.error("HOB ID not found. Please login again.");
        return;
      }

      console.log("Fetching HOB profile for hobid:", hobid);
      
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/v1/getHobProfile/${hobid}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("HOB profile data received:", data);
      console.log("Expected data structure:", {
        message: "Hob profile retrieved successfully",
        data: {
          hobid: "123",
          firstname: "John",
          lastname: "Doe",
          email: "john@example.com",
          mobile: "1234567890",
          extraind2: "Male",
          extraind3: "India",
          extraind4: "Maharashtra", 
          extraind5: "Mumbai",
          extraind7: "400001",
          passwords: "hashedPassword",
          imageUrl: "https://cem.alantur.ai/uploads/hob/image.jpg"
        }
      });
      
      if (data && data.data) {
        const profileData = data.data;
        setUserDetails(profileData);
        console.log("Profile data set:", profileData);
        
        // Update form fields with the fetched data
        console.log("Postal code value from API:", profileData.extraind7);
        console.log("Password value from API:", profileData.passwords);
        console.log("image  url: ", profileData.imageUrl);
        
        form.setFieldsValue({
          firstName: profileData.firstname || "",
          lastName: profileData.lastname || "",
          password: profileData.passwords || "",
          country: profileData.extraind3 || "",
          state: profileData.extraind4 || "",
          city: profileData.extraind5 || "",
          postalcode: profileData.extraind7 || "",
          email: profileData.email || "",
          phoneCode: profileData.phonecode || "",
          PhoneNo: profileData.mobile || "",
          gender: profileData.extraind2 || "",
        });
        
        console.log("Form fields updated with backend data");
        console.log("Form field values after update:", form.getFieldsValue());
      } else {
        console.error("No profile data found");
        message.error("Profile data not found");
      }
    } catch (error) {
      console.error("Error fetching HOB profile:", error);
      message.error("Failed to load profile data");
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Run test and fetch profile on component mount
  useEffect(() => {
    testCountryStateCity();
    fetchHobProfile();
  }, []);
  // Profile image URL from userDetails state
  const profileImageUrl = userDetails.imageUrl;

  // Initialize country/state/city data from userDetails
  useEffect(() => {
    if (userDetails?.extraind3) {
      const country = Country.getAllCountries().find((c) => c.name === userDetails.extraind3);
      setSelectedCountry(country || null);
      if (country) {
        const countryStates = State.getStatesOfCountry(country.isoCode);
        setStates(countryStates);
      }
    }
  }, [userDetails]);

  useEffect(() => {
    if (userDetails?.extraind4 && selectedCountry) {
      const state = State.getStatesOfCountry(selectedCountry.isoCode).find((s) => s.name === userDetails.extraind4);
      setSelectedState(state || null);
      if (state) {
        const stateCities = City.getCitiesOfState(selectedCountry.isoCode, state.isoCode);
        setCities(stateCities);
      }
    }
  }, [userDetails, selectedCountry]);

  // Update form fields when userDetails changes
  useEffect(() => {
    if (userDetails && Object.keys(userDetails).length > 0) {
      console.log("useEffect - Postal code value:", userDetails.extraind7);
      console.log("useEffect - Password value:", userDetails.passwords);
      
      form.setFieldsValue({
        firstName: userDetails.firstname || "",
        lastName: userDetails.lastname || "",
        password: userDetails.passwords || "",
        country: userDetails.extraind3 || "",
        state: userDetails.extraind4 || "",
        city: userDetails.extraind5 || "",
        postalcode: userDetails.extraind7 || "",
        email: userDetails.email || "",
        phoneCode: userDetails.phonecode || "",
        PhoneNo: userDetails.mobile || "",
        gender: userDetails.extraind2 || "",
      });
      console.log("Form fields updated via useEffect");
      console.log("useEffect - Form field values:", form.getFieldsValue());
    }
  }, [userDetails, form]);

  // Calculate initial values from userDetails state
  const initialValues = {
    firstName: userDetails.firstname || "",
    lastName: userDetails.lastname || "",
    password: userDetails.passwords || "",
    country: userDetails.extraind3 || "",
    state: userDetails.extraind4 || "",
    city: userDetails.extraind5 || "",
    postalcode: userDetails.extraind7 || "",
    email: userDetails.email || "",
    phoneCode: userDetails.phonecode || "",
    PhoneNo: userDetails.mobile || "",
    gender: userDetails.extraind2 || "",
    profileImageFile: null,
  };
  
  console.log("Initial values:", initialValues);
  console.log("User details:", userDetails);

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
    formData.append("phonecode", values.phoneCode);
    formData.append("PhoneNo", values.PhoneNo);
    formData.append("gender", values.gender);
    formData.append("extraind3", values.country);
    formData.append("extraind4", values.state);
    formData.append("extraind5", values.city);
    formData.append("extraind7", values.postalcode);
    
    // Handle profile image file
    const imageFile = values.profileImageFile || profileImageFile;
    if (imageFile) {
      formData.append("hobProfileImageBySelf", imageFile);
      console.log("Profile image attached to form data:", imageFile.name, imageFile.size);
    } else {
      console.log("No profile image file to upload");
    }
    
    // Debug: Log all form data
    console.log("Form data being sent:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + (pair[1] instanceof File ? `${pair[1].name} (${pair[1].size} bytes)` : pair[1]));
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/v1/HobUpdateByitsSelf`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      message.success("Profile updated successfully!");
      
      // Refresh profile data from backend
      await fetchHobProfile();
      
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
    console.log("Image file selected:", file);
    if (file) {
      console.log("File details:", {
        name: file.name,
        size: file.size,
        type: file.type
      });
      const reader = new FileReader();
      reader.onload = () => {
        setOriginalImage(reader.result);
        setCropModalVisible(true);
        console.log("Image loaded for cropping");
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
      const imageFile = new File([file], "profile.jpg", { type: mime });
      
      // Set the file in both state and form values
      setProfileImageFile(imageFile);
      form.setFieldsValue({ profileImageFile: imageFile });
      
      console.log("Profile image file set:", imageFile);
      console.log("Profile image file size:", imageFile.size);
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
      {isLoadingProfile && (
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
                  null
                }
                style={{
                  border: "2px solid #1677ff",
                  cursor: isEditing ? "pointer" : "default",
                  opacity: isEditing ? 1 : 0.8,
                }}
                onClick={() => isEditing && fileInputRef.current?.click()}
                icon={!profileImage && !profileImageUrl ? <UserOutlined /> : <CameraOutlined />}
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
                disabled={!isEditing}
                rules={[{ required: true, message: "Required" }]}
              >
                <Input    disabled={!isEditing} size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Last Name"
                className="custom-placeholder-12px"
                name="lastName"
                disabled={!isEditing}
                rules={[{ required: true, message: "Required" }]}
              >
                <Input    disabled={!isEditing} size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Email"
                className="custom-placeholder-12px"
                name="email"
                disabled={!isEditing}
                rules={[
                  { required: true, message: "Required" },
                  { type: "email", message: "Invalid email" },
                ]}
              >
                <Input  disabled={!isEditing} size="large" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item label="Phone Number" className="custom-placeholder-12px" required>
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
                      {Country.getAllCountries().map((c) => (
                        <Select.Option
                          key={c.isoCode}
                          value={`+${c.phonecode}`}
                        >{`+${c.phonecode}`}</Select.Option>
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
                label="Gender"
                className="custom-placeholder-12px"
                name="gender"
                disabled={!isEditing}
                rules={[{ required: true, message: "Required" }]}
              >
                <Input    disabled={!isEditing} size="large" />
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
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                label="Country"
                className="custom-placeholder-12px"
                name="country"
                rules={[{ required: true, message: "Country is required" }]}
              >
                <Select
                  showSearch
                  placeholder="Select Country"
                  disabled={!isEditing}
                  size="large"
                  onChange={(value, option) => {
                    console.log("Country selected - value:", value);
                    console.log("Country selected - option.children:", option.children);
                    
                    const selectedCountry = Country.getAllCountries().find(c => c.name === option.children);
                    console.log("Found country object:", selectedCountry);
                    
                    setSelectedCountry(selectedCountry);
                    if (selectedCountry) {
                      const countryStates = State.getStatesOfCountry(selectedCountry.isoCode);
                      console.log("States for", selectedCountry.name, ":", countryStates.length);
                      console.log("Sample states:", countryStates.slice(0, 5).map(s => s.name));
                      setStates(countryStates);
                      setCities([]);
                      form.setFieldsValue({ state: undefined, city: undefined });
                    } else {
                      console.log("Country not found for option.children:", option.children);
                      setStates([]);
                      setCities([]);
                    }
                  }}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {Country.getAllCountries().map((country) => (
                    <Select.Option key={country.isoCode} value={country.name}>
                      {country.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="State"
                className="custom-placeholder-12px"
                name="state"
                rules={[{ required: true, message: "State is required" }]}
              >
                <Select
                  showSearch
                  placeholder="Select State"
                  disabled={!isEditing || !selectedCountry}
                  size="large"
                  onChange={(value, option) => {
                    const selectedState = states.find(s => s.name === option.children);
                    setSelectedState(selectedState);
                    if (selectedState && selectedCountry) {
                      const stateCities = City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode);
                      setCities(stateCities);
                      form.setFieldsValue({ city: undefined });
                    }
                  }}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {console.log("Rendering states dropdown with", states.length, "states")}
                  {states.map((state) => {
                    console.log("State option:", state.name);
                    return (
                      <Select.Option key={state.isoCode} value={state.name}>
                        {state.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="City"
                className="custom-placeholder-12px"
                name="city"
                rules={[{ required: true, message: "City is required" }]}
              >
                <Select
                  showSearch
                  placeholder="Select City"
                  disabled={!isEditing || !selectedState}
                  size="large"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {cities.map((city) => (
                    <Select.Option key={city.name} value={city.name}>
                      {city.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Postal Code"
                className="custom-placeholder-12px"
                name="postalcode"
                rules={[{ required: true, message: "Postal Code is required" }]}
              >
                <Input 
                  disabled={!isEditing} 
                  size="large"
                  onChange={(e) => {
                    console.log("Postal code field changed to:", e.target.value);
                  }}
                />
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
