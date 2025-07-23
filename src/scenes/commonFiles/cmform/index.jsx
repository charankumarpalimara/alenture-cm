import React, { useEffect, useState, useRef } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Row,
  Col,
  Avatar,
  Modal,
  Typography,
  message,
  Spin,
  Result
} from "antd";
import { CameraOutlined } from "@ant-design/icons";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Country } from "country-state-city";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";
import { CloseOutlined } from "@ant-design/icons";
// import { ArrowLeftOutlined } from "@ant-design/icons";
import { getCreaterRole, getCreaterId } from "../../../config"; // Adjust the path as necessary

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
          New Customer Manager has been created successfully.
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



const CmForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  // const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);
  const [organizationNames, setOrganizationNames] = useState([]);
  const [branchNames, setBranchNames] = useState([]);
  const [crmNameList, setCrmNameList] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editValues, setEditValues] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalEditValues, setOriginalEditValues] = useState({});
  const [createdCmId, setCreatedCmId] = useState(null);
  const [modalOrganizationNames, setModalOrganizationNames] = useState([]);
  const [modalBranchNames, setModalBranchNames] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  //  const ticket = useMemo(() => location.state?.ticket || {}, [location.state]);
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/v1/getAllOrganizationnames`
          // "http://127.0.0.1:8080/v1/getAllOrganizationnames",
        );
        const data = await response.json();
        if (response.ok && Array.isArray(data.data)) {
          setModalOrganizationNames(data.data.map((item) => item.organizationname || "N/A"));
          setOrganizationNames(
            data.data.map((item) => item.organizationname || "N/A")
          );
        }
      } catch (error) { }
    };
    fetchOrganizations();
  }, []);
  // const crmidValue = form.getFieldValue("crmid");


  const fetchBranch = async (orgName) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/v1/getBranchbyOrganizationname/${orgName}`
      );
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.branchDetails)) {
          setBranchNames(data.branchDetails);
          setModalBranchNames(data.branchDetails);
        } else if (typeof data.branchDetails === "string") {
          setBranchNames([data.branchDetails]);
          setModalBranchNames([data.branchDetails]);
        } else {
          setBranchNames([]);
          setModalBranchNames([]);
        }
      }
    } catch (error) { }
  };

  useEffect(() => {
    const fetchCrmNames = async () => {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/v1/GetCrmNames`);
      const data = await res.json();
      setCrmNameList(data.data || []);
    };
    fetchCrmNames();
  }, []);

  // useEffect(() => {
  //   const fetchCrmNames = async () => {
  //     try {
  //       // const res = await fetch(`${process.env.REACT_APP_API_URL}/GetCrmNames`);
  //       const res = await fetch(`http://127.0.0.1:8080/GetCrmNames`);
  //       const data = await res.json();
  //       setCrmNameList(data.data || []);
  //     } catch {
  //       setCrmNameList([]);
  //     }
  //   };
  //   fetchCrmNames();
  // }, []);




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
    // console.log(crmName);
    const formData = new FormData();

    // Use the exact field names as in your form and backend
    formData.append("firstname", values.firstName || "");
    formData.append("lastname", values.lastName || "");
    formData.append("phonecode", values.phoneCode || "");
    formData.append("mobile", values.PhoneNo || "");
    formData.append("email", values.email || "");
    formData.append("gender", values.gender || "");
    formData.append("designation", values.designation || "");
    formData.append("organization", values.organization || "");
    formData.append("branch", values.branch || "");
    formData.append("username", values.email || "");
    formData.append("crmId", values.crmid || "");
    formData.append("crmName", values.crmname || "");

    // const sessionData = JSON.parse(sessionStorage.getItem("hobDetails"));
    const createrrole = getCreaterRole();
    const createrid = getCreaterId() || "";
    const password = (values.firstName || "") + (values.PhoneNo || "");
    formData.append("createrrole", createrrole);
    formData.append("createrid", createrid);
    formData.append("passwords", password);

    if (profileImage) {
      try {
        // Convert base64 to blob if needed
        let blob;
        if (profileImage.startsWith("data:")) {
          const res = await fetch(profileImage);
          blob = await res.blob();
        } else {
          blob = profileImage;
        }
        formData.append("cmimage", blob, "profileImage.jpg");
      } catch (error) {
        console.error("Error converting image to blob:", error);
      }
    }
    try {
      const responce = await axios.post(
        `${process.env.REACT_APP_API_URL}/v1/createCm`,
        // `http://127.0.0.1:8080/v1/createCm`,
        formData,
        { headers: { "Content-Type": "multipart/form-data, charset=utf-8" } }
      );
      // Modal.success({ content: "CM Registered Successfully!" });
      // message.success("CM Registered Successfully!");
      const cmData = responce.data.data || {};
      const FinalCmid = responce.data.cmid || cmData.cmid;

      // message.success("CM Registered Successfully!");
      setEditValues({ ...values, profileImage, cmid: FinalCmid }); // <-- set modal values
      setCreatedCmId(FinalCmid);
      setShowSuccess(true);
      setOriginalEditValues({ ...values, profileImage });
      // setShowEditModal(true); // <-- open modal
      // setIsEditMode(false);
      setIsLoading(false);
    } catch (error) {
      // Modal.error({ content: "Error submitting form" });
      message.error("Error submitting form");
    } finally {
      setIsLoading(false);
    }
  };


  // Actually submit to backend
  const handleUpdate = async () => {
    setIsLoading(true);
    const values = editValues;
    const formData = new FormData();
    formData.append("cmid", createdCmId);
    formData.append("firstname", values.firstName || "");
    formData.append("lastname", values.lastName || "");
    formData.append("phonecode", values.phoneCode || "");
    formData.append("mobile", values.PhoneNo || "");
    formData.append("email", values.email || "");
    formData.append("gender", values.gender || "");
    formData.append("designation", values.designation || "");
    formData.append("organization", values.organization || "");
    formData.append("branch", values.branch || "");
    formData.append("username", values.email || "");

    formData.append("crmId", values.crmid || "");
    formData.append("crmName", values.crmname || "");
    // const createrrole = getCreaterRole() || "";
    // const sessionData = JSON.parse(sessionStorage.getItem("hobDetails"));
    const createrrole = getCreaterRole();
    const createrid = getCreaterId() || "";
    const password = (values.firstName || "") + (values.PhoneNo || "");
    formData.append("createrrole", createrrole);
    formData.append("createrid", createrid);
    formData.append("passwords", password);

    if (values.profileImage) {
      try {
        let blob;
        if (values.profileImage.startsWith("data:")) {
          const res = await fetch(values.profileImage);
          blob = await res.blob();
        } else {
          blob = values.profileImage;
        }
        formData.append("cmimage", blob, "profileImage.jpg");
      } catch (error) {
        console.error("Error converting image to blob:", error);
      }
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/v1/UpdateCm`,
        // `http://127.0.0.1:8080/v1/updateCm`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      message.success("CM Registered Successfully!");
      form.resetFields();
      setProfileImage(null);
      setOriginalImage(null);
      setShowEditModal(false);
      setIsLoading(false);
      navigate(-1);
    } catch (error) {
      message.error("Error submitting form!");
      setIsLoading(false);
    }
  };

  // Cancel editing in modal
  const handleCancelEdit = () => {
    setEditValues(originalEditValues);
    setIsEditMode(false);
  };

  // Close modal
  const handleModalClose = () => {
    setShowEditModal(false);
    navigate(-1); // Go to previous page
  };

  const countries = Country.getAllCountries();
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
        title="Review & Edit CM Details"
        onCancel={handleModalClose}
        closable={false}
        footer={null}
        width="80%"
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
              <Form.Item label="First Name" className="custom-placeholder-12px" name="firstName" rules={[{ required: true }]}>
                <Input disabled={!isEditMode} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Last Name" className="custom-placeholder-12px" name="lastName" rules={[{ required: true }]}>
                <Input disabled={!isEditMode} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Email" className="custom-placeholder-12px" name="email" rules={[{ required: true, type: "email" }]}>
                <Input disabled={!isEditMode} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item label="Phone Code" className="custom-placeholder-12px" name="phoneCode" rules={[{ required: true }]}>
                <Input disabled={!isEditMode} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Phone Number" className="custom-placeholder-12px" name="PhoneNo" rules={[{ required: true }]}>
                <Input disabled={!isEditMode} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Gender" className="custom-placeholder-12px" name="gender" rules={[{ required: true }]}>
                <Select disabled={!isEditMode}>
                  <Option value="Male">Male</Option>
                  <Option value="Female">Female</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            {/* <Col xs={24} md={8}>
              <Form.Item label="Designation" name="designation" rules={[{ required: true }]}>
                <Input disabled={!isEditMode} />
              </Form.Item>
            </Col> */}
            <Col xs={24} md={8}>
              <Form.Item
                label="Organization"
                className="custom-placeholder-12px"
                name="organization"
                rules={[{ required: true, message: "Organization is required" }]}
              >
                <Select
                  showSearch
                  placeholder="Select Organization"
                  onChange={async (value) => {
                    form.setFieldsValue({ organization: value, branch: "" });
                    await fetchBranch(value);
                  }}
                  disabled={!isEditMode}
                >
                  {modalOrganizationNames.map((org) => (
                    <Select.Option key={org} value={org}>
                      {org}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={<span>Organization Unit</span>}
                className="custom-placeholder-12px"
                name="branch"
                rules={[{ required: true, message: "Organization Unit is required" }]}
              >
                <Select
                  showSearch
                  placeholder="Select Organization Unit"
                  disabled={!isEditMode}
                >
                  {modalBranchNames.map((item, idx) => (
                    <Select.Option key={idx} value={item.branch}>
                      {item.branch}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="CRM Name"
                className="custom-placeholder-12px"
                name="crmname"
                rules={[{ required: true, message: "CRM Name is required" }]}
              >
                <Select
                  showSearch
                  placeholder="Select CRM Name"
                  optionFilterProp="children"
                  disabled={!isEditMode}
                  onChange={(value) => {
                    const selected = crmNameList.find(crm => crm.crmid === value);
                    // Set both crmname and crmid in the form and in editValues
                    setEditValues((prev) => ({
                      ...prev,
                      crmname: selected ? selected.name : "",
                      crmid: value,
                    }));
                  }}
                  value={editValues.crmid}
                >
                  {crmNameList.map((crm) => (
                    <Select.Option key={crm.crmid} value={crm.crmid}>
                      {crm.name} ({crm.crmid})
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="CRM ID" name="crmid" style={{ display: "none" }}>
                <Input disabled />
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
          style={{ background: "#fff", borderRadius: 8, padding: 24, margin: 16 }}

        >
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            <Button
              type="text"
              icon={<CloseOutlined style={{ fontSize: 20 }} />}
              onClick={() => navigate(-1)}
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
            onFinish={(values) => {    // <-- open the modal
              handleFormSubmit(values);
            }}
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              phoneCode: "",
              PhoneNo: "",
              gender: "",
              designation: "",
              organization: "",
              branch: "",
              crmid: "",
              crmname: "",
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
              styles={{ body: { height: 350 } }} // <-- updated from bodyStyle
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
                  label={<Text className="custom-headding-12px">First Name</Text>}
                  className="custom-placeholder-12px"
                  name="firstName"
                  rules={[{ required: true, message: "First Name is required" }]}
                >
                  <Input
                    placeholder="First Name"
                    size="large"
                    style={{ borderRadius: 8, background: "#fff" }}
                    className="custom-placeholder-12px"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label={<Text className="custom-headding-12px">Last Name</Text>}
                  className="custom-placeholder-12px"
                  name="lastName"
                  rules={[{ required: true, message: "Last Name is required" }]}
                >
                  <Input
                    placeholder="Last Name"
                    size="large"
                    style={{ borderRadius: 8, background: "#fff", }}
                    className="custom-placeholder-12px"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label={<Text className="custom-headding-12px">Email Id</Text>}
                  className="custom-placeholder-12px"
                  name="email"
                  rules={[{ required: true, message: "Email is required" }]}
                >
                  <Input
                    placeholder="Email"
                    size="large"
                    style={{ borderRadius: 8, background: "#fff", }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label={<Text className="custom-headding-12px">Phone Number</Text>} className="custom-placeholder-12px" required>
                  <Input.Group compact>
                    <Form.Item
                      name="phoneCode"
                      noStyle
                      rules={[{ required: true, message: "Code is required" }]}
                    >
                      <Select
                        showSearch
                        style={{ width: 160 }}
                        placeholder="Phone Code"
                        optionFilterProp="children"
                        size="large"
                      >
                        {countries.map((c) => (
                          <Select.Option
                            key={c.isoCode}
                            value={`+${c.phonecode}`}
                          >{`+${c.phonecode} (${c.name})`}</Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="PhoneNo"
                      noStyle
                      className="custom-placeholder-12px"
                      rules={[
                        { required: true, message: "Phone number is required" },
                        { pattern: /^[0-9]+$/, message: "Only numbers allowed" },
                        { min: 10, message: "At least 10 digits" },
                      ]}
                    >
                      <Input
                        style={{ width: "calc(100% - 160px)" }}
                        placeholder="Phone Number"
                        size="large"

                      />
                    </Form.Item>
                  </Input.Group>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label={<Text className="custom-headding-12px">Gender</Text>}
                  className="custom-placeholder-12px"
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
                  label={<Text className="custom-headding-12px">Organization</Text>}
                  className="custom-placeholder-12px"
                  name="organization"
                  rules={[
                    { required: true, message: "Organization is required" },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Select Organization"
                    size="large"
                    style={{ borderRadius: 8, background: "#fff" }}
                    onChange={async (value) => {
                      form.setFieldsValue({ organization: value, branch: "" });
                      await fetchBranch(value);
                    }}
                  >
                    {organizationNames.map((org) => (
                      <Option key={org} value={org}>
                        {org}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label={<Text className="custom-headding-12px">Organization Unit</Text>}
                  className="custom-placeholder-12px"
                  name="branch"
                  rules={[{ required: true, message: "Organization Unit is required" }]}
                >
                  <Select
                    showSearch
                    placeholder="Select Organization Unit"
                    size="large"
                    style={{ borderRadius: 8, background: "#fff" }}
                    className="custom-placeholder-12px"
                  >
                    {branchNames.map((item, idx) => (
                      <Select.Option key={idx} value={item.branch}>
                        {item.branch}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label={<Text className="custom-headding-12px">Relationship Manager</Text>}
                  className="custom-placeholder-12px"
                  name="crmname"
                  rules={[{ required: true, message: "Relationship Manager is required" }]}
                >
                  <Select
                    showSearch
                    placeholder="Select Relationship Manager"
                    optionFilterProp="children"
                    size="large"
                    onChange={(value) => {
                      const selected = crmNameList.find(crm => crm.crmid === value);
                      form.setFieldsValue({
                        crmname: selected ? selected.name : "",
                        crmid: value
                      });
                    }}
                    className="custom-placeholder-12px"
                  >
                    {crmNameList.map((crm) => (
                      <Select.Option key={crm.crmid} value={crm.crmid}>
                        {crm.name} ({crm.crmid})
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="CRM ID" name="crmid" style={{ display: "none" }}>
                  {/* <Form.Item label="CRM ID" name="crmid" style={{ display: "none" }}> */}
                  <Input disabled />
                  {/* </Form.Item> */}
                </Form.Item>
              </Col>
            </Row>
            <Row justify="end" style={{ marginTop: 25 }} gutter={16}>
              <Col>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="form-button"
                  // size="large"
                  style={{
                    background: colors.blueAccent[1000],
                    color: "#fff",
                    // fontWeight:"600",
                    // fontSize:"12px",
                    borderRadius: 8,
                  }}
                >
                  Create
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      )}
      {showSuccess && (
        <SuccessScreen background={colors.blueAccent[1000]} onNext={() => navigate(`/cmdetails/${createdCmId}`)} />
      )}
    </>
  );
};

export default CmForm;
