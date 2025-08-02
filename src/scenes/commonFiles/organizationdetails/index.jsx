import { Box, Button as MuiButton } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import {
  Input,
  Button,
  Row,
  Col,
  Select,
  Typography,
  message,
  Collapse,
  Spin,
  Divider,
  Avatar,
  Modal
  // Typography
} from "antd";
// import { Country, State, City } from "country-state-city";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { UpOutlined, DownOutlined, UserOutlined, PhoneOutlined, MailOutlined, IdcardOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

import { tokens } from "../../../theme";
import { useTheme, useMediaQuery } from "@mui/material";

import { CloseOutlined } from "@ant-design/icons";





import { getCreaterRole } from "../../../config";

// import { heIL } from "@mui/x-data-grid";
// import { Height } from "@mui/icons-material";

const { Text, Title } = Typography;



// Component 2: CM Details Component
const CmDetailsComponent = ({ selectedCm, colors, isEditingCm, cmEdits, onCmEdit, onCmCancel, onCmSave, onCmDelete, onCmInputChange }) => {
  const [interestList, setInterestList] = useState([]);
  const [interestSearch, setInterestSearch] = useState("");
  const form = useRef();
  useEffect(() => {
    const fetchInterest = async () => {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/v1/GetCmInterest`);
      const data = await res.json();
      setInterestList(data.data || data.interests || []);
    };
    fetchInterest();
  }, []);
  if (!selectedCm) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px',
        backgroundColor: '#fafafa',
        borderRadius: 8,
        border: '1px solid #f0f0f0'
      }}>
        <UserOutlined style={{ fontSize: 48, color: colors.grey[400], marginBottom: 16 }} />
        <Text style={{ fontSize: 16, color: colors.grey[600], display: 'block' }}>
          No Customer Manager data available
        </Text>
      </div>
    );
  }

  const editData = isEditingCm ? cmEdits : selectedCm;
  // Parse interests as array for Select
  const interestsValue = isEditingCm
    ? (Array.isArray(editData.interests || editData.extraind5) ? (editData.interests || editData.extraind5) : (typeof (editData.interests || editData.extraind5) === "string" ? (editData.interests || editData.extraind5).split(",").map(i => i.trim()).filter(Boolean) : []))
    : (typeof (editData.interests || editData.extraind5) === "string" ? (editData.interests || editData.extraind5).split(",").map(i => i.trim()).filter(Boolean) : []);

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: 8,
      border: '1px solid #f0f0f0',
      padding: 16
    }}>
      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Typography.Text className="custom-headding-12px">CM ID</Typography.Text>
          <Input
            value={editData.cmid}
            disabled
            size="large"
            style={{ marginBottom: 12 }}
          />
        </Col>
        <Col xs={24} md={8}>
          <Typography.Text className="custom-headding-12px">First Name</Typography.Text>
          <Input
            value={editData.firstname}
            onChange={(e) => onCmInputChange("firstname", e.target.value)}
            placeholder="First Name"
            size="large"
            disabled={!isEditingCm}
            style={{ marginBottom: 12 }}
          />
        </Col>
        <Col xs={24} md={8}>
          <Typography.Text className="custom-headding-12px">Last Name</Typography.Text>
          <Input
            value={editData.lastname}
            onChange={(e) => onCmInputChange("lastname", e.target.value)}
            placeholder="Last Name"
            size="large"
            disabled={!isEditingCm}
            style={{ marginBottom: 12 }}
          />
        </Col>

        <Col xs={24} md={8}>
          <Typography.Text className="custom-headding-12px">Email</Typography.Text>
          <Input
            value={editData.email}
            onChange={(e) => onCmInputChange("email", e.target.value)}
            placeholder="Email"
            size="large"
            disabled={!isEditingCm}
            style={{ marginBottom: 12 }}
          />
        </Col>
        <Col xs={24} md={8}>
          <Typography.Text className="custom-headding-12px">Phone Code</Typography.Text>
          <Input
            value={editData.phonecode}
            onChange={(e) => onCmInputChange("phonecode", e.target.value)}
            placeholder="Phone Code"
            size="large"
            disabled={!isEditingCm}
            style={{ marginBottom: 12 }}
          />
        </Col>
        <Col xs={24} md={8}>
          <Typography.Text className="custom-headding-12px">Mobile</Typography.Text>
          <Input
            value={editData.mobile}
            onChange={(e) => onCmInputChange("mobile", e.target.value)}
            placeholder="Mobile"
            size="large"
            disabled={!isEditingCm}
            style={{ marginBottom: 12 }}
          />
        </Col>
        {/* <Col xs={24} md={8}>
          <Typography.Text className="custom-headding-12px">Designation</Typography.Text>
          <Input
            value={editData.designation}
            onChange={(e) => onCmInputChange("designation", e.target.value)}
            placeholder="Designation"
            size="large"
            disabled={!isEditingCm}
            style={{ marginBottom: 12 }}
          />
        </Col> */}
        <Col xs={24} md={8}>
          <Typography.Text className="custom-headding-12px">Gender</Typography.Text>
          <Select
            value={editData.extraind2}
            onChange={(value) => onCmInputChange("gender", value)}
            size="large"
            disabled={!isEditingCm}
            style={{ width: "100%", marginBottom: 12 }}
          >
            <Select.Option value="Male">Male</Select.Option>
            <Select.Option value="Female">Female</Select.Option>
            <Select.Option value="Other">Other</Select.Option>
          </Select>
        </Col>
        <Col xs={24} md={8}>
          <Typography.Text className="custom-headding-12px">Function</Typography.Text>
          <Input
            value={editData.extraind4}
            onChange={(e) => onCmInputChange("functionValue", e.target.value)}
            placeholder="Function"
            size="large"
            disabled={!isEditingCm}
            style={{ marginBottom: 12 }}
          />
        </Col>
        <Col xs={24} md={8}>
          <Typography.Text className="custom-headding-12px">Interests</Typography.Text>
          {isEditingCm ? (
            <Select
              mode="tags"
              allowClear
              showSearch
              placeholder="Select Interests"
              className="interests-select"
              size="large"
              style={{ borderRadius: 8, background: "#fff", marginBottom: 12, width: "100%" }}
              optionFilterProp="children"
              value={interestsValue}
              onChange={vals => onCmInputChange("interests", vals)}
              onSearch={setInterestSearch}
              filterOption={false}
              dropdownRender={menu => {
                return menu;
              }}
            >
              {(() => {
                const selected = interestsValue || [];
                return interestList
                  .filter(interest => !selected.includes(interest))
                  .map((interest, idx) => (
                    <Select.Option key={interest} value={interest}>{interest}</Select.Option>
                  ));
              })()}
            </Select>
          ) : (
            <Input
              value={Array.isArray(interestsValue) ? interestsValue.join(", ") : (interestsValue || "")}
              disabled
              size="large"
              style={{ marginBottom: 12 }}
            />
          )}
        </Col>
        {/* <Col xs={24} md={8}>
          <Typography.Text className="custom-headding-12px">CRM</Typography.Text>
          <Input
            value={editData.crmname}
            onChange={(e) => onCmInputChange("crmname", e.target.value)}
            placeholder="CRM"
            size="large"
            disabled={!isEditingCm}
            style={{ marginBottom: 12 }}
          />
        </Col> */}
        <Col xs={24} md={8} style={{ display: "none"}}>
          <Typography.Text className="custom-headding-12px">Username</Typography.Text>
          <Input
            value={editData.username}
            onChange={(e) => onCmInputChange("username", e.target.value)}
            placeholder="Username"
            size="large"
            disabled={!isEditingCm}
            style={{ marginBottom: 12 }}
          />
        </Col>
        <Col xs={24} md={8} style={{ display: "none"}}>
          <Typography.Text className="custom-headding-12px">Password</Typography.Text>
          <Input.Password
            value={editData.passwords}
            onChange={(e) => onCmInputChange("passwords", e.target.value)}
            placeholder="Password"
            size="large"
            disabled={!isEditingCm}
            style={{ marginBottom: 12 }}
          />
        </Col>

         
      </Row>

      {/* CM Action Buttons */}
      <div style={{
        marginTop: 16,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "flex-end",
        gap: "8px"
      }}>
        {isEditingCm ? (
          <>
            <MuiButton
              variant="contained"
              onClick={onCmSave}
              className="form-button"
              sx={{
                background: colors.blueAccent[1000],
                color: "#fff",
                minWidth: 80,
                marginRight: "8px",
              }}
            >
              Save
            </MuiButton>
            <MuiButton
              variant="outlined"
              color="error"
              onClick={onCmCancel}
              className="form-button"
            >
              Cancel
            </MuiButton>
          </>
        ) : (
          <>
            <MuiButton
              variant="contained"
              onClick={onCmEdit}
              className="form-button"
              startIcon={<EditIcon />}
              style={{
                background: colors.blueAccent[1000],
                color: "#fff",
                marginRight: 8,

              }}
            >
              Edit
            </MuiButton>
            {/* {getCreaterRole() === "admin" && (
              <MuiButton
                variant="outlined"
                startIcon={<DeleteIcon />}
                color="error"
                className="form-button"
                onClick={onCmDelete}
              >
                Delete
              </MuiButton>
            )} */}
          </>
        )}
      </div>
    </div>
  );
};

const OrganizationDetails = () => {
  // const [form] = Form.useForm();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery("(max-width: 400px)");
  const isTablet = useMediaQuery("(max-width: 700px)");
  const [isLoading, setIsLoading] = useState(false);
  // const [editMode, setEditMode] = useState(false);
  // const [originalBranch, setOriginalBranch] = useState(null);
  const [branchesData, setBranchesData] = useState([]);
  const [editingBranchIndex, setEditingBranchIndex] = useState(null); // <--- NEW
  const [branchEdits, setBranchEdits] = useState({}); // <--- NEW
  const [cmData, setCmData] = useState([]);
  const [selectedCmByUnit, setSelectedCmByUnit] = useState({}); // Track selected CM for each unit
  const [editingCmIndex, setEditingCmIndex] = useState(null); // Track which CM is being edited
  const [cmEdits, setCmEdits] = useState({}); // Store CM edit data
  const navigate = useNavigate();
  const location = useLocation();
  // const countries = Country.getAllCountries();

  // Get initial data from navigation (organization.jsx sends via state)
  const ticket = location.state?.ticket || {};

  // Handle different data structures passed from different pages
  // Support both object format {id: "ORG_123", organizationid: "ORG_123"} and direct string format
  const oragnizationid = ticket.id || ticket.organizationid || (typeof ticket === 'string' ? ticket : null);

  console.log('Location state:', location.state);
  console.log('Ticket object:', ticket);
  console.log('Ticket.id:', ticket.id);
  console.log('Ticket (fallback):', ticket);
  console.log('Organization ID:', oragnizationid);
  console.log('Organization ID type:', typeof oragnizationid);

  // Fetch CM data for the organization
  const fetchCmData = async () => {
    if (!oragnizationid || oragnizationid === 'undefined' || oragnizationid === 'null') {
      console.log('Organization ID not found or invalid:', oragnizationid);
      return;
    }

    try {
      console.log('Fetching CM data for organization ID:', oragnizationid);

      console.log('Making API request with params:', { organizationid: oragnizationid });

      let response;
      try {
        // Try GET request first (as per router.get)
        response = await axios.get(
          `${process.env.REACT_APP_API_URL}/v1/getCmDataOrganiozations`,
          {
            params: { organizationid: oragnizationid }
          }
        );
        console.log('GET request successful');
      } catch (getError) {
        console.log('GET request failed, trying POST request...');
        // Fallback to POST request if GET fails (backend might expect req.body)
        response = await axios.post(
          `${process.env.REACT_APP_API_URL}/v1/getCmDataOrganiozations`,
          { organizationid: oragnizationid }
        );
        console.log('POST request successful');
      }

      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      if (response.data && response.data.data) {
        setCmData(response.data.data);
        console.log('CM data set:', response.data.data);
        // message.success('Customer Manager data fetched successfully');
      } else {
        setCmData([]);
        console.log('No CM data found');
        // message.error('No Customer Manager data found');
      }
    } catch (error) {
      console.error('Error fetching CM data:', error);

      // Handle different error cases
      if (error.response) {
        // Server responded with error status
        console.log('Error response status:', error.response.status);
        console.log('Error response data:', error.response.data);

        if (error.response.status === 404) {
          console.log('API endpoint not found (404) - check backend route registration');
          message.error('API endpoint not found. Please check backend configuration.');
        } else if (error.response.status === 400) {
          console.log('Bad request (400) - check request parameters');
          console.log('Request params sent:', { organizationid: oragnizationid });
          message.error(`Bad request: ${error.response.data?.error || 'Invalid request parameters'}`);
        } else if (error.response.status === 402) {
          console.log('No Customer Managers found for this organization (402)');
          setCmData([]);
          // Don't show error message for 402 - it's expected when no CMs exist
        } else {
          console.log(`Server error: ${error.response.status}`);
          message.error(`Server error: ${error.response.status}`);
        }
      } else if (error.request) {
        // Network error
        console.log('Network error - server not reachable');
        message.error('Network error - cannot connect to server');
      } else {
        // Other error
        console.log('Error:', error.message);
        message.error('Failed to fetch Customer Manager data');
      }
      setCmData([]);
    }
  };

  useEffect(() => {
    fetchCmData();
  }, [oragnizationid]);

  // Group CM data by branch/unit
  const groupCmByUnit = () => {
    const grouped = {};
    cmData.forEach(cm => {
      const branch = cm.branch || 'Unknown Unit';
      if (!grouped[branch]) {
        grouped[branch] = [];
      }
      grouped[branch].push(cm);
    });
    console.log('Grouped CM data:', grouped);
    return grouped;
  };

  // Handle CM selection for a specific unit
  const handleCmSelect = (unitName, cm) => {
    setSelectedCmByUnit(prev => ({
      ...prev,
      [unitName]: cm
    }));
  };

  // Get CM data for a specific unit
  const getCmDataForUnit = (unitName) => {
    const grouped = groupCmByUnit();
    return grouped[unitName] || [];
  };

  // Handle CM edit
  const handleCmEdit = () => {
    const selectedCm = selectedCmByUnit[Object.keys(selectedCmByUnit)[0]];
    if (selectedCm) {
      setEditingCmIndex(selectedCm.cmid);
      setCmEdits({ ...selectedCm });
    }
  };

  // Handle CM cancel
  const handleCmCancel = () => {
    setEditingCmIndex(null);
    setCmEdits({});
  };

  // Handle CM save
  const handleCmSave = async () => {
    setIsLoading(true);
    try {
      const payload = { ...cmEdits };
      payload.extraind5 = Array.isArray(payload.interests)
  ? payload.interests.join(",")
  : (payload.interests || "");
delete payload.interests;
      await axios.post(
        `${process.env.REACT_APP_API_URL}/v1/updateCmProfileByAdminHobV2`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      // Update local state
      const updatedCmData = cmData.map(cm =>
        cm.cmid === cmEdits.cmid ? { ...cm, ...cmEdits } : cm
      );
      setCmData(updatedCmData);

      // Update selected CM
      setSelectedCmByUnit(prev => {
        const newState = {};
        Object.keys(prev).forEach(unit => {
          if (prev[unit]?.cmid === cmEdits.cmid) {
            newState[unit] = { ...prev[unit], ...cmEdits };
          } else {
            newState[unit] = prev[unit];
          }
        });
        return newState;
      });

      setEditingCmIndex(null);
      setCmEdits({});
      message.success("Customer Manager updated successfully!");
    } catch (error) {
      message.error("Error updating Customer Manager");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle CM delete
  const handleCmDelete = () => {
    const selectedCm = selectedCmByUnit[Object.keys(selectedCmByUnit)[0]];
    if (!selectedCm) return;

    Modal.confirm({
      title: "Are you sure you want to delete this Customer Manager?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await axios.post(
            `${process.env.REACT_APP_API_URL}/v1/deleteCmByAdminAndHob`,
            { cmid: selectedCm.cmid },
            { headers: { "Content-Type": "application/json" } }
          );

          // Remove from local state
          const updatedCmData = cmData.filter(cm => cm.cmid !== selectedCm.cmid);
          setCmData(updatedCmData);

          // Clear selection
          setSelectedCmByUnit({});
          setEditingCmIndex(null);
          setCmEdits({});

          message.success("Customer Manager deleted successfully!");
        } catch (error) {
          message.error("Failed to delete Customer Manager.");
          console.error(error);
        }
      },
    });
  };

  // Handle CM input change
  const handleCmInputChange = (field, value) => {
    setCmEdits((prev) => ({ ...prev, [field]: value }));
  };

  // No longer needed since we're not using a table
  // const cmTableColumns = [];

  // Single branch state

  // Fetch all branches for this organization (full objects)
  useEffect(() => {
    const fetchGetAllData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/v1/getOrganizationBranchesByOrgid/${oragnizationid}`
        );
        const data = await response.json();
        if (response.ok && Array.isArray(data.rows)) {
          setBranchesData(data.rows); // full branch objects
        } else {
          setBranchesData([]);
        }
      } catch (error) {
        setBranchesData([]);
        console.error("Error fetching tickets:", error);
      }
    };
    fetchGetAllData();
  }, [oragnizationid]);


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
      message.success("Branch updated successfully!");
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
      <Box
        mt={4}
        style={{
          padding: "16px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          height: "100%",
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
            Organization
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
            const unitCmData = getCmDataForUnit(branch.branch);
            const selectedCm = selectedCmByUnit[branch.branch];

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
                  <Col xs={24} md={8} style={{ display: editingBranchIndex === idx ? "block" : "none" }}>
                    <Typography.Text className="custom-headding-12px">Organization Name</Typography.Text>
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
                    <Typography.Text className="custom-headding-12px">Branch Type</Typography.Text>
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

                  <Col xs={24} md={8} style={{ display: editData.branchtype === "Parent" ? "none" : "block" }}>
                    <Typography.Text className="custom-headding-12px">Phone Code</Typography.Text>
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
                  <Col xs={24} md={8} style={{ display: editData.branchtype === "Parent" ? "none" : "block" }}>
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
                  <Col xs={24} md={8} style={{ display: editData.branchtype === "Parent" ? "none" : "block" }}>
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

                <div style={{ marginTop: 16, display: "flex", alignItems: "flex-end", justifyContent: "flex-end", gap: "8px" }}>
                  {isEditing ? (
                    <>
                      <MuiButton
                        variant="contained"
                        onClick={() => handleBranchSave(idx)}
                        loading={isLoading}
                        className="form-button"
                        sx={{
                          background: colors.blueAccent[1000],
                          color: "#fff",
                          minWidth: 80,
                          // padding: "5px 15px",
                          marginRight: "8px",
                        }}
                      >
                        Save
                      </MuiButton>
                      <MuiButton
                        variant="outlined"
                        // startIcon={<CloseOutlined />}
                        color="error"
                        onClick={handleBranchCancel}
                        // danger
                        className="form-button"
                      >
                        Cancel
                      </MuiButton>
                    </>
                  ) : (
                    <>

                      {getCreaterRole() === "admin" && (
                        <MuiButton
                          variant="outlined"
                          // size="small"
                          startIcon={<DeleteIcon />}
                          color="error"
                          className="form-button"
                          // sx={{
                          //   minWidth: 120,
                          //   border: "1px solid #bb2124", // Set your desired outline color
                          //   backgroundColor: "transparent", // Ensure no background
                          //   color: "#bb2124", // Match outline color for text
                          //   boxShadow: "none", // Remove any shadow
                          // }}

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
                                  // Navigate("/organization");
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
                      <MuiButton
                        variant="contained"
                        onClick={() => handleBranchEdit(idx)}
                        className="form-button"
                        startIcon={<EditIcon />}
                        style={{
                          background: colors.blueAccent[1000],
                          color: "#fff",
                          // minWidth: 120,
                          marginRight: 8,
                        }}
                      >
                        Edit
                      </MuiButton>

                      {/* Customer Managers Link */}

                    </>
                  )}


                </div>

                <Text className="custom-headding-16px"
                  style={{
                    textAlign: isMobile ? "left" : "center",
                    fontSize: isMobile ? "15px" : isTablet ? "15px" : "16px",
                    paddingLeft: isMobile ? "0px" : "0px",
                  }}
                >
                  Customer Manager(s) :
                </Text>

                {/* Customer Managers Section - Only show for non-Parent units */}
                {editData.branchtype !== "Parent" && (

                  <div style={{ marginTop: 24 }}>


                    {unitCmData.length === 0 ? (
                      <div
                        style={{
                          textAlign: 'center',
                          padding: '40px',
                          backgroundColor: '#fafafa',
                          borderRadius: 8,
                          border: '1px solid #f0f0f0'
                        }}>
                        <UserOutlined style={{ fontSize: 48, color: colors.grey[400], marginBottom: 16 }} />
                        <Text style={{ fontSize: 16, color: colors.grey[600], display: 'block' }}>
                          No Customer Managers found for this unit
                        </Text>
                      </div>
                    ) : (
                      <Box
                        style={{
                          // padding: "16px",
                          // backgroundColor: "#fafafa",
                          borderRadius: "8px",
                          // border: "1px solid #f0f0f0"
                        }}
                      >
                        <Collapse


                          ghost
                          expandIconPosition="end"
                          expandIcon={({ isActive }) =>
                            isActive ? <UpOutlined /> : <DownOutlined />
                          }
                        >
                          {unitCmData.map((cm, cmIndex) => (
                            <React.Fragment key={cm.cmid}>
                              <Collapse.Panel
                                header={
                                  <span>
                                    <Typography.Text strong >
                                      {cm.firstname} {cm.lastname}
                                    </Typography.Text>
                                    {/* <span style={{ fontSize: "14px", color: colors.grey[600], marginLeft: 8 }}>
                                    (CM ID: {cm.cmid})
                                  </span> */}
                                  </span>
                                }
                                key={cm.cmid}
                                style={{
                                  border: "1px solid #f0f0f0",
                                  borderRadius: "8px",
                                  marginBottom: "8px",
                                  backgroundColor: "#f0f0f0",
                                  // opacity:0.7
                                }}
                              >
                                <CmDetailsComponent
                                  selectedCm={cm}
                                  colors={colors}
                                  isEditingCm={editingCmIndex === cm.cmid}
                                  cmEdits={cmEdits}
                                  onCmEdit={() => {
                                    setEditingCmIndex(cm.cmid);
                                    setCmEdits({ ...cm });
                                  }}
                                  onCmCancel={handleCmCancel}
                                  onCmSave={handleCmSave}
                                  // onCmDelete={() => {
                                  //   const selectedCm = cm;
                                  //   Modal.confirm({
                                  //     title: "Are you sure you want to delete this Customer Manager?",
                                  //     content: "This action cannot be undone.",
                                  //     okText: "Yes, Delete",
                                  //     okType: "danger",
                                  //     cancelText: "Cancel",
                                  //     onOk: async () => {
                                  //       try {
                                  //         await axios.post(
                                  //           `${process.env.REACT_APP_API_URL}/v1/deleteCmByAdminAndHob`,
                                  //           { cmid: selectedCm.cmid },
                                  //           { headers: { "Content-Type": "application/json" } }
                                  //         );

                                  //         // Remove from local state
                                  //         const updatedCmData = cmData.filter(c => c.cmid !== selectedCm.cmid);
                                  //         setCmData(updatedCmData);

                                  //         // Clear selection
                                  //         setSelectedCmByUnit({});
                                  //         setEditingCmIndex(null);
                                  //         setCmEdits({});

                                  //         message.success("Customer Manager deleted successfully!");
                                  //       } catch (error) {
                                  //         message.error("Failed to delete Customer Manager.");
                                  //         console.error(error);
                                  //       }
                                  //     },
                                  //   });
                                  // }}
                                  onCmInputChange={handleCmInputChange}
                                />
                              </Collapse.Panel>
                              {/* {cmIndex < unitCmData.length - 1 && (
                              <hr style={{
                                border: 'none',
                                height: '1px',
                                backgroundColor: '#e0e0e0',
                                margin: '16px 0',
                                opacity: 0.6
                              }} />
                            )} */}
                            </React.Fragment>
                          ))}
                        </Collapse>
                      </Box>
                    )}
                  </div>
                )}

                {/* <div style={{ marginTop: 16 }}>
          {isEditing ? (
            <>
              <MuiButton
                variant="contained"
                onClick={() => handleBranchSave(idx)}
                loading={isLoading}
                className="form-button"
                sx={{
                  background: colors.blueAccent[1000],
                  color: "#fff",
                  minWidth: 80,
                  // padding: "5px 15px",
                  marginRight: "8px",
                }}
              >
                Save
              </MuiButton>
              <MuiButton
                variant="outlined"
                // startIcon={<CloseOutlined />}
                color="error"
                onClick={handleBranchCancel}
                // danger
                className="form-button"
              >
                Cancel
              </MuiButton>
            </>
          ) : (
            <>
              <MuiButton
                variant="contained"
                onClick={() => handleBranchEdit(idx)}
                className="form-button"
                startIcon={<EditIcon />}
                style={{
                  background: colors.blueAccent[1000],
                  color: "#fff",
                  // minWidth: 120,
                  marginRight: 8,
                }}
              >
                Edit
              </MuiButton>
              {getCreaterRole() === "admin" && (
                <MuiButton
                  variant="outlined"
                  // size="small"
                  startIcon={<DeleteIcon />}
                  color="error"
                  className="form-button"
                  // sx={{
                  //   minWidth: 120,
                  //   border: "1px solid #bb2124", // Set your desired outline color
                  //   backgroundColor: "transparent", // Ensure no background
                  //   color: "#bb2124", // Match outline color for text
                  //   boxShadow: "none", // Remove any shadow
                  // }}

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
                          // Navigate("/organization");
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
        </div> */}
              </Collapse.Panel>
            );
          })}
        </Collapse >
        {(getCreaterRole() === "admin" || getCreaterRole() === "hob") && (
          <Button
            type="primary"
            onClick={() => {
              // Get organization name from branches data
              const parentBranch = sortedBranches.find(branch => branch.branchtype === "Parent");
              const organizationName = parentBranch?.organizationname || "Unknown Organization";

              console.log("Navigating to organizationadd with:", {
                organizationid: ticket.id,
                organizationname: organizationName
              });

              navigate("/organizationadd", {
                state: {
                  organizationid: ticket.id,
                  organizationname: organizationName,
                },
              });
            }}
            className="form-button"
            style={{
              marginTop: 16,
              background: colors.blueAccent[1000],
              color: "#fff",
              minWidth: 120,
              marginRight: 8,
            }}
          >
            Add New Unit
          </Button>
        )
        }
      </Box >
    </>
  );
};

export default OrganizationDetails;
