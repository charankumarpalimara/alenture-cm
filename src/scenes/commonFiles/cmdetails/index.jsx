import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  Avatar,
  Modal,
  Typography,
  message,
  Spin,
} from "antd";
import {
  Button as MuiButton,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { CameraOutlined } from "@ant-design/icons";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Country } from "country-state-city";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getCreaterRole, getCreaterId } from "../../../config";
import { tokens } from "../../../theme";
import { useTheme, useMediaQuery } from "@mui/material";
import { CloseOutlined } from "@ant-design/icons";
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

const CmDetails = () => {
  const theme = useTheme();
  const { createdCmId } = useParams();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery("(max-width: 400px)");
  const isTablet = useMediaQuery("(max-width: 700px)");
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cropModalVisible, setCropModalVisible] = useState(false);
  const [originalImage, setOriginalImage] = useState(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [cmDetails, setcmDetails] = useState(null);
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [organizationNames, setOrganizationNames] = useState([]);
  const [branchNames, setBranchNames] = useState([]);
  const [crmNameList, setCrmNameList] = useState([]);
  const [functionList, setFunctionList] = useState([]);
  const [interestList, setInterestList] = useState([]);
  const [interestSearch, setInterestSearch] = useState("");
  // Fetch interests list for editing
  useEffect(() => {
    const fetchInterest = async () => {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/v1/GetCmInterest`);
      const data = await res.json();
      setInterestList(data.data || data.interests || []);
    };
    fetchInterest();
  }, []);

  // Defensive: ticket may be undefined after refresh, so fallback to param
  const ticket = useMemo(() => location.state?.ticket || {}, [location.state]);
  const cmid = ticket.id || createdCmId || "";

  // Fetch CM details from backend using URL param or ticket
  useEffect(() => {
    const fetchCmDataData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/v1/cmDetailsGet/${cmid}`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        if (data && Array.isArray(data.data) && data.data.length > 0) {
          setcmDetails(data.data[0]);
        } else {
          setcmDetails({});
        }
      } catch (error) {
        console.error("Error fetching Customer Manager Details:", error);
        setcmDetails({});
        message.error(
          "Failed to load Customer Manager details. Please try again later."
        );
      }
    };
    if (cmid) fetchCmDataData();
  }, [cmid]);

  const buildInitialValues = (data = {}) => ({
    id: data.cmid || "",
    firstName: data.firstname || "",
    lastName: data.lastname || "",
    email: data.email || "",
    PhoneNo: data.mobile || "",
    phoneCode: data.phonecode || "",
    crmid: data.crmid || "",
    crmname: data.crmname || "",
    customerManager: data.customerManager || "",
    organization: data.organization || "",
    gender: data.extraind2 || "",
    status: data.extraind3 || "",
    organizationid: data.organizationid || "",
    organizationname: data.organizationname || "",
    function: data.extraind4 || "",
    interests: data.extraind5 ? (Array.isArray(data.extraind5) ? data.extraind5 : (typeof data.extraind5 === "string" ? data.extraind5.split(",").map(i => i.trim()).filter(Boolean) : [])) : [],
    // customerrelationshipmanagername: data.customerrelationshipmanagername || "",
    branch: data.branch || "",
    imageUrl: data.imageUrl || "",
  });

  useEffect(() => {
    if (cmDetails && cmDetails.organizationname) {
      fetchBranch(cmDetails.organizationname);
    }
    // eslint-disable-next-line
  }, [cmDetails?.organizationname]);

  const [form] = Form.useForm();

  useEffect(() => {
    const fetchOrganizationNames = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/v1/getAllOrganizationnames`
        );
        const data = await res.json();
        setOrganizationNames(data.data || []);
      } catch {
        setOrganizationNames([]);
      }
    };
    fetchOrganizationNames();
  }, []);

  useEffect(() => {
    const fetchCrmNames = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/v1/GetCrmNames`
        );
        const data = await res.json();
        setCrmNameList(data.data || []);
      } catch {
        setCrmNameList([]);
      }
    };
    fetchCrmNames();
  }, []);

  const fetchBranch = async (orgName) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/v1/getBranchbyOrganizationname/${orgName}`
      );
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.branchDetails)) {
          setBranchNames(data.branchDetails);
        } else if (typeof data.branchDetails === "string") {
          setBranchNames([data.branchDetails]);
        } else {
          setBranchNames([]);
        }
      }
    } catch (error) {
      setBranchNames([]);
    }
  };

  useEffect(() => {
    const fetchFunctions = async () => {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/v1/GetCmFunction`);
      const data = await res.json();
      setFunctionList(data.functions || data.data || []);
    };
    fetchFunctions();
  }, []);




  const handleFormSubmit = async (values) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("cmid", values.id);
    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);
    formData.append("email", values.email);
    formData.append("phoneCode", values.phoneCode);
    formData.append("PhoneNo", values.PhoneNo);
    formData.append("crmid", values.crmid);
    formData.append("functionValue", values.function);
    // formData.append("interests", values.interests);
    formData.append(
      "crmname",
      values.crmname || values.customerrelationshipmanagername
    );
    formData.append("organizationid", cmDetails.organizationid || "");
    formData.append(
      "organizationname",
      values.organization || values.organizationname
    );
    formData.append("branch", values.branch);
    formData.append("gender", values.gender);
    formData.append("status", values.status);
    const createrrole = getCreaterRole();
    const createrid = getCreaterId();
    formData.append("createrrole", createrrole);
    formData.append("createrid", createrid);
