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
  Result,
  Radio,
  Checkbox,
  Card
} from "antd";
import { CameraOutlined, PlusOutlined } from "@ant-design/icons";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Country } from "country-state-city";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../../theme";
import { useTheme, useMediaQuery } from "@mui/material";
import { CloseOutlined } from "@ant-design/icons";
// import { ArrowLeftOutlined } from "@ant-design/icons";
import { getCreaterRole, getCreaterId } from "../../../config"; // Adjust the path as necessary

const { Option } = Select;
const { Text } = Typography;
const { TextArea } = Input;

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
  const isMobile = useMediaQuery("(max-width: 400px)");
  const isTablet = useMediaQuery("(max-width: 700px)");
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
  const [functionList, setFunctionList] = useState([]);
  const [interestList, setInterestList] = useState([]);

  // Persona form states
  const [personaForm] = Form.useForm();
  const [personaLoading, setPersonaLoading] = useState(false);
  const [personaSuccess, setPersonaSuccess] = useState(false);

  // Persona dynamic fields
  const [commonTitles, setCommonTitles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [primaryGoals, setPrimaryGoals] = useState([]);
  const [painPoints, setPainPoints] = useState([]);
  const [kpis, setKpis] = useState([]);
  const [buyingMotivations, setBuyingMotivations] = useState([]);
  const [objections, setObjections] = useState([]);
  const [decisionCriteria, setDecisionCriteria] = useState([]);
  const [responsibilities, setResponsibilities] = useState([]);

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



  useEffect(() => {
    const fetchFunctions = async () => {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/v1/GetCmFunction`);
      const data = await res.json();
      setFunctionList(data.functions || data.data || []);
    };
    fetchFunctions();
  }, []);

  // ...existing code...



  useEffect(() => {
    const fetchInterest = async () => {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/v1/GetCmInterest`);
      const data = await res.json();
      setInterestList(data.data || data.interests || []);
    };
    fetchInterest();
  }, []);
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
    formData.append("functionValue", values.function || "");
    // Convert interests array to comma-separated string
    formData.append("interests", Array.isArray(values.interests) ? values.interests.join(",") : (values.interests || ""));
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
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/v1/createCm`,
        // `http://127.0.0.1:8080/v1/createCm`,
        formData,
        { headers: { "Content-Type": "multipart/form-data, charset=utf-8" } }
      );
      // Modal.success({ content: "CM Registered Successfully!" });
      // message.success("CM Registered Successfully!");
      const cmData = response.data.data || {};
      const FinalCmid = response.data.cmid || cmData.cmid;

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
    // Convert interests array to comma-separated string
    formData.append("interests", Array.isArray(values.interests) ? values.interests.join(",") : (values.interests || ""));
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

  // Persona form data
  const industries = [
    "Financial Services", "Technology", "Healthcare", "Manufacturing", "Retail",
    "Telecommunications", "Energy Utilities", "Government Public", "Education", "Real Estate",
    "Automotive", "Aerospace Defense", "Media Entertainment", "Logistics Transportation",
    "Insurance", "Pharmaceuticals", "Construction", "Agriculture", "Hospitality", "Legal"
  ];

  const companySizes = [
    "Startup", "Small Business", "Mid Market", "Large Enterprise", "Enterprise", "Multinational"
  ];

  const budgetAuthority = ["Approver", "Influencer", "Decision Maker", "Evaluator", "User"];
  const influenceLevels = ["High", "Medium", "Low"];
  const procurementLevels = ["High", "Medium", "Low", "None"];
  const riskTolerance = ["High", "Moderate", "Low", "Conservative"];
  const techSavviness = ["High", "Medium", "Low", "Beginner"];
  const channels = ["Email", "Phone", "Video", "In Person", "Events", "Webinar", "Chat"];
  const contentTypes = ["Case Study", "Whitepaper", "ROI Calculator", "Demo", "Technical Doc", "Reference Call", "Trial"];
  const buyingStages = ["Awareness", "Research", "Evaluation", "Decision", "Negotiation", "Implementation", "Post Implementation"];
  const meetingCadence = ["Weekly", "Bi-weekly", "Monthly", "Quarterly", "As Needed"];

  // Persona form helper functions
  const addCommonTitle = (value) => {
    if (value && !commonTitles.includes(value)) {
      setCommonTitles([...commonTitles, value]);
      personaForm.setFieldsValue({ commonTitleInput: "" });
    }
  };

  const addDepartment = (value) => {
    if (value && !departments.includes(value)) {
      setDepartments([...departments, value]);
      personaForm.setFieldsValue({ departmentInput: "" });
    }
  };

  const addPrimaryGoal = (value) => {
    if (value && !primaryGoals.includes(value)) {
      setPrimaryGoals([...primaryGoals, value]);
      personaForm.setFieldsValue({ primaryGoalInput: "" });
    }
  };

  const addPainPoint = (value) => {
    if (value && !painPoints.includes(value)) {
      setPainPoints([...painPoints, value]);
      personaForm.setFieldsValue({ painPointInput: "" });
    }
  };

  const addKpi = (value) => {
    if (value && !kpis.includes(value)) {
      setKpis([...kpis, value]);
      personaForm.setFieldsValue({ kpiInput: "" });
    }
  };

  const addBuyingMotivation = (value) => {
    if (value && !buyingMotivations.includes(value)) {
      setBuyingMotivations([...buyingMotivations, value]);
      personaForm.setFieldsValue({ buyingMotivationInput: "" });
    }
  };

  const addObjection = (value) => {
    if (value && !objections.includes(value)) {
      setObjections([...objections, value]);
      personaForm.setFieldsValue({ objectionInput: "" });
    }
  };

  const addDecisionCriterion = (value) => {
    if (value && !decisionCriteria.includes(value)) {
      setDecisionCriteria([...decisionCriteria, value]);
      personaForm.setFieldsValue({ decisionCriterionInput: "" });
    }
  };

  const addResponsibility = (value) => {
    if (value && !responsibilities.includes(value)) {
      setResponsibilities([...responsibilities, value]);
      personaForm.setFieldsValue({ responsibilityInput: "" });
    }
  };

  const removeItem = (list, setList, index) => {
    const newList = list.filter((_, i) => i !== index);
    setList(newList);
  };

  const handlePersonaSubmit = async (values) => {
    setPersonaLoading(true);

    const personaData = {
      ...values,
      commonTitles,
      departments,
      primaryGoals,
      painPoints,
      kpis,
      buyingMotivations,
      objections,
      decisionCriteria,
      responsibilities
    };

    try {
      console.log("Persona Data:", personaData);
      await new Promise(resolve => setTimeout(resolve, 2000));
      message.success("Persona created successfully!");
      setPersonaSuccess(true);
    } catch (error) {
      message.error("Error creating persona");
    } finally {
      setPersonaLoading(false);
    }
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
              <Form.Item label="First Name" className="custom-placeholder-12px" name="firstName" rules={[{ required: true, message: "First Name is required" }]}>
                <Input disabled={!isEditMode} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Last Name" className="custom-placeholder-12px" name="lastName" rules={[{ required: true, message: "Last Name is required" }]}>
                <Input disabled={!isEditMode} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Email" className="custom-placeholder-12px" name="email" rules={[{ required: true, message: "Email is required" }, { type: "email", message: "Please enter a valid email" }]}>
                <Input disabled={!isEditMode} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item label="Phone Code" className="custom-placeholder-12px" name="phoneCode" rules={[{ required: true, message: "Phone Code is required" }]}>
                <Input disabled={!isEditMode} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Phone Number" className="custom-placeholder-12px" name="PhoneNo" rules={[{ required: true, message: "Phone Number is required" }]}>
                <Input disabled={!isEditMode} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Gender" className="custom-placeholder-12px" name="gender" rules={[{ required: true, message: "Gender is required" }]}>
                <Select disabled={!isEditMode}>
                  <Option value="Male">Male</Option>
                  <Option value="Female">Female</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            {/* <Col xs={24} md={8}>
              <Form.Item label="Designation" name="designation" rules={[{ required: true, message: "Designation is required" }]}>
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
              Create New Customer Manager
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
                  rules={[{ required: true, message: "Email is required" }, { type: "email", message: "Please enter a valid email" }]}
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
                        style={{ width: "40%" }}
                        placeholder="Phone Code"
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
                  label={<Text className="custom-headding-12px">Function</Text>}
                  className="custom-placeholder-12px"
                  name="function"
                  rules={[{ required: true, message: "Function is required" }]}
                >
                  <Select
                    showSearch
                    size="large"
                    placeholder="Select Function"
                    style={{ borderRadius: 8, background: "#fff" }}
                  >
                    {functionList.map((fn, idx) => (
                      <Select.Option key={fn} value={fn}>{fn}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  label={<Text className="custom-headding-12px">Interests</Text>}
                  className="custom-placeholder-12px"
                  name="interests"
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
                    filterOption={false}
                    dropdownRender={menu => {
                      // HIDE custom add option for now (for testing)
                      // const search = interestSearch.trim();
                      // const lowerList = interestList.map(i => i.toLowerCase());
                      // const alreadySelected = (form.getFieldValue("interests") || []).map(i => i.toLowerCase());
                      // if (search && !lowerList.includes(search.toLowerCase()) && !alreadySelected.includes(search.toLowerCase())) {
                      //   return (
                      //     <>
                      //       {menu}
                      //       <div
                      //         style={{ padding: 8, cursor: "pointer", color: "#1677ff" }}
                      //         onMouseDown={e => {
                      //           e.preventDefault();
                      //           const current = form.getFieldValue("interests") || [];
                      //           form.setFieldsValue({ interests: [...current, search] });
                      //           setInterestSearch("");
                      //         }}
                      //       >
                      //         + Add "{search}" as custom interest
                      //       </div>
                      //     </>
                      //   );
                      // }
                      return menu;
                    }}
                  >
                    {/* Show all interests */}
                    {interestList.map((interest, idx) => (
                      <Select.Option key={interest} value={interest}>{interest}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label={<Text className="custom-headding-12px">Description</Text>}
                  className="custom-placeholder-12px"
                  name="description"
                // rules={[{ required: true, message: "Email is required" }, { type: "email", message: "Please enter a valid email" }]}
                >
                  <Input
                    placeholder="Description"
                    size="large"
                    style={{ borderRadius: 8, background: "#fff", }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  label={<Text className="custom-headding-12px">Company Size</Text>}
                  className="custom-placeholder-12px"
                  name="companysize"
                // rules={[{ required: true, message: "Email is required" }, { type: "email", message: "Please enter a valid email" }]}
                >
                  <Input
                    placeholder="Company Size"
                    size="large"
                    style={{ borderRadius: 8, background: "#fff", }}
                  />
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
                  loading={isLoading}
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

      {/* Persona Creation Form */}
      {!showSuccess && (
        <div style={{ background: "#fff", borderRadius: 8, padding: isMobile ? 15 : 24, margin: 16, marginTop: 32 }}>
          <div style={{ display: "flex", justifyContent: isMobile ? "flex-start" : "space-between", flexDirection: "column", alignItems: "flex-start", marginBottom: 16 }}>
            <Text
              className="custom-headding-16px"
              style={{
                textAlign: isMobile ? "left" : "left",
                fontSize: isMobile ? "15px" : isTablet ? "17px" : "18px",
                paddingLeft: isMobile ? "0px" : "0px",
              }}
            >
              Create Persona
            </Text>            <Text style={{ fontSize: 14, color: "#6b7280", textAlign: "center", marginTop: 8 }}>
              Capture a detailed B2B customer persona to guide targeting, messaging, & sales motions.
            </Text>
          </div>

          <Form
            form={personaForm}
            layout="vertical"
            onFinish={handlePersonaSubmit}
            initialValues={{
              seniority: "Executive",
              budgetAuthority: "Approver",
              influenceLevel: "High",
              procurementInvolvement: "Medium",
              riskTolerance: "Moderate",
              techSavviness: "Medium",
              meetingCadence: "Monthly"
            }}
          >
            {/* Basic Persona Details */}
            <Card title="Basic Persona Details" style={{ marginBottom: 24 }}>
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<Text className="custom-headding-12px">Name</Text>}
                    className="custom-placeholder-12px"
                    name="name"
                    rules={[{ required: true, message: "Name is required" }]}
                  >
                    <Input
                      placeholder="e.g., CIO - Enterprise"
                      size="large"
                      style={{ borderRadius: 8, background: "#fff" }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<Text className="custom-headding-12px">Primary Role</Text>}
                    className="custom-placeholder-12px"
                    name="primaryRole"
                    rules={[{ required: true, message: "Primary role is required" }]}
                  >
                    <Input
                      placeholder="CIO"
                      size="large"
                      style={{ borderRadius: 8, background: "#fff" }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<Text className="custom-headding-12px">Seniority</Text>}
                    className="custom-placeholder-12px"
                    name="seniority"
                    rules={[{ required: true, message: "Seniority is required" }]}
                  >
                    <Select
                      size="large"
                      style={{ borderRadius: 8, background: "#fff" }}
                    >
                      <Option value="Executive">Executive</Option>
                      <Option value="Senior">Senior</Option>
                      <Option value="Mid-level">Mid-level</Option>
                      <Option value="Junior">Junior</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<Text className="custom-headding-12px">Description</Text>}
                    className="custom-placeholder-12px"
                    name="description"
                  >
                    <Input
                      placeholder="Short summary"
                      size="large"
                      style={{ borderRadius: 8, background: "#fff" }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* Common Titles & Departments */}
            <Card title="Common Titles & Departments" style={{ marginBottom: 24 }}>
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<Text className="custom-headding-12px">Common Titles</Text>}
                    className="custom-placeholder-12px"
                  >
                    <Input
                      placeholder="Add a title and press +"
                      size="large"
                      style={{ borderRadius: 8, background: "#fff" }}
                      suffix={
                        <Button
                          type="text"
                          icon={<PlusOutlined />}
                          onClick={() => {
                            const value = personaForm.getFieldValue("commonTitleInput");
                            addCommonTitle(value);
                          }}
                        />
                      }
                      name="commonTitleInput"
                      onPressEnter={(e) => {
                        addCommonTitle(e.target.value);
                      }}
                    />
                  </Form.Item>
                  <div style={{ marginTop: 8 }}>
                    {commonTitles.map((title, index) => (
                      <span
                        key={index}
                        style={{
                          display: "inline-block",
                          background: "#f0f0f0",
                          padding: "4px 8px",
                          margin: "2px",
                          borderRadius: "4px",
                          fontSize: "12px"
                        }}
                      >
                        {title}
                        <Button
                          type="text"
                          size="small"
                          onClick={() => removeItem(commonTitles, setCommonTitles, index)}
                          style={{ marginLeft: 4, padding: 0 }}
                        >
                          ×
                        </Button>
                      </span>
                    ))}
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<Text className="custom-headding-12px">Departments</Text>}
                    className="custom-placeholder-12px"
                  >
                    <Input
                      placeholder="e.g., IT, Finance"
                      size="large"
                      style={{ borderRadius: 8, background: "#fff" }}
                      suffix={
                        <Button
                          type="text"
                          icon={<PlusOutlined />}
                          onClick={() => {
                            const value = personaForm.getFieldValue("departmentInput");
                            addDepartment(value);
                          }}
                        />
                      }
                      name="departmentInput"
                      onPressEnter={(e) => {
                        addDepartment(e.target.value);
                      }}
                    />
                  </Form.Item>
                  <div style={{ marginTop: 8 }}>
                    {departments.map((dept, index) => (
                      <span
                        key={index}
                        style={{
                          display: "inline-block",
                          background: "#f0f0f0",
                          padding: "4px 8px",
                          margin: "2px",
                          borderRadius: "4px",
                          fontSize: "12px"
                        }}
                      >
                        {dept}
                        <Button
                          type="text"
                          size="small"
                          onClick={() => removeItem(departments, setDepartments, index)}
                          style={{ marginLeft: 4, padding: 0 }}
                        >
                          ×
                        </Button>
                      </span>
                    ))}
                  </div>
                </Col>
              </Row>
            </Card>

            <div style={{ display: "flex", flexDirection: "row", gap: "24px" }}>
               {/* Industry Focus */}
               <Card title="Industry Focus" style={{ marginBottom: 24, flex: 1 }}>
                 <Form.Item
                   className="custom-placeholder-12px"
                   name="industries"
                   rules={[{ required: true, message: "Select at least one industry" }]}
                 >
                   <Checkbox.Group style={{ width: "100%" }}>
                     <div style={{
                       display: "grid",
                       gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                       gap: "8px 16px",
                       justifyContent: "flex-start"
                     }}>
                       {industries.map((industry) => (
                         <Checkbox
                           key={industry}
                           value={industry}
                           style={{
                             marginBottom: "8px"
                           }}
                         >
                           {industry}
                         </Checkbox>
                       ))}
                     </div>
                   </Checkbox.Group>
                 </Form.Item>
               </Card>

               {/* Company Size */}
               <Card title="Company Size" style={{ marginBottom: 24, flex: 1 }}>
                 <Form.Item
                   className="custom-placeholder-12px"
                   name="companySizes"
                   rules={[{ required: true, message: "Select at least one company size" }]}
                 >
                   <Radio.Group>
                     <div style={{
                       display: "grid",
                       gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                       gap: "8px 16px",
                       justifyContent: "flex-start"
                     }}>
                       {companySizes.map((size) => (
                         <Radio
                           key={size}
                           value={size}
                           style={{
                             marginBottom: "8px"
                           }}
                         >
                           {size}
                         </Radio>
                       ))}
                     </div>
                   </Radio.Group>
                 </Form.Item>
               </Card>
            </div>
            {/* Primary Goals & Pain Points */}
            <Card title="Primary Goals & Pain Points" style={{ marginBottom: 24 }}>
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<Text className="custom-headding-12px">Primary Goals</Text>}
                    className="custom-placeholder-12px"
                  >
                    <Input
                      placeholder="Add a goal"
                      size="large"
                      style={{ borderRadius: 8, background: "#fff" }}
                      suffix={
                        <Button
                          type="text"
                          icon={<PlusOutlined />}
                          onClick={() => {
                            const value = personaForm.getFieldValue("primaryGoalInput");
                            addPrimaryGoal(value);
                          }}
                        />
                      }
                      name="primaryGoalInput"
                      onPressEnter={(e) => {
                        addPrimaryGoal(e.target.value);
                      }}
                    />
                  </Form.Item>
                  <div style={{ marginTop: 8 }}>
                    {primaryGoals.map((goal, index) => (
                      <span
                        key={index}
                        style={{
                          display: "inline-block",
                          background: "#f0f0f0",
                          padding: "4px 8px",
                          margin: "2px",
                          borderRadius: "4px",
                          fontSize: "12px"
                        }}
                      >
                        {goal}
                        <Button
                          type="text"
                          size="small"
                          onClick={() => removeItem(primaryGoals, setPrimaryGoals, index)}
                          style={{ marginLeft: 4, padding: 0 }}
                        >
                          ×
                        </Button>
                      </span>
                    ))}
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<Text className="custom-headding-12px">Pain Points</Text>}
                    className="custom-placeholder-12px"
                  >
                    <Input
                      placeholder="Add a pain point"
                      size="large"
                      style={{ borderRadius: 8, background: "#fff" }}
                      suffix={
                        <Button
                          type="text"
                          icon={<PlusOutlined />}
                          onClick={() => {
                            const value = personaForm.getFieldValue("painPointInput");
                            addPainPoint(value);
                          }}
                        />
                      }
                      name="painPointInput"
                      onPressEnter={(e) => {
                        addPainPoint(e.target.value);
                      }}
                    />
                  </Form.Item>
                  <div style={{ marginTop: 8 }}>
                    {painPoints.map((point, index) => (
                      <span
                        key={index}
                        style={{
                          display: "inline-block",
                          background: "#f0f0f0",
                          padding: "4px 8px",
                          margin: "2px",
                          borderRadius: "4px",
                          fontSize: "12px"
                        }}
                      >
                        {point}
                        <Button
                          type="text"
                          size="small"
                          onClick={() => removeItem(painPoints, setPainPoints, index)}
                          style={{ marginLeft: 4, padding: 0 }}
                        >
                          ×
                        </Button>
                      </span>
                    ))}
                  </div>
                </Col>
              </Row>
            </Card>

            {/* KPIs & Buying Motivations */}
            <Card title="KPIs & Buying Motivations" style={{ marginBottom: 24 }}>
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<Text className="custom-headding-12px">KPIs</Text>}
                    className="custom-placeholder-12px"
                  >
                    <Input
                      placeholder="Add a KPI"
                      size="large"
                      style={{ borderRadius: 8, background: "#fff" }}
                      suffix={
                        <Button
                          type="text"
                          icon={<PlusOutlined />}
                          onClick={() => {
                            const value = personaForm.getFieldValue("kpiInput");
                            addKpi(value);
                          }}
                        />
                      }
                      name="kpiInput"
                      onPressEnter={(e) => {
                        addKpi(e.target.value);
                      }}
                    />
                  </Form.Item>
                  <div style={{ marginTop: 8 }}>
                    {kpis.map((kpi, index) => (
                      <span
                        key={index}
                        style={{
                          display: "inline-block",
                          background: "#f0f0f0",
                          padding: "4px 8px",
                          margin: "2px",
                          borderRadius: "4px",
                          fontSize: "12px"
                        }}
                      >
                        {kpi}
                        <Button
                          type="text"
                          size="small"
                          onClick={() => removeItem(kpis, setKpis, index)}
                          style={{ marginLeft: 4, padding: 0 }}
                        >
                          ×
                        </Button>
                      </span>
                    ))}
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<Text className="custom-headding-12px">Buying Motivations</Text>}
                    className="custom-placeholder-12px"
                  >
                    <Input
                      placeholder="Add a trigger"
                      size="large"
                      style={{ borderRadius: 8, background: "#fff" }}
                      suffix={
                        <Button
                          type="text"
                          icon={<PlusOutlined />}
                          onClick={() => {
                            const value = personaForm.getFieldValue("buyingMotivationInput");
                            addBuyingMotivation(value);
                          }}
                        />
                      }
                      name="buyingMotivationInput"
                      onPressEnter={(e) => {
                        addBuyingMotivation(e.target.value);
                      }}
                    />
                  </Form.Item>
                  <div style={{ marginTop: 8 }}>
                    {buyingMotivations.map((motivation, index) => (
                      <span
                        key={index}
                        style={{
                          display: "inline-block",
                          background: "#f0f0f0",
                          padding: "4px 8px",
                          margin: "2px",
                          borderRadius: "4px",
                          fontSize: "12px"
                        }}
                      >
                        {motivation}
                        <Button
                          type="text"
                          size="small"
                          onClick={() => removeItem(buyingMotivations, setBuyingMotivations, index)}
                          style={{ marginLeft: 4, padding: 0 }}
                        >
                          ×
                        </Button>
                      </span>
                    ))}
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Common Objections & Decision Criteria */}
            <Card title="Common Objections & Decision Criteria" style={{ marginBottom: 24 }}>
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<Text className="custom-headding-12px">Common Objections</Text>}
                    className="custom-placeholder-12px"
                  >
                    <Input
                      placeholder="Add an objection"
                      size="large"
                      style={{ borderRadius: 8, background: "#fff" }}
                      suffix={
                        <Button
                          type="text"
                          icon={<PlusOutlined />}
                          onClick={() => {
                            const value = personaForm.getFieldValue("objectionInput");
                            addObjection(value);
                          }}
                        />
                      }
                      name="objectionInput"
                      onPressEnter={(e) => {
                        addObjection(e.target.value);
                      }}
                    />
                  </Form.Item>
                  <div style={{ marginTop: 8 }}>
                    {objections.map((objection, index) => (
                      <span
                        key={index}
                        style={{
                          display: "inline-block",
                          background: "#f0f0f0",
                          padding: "4px 8px",
                          margin: "2px",
                          borderRadius: "4px",
                          fontSize: "12px"
                        }}
                      >
                        {objection}
                        <Button
                          type="text"
                          size="small"
                          onClick={() => removeItem(objections, setObjections, index)}
                          style={{ marginLeft: 4, padding: 0 }}
                        >
                          ×
                        </Button>
                      </span>
                    ))}
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<Text className="custom-headding-12px">Decision Criteria</Text>}
                    className="custom-placeholder-12px"
                  >
                    <Input
                      placeholder="Add a criterion"
                      size="large"
                      style={{ borderRadius: 8, background: "#fff" }}
                      suffix={
                        <Button
                          type="text"
                          icon={<PlusOutlined />}
                          onClick={() => {
                            const value = personaForm.getFieldValue("decisionCriterionInput");
                            addDecisionCriterion(value);
                          }}
                        />
                      }
                      name="decisionCriterionInput"
                      onPressEnter={(e) => {
                        addDecisionCriterion(e.target.value);
                      }}
                    />
                  </Form.Item>
                  <div style={{ marginTop: 8 }}>
                    {decisionCriteria.map((criterion, index) => (
                      <span
                        key={index}
                        style={{
                          display: "inline-block",
                          background: "#f0f0f0",
                          padding: "4px 8px",
                          margin: "2px",
                          borderRadius: "4px",
                          fontSize: "12px"
                        }}
                      >
                        {criterion}
                        <Button
                          type="text"
                          size="small"
                          onClick={() => removeItem(decisionCriteria, setDecisionCriteria, index)}
                          style={{ marginLeft: 4, padding: 0 }}
                        >
                          ×
                        </Button>
                      </span>
                    ))}
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Authority & Influence */}
            <Card title="Authority & Influence" style={{ marginBottom: 24 }}>
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<Text className="custom-headding-12px">Budget Authority</Text>}
                    className="custom-placeholder-12px"
                    name="budgetAuthority"
                    rules={[{ required: true, message: "Budget authority is required" }]}
                  >
                    <Select
                      size="large"
                      style={{ borderRadius: 8, background: "#fff" }}
                    >
                      {budgetAuthority.map((auth) => (
                        <Option key={auth} value={auth}>{auth}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<Text className="custom-headding-12px">Influence Level</Text>}
                    className="custom-placeholder-12px"
                    name="influenceLevel"
                    rules={[{ required: true, message: "Influence level is required" }]}
                  >
                    <Select
                      size="large"
                      style={{ borderRadius: 8, background: "#fff" }}
                    >
                      {influenceLevels.map((level) => (
                        <Option key={level} value={level}>{level}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<Text className="custom-headding-12px">Procurement Involvement</Text>}
                    className="custom-placeholder-12px"
                    name="procurementInvolvement"
                    rules={[{ required: true, message: "Procurement involvement is required" }]}
                  >
                    <Select
                      size="large"
                      style={{ borderRadius: 8, background: "#fff" }}
                    >
                      {procurementLevels.map((level) => (
                        <Option key={level} value={level}>{level}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<Text className="custom-headding-12px">Risk Tolerance</Text>}
                    className="custom-placeholder-12px"
                    name="riskTolerance"
                    rules={[{ required: true, message: "Risk tolerance is required" }]}
                  >
                    <Select
                      size="large"
                      style={{ borderRadius: 8, background: "#fff" }}
                    >
                      {riskTolerance.map((tolerance) => (
                        <Option key={tolerance} value={tolerance}>{tolerance}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<Text className="custom-headding-12px">Tech Savviness</Text>}
                    className="custom-placeholder-12px"
                    name="techSavviness"
                    rules={[{ required: true, message: "Tech savviness is required" }]}
                  >
                    <Select
                      size="large"
                      style={{ borderRadius: 8, background: "#fff" }}
                    >
                      {techSavviness.map((level) => (
                        <Option key={level} value={level}>{level}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* Preferred Channels */}
            <Card title="Preferred Channels" style={{ marginBottom: 24 }}>
              <Form.Item
                className="custom-placeholder-12px"
                name="channels"
                rules={[{ required: true, message: "Select at least one channel" }]}
              >
                <Checkbox.Group style={{ width: "100%" }}>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                    gap: "8px 16px",
                    justifyContent: "flex-start"
                  }}>
                    {channels.map((channel) => (
                      <Checkbox
                        key={channel}
                        value={channel}
                        style={{
                          marginBottom: "8px"
                        }}
                      >
                        {channel}
                      </Checkbox>
                    ))}
                  </div>
                </Checkbox.Group>
              </Form.Item>
            </Card>

            {/* Content Preferences */}
            <Card title="Content Preferences" style={{ marginBottom: 24 }}>
              <Form.Item
                className="custom-placeholder-12px"
                name="contentTypes"
                rules={[{ required: true, message: "Select at least one content type" }]}
              >
                <Checkbox.Group style={{ width: "100%" }}>
                  <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px 16px",
                    justifyContent: "flex-start"
                  }}>
                    {contentTypes.map((type) => (
                      <Checkbox
                        key={type}
                        value={type}
                        style={{
                          minWidth: isMobile ? "100%" : "150px",
                          marginBottom: "8px",
                          flex: isMobile ? "1" : "0 0 auto"
                        }}
                      >
                        {type}
                      </Checkbox>
                    ))}
                  </div>
                </Checkbox.Group>
              </Form.Item>
            </Card>

            {/* Influence Across Buying Stages */}
            <Card title="Influence Across Buying Stages" style={{ marginBottom: 24 }}>
              <Form.Item
                className="custom-placeholder-12px"
                name="buyingStages"
                rules={[{ required: true, message: "Select at least one buying stage" }]}
              >
                <Radio.Group>
                  <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px 16px",
                    justifyContent: "flex-start"
                  }}>
                    {buyingStages.map((stage) => (
                      <Radio
                        key={stage}
                        value={stage}
                        style={{
                          minWidth: isMobile ? "100%" : "180px",
                          marginBottom: "8px",
                          flex: isMobile ? "1" : "0 0 auto"
                        }}
                      >
                        {stage}
                      </Radio>
                    ))}
                  </div>
                </Radio.Group>
              </Form.Item>
            </Card>

            {/* Meeting Cadence & Responsibilities */}
            <Card title="Meeting Cadence & Responsibilities" style={{ marginBottom: 24 }}>
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<Text className="custom-headding-12px">Meeting Cadence</Text>}
                    className="custom-placeholder-12px"
                    name="meetingCadence"
                    rules={[{ required: true, message: "Meeting cadence is required" }]}
                  >
                    <Select
                      size="large"
                      style={{ borderRadius: 8, background: "#fff" }}
                    >
                      {meetingCadence.map((cadence) => (
                        <Option key={cadence} value={cadence}>{cadence}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<Text className="custom-headding-12px">Responsibilities</Text>}
                    className="custom-placeholder-12px"
                  >
                    <Input
                      placeholder="Add a responsibility"
                      size="large"
                      style={{ borderRadius: 8, background: "#fff" }}
                      suffix={
                        <Button
                          type="text"
                          icon={<PlusOutlined />}
                          onClick={() => {
                            const value = personaForm.getFieldValue("responsibilityInput");
                            addResponsibility(value);
                          }}
                        />
                      }
                      name="responsibilityInput"
                      onPressEnter={(e) => {
                        addResponsibility(e.target.value);
                      }}
                    />
                  </Form.Item>
                  <div style={{ marginTop: 8 }}>
                    {responsibilities.map((responsibility, index) => (
                      <span
                        key={index}
                        style={{
                          display: "inline-block",
                          background: "#f0f0f0",
                          padding: "4px 8px",
                          margin: "2px",
                          borderRadius: "4px",
                          fontSize: "12px"
                        }}
                      >
                        {responsibility}
                        <Button
                          type="text"
                          size="small"
                          onClick={() => removeItem(responsibilities, setResponsibilities, index)}
                          style={{ marginLeft: 4, padding: 0 }}
                        >
                          ×
                        </Button>
                      </span>
                    ))}
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Notes */}
            <Card title="Notes" style={{ marginBottom: 24 }}>
              <Form.Item
                className="custom-placeholder-12px"
                name="notes"
              >
                <TextArea
                  placeholder="Additional notes or nuances"
                  rows={4}
                  size="large"
                  style={{
                    resize: "none",
                    borderRadius: 8,
                    background: "#fff"
                  }}
                />
              </Form.Item>
            </Card>

            {/* Form Actions */}
            <Row justify="end" style={{ marginTop: 25 }} gutter={16}>
              <Col>
                {/* <Button
                  // size="large"
                  className="form-button"
                  onClick={() => navigate(-1)}
                  style={{ marginRight: 12 }}
                >
                  Cancel
                </Button> */}
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={personaLoading}
                  // size="large"
                  className="form-button"

                  style={{
                    background: colors.blueAccent[1000],
                    borderColor: colors.blueAccent[1000],
                    color: "#fff",
                    // borderRadius: 8,
                    // minWidth: 120
                  }}
                >
                  Save Persona
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      )}

      {/* Persona Success Screen */}
      {personaSuccess && (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Result
            status="success"
            title="Persona Created Successfully!"
            subTitle="Your B2B customer persona has been saved and is ready to guide your targeting, messaging, and sales motions."
            extra={[
              <Button type="primary" key="continue" onClick={() => navigate(-1)}>
                Continue
              </Button>
            ]}
          />
        </div>
      )}
    </>
  );
};

export default CmForm;
