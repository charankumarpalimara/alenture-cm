// Keep cmInstances branch field in sync with unitValue


import {
  Input,
  Button,
  Row,
  Col,
  Select,
  Typography,
  message,
  // Avatar,
  Collapse,
  Spin,
  Modal,
  Form,
  Result
} from "antd";
// import { CheckCircleTwoTone } from "@ant-design/icons";
// import { CameraOutlined } from "@ant-design/icons";
import ReactCrop from "react-image-crop";
import { Country, State, City } from "country-state-city";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import { Box, useTheme, useMediaQuery, Button as MuiButton } from "@mui/material";
import { tokens } from "../../../theme";
import { getCreaterRole, getCreaterId } from "../../../config";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
// import {  CloseOutlined } from "@ant-design/icons";

// import ReactCrop from "react-image-crop";
// import { heIL } from "@mui/x-data-grid";
// import { Height } from "@mui/icons-material";

// const { Typography } = Typography;

const { Option } = Select;
const { Text } = Typography;
// const { Panel } = Collapse;

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
          New Organization has been created successfully.
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
  const [editingCmIndex, setEditingCmIndex] = useState(null);
  // Get initial data from navigation (organization.jsx sends via state)
  // Place this function after hooks and before return

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery("(max-width: 400px)");
  const isTablet = useMediaQuery("(max-width: 700px)");
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
  const navigate = useNavigate();
  const location = useLocation();
  const countries = Country.getAllCountries();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [unitAddForm, setUnitAddForm] = useState(true)
  const [cmform, setCmform] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);
  const [crmNameList, setCrmNameList] = useState([]);
  const [organizationNames, setOrganizationNames] = useState([]);
  const [branchNames, setBranchNames] = useState([]);

  const [functionList, setFunctionList] = useState([]);
  const [interestList, setInterestList] = useState([]);
  const [interestSearch, setInterestSearch] = useState("");
  const [unitValue, setUnitValue] = useState("");
  //   const location = useLocation();
  // const organizationid = location.state?.orgid;
  // const organizationname = location.state?.organizationname;
  // Keep the Organization Unit field in the Customer Manager form in sync with unitValue
  useEffect(() => {
    if (unitValue && cmForm) {
      cmForm.setFieldsValue({ branch: unitValue });
    }
  }, [unitValue, cmForm]);
  // const countries = Country.getAllCountries();
  // const isMobile = useMediaQuery("(max-width:400px)");

  // Get initial data from navigation (organization.jsx sends via state)
  const organizationid = location.state?.orgid;
  const organizationname = location.state?.organizationname;
  console.log("location.state:", location.state);
  console.log("organizationid:", organizationid);
  const firstBranch = branchesData[0] || {};

  // const industry = firstBranch.industry || "";

  // Update cmInstances when unitValue changes
  useEffect(() => {
    if (unitValue) {
      setCmInstances((prev) => prev.map((cm) => ({ ...cm, branch: unitValue })));
    }
  }, [unitValue]);

  // Debug unitValue changes
  useEffect(() => {
    console.log("unitValue changed to:", unitValue);
  }, [unitValue]);

  // Update CM form fields when unitValue changes
  useEffect(() => {
    if (unitValue && cmInstances.length > 0) {
      const updatedInstances = cmInstances.map(cm => ({
        ...cm,
        branch: unitValue
      }));
      setCmInstances(updatedInstances);
    }
  }, [unitValue]);


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
  // Accepts an optional callback to set unitValue after fetch
  const fetchGetAllData = async (onFetched) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/v1/getOrganizationBranchesByOrgid/${organizationid}`
      );
      const data = await response.json();
      if (response.ok && Array.isArray(data.rows)) {
        setBranchesData(data.rows); // full branch objects

        // Set unitValue to the latest branch (last in array) only once
        if (data.rows.length > 0) {
          const latestBranch = data.rows[data.rows.length - 1];
          if (latestBranch && latestBranch.branch) {
            console.log("Setting unitValue to latest branch:", latestBranch.branch);
            setUnitValue(latestBranch.branch);
          }
        }

        if (typeof onFetched === 'function') {
          onFetched(data.rows);
        }
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
    fetchBranch();
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
        industry: firstBranch.extraind1 || "",
        branch: values.branch,
        branchtype: "Branch",
        phonecode: values.phoneCode,
        mobile: values.PhoneNo,
        email: values.email || "",
        username: (location.state?.organizationname || "").toLowerCase(),
        passwords: values.passwords || "defaultPassword123",
        country: values.country,
        state: values.province,
        district: values.city,
        address: values.address,
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
      // message.success("Unit Registered successfully!");
      // Refresh the data after adding new unit
      fetchGetAllData();
      form.resetFields();
      // Navigate("/organization");
      setUnitAddForm(false);
      setCmform(false);
      setShowSuccess(true);

    } catch (error) {
      if (
        error.response &&
        error.response.status === 409 &&
        error.response.data?.error === "Branch Already Exicist"
      ) {
        message.error(`Unit "${values.branch}" already exists!`);
      } else {
        console.error("Error submitting form data:", error);
        message.error("Error submitting form data");
      }
    } finally {
      setIsLoading(false);
    }
  };







  // const handleCmSubmit = async (values) => {
  //   // setIsLoading(true);
  //   // console.log(crmName);
  //   const formData = new FormData();

  //   // Use the exact field names as in your form and backend
  //   formData.append("firstname", values.firstName || "");
  //   formData.append("lastname", values.lastName || "");
  //   formData.append("phonecode", values.phoneCode || "");
  //   formData.append("mobile", values.PhoneNo || "");
  //   formData.append("email", values.email || "");
  //   formData.append("gender", values.gender || "");
  //   formData.append("designation", values.designation || "");
  //   formData.append("organization", values.organization || "");
  //   formData.append("branch", values.branch || "");
  //   formData.append("username", values.email || "");
  //   formData.append("crmId", values.crmid || "");
  //   formData.append("crmName", values.crmname || "");
  //   // Convert interests array to comma-separated string
  //   formData.append("functionValue", values.function || "");
  //   formData.append("interests", Array.isArray(values.interests) ? values.interests.join(",") : (values.interests || ""));

  //   // const sessionData = JSON.parse(sessionStorage.getItem("hobDetails"));
  //   const createrrole = getCreaterRole();
  //   const createrid = getCreaterId() || "";
  //   const password = (values.firstName || "") + (values.PhoneNo || "");
  //   formData.append("createrrole", createrrole);
  //   formData.append("createrid", createrid);
  //   formData.append("passwords", password);

  //   if (profileImage) {
  //     try {
  //       // Convert base64 to blob if needed
  //       let blob;
  //       if (profileImage.startsWith("data:")) {
  //         const res = await fetch(profileImage);
  //         blob = await res.blob();
  //       } else {
  //         blob = profileImage;
  //       }
  //       formData.append("cmimage", blob, "profileImage.jpg");
  //     } catch (error) {
  //       console.error("Error converting image to blob:", error);
  //     }
  //   }
  //   try {
  //     const responce = await axios.post(
  //       `${process.env.REACT_APP_API_URL}/v1/createCm`,
  //       // `http://127.0.0.1:8080/v1/createCm`,
  //       formData,
  //       {
  //         headers: { "Content-Type": "multipart/form-data" },
  //       }
  //     );
  //     // Modal.success({ content: "CM Registered Successfully!" });
  //     // message.success("CM Registered Successfully!");
  //     // setIsLoading(false);
  //     if (branchesData[1]?.branch) {
  //       setShowSuccess(true); // Show success message
  //     } else {
  //       setShowSuccess(false); // Hide success, show add unit form
  //       setUnitAddForm(true); // Open the unit add form
  //     }
  //     cmForm.resetFields();
  //     setCmform(false); // <-- Fix here
  //     // setShowSuccess(false); // Show success message

  //     // Navigate('/')

  //     // const cmData = responce.data.data || {};
  //     // const FinalCmid = responce.data.cmid || cmData.cmid;

  //     // message.success("CM Registered Successfully!");

  //     // setEditValues({ ...values, profileImage, cmid: FinalCmid }); // <-- set modal values
  //     // setCreatedCmId(FinalCmid);
  //     // setOriginalEditValues({ ...values, profileImage });
  //     // setShowEditModal(true); // <-- open modal
  //     // setIsEditMode(false);

  //   } catch (error) {
  //     // Modal.error({ content: "Error submitting form" });
  //     message.error("Error submitting form");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };



  const handleMultiCmSubmit = async (instances) => {
    setIsLoading(true);
    try {
      for (const cm of instances) {
        const formData = new FormData();
        formData.append("firstname", cm.firstName || "");
        formData.append("lastname", cm.lastName || "");
        formData.append("phonecode", cm.phoneCode || "");
        formData.append("mobile", cm.PhoneNo || "");
        formData.append("email", cm.email || "");
        formData.append("gender", cm.gender || "");
        formData.append("designation", cm.designation || "");
        formData.append("organization", organizationname || "");
        formData.append("branch", unitValue || cm.branch || "");
        formData.append("username", cm.email || "");
        formData.append("crmId", cm.crmid || "");
        formData.append("crmName", cm.crmname || "");
        formData.append("functionValue", cm.function || "");
        formData.append("interests", Array.isArray(cm.interests) ? cm.interests.join(",") : (cm.interests || ""));
        const createrrole = getCreaterRole();
        const createrid = getCreaterId() || "";
        const password = (cm.firstName || "") + (cm.PhoneNo || "");
        formData.append("createrrole", createrrole);
        formData.append("createrid", createrid);
        formData.append("passwords", password);
        if (cm.profileImage && cm.profileImage instanceof File) {
          try {
            console.log('Appending image file:', cm.profileImage);
            formData.append("cmimage", cm.profileImage, cm.profileImage.name);
          } catch (error) {
            console.error("Error appending image file:", error);
          }
        }
        await axios.post(
          `${process.env.REACT_APP_API_URL}/v1/createCm`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }
      setCmform(false);
      setShowSuccess(true);
      setUnitAddForm(false);
      setCmInstances([
        {
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
          interests: [],
          function: "",
          profileImage: null,
        },
      ]);
      // message.success("Customer Managers Registered Successfully!");
    } catch (error) {
      message.error("Error submitting form");
    } finally {
      setIsLoading(false);
    }
  };
  // Removed duplicate handleMultiCmSubmit declaration
  // Multi-add Customer Manager state
  const [cmInstances, setCmInstances] = useState([
    {
      firstName: "",
      lastName: "",
      email: "",
      phoneCode: "",
      PhoneNo: "",
      gender: "",
      designation: "",
      organization: organizationname || "",
      branch: unitValue || "",
      crmid: "",
      crmname: "",
      interests: [],
      function: "",
      country: "",
      province: "",
      city: "",
      profileImage: null,
    }
  ]);


  const handleBack = () => {
    // navigate("/organizationunitadd", { state: { orgid: FinalOrgid, organizationname: values.organization } });
    setShowSuccess(true);
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
            {/* <Box m="15px" sx={{ backgroundColor: "#ffffff", padding: "20px" }}> */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <Text
                className="custom-headding-16px"
                style={{
                  textAlign: isMobile ? "left" : "center",
                  fontSize: isMobile ? "15px" : isTablet ? "17px" : "18px",
                  // paddingLeft: isMobile ? "0px" : "30px",
                }}
              >
                Organization Details
              </Text>
              {/* <Button
                        type="text"
                        icon={<CloseOutlined style={{ fontSize: 20 }} />}
                        onClick={() => navigate(-1)}
                        style={{
                          color: "#3e4396",
                          fontWeight: 600,
                          fontSize: 16,
                          alignSelf: "flex-end",
                          marginLeft: 8,
                        }}
                      /> */}
            </div>

            <Collapse
              accordion
              expandIconPosition="end"
              expandIcon={({ isActive }) =>
                isActive ? <UpOutlined /> : <DownOutlined />
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
                    ? <span>  <Typography.Text strong style={{ fontSize: "16px" }}>{branch.organizationname} </Typography.Text> (Parent) </span>
                    : <span> <Typography.Text strong>{branch.branch}</Typography.Text> (Unit) </span>;
                return (
                  <Collapse.Panel
                    header={panelLabel}
                    key={branch.id || idx}
                  >
                    <Row gutter={16}>
                      <Col xs={24} md={8} style={{ display: "none" }}>
                        <Typography.Text className="custom-placeholder-12px">Organization Name</Typography.Text>
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
                      <Col xs={24} md={8} style={{ display: editData.branchtype === "Parent" ? "none" : "block" }}>
                        <Typography.Text className="custom-headding-12px">Organization Unit</Typography.Text>
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
                        <Typography.Text className="custom-headding-12px">Industry</Typography.Text>
                        <Input
                          value={editData.extraind1}
                          onChange={(e) =>
                            handleBranchInputChange("extraind1", e.target.value)
                          }
                          placeholder="Industry"
                          size="large"
                          disabled={!isEditing}
                          style={{ marginBottom: 12 }}
                        />
                      </Col>
                      <Col xs={24} md={8}>
                        <Typography.Text className="custom-headding-12px" >Phone Code</Typography.Text>
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
                        <Typography.Text className="custom-headding-12px">Mobile</Typography.Text>
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
                        <Typography.Text className="custom-headding-12px">Email</Typography.Text>
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
                        <Typography.Text className="custom-headding-12px">Country</Typography.Text>
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
                        <Typography.Text className="custom-headding-12px">State</Typography.Text>
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
                        <Typography.Text className="custom-headding-12px">District</Typography.Text>
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
                        <Typography.Text className="custom-headding-12px">Postal Code</Typography.Text>
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
                        <Typography.Text className="custom-headding-12px">Date</Typography.Text>
                        <Input
                          value={editData.date}
                          disabled
                          size="large"
                          style={{ marginBottom: 12 }}
                        />
                      </Col>
                      <Col xs={24} md={8}>
                        <Typography.Text className="custom-headding-12px">Time</Typography.Text>
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
                            className="form-button"
                            style={{
                              background: colors.blueAccent[1000],
                              color: "#fff",
                              borderRadius: 8,
                              marginRight: 8,
                            }}
                          >
                            Save
                          </Button>
                          <Button
                            danger
                            onClick={handleBranchCancel}
                            className="form-button"
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <MuiButton
                            variant="contained"
                            onClick={() => handleBranchEdit(idx)}
                            startIcon={<EditIcon />}
                            className="form-button"
                            sx={{
                              background: colors.blueAccent[1000],
                              color: "#fff",
                              borderRadius: "8px",
                              marginRight: "8px",
                            }}
                          >
                            Edit
                          </MuiButton>
                          {getCreaterRole() === "admin" && (
                            <MuiButton
                              // type="outlined"
                              variant="outlined"
                              startIcon={<DeleteIcon />}
                              // size="small"
                              color="error"
                              className="form-button"
                              style={{
                                // backgroundColor: "#3e4396",
                                // color: "#fff",
                                borderRadius: 8,
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
                                      navigate("/organization");
                                    } catch (error) {
                                      message.error("Failed to delete Organization.");
                                    }
                                  },
                                });
                              }}
                            >
                              Delete
                            </MuiButton>


                          )}
                        </>
                      )}
                    </div>
                  </Collapse.Panel>
                );
              })}
            </Collapse>
            {/* {(getCreaterRole() === "admin" || getCreaterRole() === "hob") && ( */}

            {/* {(!unitAddForm && !cmform) && (
              <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", marginTop: 16 }}>
                <Button
                  type="primary"
                  onClick={() => setUnitAddForm(true)}
                  className="form-button"
                  style={{
                    marginTop: 16,
                    background: colors.blueAccent[1000],
                    color: "#fff",
                    borderRadius: 8,
                  }}
                >
                  Add Organization Unit
                </Button>
                <Button
                  type="primary"
                  onClick={() => setCmform(true)}
                  className="form-button"
                  style={{
                    marginTop: 16,
                    background: colors.blueAccent[1000],
                    color: "#fff",
                    borderRadius: 8,
                  }}
                >
                  Add Customer Manager
                </Button>
              </div>
            )} */}
            {/* )} */}

          </Box>

          {/* organization unit add */}
          {/* {unitAddForm && (
            <div style={{ display: "flex", marginTop: 16, alignItems: "left", marginBottom: 16, marginLeft: 16 }}>
              <Typography style={{ fontWeight: "600", fontSize: 14, color: "#2E2E9F" }} >Add Organization Unit</Typography>
            </div>
          )} */}

          <Box sx={{ backgroundColor: "#ffffff", borderRadius: "8px", padding: "24px", margin: "10px", display: unitAddForm ? "block" : "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <Text
                className="custom-headding-16px"
                style={{
                  textAlign: isMobile ? "left" : "center",
                  fontSize: isMobile ? "15px" : isTablet ? "17px" : "18px",
                  // paddingLeft: isMobile ? "0px" : "30px",
                }}
              >
                Create New Organization Unit
              </Text>
              {/* <Button
                        type="text"
                        icon={<CloseOutlined style={{ fontSize: 20 }} />}
                        onClick={() => navigate(-1)}
                        style={{
                          color: "#3e4396",
                          fontWeight: 600,
                          fontSize: 16,
                          alignSelf: "flex-end",
                          marginLeft: 8,
                        }}
                      /> */}
            </div>

            <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
              <Row gutter={16}>
                <Col xs={24} md={8} style={{ display: "none" }}>
                  <Form.Item label="Organization Id" className="custom-placeholder-12px">
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
                  <Form.Item label="Organization Name" className="custom-placeholder-12px">
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
                    label={<span className="custom-headding-12px">Organization Unit</span>}
                    name="branch"
                    rules={[{ required: true, message: "Organization Unit is required" }]}
                    className="custom-placeholder-12px"
                  >
                    <Input
                      placeholder="Organization Unit"
                      size="large"
                      style={{ borderRadius: 8, background: "#fff", fontSize: 16 }}
                      onChange={(e) => {
                        setUnitValue(e.target.value);
                        // Update all CM instances with the new unit value
                        setCmInstances(prev => prev.map(cm => ({
                          ...cm,
                          branch: e.target.value
                        })));
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item
                    label={<Typography.Text className="custom-headding-12px" >Email</Typography.Text>}
                    name="email"
                    className="custom-placeholder-12px"
                    rules={[{ required: true, message: "Organization Unit is required" }]}
                  >
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
                  <Form.Item label={<span className="custom-headding-12px">Phone Number</span>} className="custom-placeholder-12px" required>
                    <Input.Group compact>
                      <Form.Item
                        name="phoneCode"
                        className="custom-placeholder-12px"
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
                        className="custom-placeholder-12px"
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
                    label={<Typography.Text className="custom-headding-12px" >Country</Typography.Text>}
                    name="country"
                    rules={[{ required: true, message: "Country is required" }]}
                    className="custom-placeholder-12px"
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
                    label={<Typography.Text className="custom-headding-12px">State/Province</Typography.Text>}
                    name="province"
                    rules={[{ required: true, message: "State/Province is required" }]}
                    className="custom-placeholder-12px"
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
                    label={<Typography.Text className="custom-headding-12px">City</Typography.Text>}
                    name="city"
                    rules={[{ required: true, message: "City is required" }]}
                    className="custom-placeholder-12px"
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
                    label={<span className="custom-headding-12px">Address</span>}
                    className="custom-placeholder-12px"
                    name="address"
                    rules={[
                      { required: true, message: " Address is required" },
                    ]}
                  >
                    <Input
                      placeholder="Address"
                      size="large"
                      style={{ borderRadius: 8, background: "#fff" }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label={<Typography.Text className="custom-headding-12px" >Postal Code</Typography.Text>}
                    name="postcode"
                    rules={[{ required: true, message: "Postal Code is required" }]}
                    className="custom-placeholder-12px"
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
              {/* <Box display="flex" justifyContent="flex-end" mt="10px" gap="10px">


                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading} // <-- Add this line
                  className="form-button"
                  style={{
                    padding: "12px 24px",
                    // fontSize: "14px",
                    borderRadius: "8px",
                    background: colors.blueAccent[1000],
                    color: "#fff",
                  }}
                >
                  Save
                </Button>
              </Box> */}
            </Form>



            {cmform && (
              <>
                {/* <div style={{ display: "flex", marginTop: 16, alignItems: "left", marginBottom: 16, marginLeft: 16 }}>
                <Typography style={{ fontWeight: "600", fontSize: 14, color: "#2E2E9F" }} >ADD Customer Manager</Typography>
              </div> */}

                <div style={{ background: "#fff", borderRadius: 8, margin: "2px", marginTop: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
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
                    {/* <Button
                        type="text"
                        icon={<CloseOutlined style={{ fontSize: 20 }} />}
                        onClick={() => navigate(-1)}
                        style={{
                          color: "#3e4396",
                          fontWeight: 600,
                          fontSize: 16,
                          alignSelf: "flex-end",
                          marginLeft: 8,
                        }}
                      /> */}
                  </div>
                  {cmInstances.map((cm, idx) => (
                    <div key={idx} style={{ background: "#fff" }}>
                      <Form
                        layout="vertical"
                        initialValues={cm}
                        onValuesChange={(changed, all) => {
                          const updated = [...cmInstances];
                          updated[idx] = { ...updated[idx], ...changed };
                          // Ensure branch field is always synced with unitValue
                          if (unitValue) {
                            updated[idx].branch = unitValue;
                          }
                          setCmInstances(updated);
                        }}
                        validateTrigger={["onChange", "onBlur"]}
                        scrollToFirstError
                        autoComplete="off"
                      >
                        <Row gutter={24}>
                          <Col xs={24} md={8}>
                            <Form.Item label={<Typography.Text className="custom-headding-12px">First Name</Typography.Text>} name="firstName" rules={[{ required: true, message: "First Name is required" }]}>
                              <Input placeholder="First Name" value={cm.firstName} size="large" />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={8}>
                            <Form.Item label={<Typography.Text className="custom-headding-12px">Last Name</Typography.Text>} name="lastName" rules={[{ required: true, message: "Last Name is required" }]}>
                              <Input placeholder="Last Name" value={cm.lastName} size="large" />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={8}>
                            <Form.Item label={<Typography.Text className="custom-headding-12px">Email</Typography.Text>} name="email" rules={[{ required: true, message: "Email is required" }]}>
                              <Input placeholder="Email" value={cm.email} size="large" />
                            </Form.Item>
                          </Col>

                          <Col xs={24} md={8}>
                            <Form.Item label={<Typography.Text className="custom-headding-12px">Phone Number</Typography.Text>} required className="custom-placeholder-12px">
                              <Input.Group compact>
                                <Form.Item
                                  name="phoneCode"
                                  className="custom-placeholder-12px"
                                  noStyle
                                  rules={[{ required: true, message: "Code is required" }]}
                                >
                    <Select
                      showSearch
                      style={{ width: 160 }}
                      placeholder="Code"
                      optionFilterProp="children"
                      size="large"
                      value={cm.phoneCode}
                      onChange={(value) => {
                        const updated = [...cmInstances];
                        updated[idx].phoneCode = value;
                        setCmInstances(updated);
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
                                <Form.Item
                                  name="PhoneNo"
                                  className="custom-placeholder-12px"
                                  noStyle
                                  rules={[
                                    { required: true, message: "Phone number is required" },
                                    { pattern: /^[0-9]+$/, message: "Only numbers allowed" },
                                    { min: 10, message: "At least 10 digits" },
                                  ]}
                                >
                                  <Input
                                    placeholder="Phone Number"
                                    value={cm.PhoneNo}
                                    size="large"
                                    style={{ width: "calc(100% - 160px)" }}
                                  />
                                </Form.Item>
                              </Input.Group>
                            </Form.Item>
                          </Col>



                          <Col xs={24} md={8}>
                            <Form.Item label={<Typography.Text className="custom-headding-12px">Gender</Typography.Text>} name="gender" rules={[{ required: true, message: "Gender is required" }]}>
                              <Select placeholder="Gender" value={cm.gender} size="large">
                                <Select.Option value="Male">Male</Select.Option>
                                <Select.Option value="Female">Female</Select.Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={8} style={{ display: "none" }}>
                            <Form.Item label={<Typography.Text className="custom-headding-12px">Designation</Typography.Text>} name="designation" rules={[{ required: true, message: "Designation is required" }]}>
                              <Input placeholder="Designation" value={cm.designation} />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={8} style={{ display: "none" }}>
                            <Form.Item label={<Typography.Text className="custom-headding-12px">Organization</Typography.Text>} name="organization" rules={[{ required: true, message: "Organization is required" }]}>
                              <Input placeholder="Organization" value={cm.organization} />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={8} style={{ display: "none" }}>
                            <Form.Item label={<Typography.Text className="custom-headding-12px">Branch</Typography.Text>} name="branch" rules={[{ required: true, message: "Branch is required" }]}>
                              <Input
                                placeholder="Organization Unit"
                                value={unitValue || cm.branch}
                                readOnly
                                size="large"
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={8}>
                            <Form.Item label={<Typography.Text className="custom-headding-12px">CRM Name</Typography.Text>} name="crmname">
                              <Select
                                showSearch
                                placeholder="Select Relationship Manager"
                                value={cm.crmname}

                                size="large"
                                onChange={(value) => {
                                  const selected = crmNameList.find(crm => crm.crmid === value);
                                  const updated = [...cmInstances];
                                  updated[idx] = {
                                    ...updated[idx],
                                    crmname: selected ? selected.name : "",
                                    crmid: value
                                  };
                                  setCmInstances(updated);
                                }}
                              >
                                {crmNameList.map((crm) => (
                                  <Select.Option key={crm.crmid} value={crm.crmid}>
                                    {crm.name} ({crm.crmid})
                                  </Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={8}>
                            <Form.Item label={<Typography.Text className="custom-headding-12px">Function</Typography.Text>} name="function" rules={[{ required: true, message: "Function is required" }]}>
                              <Select
                                showSearch
                                placeholder="Select Function"
                                value={cm.function}
                                size="large"
                              >
                                {functionList.map((fn) => (
                                  <Select.Option key={fn} value={fn}>{fn}</Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={8}>
                            <Form.Item label={<Typography.Text className="custom-headding-12px">Interests</Typography.Text>} name="interests" rules={[{ required: true, message: "Interest is required" }]}>
                              <Select
                                mode="multiple"
                                showSearch
                                placeholder="Select Interests"
                                value={cm.interests}
                                size="large"
                              >
                                {interestList.map((interest) => (
                                  <Select.Option key={interest} value={interest}>{interest}</Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={8}>
                            <Form.Item label={<Typography.Text className="custom-headding-12px">Country</Typography.Text>} name="country" rules={[{ required: true, message: "Country is required" }]}>
                              <Select
                                showSearch
                                placeholder="Select Country"
                                value={cm.country}
                                size="large"
                              >
                                {countries.map((c) => (
                                  <Select.Option key={c.isoCode} value={c.name}>{c.name}</Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={8}>
                            <Form.Item label={<Typography.Text className="custom-headding-12px">State/Province</Typography.Text>} name="province" rules={[{ required: true, message: "State/Province is required" }]}>
                              <Select
                                showSearch
                                placeholder="Select State/Province"
                                value={cm.province}
                                disabled={!cm.country}
                                size="large"
                              >
                                {(cm.country
                                  ? State.getStatesOfCountry(
                                    countries.find((c) => c.name === cm.country)?.isoCode || ""
                                  )
                                  : []
                                ).map((s) => (
                                  <Select.Option key={s.isoCode} value={s.name}>{s.name}</Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={8}>
                            <Form.Item label={<Typography.Text className="custom-headding-12px">City</Typography.Text>} name="city" rules={[{ required: true, message: "City is required" }]}>
                              <Select
                                showSearch
                                placeholder="Select City"
                                value={cm.city}
                                disabled={!cm.province}
                                size="large"
                              >
                                {(cm.country && cm.province
                                  ? City.getCitiesOfState(
                                    countries.find((c) => c.name === cm.country)?.isoCode || "",
                                    State.getStatesOfCountry(
                                      countries.find((c) => c.name === cm.country)?.isoCode || ""
                                    ).find((s) => s.name === cm.province)?.isoCode || ""
                                  )
                                  : []
                                ).map((city) => (
                                  <Select.Option key={city.name} value={city.name}>{city.name}</Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={24} style={{ marginBottom: 24 }}>
                          <Col xs={24} md={8}>
                            <Form.Item label={<Typography.Text className="custom-headding-12px">Profile Photo</Typography.Text>} name="profileImage">
                              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                <input
                                  type="file"
                                  accept="image/*"
                                  id={`profile-upload-${idx}`}
                                  onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onload = () => {
                                        setOriginalImage(reader.result);
                                        setCropModalOpen(true);
                                        setEditingCmIndex(idx);
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                  style={{ marginBottom: 8 }}
                                />
                                {cm.profileImage && cm.profileImage.name && (
                                  <span style={{ fontSize: 13, color: '#333' }}>{cm.profileImage.name}</span>
                                )}
                              </div>
                            </Form.Item>
                          </Col>
                          {/* Cropping Modal for Profile Photo */}
                          {cropModalOpen && (
                            <Modal
                              open={cropModalOpen}
                              onCancel={() => setCropModalOpen(false)}
                              footer={null}
                              centered
                              width={400}
                            >
                              <div style={{ textAlign: "center" }}>
                                <h3>Crop Profile Photo</h3>
                                {originalImage && (
                                  <ReactCrop
                                    src={originalImage}
                                    crop={crop}
                                    onChange={setCrop}
                                    onComplete={setCompletedCrop}
                                    aspect={1}
                                  >
                                    <img
                                      ref={imgRef}
                                      alt="Crop"
                                      src={originalImage}
                                      style={{ maxWidth: "100%", maxHeight: 300 }}
                                      onLoad={onImageLoad}
                                    />
                                  </ReactCrop>
                                )}

                                <div style={{ display: "flex", gap: 10, justifyContent: "center", alignItems: "center" }}>
                                  <MuiButton
                                    variant="outlined"
                                    htmlType="submit"
                                    className="form-button"
                                    onClick={() => setCropModalOpen(false)}
                                    color="error"

                                  >
                                    Cancel
                                  </MuiButton>
                                  <MuiButton
                                    variant="contain"
                                    className="form-button"
                                    style={{ background: colors.blueAccent[1000], color: "#fff" }}
                                    onClick={async () => {
                                      if (!completedCrop || !imgRef.current) return;
                                      const image = imgRef.current;
                                      const canvas = document.createElement("canvas");
                                      const scaleX = image.naturalWidth / image.width;
                                      const scaleY = image.naturalHeight / image.height;
                                      canvas.width = completedCrop.width;
                                      canvas.height = completedCrop.height;
                                      const ctx = canvas.getContext("2d");
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
                                      canvas.toBlob((blob) => {
                                        if (blob) {
                                          // Convert blob to File object
                                          const file = new File([blob], `cropped-image-${Date.now()}.jpg`, {
                                            type: 'image/jpeg'
                                          });

                                          const updated = [...cmInstances];
                                          updated[editingCmIndex].profileImage = file;
                                          setCmInstances(updated);
                                          setCropModalOpen(false);
                                          setOriginalImage(null);
                                        }
                                      }, "image/jpeg");
                                    }}
                                  >
                                    Save Cropped Image
                                  </MuiButton>
                                </div>
                              </div>
                            </Modal>
                          )}
                        </Row>
                        {cmInstances.length > 1 && (
                          <Row gutter={24} style={{ marginBottom: cmInstances.length > 1 ? "10px" : "0px" }}>
                            <Col xs={24} md={8}>
                              <MuiButton
                                variant="outlined"
                                color="error"
                                onClick={() => setCmInstances(cmInstances.filter((_, i) => i !== idx))}
                                sx={{ width: "100%" }}
                              >
                                Remove
                              </MuiButton>
                            </Col>
                          </Row>
                        )}
                      </Form>
                    </div>
                  ))}

                  <div style={{ display: "flex", gap: 10, justifyContent: "space" }}>
                    <div style={{ width: "100%" }}>
                      <MuiButton
                        variant="outlined"
                        onClick={() => setCmInstances([
                          ...cmInstances,
                          {
                            firstName: "",
                            lastName: "",
                            email: "",
                            phoneCode: "",
                            PhoneNo: "",
                            gender: "",
                            designation: "",
                            organization: organizationname || "",
                            // branch: "",
                            crmid: "",
                            crmname: "",
                            interests: [],
                            function: "",
                            profileImage: null,
                          },
                        ])}
                        sx={{ border: "1px solid #ccc", backgroundColor: "transparent" }}
                      >
                        + Add Customer Manager
                      </MuiButton>
                    </div>
                    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                      <MuiButton
                        variant="contained"
                        onClick={async () => {
                          setIsLoading(true);
                          try {
                            // Validate Organization Unit form
                            const orgUnitValues = await form.validateFields();
                            await handleFormSubmit(orgUnitValues);
                            // Validate all Customer Manager forms (cmInstances)
                            // (Assume cmInstances are already up to date via onValuesChange)
                            await handleMultiCmSubmit(cmInstances);
                          } catch (err) {
                            // Validation errors are shown by AntD
                          } finally {
                            setIsLoading(false);
                          }
                        }}
                        loading={isLoading}
                        className="form-button"
                        sx={{ background: colors.blueAccent[1000], color: "#fff", borderRadius: "8px" }}
                      >
                        Submit
                      </MuiButton>

                      <MuiButton
                        variant="outlined"
                        color="error"
                        // htmlType="submit"
                        onClick={handleBack}
                        className="form-button"
                        style={{
                          // padding: "12px 24px",
                          // fontSize: "14px",
                          borderRadius: "8px",
                          // background: colors.blueAccent[1000],
                          // color: "#fff",
                        }}
                      >
                        Close
                      </MuiButton>
                    </div>
                  </div>
                </div>


              </>
            )}
          </Box>




        </>
      )}


      {showSuccess && (
        <SuccessScreen background={colors.blueAccent[1000]} onNext={() => navigate("/organizationdetails", { state: { ticket: firstBranch.organizationid } })} />
      )}


    </>
  );
};





export default OrganizationUnitadd;
