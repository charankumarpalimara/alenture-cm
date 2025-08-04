import { Box, Button as MuiButton } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Select,
  Typography,
  message,
  Collapse,
  Spin,
  // Divider,
  // Avatar,
  Modal
  // Typography
} from "antd";
// import { Country, State, City } from "country-state-city";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { UpOutlined, DownOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

import { tokens } from "../../../theme";
import { useTheme, useMediaQuery } from "@mui/material";

import { CloseOutlined } from "@ant-design/icons";
import { Country, State, City } from "country-state-city";





import { getCreaterRole } from "../../../config";

// import { heIL } from "@mui/x-data-grid";
// import { Height } from "@mui/icons-material";

const { Text, Title } = Typography;



// Component 2: CM Details Component
const CmDetailsComponent = ({ selectedCm, colors, isEditingCm, cmEdits, onCmEdit, onCmCancel, onCmSave, onCmDelete, onCmInputChange, form }) => {
  const [interestList, setInterestList] = useState([]);
  const [interestSearch, setInterestSearch] = useState("");
  const [functionList, setFunctionList] = useState([]);
  const countries = Country.getAllCountries();
  useEffect(() => {
    const fetchInterest = async () => {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/v1/GetCmInterest`);
      const data = await res.json();
      setInterestList(data.data || data.interests || []);
    };
    fetchInterest();
  }, []);

  useEffect(() => {
    const fetchFunctions = async () => {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/v1/GetCmFunction`);
      const data = await res.json();
      setFunctionList(data.functions || data.data || []);
    };
    fetchFunctions();
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
  ? (Array.isArray(editData.interests)
      ? editData.interests
      : (typeof editData.extraind5 === "string" && editData.extraind5.length > 0
          ? editData.extraind5.split(",").map(i => i.trim()).filter(Boolean)
          : []))
  : (Array.isArray(selectedCm.interests)
      ? selectedCm.interests
      : (typeof (selectedCm.interests || selectedCm.extraind5) === "string"
          ? (selectedCm.interests || selectedCm.extraind5).split(",").map(i => i.trim()).filter(Boolean)
          : []));

// Debug logging for interests
console.log('CM Details - selectedCm:', selectedCm);
console.log('CM Details - editData:', editData);
console.log('CM Details - interestsValue:', interestsValue);

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: 8,
      border: '1px solid #f0f0f0',
      padding: 16
    }}>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          ...editData,
          interests: interestsValue
        }}
        onValuesChange={(changedValues, allValues) => {
          Object.keys(changedValues).forEach(key => {
            onCmInputChange(key, changedValues[key]);
          });
        }}
      >
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item
              label={<Typography.Text className="custom-headding-12px">CM ID</Typography.Text>}
              name="cmid"
            >
              <Input
                disabled
                size="large"
                style={{ marginBottom: 12 }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label={<Typography.Text className="custom-headding-12px">First Name</Typography.Text>}
              name="firstname"
              rules={[{ required: true, message: "First Name is required" }]}
            >
              <Input
                placeholder="First Name"
                size="large"
                disabled={!isEditingCm}
                style={{ marginBottom: 12 }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label={<Typography.Text className="custom-headding-12px">Last Name</Typography.Text>}
              name="lastname"
              rules={[{ required: true, message: "Last Name is required" }]}
            >
              <Input
                placeholder="Last Name"
                size="large"
                disabled={!isEditingCm}
                style={{ marginBottom: 12 }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label={<Typography.Text className="custom-headding-12px">Email</Typography.Text>}
              name="email"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Please enter a valid email" }
              ]}
            >
              <Input
                placeholder="Email"
                size="large"
                disabled={!isEditingCm}
                style={{ marginBottom: 12 }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label={<Typography.Text className="custom-headding-12px">Phone Number</Typography.Text>}
            >
              <Input.Group compact>
                <Form.Item
                  name="phonecode"
                  noStyle
                  rules={[{ required: true, message: "Phone code is required" }]}
                >
                  {isEditingCm ? (
                    <Select
                      showSearch
                      style={{ width: "40%" }}
                      placeholder="Code"
                      optionFilterProp="children"
                      size="large"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {countries.map((c) => (
                        <Select.Option
                          key={c.isoCode}
                          value={`+${c.phonecode}`}
                        >{`+${c.phonecode}`}</Select.Option>
                      ))}
                    </Select>
                  ) : (
                    <Input
                      disabled
                      style={{ width: "40%" }}
                      size="large"
                    />
                  )}
                </Form.Item>
                <Form.Item
                  name="mobile"
                  noStyle
                  rules={[
                    { required: true, message: "Phone number is required" },
                    { pattern: /^[0-9]+$/, message: "Only numbers are allowed" },
                    { min: 10, message: "Must be at least 10 digits" }
                  ]}
                >
                  <Input
                    style={{ width: "60%" }}
                    placeholder="Phone Number"
                    disabled={!isEditingCm}
                    size="large"
                    onChange={e => {
                      const value = e.target.value;
                      // Only allow numbers
                      if (/^[0-9]*$/.test(value)) {
                        onCmInputChange("mobile", value);
                      }
                    }}
                  />
                </Form.Item>
              </Input.Group>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label={<Typography.Text className="custom-headding-12px">Gender</Typography.Text>}
              name="extraind2"
              rules={[{ required: true, message: "Gender is required" }]}
            >
              <Select
                size="large"
                disabled={!isEditingCm}
                style={{ width: "100%", marginBottom: 12 }}
                placeholder="Select Gender"
              >
                <Select.Option value="Male">Male</Select.Option>
                <Select.Option value="Female">Female</Select.Option>
                <Select.Option value="Other">Other</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label={<Typography.Text className="custom-headding-12px">Function</Typography.Text>}
              name="extraind4"
              rules={[{ required: true, message: "Function is required" }]}
            >
              <Select
                placeholder="Select Function"
                disabled={!isEditingCm}
                size="large"
                showSearch
                optionFilterProp="children"
                style={{ width: "100%", marginBottom: 12 }}
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
              label={<Typography.Text className="custom-headding-12px">Interests</Typography.Text>}
              name="interests"
              rules={[{ required: true, message: "Interests are required" }]}
            >
              <Select
                mode="tags"
                allowClear
                showSearch
                placeholder="Select Interests"
                className="interests-select"
                disabled={!isEditingCm}
                size="large"
                style={{ borderRadius: 8, background: "#fff", marginBottom: 12, width: "100%" }}
                optionFilterProp="children"
                onChange={vals => onCmInputChange("interests", Array.isArray(vals) ? vals : [])}
                onSearch={setInterestSearch}
                filterOption={false}
                dropdownRender={menu => menu}
              >
                {interestList.map((interest, idx) => (
                  <Select.Option key={interest} value={interest}>{interest}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8} style={{ display: "none" }}>
            <Form.Item
              label={<Typography.Text className="custom-headding-12px">Username</Typography.Text>}
              name="username"
            >
              <Input
                placeholder="Username"
                size="large"
                disabled={!isEditingCm}
                style={{ marginBottom: 12 }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8} style={{ display: "none" }}>
            <Form.Item
              label={<Typography.Text className="custom-headding-12px">Password</Typography.Text>}
              name="passwords"
            >
              <Input.Password
                placeholder="Password"
                size="large"
                disabled={!isEditingCm}
                style={{ marginBottom: 12 }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>

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
              onClick={() => {
                form.validateFields().then(() => {
                  onCmSave();
                }).catch(() => {
                  // Validation failed
                });
              }}
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
  const [form] = Form.useForm();
  const [branchForm] = Form.useForm();
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
  // For branch/unit form dropdowns
  const [branchCountries] = useState(Country.getAllCountries());
  const [branchStates, setBranchStates] = useState([]);
  const [branchCities, setBranchCities] = useState([]);

  // Update states when country changes in branch edit
  useEffect(() => {
    if (editingBranchIndex !== null && branchEdits.country) {
      const countryObj = branchCountries.find(c => c.name === branchEdits.country);
      if (countryObj) {
        const states = State.getStatesOfCountry(countryObj.isoCode);
        setBranchStates(states);
        
        // If we have an existing state value, make sure it's valid for the new country
        if (branchEdits.state) {
          const stateExists = states.find(s => s.name === branchEdits.state);
          if (!stateExists) {
            setBranchEdits(prev => ({ ...prev, state: '', district: '' }));
          }
        }
      } else {
        setBranchStates([]);
      }
    } else {
      setBranchStates([]);
    }
  }, [editingBranchIndex, branchEdits.country, branchCountries]);

  // Reset state and city when country changes
  useEffect(() => {
    if (editingBranchIndex !== null && branchEdits.country) {
      // Only reset if the country actually changed
      const currentCountry = sortedBranches[editingBranchIndex]?.country;
      if (currentCountry !== branchEdits.country) {
        setBranchEdits(prev => ({ ...prev, state: '', district: '' }));
      }
    }
    // eslint-disable-next-line
  }, [branchEdits.country]);

  // Update cities when state changes in branch edit
  useEffect(() => {
    if (editingBranchIndex !== null && branchEdits.country && branchEdits.state) {
      const countryObj = branchCountries.find(c => c.name === branchEdits.country);
      const stateObj = branchStates.find(s => s.name === branchEdits.state);
      if (countryObj && stateObj) {
        const cities = City.getCitiesOfState(countryObj.isoCode, stateObj.isoCode);
        setBranchCities(cities);
        
        // If we have an existing district value, make sure it's valid for the new state
        if (branchEdits.district) {
          const cityExists = cities.find(c => c.name === branchEdits.district);
          if (!cityExists) {
            setBranchEdits(prev => ({ ...prev, district: '' }));
          }
        }
      } else {
        setBranchCities([]);
      }
    } else {
      setBranchCities([]);
    }
  }, [editingBranchIndex, branchEdits.country, branchEdits.state, branchCountries, branchStates]);

  // Reset city when state changes
  useEffect(() => {
    if (editingBranchIndex !== null && branchEdits.state) {
      // Only reset if the state actually changed
      const currentState = sortedBranches[editingBranchIndex]?.state;
      if (currentState !== branchEdits.state) {
        setBranchEdits(prev => ({ ...prev, district: '' }));
      }
    }
    // eslint-disable-next-line
  }, [branchEdits.state]);

  // Initialize state and city dropdowns when editing starts
  useEffect(() => {
    if (editingBranchIndex !== null && branchEdits.country) {
      const countryObj = branchCountries.find(c => c.name === branchEdits.country);
      if (countryObj) {
        const states = State.getStatesOfCountry(countryObj.isoCode);
        setBranchStates(states);
        
        if (branchEdits.state) {
          const stateObj = states.find(s => s.name === branchEdits.state);
          if (stateObj) {
            const cities = City.getCitiesOfState(countryObj.isoCode, stateObj.isoCode);
            setBranchCities(cities);
          }
        }
      }
    }
  }, [editingBranchIndex, branchEdits.country, branchCountries]);

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
        console.log('Setting CM data:', response.data.data);
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

  // Refresh CM data periodically to ensure consistency
  useEffect(() => {
    const interval = setInterval(() => {
      if (oragnizationid && oragnizationid !== 'undefined' && oragnizationid !== 'null') {
        fetchCmData();
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [oragnizationid]);

  // Debug logging for cmData changes
  useEffect(() => {
    console.log('CM data updated:', cmData);
  }, [cmData]);

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
      
      // Parse interests properly for editing
      const interestsArray = Array.isArray(selectedCm.interests)
        ? selectedCm.interests
        : (typeof (selectedCm.interests || selectedCm.extraind5) === "string"
            ? (selectedCm.interests || selectedCm.extraind5).split(",").map(i => i.trim()).filter(Boolean)
            : []);
      
      setCmEdits({ 
        ...selectedCm, 
        interests: interestsArray 
      });
    }
  };

  // Handle CM cancel
  const handleCmCancel = () => {
    setEditingCmIndex(null);
    setCmEdits({});
  };

    // Handle CM input change
const handleCmInputChange = (field, value) => {
  if (field === "interests") {
    setCmEdits((prev) => ({ ...prev, interests: Array.isArray(value) ? value : [] }));
  } else if (field === "gender") {
    setCmEdits((prev) => ({ ...prev, extraind2: value }));
  } else if (field === "extraind4") {
    setCmEdits((prev) => ({ ...prev, extraind4: value }));
  } else {
    setCmEdits((prev) => ({ ...prev, [field]: value }));
  }
};


  // Handle CM save
const handleCmSave = async () => {
  setIsLoading(true);
  try {
    const payload = { ...cmEdits };
    
    // Handle interests properly - ensure it's always a string for the API
    if (Array.isArray(cmEdits.interests)) {
      payload.extraind5 = cmEdits.interests.join(",");
    } else if (typeof cmEdits.interests === "string") {
      payload.extraind5 = cmEdits.interests;
    } else {
      payload.extraind5 = "";
    }
    
    // Remove the interests field as it should be stored as extraind5
    delete payload.interests;
    
    console.log('Saving CM with payload:', payload);
    
    await axios.post(
      `${process.env.REACT_APP_API_URL}/v1/updateCmProfileByAdminHobV2`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    // Parse interests array from saved string for local state
    const newInterestsArr = payload.extraind5
      ? payload.extraind5.split(",").map(i => i.trim()).filter(Boolean)
      : [];

    // Update local state with new extraind5 and interests array
    const updatedCmData = cmData.map(cm => {
      if (cm.cmid === cmEdits.cmid) {
        return {
          ...cm,
          ...cmEdits,
          extraind5: payload.extraind5,
          interests: newInterestsArr
        };
      }
      return cm;
    });
    setCmData(updatedCmData);

    // Update selected CM
    setSelectedCmByUnit(prev => {
      const newState = {};
      Object.keys(prev).forEach(unit => {
        if (prev[unit]?.cmid === cmEdits.cmid) {
          newState[unit] = { ...prev[unit], ...cmEdits, extraind5: payload.extraind5, interests: newInterestsArr };
        } else {
          newState[unit] = prev[unit];
        }
      });
      return newState;
    });

    setEditingCmIndex(null);
    setCmEdits({});
    message.success("Customer Manager updated successfully!");
    
    // Refresh CM data to ensure consistency
    setTimeout(() => {
      fetchCmData();
    }, 1000);
  } catch (error) {
    message.error("Error updating Customer Manager");
    console.error(error);
  } finally {
    setIsLoading(false);
  }
};

  // Handle CM delete
  // const handleCmDelete = () => {
  //   const selectedCm = selectedCmByUnit[Object.keys(selectedCmByUnit)[0]];
  //   if (!selectedCm) return;

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
  //         const updatedCmData = cmData.filter(cm => cm.cmid !== selectedCm.cmid);
  //         setCmData(updatedCmData);

  //         // Clear selection
  //         setSelectedCmByUnit({});
  //         setEditingCmIndex(null);
  //         setCmEdits({});

  //         message.success("Customer Manager deleted successfully!");
          
  //         // Refresh CM data to ensure consistency
  //         setTimeout(() => {
  //           fetchCmData();
  //         }, 1000);
  //       } catch (error) {
  //         message.error("Failed to delete Customer Manager.");
  //         console.error(error);
  //       }
  //     },
  //   });
  // };


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
    const branchToEdit = sortedBranches[idx];
    setEditingBranchIndex(idx);
    setBranchEdits({ ...branchToEdit });
    
    // Initialize state and city dropdowns if country exists
    if (branchToEdit.country) {
      const countryObj = branchCountries.find(c => c.name === branchToEdit.country);
      if (countryObj) {
        const states = State.getStatesOfCountry(countryObj.isoCode);
        setBranchStates(states);
        
        if (branchToEdit.state) {
          const stateObj = states.find(s => s.name === branchToEdit.state);
          if (stateObj) {
            const cities = City.getCitiesOfState(countryObj.isoCode, stateObj.isoCode);
            setBranchCities(cities);
          }
        }
      }
    }
  };

  // Handle cancel for a branch
  const handleBranchCancel = () => {
    setEditingBranchIndex(null);
    setBranchEdits({});
    setBranchStates([]);
    setBranchCities([]);
  };

  // Handle save for a branch
  const handleBranchSave = async (idx) => {
    setIsLoading(true);
    try {
      const payload = { ...branchEdits }; // branchEdits should include id
      console.log('Saving branch with payload:', payload);
      
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
      setBranchStates([]);
      setBranchCities([]);
      message.success("Unit updated successfully!");
      
      // Refresh CM data to ensure consistency
      setTimeout(() => {
        fetchCmData();
      }, 1000);
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
  //     message.success("Organization Unit deleted successfully!");
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
            onClick={() => navigate("/organization")}
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
                <Form
                  form={branchForm}
                  layout="vertical"
                  initialValues={editData}
                  onValuesChange={(changedValues, allValues) => {
                    Object.keys(changedValues).forEach(key => {
                      handleBranchInputChange(key, changedValues[key]);
                    });
                  }}
                >
                  <Row gutter={16}>
                    <Col xs={24} md={8} style={{ display: editingBranchIndex === idx &&  editData.branchtype  === "Parent" && isEditing ? "block" : "none" }}>
                      <Form.Item
                        label={<Typography.Text className="custom-headding-12px">Organization Name</Typography.Text>}
                        name="organizationname"
                        rules={[{ required: true, message: "Organization Name is required" }]}
                      >
                        <Input
                          placeholder="Organization Name"
                          size="large"
                          disabled={!isEditing}
                          style={{ marginBottom: 12 }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8} style={{ display: "none" }}>
                      <Form.Item
                        label={<Typography.Text className="custom-headding-12px">Branch Type</Typography.Text>}
                        name="branchtype"
                      >
                        <Select
                          size="large"
                          disabled={!isEditing}
                          style={{ width: "100%", marginBottom: 12 }}
                        >
                          <Select.Option value="Parent">Parent</Select.Option>
                          <Select.Option value="Branch">Branch</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8} style={{ display: editData.branchtype === "Parent" ? "none" : "block" }}>
                      <Form.Item
                        label={<Typography.Text className="custom-headding-12px">Organization Unit</Typography.Text>}
                        name="branch"
                        rules={[{ 
                          required: editData.branchtype !== "Parent", 
                          message: "Organization Unit is required" 
                        }]}
                      >
                        <Input
                          placeholder="Organization Unit"
                          size="large"
                          disabled={!isEditing}
                          style={{ marginBottom: 12 }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item
                        label={<Typography.Text className="custom-headding-12px">Industry</Typography.Text>}
                        name="extraind1"
                        rules={[{ required: true, message: "Industry is required" }]}
                      >
                        <Input
                          placeholder="Industry"
                          size="large"
                          disabled={!isEditing}
                          style={{ marginBottom: 12 }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8} style={{ display: editData.branchtype === "Parent" ? "none" : "block" }}>
                      <Form.Item
                        label={<Typography.Text className="custom-headding-12px">Phone Number</Typography.Text>}
                      >
                        <Input.Group compact>
                          <Form.Item
                            name="phonecode"
                            noStyle
                            rules={[{ 
                              required: editData.branchtype !== "Parent", 
                              message: "Phone code is required" 
                            }]}
                          >
                            <Select
                              showSearch
                              style={{ width: "40%" }}
                              placeholder="Code"
                              optionFilterProp="children"
                              disabled={!isEditing}
                              size="large"
                              filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              }
                            >
                              {Country.getAllCountries().map((c) => (
                                <Select.Option
                                  key={c.isoCode}
                                  value={`+${c.phonecode}`}
                                >{`+${c.phonecode}`}</Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                          <Form.Item
                            name="mobile"
                            noStyle
                            rules={[
                              { required: editData.branchtype !== "Parent", message: "Phone number is required" },
                              { pattern: /^[0-9]+$/, message: "Only numbers are allowed" },
                              { min: 10, message: "Must be at least 10 digits" }
                            ]}
                          >
                            <Input
                              placeholder="Mobile"
                              size="large"
                              disabled={!isEditing}
                              style={{ marginBottom: 12, width: "60%" }}
                              onChange={e => {
                                const value = e.target.value;
                                // Only allow numbers
                                if (/^[0-9]*$/.test(value)) {
                                  handleBranchInputChange("mobile", value);
                                }
                              }}
                            />
                          </Form.Item>
                        </Input.Group>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8} style={{ display: editData.branchtype === "Parent" ? "none" : "block" }}>
                      <Form.Item
                        label={<Typography.Text className="custom-headding-12px">Email</Typography.Text>}
                        name="email"
                        rules={[
                          { required: editData.branchtype !== "Parent", message: "Email is required" },
                          { type: "email", message: "Please enter a valid email" }
                        ]}
                      >
                        <Input
                          placeholder="Email"
                          size="large"
                          disabled={!isEditing}
                          style={{ marginBottom: 12 }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item
                        label={<Typography.Text className="custom-headding-12px">Country</Typography.Text>}
                        name="country"
                        rules={[{ required: true, message: "Country is required" }]}
                      >
                        {isEditing ? (
                          <Select
                            showSearch
                            placeholder="Select Country"
                            size="large"
                            style={{ marginBottom: 12, width: "100%" }}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            {branchCountries.map(c => (
                              <Select.Option key={c.isoCode} value={c.name}>{c.name}</Select.Option>
                            ))}
                          </Select>
                        ) : (
                          <Input
                            disabled
                            size="large"
                            style={{ marginBottom: 12 }}
                          />
                        )}
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item
                        label={<Typography.Text className="custom-headding-12px">State</Typography.Text>}
                        name="state"
                        rules={[{ required: true, message: "State is required" }]}
                      >
                        <Select
                          showSearch
                          placeholder="Select State"
                          disabled={!isEditing}
                          size="large"
                          style={{ marginBottom: 12, width: "100%" }}
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {branchStates.map(s => (
                            <Select.Option key={s.isoCode} value={s.name}>{s.name}</Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item
                        label={<Typography.Text className="custom-headding-12px">District</Typography.Text>}
                        name="district"
                        rules={[{ required: true, message: "District is required" }]}
                      >
                        <Select
                          showSearch
                          placeholder="Select City/District"
                          disabled={!isEditing}
                          size="large"
                          style={{ marginBottom: 12, width: "100%" }}
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {branchCities.map(city => (
                            <Select.Option key={city.name} value={city.name}>{city.name}</Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item
                        label={<Typography.Text className="custom-headding-12px">Postal Code</Typography.Text>}
                        name="postalcode"
                        rules={[
                          { required: true, message: "Postal Code is required" }
                        ]}
                      >
                        <Input
                          placeholder="Postal Code"
                          size="large"
                          disabled={!isEditing}
                          style={{ marginBottom: 12 }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item
                        label={<Typography.Text className="custom-headding-12px">Date</Typography.Text>}
                        name="date"
                      >
                        <Input
                          disabled
                          size="large"
                          style={{ marginBottom: 12 }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item
                        label={<Typography.Text className="custom-headding-12px">Time</Typography.Text>}
                        name="time"
                      >
                        <Input
                          disabled
                          size="large"
                          style={{ marginBottom: 12 }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>

                <div style={{ marginTop: 16, display: "flex", alignItems: "flex-end", justifyContent: "flex-end", gap: "8px" }}>
                  {isEditing ? (
                    <>
                      <MuiButton
                        variant="contained"
                        onClick={() => {
                          branchForm.validateFields().then(() => {
                            handleBranchSave(idx);
                          }).catch(() => {
                            // Validation failed
                          });
                        }}
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
                                  
                                  // Refresh CM data to ensure consistency
                                  setTimeout(() => {
                                    fetchCmData();
                                  }, 1000);
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
                {editData.branchtype !== "Parent" && (
                  <>
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
                                  form={form}
                                  onCmEdit={() => {
                                    setEditingCmIndex(cm.cmid);
                                    
                                    // Parse interests properly for editing
                                    const interestsArray = Array.isArray(cm.interests)
                                      ? cm.interests
                                      : (typeof (cm.interests || cm.extraind5) === "string"
                                          ? (cm.interests || cm.extraind5).split(",").map(i => i.trim()).filter(Boolean)
                                          : []);
                                    
                                    setCmEdits({ 
                                      ...cm, 
                                      interests: interestsArray 
                                    });
                                  }}
                                  onCmCancel={handleCmCancel}
                                  onCmSave={handleCmSave}
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
                  </>
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