import { Box, useMediaQuery } from "@mui/material";
import {
  Input,
  Button,
  Row,
  Col,
  Select,
  Typography,
  message,
  Avatar,
  Collapse,
  Spin,
  Modal,
  Form,
  Result
} from "antd";
import { CheckCircleTwoTone } from "@ant-design/icons";
import { CameraOutlined } from "@ant-design/icons";
import ReactCrop from "react-image-crop";
import { Country, State, City } from "country-state-city";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { getCreaterRole, getCreaterId } from "../../../config";

// import ReactCrop from "react-image-crop";
// import { heIL } from "@mui/x-data-grid";
// import { Height } from "@mui/icons-material";

// const { Typography } = Typography;

const { Option } = Select;
const { Panel } = Collapse;

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
          Your account has been created successfully.
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


const OrganizationUnitadd = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [form] = Form.useForm();
  const [cmForm] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);
  const [branchesData, setBranchesData] = useState([]);
  const [editingBranchIndex, setEditingBranchIndex] = useState(null); // <--- NEW
  const [branchEdits, setBranchEdits] = useState({}); // <--- NEW
  const Navigate = useNavigate();
  const location = useLocation();
  const countries = Country.getAllCountries();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [unitAddForm, setUnitAddForm] = useState(false)
  const [cmform, setCmform] = useState(false);
  const [crmNameList, setCrmNameList] = useState([]);
  const [organizationNames, setOrganizationNames] = useState([]);
  const [branchNames, setBranchNames] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  // const countries = Country.getAllCountries();
  const isMobile = useMediaQuery("(max-width:400px)");

  // Get initial data from navigation (organization.jsx sends via state)
  const organizationid = location.state?.orgid;
  const organizationname = location.state?.organizationname;
  console.log("location.state:", location.state);
  console.log("organizationid:", organizationid);
  const firstBranch = branchesData[0] || {};








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


  // Fetch all branches for this organization (full objects)
  // useEffect(() => {
  const fetchGetAllData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/v1/getOrganizationBranchesByOrgid/${organizationid}`
      );
      const data = await response.json();
      if (response.ok && Array.isArray(data.rows)) {
        setBranchesData(data.rows); // full branch objects
        console.log("Fetched branches:", data.rows);
      } else {
        setBranchesData([]);
      }
    } catch (error) {
      setBranchesData([]);
      console.error("Error fetching tickets:", error);
    }
  };

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/v1/getAllOrganizationnames`
          // "http://127.0.0.1:8080/v1/getAllOrganizationnames",
        );
        const data = await response.json();
        if (response.ok && Array.isArray(data.data)) {
          // setModalOrganizationNames(data.data.map((item) => item.organizationname || "N/A"));
          setOrganizationNames(
            data.data.map((item) => item.organizationname || "N/A")
          );
        }
      } catch (error) { }
    };
    fetchOrganizations();
  }, []);


  const fetchBranch = async (orgName) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/v1/getBranchbyOrganizationname/${organizationname}`
      );
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.branchDetails)) {
          setBranchNames(data.branchDetails);
          // setModalBranchNames(data.branchDetails);
        }

        else if (typeof data.branchDetails === "string") {
          setBranchNames([data.branchDetails]);
          // setModalBranchNames([data.branchDetails]);
        }
        else {
          setBranchNames([]);
          // setModalBranchNames([]);
        }
      }
    } catch (error) { }
  };

  useEffect(() => {
    fetchBranch()
  }, [organizationname]);

  useEffect(() => {
    const fetchCrmNames = async () => {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/v1/GetCrmNames`);
      const data = await res.json();
      setCrmNameList(data.data || []);
    };
    fetchCrmNames();
  }, []);
  //   fetchGetAllData();
  // }, [organizationid]);

  useEffect(() => {
    fetchGetAllData();
  }, [organizationid]);

  // Sync form fields with branch state
  // useEffect(() => {
  //   form.setFieldsValue(branch);
  // }, [branch, form]);

  // Sort branches: Parent first, then others
  const sortedBranches = [...branchesData].sort((a, b) => {
    if (a.branchtype === "Parent") return -1;
    if (b.branchtype === "Parent") return 1;
    return 0;
  });

  // Handle edit for a branch
  const handleBranchEdit = (idx) => {
    setEditingBranchIndex(idx);
    setBranchEdits({ ...sortedBranches[idx] });
  };

  // Handle cancel for a branch
  const handleBranchCancel = () => {
    setEditingBranchIndex(null);
    setBranchEdits({});
  };

  // Handle save for a branch
  const handleBranchSave = async (idx) => {
    setIsLoading(true);
    try {
      const payload = { ...branchEdits }; // branchEdits should include id
      await axios.post(
        `${process.env.REACT_APP_API_URL}/v1/UpdateOrganizationDetails`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      // Update local state
      const updated = [...branchesData];
      // Find the correct branch in the original array (not sorted)
      const originalIdx = branchesData.findIndex(
        (b) => b.id === branchEdits.id
      );
      if (originalIdx !== -1) updated[originalIdx] = { ...branchEdits };

      setBranchesData(updated);
      setEditingBranchIndex(null);
      setBranchEdits({});
      fetchGetAllData(); // Refresh data
      // message.success("Branch updated successfully!");
    } catch (error) {
      message.error("Error updating branch");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change for a branch
  const handleBranchInputChange = (field, value) => {
    setBranchEdits((prev) => ({ ...prev, [field]: value }));
  };
  // const handleBranchDelete = async (idx) => {
  //   const branch = sortedBranches[idx];
  //   if (!branch || !branch.id) return;
  //   setIsLoading(true);
  //   try {
  //     await axios.delete(
  //       // `${process.env.REACT_APP_API_URL}/v1/OrganizationDelete/${branch.id}`
  //       `http://127.0.0.1:8080/v1/OrganizationDelete/${branch.id}`
  //     );
  //     // Remove from local state
  //     setBranchesData((prev) => prev.filter((b) => b.id !== branch.id));
  //     message.success("Oganization Unit deleted successfully!");
  //   } catch (error) {
  //     message.error("Error deleting branch");
  //     console.error(error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleFormSubmit = async (values) => {
    // setIsLoading(true);
    const createrrole = getCreaterRole();
    const createrid = getCreaterId();
    try {
      const payload = {
        organizationid: firstBranch.organizationid || "",
        // If you have organization name from navigation state, use it, else leave blank
        organizationname: firstBranch.organizationname || "",
        branch: values.branch,
        branchtype: "Branch",
        phonecode: values.phoneCode,
        mobile: values.phoneno,
        email: values.email,
        username: (location.state?.organizationname || "").toLowerCase(),
        passwords: values.passwords || "defaultPassword123",
        country: values.country,
        state: values.province,
        district: values.city,
        address: 'null',
        postalcode: values.postcode,
        createrid,
        createrrole,
      };
      await axios.post(
        `${process.env.REACT_APP_API_URL}/v1/organizationAdding`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      message.success("Unit Registered successfully!");
      fetchGetAllData(); // Refresh branches data
      form.resetFields();
      // Navigate("/organization");
      setUnitAddForm(false);
      setCmform(true)
    } catch (error) {
      if (
        error.response &&
        error.response.status === 409 &&
        error.response.data?.error === "Branch Already Exicist"
      ) {
        message.error(`Branch "${values.branch}" already exists!`);
      } else {
        console.error("Error submitting form data:", error);
        message.error("Error submitting form data");
      }
    } finally {
      setIsLoading(false);
    }
  };







  const handleCmSubmit = async (values) => {
    // setIsLoading(true);
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
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      // Modal.success({ content: "CM Registered Successfully!" });
      // message.success("CM Registered Successfully!");
      // setIsLoading(false);
      setCmform(false); // <-- Fix here
      setUnitAddForm(false); // Close the unit add form
      setShowSuccess(true); // Show success message
      // Navigate('/')

      // const cmData = responce.data.data || {};
      // const FinalCmid = responce.data.cmid || cmData.cmid;

      // message.success("CM Registered Successfully!");

      // setEditValues({ ...values, profileImage, cmid: FinalCmid }); // <-- set modal values
      // setCreatedCmId(FinalCmid);
      // setOriginalEditValues({ ...values, profileImage });
      // setShowEditModal(true); // <-- open modal
      // setIsEditMode(false);

    } catch (error) {
      // Modal.error({ content: "Error submitting form" });
      message.error("Error submitting form");
    } finally {
      setIsLoading(false);
    }
  };


  const handleBack = () => {
    // navigate("/organizationunitadd", { state: { orgid: FinalOrgid, organizationname: values.organization } });
    setUnitAddForm(false);
  }


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
      {/* ...your main organization form here... */}

      {/* Branches Accordion */}

      {!showSuccess && (
        <>
          <Box
            mt={4}
            style={{
              padding: "16px",
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              height: "100%",
            }}
          >
            <Typography.Text level={5} style={{ margin: "16px 0 8px 0", marginBottom: "16px", }}>
              Oragnization Details
            </Typography.Text>
            <Collapse
              accordion
              expandIconPosition="end"
              expandIcon={({ isActive }) =>
                isActive ? <UpOutlined />  : <DownOutlined />
              }
              defaultActiveKey={
                sortedBranches.length > 0
                  ? String(
                    sortedBranches.findIndex((b) => b.branchtype === "Parent")
                  )
                  : undefined
              }
            >
              {sortedBranches.map((branch, idx) => {
                const isEditing = editingBranchIndex === idx;
                const editData = isEditing ? branchEdits : branch;

                const panelLabel =
                  branch.branchtype === "Parent"
                    ? <span>  <Typography.Text  strong style={{ fontSize: "16px" }}>{branch.organizationname} </Typography.Text> (Parent) </span>
                    : <span> <Typography.Text strong>{branch.organizationname}</Typography.Text> (Unit) </span>;
                return (
                  <Collapse.Panel
                    header={panelLabel}
                    key={branch.id || idx}
                  >
                    <Row gutter={16}>
                      <Col xs={24} md={8} style={{ display: "none" }}>
                        <Typography.Text strong>Organization Name</Typography.Text>
                        <Input
                          value={editData.organizationname}
                          onChange={(e) =>
                            handleBranchInputChange(
                              "organizationname",
                              e.target.value
                            )
                          }
                          placeholder="Organization Name"
                          size="large"
                          disabled={!isEditing}
                          style={{ marginBottom: 12 }}
                        />
                      </Col>
                      <Col xs={24} md={8} style={{ display: "none" }}>
                        <Typography.Text strong>Branch Type</Typography.Text>
                        <Select
                          value={editData.branchtype}
                          onChange={(value) =>
                            handleBranchInputChange("branchtype", value)
                          }
                          size="large"
                          disabled={!isEditing}
                          style={{ width: "100%", marginBottom: 12 }}
                        >
                          <Select.Option value="Parent">Parent</Select.Option>
                          <Select.Option value="Branch">Branch</Select.Option>
                        </Select>
                      </Col>
                      <Col xs={24} md={8}>
                        <Typography.Text strong>Organization Unit</Typography.Text>
                        <Input
                          value={editData.branch}
                          onChange={(e) =>
                            handleBranchInputChange("branch", e.target.value)
                          }
                          placeholder="Organization Unit"
                          size="large"
                          disabled={!isEditing}
                          style={{ marginBottom: 12 }}
                        />
                      </Col>
                      <Col xs={24} md={8}>
                        <Typography.Text strong>Phone Code</Typography.Text>
                        <Input
                          value={editData.phonecode}
                          onChange={(e) =>
                            handleBranchInputChange("phonecode", e.target.value)
                          }
                          placeholder="Phone Code"
                          size="large"
                          disabled={!isEditing}
                          style={{ marginBottom: 12 }}
                        />
                      </Col>
                      <Col xs={24} md={8}>
                        <Typography.Text strong>Mobile</Typography.Text>
                        <Input
                          value={editData.mobile}
                          onChange={(e) =>
                            handleBranchInputChange("mobile", e.target.value)
                          }
                          placeholder="Mobile"
                          size="large"
                          disabled={!isEditing}
                          style={{ marginBottom: 12 }}
                        />
                      </Col>
                      <Col xs={24} md={8}>
                        <Typography.Text strong>Email</Typography.Text>
                        <Input
                          value={editData.email}
                          onChange={(e) =>
                            handleBranchInputChange("email", e.target.value)
                          }
                          placeholder="Email"
                          size="large"
                          disabled={!isEditing}
                          style={{ marginBottom: 12 }}
                        />
                      </Col>
                      <Col xs={24} md={8}>
                        <Typography.Text strong>Country</Typography.Text>
                        <Input
                          value={editData.country}
                          onChange={(e) =>
                            handleBranchInputChange("country", e.target.value)
                          }
                          placeholder="Country"
                          size="large"
                          disabled={!isEditing}
                          style={{ marginBottom: 12 }}
                        />
                      </Col>
                      <Col xs={24} md={8}>
                        <Typography.Text strong>State</Typography.Text>
                        <Input
                          value={editData.state}
                          onChange={(e) =>
                            handleBranchInputChange("state", e.target.value)
                          }
                          placeholder="State"
                          size="large"
                          disabled={!isEditing}
                          style={{ marginBottom: 12 }}
                        />
                      </Col>
                      <Col xs={24} md={8}>
                        <Typography.Text strong>District</Typography.Text>
                        <Input
                          value={editData.district}
                          onChange={(e) =>
                            handleBranchInputChange("district", e.target.value)
                          }
                          placeholder="District"
                          size="large"
                          disabled={!isEditing}
                          style={{ marginBottom: 12 }}
                        />
                      </Col>
                      {/* <Col xs={24} md={8}>
                    <Typography.Text strong>Address</Typography.Text>
                    <Input
                      value={editData.address}
                      onChange={(e) =>
                        handleBranchInputChange("address", e.target.value)
                      }
                      placeholder="Address"
                      size="large"
                      disabled={!isEditing}
                      style={{ marginBottom: 12 }}
                    />
                  </Col> */}
                      <Col xs={24} md={8}>
                        <Typography.Text strong>Postal Code</Typography.Text>
                        <Input
                          value={editData.postalcode}
                          onChange={(e) =>
                            handleBranchInputChange("postalcode", e.target.value)
                          }
                          placeholder="Postal Code"
                          size="large"
                          disabled={!isEditing}
                          style={{ marginBottom: 12 }}
                        />
                      </Col>
                      <Col xs={24} md={8}>
                        <Typography.Text strong>Date</Typography.Text>
                        <Input
                          value={editData.date}
                          disabled
                          size="large"
                          style={{ marginBottom: 12 }}
                        />
                      </Col>
                      <Col xs={24} md={8}>
                        <Typography.Text strong>Time</Typography.Text>
                        <Input
                          value={editData.time}
                          disabled
                          size="large"
                          style={{ marginBottom: 12 }}
                        />
                      </Col>
                    </Row>
                    <div style={{ marginTop: 16 }}>
                      {isEditing ? (
                        <>
                          <Button
                            type="primary"
                            onClick={() => handleBranchSave(idx)}
                            loading={isLoading}
                            style={{
                              backgroundColor: "#3e4396",
                              color: "#fff",
                              fontWeight: "bold",
                              marginRight: 8,
                            }}
                          >
                            Save
                          </Button>
                          <Button onClick={handleBranchCancel}>Cancel</Button>
                        </>
                      ) : (
                        <>
                          <Button
                            type="primary"
                            onClick={() => handleBranchEdit(idx)}
                            style={{
                              backgroundColor: "#3e4396",
                              color: "#fff",
                              fontWeight: "bold",
                              marginRight: 8,
                            }}
                          >
                            Edit
                          </Button>
                          {getCreaterRole() === "admin" && (
                            <Button
                              // type="outlined"

                              // size="small"
                              danger
                              style={{
                                // backgroundColor: "#3e4396",
                                // color: "#fff",
                                fontWeight: "bold",
                                marginRight: 8,
                                // borderColor: "#f8dcdb",

                              }}

                              onClick={() => {
                                Modal.confirm({
                                  title: "Are you sure you want to delete this Organization?",
                                  content: "This action cannot be undone.",
                                  okText: "Yes, Delete",
                                  okType: "danger",
                                  cancelText: "Cancel",
                                  onOk: async () => {
                                    try {
                                      const branch = sortedBranches[idx];
                                      await fetch(
                                        `${process.env.REACT_APP_API_URL}/v1/OrganizationDelete/${branch.id}`,
                                        {
                                          method: "DELETE",
                                          headers: { "Content-Type": "application/json" },
                                        }
                                      );
                                      message.success("Organization deleted successfully!");
                                      setBranchesData((prev) => prev.filter((b) => b.id !== branch.id));
                                      Navigate("/organization");
                                    } catch (error) {
                                      message.error("Failed to delete Organization.");
                                    }
                                  },
                                });
                              }}
                            >
                              Delete
                            </Button>


                          )}
                        </>
                      )}
                    </div>
                  </Collapse.Panel>
                );
              })}
            </Collapse>
            {/* {(getCreaterRole() === "admin" || getCreaterRole() === "hob") && ( */}
            {(!unitAddForm && !cmform) && (
              <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", marginTop: 16 }}>
                <Button
                  type="primary"
                  onClick={() => setUnitAddForm(true)}
                  style={{
                    marginTop: 16,
                    backgroundColor: "#3e4396",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  Add Organization Unit
                </Button>
                <Button
                  type="primary"
                  onClick={() => setCmform(true)}
                  style={{
                    marginTop: 16,
                    backgroundColor: "#3e4396",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  Add Customer Manager
                </Button>
              </div>
            )}
            {/* )} */}

          </Box>




          {/* organization unit add */}
          {unitAddForm && (
            <div style={{ display: "flex", marginTop: 16, alignItems: "left", marginBottom: 16, marginLeft: 16 }}>
              <Typography style={{  fontWeight: "600", fontSize: 14, color:"rgb(9 17 152)"}} >Add Organization Unit</Typography>
            </div>
          )}

          <Box sx={{ backgroundColor: "#ffffff", borderRadius: "8px", padding: "24px", margin: "10px", display: unitAddForm ? "block" : "none" }}>

            <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
              <Row gutter={16}>
                <Col xs={24} md={8} style={{ display: "none" }}>
                  <Form.Item label="Organization Id">
                    <Input
                      value={firstBranch.organizationid || ""}
                      disabled
                      size="large"
                      style={{
                        borderRadius: 8,
                        background: "#f5f5f5",
                        fontSize: 16,
                        color: "#888",
                        cursor: "not-allowed",
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8} style={{ display: "none" }} >
                  <Form.Item label="Organization Name">
                    <Input
                      value={firstBranch.organizationname || ""}
                      disabled
                      size="large"
                      style={{
                        borderRadius: 8,
                        background: "#f5f5f5",
                        fontSize: 16,
                        color: "#888",
                        cursor: "not-allowed",
                      }}
                    />
                  </Form.Item>
                </Col>


                <Col xs={24} md={8}>
                  <Form.Item
                    label={<b>Organization Unit</b>}
                    name="branch"
                    rules={[{ required: true, message: "Organization Unit is required" }]}
                  >
                    <Input
                      placeholder="Organization Unit"
                      size="large"
                      style={{ borderRadius: 8, background: "#fff", fontSize: 16 }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item
                    label={<Typography.Text strong >Email</Typography.Text>}
                    name="email">
                    <Input
                      value={firstBranch.email || ""}
                      // disabled 
                      size="large"
                      style={{
                        borderRadius: 8,
                        // background: "#f5f5f5",
                        fontSize: 16,
                        // color: "#888",
                        // cursor: "not-allowed",
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item
                    label={<Typography.Text strong >Phone Code</Typography.Text>}
                    name="phoneCode"
                    initialValue={firstBranch.phonecode || ""}
                    rules={[{ required: true, message: "Code is required" }]}
                  >
                    <Select
                      showSearch
                      placeholder="Select Phone Code"
                      size="large"
                      style={{
                        borderRadius: 8,
                        background: "#fff",
                        fontSize: 16,
                      }}
                    >
                      {countries.map((c) => (
                        <Select.Option
                          key={c.isoCode}
                          value={`+${c.phonecode}`}
                        >{`+${c.phonecode} (${c.name})`}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item
                    label={<Typography.Text strong >Mobile</Typography.Text>}
                    name="phoneno">
                    <Input
                      value={firstBranch.mobile || ""}
                      // disabled
                      size="large"
                      style={{
                        borderRadius: 8,
                        // background: "#f5f5f5",
                        fontSize: 16,
                        // color: "#888",
                        // cursor: "not-allowed",
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label={<Typography.Text strong >Country</Typography.Text>}
                    name="country"
                    rules={[{ required: true, message: "Country is required" }]}
                  >
                    <Select
                      showSearch
                      placeholder="Select Country"
                      size="large"
                      style={{
                        borderRadius: 8,
                        background: "#fff",
                        fontSize: 16,
                      }}
                      onChange={(value) => {
                        setSelectedCountry(value);
                        setSelectedState("");
                        form.setFieldsValue({ province: "", city: "" });
                      }}
                    >
                      {countries.map((c) => (
                        <Select.Option key={c.isoCode} value={c.name}>
                          {c.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label={<Typography.Text strong >State/Province</Typography.Text>}
                    name="province"
                    rules={[{ required: true, message: "State/Province is required" }]}
                  >
                    <Select
                      showSearch
                      placeholder="Select State/Province"
                      size="large"
                      style={{
                        borderRadius: 8,
                        background: "#fff",
                        fontSize: 16,
                      }}
                      onChange={(value) => {
                        setSelectedState(value);
                        form.setFieldsValue({ city: "" });
                      }}
                      disabled={!selectedCountry}
                    >
                      {(selectedCountry
                        ? State.getStatesOfCountry(
                          countries.find((c) => c.name === selectedCountry)?.isoCode || ""
                        )
                        : []
                      ).map((s) => (
                        <Select.Option key={s.isoCode} value={s.name}>
                          {s.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label={<Typography.Text strong >City</Typography.Text>}
                    name="city"
                    rules={[{ required: true, message: "City is required" }]}
                  >
                    <Select
                      showSearch
                      placeholder="Select City"
                      size="large"
                      style={{
                        borderRadius: 8,
                        background: "#fff",
                        fontSize: 16,
                      }}
                      disabled={!selectedState}
                    >
                      {(selectedState
                        ? City.getCitiesOfState(
                          countries.find((c) => c.name === selectedCountry)?.isoCode || "",
                          State.getStatesOfCountry(
                            countries.find((c) => c.name === selectedCountry)?.isoCode || ""
                          ).find((s) => s.name === selectedState)?.isoCode || ""
                        )
                        : []
                      ).map((city) => (
                        <Select.Option key={city.name} value={city.name}>
                          {city.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label={<Typography.Text strong >Postal Code</Typography.Text>}
                    name="postcode"
                    rules={[{ required: true, message: "Postal Code is required" }]}
                  >
                    <Input
                      placeholder="Postal Code"
                      size="large"
                      style={{
                        borderRadius: 8,
                        background: "#fff",
                        fontSize: 16,
                      }}
                    />
                  </Form.Item>
                </Col>
                {/* Add more fields as needed */}
              </Row>
              <Box display="flex" justifyContent="space-between" mt="10px" gap="10px">
                <Button
                  type="primary"
                  // htmlType="submit"
                  onClick={handleBack}
                  style={{
                    padding: "12px 24px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    borderRadius: "8px",
                    background: colors.blueAccent[1000],
                    color: "#fff",
                  }}
                >
                  Back
                </Button>

                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading} // <-- Add this line
                  style={{
                    padding: "12px 24px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    borderRadius: "8px",
                    background: colors.blueAccent[1000],
                    color: "#fff",
                  }}
                >
                  Save and Next
                </Button>
              </Box>
            </Form>
          </Box>



          {cmform && (
            <div style={{ display: "flex", marginTop: 16, alignItems: "left", marginBottom: 16, marginLeft: 16 }}>
              <Typography style={{ fontWeight: "600", fontSize: 14, color:"rgb(9 17 152)" }} >ADD Customer Manager</Typography>
            </div>
          )}
          {cmform && (

            <div
              style={{ background: "#fff", borderRadius: 8, padding: 24, margin: "10px" }}
            >

              <Form
                form={cmForm}
                layout="vertical"
                onFinish={handleCmSubmit}
                initialValues={{
                  firstName: "",
                  lastName: "",
                  email: "",
                  phoneCode: "",
                  PhoneNo: "",
                  gender: "",
                  designation: "",
                  organization: organizationname || "",
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
                      label={<Typography.Text strong>First Name</Typography.Text>}
                      name="firstName"
                      rules={[{ required: true, message: "First Name is required" }]}
                    >
                      <Input
                        placeholder="First Name"
                        size="large"
                        style={{ borderRadius: 8, background: "#fff", fontSize: 16 }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label={<Typography.Text strong>Last Name</Typography.Text>}
                      name="lastName"
                      rules={[{ required: true, message: "Last Name is required" }]}
                    >
                      <Input
                        placeholder="Last Name"
                        size="large"
                        style={{ borderRadius: 8, background: "#fff", fontSize: 16 }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label={<Typography.Text strong>Email Id</Typography.Text>}
                      name="email"
                      rules={[{ required: true, message: "Email is required" }]}
                    >
                      <Input
                        placeholder="Email"
                        size="large"
                        style={{ borderRadius: 8, background: "#fff", fontSize: 16 }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item label={<Typography.Text strong>Phone Number</Typography.Text>} required>
                      <Input.Group compact>
                        <Form.Item
                          name="phoneCode"
                          noStyle
                          rules={[{ required: true, message: "Code is required" }]}
                        >
                          <Select
                            showSearch
                            style={{ width: 160 }}
                            placeholder="Code"
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
                      label={<Typography.Text strong>Gender</Typography.Text>}
                      name="gender"
                      rules={[{ required: true, message: "Gender is required" }]}
                    >
                      <Select
                        placeholder="Select Gender"
                        size="large"
                        style={{ borderRadius: 8, background: "#fff", fontSize: 16 }}
                      >
                        {gender.map((g) => (
                          <Option key={g} value={g}>
                            {g}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  {/* <Col xs={24} md={8}>
                       <Form.Item
                         label={<Typography strong>Designation</Typography>}
                         name="designation"
                         rules={[{ required: true, message: "Designation is required" }]}
                       >
                         <Input
                           placeholder="Designation"
                           size="large"
                           style={{ borderRadius: 8, background: "#fff", fontSize: 16 }}
                         />
                       </Form.Item>
                     </Col> */}
                  {/* <Col xs={24} md={8}>
                    <Form.Item
                      label={<Typography strong>Organization</Typography>}
                      name="organization"
                      rules={[
                        { required: true, message: "Organization is required" },
                      ]}
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
                          <Option key={org} value={org}>
                            {org}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col> */}

                  <Col xs={24} md={8} >
                    <Form.Item
                      label={<Typography.Text strong>Organization</Typography.Text>}
                      name="organization"
                      rules={[{ required: true, message: "Organization is required" }]}
                    >
                      <Input
                        placeholder="Organization Name"
                        size="large"
                        style={{ borderRadius: 8, background: "#fff", fontSize: 16 }}
                        disabled // if you want it to be read-only
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item
                      label={<Typography.Text strong>Organization Unit</Typography.Text>}
                      name="branch"
                      rules={[{ required: true, message: "Organization Unit is required" }]}
                    >
                      <Select
                        showSearch
                        placeholder="Select Organization Unit"
                        value={organizationname}
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
                      label={<Typography.Text strong>Relationship Manager</Typography.Text>}
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
                          cmForm.setFieldsValue({
                            crmname: selected ? selected.name : "",
                            crmid: value
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
                    <Form.Item label="CRM ID" name="crmid" style={{ display: "none" }}>
                      <Input disabled />
                    </Form.Item>
                  </Col>
                </Row>
                <Row justify="end" style={{ marginTop: 32, justifyContent: "space-between" }} gutter={16}>
                  <Col>
                    <Button
                      type="primary"
                      size="large"
                      onClick={() => setCmform(false)} // <-- Add this
                      style={{
                        background: colors.blueAccent[1000],
                        color: "#fff",
                       fontWeight: "600",
                        borderRadius: 8,
                      }}
                    >
                      Back
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={isLoading} // <-- Add this line
                      size="large"
                      style={{
                        background: colors.blueAccent[1000],
                        color: "#fff",
                        fontWeight: "600",
                        borderRadius: 8,
                      }}
                    >
                      Submit
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>

          )}
        </>
      )}


      {showSuccess && (
        <SuccessScreen background={colors.blueAccent[1000]} onNext={() => Navigate("/organizationdetails", { state: { ticket: firstBranch.organizationid } })} />
      )}


    </>
  );
};





export default OrganizationUnitadd;