formData.append("interests", Array.isArray(values.interests) ? values.interests.join(",") : (values.interests || ""));

    // Add profile image if present
    if (profileImage) {
      const arr = profileImage.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const file = new Blob([u8arr], { type: mime });
      formData.append("cmProfileImageByAdminHob", file, "profile.jpg");
    }
    try {
      const response = await fetch(
        `http://127.0.0.1:8080/v1/updateCmProfileByAdminHob`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      if (response.ok) {
        message.success("Customer Manager details updated successfully");
        setIsLoading(false);
        setIsEditing(false);
        // navigate("/cm");
      } else {
        message.error("Update failed: " + (data?.error || response.statusText));
        setIsEditing(false);
      }
    } catch (error) {
      message.error("Error submitting form");
      setIsEditing(false);
    }
    setIsLoading(false);
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

  const triggerFileInput = () => {
    if (!isEditing) return;
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
    setCropModalVisible(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const countries = Country.getAllCountries();
  const gender = ["Male", "Female"];
  const status = ["Suspend", "Active"];

  if (cmDetails === null) {
    return (
      <div
        style={{
          minHeight: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
          padding: isMobile ? 15 : 24,
          margin: 16,
          boxShadow: "2px 2px 8px rgba(0,0,0,0.08)",
        }}
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
            Customer Manager
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
          enableReinitialize
          initialValues={buildInitialValues(cmDetails)}
          onFinish={handleFormSubmit}
        >
          {/* Profile Image Section */}
          <Row justify="center" style={{ marginBottom: 24 }}>
            <Col>
              <div style={{ position: "relative", display: "inline-block" }}>
                <Avatar
                  src={
                    profileImage ||
                    cmDetails?.imageUrl ||
                    "https://via.placeholder.com/150"
                  }
                  size={120}
                  style={{
                    border: "2px solid #1677ff",
                    cursor: isEditing ? "pointer" : "default",
                    opacity: isEditing ? 1 : 0.8,
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
                    opacity: isEditing ? 1 : 0.7,
                  }}
                  onClick={triggerFileInput}
                  disabled={!isEditing}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  style={{ display: "none" }}
                  disabled={!isEditing}
                />
              </div>
            </Col>
          </Row>
          <Modal
            open={cropModalVisible}
            title="Crop Profile Picture"
            onCancel={() => setCropModalVisible(false)}
            onOk={handleSaveCroppedImage}
            okText="Save Photo"
            cancelText="Cancel"
            width={400}
            bodyStyle={{ height: 350 }}
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
          {/* Main Form Fields */}
          <Row gutter={24}>
            <Col xs={24} md={8}>
              {/* Interests Field */}

              <Form.Item
                label={<Text className="custom-headding-12px">ID</Text>}
                name="id"
                rules={[{ required: true, message: "Id is required" }]}
              >
                <Input placeholder="ID" disabled={true} size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={<Text className="custom-headding-12px">First Name</Text>}
                name="firstName"
                rules={[{ required: true, message: "First name is required" }]}
              >
                <Input
                  placeholder="First Name"
                  disabled={!isEditing}
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={<Text className="custom-headding-12px">Last Name</Text>}
                name="lastName"
                rules={[{ required: true, message: "Last name is required" }]}
              >
                <Input
                  placeholder="Last Name"
                  disabled={!isEditing}
                  size="large"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label={<Text className="custom-headding-12px">Email Id</Text>}
                name="email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Valid email is required",
                  },
                ]}
              >
                <Input placeholder="Email" disabled={!isEditing} size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label={<Text className="custom-headding-12px">Phone Number</Text>} required>
                <Input.Group compact>
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
                      {countries.map((c) => (
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
                </Input.Group>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={<Text className="custom-headding-12px">Gender</Text>}
                name="gender"
                rules={[{ required: true, message: "Gender is required" }]}
              >
                <Select
                  placeholder="Select Gender"
                  disabled={!isEditing}
                  size="large"
                >
                  {gender.map((g) => (
                    <Select.Option key={g} value={g}>
                      {g}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={<Text className="custom-headding-12px">Function</Text>}
                name="function"
                rules={[
                  {
                    required: true,
                    type: "text",
                    message: "Valid function is required",
                  },
                ]}
              >
                <Select
                  placeholder="Select Function"
                  disabled={!isEditing}
                  size="large"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {functionList.map((fn, idx) => (
                    <Select.Option key={fn.id || idx} value={fn.name || fn.function || fn}>
                      {fn.name || fn.function || fn}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={<Text className="custom-headding-12px">Organization</Text>}
                name="organizationname"
                rules={[
                  { required: true, message: "Organization is required" },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Select Organization"
                  disabled={!isEditing}
                  size="large"
                  style={{ borderRadius: 8, background: "#fff", fontSize: 16 }}
                  onChange={(value, option) => {
                    form.setFieldsValue({
                      organizationname: option.children,
                      organizationid: value,
                    });
                    fetchBranch(option.children);
                  }}
                  optionFilterProp="children"
                  filterOption={(input, option) => {
                    const searchTerm = input.toLowerCase().trim();
                    const optionText = option.children.toLowerCase();
                    return optionText.includes(searchTerm);
                  }}
                >
                  {organizationNames.map((org) => (
                    <Select.Option
                      key={org.organizationid}
                      value={org.organizationid}
                    >
                      {org.organizationname}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="organizationid" style={{ display: "none" }}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={<Text className="custom-headding-12px">Organization Unit</Text>}
                name="branch"
                rules={[
                  { required: true, message: "Organization Unit is required" },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Select Organization Unit"
                  disabled={!isEditing}
                  size="large"
                  style={{ borderRadius: 8, background: "#fff", fontSize: 16 }}
                  optionFilterProp="children"
                  filterOption={(input, option) => {
                    const searchTerm = input.toLowerCase().trim();
                    const optionText = option.children.toLowerCase();
                    return optionText.includes(searchTerm);
                  }}
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
                label={<Text className="custom-headding-12px">Status</Text>}
                name="status"
                rules={[{ required: true, message: "Status is required" }]}
              >
                <Select
                  placeholder="Select Status"
                  disabled={!isEditing}
                  size="large"
                >
                  {status.map((s) => (
                    <Select.Option key={s} value={s}>
                      {s}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8} style={{ display: getCreaterRole() === "crm" ? "none" : "block" }}>
              <Form.Item
                label={<Text className="custom-headding-12px">Relationship Manager</Text>}
                name="crmname"
                rules={[{ required: true, message: "Relationship Manager is required" }]}
              >
                <Select
                  showSearch
                  placeholder="Select Relationship Manager"
                  optionFilterProp="children"
                  disabled={!isEditing}
                  size="large"
                  onChange={(value) => {
                    const selected = crmNameList.find(
                      (crm) => crm.crmid === value
                    );
                    form.setFieldsValue({
                      crmname: selected ? selected.name : "",
                      crmid: value,
                    });
                  }}
                >
                  {crmNameList.map((crm) => (
                    <Select.Option key={crm.crmid} value={crm.crmid}>
                      {crm.name} ({crm.crmid})
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="CRM ID"
                name="crmid"
                style={{ display: "none" }}
              >
                <Input disabled />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label={<Text className="custom-headding-12px">Interests</Text>}
                name="interests"
                className="custom-placeholder-12px"
                rules={[{ required: true, type: 'array', message: "Interests are required" }]}
              >
                <Select
                  mode="tags"
                  allowClear
                  showSearch
                  placeholder="Select Interests"
                  className="interests-select"
                  size="large"
                  style={{ borderRadius: 8, background: "#fff" }}
                  optionFilterProp="children"
                  onSearch={setInterestSearch}
                  filterOption={false}
                  disabled={!isEditing}
                  dropdownRender={menu => {
                    const search = interestSearch.trim();
                    const lowerList = interestList.map(i => i.toLowerCase());
                    const alreadySelected = (form.getFieldValue("interests") || []).map(i => i.toLowerCase());
                    return menu;
                  }}
                >
                  {/* Show all interests except those already selected */}
                  {(() => {
                    const selected = form.getFieldValue("interests") || [];
                    return interestList
                      .filter(interest => !selected.includes(interest))
                      .map((interest, idx) => (
                        <Select.Option key={interest} value={interest}>{interest}</Select.Option>
                      ));
                  })()}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Row justify="end" style={{ marginTop: 32 }} gutter={16}>
          {!isEditing ? (
            <Row
              style={{ width: "100%", justifyContent: "space-between" }}
              gutter={16}
            >
              <Col>
                {getCreaterRole() === "admin" && (
                  <MuiButton
                    variant="outlined"
                    className="form-button"
                    // size="large"
                    color="error"
                    startIcon={<DeleteIcon />}
                    style={{
                      // padding: "12px 24px",
                      borderRadius: "8px",
                      boxShadow: "3px 3px 6px rgba(0, 0, 0, 0.2)",
                      transition: "0.3s",
                      // background: colors.redAccent[400],
                      // color: "#ffffff",
                      textTransform: "none",
                    }}
                    onClick={() => {
                      Modal.confirm({
                        title:
                          "Are you sure you want to delete this Customer Manager?",
                        content: "This action cannot be undone.",
                        okText: "Yes, Delete",
                        okType: "danger",
                        cancelText: "Cancel",
                        onOk: async () => {
                          try {
                            await fetch(
                              `${process.env.REACT_APP_API_URL}/v1/deleteCmByAdminAndHob`,
                              {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  cmid: cmid,
                                }),
                              }
                            );
                            message.success("Cm deleted successfully!");
                            navigate("/cm");
                          } catch (error) {
                            message.error("Failed to delete Cm.");
                          }
                        },
                      });
                    }}
                  >
                    Delete
                  </MuiButton>
                )}
              </Col>
              <Col>
                <MuiButton
                  variant="contained"
                  className="form-button"
                  startIcon={<EditIcon />}
                  style={{
                    background: colors.blueAccent[1000],
                    color: "#fff",
                    borderRadius: 8,
                  }}
                  // size="large"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </MuiButton>
              </Col>
            </Row>
          ) : (
            <>
              <Col>
                <MuiButton
                  variant="contained"
                  className="form-button"
                  style={{
                    background: colors.blueAccent[1000],
                    color: "#fff",
                    borderRadius: 8,
                  }}
                  onClick={() => form.submit()}
                  type="submit"
                >
                  Save
                </MuiButton>
              </Col>
              <Col>
                <MuiButton variant="outlined" color="error" className="form-button" onClick={handleCancel}>
                  Cancel
                </MuiButton>
              </Col>
            </>
          )}
        </Row>
      </div>
    </>
  );
};

export default CmDetails;