import React, { useState, useRef } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Modal,
  Avatar,
  Row,
  Col,
  message,
  Spin,
  Result,
  Typography
} from "antd";
import { CameraOutlined, CloseOutlined } from "@ant-design/icons";
import { Country, State, City } from "country-state-city";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { tokens } from "../../../theme";
import { useTheme, useMediaQuery} from "@mui/material";

const { Option } = Select;
const { Text } = Typography;

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  const cropWidth = mediaWidth * 0.9;
  const cropHeight = cropWidth / aspect;
  const cropX = (mediaWidth - cropWidth) / 2;
  const cropY = (mediaHeight - cropHeight) / 2;
  return {
    unit: "%",
    x: (cropX / mediaWidth) * 100,
    y: (cropY / mediaHeight) * 100,
    width: (cropWidth / mediaWidth) * 100,
    height: (cropHeight / mediaHeight) * 100,
  };
}


function extractColorsFromGradient(gradient) {
  if (!gradient || !gradient.startsWith("linear-gradient")) return [];
  // Get part inside parentheses
  const inside = gradient.match(/\((.*)\)/)[1];
  // Split by comma, skip first part if it's direction
  const parts = inside.split(",").map(x => x.trim());
  // If first part looks like direction, remove it
  const colorStops = parts.filter((p, i) => i === 0
    ? !/^to |[0-9]+deg$/.test(p) && /^#|rgb|hsl/.test(p)
    : true
  );
  // Or simply skip first part always
  return parts.slice(1).map(x => x.trim());
}

const GradientCheckCircle = ({ size = 100, background }) => {
  // If background is a CSS gradient, extract color stops
  const colorStops = extractColorsFromGradient(background);
  // Fallback colors
  const stops = colorStops.length ? colorStops : ["#4facfe", "#00f2fe"];
  return (
    <svg width={size} height={size} viewBox="0 0 1024 1024">
      <defs>
        <linearGradient id="checkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          {stops.map((color, i) => (
            <stop
              key={i}
              offset={`${(i / (stops.length - 1)) * 100}%`}
              stopColor={color}
            />
          ))}
        </linearGradient>
      </defs>
      <circle cx="512" cy="512" r="480" fill="url(#checkGradient)" />
      <polyline
        points="320,540 470,690 720,390"
        fill="none"
        stroke="#fff"
        strokeWidth="80"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const SuccessScreen = ({ onNext, background }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      minHeight: "80vh",
      background: "#fff",
      borderRadius: 8,
      padding: 24,
      margin: 16,
      boxShadow: "0 4px 24px #0001",
    }}
  >
    <Result
      icon={<GradientCheckCircle size={100} background={background} />}
      title={
        <span style={{ fontSize: 45, fontWeight: 600 }}>Success</span>
      }
      subTitle={
        <span style={{ fontSize: 25 }}>
          New HOB has been created successfully.
        </span>
      }
      extra={[
        <Button
          type="primary"
          size="large"
          key="next"
          onClick={onNext}
          style={{
            fontSize: 18,
            borderRadius: 8,
            background: background,
            border: "none",
          }}
        >
          Continue
        </Button>,
      ]}
      style={{ background: "#fff", borderRadius: 16, padding: 32 }}
    />
  </div>
);

const HobForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery("(max-width: 400px)");
    const isTablet = useMediaQuery("(max-width: 700px)");
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  // const [selectedCity, setSelectedCity] = useState('');
  const navigate = useNavigate();

  const [profileImage, setProfileImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editValues, setEditValues] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalEditValues, setOriginalEditValues] = useState({});
  const [createdHobId, setCreatedHobId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const countries = Country.getAllCountries();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setOriginalImage(reader.result);
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  function onImageLoad(e) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
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
    await handleCropImage();
    setCropModalOpen(false);
  };

  const handleFormSubmit = async (values) => {
    setIsLoading(true);
    const formData = new FormData();

    formData.append("firstname", values.firstName || "");
    formData.append("lastname", values.lastName || "");
    formData.append("designation", values.designation || "");
    formData.append("street", values.street || "");
    formData.append("gender", values.gender || "");
    formData.append("country", values.country || "");
    formData.append("state", values.state || "");
    formData.append("city", values.city || "");
    formData.append("email", values.email || "");
    formData.append("phonecode", values.phoneCode || "");
    formData.append("mobile", values.PhoneNo || "");
    formData.append("username", values.email || "");
    formData.append("passwords", values.firstName + values.PhoneNo);

    if (profileImage) {
      try {
        let blob;
        if (profileImage.startsWith("data:")) {
          const res = await fetch(profileImage);
          blob = await res.blob();
        } else {
          blob = profileImage;
        }
        formData.append("hobimage", blob, "profileImage.jpg");
      } catch (error) {
        console.error("Error converting image to blob:", error);
      }
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/v1/createHob`,
        // `http://127.0.0.1:8080/v1/createHob`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const hobData = response.data.data || {};
      const FinalHobid = response.data.hobid || hobData.hobid;
      // Modal.success({ content: "Form Data Submitted Successfully" });
      console.log("Response:", response);
      // message.success("Hob Registerd Successfully");
      setEditValues({ ...values, profileImage, hobid: FinalHobid }); // <-- set modal values
      setCreatedHobId(FinalHobid);
      setOriginalEditValues({ ...values, profileImage });
      // setShowEditModal(true); // <-- open modal
      // setIsEditMode(false);
      setShowSuccess(true);
      setIsLoading(false);
      console.log("CRM created with ID:", FinalHobid);
      // Navigate("/admin/hob");
    } catch (error) {
      Modal.error({ content: "Error submitting form data" });
    } finally {
      setIsLoading(false);
    }
  };




  const handleUpdate = async () => {
    const values = editValues;
    setIsLoading(true);
    const formData = new FormData();
    formData.append("hobid", createdHobId);
    formData.append("firstname", values.firstName || "");
    formData.append("lastname", values.lastName || "");
    formData.append("designation", values.designation || "");
    formData.append("street", values.street || "");
    formData.append("gender", values.gender || "");
    formData.append("country", values.country || "");
    formData.append("state", values.state || "");
    formData.append("city", values.city || "");
    formData.append("email", values.email || "");
    formData.append("phonecode", values.phoneCode || "");
    formData.append("mobile", values.PhoneNo || "");
    formData.append("username", values.email || "");
    formData.append("passwords", values.firstName + values.PhoneNo);

    if (profileImage) {
      try {
        let blob;
        if (profileImage.startsWith("data:")) {
          const res = await fetch(profileImage);
          blob = await res.blob();
        } else {
          blob = profileImage;
        }
        formData.append("hobimage", blob, "profileImage.jpg");
      } catch (error) {
        console.error("Error converting image to blob:", error);
      }
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/v1/updateHob`,
        // `http://127.0.0.1:8080/v1/updateHob`,
        formData,
        { headers: { "Content-Type": "multipart/form-data, charset=utf-8" } }
      );
      // Modal.success({ content: "Form Data Submitted Successfully" });
      console.log("Response:", response);
      message.success("Hob Registerd Successfully");
      navigate(-1);
    } catch (error) {
      Modal.error({ content: "Error submitting form data" });
    } finally {
      setIsLoading(false);
    }
  };


  const handleCancelEdit = () => {
    setEditValues(originalEditValues);
    setIsEditMode(false);
  };

  // Close modal
  const handleModalClose = () => {
    setShowEditModal(false);
    navigate(-1); // Go to previous page
  };



  const states = selectedCountry
    ? State.getStatesOfCountry(
      countries.find((c) => c.name === selectedCountry)?.isoCode || ""
    )
    : [];

  const cities = selectedState
    ? City.getCitiesOfState(
      countries.find((c) => c.name === selectedCountry)?.isoCode || "",
      states.find((s) => s.name === selectedState)?.isoCode || ""
    )
    : [];
  const gender = ["Male", "Female"];

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
          {/* <div style={{ position: 'absolute', top: '60%', width: '100%', textAlign: 'center', color: '#fff', fontSize: 18 }}>
                Loading... Please wait while we process your request.
              </div> */}
        </div>
      )}

      <Modal
        open={showEditModal}
        title="Review & Edit HOB Details"
        onCancel={handleModalClose}
        closable={false}
        footer={null}
        width="80%"
        okButtonProps={{
          style: {
            background: "#3e4396",
            borderColor: "#3e4396",
            color: "#fff",
            fontWeight: "bold",
          },
        }}
      >
        <Form
          layout="vertical"
          initialValues={editValues}
          onValuesChange={(_, allValues) => setEditValues({ ...editValues, ...allValues })}
        >
          <Row justify="center" style={{ marginBottom: 24 }}>
            <Col>
              <div style={{ position: "relative", display: "inline-block" }}>
                <Avatar
                  src={editValues.profileImage || "https://via.placeholder.com/150"}
                  size={120}
                  style={{
                    border: "2px solid #1677ff",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                />
              </div>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}>
                <Input disabled={!isEditMode} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}>
                <Input disabled={!isEditMode} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
                <Input disabled={!isEditMode} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item label="Phone Code" name="phoneCode" rules={[{ required: true }]}>
                <Input disabled={!isEditMode} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Phone Number" name="PhoneNo" rules={[{ required: true }]}>
                <Input disabled={!isEditMode} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Gender" name="gender" rules={[{ required: true }]}>
                <Select disabled={!isEditMode}>
                  <Option value="Male">Male</Option>
                  <Option value="Female">Female</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>

            <Col xs={24} md={8}>
              <Form.Item label="Country" name="country" rules={[{ required: true }]}>
                <Select
                  showSearch
                  placeholder="Select Country"
                  disabled={!isEditMode}
                  style={{ borderRadius: 8, background: "#fff", fontSize: 16 }}
                  onChange={(value) => {
                    setSelectedCountry(value);
                    // Reset state and city if country changes
                    setEditValues((prev) => ({ ...prev, state: "", city: "" }));
                  }}
                >
                  {countries.map((c) => (
                    <Option key={c.isoCode} value={c.name}>
                      {c.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="State" name="state" rules={[{ required: true }]}>
                <Select
                  showSearch
                  placeholder="Select State"
                  disabled={!isEditMode || !editValues.country}
                  style={{ borderRadius: 8, background: "#fff", fontSize: 16 }}
                  onChange={(value) => {
                    setSelectedState(value);
                    setEditValues((prev) => ({ ...prev, city: "" }));
                  }}
                >
                  {(editValues.country
                    ? State.getStatesOfCountry(
                      countries.find((c) => c.name === editValues.country)?.isoCode || ""
                    )
                    : []
                  ).map((s) => (
                    <Option key={s.isoCode} value={s.name}>
                      {s.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="City" name="city" rules={[{ required: true }]}>
                <Select
                  showSearch
                  placeholder="Select City"
                  disabled={!isEditMode || !editValues.state}
                  style={{ borderRadius: 8, background: "#fff", fontSize: 16 }}
                >
                  {(editValues.country && editValues.state
                    ? City.getCitiesOfState(
                      countries.find((c) => c.name === editValues.country)?.isoCode || "",
                      State.getStatesOfCountry(
                        countries.find((c) => c.name === editValues.country)?.isoCode || ""
                      ).find((s) => s.name === editValues.state)?.isoCode || ""
                    )
                    : []
                  ).map((city) => (
                    <Option key={city.name} value={city.name}>
                      {city.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

          </Row>
          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item label="Postal Code" name="postcode" rules={[{ required: true }]}>
                <Input disabled={!isEditMode} />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
            {!isEditMode ? (
              <>
                <Button
                  type="primary"
                  onClick={() => setIsEditMode(true)}
                  className="form-button"
                  style={{
                    background: "#3e4396",
                    borderColor: "#3e4396",
                    color: "#fff",
                    minWidth: 120,
                  }}
                >
                  Edit
                </Button>
                <Button
                  style={{ marginLeft: 12 }}
                  onClick={handleModalClose}
                  danger
                  className="form-button"
                >
                  Close
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="primary"
                  onClick={handleUpdate}
                  loading={isLoading}
                  style={{
                    background: "#3e4396",
                    borderColor: "#3e4396",
                    color: "#fff",
                    minWidth: 120,
                  }}
                >
                  Update
                </Button>
                <Button
                  style={{ marginLeft: 12 }}
                  onClick={handleCancelEdit}
                  danger
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </Form>
      </Modal>

      {!showSuccess && (
        <div
          style={{ background: "#fff", borderRadius: 8, padding: isMobile ? 15 : 24, margin: 16 }}
        >
          <div style={{ display: "flex", justifyContent: isMobile ? "flex-start" : "space-between", alignItems: "center", marginBottom: 16 }}>
            <Text
              className="custom-headding-16px"
                                        style={{
                textAlign: isMobile ? "left" : "center",
                fontSize: isMobile ? "15px" : isTablet ? "17px" : "18px",
                paddingLeft: isMobile ? "0px" : "30px",
              }}
            >
              Create New HOB
            </Text>
            <Button
              type="text"
              icon={<CloseOutlined style={{ fontSize: isMobile ? 17 : 20 }} />}
              onClick={() => navigate(-1)}
              style={{
                color: "#3e4396",
                fontWeight: 600,
                fontSize: 16,
                alignSelf: "flex-end",
                marginLeft: 8,
              }}
            />
          </div>
          <Form
            form={form}
            layout="vertical"
            onFinish={(values) => {    // <-- open the modal
              handleFormSubmit(values);
            }}
            initialValues={{
              firstName: "",
              lastName: "",
              designation: "",
              street: "",
              gender: "",
              country: "",
              state: "",
              city: "",
              email: "",
              phoneCode: "",
              PhoneNo: "",
            }}
            validateTrigger={["onChange", "onBlur"]}
            scrollToFirstError
            autoComplete="off"
          >
            <Row justify="center" style={{ marginBottom: 24 }}>
              <Col>
                <div style={{ position: "relative", display: "inline-block" }}>
                  <Avatar
                    src={profileImage || "https://via.placeholder.com/150"}
                    size={120}
                    style={{
                      border: "2px solid #1677ff",
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}
                    onClick={triggerFileInput}
                  />
                  <Button
                    icon={<CameraOutlined />}
                    shape="circle"
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      background: "#1677ff",
                      color: "#fff",
                      border: "none",
                    }}
                    onClick={triggerFileInput}
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                </div>
              </Col>
            </Row>
            <Modal
              open={cropModalOpen}
              title="Crop Profile Picture"
              onCancel={() => setCropModalOpen(false)}
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
            <Row gutter={24}>
              <Col xs={24} md={8}>
                <Form.Item
                  className="custom-placeholder-12px"
                  label={<span className="custom-headding-12px">First Name</span>}
                  name="firstName"
                  rules={[{ required: true, message: "First Name is required" }]}
                >
                  <Input
                    placeholder="First Name"
                    size="large"
                    style={{ borderRadius: 8, background: "#fff" }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  className="custom-placeholder-12px"
                  label={<span className="custom-headding-12px">Last Name</span>}
                  name="lastName"
                  rules={[{ required: true, message: "Last Name is required" }]}
                >
                  <Input
                    placeholder="Last Name"
                    size="large"
                    style={{ borderRadius: 8, background: "#fff" }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  className="custom-placeholder-12px"
                  label={<span className="custom-headding-12px">Email Id</span>}
                  name="email"
                  rules={[{ required: true, message: "Email is required" }]}
                >
                  <Input
                    placeholder="Email"
                    size="large"
                    style={{ borderRadius: 8, background: "#fff" }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  className="custom-placeholder-12px"
                  label={<span className="custom-headding-12px">Phone Number</span>}
                  required
                >
                  <Input.Group compact>
                    <Form.Item
                      className="custom-placeholder-12px"
                      name="phoneCode"
                      noStyle
                      rules={[{ required: true, message: "Code is required" }]}
                    >
                      <Select
                        showSearch
                        style={{ width: "40%" }}
                        placeholder="Code"
                        optionFilterProp="children"
                        size="large"
                      >
                        {countries.map((c) => (
                                                  <Select.Option
                          key={c.isoCode}
                          value={`+${c.phonecode}`}
                        >{`+${c.phonecode}`}</Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      className="custom-placeholder-12px"
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
                        size="large"
                      />
                    </Form.Item>
                  </Input.Group>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  className="custom-placeholder-12px"
                  label={<span className="custom-headding-12px">Gender</span>}
                  name="gender"
                  rules={[{ required: true, message: "Gender is required" }]}
                >
                  <Select
                    placeholder="Select Gender"
                    size="large"
                    style={{ borderRadius: 8, background: "#fff" }}
                  >
                    {gender.map((g) => (
                      <Option key={g} value={g}>
                        {g}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  className="custom-placeholder-12px"
                  label={<span className="custom-headding-12px">Country</span>}
                  name="country"
                  rules={[{ required: true, message: "Country is required" }]}
                >
                  <Select
                    showSearch
                    placeholder="Select Country"
                    size="large"
                    style={{ borderRadius: 8, background: "#fff" }}
                    onChange={(value) => {
                      setSelectedCountry(value);
                      form.setFieldsValue({ state: "", city: "" });
                    }}
                  >
                    {countries.map((c) => (
                      <Option key={c.isoCode} value={c.name}>
                        {c.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  className="custom-placeholder-12px"
                  label={<span className="custom-headding-12px">State</span>}
                  name="state"
                  rules={[{ required: true, message: "State is required" }]}
                >
                  <Select
                    showSearch
                    placeholder="Select State"
                    size="large"
                    style={{ borderRadius: 8, background: "#fff" }}
                    onChange={(value) => {
                      setSelectedState(value);
                      form.setFieldsValue({ city: "" });
                    }}
                    disabled={!selectedCountry}
                  >
                    {states.map((s) => (
                      <Option key={s.isoCode} value={s.name}>
                        {s.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  className="custom-placeholder-12px"
                  label={<span className="custom-headding-12px">City</span>}
                  name="city"
                  rules={[{ required: true, message: "City is required" }]}
                >
                  <Select
                    showSearch
                    placeholder="Select City"
                    size="large"
                    style={{ borderRadius: 8, background: "#fff" }}
                    disabled={!selectedState}
                  >
                    {cities.map((city) => (
                      <Option key={city.name} value={city.name}>
                        {city.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row justify="end" style={{ marginTop: 32 }} gutter={16}>
              <Col>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="form-button"
                  // size="large"
                  style={{
                    background: colors.blueAccent[1000],
                    color: "#fff",
                    fontWeight: "600",
                    fontSize: "12px",
                    borderRadius: 8,
                  }}
                  loading={isLoading}
                >
                  Create
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      )}

      {showSuccess && (
        <SuccessScreen background={colors.blueAccent[1000]} onNext={() => navigate(`/hobdetails/${createdHobId}`)} />
      )}
    </>
  );
};

export default HobForm;
