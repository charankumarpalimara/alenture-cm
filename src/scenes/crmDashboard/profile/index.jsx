import React, { useState, useRef, useEffect } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Form, Input, Button, Avatar, Row, Col, message, Modal, Typography, Select, Spin, Space } from 'antd';
import { Country, State, City } from 'country-state-city';
import { SaveOutlined, CloseOutlined, CameraOutlined } from '@ant-design/icons';
import axios from 'axios';
import 'antd/dist/reset.css';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { tokens } from '../../../theme'; // Adjust the path as necessary
import { useTheme, Button as MuiButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Edit as EditIcon } from "@mui/icons-material";

const CrmProfile = ({ apiUrl }) => {
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
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);

  const [userDetails, setUserDetails] = useState({});
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Fetch CRM profile data from backend
  const fetchCrmProfile = async () => {
    try {
      const sessionData = JSON.parse(sessionStorage.getItem("CrmDetails"));
      const crmid = sessionData?.crmid;
      
      if (!crmid) {
        console.error("CRM ID not found in session storage");
        message.error("CRM ID not found. Please login again.");
        return;
      }

      console.log("Fetching CRM profile for crmid:", crmid);
      
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/v1/getCrmProfile/${crmid}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("CRM profile data received:", data);
      
      if (data && data.data) {
        const profileData = data.data;
        setUserDetails(profileData);
        console.log("Profile data set:", profileData);
      } else {
        console.error("No profile data found");
        message.error("Profile data not found");
      }
    } catch (error) {
      console.error("Error fetching CRM profile:", error);
      message.error("Failed to load profile data");
    } finally {
      setIsLoadingProfile(false);
    }
  };


  // Fetch profile data on component mount
  useEffect(() => {
    fetchCrmProfile();
  }, []);

  // Handle country/state/city selection
  useEffect(() => {
    if (userDetails?.extraind3) {
      console.log("User country:", userDetails.extraind3);
      console.log("All countries:", Country.getAllCountries().map(c => c.name).slice(0, 10));
      
      // Try exact match first
      let country = Country.getAllCountries().find((c) => c.name === userDetails.extraind3);
      
      // If not found, try case-insensitive match
      if (!country) {
        country = Country.getAllCountries().find((c) => 
          c.name.toLowerCase() === userDetails.extraind3.toLowerCase()
        );
      }
      
      // If still not found, try partial match
      if (!country) {
        country = Country.getAllCountries().find((c) => 
          c.name.toLowerCase().includes(userDetails.extraind3.toLowerCase()) ||
          userDetails.extraind3.toLowerCase().includes(c.name.toLowerCase())
        );
      }
      
      console.log("Found country:", country);
      setSelectedCountry(country || null);
      if (country) {
        const countryStates = State.getStatesOfCountry(country.isoCode);
        console.log("States for", country.name, ":", countryStates.length);
        console.log("First few states:", countryStates.slice(0, 5).map(s => s.name));
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

  const profileImageUrl = userDetails.imageUrl;

  const initialValues = {
    firstName: userDetails.firstname || '',
    middleName: userDetails.middlename || '',
    lastName: userDetails.lastname || '',
    password: userDetails.passwords || '',
    city: userDetails.extraind5 || '',
    state: userDetails.extraind4 || '',
    country: userDetails.extraind3 || '',
    email: userDetails.email || '',
    phonecode: userDetails.phonecode || '',
    PhoneNo: userDetails.mobile || '',
    gender: userDetails.extraind2 || '',
    postalcode: userDetails.extraind6 || '',
  };

  console.log("CRM Profile - userDetails:", userDetails);
  console.log("crm image value:", profileImageUrl)
  console.log("CRM Profile - initialValues:", initialValues);
  console.log("CRM Profile - phonecode:", userDetails.phonecode);
  console.log("CRM Profile - mobile:", userDetails.mobile);
  console.log("CRM Profile - Phone Debug:");
  console.log("  - userDetails.phonecode:", userDetails.phonecode);
  console.log("  - userDetails.mobile:", userDetails.mobile);
  console.log("  - initialValues.phonecode:", initialValues.phonecode);
  console.log("  - initialValues.PhoneNo:", initialValues.PhoneNo);

  const checkoutSchema = yup.object().shape({
    firstName: yup.string()
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name cannot exceed 50 characters')
      .matches(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces')
      .required('First Name is required'),
    middleName: yup.string()
      .max(50, 'Middle name cannot exceed 50 characters')
      .matches(/^[a-zA-Z\s]*$/, 'Middle name can only contain letters and spaces'),
    lastName: yup.string()
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name cannot exceed 50 characters')
      .matches(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces')
      .required('Last Name is required'),
    password: yup.string()
      .min(8, 'Password must be at least 8 characters')
      .max(20, 'Password cannot exceed 20 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
      .required('Password is required'),
    city: yup.string()
      .min(2, 'City must be at least 2 characters')
      .required('City is required'),
    state: yup.string()
      .min(2, 'State must be at least 2 characters')
      .required('State is required'),
    country: yup.string()
      .min(2, 'Country must be at least 2 characters')
      .required('Country is required'),
    email: yup.string()
      .email('Please enter a valid email address (e.g., user@example.com)')
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
        'Email must be in valid format (e.g., user@domain.com)')
      .max(100, 'Email cannot exceed 100 characters')
      .required('Email is required'),
    phonecode: yup.string()
      .matches(/^\+\d{1,4}$/, 'Phone code must start with + and contain 1-4 digits')
      .required('Phone code is required'),
    PhoneNo: yup.string()
      .test('numbers-only', 'Only numbers allowed', function(value) {
        if (!value) return true; // Let required handle empty values
        return /^[0-9]+$/.test(value);
      })
      .min(10, 'At least 10 digits')
      .required('Phone number is required'),
    gender: yup.string()
      .oneOf(['Male', 'Female', 'Other'], 'Please select a valid gender')
      .required('Gender is required'),
    postalcode: yup.string()
      .min(3, 'Postal code must be at least 3 characters')
      .max(10, 'Postal code cannot exceed 10 characters')
      .required('Postal code is required'),
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);
    const sessionData = JSON.parse(sessionStorage.getItem('CrmDetails'));
    const crmid = sessionData?.crmid || '';
    const passwords = values.password;
    const formData = new FormData();
    formData.append('crmid', crmid);;
    formData.append('passwords', passwords);
    // Add all other fields as needed
    formData.append('firstname', values.firstName);
    formData.append('lastname', values.lastName);
    formData.append('extraind5', values.city);
    formData.append('extraind4', values.state);
    formData.append('extraind3', values.country);
    formData.append('extraind6', values.postalcode);
    formData.append('email', values.email);
    formData.append('phonecode', values.phonecode);
    formData.append('PhoneNo', values.PhoneNo);
    formData.append('gender', values.gender);
    formData.append('status', userDetails.extraind7 || 'Active');
    // Add photo if selected
    if (values.profileImageFile) {
      formData.append('crmProfileImageBySelf', values.profileImageFile);
    }
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/v1/UpdatecrmProfileDetailsByitsSelf`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        message.success('Profile updated successfully!');
      } else {
        message.error('Profile update failed!');
      }
      
      // Refresh profile data from backend
      await fetchCrmProfile();
      
      setIsEditing(false);
    } catch (error) {
      message.error('Error submitting form');
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
    // Center crop logic, but width/height not used directly
    setCrop({
      unit: '%',
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
  const handleCropImage = async (setFieldValue) => {
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
        // Set blob in Formik
        setFieldValue('profileImageFile', blob);
        resolve(blob);
      }, 'image/jpeg', 0.9);
    });
  };

  // Accept Formik helpers for crop save
  const handleSaveCroppedImage = async (setFieldValue) => {
    await handleCropImage(setFieldValue);
    setCropModalVisible(false);
  };

  // Ant Design theme colors (customize as needed)
  const cardStyle = {
    background: '#fff',
    borderRadius: 8,
    padding: 24,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    margin: 16,
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
    <div style={cardStyle}>
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
      <Formik initialValues={initialValues} validationSchema={checkoutSchema} onSubmit={handleSubmit} enableReinitialize>
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, resetForm }) => (
          <>
            <form onSubmit={handleSubmit}>
              <Row justify="center" style={{ marginBottom: 24 }}>
                <Col>
                  <Avatar
                    size={120}
                    src={profileImage || profileImageUrl || null}
                    style={{ border: '2px solid #1677ff', cursor: isEditing ? 'pointer' : 'default', opacity: isEditing ? 1 : 0.8 }}
                    onClick={() => isEditing && fileInputRef.current?.click()}
                    icon={<CameraOutlined />}
                  />
                  {isEditing && (
                    <div style={{ marginTop: 8, textAlign: 'center' }}>
                      <Button
                        type="dashed"
                        icon={<CameraOutlined />}
                        size="small"
                        onClick={() => fileInputRef.current?.click()}
                        style={{ borderRadius: 8 }}
                      >
                        {profileImage ? 'Change Photo' : 'Add Photo'}
                      </Button>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    style={{ display: 'none' }}
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
                      {initialValues.firstName}(Relationship Manager)
                  </Typography.Title>
                </Col>
              </Row>
              {/* <Row>
                <Col span={24}>
                  <h2 style={{ marginBottom: 24, textAlign: "center" }}>Profile Details</h2>
                </Col>
              </Row> */}
              <Row gutter={16}>
                <Col xs={24} md={8} style={{display:"none"}}>
                  <Typography.Text className="custom-headding-12px" style={{ marginBottom: 8 }}>ID</Typography.Text>
                  <Form.Item
                    validateStatus={touched.crmId && errors.crmId ? 'error' : ''}
                    help={touched.crmId && errors.crmId}
                    style={{ marginBottom: 16, display: 'flex', flexDirection: 'column' }}
                    labelCol={{ style: { marginBottom: 4 } }}
                  >
                    <Input
                      name="crmId"
                      value={values.crmId || userDetails.crmid || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={true}
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Typography.Text className="custom-headding-12px" style={{ marginBottom: 8 }}>First Name</Typography.Text>
                  <Form.Item
                    validateStatus={touched.firstName && errors.firstName ? 'error' : ''}
                    help={touched.firstName && errors.firstName}
                    style={{ marginBottom: 16, display: 'flex', flexDirection: 'column' }}
                    labelCol={{ style: { marginBottom: 4 } }}
                  >
                    <Input
                      name="firstName"
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={!isEditing}
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Typography.Text className="custom-headding-12px" style={{ marginBottom: 8 }}>Last Name</Typography.Text>
                  <Form.Item
                    validateStatus={touched.lastName && errors.lastName ? 'error' : ''}
                    help={touched.lastName && errors.lastName}
                    style={{ marginBottom: 16, display: 'flex', flexDirection: 'column' }}
                    labelCol={{ style: { marginBottom: 4 } }}
                  >
                    <Input
                      name="lastName"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={!isEditing}
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Typography.Text className="custom-headding-12px" style={{ marginBottom: 8 }}>Email</Typography.Text>
                  <Form.Item
                    validateStatus={touched.email && errors.email ? 'error' : ''}
                    help={touched.email && errors.email}
                    style={{ marginBottom: 16, display: 'flex', flexDirection: 'column' }}
                    labelCol={{ style: { marginBottom: 4 } }}
                  >
                    <Input
                      name="email"
                      value={values.email}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Convert to lowercase for consistency
                        e.target.value = value.toLowerCase();
                        handleChange(e);
                      }}
                      onBlur={handleBlur}
                      disabled={!isEditing}
                      size="large"
                      placeholder="user@example.com"
                      maxLength={100}
                      status={touched.email && errors.email ? 'error' : ''}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Typography.Text className="custom-headding-12px" style={{ marginBottom: 8 }}>Phone Number</Typography.Text>
                  <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column' }}>
                    <Space.Compact style={{ width: '100%' }}>
                      <Select
                        showSearch
                        style={{ width: "40%" }}
                        placeholder="Code"
                        optionFilterProp="children"
                        disabled={!isEditing}
                        size="large"
                        value={values.phonecode}
                        onChange={(value) => setFieldValue("phonecode", value)}
                        onBlur={handleBlur}
                        status={touched.phonecode && errors.phonecode ? 'error' : ''}
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
                      <Input
                        style={{ width: "60%" }}
                        placeholder="Phone Number"
                        disabled={!isEditing}
                        size="large"
                        value={values.PhoneNo}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="PhoneNo"
                        status={touched.PhoneNo && errors.PhoneNo ? 'error' : ''}
                      />
                    </Space.Compact>
                    {/* Phone code error */}
                    {(touched.phonecode && errors.phonecode) && (
                      <div style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '4px' }}>
                        {errors.phonecode}
                      </div>
                    )}
                    {/* Phone number error */}
                    {(touched.PhoneNo && errors.PhoneNo) && (
                      <div style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '4px' }}>
                        {errors.PhoneNo}
                      </div>
                    )}
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <Typography.Text className="custom-headding-12px" style={{ marginBottom: 8 }}>Gender</Typography.Text>
                  <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column' }}>
                    <Select
                      placeholder="Select Gender"
                      disabled={!isEditing}
                      size="large"
                      value={values.gender}
                      onChange={(value) => setFieldValue("gender", value)}
                      onBlur={handleBlur}
                      status={touched.gender && errors.gender ? 'error' : ''}
                    >
                      <Select.Option value="Male">Male</Select.Option>
                      <Select.Option value="Female">Female</Select.Option>
                      <Select.Option value="Other">Other</Select.Option>
                    </Select>
                    {(touched.gender && errors.gender) && (
                      <div style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '4px' }}>
                        {errors.gender}
                      </div>
                    )}
                  </div>
                </Col>

              {/* </Row>
              <Row gutter={16}> */}
                <Col xs={24} md={8}>
                  <Typography.Text className="custom-headding-12px" style={{ marginBottom: 8 }}>Country</Typography.Text>
                  <Form.Item
                    validateStatus={touched.country && errors.country ? 'error' : ''}
                    help={touched.country && errors.country}
                    style={{ marginBottom: 16, display: 'flex', flexDirection: 'column' }}
                    labelCol={{ style: { marginBottom: 4 } }}
                  >
                    <Select
                      placeholder="Select Country"
                      disabled={!isEditing}
                      showSearch
                      optionFilterProp="children"
                      value={values.country}
                      onChange={(value) => {
                        console.log("Selected country value:", value);
                        setFieldValue("country", value);
                        const country = Country.getAllCountries().find(c => c.name === value);
                        console.log("Found country object:", country);
                        setSelectedCountry(country);
                        setSelectedState(null);
                        setCities([]);
                        setFieldValue("state", "");
                        setFieldValue("city", "");
                        if (country) {
                          const countryStates = State.getStatesOfCountry(country.isoCode);
                          console.log("States for", country.name, ":", countryStates.length);
                          setStates(countryStates);
                        } else {
                          setStates([]);
                        }
                      }}
                      onBlur={handleBlur}
                      size="large"
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
                  <Typography.Text className="custom-headding-12px" style={{ marginBottom: 8 }}>State</Typography.Text>
                  <Form.Item
                    validateStatus={touched.state && errors.state ? 'error' : ''}
                    help={touched.state && errors.state}
                    style={{ marginBottom: 16, display: 'flex', flexDirection: 'column' }}
                    labelCol={{ style: { marginBottom: 4 } }}
                  >
                    <Select
                      placeholder="Select State"
                      disabled={!isEditing || !selectedCountry}
                      showSearch
                      optionFilterProp="children"
                      value={values.state}
                      onChange={(value) => {
                        setFieldValue("state", value);
                        const state = states.find(s => s.name === value);
                        setSelectedState(state);
                        setCities([]);
                        setFieldValue("city", "");
                        if (state) {
                          const stateCities = City.getCitiesOfState(selectedCountry.isoCode, state.isoCode);
                          setCities(stateCities);
                        } else {
                          setCities([]);
                        }
                      }}
                      onBlur={handleBlur}
                      size="large"
                    >
                      {states.map((state) => (
                        <Select.Option key={state.isoCode} value={state.name}>
                          {state.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Typography.Text className="custom-headding-12px" style={{ marginBottom: 8 }}>City</Typography.Text>
                  <Form.Item
                    validateStatus={touched.city && errors.city ? 'error' : ''}
                    help={touched.city && errors.city}
                    style={{ marginBottom: 16, display: 'flex', flexDirection: 'column' }}
                    labelCol={{ style: { marginBottom: 4 } }}
                  >
                    <Select
                      placeholder="Select City"
                      disabled={!isEditing || !selectedState}
                      showSearch
                      optionFilterProp="children"
                      value={values.city}
                      onChange={(value) => {
                        setFieldValue("city", value);
                      }}
                      onBlur={handleBlur}
                      size="large"
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
                  <Typography.Text className="custom-headding-12px" style={{ marginBottom: 8 }}>Postal Code</Typography.Text>
                  <Form.Item
                    validateStatus={touched.postalcode && errors.postalcode ? 'error' : ''}
                    help={touched.postalcode && errors.postalcode}
                    style={{ marginBottom: 16, display: 'flex', flexDirection: 'column' }}
                    labelCol={{ style: { marginBottom: 4 } }}
                  >
                    <Input
                      name="postalcode"
                      value={values.postalcode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={!isEditing}
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Typography.Text className="custom-headding-12px" style={{ marginBottom: 8 }}>Password</Typography.Text>
                  <Form.Item
                    validateStatus={touched.password && errors.password ? 'error' : ''}
                    help={touched.password && errors.password}
                    style={{ marginBottom: 16, display: 'flex', flexDirection: 'column' }}
                    labelCol={{ style: { marginBottom: 4 } }}
                  >
                    <Input.Password
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={!isEditing}
                      size="large"
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
                        size="large"
                        style={{ borderRadius: 8, background: colors.blueAccent[1000] }}
                        className="form-button"
                      >
                        Save
                      </Button>
                    </Col>
                    <Col>
                      <MuiButton
                        type="button"
                        variant="outlined"
                        // starticon={<CloseOutlined />}
                        size="large"
                        color="error"
                        style={{ marginLeft: 8, fontWeight: '600', borderRadius: 8, }}
                        onClick={() => {
                          setIsEditing(false);
                          resetForm();
                          setProfileImage(null);
                        }}
                        className="form-button"
                      >
                        Cancel
                      </MuiButton>
                    </Col>
                  </>
                )}
              </Row>
            </form>
            <Row justify="end" gutter={16} style={{ marginTop: 16 }}>
              {!isEditing && (
                <Col>
                  <Button
                    htmlType="button"
                    icon={<EditIcon />}
                    className="form-button"
                    size="large"
                    style={{ background: colors.blueAccent[1000], color: '#fff', borderRadius: 8 }}
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
              onOk={() => handleSaveCroppedImage(setFieldValue)}
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
                    style={{ maxHeight: '70vh', maxWidth: '100%' }}
                    alt="Crop preview"
                  />
                </ReactCrop>
              )}
            </Modal>
          </>
        )}
      </Formik>
    </div>
  );
};

export default CrmProfile;