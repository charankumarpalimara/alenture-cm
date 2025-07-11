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
import { CameraOutlined } from "@ant-design/icons";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Country } from "country-state-city";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getCreaterRole, getCreaterId } from "../../../config";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";

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
  const Navigate = useNavigate();
  const [organizationNames, setOrganizationNames] = useState([]);
  const [branchNames, setBranchNames] = useState([]);
  const [crmNameList, setCrmNameList] = useState([]);

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
    id: data.id || "",
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
        `${process.env.REACT_APP_API_URL}/v1/updateCmProfileByAdminHob`,
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
        Navigate("/cm");
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
          padding: 24,
          margin: 16,
          boxShadow: "2px 2px 8px rgba(0,0,0,0.08)",
        }}
      >
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
              <Form.Item
                label={<Text strong>ID</Text>}
                name="id"
                rules={[{ required: true, message: "Id is required" }]}
              >
                <Input placeholder="ID" disabled={true} size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={<Text strong>First Name</Text>}
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
                label={<Text strong>Last Name</Text>}
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
                label={<Text strong>Organization</Text>}
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
                label={<Text strong>Organization Unit</Text>}
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
                label={<Text strong>Email Id</Text>}
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
              <Form.Item label={<Text strong>Phone Number</Text>} required>
                <Input.Group compact>
                  <Form.Item
                    name="phoneCode"
                    noStyle
                    rules={[{ required: true, message: "Code" }]}
                  >
                    <Select
                      showSearch
                      style={{ width: 160 }}
                      placeholder="Code"
                      optionFilterProp="children"
                      disabled={!isEditing}
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
                    rules={[
                      { required: true, message: "Phone number is required" },
                      { pattern: /^[0-9]+$/, message: "Only numbers allowed" },
                      { min: 10, message: "At least 10 digits" },
                    ]}
                  >
                    <Input
                      style={{ width: "calc(100% - 160px)" }}
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
                label={<Text strong>Gender</Text>}
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
                label={<Text strong>Status</Text>}
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
            <Col xs={24} md={8}>
              <Form.Item
                label="CRM Name"
                name="crmname"
                rules={[{ required: true, message: "CRM Name is required" }]}
              >
                <Select
                  showSearch
                  placeholder="Select CRM Name"
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
                  <Button
                    variant="contained"
                    size="large"
                    danger
                    style={{
                      padding: "12px 24px",
                      fontSize: "14px",
                      fontWeight: "bold",
                      borderRadius: "8px",
                      boxShadow: "3px 3px 6px rgba(0, 0, 0, 0.2)",
                      transition: "0.3s",
                      backgroundColor: "#af3f3b",
                      color: "#ffffff",
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
                            Navigate("/cm");
                          } catch (error) {
                            message.error("Failed to delete Cm.");
                          }
                        },
                      });
                    }}
                  >
                    Delete
                  </Button>
                )}
              </Col>
              <Col>
                <Button
                  type="primary"
                  style={{
                    background: colors.blueAccent[1000],
                    color: "#fff",
                    fontWeight: "bold",
                    borderRadius: 8,
                  }}
                  size="large"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              </Col>
            </Row>
          ) : (
            <>
              <Col>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  style={{
                    background: colors.blueAccent[1000],
                    color: "#fff",
                    fontWeight: "bold",
                    borderRadius: 8,
                  }}
                  onClick={() => form.submit()}
                >
                  Save
                </Button>
              </Col>
              <Col>
                <Button size="large" danger onClick={handleCancel}>
                  Cancel
                </Button>
              </Col>
            </>
          )}
        </Row>
      </div>
    </>
  );
};

export default CmDetails;