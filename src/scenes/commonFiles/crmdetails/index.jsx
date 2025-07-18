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
  Collapse,
  Spin,
  Space
} from "antd";
import { CameraOutlined } from "@ant-design/icons";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Country, State } from "country-state-city";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";
import { getCreaterRole, getCreaterId } from "../../../config";
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

const CrmDetails = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [cropModalVisible, setCropModalVisible] = useState(false);
  const [originalImage, setOriginalImage] = useState(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);
  const location = useLocation();
  const Navigate = useNavigate();
  const [organizationNames, setOrganizationNames] = useState([]);
  const [branchNames, setBranchNames] = useState([]);
  const [cmNames, setCmNames] = useState([]);
  const [relationsData, setRelationsData] = useState([]);
  const [editingRelationId, setEditingRelationId] = useState(null);
  const [relationEdits, setRelationEdits] = useState({});
  const [assignForm, setAssingForm] = useState(false);
  const [crmDetails, setcrmDetails] = useState(null);

  const [form] = Form.useForm();
  const { createdCrmId } = useParams();

  // Defensive: ticket may be undefined after refresh, so fallback to param
  const ticket = useMemo(() => location.state?.ticket || {}, [location.state]);
  const crmid = ticket.crmid || createdCrmId || "";

  // Fetch CRM details
  useEffect(() => {
    const fetchCrmData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/v1/crmDetailsGet/${crmid}`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        if (data && Array.isArray(data.data) && data.data.length > 0) {
          setcrmDetails(data.data[0]);
        } else {
          setcrmDetails({});
        }
      } catch (error) {
        console.error("Error fetching CRM Details:", error);
        setcrmDetails({});
        message.error(
          "Failed to load CRM details. Please try again later."
        );
      }
    };
    if (crmid) fetchCrmData();
  }, [crmid]);

  // Build initial values for the form
  const buildInitialValues = (data = {}) => ({
    crmid: data.crmid || "",
    firstName: data.firstname || "",
    lastName: data.lastname || "",
    phoneCode: data.phonecode || "",
    PhoneNo: data.mobile || "",
    gender: data.extraind2 || "",
    email: data.email || "",
    status: data.extraind7 || "",
    country: data.extraind3 || "",
    state: data.state || "",
    city: data.city || "",
    street: data.street || "",
    passwords: data.passwords || "",
    postalcode: data.postalcode || "",
    organization0: data.organization || "",
    customerManager0: data.customermanager || "",
    imageUrl: data.imageUrl || "",
  });

  // Fetch relations
  useEffect(() => {
    const fetchRelations = async () => {
      if (!crmid) return;
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/v1/getRelationsDataByCrmid/${crmid}`
        );
        const data = await response.json();
        if (response.ok && Array.isArray(data.data)) {
          setRelationsData(data.data);
        }
      } catch (error) {
        // handle error
      }
    };
    fetchRelations();
  }, [crmid]);

  const orgGroups = useMemo(() => {
    // Defensive: relationsData may be empty
    return relationsData.reduce((acc, item) => {
      if (!acc[item.organizationid]) acc[item.organizationid] = [];
      acc[item.organizationid].push(item);
      return acc;
    }, {});
  }, [relationsData]);

  // Relation delete
  const RelationDelete = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/v1/RelationDelete/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setRelationsData((prev) => prev.filter((item) => item.id !== id));
        setIsEditing(false);
        message.success("Relation deleted successfully");
      } else {
        const errorData = await response.json();
        message.error(
          `Failed to delete relation: ${errorData?.error || "Unknown error"}`
        );
      }
    } catch (error) {
      message.error("Error deleting relation");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (crmDetails?.country) {
      const country = Country.getAllCountries().find(
        (c) => c.name === crmDetails.country
      );
      setSelectedCountry(country || null);
    }
    if (crmDetails?.state && selectedCountry) {
      const state = State.getStatesOfCountry(selectedCountry.isoCode).find(
        (s) => s.name === crmDetails.state
      );
      setSelectedState(state || null);
    }
  }, [crmDetails, selectedCountry]);

  const handleFormSubmit = async (values) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("crmid", values.crmid);
    formData.append("firstname", values.firstName);
    formData.append("lastname", values.lastName);
    formData.append("email", values.email);
    formData.append("phoneCode", values.phoneCode);
    formData.append("PhoneNo", values.PhoneNo);
    formData.append("gender", values.gender);
    formData.append("status", values.status);
    formData.append("passwords", values.passwords || "");
    const createrrole = getCreaterRole();
    const createrid = getCreaterId() || "";
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
      formData.append("crmProfileByAdminAndHob", file, "profile.jpg");
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/v1/UpdatecrmProfileByAdminAndHob`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      if (response.ok) {
        setIsLoading(false);
        message.success(
          "Customer Relationship Manager details updated successfully"
        );
        setIsEditing(false);
      } else {
        alert("Update failed: " + (data?.error || response.statusText));
      }
    } catch (error) {
      setIsLoading(false);
      message.error("Error Updating form");
    }
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/v1/getAllOrganizationnames`
        );
        const data = await response.json();
        if (response.ok && Array.isArray(data.data)) {
          setOrganizationNames(
            data.data.map((item) => item.organizationname || "N/A")
          );
        }
      } catch (error) { }
    };
    fetchTickets();
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
    } catch (error) { }
  };

  const fetchCmNames = async (orgName, branch) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/v1/GetCmNames`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orgName, branch }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.data)) {
          setCmNames(data.data);
        } else {
          setCmNames([]);
        }
      }
    } catch (error) {
      setCmNames([]);
    }
  };

  const handleAssign = async (values) => {
    try {
      setIsLoading(true);
      const payload = {
        organization: values.organization,
        branch: values.branch,
        cmid: values.cmid,
        cmname: values.cmname,
        crmid: crmid,
        crmname: crmDetails ? `${crmDetails.firstname} ${crmDetails.lastname}` : "",
        createrid: getCreaterId() || "",
        createrrole: getCreaterRole() || "",
      };
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await fetch(`${process.env.REACT_APP_API_URL}/v1/createRelation`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        message.success("Assigned successfully!");
        setIsLoading(false);
        // refetch relations
        const relRes = await fetch(
          `${process.env.REACT_APP_API_URL}/v1/getRelationsDataByCrmid/${crmid}`
        );
        const relData = await relRes.json();
        if (relRes.ok && Array.isArray(relData.data)) {
          setRelationsData(relData.data);
        }
        setAssingForm(false);
        form.resetFields(["organization", "branch", "cmname"]);
      } else {
        message.error(data?.error || "Assignment failed");
      }
    } catch (error) {
      message.error("Assignment failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const countries = Country.getAllCountries();
  const gender = ["Male", "Female"];
  const status = ["Suspend", "Active"];

  // Restore original image upload/crop handlers
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

  if (crmDetails === null) {
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
        style={{ background: "#fff", borderRadius: 8, padding: 24, margin: 16 }}
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
          enableReinitialize
          initialValues={buildInitialValues(crmDetails)}
          onFinish={handleFormSubmit}
        >
          {/* Profile Image Section */}
          <Row justify="center" style={{ marginBottom: 24 }}>
            <Col>
              <div style={{ position: "relative", display: "inline-block" }}>
                <Avatar
                  src={profileImage || crmDetails?.imageUrl || "https://via.placeholder.com/150"}
                  size={120}
                  style={{
                    border: "2px solid #1677ff",
                    cursor: isEditing ? "pointer" : "default",
                    opacity: isEditing ? 1 : 0.8,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                  onClick={isEditing ? triggerFileInput : undefined}
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
                  onClick={isEditing ? triggerFileInput : undefined}
                  disabled={!isEditing}
                  tabIndex={isEditing ? 0 : -1}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  style={{ display: "none" }}
                  disabled={!isEditing}
                  tabIndex={isEditing ? 0 : -1}
                />
              </div>
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
            </Col>
          </Row>
          {/* Main Form Fields */}
          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item
                label={<Text strong>ID</Text>}
                name="crmid"
                rules={[{ required: true, message: "Crm id is required" }]}
              >
                <Input placeholder="CRM Id" disabled={true} size="large" />
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
                      style={{ width: "calc(100% - 40%)" }}
                      placeholder="Code"
                      optionFilterProp="children"
                      disabled={true}
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
                      style={{ width: "calc(100% - 60%)" }}
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
          </Row>
          {/* Organization/Manager Pairs */}
          <Typography.Title level={5} style={{ margin: "16px 0 8px 0" }}>
            Customer Managers
          </Typography.Title>
          <Col span={24}>
            <Collapse style={{ marginTop: 24 }}>
              {Object.entries(orgGroups).map(([orgId, items]) => (
                <Collapse.Panel
                  header={
                    <span>
                      <b>{items[0].organizationname}</b> ({orgId})
                    </span>
                  }
                  key={orgId}
                >
                  {items.map((item, idx) => {
                    const isEditingRow = editingRelationId === item.id;
                    const editData = isEditingRow ? relationEdits : item;
                    return (
                      <Row
                        gutter={16}
                        key={item.id || idx}
                        style={{ marginBottom: 12, alignItems: "center" }}
                      >
                        <Col xs={24} md={8}>
                          <Form.Item
                            label={<Text strong>Organization</Text>}
                            style={{ marginBottom: 0 }}
                          >
                            <Input
                              value={editData.organizationname}
                              disabled={!isEditingRow}
                              onChange={(e) =>
                                setRelationEdits((prev) => ({
                                  ...prev,
                                  organizationname: e.target.value,
                                }))
                              }
                              size="large"
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                          <Form.Item
                            label={<Text strong>Branch</Text>}
                            style={{ marginBottom: 0 }}
                          >
                            <Input
                              value={editData.branch}
                              disabled={!isEditingRow}
                              onChange={(e) =>
                                setRelationEdits((prev) => ({
                                  ...prev,
                                  branch: e.target.value,
                                }))
                              }
                              size="large"
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                          <Form.Item
                            label={<Text strong>Customer Manager</Text>}
                            style={{ marginBottom: 0 }}
                          >
                            <Input
                              value={editData.cmname}
                              disabled={!isEditingRow}
                              onChange={(e) =>
                                setRelationEdits((prev) => ({
                                  ...prev,
                                  cmname: e.target.value,
                                }))
                              }
                              size="large"
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={24} style={{ marginTop: 8 }}>
                          {isEditingRow && !editingRelationId ? (
                            <>
                              <Button
                                type="primary"
                                size="small"
                                style={{
                                  backgroundColor: "#3e4396",
                                  color: "#fff",
                                  fontWeight: "bold",
                                  marginRight: 8,
                                  padding: "10px",
                                }}
                                onClick={() => {
                                  const updated = relationsData.map((r) =>
                                    r.id === item.id
                                      ? { ...r, ...relationEdits }
                                      : r
                                  );
                                  setRelationsData(updated);
                                  setEditingRelationId(null);
                                  setRelationEdits({});
                                }}
                              >
                                Save
                              </Button>
                              <Button
                                size="small"
                                style={{ marginRight: 8 }}
                                onClick={() => {
                                  setEditingRelationId(null);
                                  setRelationEdits({});
                                }}
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="small"
                                danger
                                onClick={() => {
                                  RelationDelete(item.id);
                                  setEditingRelationId(null);
                                  setRelationEdits({});
                                }}
                              >
                                Delete
                              </Button>
                            </>
                          )}
                        </Col>
                      </Row>
                    );
                  })}
                </Collapse.Panel>
              ))}
            </Collapse>
          </Col>
        </Form>
        {assignForm && (
          <Form layout="vertical" form={form} onFinish={handleAssign}>
            <Row gutter={16} style={{ marginTop: 24, alignItems: "center" }}>
              <Col xs={24} md={8}>
                <Form.Item
                  label={<Text strong>Organization</Text>}
                  name="organization"
                  rules={[{ required: true, message: "Organization is required" }]}
                >
                  <Select
                    showSearch
                    placeholder="Select Organization"
                    size="large"
                    style={{ borderRadius: 8, background: "#fff", fontSize: 16 }}
                    onChange={async (value) => {
                      form.setFieldsValue({ organization: value, branch: "" });
                      await fetchBranch(value);
                    }}
                  >
                    {organizationNames.map((org) => (
                      <Select.Option key={org} value={org}>
                        {org}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label={<Text strong>Organization Unit</Text>}
                  name="branch"
                  rules={[{ required: true, message: " Organization Unit is required" }]}
                >
                  <Select
                    showSearch
                    placeholder="Select Organization Unit"
                    size="large"
                    style={{ borderRadius: 8, background: "#fff", fontSize: 16 }}
                    onChange={async (value) => {
                      form.setFieldsValue({ branch: value, cmname: "" });
                      await fetchCmNames(form.getFieldValue("organization"), value);
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
                  label="CM Name"
                  name="cmname"
                  rules={[{ required: true, message: "CM Name is required" }]}
                >
                  <Select
                    showSearch
                    placeholder="Select CM Name"
                    optionFilterProp="children"
                    size="large"
                    onChange={(value) => {
                      const selected = cmNames.find(cm => cm.cmid === value);
                      form.setFieldsValue({
                        cmname: selected ? selected.name : "",
                        cmid: value
                      });
                    }}
                  >
                    {cmNames
                      .filter(cm => cm && cm.cmid && cm.name)
                      .map((cm) => (
                        <Select.Option key={cm.cmid} value={cm.cmid}>
                          {cm.name}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
                <Form.Item label="CM ID" name="cmid" style={{ display: 'none' }}>
                  <Input disabled />
                </Form.Item>
              </Col>
              <Row gutter={16} style={{ display: "flex", justifyContent: "flex-end" }}>
                <Col>
                  <Space>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      style={{ background: colors.blueAccent[1000] }}
                    >
                      Assign
                    </Button>
                    <Button size="large" danger onClick={() => setAssingForm(false)}>
                      Cancel
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Row>
          </Form>
        )}
        {!assignForm && (
          <Button
            type="primary"
            onClick={() => {
              setAssingForm(true);
            }}
            style={{
              marginTop: 16,
              background: colors.blueAccent[1000],
              color: "#fff",
              fontWeight: "600",
            }}
          >
            Add Customer Manager
          </Button>
        )}
        <Row justify="end" style={{ marginTop: 32 }} gutter={16}>
          {!isEditing ? (
            <Row style={{ width: "100%", justifyContent: "space-between" }} gutter={16}>
              <Col>
                {(getCreaterRole() === "admin" || getCreaterRole() === "hob") && (
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
                        title: "Are you sure you want to delete this Relationship Manager?",
                        content: "This action cannot be undone.",
                        okText: "Yes, Delete",
                        okType: "danger",
                        cancelText: "Cancel",
                        onOk: async () => {
                          try {
                            await fetch(
                              `${process.env.REACT_APP_API_URL}/v1/deleteCrmByAdminAndHob`,
                              {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  crmid: crmid,
                                }),
                              }
                            );
                            message.success("Relationship Manager deleted successfully!");
                            Navigate("/crm");
                          } catch (error) {
                            message.error("Failed to delete Crm.");
                          }
                        },
                      });
                    }}
                  >
                    Delete
                  </Button>
                )}
              </Col>
              <Col style={{ display: assignForm ? 'none' : 'block' }}>
                <Button
                  type="primary"
                  style={{
                    background: colors.blueAccent[1000],
                    color: "#fff",
                    fontWeight: "600",
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
            <Row>
              <Col style={{ display: assignForm ? 'none' : 'block' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  fontWeight="600"
                  style={{
                    background: colors.blueAccent[1000],
                  }}
                  onClick={() => form.submit()}
                >
                  Save
                </Button>
              </Col>
              <Col style={{ display: assignForm ? 'none' : 'block' }}>
                <Button size="large" danger onClick={handleCancel}>
                  Cancel
                </Button>
              </Col>
            </Row>
          )}
        </Row>
      </div>
    </>
  );
};

export default CrmDetails;