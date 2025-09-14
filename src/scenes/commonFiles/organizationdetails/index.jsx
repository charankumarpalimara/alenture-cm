import { Box, Button as MuiButton } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as EyeIcon } from "@mui/icons-material";
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
  Modal,
  Tag,
  Space,
  Table
  // Typography
} from "antd";
// import { Country, State, City } from "country-state-city";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  UpOutlined,
  DownOutlined,
  PlusOutlined,
  MinusOutlined,
  UserOutlined,
  DownloadOutlined,
  EyeOutlined,
  UnorderedListOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  MinusCircleOutlined,
  FilterOutlined,
  BarChartOutlined,
  LineChartOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  TeamOutlined,
  GlobalOutlined,
  ReloadOutlined,
  RiseOutlined
} from "@ant-design/icons";
import { TrendingUp, TrendingDown } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

import { tokens } from "../../../theme";
import { useTheme, useMediaQuery } from "@mui/material";

import { CloseOutlined } from "@ant-design/icons";
import { Country, State, City } from "country-state-city";





import { getCreaterRole } from "../../../config";

// import { heIL } from "@mui/x-data-grid";
// import { Height } from "@mui/icons-material";

const { Text, Title } = Typography;

// Add custom CSS styles for modern collapse
const collapseStyles = `
  .modern-collapse .ant-collapse-item {
    border: none !important;
    margin-bottom: 16px !important;
  }
  
  .modern-collapse .ant-collapse-header {
    background: #ffffff !important;
    border: 1px solid #e8e8e8 !important;
    border-radius: 12px !important;
    padding: 16px 20px !important;
    font-weight: 600 !important;
    color: #1a1a1a !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06) !important;
    transition: all 0.3s ease !important;
  }
  
  .modern-collapse .ant-collapse-header:hover {
    border-color: #d0d0d0 !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
  }
  
  .modern-collapse .ant-collapse-content {
    border: none !important;
    background: transparent !important;
  }
  
  .modern-collapse .ant-collapse-content-box {
    padding: 24px 28px 28px 28px !important;
    background: #ffffff !important;
    border: 1px solid #e8e8e8 !important;
    border-top: none !important;
    border-radius: 0 0 12px 12px !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06) !important;
    margin-top: -1px !important;
  }
  
  .modern-collapse.cm-collapse .ant-collapse-header {
    padding: 12px 16px !important;
    border-radius: 8px !important;
    font-size: 14px !important;
  }
  
  .modern-collapse.cm-collapse .ant-collapse-content-box {
    border-radius: 0 0 8px 8px !important;
    padding: 16px 20px 20px 20px !important;
  }
  
  .modern-collapse .ant-collapse-arrow {
    color: #666666 !important;
    font-size: 12px !important;
  }
  
  /* Form spacing adjustments within collapse */
  .modern-collapse .ant-form-item {
    margin-bottom: 20px !important;
  }
  
  .modern-collapse .ant-form-item:last-child {
    margin-bottom: 8px !important;
  }
  
  .modern-collapse .ant-row {
    margin-bottom: 0 !important;
  }
  
  .modern-collapse .ant-input,
  .modern-collapse .ant-select-selector {
    margin-bottom: 0 !important;
  }
  
  .modern-collapse .ant-col {
    padding: 0 8px !important;
  }
  
  .modern-collapse .ant-col:first-child {
    padding-left: 0 !important;
  }
  
  .modern-collapse .ant-col:last-child {
    padding-right: 0 !important;
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .modern-collapse .ant-collapse-header {
      padding: 12px 16px !important;
      font-size: 14px !important;
    }
    
    .modern-collapse .ant-collapse-content-box {
      padding: 20px 24px 24px 24px !important;
    }
    
    .modern-collapse.cm-collapse .ant-collapse-header {
      padding: 10px 12px !important;
      font-size: 13px !important;
    }
  }
  
  @media (max-width: 480px) {
    .modern-collapse .ant-collapse-header {
      padding: 10px 12px !important;
      font-size: 13px !important;
      border-radius: 8px !important;
    }
    
    .modern-collapse .ant-collapse-content-box {
      padding: 16px 20px 20px 20px !important;
      border-radius: 0 0 8px 8px !important;
    }
    
    .modern-collapse .ant-col {
      padding: 0 4px !important;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = collapseStyles;
  if (!document.head.querySelector('style[data-collapse-styles]')) {
    styleElement.setAttribute('data-collapse-styles', 'true');
    document.head.appendChild(styleElement);
  }
}



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
      backgroundColor: 'transparent',
      borderRadius: 0,
      border: 'none',
      padding: 0,
      margin: 0
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

// Tab Components
const UnitsTab = ({ colors, mobile, tablet }) => (
  <Box>
    {/* ServiceMap Header */}
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography style={{
            textAlign: "left",
            fontSize: mobile ? "15px" : tablet ? "17px" : "18px",
            paddingLeft: "0px",
            fontWeight: "600",
          }}>
            ServiceMap: Journey Matrix
          </Typography>
          <Typography sx={{
            fontSize: '14px',
            color: '#666666'
          }}>
            Map services across customer journey touchpoints
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            icon={<UpOutlined />}
            className="form-button"
            style={{
              background: colors.blueAccent[1000],
              color: "#fff",
              border: 'none',
            }}
          >
            Export
          </Button>
          <MuiButton
            variant="contain"
            className="form-button"
            startIcon={<EditIcon />}
            style={{
              background: colors.blueAccent[1000],
              color: '#fff',
              // fontSize: '11px',
              // background: '#52c41a',
              border: 'none'
            }}
          >
            Edit Matrix
          </MuiButton>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', flexDirection: mobile || tablet ? 'column' : 'row', gap: 3, mb: 4 }}>
        <Box sx={{
          flex: 1,
          p: 3,
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          textAlign: 'left',
          backgroundColor: '#fafafa',
          background: "#eff6ff"
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', mb: 1 }}>
            <UserOutlined style={{ fontSize: '24px', color: '#1890ff', marginRight: '8px' }} />
            <Typography style={{ fontSize: '14px', color: '#666666' }}>
              Total Services
            </Typography>
          </Box>
          <Typography style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a' }}>
            12
          </Typography>
        </Box>
        <Box sx={{
          flex: 1,
          p: 3,
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          textAlign: 'left',
          background: "#effdf4"
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', mb: 1 }}>
            <Box sx={{
              width: '24px',
              height: '24px',
              background: 'linear-gradient(45deg, #1890ff, #52c41a)',
              borderRadius: '4px',
              position: 'relative',
              marginRight: '8px'
            }}>
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '12px',
                height: '12px',
                background: 'white',
                borderRadius: '2px'
              }} />
            </Box>
            <Typography style={{ fontSize: '14px', color: '#666666' }}>
              Journey Stages
            </Typography>
          </Box>
          <Typography style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a' }}>
            6
          </Typography>
        </Box>
        <Box sx={{
          flex: 1,
          p: 3,
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          textAlign: 'left',
          backgroundColor: '#fffbeb'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', mb: 1 }}>
            <Box sx={{
              width: '24px',
              height: '24px',
              background: '#fa8c16',
              borderRadius: '50%',
              position: 'relative',
              marginRight: '8px'
            }}>
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '8px',
                height: '8px',
                background: 'white',
                borderRadius: '50%'
              }} />
            </Box>
            <Typography style={{ fontSize: '14px', color: '#666666' }}>
              Touchpoints
            </Typography>
          </Box>
          <Typography style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a' }}>
            24
          </Typography>
        </Box>
        <Box sx={{
          flex: 1,
          p: 3,
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          textAlign: 'left',
          backgroundColor: '#faf5ff'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', mb: 1 }}>
            <Box sx={{
              width: '24px',
              height: '24px',
              background: '#52c41a',
              borderRadius: '4px',
              position: 'relative',
              marginRight: '8px'
            }}>
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '12px',
                height: '12px',
                background: 'white',
                borderRadius: '2px'
              }} />
            </Box>
            <Typography style={{ fontSize: '14px', color: '#666666' }}>
              Coverage
            </Typography>
          </Box>
          <Typography style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a' }}>
            85%
          </Typography>
        </Box>
      </Box>

      {/* Service-Journey Mapping Matrix */}
      <Box sx={{ mb: 4 }}>
        <Typography style={{ marginBottom: "10px", fontSize: '15px', fontWeight: '600', color: '#1a1a1a' }}>
          Service-Journey Mapping Matrix
        </Typography>

        <Table
          dataSource={[
            {
              key: '1',
              service: 'Marketing Campaigns',
              awareness: 'green',
              consideration: 'green',
              purchase: 'grey',
              onboarding: 'grey',
              usage: 'grey',
              retention: 'orange'
            },
            {
              key: '2',
              service: 'Sales Support',
              awareness: 'orange',
              consideration: 'green',
              purchase: 'orange',
              onboarding: 'grey',
              usage: 'grey',
              retention: 'grey'
            },
            {
              key: '3',
              service: 'Customer Onboarding',
              awareness: 'grey',
              consideration: 'grey',
              purchase: 'orange',
              onboarding: 'green',
              usage: 'green',
              retention: 'green'
            },
            {
              key: '4',
              service: 'Technical Support',
              awareness: 'grey',
              consideration: 'grey',
              purchase: 'orange',
              onboarding: 'green',
              usage: 'green',
              retention: 'green'
            },
            {
              key: '5',
              service: 'Training Services',
              awareness: 'grey',
              consideration: 'orange',
              purchase: 'grey',
              onboarding: 'green',
              usage: 'green',
              retention: 'orange'
            },
            {
              key: '6',
              service: 'Account Management',
              awareness: 'grey',
              consideration: 'grey',
              purchase: 'orange',
              onboarding: 'green',
              usage: 'green',
              retention: 'green'
            }
          ]}
          columns={[
            {
              title: 'Services',
              dataIndex: 'service',
              key: 'service',
              width: mobile ? 120 : 200,
              // fixed: mobile ? 'left' : false,
              render: (text) => (
                <Typography sx={{ fontSize: '11px', color: '#1a1a1a', fontWeight: 'bold' }}>
                  {text}
                </Typography>
              ),
            },
            {
              title: 'Awareness',
              dataIndex: 'awareness',
              key: 'awareness',
              width: mobile ? 80 : 100,
              render: (impact) => (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Box sx={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: impact === 'green' ? '#52c41a' :
                      impact === 'orange' ? '#fa8c16' : '#d9d9d9'
                  }} />
                </Box>
              ),
            },
            {
              title: 'Consideration',
              dataIndex: 'consideration',
              key: 'consideration',
              width: mobile ? 80 : 100,
              render: (impact) => (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Box sx={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: impact === 'green' ? '#52c41a' :
                      impact === 'orange' ? '#fa8c16' : '#d9d9d9'
                  }} />
                </Box>
              ),
            },
            {
              title: 'Purchase',
              dataIndex: 'purchase',
              key: 'purchase',
              width: mobile ? 80 : 100,
              render: (impact) => (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Box sx={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: impact === 'green' ? '#52c41a' :
                      impact === 'orange' ? '#fa8c16' : '#d9d9d9'
                  }} />
                </Box>
              ),
            },
            {
              title: 'Onboarding',
              dataIndex: 'onboarding',
              key: 'onboarding',
              width: mobile ? 80 : 100,
              render: (impact) => (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: impact === 'green' ? '#52c41a' :
                        impact === 'orange' ? '#fa8c16' : '#d9d9d9'
                    }} />
                  </Box>
                </Box>
              ),
            },
            {
              title: 'Usage',
              dataIndex: 'usage',
              key: 'usage',
              width: mobile ? 80 : 100,
              render: (impact) => (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Box sx={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: impact === 'green' ? '#52c41a' :
                      impact === 'orange' ? '#fa8c16' : '#d9d9d9'
                  }} />
                </Box>
              ),
            },
            {
              title: 'Retention',
              dataIndex: 'retention',
              key: 'retention',
              width: mobile ? 80 : 100,
              render: (impact) => (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Box sx={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: impact === 'green' ? '#52c41a' :
                      impact === 'orange' ? '#fa8c16' : '#d9d9d9'
                  }} />
                </Box>
              ),
            }
          ]}
          pagination={false}
          size="small"
          className="custom-ant-table-header"
          rowClassName={() => "custom-row"}
          scroll={{
            x: mobile ? 600 : 800,
            y: mobile ? 400 : undefined
          }}
          style={{
            fontSize: '11px'
          }}
        />

        {/* Legend */}
        <Box sx={{
          mt: 2,
          display: 'flex',
          gap: 3,
          justifyContent: 'center',
          flexDirection: mobile ? 'column' : 'row',
          alignItems: mobile ? 'flex-start' : 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#52c41a' }} />
            <Typography sx={{ fontSize: '11px', color: '#666666' }}>High Impact</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#fa8c16' }} />
            <Typography sx={{ fontSize: '11px', color: '#666666' }}>Medium Impact</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#d9d9d9' }} />
            <Typography sx={{ fontSize: '11px', color: '#666666' }}>Low/No Impact</Typography>
          </Box>
        </Box>
      </Box>


      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexDirection: mobile ? 'column' : 'row' }}>
        {/* Journey Stage Analysis Card */}
        <Box sx={{
          flex: '1 1 50%',
          p: 3,
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <Typography style={{ marginBottom: "5px", fontSize: '15px', fontWeight: '600', color: '#1a1a1a' }}>
            Journey Stage Analysis
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              { stage: 'Awareness', percentage: 75, color: '#1890ff' },
              { stage: 'Consideration', percentage: 83, color: '#52c41a' },
              { stage: 'Purchase', percentage: 67, color: '#722ed1' }
            ].map((item) => (
              <Box key={item.stage} sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ fontSize: '11px', color: '#666666' }}>
                    {item.stage}
                  </Typography>
                  <Typography sx={{ fontSize: '11px', fontWeight: 'bold', color: '#1a1a1a' }}>
                    {item.percentage}%
                  </Typography>
                </Box>
                <Box sx={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <Box sx={{
                    width: `${item.percentage}%`,
                    height: '100%',
                    backgroundColor: item.color,
                    borderRadius: '4px'
                  }} />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Service Coverage Card */}
        <Box sx={{
          flex: '1 1 50%',
          p: 3,
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <Typography style={{ marginBottom: "5px", fontSize: '15px', fontWeight: '600', color: '#1a1a1a' }}>
            Service Coverage
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              { service: 'Technical Support', coverage: 100, color: '#52c41a', backgroundColor: "#f6ffed" },
              { service: 'Account Management', coverage: 83, color: '#52c41a', backgroundColor: "#dcfce6" },
              { service: 'Training Services', coverage: 67, color: '#fa8c16', backgroundColor: "#fef3c7" },
              { service: 'Marketing Campaigns', coverage: 50, color: '#fa8c16', backgroundColor: "#fef3c7" }
            ].map((item) => (
              <Box key={item.service} sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                // p: 2,
                // border: '1px solid #e0e0e0',
                borderRadius: '4px',
                // backgroundColor: '#fafafa' 
              }}>
                <Typography sx={{ fontSize: '11px', color: '#1a1a1a' }}>
                  {item.service}
                </Typography>
                <Box sx={{ backgroundColor: item.backgroundColor, padding: "2px", paddingX: "5px", borderRadius: "5px" }}>
                  <Typography
                    sx={{
                      fontSize: '11px',
                      fontWeight: 'bold',
                      color: item.color,
                      backgroundColor: item.backgroundColor,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '4px',
                      display: 'inline-block'
                    }}>
                    {item.coverage}%
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      {/* Recommendations */}
      <Box>
        <Typography style={{ marginBottom: "5px", fontSize: '15px', fontWeight: '600', color: '#1a1a1a' }}>
          Recommendations
        </Typography>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Box sx={{
            flex: 1,
            p: 3,
            border: '1px solid #ff4d4f',
            borderRadius: '8px',
            backgroundColor: '#fff2f0'
          }}>
            <Typography sx={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#ff4d4f',
              mb: 1
            }}>
              Gap Analysis
            </Typography>
            <Typography sx={{ fontSize: '11px', color: '#666666' }}>
              Purchase stage needs more service support coverage
            </Typography>
          </Box>
          <Box sx={{
            flex: 1,
            p: 3,
            border: '1px solid #52c41a',
            borderRadius: '8px',
            backgroundColor: '#f6ffed'
          }}>
            <Typography sx={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#52c41a',
              mb: 1
            }}>
              Optimization
            </Typography>
            <Typography sx={{ fontSize: '11px', color: '#666666' }}>
              Enhance onboarding touchpoints for consideration phases
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  </Box>
);

const CMsTab = ({ cmData }) => (
  <Box>
    <Typography variant="h6" sx={{ mb: 2, fontSize: '14px', fontWeight: 'bold', color: '#1a1a1a' }}>
      Customer Managers (CMs)
    </Typography>
    <Typography sx={{ fontSize: '11px', color: '#666666', mb: 2 }}>
      Customer Manager details and assignments for this organization.
    </Typography>

    {/* CM Data Display */}
    {cmData.length > 0 ? (
      <Box>
        {cmData.map((cm, index) => (
          <Box key={cm.cmid || index} sx={{
            p: 2,
            mb: 1,
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            backgroundColor: '#f9f9f9'
          }}>
            <Typography sx={{ fontSize: '11px', fontWeight: 'bold', color: '#1a1a1a' }}>
              {cm.firstname} {cm.lastname}
            </Typography>
            <Typography sx={{ fontSize: '11px', color: '#666666' }}>
              Email: {cm.email} | Function: {cm.extraind4 || 'N/A'} | Unit: {cm.branch || 'N/A'}
            </Typography>
          </Box>
        ))}
      </Box>
    ) : (
      <Typography sx={{ fontSize: '11px', color: '#666666', fontStyle: 'italic' }}>
        No Customer Managers found for this organization.
      </Typography>
    )}
  </Box>
);

const ProductServicesTab = () => (
  <Box>
    <Typography variant="h6" sx={{ mb: 2, fontSize: '14px', fontWeight: 'bold', color: '#1a1a1a' }}>
      Product/Services - Marketed
    </Typography>
    <Typography sx={{ fontSize: '11px', color: '#666666' }}>
      Products and services marketed to this organization will be displayed here.
    </Typography>
  </Box>
);

const PartnershipTab = ({ colors, mobile, tablet }) => (
  <Box>
    {/* Partnership Activities Header */}
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography style={{
            textAlign: "left",
            fontSize: mobile ? "15px" : tablet ? "17px" : "18px",
            paddingLeft: "0px",
            fontWeight: "600",
          }}>
            Partnership Activities
          </Typography>
          <Typography sx={{
            fontSize: '15px',
            color: '#666666'
          }}>
            Manage and track all partnership activities to strengthen B2B relationships
          </Typography>
        </Box>
      </Box>

      {/* Activity Filters Card */}
      <Box sx={{
        mb: 4,
        p: 3,
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography style={{ marginBottom: 2, fontSize: '16px', fontWeight: '600', color: '#1a1a1a' }}>
            Activity Filters
          </Typography>
          <MuiButton
            variant="contain"
            // icon={<EditIcon />}
            sx={{
              fontSize: '11px',
              color: '#fff',
              background: colors.blueAccent[1000],
              border: 'none'
            }}
          >
            + New Activity
          </MuiButton>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', gap: 3, width: '100%' }}>
          <Select
            placeholder="All Partners"
            style={{ flex: 1, fontSize: '11px' }}
            size="middle"
          >
            <Select.Option value="all" style={{ fontSize: '11px' }}>All Partners</Select.Option>
            <Select.Option value="techcorp" style={{ fontSize: '11px' }}>TechCorp Solutions</Select.Option>
            <Select.Option value="global" style={{ fontSize: '11px' }}>Global Ventures</Select.Option>
            <Select.Option value="innovation" style={{ fontSize: '11px' }}>Innovation Labs</Select.Option>
          </Select>
          <Select
            placeholder="Activity Type"
            style={{ flex: 1, fontSize: '11px' }}
            size="middle"
          >
            <Select.Option value="all" style={{ fontSize: '11px' }}>All Types</Select.Option>
            <Select.Option value="meeting" style={{ fontSize: '11px' }}>Meeting</Select.Option>
            <Select.Option value="call" style={{ fontSize: '11px' }}>Call</Select.Option>
            <Select.Option value="email" style={{ fontSize: '11px' }}>Email</Select.Option>
            <Select.Option value="event" style={{ fontSize: '11px' }}>Event</Select.Option>
          </Select>
          <Select
            placeholder="Status"
            style={{ flex: 1, fontSize: '11px' }}
            size="middle"
          >
            <Select.Option value="all" style={{ fontSize: '11px' }}>All Status</Select.Option>
            <Select.Option value="completed" style={{ fontSize: '11px' }}>Completed</Select.Option>
            <Select.Option value="scheduled" style={{ fontSize: '11px' }}>Scheduled</Select.Option>
            <Select.Option value="in-progress" style={{ fontSize: '11px' }}>In Progress</Select.Option>
            <Select.Option value="sent" style={{ fontSize: '11px' }}>Sent</Select.Option>
          </Select>
          <Input
            placeholder="01/15/2025"
            style={{ flex: 1, fontSize: '11px' }}
            size="middle"
            suffix={<EditIcon style={{ fontSize: '14px' }} />}
          />
        </Box>
      </Box>

      {/* Activity Summary Cards */}
      <Box sx={{ mb: 4 }}>
        <Typography style={{ marginBottom: "8px", fontSize: '16px', fontWeight: '600', color: '#1a1a1a' }}>
          Activity Summary
        </Typography>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {/* Card 1: Quarterly Review */}
          <Box sx={{
            flex: '1 1 300px',
            p: 3,
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{
                width: '40px',
                height: '40px',
                backgroundColor: '#1890ff',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px'
              }}>
                <EditIcon style={{ color: 'white', fontSize: '20px' }} />
              </Box>
              <Box>
                <Typography style={{ fontSize: '12px', fontWeight: '600', color: '#1a1a1a' }}>
                  Quarterly Review
                </Typography>
                <Typography style={{ fontSize: '12px', color: '#666666' }}>
                  TechCorp Solutions
                </Typography>
              </Box>
            </Box>
            <Tag
              color="default"
              style={{
                fontSize: '11px',
                marginBottom: '12px',
                backgroundColor: '#f5f5f5',
                color: '#666666',
                border: '1px solid #d9d9d9',
                borderRadius: '5px'
              }}
            >
              Completed
            </Tag>
            <Typography sx={{ fontSize: '11px', color: '#666666', mb: '8px', lineHeight: 1.4 }}>
              Reviewed Q4 performance metrics and discussed expansion opportunities for 2025.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '11px', color: '#666666' }}>
                Jan 10, 2025
              </Typography>
              <Typography sx={{ fontSize: '11px', color: '#666666' }}>
                2h duration
              </Typography>
            </Box>
          </Box>

          {/* Card 2: Strategy Call */}
          <Box sx={{
            flex: '1 1 300px',
            p: 3,
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{
                width: '40px',
                height: '40px',
                backgroundColor: '#52c41a',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px'
              }}>
                <UserOutlined style={{ color: 'white', fontSize: '20px' }} />
              </Box>
              <Box>
                <Typography style={{ fontSize: '12px', fontWeight: '600', color: '#1a1a1a' }}>
                  Strategy Call
                </Typography>
                <Typography style={{ fontSize: '12px', color: '#666666' }}>
                  Global Ventures
                </Typography>
              </Box>
            </Box>
            <Tag
              color="default"
              style={{
                fontSize: '11px',
                marginBottom: '12px',
                backgroundColor: '#f5f5f5',
                color: '#666666',
                border: '1px solid #d9d9d9',
                borderRadius: '5px'
              }}
            >
              Scheduled
            </Tag>
            <Typography sx={{ fontSize: '11px', color: '#666666', mb: '8px', lineHeight: 1.4 }}>
              Discuss joint marketing initiatives and co-branding opportunities.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '11px', color: '#666666' }}>
                Jan 18, 2025
              </Typography>
              <Typography sx={{ fontSize: '11px', color: '#666666' }}>
                1h duration
              </Typography>
            </Box>
          </Box>

          {/* Card 3: Trade Show */}
          <Box sx={{
            flex: '1 1 300px',
            p: 3,
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{
                width: '40px',
                height: '40px',
                backgroundColor: '#fa8c16',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px'
              }}>
                <EditIcon style={{ color: 'white', fontSize: '20px' }} />
              </Box>
              <Box>
                <Typography style={{ fontSize: '12px', fontWeight: '600', color: '#1a1a1a' }}>
                  Trade Show
                </Typography>
                <Typography style={{ fontSize: '12px', color: '#666666' }}>
                  Innovation Labs
                </Typography>
              </Box>
            </Box>
            <Tag
              color="default"
              style={{
                fontSize: '11px',
                marginBottom: '12px',
                backgroundColor: '#f5f5f5',
                color: '#666666',
                border: '1px solid #d9d9d9',
                borderRadius: '5px'
              }}
            >
              In Progress
            </Tag>
            <Typography sx={{ fontSize: '11px', color: '#666666', mb: '8px', lineHeight: 1.4 }}>
              Joint booth presentation at Tech Summit 2025 conference.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '11px', color: '#666666' }}>
                Jan 25-27, 2025
              </Typography>
              <Typography sx={{ fontSize: '11px', color: '#666666' }}>
                3 days
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Recent Activities Table */}
      <Box>
        <Typography style={{ marginBottom: "8px", fontSize: '16px', fontWeight: '600', color: '#1a1a1a' }}>
          Recent Activities
        </Typography>
        <Table
          dataSource={[
            {
              key: '1',
              activity: {
                name: 'Partnership Agreement Review',
                description: 'Annual contract renewal discussion',
                icon: '🤝'
              },
              partner: {
                name: 'TechCorp Solutions',
                icon: '👤'
              },
              type: 'Meeting',
              date: 'Jan 15, 2025',
              status: 'Completed'
            },
            {
              key: '2',
              activity: {
                name: 'Follow-up Email',
                description: 'Post-meeting action items and next steps',
                icon: '✉️'
              },
              partner: {
                name: 'Global Ventures',
                icon: '👤'
              },
              type: 'Email',
              date: 'Jan 12, 2025',
              status: 'Sent'
            }
          ]}
          columns={[
            {
              title: 'ACTIVITY',
              dataIndex: 'activity',
              key: 'activity',
              render: (activity) => (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography style={{ marginRight: '8px', fontSize: '11px' }}>
                      {activity.icon}
                    </Typography>
                    <Typography style={{ color: '#1a1a1a', fontSize: '11px' }}>
                      {activity.name}
                    </Typography>
                  </Box>
                  <Typography style={{ color: '#666666', fontSize: '11px' }}>
                    {activity.description}
                  </Typography>
                </Box>
              ),
            },
            {
              title: 'PARTNER',
              dataIndex: 'partner',
              key: 'partner',
              render: (partner) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography style={{ fontSize: '11px', marginRight: '8px' }}>
                    {partner.icon}
                  </Typography>
                  <Typography style={{ color: '#1a1a1a', fontSize: '11px' }}>
                    {partner.name}
                  </Typography>
                </Box>
              ),
            },
            {
              title: 'TYPE',
              dataIndex: 'type',
              key: 'type',
              render: (type) => (
                <Typography style={{ color: '#1a1a1a', fontSize: '11px' }}>
                  {type}
                </Typography>
              ),
            },
            {
              title: 'DATE',
              dataIndex: 'date',
              key: 'date',
              render: (date) => (
                <Typography style={{ color: '#1a1a1a', fontSize: '11px' }}>
                  {date}
                </Typography>
              ),
            },
            {
              title: 'STATUS',
              dataIndex: 'status',
              key: 'status',
              render: (status) => (
                <Tag
                  color="default"
                  style={{
                    backgroundColor: '#f5f5f5',
                    color: '#666666',
                    border: '1px solid #d9d9d9',
                    borderRadius: '5px',
                    fontSize: '11px'
                  }}
                >
                  {status}
                </Tag>
              ),
            },
            {
              title: 'ACTIONS',
              key: 'actions',
              render: () => (
                <Space size="small">
                  <Button
                    type="text"
                    icon={<EyeIcon />}
                    size="small"
                    style={{ fontSize: '11px' }}
                  />
                  <Button
                    type="text"
                    icon={<EditIcon />}
                    size="small"
                    style={{ fontSize: '11px' }}
                  />
                  <Button
                    type="text"
                    icon={<DeleteIcon />}
                    size="small"
                    style={{ fontSize: '11px' }}
                  />
                </Space>
              ),
            },
          ]}
          pagination={false}
          size="small"
          className="custom-ant-table-header"
          rowClassName={() => "custom-row"}
          scroll={{
            x: mobile ? 650 : 800,
            y: mobile ? 400 : undefined
          }}
          style={{
            fontSize: '11px'
          }}
        />
      </Box>
    </Box>
  </Box>
);

const CompetitorTab = ({ colors, mobile, tablet }) => (
  <Box>
    {/* Competitor Analysis Hub Header */}
    <Box sx={{ mb: 4 }}>
      <Box sx={{
        display: 'flex',
        flexDirection: mobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: mobile ? 'flex-start' : 'center',
        mb: 3,
        gap: mobile ? 2 : 0
      }}>
        <Box>
          <Typography style={{ marginBottom: mobile ? '10px' : 2, fontSize: mobile ? "15px" : tablet ? "17px" : "18px", fontWeight: '600', color: '#1a1a1a' }}>
            Competitor Analysis Hub
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: mobile ? 1 : 2, alignItems: 'center' }}>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            className="form-button"
            style={{
              background: colors.blueAccent[1000],
              color: "#fff",
              border: 'none',
            }}
          >
            {mobile ? 'Export' : 'Export Report'}
          </Button>
          <Box sx={{
            width: mobile ? '28px' : '32px',
            height: mobile ? '28px' : '32px',
            backgroundColor: '#f0f0f0',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <UserOutlined style={{ fontSize: mobile ? '14px' : '16px', color: '#666666' }} />
          </Box>
        </Box>
      </Box>

      {/* Main Title */}
      <Box sx={{ mb: 4 }}>
        <Typography style={{
          textAlign: "left",
          fontSize: mobile ? "15px" : tablet ? "17px" : "18px",
          paddingLeft: "0px",
          fontWeight: "600",
        }}>
          B2B Account Competitor Analysis
        </Typography>
        <Typography sx={{
          fontSize: '14px',
          color: '#666666'
        }}>
          Comprehensive activities to analyze competitors and develop strategic insights
        </Typography>
      </Box>

      {/* Summary Metrics Cards */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', gap: mobile ? 2 : 3 }}>
          {/* Active Competitors Card */}
          <Box sx={{
            flex: '1 1 200px',
            p: mobile ? 2 : 3,
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 1 }}>
                <Box sx={{
                  width: '30px',
                  height: '30px',
                  backgroundColor: '#1890ff',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px'
                }}>
                  <EyeOutlined style={{ color: 'white', fontSize: '15px' }} />
                </Box>
                <Typography style={{ fontSize: '14px', fontWeight: 'bold', color: '#1a1a1a' }}>
                  Active Competitors
                </Typography>
              </Box>
              <Box>
                <Typography style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a', textAlign: 'left' }}>
                  12
                </Typography>
                <Typography style={{ fontSize: '12px', color: '#666666' }}>
                  Identified this quarter
                </Typography>
              </Box>
            </Box>

          </Box>

          {/* Analysis Tasks Card */}
          <Box sx={{
            flex: '1 1 200px',
            p: mobile ? 2 : 3,
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 1 }}>
                <Box sx={{
                  width: '30px',
                  height: '30px',
                  backgroundColor: '#52c41a',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px'
                }}>
                  <UnorderedListOutlined style={{ color: 'white', fontSize: '15px' }} />
                </Box>
                <Typography style={{ fontSize: '14px', fontWeight: 'bold', color: '#1a1a1a' }}>
                  Analysis Tasks
                </Typography>
              </Box>
              <Box>
                <Typography style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a', textAlign: 'left' }}>
                  8
                </Typography>
                <Typography style={{ fontSize: '12px', color: '#666666' }}>
                  In progress
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Reports Generated Card */}
          <Box sx={{
            flex: '1 1 200px',
            p: mobile ? 2 : 3,
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 1 }}>
                <Box sx={{
                  width: '30px',
                  height: '30px',
                  backgroundColor: '#fa8c16',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px'
                }}>
                  <FileTextOutlined style={{ color: 'white', fontSize: '15px' }} />
                </Box>
                <Typography style={{ fontSize: '14px', fontWeight: 'bold', color: '#1a1a1a' }}>
                  Reports Generated
                </Typography>
              </Box>
              <Box>
                <Typography style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a', textAlign: 'left' }}>
                  24
                </Typography>
                <Typography style={{ fontSize: '12px', color: '#666666' }}>
                  This month
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Main Content Grid */}
      <Box sx={{ display: 'flex', flexDirection: mobile || tablet ? 'column' : 'row', gap: mobile ? 2 : tablet ? 3 : 4 }}>
        {/* Left Column - Analysis Activities */}
        <Box sx={{ flex: '1' }}>
          <Box sx={{
            p: mobile ? 2 : 3,
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: mobile ? 'flex-start' : 'center',
              mb: 3,
              flexDirection: mobile ? 'column' : 'row',
              gap: mobile ? 1 : 0
            }}>
              <Typography style={{ marginBottom: 2, fontSize: mobile ? '13px' : '15px', fontWeight: '700', color: '#1a1a1a' }}>
                Analysis Activities
              </Typography>
              <Button
                type="primary"
                className="form-button"
                style={{
                  background: colors.blueAccent[1000],
                  color: "#fff",
                  border: 'none',
                }}
              >
                {mobile ? '+ New' : '+ New Activity'}
              </Button>
            </Box>

            {/* Activity Categories */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: mobile ? 2 : 3 }}>
              {/* Market Research & Intelligence */}
              <Box sx={{
                p: 2,
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                backgroundColor: '#fafafa'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography sx={{ fontSize: '11px', fontWeight: '700', color: '#1a1a1a' }}>
                    Market Research & Intelligence
                  </Typography>
                  <Tag color="processing" style={{ fontSize: '10px' }}>In Progress</Tag>
                </Box>
                <Typography style={{ fontSize: '11px', color: '#666666', marginBottom: '16px' }}>
                  Gather comprehensive market data
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '12px' }} />
                    <Typography style={{ fontSize: '11px', color: '#666666' }}>Industry reports analysis</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '12px' }} />
                    <Typography style={{ fontSize: '11px', color: '#666666' }}>Market size evaluation</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MinusCircleOutlined style={{ color: '#d9d9d9', fontSize: '12px' }} />
                    <Typography style={{ fontSize: '11px', color: '#666666' }}>Trend identification</Typography>
                  </Box>
                </Box>
              </Box>

              {/* Competitor Identification */}
              <Box sx={{
                p: 2,
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                backgroundColor: '#fafafa'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography sx={{ fontSize: '11px', fontWeight: '700', color: '#1a1a1a' }}>
                    Competitor Identification
                  </Typography>
                  <Tag color="success" style={{ fontSize: '10px' }}>Completed</Tag>
                </Box>
                <Typography style={{ fontSize: '11px', color: '#666666', marginBottom: '16px' }}>
                  Map direct and indirect competitors
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '12px' }} />
                    <Typography style={{ fontSize: '11px', color: '#666666' }}>Direct competitors mapping</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '12px' }} />
                    <Typography style={{ fontSize: '11px', color: '#666666' }}>Indirect competitors analysis</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '12px' }} />
                    <Typography style={{ fontSize: '11px', color: '#666666' }}>Emerging players research</Typography>
                  </Box>
                </Box>
              </Box>

              {/* Product/Service Analysis */}
              <Box sx={{
                p: 2,
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                backgroundColor: '#fafafa'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography sx={{ fontSize: '11px', fontWeight: '700', color: '#1a1a1a' }}>
                    Product/Service Analysis
                  </Typography>
                  <Tag color="default" style={{ fontSize: '10px' }}>Pending</Tag>
                </Box>
                <Typography style={{ fontSize: '11px', color: '#666666', marginBottom: '16px' }}>
                  Deep dive into competitor offerings
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MinusCircleOutlined style={{ color: '#d9d9d9', fontSize: '12px' }} />
                    <Typography style={{ fontSize: '11px', color: '#666666' }}>Feature comparison matrix</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MinusCircleOutlined style={{ color: '#d9d9d9', fontSize: '12px' }} />
                    <Typography style={{ fontSize: '11px', color: '#666666' }}>Pricing strategy analysis</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MinusCircleOutlined style={{ color: '#d9d9d9', fontSize: '12px' }} />
                    <Typography style={{ fontSize: '11px', color: '#666666' }}>Value proposition mapping</Typography>
                  </Box>
                </Box>
              </Box>

              {/* Marketing & Sales Strategy */}
              <Box sx={{
                p: 2,
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                backgroundColor: '#fafafa'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography sx={{ fontSize: '11px', fontWeight: '700', color: '#1a1a1a' }}>
                    Marketing & Sales Strategy
                  </Typography>
                  <Tag color="processing" style={{ fontSize: '10px' }}>In Progress</Tag>
                </Box>
                <Typography style={{ fontSize: '11px', color: '#666666', marginBottom: '16px' }}>
                  Analyze competitor go-to-market approach
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '12px' }} />
                    <Typography style={{ fontSize: '11px', color: '#666666' }}>Digital presence audit</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Right Column */}
        <Box sx={{ flex: '1', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Competitor Profiles */}
          <Box sx={{
            p: mobile ? 2 : 3,
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: mobile ? 'flex-start' : 'center',
              mb: 3,
              flexDirection: mobile ? 'column' : 'row',
              gap: mobile ? 1 : 0
            }}>
              <Typography style={{ marginBottom: 2, fontSize: mobile ? '13px' : '15px', fontWeight: '700', color: '#1a1a1a' }}>
                Competitor Profiles
              </Typography>
              <Button
                icon={<FilterOutlined />}
                style={{
                  fontSize: mobile ? '10px' : '11px',
                  border: '1px solid #d9d9d9',
                  padding: mobile ? '4px 8px' : undefined
                }}
              >
                Filter
              </Button>
            </Box>

            {/* Individual Profiles */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: mobile ? 2 : 3 }}>
              {/* Acme Corporation */}
              <Box sx={{
                p: 2,
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                backgroundColor: '#fafafa'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography sx={{ fontSize: '11px', fontWeight: '700', color: '#1a1a1a' }}>
                    Acme Corporation
                  </Typography>
                  <Tag color="blue" style={{ fontSize: '10px' }}>Direct Competitor</Tag>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DollarOutlined style={{ color: '#666666', fontSize: '12px' }} />
                    <Typography style={{ fontSize: '11px', color: '#666666' }}>$2.5B Revenue</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TeamOutlined style={{ color: '#666666', fontSize: '12px' }} />
                    <Typography style={{ fontSize: '11px', color: '#666666' }}>500+ Employees</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GlobalOutlined style={{ color: '#666666', fontSize: '12px' }} />
                    <Typography style={{ fontSize: '11px', color: '#666666' }}>North America</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography style={{ fontSize: '11px', color: '#666666' }}>
                    Market Share: <span style={{ fontWeight: '600', color: '#1a1a1a' }}>23%</span>
                  </Typography>
                  <Typography style={{ fontSize: '10px', color: '#999999' }}>
                    Jan 15, 2025
                  </Typography>
                </Box>
              </Box>

              {/* TechSolutions Inc */}
              <Box sx={{
                p: 2,
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                backgroundColor: '#fafafa'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography sx={{ fontSize: '11px', fontWeight: '700', color: '#1a1a1a' }}>
                    TechSolutions Inc
                  </Typography>
                  <Tag color="orange" style={{ fontSize: '10px' }}>Indirect Competitor</Tag>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DollarOutlined style={{ color: '#666666', fontSize: '12px' }} />
                    <Typography style={{ fontSize: '11px', color: '#666666' }}>$1.8B Revenue</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TeamOutlined style={{ color: '#666666', fontSize: '12px' }} />
                    <Typography style={{ fontSize: '11px', color: '#666666' }}>350+ Employees</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GlobalOutlined style={{ color: '#666666', fontSize: '12px' }} />
                    <Typography style={{ fontSize: '11px', color: '#666666' }}>Global</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography style={{ fontSize: '11px', color: '#666666' }}>
                    Market Share: <span style={{ fontWeight: '600', color: '#1a1a1a' }}>18%</span>
                  </Typography>
                  <Typography style={{ fontSize: '10px', color: '#999999' }}>
                    Jan 12, 2025
                  </Typography>
                </Box>

                {/* InnovatePro */}

              </Box>
              <Box sx={{
                p: 2,
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                backgroundColor: '#fafafa'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography sx={{ fontSize: '11px', fontWeight: '700', color: '#1a1a1a' }}>
                    InnovatePro
                  </Typography>
                  <Tag color="green" style={{ fontSize: '10px' }}>Emerging Player</Tag>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DollarOutlined style={{ color: '#666666', fontSize: '12px' }} />
                    <Typography style={{ fontSize: '11px', color: '#666666' }}>$450M Revenue</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TeamOutlined style={{ color: '#666666', fontSize: '12px' }} />
                    <Typography style={{ fontSize: '11px', color: '#666666' }}>150+ Employees</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GlobalOutlined style={{ color: '#666666', fontSize: '12px' }} />
                    <Typography style={{ fontSize: '11px', color: '#666666' }}>Europe</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography style={{ fontSize: '11px', color: '#666666' }}>
                    Market Share: <span style={{ fontWeight: '600', color: '#1a1a1a' }}>8%</span>
                  </Typography>
                  <Typography style={{ fontSize: '10px', color: '#999999' }}>
                    Jan 10, 2025
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Quick Analysis Tools */}
            <Box sx={{
              p: mobile ? 2 : 3,
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              marginTop: '20px'
            }}>
              <Typography style={{ marginBottom: 2, fontSize: mobile ? '13px' : '15px', fontWeight: '700', color: '#1a1a1a', mb: 3 }}>
                Quick Analysis Tools
              </Typography>
              <Box sx={{
                display: 'flex',
                justifyContent: mobile || tablet ? 'flex-start' : 'space-between',
                flexDirection: mobile || tablet ? 'column' : 'row',
                gap: mobile || tablet ? 2 : 1,
                flexWrap: mobile ? 'nowrap' : 'wrap'
              }}>
                <Button
                  icon={<BarChartOutlined />}
                  style={{
                    fontSize: mobile ? '10px' : '11px',
                    border: '1px solid #d9d9d9',
                    padding: mobile ? '6px 12px' : undefined,
                    width: mobile ? '100%' : 'auto'
                  }}
                >
                  SWOT Analysis
                </Button>
                <Button
                  icon={<LineChartOutlined />}
                  style={{
                    fontSize: mobile ? '10px' : '11px',
                    border: '1px solid #d9d9d9',
                    padding: mobile ? '6px 12px' : undefined,
                    width: mobile ? '100%' : 'auto'
                  }}
                >
                  Trend Analysis
                </Button>
                <Button
                  icon={<EnvironmentOutlined />}
                  style={{
                    fontSize: mobile ? '10px' : '11px',
                    border: '1px solid #d9d9d9',
                    padding: mobile ? '6px 12px' : undefined,
                    width: mobile ? '100%' : 'auto'
                  }}
                >
                  Position Map
                </Button>
                <Button
                  icon={<FileTextOutlined />}
                  style={{
                    fontSize: mobile ? '10px' : '11px',
                    border: '1px solid #d9d9d9',
                    padding: mobile ? '6px 12px' : undefined,
                    width: mobile ? '100%' : 'auto'
                  }}
                >
                  Report Builder
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  </Box>
);

const BusinessValueTab = ({ colors, mobile, tablet, cards, bigtablet }) => (
  <Box>
    {/* Value Generated Analytics Header */}
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: mobile || tablet ? 'column' : 'row', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography
            style={{
              textAlign: "left",
              fontSize: mobile ? "15px" : tablet ? "17px" : "18px",
              paddingLeft: "0px",
              fontWeight: "600",
              color: '#1a1a1a'
            }}

          >
            Value Generated Analytics
          </Typography>
          <Typography sx={{
            fontSize: '14px',
            color: '#666666'
          }}>
            Track and measure the value delivered to your B2B customers
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mt: mobile ? 2 : 0 }}>
          <Select
            defaultValue="Last 30 days"
            style={{ width: 120, fontSize: '11px' }}
            size="middle"
          >
            <Select.Option value="7days" style={{ fontSize: '11px' }}>Last 7 days</Select.Option>
            <Select.Option value="30days" style={{ fontSize: '11px' }}>Last 30 days</Select.Option>
            <Select.Option value="90days" style={{ fontSize: '11px' }}>Last 90 days</Select.Option>
            <Select.Option value="1year" style={{ fontSize: '11px' }}>Last year</Select.Option>
          </Select>
          <Button
            className="form-button"
            type="primary"
            icon={<DownloadOutlined />}
            style={{
              background: colors.blueAccent[1000],
              color: "#fff",
              border: 'none'
            }}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', flexDirection: mobile || tablet ? 'column' : 'row', gap: 3, mb: 4 }}>
        {/* Total Value Generated Card */}
        <Box sx={{
          flex: 1,
          p: 3,
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          textAlign: 'left',
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{
              width: '40px',
              height: '40px',
              backgroundColor: '#dcfce6',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px'
            }}>
              <DollarOutlined style={{ color: '#3bb468', fontSize: '20px' }} />
            </Box>
            <Box sx={{ backgroundColor: "#dcfce6", padding: "4px 8px", borderRadius: "4px" }}>
              <Typography style={{ fontSize: '11px', color: '#3bb468', fontWeight: '600' }}>
                +19.2%
              </Typography>
            </Box>
          </Box>
          <Typography style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a', mb: 1 }}>
            $2.4M
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography style={{ fontSize: '12px', color: '#666666' }}>
              Total Value Generated
            </Typography>
          </Box>
        </Box>

        {/* Avg Value per Customer Card */}
        <Box sx={{
          flex: 1,
          p: 3,
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          textAlign: 'left',
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{
              width: '40px',
              height: '40px',
              backgroundColor: '#dbeafe',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px'
            }}>
              <UserOutlined style={{ color: '#3670ed', fontSize: '20px' }} />
            </Box>
            <Box sx={{ backgroundColor: "#dbeafe", padding: "4px 8px", borderRadius: "4px" }}>
              <Typography style={{ fontSize: '11px', color: '#3670ed', fontWeight: '600' }}>
                +8.3%
              </Typography>
            </Box>
          </Box>
          <Typography style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a', mb: 1 }}>
            $185K
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>

            <Typography style={{ fontSize: '12px', color: '#666666' }}>
              Avg Value per Customer
            </Typography>
          </Box>
        </Box>

        {/* Average ROI Card */}
        <Box sx={{
          flex: 1,
          p: 3,
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          textAlign: 'left',
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{
              width: '40px',
              height: '40px',
              backgroundColor: '#f3e8ff',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px'
            }}>
              <BarChartOutlined style={{ color: '#9334e9', fontSize: '20px' }} />
            </Box>
            <Box sx={{ backgroundColor: "#f3e8ff", padding: "4px 8px", borderRadius: "4px" }}>
              <Typography style={{ fontSize: '11px', color: '#9334e9', fontWeight: '600' }}>
                -2.1%
              </Typography>
            </Box>
          </Box>
          <Typography style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a', mb: 1 }}>
            4.2x
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>

            <Typography style={{ fontSize: '12px', color: '#666666' }}>
              Average ROI
            </Typography>
          </Box>
        </Box>

        {/* Value Satisfaction Score Card */}
        <Box sx={{
          flex: 1,
          p: 3,
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          textAlign: 'left',
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{
              width: '40px',
              height: '40px',
              backgroundColor: '#ffedd5',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px'
            }}>
              <CheckCircleOutlined style={{ color: '#ea580b', fontSize: '20px' }} />
            </Box>
            <Box sx={{ backgroundColor: "#ffedd5", padding: "4px 8px", borderRadius: "4px" }}>
              <Typography style={{ fontSize: '11px', color: '#ea580b', fontWeight: '600' }}>
                +5.2%
              </Typography>
            </Box>
          </Box>
          <Typography style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a', mb: 1 }}>
            8.7
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>

            <Typography style={{ fontSize: '12px', color: '#666666' }}>
              Value Satisfaction Score
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Main Content Grid */}
      <Box sx={{ display: 'flex', flexDirection: mobile || bigtablet ? 'column' : 'row', gap: 4, mb: 4 }}>
        {/* Left Column - Value Generation Trend */}
        <Box sx={{ flex: '2' }}>
          <Box sx={{
            p: 3,
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a' }}>
                Value Generation Trend
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" className="form-button" style={{
                  background: colors.blueAccent[1000],
                  color: "#fff",
                  border: 'none',
                }}>Monthly</Button>
                <Button size="small" type="primary" className="form-button" style={{
                  background: colors.blueAccent[1000],
                  color: "#fff",
                  border: 'none',
                }}>Quarterly</Button>
              </Box>
            </Box>

            {/* Chart Area - Line Chart */}
            <Box sx={{
              height: '300px',
              background: '#ffffff',
              borderRadius: '8px',
              position: 'relative',
              border: '1px solid #f0f0f0',
              padding: '20px'
            }}>
              {/* Y-axis labels */}
              <Box sx={{
                position: 'absolute',
                left: '10px',
                top: '20px',
                bottom: '40px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                width: '30px'
              }}>
                {['50K', '40K', '30K', '20K', '10K', '0'].map((label) => (
                  <Typography key={label} style={{ fontSize: '11px', color: '#666666' }}>
                    {label}
                  </Typography>
                ))}
              </Box>

              {/* Chart Grid Lines */}
              <Box sx={{
                position: 'absolute',
                left: '50px',
                right: '20px',
                top: '20px',
                bottom: '40px'
              }}>
                {[0, 1, 2, 3, 4, 5].map((line) => (
                  <Box key={line} sx={{
                    position: 'absolute',
                    top: `${line * 20}%`,
                    left: 0,
                    right: 0,
                    height: '1px',
                    backgroundColor: '#f5f5f5'
                  }} />
                ))}
              </Box>

              {/* Line Chart Area */}
              <Box sx={{
                position: 'absolute',
                left: '50px',
                right: '20px',
                top: '20px',
                bottom: '40px',
                overflow: 'hidden'
              }}>
                {/* Gradient Fill Area */}
                <Box sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '70%',
                  background: 'linear-gradient(180deg, rgba(24, 144, 255, 0.2) 0%, rgba(24, 144, 255, 0.05) 100%)',
                  clipPath: 'polygon(0% 60%, 15% 45%, 30% 55%, 45% 35%, 60% 40%, 75% 25%, 90% 30%, 100% 20%, 100% 100%, 0% 100%)'
                }} />

                {/* Line Path */}
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '40%',
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: colors.blueAccent[1000],
                    clipPath: 'polygon(0% 60%, 15% 45%, 30% 55%, 45% 35%, 60% 40%, 75% 25%, 90% 30%, 100% 20%)'
                  }
                }} />

                {/* Data Points */}
                {[
                  { x: '0%', y: '60%' },
                  { x: '15%', y: '45%' },
                  { x: '30%', y: '55%' },
                  { x: '45%', y: '35%' },
                  { x: '60%', y: '40%' },
                  { x: '75%', y: '25%' },
                  { x: '90%', y: '30%' }
                ].map((point, index) => (
                  <Box key={index} sx={{
                    position: 'absolute',
                    left: point.x,
                    top: point.y,
                    width: '8px',
                    height: '8px',
                    backgroundColor: colors.blueAccent[1000],
                    borderRadius: '50%',
                    border: '2px solid white',
                    transform: 'translate(-50%, -50%)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }} />
                ))}
              </Box>

              {/* X-axis labels */}
              <Box sx={{
                position: 'absolute',
                bottom: '10px',
                left: '50px',
                right: '20px',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month) => (
                  <Typography key={month} style={{ fontSize: '11px', color: '#666666' }}>
                    {month}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Right Column - Top Value Customers */}
        <Box sx={{ flex: '1' }}>
          <Box sx={{
            p: 3,
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a' }}>
                Top Value Customers
              </Typography>
            </Box>

            {/* Customer List */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Acme Corp */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                // border: '1px solid #e0e0e0',
                borderRadius: '6px',
                backgroundColor: '#fafafa'
              }}>
                <Box sx={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#1890ff',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px'
                }}>
                  <Typography style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>
                    A
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography style={{ fontSize: '12px', fontWeight: '600', color: '#1a1a1a' }}>
                    Acme Corp
                  </Typography>
                  <Typography style={{ fontSize: '11px', color: '#666666' }}>
                    Enterprise
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography style={{ fontSize: '12px', fontWeight: '600', color: '#1a1a1a' }}>
                    $450K
                  </Typography>
                  <Typography style={{ fontSize: '10px', color: '#52c41a' }}>
                    +18%
                  </Typography>
                </Box>
              </Box>

              {/* Tech Innovations */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                // border: '1px solid #e0e0e0',
                borderRadius: '6px',
                backgroundColor: '#fafafa'
              }}>
                <Box sx={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#52c41a',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px'
                }}>
                  <Typography style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>
                    T
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography style={{ fontSize: '12px', fontWeight: '600', color: '#1a1a1a' }}>
                    Tech Innovations
                  </Typography>
                  <Typography style={{ fontSize: '11px', color: '#666666' }}>
                    Mid Market
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography style={{ fontSize: '12px', fontWeight: '600', color: '#1a1a1a' }}>
                    $320K
                  </Typography>
                  <Typography style={{ fontSize: '10px', color: '#52c41a' }}>
                    +12%
                  </Typography>
                </Box>
              </Box>

              {/* Global Systems */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                // border: '1px solid #e0e0e0',
                borderRadius: '6px',
                backgroundColor: '#fafafa'
              }}>
                <Box sx={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#722ed1',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px'
                }}>
                  <Typography style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>
                    G
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography style={{ fontSize: '12px', fontWeight: '600', color: '#1a1a1a' }}>
                    Global Systems
                  </Typography>
                  <Typography style={{ fontSize: '11px', color: '#666666' }}>
                    Enterprise
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography style={{ fontSize: '12px', fontWeight: '600', color: '#1a1a1a' }}>
                    $285K
                  </Typography>
                  <Typography style={{ fontSize: '10px', color: '#fa8c16' }}>
                    -5%
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Value Breakdown by Category */}
      <Box sx={{ mb: 4 }}>
        <Typography style={{ marginBottom: "16px", fontSize: '16px', fontWeight: '600', color: '#1a1a1a' }}>
          Value Breakdown by Category
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: mobile || cards ? 'column' : 'row', gap: 3 }}>
          {/* Time Savings Card */}
          <Box sx={{
            flex: 1,
            p: 3,
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <Box sx={{
              width: '60px',
              height: '60px',
              backgroundColor: '#52c41a',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <Typography style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
                $
              </Typography>
            </Box>
            <Typography style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a', mb: 1 }}>
              $980K
            </Typography>
            <Typography style={{ fontSize: '12px', color: '#666666', mb: 2 }}>
              Time Savings
            </Typography>
            {/* Progress Bar */}
            <Box sx={{
              width: '100%',
              height: '6px',
              backgroundColor: '#f0f0f0',
              borderRadius: '3px',
              overflow: 'hidden',
              mt: 1
            }}>
              <Box sx={{
                width: '41%',
                height: '100%',
                backgroundColor: '#52c41a',
                borderRadius: '3px'
              }} />
            </Box>
            <Typography style={{ fontSize: '11px', color: '#52c41a', fontWeight: '600', mb: 2 }}>
              41% of total value
            </Typography>


          </Box>

          {/* Cost Reduction Card */}
          <Box sx={{
            flex: 1,
            p: 3,
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <Box sx={{
              width: '60px',
              height: '60px',
              backgroundColor: '#1890ff',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <DownOutlined style={{ color: 'white', fontSize: '24px' }} />
            </Box>
            <Typography style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a', mb: 1 }}>
              $720K
            </Typography>
            <Typography style={{ fontSize: '12px', color: '#666666', mb: 2 }}>
              Cost Reduction
            </Typography>

            {/* Progress Bar */}
            <Box sx={{
              width: '100%',
              height: '6px',
              backgroundColor: '#f0f0f0',
              borderRadius: '3px',
              overflow: 'hidden',
              mt: 1
            }}>
              <Box sx={{
                width: '30%',
                height: '100%',
                backgroundColor: '#1890ff',
                borderRadius: '3px'
              }} />
            </Box>
            <Typography style={{ fontSize: '11px', color: '#1890ff', fontWeight: '600', mb: 2 }}>
              30% of total value
            </Typography>

          </Box>

          {/* Revenue Growth Card */}
          <Box sx={{
            flex: 1,
            p: 3,
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <Box sx={{
              width: '60px',
              height: '60px',
              backgroundColor: '#722ed1',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <BarChartOutlined style={{ color: 'white', fontSize: '24px' }} />
            </Box>
            <Typography style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a', mb: 1 }}>
              $700K
            </Typography>
            <Typography style={{ fontSize: '12px', color: '#666666', mb: 2 }}>
              Revenue Growth
            </Typography>
            {/* Progress Bar */}
            <Box sx={{
              width: '100%',
              height: '6px',
              backgroundColor: '#f0f0f0',
              borderRadius: '3px',
              overflow: 'hidden',
              mt: 1
            }}>
              <Box sx={{
                width: '29%',
                height: '100%',
                backgroundColor: '#722ed1',
                borderRadius: '3px'
              }} />
            </Box>
            <Typography style={{ fontSize: '11px', color: '#722ed1', fontWeight: '600', mb: 2 }}>
              29% of total value
            </Typography>


          </Box>
        </Box>
      </Box>

      {/* Recent Value Activities */}
      <Box sx={{ flex: '1' }}>
        <Box sx={{
          p: 3,
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a' }}>
              Recent Values Activities
            </Typography>
          </Box>

          {/* Customer List */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Acme Corp */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              p: 2,
              // border: '1px solid #e0e0e0',
              borderRadius: '6px',
              backgroundColor: '#fafafa'
            }}>
              <Box sx={{
                width: '40px',
                height: '40px',
                backgroundColor: '#1890ff',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px'
              }}>
                <Typography style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>
                  P
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography style={{ fontSize: '12px', fontWeight: '600', color: '#1a1a1a' }}>

                  Process Optimization Completed
                </Typography>
                <Typography style={{ fontSize: '11px', color: '#666666' }}>
                  Acme Corp Saved $45k in Operational costs Through Automated Workflow
                </Typography>
                <Typography style={{ fontSize: '11px', color: '#666666' }}>
                  2 hours ago
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography style={{ fontSize: '12px', fontWeight: '600', color: '#1a1a1a' }}>
                  $450K
                </Typography>
                {/* <Typography style={{ fontSize: '10px', color: '#52c41a' }}>
                    +18%
                  </Typography> */}
              </Box>
            </Box>

            {/* Tech Innovations */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              p: 2,
              // border: '1px solid #e0e0e0',
              borderRadius: '6px',
              backgroundColor: '#fafafa'
            }}>
              <Box sx={{
                width: '40px',
                height: '40px',
                backgroundColor: '#52c41a',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px'
              }}>
                <Typography style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>
                  R
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography style={{ fontSize: '12px', fontWeight: '600', color: '#1a1a1a' }}>
                  Revenue Milestone Achieved
                </Typography>
                <Typography style={{ fontSize: '11px', color: '#666666' }}>
                  Mid Market Achieved $1M in Revenue
                </Typography>
                <Typography style={{ fontSize: '11px', color: '#666666' }}>
                  1 day ago
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography style={{ fontSize: '12px', fontWeight: '600', color: '#1a1a1a' }}>
                  $320K
                </Typography>
                {/* <Typography style={{ fontSize: '10px', color: '#52c41a' }}>
                    +12%
                  </Typography> */}
              </Box>
            </Box>

            {/* Global Systems */}
            {/* <Box sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                // border: '1px solid #e0e0e0',
                borderRadius: '6px',
                backgroundColor: '#fafafa'
              }}>
                <Box sx={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#722ed1',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px'
                }}>
                  <Typography style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>
                    G
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography style={{ fontSize: '12px', fontWeight: '600', color: '#1a1a1a' }}>
                    Global Systems
                  </Typography>
                  <Typography style={{ fontSize: '11px', color: '#666666' }}>
                    Enterprise
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography style={{ fontSize: '12px', fontWeight: '600', color: '#1a1a1a' }}>
                    $285K
                  </Typography>
                  {/* <Typography style={{ fontSize: '10px', color: '#fa8c16' }}>
                    -5%
                  </Typography> 
                </Box>
              </Box> */}
          </Box>
        </Box>
      </Box>
    </Box>
  </Box>
);

const BusinessGrowthTab = ({ colors, mobile, tablet, cards, bigtablet }) => (
  <Box>
    {/* Business Growth Analytics Header */}
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: mobile || tablet ? 'column' : 'row', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography
            style={{
              textAlign: "left",
              fontSize: mobile ? "15px" : tablet ? "17px" : "18px",
              paddingLeft: "0px",
              fontWeight: "600",
              color: '#1a1a1a'
            }}
          >
            Business Growth Analytics
          </Typography>
          <Typography sx={{
            fontSize: '14px',
            color: '#666666'
          }}>
            Insights and metrics to drive B2B account growth
          </Typography>
        </Box>
        <Box sx={{
          display: 'flex',
          flexDirection: mobile ? 'column' : 'row',
          gap: mobile ? 1.5 : 2,
          mt: mobile ? 2 : 0,
          width: mobile ? '100%' : 'auto'
        }}>
          <Select
            defaultValue="This Quarter"
            style={{
              width: mobile ? '100%' : 120,
              fontSize: mobile ? '12px' : '11px'
            }}
            size="middle"
          >
            <Select.Option value="thisQuarter" style={{ fontSize: mobile ? '12px' : '11px' }}>This Quarter</Select.Option>
            <Select.Option value="lastQuarter" style={{ fontSize: mobile ? '12px' : '11px' }}>Last Quarter</Select.Option>
            <Select.Option value="thisYear" style={{ fontSize: mobile ? '12px' : '11px' }}>This Year</Select.Option>
            <Select.Option value="lastYear" style={{ fontSize: mobile ? '12px' : '11px' }}>Last Year</Select.Option>
          </Select>
          <Box sx={{
            display: 'flex',
            gap: mobile ? 1 : 2,
            width: mobile ? '100%' : 'auto'
          }}>
            <Button
              className="form-button"
              type="primary"
              icon={<DownloadOutlined />}
              style={{
                background: colors.blueAccent[1000],
                border: 'none',
                fontSize: mobile ? '12px' : '14px',
                height: mobile ? '36px' : '32px',
                flex: mobile ? 1 : 'none'
              }}
            >
              {mobile ? 'Export' : 'Export'}
            </Button>
            <Button
              className="form-button"
              type="default"
              icon={<ReloadOutlined />}
              style={{
                border: '1px solid #d9d9d9',
                fontSize: mobile ? '12px' : '14px',
                height: mobile ? '36px' : '32px',
                flex: mobile ? 1 : 'none'
              }}
            >
              {mobile ? 'Refresh' : 'Refresh'}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Key Metrics Cards */}
      <Box sx={{ display: 'flex', flexDirection: mobile || tablet ? 'column' : 'row', gap: 3, mb: 4 }}>
        {/* Revenue Growth Card */}
        <Box sx={{
          flex: 1,
          p: 3,
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          textAlign: 'left',
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{
              width: '40px',
              height: '40px',
              backgroundColor: '#dcfce6',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px'
            }}>
              <DollarOutlined style={{ color: '#3bb468', fontSize: '20px' }} />
            </Box>
            <Box sx={{ backgroundColor: "#dcfce6", padding: "4px 8px", borderRadius: "4px" }}>
              <Typography style={{ fontSize: '11px', color: '#3bb468', fontWeight: '600' }}>
                +5.2%
              </Typography>
            </Box>
          </Box>
          <Typography style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a', mb: 1 }}>
            28.5%
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography style={{ fontSize: '12px', color: '#666666' }}>
              Revenue Growth
            </Typography>
          </Box>
        </Box>

        {/* Account Growth Card */}
        <Box sx={{
          flex: 1,
          p: 3,
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          textAlign: 'left',
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{
              width: '40px',
              height: '40px',
              backgroundColor: '#dbeafe',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px'
            }}>
              <UserOutlined style={{ color: '#3b82f6', fontSize: '20px' }} />
            </Box>
            <Box sx={{ backgroundColor: "#dcfce6", padding: "4px 8px", borderRadius: "4px" }}>
              <Typography style={{ fontSize: '11px', color: '#3bb468', fontWeight: '600' }}>
                +3.1%
              </Typography>
            </Box>
          </Box>
          <Typography style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a', mb: 1 }}>
            15.2%
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography style={{ fontSize: '12px', color: '#666666' }}>
              Account Growth
            </Typography>
          </Box>
        </Box>

        {/* Activity Efficiency Card */}
        <Box sx={{
          flex: 1,
          p: 3,
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          textAlign: 'left',
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{
              width: '40px',
              height: '40px',
              backgroundColor: '#fef3c7',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px'
            }}>
              <BarChartOutlined style={{ color: '#f59e0b', fontSize: '20px' }} />
            </Box>
            <Box sx={{ backgroundColor: "#fef2f2", padding: "4px 8px", borderRadius: "4px" }}>
              <Typography style={{ fontSize: '11px', color: '#ef4444', fontWeight: '600' }}>
                -2.4%
              </Typography>
            </Box>
          </Box>
          <Typography style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a', mb: 1 }}>
            73.8%
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography style={{ fontSize: '12px', color: '#666666' }}>
              Activity Efficiency
            </Typography>
          </Box>
        </Box>

        {/* Pipeline Value Card */}
        <Box sx={{
          flex: 1,
          p: 3,
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          textAlign: 'left',
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{
              width: '40px',
              height: '40px',
              backgroundColor: '#e0e7ff',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px'
            }}>
              <RiseOutlined style={{ color: '#6366f1', fontSize: '20px' }} />
            </Box>
            <Box sx={{ backgroundColor: "#dcfce6", padding: "4px 8px", borderRadius: "4px" }}>
              <Typography style={{ fontSize: '11px', color: '#3bb468', fontWeight: '600' }}>
                +12.8%
              </Typography>
            </Box>
          </Box>
          <Typography style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a', mb: 1 }}>
            $2.85M
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography style={{ fontSize: '12px', color: '#666666' }}>
              Pipeline Value
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Sub-navigation Tabs */}
      {/* <Box sx={{ mb: 4 }}>
        <Box sx={{
          display: 'flex',
          gap: 0,
          borderBottom: '1px solid #e0e0e0',
          overflowX: mobile ? 'auto' : 'visible',
          '&::-webkit-scrollbar': {
            height: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#c1c1c1',
            borderRadius: '2px',
          },
        }}>
          {['Growth Opportunities', 'Account Health', 'Insights & Recommendations', 'Performance Metrics'].map((tab, index) => (
            <Box
              key={tab}
              sx={{
                padding: mobile ? '12px 16px' : '12px 24px',
                borderBottom: index === 0 ? '2px solid #3b82f6' : '2px solid transparent',
                color: index === 0 ? '#3b82f6' : '#666666',
                fontSize: mobile ? '12px' : '14px',
                fontWeight: index === 0 ? '600' : '400',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
                minWidth: mobile ? 'fit-content' : 'auto'
              }}
            >
              {tab}
            </Box>
          ))}
        </Box>
      </Box> */}

      {/* Sales Pipeline Overview */}
      <Box sx={{ mb: 4 }}>
        <Typography
          style={{
            textAlign: "left",
            fontSize: mobile ? "15px" : tablet ? "17px" : "18px",
            paddingLeft: "0px",
            fontWeight: "600",
            color: '#1a1a1a',
            marginBottom: "5px"
          }}
        >
          Sales Pipeline Overview
        </Typography>
        <Typography style={{
          fontSize: '14px',
          color: '#666666',
          marginBottom: "10px"
        }}>
          High-value opportunities requiring attention
        </Typography>

        {/* Pipeline Summary Metrics */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: mobile ? 'repeat(2, 1fr)' : tablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: mobile ? 2 : 3,
          mb: 4
        }}>
          <Box sx={{
            p: mobile ? 1.5 : 2,
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <Typography style={{
              fontSize: mobile ? '16px' : '20px',
              fontWeight: '700',
              color: '#1a1a1a',
              mb: 1
            }}>
              $2.9M
            </Typography>
            <Typography style={{
              fontSize: mobile ? '10px' : '12px',
              color: '#666666'
            }}>
              Total Pipeline
            </Typography>
          </Box>
          <Box sx={{
            p: mobile ? 1.5 : 2,
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <Typography style={{
              fontSize: mobile ? '16px' : '20px',
              fontWeight: '700',
              color: '#1a1a1a',
              mb: 1
            }}>
              $185K
            </Typography>
            <Typography style={{
              fontSize: mobile ? '10px' : '12px',
              color: '#666666'
            }}>
              Average Deal Size
            </Typography>
          </Box>
          <Box sx={{
            p: mobile ? 1.5 : 2,
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <Typography style={{
              fontSize: mobile ? '16px' : '20px',
              fontWeight: '700',
              color: '#1a1a1a',
              mb: 1
            }}>
              42
            </Typography>
            <Typography style={{
              fontSize: mobile ? '10px' : '12px',
              color: '#666666'
            }}>
              Days Sales Cycle
            </Typography>
          </Box>
          <Box sx={{
            p: mobile ? 1.5 : 2,
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <Typography style={{
              fontSize: mobile ? '16px' : '20px',
              fontWeight: '700',
              color: '#1a1a1a',
              mb: 1
            }}>
              31.5%
            </Typography>
            <Typography style={{
              fontSize: mobile ? '10px' : '12px',
              color: '#666666'
            }}>
              Upsell Rate
            </Typography>
          </Box>
        </Box>

        {/* Opportunity List */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Enterprise Platform Upgrade */}
          <Box sx={{
            p: mobile ? 2 : 3,
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <Box sx={{
              display: 'flex',
              flexDirection: mobile ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: mobile ? 'flex-start' : 'flex-start',
              mb: 2
            }}>
              <Box sx={{ flex: 1, width: mobile ? '100%' : 'auto' }}>
                <Typography style={{
                  fontSize: mobile ? '14px' : '16px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  mb: 1
                }}>
                  Enterprise Platform Upgrade
                </Typography>
                <Typography style={{
                  fontSize: mobile ? '12px' : '14px',
                  color: '#666666',
                  mb: 2
                }}>
                  Acme Corporation
                </Typography>
                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: mobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                  gap: mobile ? 1.5 : 2,
                  mb: 2
                }}>
                  <Box>
                    <Typography style={{ fontSize: '12px', color: '#666666' }}>
                      Value
                    </Typography>
                    <Typography style={{ fontSize: mobile ? '12px' : '14px', fontWeight: '600', color: '#1a1a1a' }}>
                      $750K
                    </Typography>
                  </Box>
                  <Box>
                    <Typography style={{ fontSize: '12px', color: '#666666' }}>
                      Probability
                    </Typography>
                    <Typography style={{ fontSize: mobile ? '12px' : '14px', fontWeight: '600', color: '#1a1a1a' }}>
                      85%
                    </Typography>
                  </Box>
                  <Box>
                    <Typography style={{ fontSize: '12px', color: '#666666' }}>
                      Expected Close
                    </Typography>
                    <Typography style={{ fontSize: mobile ? '12px' : '14px', fontWeight: '600', color: '#1a1a1a' }}>
                      15/04/2024
                    </Typography>
                  </Box>
                  <Box>
                    <Typography style={{ fontSize: '12px', color: '#666666' }}>
                      Activities
                    </Typography>
                    <Typography style={{ fontSize: mobile ? '12px' : '14px', fontWeight: '600', color: '#1a1a1a' }}>
                      8 completed
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ width: mobile ? '100%' : '200px' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography style={{ fontSize: '12px', color: '#666666' }}>
                      Progress
                    </Typography>
                    <Typography style={{ fontSize: '12px', color: '#666666' }}>
                      85%
                    </Typography>
                  </Box>
                  <Box sx={{ width: '100%', height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                    <Box sx={{ width: '85%', height: '100%', backgroundColor: '#3b82f6', borderRadius: '4px' }} />
                  </Box>
                </Box>
              </Box>
              <Box sx={{
                display: 'flex',
                gap: 1,
                mb: 2,
                flexWrap: 'wrap',
                mt: mobile ? 2 : 0,
                alignSelf: mobile ? 'flex-start' : 'flex-end'
              }}>
                <Box sx={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '600'
                }}>
                  high
                </Box>
                <Box sx={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '600'
                }}>
                  negotiation
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Multi-Year Service Extension */}
          <Box sx={{
            p: mobile ? 2 : 3,
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <Box sx={{
              display: 'flex',
              flexDirection: mobile ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: mobile ? 'flex-start' : 'flex-start',
              mb: 2
            }}>
              <Box sx={{ flex: 1, width: mobile ? '100%' : 'auto' }}>
                <Typography style={{
                  fontSize: mobile ? '14px' : '16px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  mb: 1
                }}>
                  Multi-Year Service Extension
                </Typography>
                <Typography style={{
                  fontSize: mobile ? '12px' : '14px',
                  color: '#666666',
                  mb: 2
                }}>
                  Global Solutions Ltd
                </Typography>
                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: mobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                  gap: mobile ? 1.5 : 2,
                  mb: 2
                }}>
                  <Box>
                    <Typography style={{ fontSize: '12px', color: '#666666' }}>
                      Value
                    </Typography>
                    <Typography style={{ fontSize: mobile ? '12px' : '14px', fontWeight: '600', color: '#1a1a1a' }}>
                      $480K
                    </Typography>
                  </Box>
                  <Box>
                    <Typography style={{ fontSize: '12px', color: '#666666' }}>
                      Probability
                    </Typography>
                    <Typography style={{ fontSize: mobile ? '12px' : '14px', fontWeight: '600', color: '#1a1a1a' }}>
                      70%
                    </Typography>
                  </Box>
                  <Box>
                    <Typography style={{ fontSize: '12px', color: '#666666' }}>
                      Expected Close
                    </Typography>
                    <Typography style={{ fontSize: mobile ? '12px' : '14px', fontWeight: '600', color: '#1a1a1a' }}>
                      01/05/2024
                    </Typography>
                  </Box>
                  <Box>
                    <Typography style={{ fontSize: '12px', color: '#666666' }}>
                      Activities
                    </Typography>
                    <Typography style={{ fontSize: mobile ? '12px' : '14px', fontWeight: '600', color: '#1a1a1a' }}>
                      6 completed
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ width: mobile ? '100%' : '200px' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography style={{ fontSize: '12px', color: '#666666' }}>
                      Progress
                    </Typography>
                    <Typography style={{ fontSize: '12px', color: '#666666' }}>
                      70%
                    </Typography>
                  </Box>
                  <Box sx={{ width: '100%', height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                    <Box sx={{ width: '70%', height: '100%', backgroundColor: '#3b82f6', borderRadius: '4px' }} />
                  </Box>
                </Box>
              </Box>
              <Box sx={{
                display: 'flex',
                gap: 1,
                mb: 2,
                flexWrap: 'wrap',
                mt: mobile ? 2 : 0,
                alignSelf: mobile ? 'flex-start' : 'flex-end'
              }}>
                <Box sx={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '600'
                }}>
                  high
                </Box>
                <Box sx={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '600'
                }}>
                  proposal
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Advanced Analytics Package */}
          <Box sx={{
            p: mobile ? 2 : 3,
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <Box sx={{
              display: 'flex',
              flexDirection: mobile ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: mobile ? 'flex-start' : 'flex-start',
              mb: 2
            }}>
              <Box sx={{ flex: 1, width: mobile ? '100%' : 'auto' }}>
                <Typography style={{
                  fontSize: mobile ? '14px' : '16px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  mb: 1
                }}>
                  Advanced Analytics Package
                </Typography>
                <Typography style={{
                  fontSize: mobile ? '12px' : '14px',
                  color: '#666666',
                  mb: 2
                }}>
                  TechStart Inc.
                </Typography>
                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: mobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                  gap: mobile ? 1.5 : 2,
                  mb: 2
                }}>
                  <Box>
                    <Typography style={{ fontSize: '12px', color: '#666666' }}>
                      Value
                    </Typography>
                    <Typography style={{ fontSize: mobile ? '12px' : '14px', fontWeight: '600', color: '#1a1a1a' }}>
                      $220K
                    </Typography>
                  </Box>
                  <Box>
                    <Typography style={{ fontSize: '12px', color: '#666666' }}>
                      Probability
                    </Typography>
                    <Typography style={{ fontSize: mobile ? '12px' : '14px', fontWeight: '600', color: '#1a1a1a' }}>
                      60%
                    </Typography>
                  </Box>
                  <Box>
                    <Typography style={{ fontSize: '12px', color: '#666666' }}>
                      Expected Close
                    </Typography>
                    <Typography style={{ fontSize: mobile ? '12px' : '14px', fontWeight: '600', color: '#1a1a1a' }}>
                      30/04/2024
                    </Typography>
                  </Box>
                  <Box>
                    <Typography style={{ fontSize: '12px', color: '#666666' }}>
                      Activities
                    </Typography>
                    <Typography style={{ fontSize: mobile ? '12px' : '14px', fontWeight: '600', color: '#1a1a1a' }}>
                      4 completed
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ width: mobile ? '100%' : '200px' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography style={{ fontSize: '12px', color: '#666666' }}>
                      Progress
                    </Typography>
                    <Typography style={{ fontSize: '12px', color: '#666666' }}>
                      60%
                    </Typography>
                  </Box>
                  <Box sx={{ width: '100%', height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                    <Box sx={{ width: '60%', height: '100%', backgroundColor: '#3b82f6', borderRadius: '4px' }} />
                  </Box>
                </Box>
              </Box>

              <Box sx={{
                display: 'flex',
                gap: 1,
                mb: 2,
                flexWrap: 'wrap',
                mt: mobile ? 2 : 0,
                alignSelf: mobile ? 'flex-start' : 'flex-end'
              }}>
                <Box sx={{
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '600'
                }}>
                  medium
                </Box>
                <Box sx={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '600'
                }}>
                  qualified
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Security Compliance Upgrade */}
          <Box sx={{
            p: mobile ? 2 : 3,
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            position: 'relative'
          }}>
            <Box sx={{
              display: 'flex',
              flexDirection: mobile ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: mobile ? 'flex-start' : 'flex-start',
              mb: 2
            }}>
              <Box sx={{ flex: 1, width: mobile ? '100%' : 'auto' }}>
                <Typography style={{
                  fontSize: mobile ? '14px' : '16px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  mb: 1
                }}>
                  Security Compliance Upgrade
                </Typography>
                <Typography style={{
                  fontSize: mobile ? '12px' : '14px',
                  color: '#666666',
                  mb: 2
                }}>
                  DataFlow Systems
                </Typography>
                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: mobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                  gap: mobile ? 1.5 : 2,
                  mb: 2
                }}>
                  <Box>
                    <Typography style={{ fontSize: '12px', color: '#666666' }}>
                      Value
                    </Typography>
                    <Typography style={{ fontSize: mobile ? '12px' : '14px', fontWeight: '600', color: '#1a1a1a' }}>
                      $320K
                    </Typography>
                  </Box>
                  <Box>
                    <Typography style={{ fontSize: '12px', color: '#666666' }}>
                      Probability
                    </Typography>
                    <Typography style={{ fontSize: mobile ? '12px' : '14px', fontWeight: '600', color: '#1a1a1a' }}>
                      75%
                    </Typography>
                  </Box>
                  <Box>
                    <Typography style={{ fontSize: '12px', color: '#666666' }}>
                      Expected Close
                    </Typography>
                    <Typography style={{ fontSize: mobile ? '12px' : '14px', fontWeight: '600', color: '#1a1a1a' }}>
                      28/03/2024
                    </Typography>
                  </Box>
                  <Box>
                    <Typography style={{ fontSize: '12px', color: '#666666' }}>
                      Activities
                    </Typography>
                    <Typography style={{ fontSize: mobile ? '12px' : '14px', fontWeight: '600', color: '#1a1a1a' }}>
                      5 completed
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ width: mobile ? '100%' : '200px' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography style={{ fontSize: '12px', color: '#666666' }}>
                      Progress
                    </Typography>
                    <Typography style={{ fontSize: '12px', color: '#666666' }}>
                      75%
                    </Typography>
                  </Box>
                  <Box sx={{ width: '100%', height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                    <Box sx={{ width: '75%', height: '100%', backgroundColor: '#3b82f6', borderRadius: '4px' }} />
                  </Box>
                </Box>
              </Box>
              <Box sx={{
                display: 'flex',
                gap: 1,
                mb: 2,
                flexWrap: 'wrap',
                mt: mobile ? 2 : 0,
                alignSelf: mobile ? 'flex-start' : 'flex-end'
              }}>
                <Box sx={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '600'
                }}>
                  urgent
                </Box>
                <Box sx={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '600'
                }}>
                  proposal
                </Box>
              </Box>
            </Box>

            {/* Floating overlay */}
            <Box sx={{
              position: 'absolute',
              top: mobile ? '5px' : '10px',
              right: mobile ? '5px' : '10px',
              backgroundColor: 'rgba(0,0,0,0.1)',
              borderRadius: '4px',
              padding: '4px',
              display: 'flex',
              gap: '4px'
            }}>
              <Box sx={{ width: '16px', height: '16px', backgroundColor: '#666', borderRadius: '2px' }} />
              <Box sx={{ width: '16px', height: '16px', backgroundColor: '#666', borderRadius: '2px' }} />
              <Box sx={{ width: '16px', height: '16px', backgroundColor: '#ef4444', borderRadius: '2px' }} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  </Box>
);

const BusinessReviewTab = ({ colors, mobile, tablet, cards, bigtablet }) => (
  <Box>
    {/* Q4 Business Review Header */}
    <Box sx={{ mb: 4 }}>
      {/* <Box sx={{ display: 'flex', flexDirection: mobile || tablet ? 'column' : 'row', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography 
            style={{
              textAlign: "left",
              fontSize: mobile ? "15px" : tablet ? "17px" : "18px",
              paddingLeft: "0px",
              fontWeight: "600",
              color: '#1a1a1a'
            }}
          >
            Q4 Business Review
          </Typography>
          <Typography sx={{
            fontSize: '14px',
            color: '#666666'
          }}>
            December 2024
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mt: mobile ? 2 : 0 }}>
          <Button
            className="form-button"
            type="primary"
            icon={<DownloadOutlined />}
            style={{
              background: colors.blueAccent[1000],
              border: 'none'
            }}
          >
            Export Report
          </Button>
          <Button
            className="form-button"
            icon={<UnorderedListOutlined />}
            style={{
              border: '1px solid #d9d9d9'
            }}
          >
            Share
          </Button>
        </Box>
      </Box> */}

      {/* Outstanding Quarter Achievement Banner */}
      <Box sx={{
        background: 'linear-gradient(135deg, #4c6ef5 0%, #7c3aed 100%)',
        borderRadius: '12px',
        p: mobile ? 3 : 4,
        mb: 4,
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography style={{
              fontSize: mobile ? '18px' : '24px',
              fontWeight: '700',
              color: 'white',
              marginRight: '8px'
            }}>
              Outstanding Quarter Achievement! 🎉
            </Typography>
          </Box>
          <Typography style={{
            fontSize: mobile ? '13px' : '14px',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '24px'
          }}>
            Congratulations on exceeding all targets and milestones
          </Typography>

          {/* Achievement Stats */}
          <Box sx={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', gap: mobile ? 2 : 4 }}>
            <Box sx={{ textAlign: mobile ? 'center' : 'left' }}>
              <Typography style={{ fontSize: mobile ? '24px' : '32px', fontWeight: '700', color: 'white' }}>
                127%
              </Typography>
              <Typography style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
                Revenue Growth
              </Typography>
            </Box>
            <Box sx={{ textAlign: mobile ? 'center' : 'left' }}>
              <Typography style={{ fontSize: mobile ? '24px' : '32px', fontWeight: '700', color: 'white' }}>
                94%
              </Typography>
              <Typography style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
                Customer Satisfaction
              </Typography>
            </Box>
            <Box sx={{ textAlign: mobile ? 'center' : 'left' }}>
              <Typography style={{ fontSize: mobile ? '24px' : '32px', fontWeight: '700', color: 'white' }}>
                15
              </Typography>
              <Typography style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
                New Partnerships
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Trophy Icon */}
        <Box sx={{
          position: 'absolute',
          right: mobile ? '16px' : '32px',
          top: '50%',
          transform: 'translateY(-50%)',
          opacity: 0.3,
          fontSize: mobile ? '60px' : '80px'
        }}>
          🏆
        </Box>
      </Box>

      {/* Main Content Grid */}
      <Box sx={{ display: 'flex', flexDirection: mobile || bigtablet ? 'column' : 'row', gap: 4, mb: 4 }}>
        {/* Left Column - Performance Overview */}
        <Box sx={{ flex: '2' }}>
          <Box sx={{
            p: 3,
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            mb: 4
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a' }}>
                Performance Overview
              </Typography>
              <Typography style={{ fontSize: '12px', color: '#666666' }}>
                Q4 2024
              </Typography>
            </Box>

            {/* Chart Area - Line Chart */}
            <Box sx={{
              height: '300px',
              background: '#ffffff',
              borderRadius: '8px',
              position: 'relative',
              border: '1px solid #f0f0f0',
              padding: '20px'
            }}>
              {/* Y-axis labels */}
              <Box sx={{
                position: 'absolute',
                left: '10px',
                top: '20px',
                bottom: '40px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                width: '30px'
              }}>
                {['3.0M', '2.5M', '2.0M', '1.5M', '1.0M', '0.5M'].map((label) => (
                  <Typography key={label} style={{ fontSize: '11px', color: '#666666' }}>
                    {label}
                  </Typography>
                ))}
              </Box>

              {/* Chart Grid Lines */}
              <Box sx={{
                position: 'absolute',
                left: '50px',
                right: '20px',
                top: '20px',
                bottom: '40px'
              }}>
                {[0, 1, 2, 3, 4, 5].map((line) => (
                  <Box key={line} sx={{
                    position: 'absolute',
                    top: `${line * 20}%`,
                    left: 0,
                    right: 0,
                    height: '1px',
                    backgroundColor: '#f5f5f5'
                  }} />
                ))}
              </Box>

              {/* Line Chart Area */}
              <Box sx={{
                position: 'absolute',
                left: '50px',
                right: '20px',
                top: '20px',
                bottom: '40px',
                overflow: 'hidden'
              }}>
                {/* Gradient Fill Area */}
                <Box sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '60%',
                  background: 'linear-gradient(180deg, rgba(76, 110, 245, 0.2) 0%, rgba(76, 110, 245, 0.05) 100%)',
                  clipPath: 'polygon(0% 80%, 25% 60%, 50% 40%, 75% 20%, 100% 10%, 100% 100%, 0% 100%)'
                }} />

                {/* Line Path */}
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '20%',
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: colors.blueAccent[1000],
                    clipPath: 'polygon(0% 80%, 25% 60%, 50% 40%, 75% 20%, 100% 10%)'
                  }
                }} />

                {/* Data Points */}
                {[
                  { x: '0%', y: '80%' },
                  { x: '25%', y: '60%' },
                  { x: '50%', y: '40%' },
                  { x: '75%', y: '20%' },
                  { x: '100%', y: '10%' }
                ].map((point, index) => (
                  <Box key={index} sx={{
                    position: 'absolute',
                    left: point.x,
                    top: point.y,
                    width: '8px',
                    height: '8px',
                    backgroundColor: colors.blueAccent[1000],
                    borderRadius: '50%',
                    border: '2px solid white',
                    transform: 'translate(-50%, -50%)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }} />
                ))}
              </Box>

              {/* X-axis labels */}
              <Box sx={{
                position: 'absolute',
                bottom: '10px',
                left: '50px',
                right: '20px',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                {['Oct', 'Nov', 'Dec'].map((month) => (
                  <Typography key={month} style={{ fontSize: '11px', color: '#666666' }}>
                    {month}
                  </Typography>
                ))}
              </Box>
            </Box>

            {/* Revenue and New Customers Cards */}
            <Box sx={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', gap: 3, mt: 3 }}>
              <Box sx={{
                flex: 1,
                p: 2,
                backgroundColor: '#f8fffe',
                borderRadius: '8px',
                border: '1px solid #e6fffa'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Box sx={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#10b981',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <TrendingUp style={{ color: 'white', fontSize: '14px' }} />
                  </Box>
                  <Typography style={{ fontSize: '12px', color: '#666666' }}>
                    Revenue
                  </Typography>
                </Box>
                <Typography style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a' }}>
                  $2.4M
                </Typography>
              </Box>

              <Box sx={{
                flex: 1,
                p: 2,
                backgroundColor: '#eff6ff',
                borderRadius: '8px',
                border: '1px solid #dbeafe'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Box sx={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#3b82f6',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <UserOutlined style={{ color: 'white', fontSize: '14px' }} />
                  </Box>
                  <Typography style={{ fontSize: '12px', color: '#666666' }}>
                    New Customers
                  </Typography>
                </Box>
                <Typography style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a' }}>
                  847
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Right Column - Key Achievements */}
        <Box sx={{ flex: '1' }}>
          <Box sx={{
            p: 3,
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            mb: 4
          }}>
            <Typography style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a', marginBottom: "10px" }}>
              Key Achievements
            </Typography>

            {/* Achievement Items */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <CheckCircleOutlined style={{ color: '#10b981', fontSize: '16px', marginTop: '2px' }} />
                <Box>
                  <Typography style={{ fontSize: '12px', fontWeight: '600', color: '#1a1a1a', mb: 1 }}>
                    Product Launch Success
                  </Typography>
                  <Typography style={{ fontSize: '11px', color: '#666666' }}>
                    New AI features adopted by 78% of customers
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <CheckCircleOutlined style={{ color: '#3b82f6', fontSize: '16px', marginTop: '2px' }} />
                <Box>
                  <Typography style={{ fontSize: '12px', fontWeight: '600', color: '#1a1a1a', mb: 1 }}>
                    Customer Excellence
                  </Typography>
                  <Typography style={{ fontSize: '11px', color: '#666666' }}>
                    Highest NPS score of 72 this year
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <CheckCircleOutlined style={{ color: '#8b5cf6', fontSize: '16px', marginTop: '2px' }} />
                <Box>
                  <Typography style={{ fontSize: '12px', fontWeight: '600', color: '#1a1a1a', mb: 1 }}>
                    Strategic Partnerships
                  </Typography>
                  <Typography style={{ fontSize: '11px', color: '#666666' }}>
                    Secured 5 enterprise partnerships
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <CheckCircleOutlined style={{ color: '#f59e0b', fontSize: '16px', marginTop: '2px' }} />
                <Box>
                  <Typography style={{ fontSize: '12px', fontWeight: '600', color: '#1a1a1a', mb: 1 }}>
                    Market Expansion
                  </Typography>
                  <Typography style={{ fontSize: '11px', color: '#666666' }}>
                    Entered 3 new international markets
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Bottom Section */}
      <Box sx={{ display: 'flex', flexDirection: mobile || bigtablet ? 'column' : 'row', gap: 4 }}>
        {/* Customer Satisfaction */}
        <Box sx={{ flex: '1' }}>
          <Box sx={{
            p: 3,
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center',
            height: '100%'
          }}>
            <Typography style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a', marginBottom: "10px", textAlign: "left" }}>
              Customer Satisfaction
            </Typography>

            {/* Large Circular Progress - 94% */}
            <Box sx={{ position: 'relative', display: 'inline-flex', mb: 4 }}>
              <Box sx={{
                width: '160px',
                height: '80px',
                borderRadius: '80px 80px 0 0',
                background: `conic-gradient(from 180deg, #10b981 0deg ${94 * 1.8}deg, #e5e7eb ${94 * 1.8}deg 180deg)`,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                <Box sx={{
                  width: '120px',
                  height: '60px',
                  borderRadius: '60px 60px 0 0',
                  backgroundColor: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0px'
                }}>
                  <Typography style={{ fontSize: '24px', fontWeight: '700', color: '#10b981', lineHeight: 1, marginTop: '10px' }}>
                    94%
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Bottom Metrics Row */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography style={{ fontSize: '18px', fontWeight: '700', color: '#10b981' }}>
                  94%
                </Typography>
                <Typography style={{ fontSize: '11px', color: '#666666' }}>
                  Overall Score
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography style={{ fontSize: '18px', fontWeight: '700', color: '#3b82f6' }}>
                  89%
                </Typography>
                <Typography style={{ fontSize: '11px', color: '#666666' }}>
                  Retention Rate
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography style={{ fontSize: '18px', fontWeight: '700', color: '#8b5cf6' }}>
                  72
                </Typography>
                <Typography style={{ fontSize: '11px', color: '#666666' }}>
                  NPS Score
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Team Recognition */}
        <Box sx={{ flex: '1' }}>
          <Box sx={{
            p: 3,
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            height: '100%'
          }}>
            <Typography style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a', marginBottom: "10px" }}>
              Team Recognition
            </Typography>

            {/* Team Members */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, backgroundColor: "#fefce8", padding: "8px", borderRadius: "5px", border: "1px solid #fef196" }}>
                <Box sx={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#fbbf24',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Typography style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>
                    SJ
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography style={{ fontSize: '12px', fontWeight: '600', color: '#1a1a1a' }}>
                    Sarah Johnson
                  </Typography>
                  <Typography style={{ fontSize: '11px', color: '#666666' }}>
                    Top Sales Performer - 150% of target
                  </Typography>
                </Box>
                <Box>
                  🥇
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, backgroundColor: "#effdf4", padding: "8px", borderRadius: "5px", border: "1px solid #c4f7d7" }}>
                <Box sx={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Typography style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>
                    MC
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography style={{ fontSize: '12px', fontWeight: '600', color: '#1a1a1a' }}>
                    Mike Chen
                  </Typography>
                  <Typography style={{ fontSize: '11px', color: '#666666' }}>
                    Customer Success Champion
                  </Typography>
                </Box>
                <Box>
                  🏆
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, backgroundColor: "#dce2eb", padding: "8px", borderRadius: "5px", border: "1px solid #c6dffe" }}>
                <Box sx={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Typography style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>
                    ER
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography style={{ fontSize: '12px', fontWeight: '600', color: '#1a1a1a' }}>
                    Emily Rodriguez
                  </Typography>
                  <Typography style={{ fontSize: '11px', color: '#666666' }}>
                    Innovation Leader
                  </Typography>
                </Box>
                <Box>
                  💡
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Q1 2025 Goals & Initiatives */}
      <Box sx={{ mt: 4 }}>
        <Box sx={{
          p: 3,
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a' }}>
              Q1 2025 Goals & Initiatives
            </Typography>
            <Typography style={{
              fontSize: '11px',
              color: '#3b82f6',
              backgroundColor: '#eff6ff',
              padding: '4px 8px',
              borderRadius: '4px',
              fontWeight: '500'
            }}>
              Strategic Focus
            </Typography>
          </Box>

          {/* Goals Grid */}
          <Box sx={{ display: 'flex', flexDirection: mobile || cards ? 'column' : 'row', gap: 3 }}>
            {/* Revenue Growth */}
            <Box sx={{
              flex: 1,
              p: 3,
              backgroundColor: '#f0fdf4',
              borderRadius: '8px',
              border: '1px solid #bbf7d0'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <TrendingUp style={{ color: '#10b981', fontSize: '20px' }} />
                <Typography style={{ fontSize: '12px', fontWeight: '600', color: '#1a1a1a' }}>
                  Revenue Growth
                </Typography>
              </Box>
              <Typography style={{ fontSize: '11px', color: '#666666', mb: 2 }}>
                Target 35% increase in MRR through upselling and new acquisitions
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography style={{ fontSize: '11px', color: '#666666' }}>
                  Progress
                </Typography>
                <Typography style={{ fontSize: '11px', fontWeight: '600', color: '#10b981' }}>
                  0%
                </Typography>
              </Box>
            </Box>

            {/* Customer Expansion */}
            <Box sx={{
              flex: 1,
              p: 3,
              backgroundColor: '#eff6ff',
              borderRadius: '8px',
              border: '1px solid #bfdbfe'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <UserOutlined style={{ color: '#3b82f6', fontSize: '20px' }} />
                <Typography style={{ fontSize: '12px', fontWeight: '600', color: '#1a1a1a' }}>
                  Customer Expansion
                </Typography>
              </Box>
              <Typography style={{ fontSize: '11px', color: '#666666', mb: 2 }}>
                Onboard 500+ new enterprise customers across target verticals
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography style={{ fontSize: '11px', color: '#666666' }}>
                  Progress
                </Typography>
                <Typography style={{ fontSize: '11px', fontWeight: '600', color: '#3b82f6' }}>
                  0%
                </Typography>
              </Box>
            </Box>

            {/* Product Innovation */}
            <Box sx={{
              flex: 1,
              p: 3,
              backgroundColor: '#faf5ff',
              borderRadius: '8px',
              border: '1px solid #e9d5ff'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <CheckCircleOutlined style={{ color: '#8b5cf6', fontSize: '20px' }} />
                <Typography style={{ fontSize: '12px', fontWeight: '600', color: '#1a1a1a' }}>
                  Product Innovation
                </Typography>
              </Box>
              <Typography style={{ fontSize: '11px', color: '#666666', mb: 2 }}>
                Launch 3 major features based on customer feedback
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography style={{ fontSize: '11px', color: '#666666' }}>
                  Progress
                </Typography>
                <Typography style={{ fontSize: '11px', fontWeight: '600', color: '#8b5cf6' }}>
                  0%
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Generated Footer */}
      <Box sx={{
        mt: 4,
        pt: 3,
        borderTop: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography style={{ fontSize: '11px', color: '#666666' }}>
          Generated on December 15, 2024
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: mobile ? 2 : 0 }}>
          <Button
            className="form-button"
            type="primary"
            icon={<DownloadOutlined />}
            style={{
              background: colors.blueAccent[1000],
              border: 'none'
            }}
          >
            Export Report
          </Button>
          <Button
            className="form-button"
            icon={<UnorderedListOutlined />}
            style={{
              border: '1px solid #d9d9d9'
            }}
          >
            Share
          </Button>
        </Box>
      </Box>
    </Box>
  </Box>
);

const CustomerActivitiesTab = ({ colors, mobile, tablet, cards, bigtablet }) => (
  <Box>


    {/* Customer Revenue by Business Unit */}
    <Box sx={{
      backgroundColor: '#ffffff',
      padding: mobile ? 2 : 3,
      borderRadius: 2,
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      mb: 4
    }}>
      <Box sx={{
        display: 'flex',
        flexDirection: mobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: mobile ? 'flex-start' : 'center',
        gap: mobile ? 2 : 0,
        mb: 3
      }}>
        <Box sx={{ flex: 1 }}>
          <Typography style={{
            textAlign: "left",
            fontSize: mobile ? "16px" : tablet ? "17px" : "18px",
            paddingLeft: "0px",
            fontWeight: "600",
            color: '#1a1a1a',
            mb: 0.5
          }}>
            Customer Revenue by Business Unit
          </Typography>
          <Typography style={{
            fontSize: mobile ? '12px' : '14px',
            color: '#6b7280',
            lineHeight: 1.4
          }}>
            Share of revenue, presence strength and weakness, and RM actions to expand footprint
          </Typography>
        </Box>
        <Button
          type="primary"
          className="form-button"
          style={{
            // fontSize: mobile ? '11px' : '12px',
            background: colors.blueAccent[1000],
            color:"#fff",
            border: 'none',
            // padding: mobile ? '8px 16px' : '8px 20px',
            // height: mobile ? '36px' : '40px',
            // minWidth: mobile ? '120px' : '140px'
          }}
        >
          Plan Actions
        </Button>
      </Box>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
        gap: mobile ? 3 : 4
      }}>
        {/* Donut Chart Section */}
        <Box sx={{
          textAlign: 'center',
          padding: mobile ? 2 : 2.5,
          border: '1px solid #e5e7eb',
          borderRadius: 2,
          backgroundColor: '#ffffff'
        }}>
          {/* Donut Chart */}
          <Box sx={{
            width: mobile ? 180 : 250,
            height: mobile ? 180 : 250,
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, #10b981 0deg 108deg, #3b82f6 108deg 180deg, #ef4444 180deg 252deg, #f59e0b 252deg 324deg, #1f2937 324deg 360deg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            position: 'relative'
          }}>
            <Box sx={{
              width: mobile ? 100 : 150,
              height: mobile ? 100 : 150,
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column'
            }}>
              <Typography style={{
                fontSize: mobile ? '18px' : '20px',
                fontWeight: 700,
                color: '#1f2937'
              }}>
                $1.8M
              </Typography>
              <Typography style={{
                fontSize: mobile ? '11px' : '12px',
                color: '#6b7280'
              }}>
                Total Revenue
              </Typography>
            </Box>
          </Box>

          {/* Legend */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: mobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
            gap: mobile ? 1.5 : 2, 
            mb: 3 
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: mobile ? 'center' : 'flex-start' }}>
              <Box sx={{ width: 12, height: 12, backgroundColor: '#10b981', borderRadius: '2px' }} />
              <Typography style={{ fontSize: mobile ? '11px' : '12px', color: '#1f2937' }}>Payments</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: mobile ? 'center' : 'flex-start' }}>
              <Box sx={{ width: 12, height: 12, backgroundColor: '#3b82f6', borderRadius: '2px' }} />
              <Typography style={{ fontSize: mobile ? '11px' : '12px', color: '#1f2937' }}>Lending</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: mobile ? 'center' : 'flex-start' }}>
              <Box sx={{ width: 12, height: 12, backgroundColor: '#ef4444', borderRadius: '2px' }} />
              <Typography style={{ fontSize: mobile ? '11px' : '12px', color: '#1f2937' }}>Wealth</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: mobile ? 'center' : 'flex-start' }}>
              <Box sx={{ width: 12, height: 12, backgroundColor: '#f59e0b', borderRadius: '2px' }} />
              <Typography style={{ fontSize: mobile ? '11px' : '12px', color: '#1f2937' }}>Operations</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: mobile ? 'center' : 'flex-start', gridColumn: mobile ? '1 / -1' : 'auto' }}>
              <Box sx={{ width: 12, height: 12, backgroundColor: '#1f2937', borderRadius: '2px' }} />
              <Typography style={{ fontSize: mobile ? '11px' : '12px', color: '#1f2937' }}>IT Shared Services</Typography>
            </Box>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: mobile ? 'column' : 'row',
            gap: mobile ? 1.5 : 2, 
            mb: 3 
          }}>
            <Box sx={{
              backgroundColor: '#f9fafb',
              padding: mobile ? 1.5 : 1.5,
              borderRadius: 2,
              border: '1px solid #e5e7eb',
              flex: 1,
              textAlign: 'center'
            }}>
              <Typography style={{
                fontSize: mobile ? '11px' : '12px',
                color: '#6b7280',
                mb: 0.5
              }}>
                Total Revenue
              </Typography>
              <Typography style={{
                fontSize: mobile ? '16px' : '18px',
                fontWeight: 600,
                color: '#1f2937'
              }}>
                $1.8M
              </Typography>
            </Box>
            <Box sx={{
              backgroundColor: '#f9fafb',
              padding: mobile ? 1.5 : 1.5,
              borderRadius: 2,
              border: '1px solid #e5e7eb',
              flex: 1,
              textAlign: 'center'
            }}>
              <Typography style={{
                fontSize: mobile ? '11px' : '12px',
                color: '#6b7280',
                mb: 0.5
              }}>
                Units Tracked
              </Typography>
              <Typography style={{
                fontSize: mobile ? '16px' : '18px',
                fontWeight: 600,
                color: '#1f2937'
              }}>
                5
              </Typography>
            </Box>
          </Box>

          {/* Linked Accounts */}
          {/* <Box sx={{
            backgroundColor: '#f9fafb',
            padding: mobile ? 1 : 1.5,
            borderRadius: 2,
            border: '1px solid #e5e7eb'
          }}>
            <Typography style={{
              fontSize: mobile ? '11px' : '12px',
              fontWeight: 600,
              color: '#1f2937',
              mb: 0.5
            }}>
              IT Shared Services
            </Typography>
            <Typography style={{
              fontSize: mobile ? '10px' : '11px',
              color: '#6b7280'
            }}>
              5 linked accounts
            </Typography>
          </Box> */}
        </Box>

        {/* Presence and Actions Section */}
        <Box>
          {/* Strong Presence */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: "space-between", alignItems: 'center', gap: 1 }}>
              <Typography style={{
                fontSize: mobile ? '12px' : '14px',
                color: '#1f2937',
                fontWeight: 600
              }}>
                Strong Presence
              </Typography>
              <Box sx={{
                background: "#14a249",
                borderRadius: "50%",
                padding: "4px",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px'
              }}>
                <RiseOutlined style={{ color: '#fff', fontSize: '14px' }} />
              </Box>
            </Box>
            <Typography style={{
              fontSize: mobile ? '11px' : '12px',
              color: '#6b7280'
            }}>
              Payments - 85%
            </Typography>
          </Box>

          {/* Weak Presence */}
          <Box sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: "space-between", alignItems: 'center', gap: 1 }}>
              <Typography style={{
                fontSize: mobile ? '12px' : '14px',
                color: '#1f2937',
                fontWeight: 600
              }}>
                Weak Presence
              </Typography>
              <Box sx={{
                background: "#db7707",
                borderRadius: "50%",
                padding: "4px",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px'
              }}>
                <TrendingDown style={{ color: '#fff', fontSize: '14px' }} />
              </Box>
            </Box>

          </Box>

          {/* Detailed Actions */}
          <Box sx={{
            mb: 2, padding: mobile ? 1 : 1.5,
            borderRadius: 2,
            border: '1px solid #e5e7eb',
          }}>
            <Typography style={{
              fontSize: mobile ? '12px' : '14px',
              color: '#1f2937',
              fontWeight: 600,
              mb: 1,

            }}>
              IT Shared Services
            </Typography>
            <Typography style={{
              fontSize: mobile ? '10px' : '11px',
              color: '#6b7280',
              mb: 0.5
            }}>
              • Discovery call (business + technical)
            </Typography>

          </Box>

          <Box sx={{
            mb: 2, padding: mobile ? 1 : 1.5,
            borderRadius: 2,
            border: '1px solid #e5e7eb',
          }}>
            <Typography style={{
              fontSize: mobile ? '12px' : '14px',
              color: '#1f2937',
              fontWeight: 600,
              mb: 1,

            }}>
              Wealth
            </Typography>
            <Typography style={{
              fontSize: mobile ? '10px' : '11px',
              color: '#6b7280',
              mb: 0.5
            }}>
              • Discovery call (business + technical)
            </Typography>

          </Box>

          <Box sx={{
            padding: mobile ? 1 : 1.5,
            borderRadius: 2,
            border: '1px solid #e5e7eb',
          }}>
            <Typography style={{
              fontSize: mobile ? '12px' : '14px',
              color: '#1f2937',
              fontWeight: 600,
              mb: 1,

            }}>
              Operations
            </Typography>
            <Typography style={{
              fontSize: mobile ? '10px' : '11px',
              color: '#6b7280',
              mb: 0.5
            }}>
              • Discovery call (business + technical)
            </Typography>

          </Box>
        </Box>
      </Box>
    </Box>

    {/* Strategic Activities for Relationship Manager */}
    <Box sx={{
      backgroundColor: '#ffffff',
      padding: mobile ? 2 : 3,
      borderRadius: 2,
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      mb: 4
    }}>
      <Typography style={{
        fontSize: mobile ? '16px' : '18px',
        fontWeight: 600,
        color: '#1f2937',
        marginBottom: "5px"
      }}>
        Strategic Activities for Relationship Manager
      </Typography>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: mobile ? '1fr' : tablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
        gap: mobile ? 2 : 3
      }}>
        {/* IT Shared Services */}
        <Box sx={{
          padding: mobile ? 1.5 : 2,
          borderRadius: 2,
          border: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb'
        }}>
          <Typography style={{
            fontSize: mobile ? '14px' : '16px',
            fontWeight: 600,
            color: '#1f2937',
            marginBottom: "5px"
          }}>
            IT Shared Services
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography style={{
                fontSize: mobile ? '12px' : '14px',
                fontWeight: 600,
                color: '#1f2937',
                marginBottom: "5px"
              }}>
                Discovery call (business + technical)
              </Typography>
              <Typography style={{
                fontSize: mobile ? '11px' : '12px',
                color: '#6b7280'
              }}>
                Discover business pain, success metrics, timeline, and technical context to qualify the opportunity.
              </Typography>
            </Box>

            <Box>
              <Typography style={{
                fontSize: mobile ? '12px' : '14px',
                fontWeight: 600,
                color: '#1f2937',
                marginBottom: "5px"
              }}>
                Business case & ROI/TCO analysis
              </Typography>
              <Typography style={{
                fontSize: mobile ? '11px' : '12px',
                color: '#6b7280'
              }}>
                Quantify value with metrics, cost comparison, and payback period. Align with finance.
              </Typography>
            </Box>

            <Box>
              <Typography style={{
                fontSize: mobile ? '12px' : '14px',
                fontWeight: 600,
                color: '#1f2937',
                mb: 0.5
              }}>
                POC/pilot plan with success criteria
              </Typography>
              <Typography style={{
                fontSize: mobile ? '11px' : '12px',
                color: '#6b7280'
              }}>
                Define scope, timeline, success metrics, and resources for a time-based pilot.
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Wealth */}
        <Box sx={{
          padding: mobile ? 1.5 : 2,
          borderRadius: 2,
          border: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb'
        }}>
          <Typography style={{
            fontSize: mobile ? '14px' : '16px',
            fontWeight: 600,
            color: '#1f2937',
            mb: 2
          }}>
            Wealth
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography style={{
                fontSize: mobile ? '12px' : '14px',
                fontWeight: 600,
                color: '#1f2937',
                mb: 0.5
              }}>
                Discovery call (business + technical)
              </Typography>
              <Typography style={{
                fontSize: mobile ? '11px' : '12px',
                color: '#6b7280'
              }}>
                Discover business pain, success metrics, timeline, and technical context to qualify the opportunity.
              </Typography>
            </Box>

            <Box>
              <Typography style={{
                fontSize: mobile ? '12px' : '14px',
                fontWeight: 600,
                color: '#1f2937',
                mb: 0.5
              }}>
                Business case & ROI/TCO analysis
              </Typography>
              <Typography style={{
                fontSize: mobile ? '11px' : '12px',
                color: '#6b7280'
              }}>
                Quantify value with metrics, cost comparison, and payback period. Align with finance.
              </Typography>
            </Box>

            <Box>
              <Typography style={{
                fontSize: mobile ? '12px' : '14px',
                fontWeight: 600,
                color: '#1f2937',
                mb: 0.5
              }}>
                POC/pilot plan with success criteria
              </Typography>
              <Typography style={{
                fontSize: mobile ? '11px' : '12px',
                color: '#6b7280'
              }}>
                Define scope, timeline, success metrics, and resources for a time-based pilot.
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Operations */}
        <Box sx={{
          padding: mobile ? 1.5 : 2,
          borderRadius: 2,
          border: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb'
        }}>
          <Typography style={{
            fontSize: mobile ? '14px' : '16px',
            fontWeight: 600,
            color: '#1f2937',
            mb: 2
          }}>
            Operations
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography style={{
                fontSize: mobile ? '12px' : '14px',
                fontWeight: 600,
                color: '#1f2937',
                mb: 0.5
              }}>
                Discovery call (business + technical)
              </Typography>
              <Typography style={{
                fontSize: mobile ? '11px' : '12px',
                color: '#6b7280'
              }}>
                Discover business pain, success metrics, timeline, and technical context to qualify the opportunity.
              </Typography>
            </Box>

            <Box>
              <Typography style={{
                fontSize: mobile ? '12px' : '14px',
                fontWeight: 600,
                color: '#1f2937',
                mb: 0.5
              }}>
                Business case & ROI/TCO analysis
              </Typography>
              <Typography style={{
                fontSize: mobile ? '11px' : '12px',
                color: '#6b7280'
              }}>
                Quantify value with metrics, cost comparison, and payback period. Align with finance.
              </Typography>
            </Box>

            <Box>
              <Typography style={{
                fontSize: mobile ? '12px' : '14px',
                fontWeight: 600,
                color: '#1f2937',
                mb: 0.5
              }}>
                POC/pilot plan with success criteria
              </Typography>
              <Typography style={{
                fontSize: mobile ? '11px' : '12px',
                color: '#6b7280'
              }}>
                Define scope, timeline, success metrics, and resources for a time-based pilot.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>



    {/* Growth Opportunities */}
    <Box sx={{
      backgroundColor: '#ffffff',
      padding: mobile ? 2 : 3,
      borderRadius: 2,
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      mb: 4
    }}>
      <Box sx={{ mb: 3 }}>
        <Typography style={{
          fontSize: mobile ? '16px' : '18px',
          fontWeight: 600,
          color: '#1f2937',
          mb: 0.5
        }}>
          Growth Opportunities
        </Typography>
        <Typography style={{
          fontSize: mobile ? '12px' : '14px',
          color: '#6b7280'
        }}>
          Identify opportunities to expand business with existing accounts
        </Typography>
      </Box>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: mobile ? '1fr' : tablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
        gap: mobile ? 2 : 3
      }}>
        {[
          {
            title: "Service Expansion - Acme Corp",
            value: "$300K",
            probability: "85%",
            closeDate: "10/04/2024",
            status: "proposal",
            progress: 85
          },
          {
            title: "New Platform License - Global Solutions Ltd",
            value: "$190K",
            probability: "60%",
            closeDate: "16/05/2024",
            status: "proposal",
            progress: 60
          },
          {
            title: "Enterprise Upgrade - DataFlow Systems",
            value: "$220K",
            probability: "70%",
            closeDate: "10/04/2024",
            status: "qualify",
            progress: 70
          }
        ].map((opportunity, index) => (
          <Box key={index} sx={{
            padding: mobile ? 1.5 : 2,
            border: '1px solid #e5e7eb',
            borderRadius: 2,
            backgroundColor: '#ffffff'
          }}>
            <Typography style={{
              fontSize: mobile ? '13px' : '14px',
              fontWeight: 600,
              color: '#1f2937',
              mb: 1,
              lineHeight: 1.3
            }}>
              {opportunity.title}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: "column", justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography style={{
                  fontSize: mobile ? '12px' : '12px',
                  color: '#6b7280',
                  fontWeight: 500
                }}>
                  Value:
                </Typography>
                <Typography style={{
                  fontSize: mobile ? '12px' : '12px',
                  color: '#1f2937',
                  fontWeight: 600
                }}>
                  {opportunity.value}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography style={{
                  fontSize: mobile ? '12px' : '12px',
                  color: '#6b7280',
                  fontWeight: 500
                }}>
                  Probability:
                </Typography>
                <Typography style={{
                  fontSize: mobile ? '12px' : '12px',
                  color: '#1f2937',
                  fontWeight: 600
                }}>
                  {opportunity.probability}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography style={{
                  fontSize: mobile ? '12px' : '12px',
                  color: '#6b7280',
                  fontWeight: 500
                }}>
                  Expected Close:
                </Typography>
                <Typography style={{
                  fontSize: mobile ? '12px' : '12px',
                  color: '#1f2937',
                  fontWeight: 600
                }}>
                  {opportunity.closeDate}
                </Typography>
              </Box>
            </Box>
            <Box sx={{
              width: '100%',
              height: 4,
              backgroundColor: '#e5e7eb',
              borderRadius: 2,
              overflow: 'hidden',
              mb: 2
            }}>
              <Box sx={{
                width: `${opportunity.progress}%`,
                height: '100%',
                backgroundColor: '#3b82f6'
              }} />
            </Box>
            <Button
              size="small"
              style={{
                fontSize: mobile ? '11px' : '12px',
                background: colors.blueAccent[1000],
                color: '#fff',
                border: 'none',
                padding: mobile ? '8px 16px' : '6px 12px',
                borderRadius: '4px',
                textTransform: 'none',
                fontWeight: 500,
                height: mobile ? '36px' : '32px'
              }}
            >
              {opportunity.status}
            </Button>
          </Box>
        ))}
      </Box>
    </Box>

    {/* Sales Playbook by Stage & Persona */}
    <Box sx={{
      backgroundColor: '#ffffff',
      padding: mobile ? 2 : 3,
      borderRadius: 2,
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      mb: 4
    }}>
      <Box sx={{ mb: 3 }}>
        <Typography style={{
          fontSize: mobile ? '16px' : '18px',
          fontWeight: 600,
          color: '#1f2937',
          mb: 0.5
        }}>
          Sales Playbook by Stage & Persona
        </Typography>
        <Typography style={{
          fontSize: mobile ? '12px' : '14px',
          color: '#6b7280'
        }}>
          Recommended actions to take based on customer stage, opportunity, and buyer persona
        </Typography>
      </Box>

      <Box sx={{
        display: 'flex',
        flexDirection: mobile ? 'column' : 'row',
        gap: mobile ? 2 : 3,
        mb: 3
      }}>
        <Input
          placeholder="Search playbook..."
          style={{
            flex: 1,
            fontSize: mobile ? '12px' : '14px'
          }}
          size="small"
        />
        <Select
          defaultValue="Prospect"
          style={{
            width: mobile ? '100%' : 120,
            fontSize: mobile ? '12px' : '11px'
          }}
          size="small"
        >
          <Select.Option value="prospect" style={{ fontSize: mobile ? '12px' : '11px' }}>Prospect</Select.Option>
          <Select.Option value="qualified" style={{ fontSize: mobile ? '12px' : '11px' }}>Qualified</Select.Option>
          <Select.Option value="proposal" style={{ fontSize: mobile ? '12px' : '11px' }}>Proposal</Select.Option>
        </Select>
        <Select
          defaultValue="All Personas"
          style={{
            width: mobile ? '100%' : 120,
            fontSize: mobile ? '12px' : '11px'
          }}
          size="small"
        >
          <Select.Option value="all" style={{ fontSize: mobile ? '12px' : '11px' }}>All Personas</Select.Option>
          <Select.Option value="economic" style={{ fontSize: mobile ? '12px' : '11px' }}>Economic Buyer</Select.Option>
          <Select.Option value="technical" style={{ fontSize: mobile ? '12px' : '11px' }}>Technical Buyer</Select.Option>
        </Select>
      </Box>

      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: mobile ? '1fr' : tablet ? 'repeat(2, 1fr)' : 'repeat(2, 1fr)',
        gap: mobile ? 2 : 3
      }}>
        {[
          {
            title: "Persona-targeted multi-threaded outreach",
            description: "Engage multiple stakeholders across different personas to increase response rates and build relationships",
            personas: ["Economic Buyer", "Technical Buyer"],
            status: "in progress",
            materials: "Email templates, LinkedIn sequences, CRM data",
            criteria: "Response rate >15%, 3+ stakeholders engaged",
            duration: "2-3 days",
            nextSteps: "Follow up with non-responders, schedule discovery calls"
          },
          {
            title: "Discovery call (business + technical)",
            description: "Deep dive into requirements, pain points, and decision-making process",
            personas: ["Economic Buyer", "Technical Buyer", "End User"],
            status: "nurturing",
            materials: "Discovery questions, demo environment, needs assessment",
            criteria: "Qualified opportunity, clear requirements, budget confirmed",
            duration: "45-60 minutes",
            nextSteps: "Send follow-up materials, schedule technical demo"
          },
          {
            title: "Value hypothesis recap",
            description: "Summarize key value propositions and align stakeholders on next steps",
            personas: ["Economic Buyer", "Technical Buyer"],
           
            status: "qualifying",
            materials: "Value prop deck, case studies, ROI calculator",
            criteria: "Stakeholder alignment, value proposition validated",
            duration: "30 minutes",
            nextSteps: "Prepare proposal, schedule decision meeting"
          },
          {
            title: "Qualification (BANT/CHAMP/MEDDICC highlights)",
            description: "Assess buying authority, need, timeline, and budget using proven frameworks",
            personas: ["Economic Buyer", "Technical Buyer"],
            status: "in progress",
            materials: "Qualification framework, scorecard, budget questions",
            criteria: "Qualified lead, decision criteria met",
            duration: "20-30 minutes",
            nextSteps: "Move to proposal stage, prepare custom solution"
          },
          {
            title: "Persona content enablement",
            description: "Deliver targeted content based on persona interests and buying stage",
            personas: ["Economic Buyer", "Technical Buyer", "End User"],
            status: "nurturing",
            materials: "Content library, personalization tools, analytics",
            criteria: "Engagement metrics, content consumption, lead scoring",
            duration: "Ongoing",
            nextSteps: "Track engagement, adjust content strategy"
          }
        ].map((playbook, index) => (
          <Box key={index} sx={{
            padding: mobile ? 1.5 : 2,
            border: '1px solid #e5e7eb',
            borderRadius: 2,
            backgroundColor: '#ffffff'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography style={{
                  fontSize: mobile ? '13px' : '15px',
                  fontWeight: 600,
                  color: '#1f2937',
                  mb: 1
                }}>
                  {playbook.title}
                </Typography>
                <Typography style={{
                  fontSize: mobile ? '11px' : '12px',
                  color: '#6b7280',
                  mb: 2
                }}>
                  {playbook.description}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {playbook.personas.map((persona, idx) => {
                    // Define colors for different personas
                    const getPersonaColor = (persona) => {
                      switch (persona) {
                        case 'Economic Buyer':
                          return {
                            backgroundColor: '#dbeafe',
                            borderColor: '#3b82f6',
                            textColor: '#1e40af'
                          };
                        case 'Technical Buyer':
                          return {
                            backgroundColor: '#fef3c7',
                            borderColor: '#f59e0b',
                            textColor: '#92400e'
                          };
                        case 'End User':
                          return {
                            backgroundColor: '#d1fae5',
                            borderColor: '#10b981',
                            textColor: '#065f46'
                          };
                        case 'User Champion':
                          return {
                            backgroundColor: '#e0e7ff',
                            borderColor: '#6366f1',
                            textColor: '#3730a3'
                          };
                        case 'Marketing':
                          return {
                            backgroundColor: '#fce7f3',
                            borderColor: '#ec4899',
                            textColor: '#be185d'
                          };
                        default:
                          return {
                            backgroundColor: '#f3f4f6',
                            borderColor: '#d1d5db',
                            textColor: '#374151'
                          };
                      }
                    };

                    const colors = getPersonaColor(persona);

                    return (
                      <Box key={idx} sx={{
                        padding: '2px 8px',
                        backgroundColor: colors.backgroundColor,
                        borderRadius: '12px',
                        border: `1px solid ${colors.borderColor}`
                      }}>
                        <Typography style={{
                          fontSize: '10px',
                          color: colors.textColor,
                          fontWeight: 500
                        }}>
                          {persona}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
              <Box sx={{
                padding: '4px 8px',
                backgroundColor: colors.blueAccent[1000],
                borderRadius: '12px',
                ml: 2
              }}>
                <Typography style={{
                  fontSize: '10px',
                  color: 'black',
                  fontWeight: 500,
                  // color:"black"
                }}>
                  {playbook.status}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: mobile ? '1fr' : 'repeat(2, 1fr)',
              gap: 2,
              fontSize: mobile ? '10px' : '11px'
            }}>
              <Box>
                <Typography style={{ 
                  color: 'black', 
                  fontSize: mobile ? '10px' : '11px',
                  fontWeight: 600,
                  mb: 0.5
                }}>
                  Material
                </Typography>
                <Typography style={{ 
                  color: '#374151', 
                  fontSize: mobile ? '10px' : '11px'
                }}>
                  {playbook.materials}
                </Typography>
              </Box>
              <Box>
                <Typography style={{ 
                  color: 'black', 
                  fontSize: mobile ? '10px' : '11px',
                  fontWeight: 600,
                  mb: 0.5
                }}>
                  Success criteria
                </Typography>
                <Typography style={{ 
                  color: '#374151', 
                  fontSize: mobile ? '10px' : '11px'
                }}>
                  {playbook.criteria}
                </Typography>
              </Box>
              <Box>
                <Typography style={{ 
                  color: 'black', 
                  fontSize: mobile ? '10px' : '11px',
                  fontWeight: 600,
                  mb: 0.5
                }}>
                  Duration
                </Typography>
                <Typography style={{ 
                  color: '#374151', 
                  fontSize: mobile ? '10px' : '11px'
                }}>
                  {playbook.duration}
                </Typography>
              </Box>
              <Box>
                <Typography style={{ 
           color: 'black', 
                  fontSize: mobile ? '10px' : '11px',
                  fontWeight: 600,
                  mb: 0.5
                }}>
                  Next steps
                </Typography>
                <Typography style={{ 
                  color: '#374151', 
                  fontSize: mobile ? '10px' : '11px'
                }}>
                  {playbook.nextSteps}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>

    {/* Customer Interaction Timeline */}
    <Box sx={{
      backgroundColor: '#ffffff',
      padding: mobile ? 2 : 3,
      borderRadius: 2,
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3
      }}>
        <Box>
          <Typography style={{
            fontSize: mobile ? '16px' : '18px',
            fontWeight: 600,
            color: '#1f2937',
            mb: 0.5
          }}>
            Customer Interaction Timeline
          </Typography>
          <Typography style={{
            fontSize: mobile ? '12px' : '14px',
            color: '#6b7280'
          }}>
            Complete history of customer touchpoints and outcomes
          </Typography>
        </Box>
        <Button
          type="primary"
          style={{
            fontSize: mobile ? '10px' : '11px',
            background: colors.blueAccent[1000],
            border: 'none',
            padding: mobile ? '4px 8px' : undefined
          }}
        >
          Export
        </Button>
      </Box>

      <Box sx={{
        display: 'flex',
        flexDirection: mobile ? 'column' : 'row',
        gap: mobile ? 2 : 3,
        mb: 3
      }}>
        <Input
          placeholder="Search interactions..."
          style={{
            flex: 1,
            fontSize: mobile ? '12px' : '14px'
          }}
          size="small"
        />
        <Select
          defaultValue="All Types"
          style={{
            width: mobile ? '100%' : 120,
            fontSize: mobile ? '12px' : '11px'
          }}
          size="small"
        >
          <Select.Option value="all" style={{ fontSize: mobile ? '12px' : '11px' }}>All Types</Select.Option>
          <Select.Option value="calls" style={{ fontSize: mobile ? '12px' : '11px' }}>Calls</Select.Option>
          <Select.Option value="meetings" style={{ fontSize: mobile ? '12px' : '11px' }}>Meetings</Select.Option>
        </Select>
        <Select
          defaultValue="All Accounts"
          style={{
            width: mobile ? '100%' : 120,
            fontSize: mobile ? '12px' : '11px'
          }}
          size="small"
        >
          <Select.Option value="all" style={{ fontSize: mobile ? '12px' : '11px' }}>All Accounts</Select.Option>
          <Select.Option value="acme" style={{ fontSize: mobile ? '12px' : '11px' }}>Acme Corporation</Select.Option>
          <Select.Option value="global" style={{ fontSize: mobile ? '12px' : '11px' }}>Global Solutions Ltd</Select.Option>
        </Select>
      </Box>

      {/* Process Flow Timeline */}
      <Box sx={{ position: 'relative' }}>
        {/* Process Steps */}
        {[
          {
            step: 1,
            title: "Contract Renewal Discussion",
            company: "Acme Corporation • Sarah Johnson",
            outcome: "Strong interest in renewal with expanded packages",
            tags: ["renewal", "negotiation", "QBR"],
            date: "12/03/2024",
            status: "completed",
            icon: "📄"
          },
          {
            step: 2,
            title: "Proposal Follow-up",
            company: "TechStart Inc. • Mike Chen",
            outcome: "Attached: proposal_analytics_v2.pdf",
            tags: ["proposal", "analytics"],
            date: "12/03/2024",
            status: "completed",
            icon: "📋"
          },
          {
            step: 3,
            title: "Product Demo Session",
            company: "Global Solutions Ltd. • Emma Davis",
            outcome: "Technical team impressed with new capabilities",
            tags: ["demo", "technical", "features"],
            date: "12/03/2024",
            status: "completed",
            icon: "🖥️"
          },
          {
            step: 4,
            title: "Service Agreement Executed",
            company: "DataFlow Systems • Robert Kim",
            outcome: "Contract finalized after 6 weeks of negotiation",
            tags: ["contract", "signed", "milestone"],
            date: "12/03/2024",
            status: "completed",
            icon: "✅"
          },
          {
            step: 5,
            title: "Issue Resolution Call",
            company: "Innovation Labs • Lisa Park",
            outcome: "Issue resolved, monitoring situation closely",
            tags: ["support", "technical", "resolution"],
            date: "11/03/2024",
            status: "completed",
            icon: "📞"
          },
          {
            step: 6,
            title: "Contract Renewal Due",
            company: "Acme Corporation",
            outcome: "",
            tags: ["reminder", "renewal", "important"],
            date: "10/03/2024",
            status: "pending",
            icon: "⭐"
          },
          {
            step: 7,
            title: "User Training Session",
            company: "SecureBank Corp • David Wilson",
            outcome: "Team successfully onboarded, high engagement",
            tags: ["training", "onboarding", "engagement"],
            date: "10/03/2024",
            status: "completed",
            icon: "👥"
          },
          {
            step: 8,
            title: "Customer Satisfaction Survey",
            company: "Acme Corporation • Sarah Johnson",
            outcome: "4.5/5 stars, incorporating user feedback",
            tags: ["feedback", "satisfaction", "survey"],
            date: "11/03/2024",
            status: "completed",
            icon: "📊"
          }
        ].map((interaction, index) => {
          const isLast = index === 7;
          const isCompleted = interaction.status === 'completed';
          const isPending = interaction.status === 'pending';

          return (
            <Box key={index} sx={{ position: 'relative' }}>
              {/* Connecting Line */}
              {!isLast && (
                <Box sx={{
                  position: 'absolute',
                  left: mobile ? 15 : 19,
                  top: 70,
                  width: '2px',
                  height: '80px',
                  backgroundColor: '#d1d5db',
                  zIndex: 0
                }} />
              )}

              {/* Process Step */}
              <Box sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2,
                mb: 3,
                position: 'relative',
                zIndex: 1
              }}>
                {/* Step Number & Icon */}
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1
                }}>
                  {/* Step Number Circle */}
                  <Box sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: isCompleted ? colors.blueAccent[1000] : isPending ? '#f59e0b' : '#e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: isCompleted ? '#ffffff' : isPending ? '#ffffff' : '#6b7280',
                    border: `2px solid ${isCompleted ? colors.blueAccent[1000] : isPending ? '#f59e0b' : '#e5e7eb'}`
                  }}>
                    {interaction.step}
                  </Box>
                  
                  {/* Icon */}
                  <Box sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    border: `1px solid ${isCompleted ? colors.blueAccent[1000] : isPending ? '#f59e0b' : '#e5e7eb'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px'
                  }}>
                    {interaction.icon}
                  </Box>
                </Box>

                {/* Content */}
                <Box sx={{ 
                  flex: 1,
                  padding: mobile ? 1.5 : 2,
                  backgroundColor: '#ffffff',
                  border: `1px solid ${isCompleted ? colors.blueAccent[1000] : isPending ? '#f59e0b' : '#e5e7eb'}`,
                  borderRadius: 2,
                  boxShadow: isCompleted ? '0 2px 4px rgba(59, 130, 246, 0.1)' : isPending ? '0 2px 4px rgba(245, 158, 11, 0.1)' : '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box sx={{ display: 'flex',  alignItems: 'center' }}>
                      <Typography style={{
                        fontSize: mobile ? '13px' : '15px',
                        fontWeight: 600,
                        color: '#1f2937'
                      }}>
                        {interaction.title}
                      </Typography>
                      {isCompleted && (
                        <Box sx={{
                          padding: '2px 6px',
                          backgroundColor: '#10b981',
                          borderRadius: '12px'
                        }}>
                          <Typography style={{
                            fontSize: '8px',
                            color: '#ffffff',
                            fontWeight: 500
                          }}>
                            Completed
                          </Typography>
                        </Box>
                      )}
                      {isPending && (
                        <Box sx={{
                          padding: '2px 6px',
                          backgroundColor: '#f59e0b',
                          borderRadius: '12px'
                        }}>
                          <Typography style={{
                            fontSize: '8px',
                            color: '#ffffff',
                            fontWeight: 500
                          }}>
                            ⏳ Pending
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    <Typography style={{
                      fontSize: mobile ? '10px' : '11px',
                      color: '#6b7280'
                    }}>
                      {interaction.date}
                    </Typography>
                  </Box>

                  {/* Company */}
                  <Typography style={{
                    fontSize: mobile ? '11px' : '12px',
                    color: '#374151',
                    mb: 1
                  }}>
                    {interaction.company}
                  </Typography>

                  {/* Outcome */}
                  {interaction.outcome && (
                    <Box sx={{
                      backgroundColor: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: 1,
                      padding: 1,
                      mb: 1
                    }}>
                      <Typography style={{
                        fontSize: mobile ? '10px' : '11px',
                        color: '#166534',
                        fontWeight: 500
                      }}>
                        {interaction.outcome}
                      </Typography>
                    </Box>
                  )}

                  {/* Tags */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {interaction.tags.map((tag, tagIndex) => {
                      const getTagColor = (tag) => {
                        switch (tag) {
                          case 'renewal':
                          case 'contract':
                          case 'signed':
                            return { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6' };
                          case 'negotiation':
                          case 'proposal':
                            return { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' };
                          case 'QBR':
                          case 'milestone':
                            return { bg: '#e0e7ff', text: '#3730a3', border: '#6366f1' };
                          case 'demo':
                          case 'technical':
                          case 'features':
                            return { bg: '#d1fae5', text: '#065f46', border: '#10b981' };
                          case 'support':
                          case 'resolution':
                            return { bg: '#fee2e2', text: '#991b1b', border: '#ef4444' };
                          case 'reminder':
                          case 'important':
                            return { bg: '#f3e8ff', text: '#6b21a8', border: '#a855f7' };
                          case 'training':
                          case 'onboarding':
                          case 'engagement':
                            return { bg: '#ecfdf5', text: '#064e3b', border: '#059669' };
                          case 'feedback':
                          case 'satisfaction':
                          case 'survey':
                            return { bg: '#f0f9ff', text: '#1e40af', border: '#0ea5e9' };
                          default:
                            return { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' };
                        }
                      };

                      const tagColors = getTagColor(tag);

                      return (
                        <Box key={tagIndex} sx={{
                          padding: '2px 6px',
                          backgroundColor: tagColors.bg,
                          border: `1px solid ${tagColors.border}`,
                          borderRadius: '8px'
                        }}>
                          <Typography style={{
                            fontSize: '9px',
                            color: tagColors.text,
                            fontWeight: 500
                          }}>
                            {tag}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography style={{
          fontSize: mobile ? '11px' : '12px',
          color: colors.blueAccent[1000],
          fontWeight: 500,
          cursor: 'pointer'
        }}>
          View All Interactions
        </Typography>
      </Box>
    </Box>
  </Box>
);

const OrganizationDetails = () => {
  const [form] = Form.useForm();
  const [branchForm] = Form.useForm();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery("(max-width: 400px)");
  const isTablet = useMediaQuery("(max-width: 700px)");
  const isCards = useMediaQuery("(max-width: 540px)");
  const isHightTablet = useMediaQuery("(max-width: 830px)");
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

  const [activeTab, setActiveTab] = useState('Journey Matrix');

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
        sx={{
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
            isActive ? <MinusOutlined style={{ fontSize: isMobile ? 17 : 20, fontWeight: "bold" }} /> : <PlusOutlined style={{ fontSize: isMobile ? 17 : 20, fontWeight: "bold" }} />
          }
          defaultActiveKey={
            sortedBranches.length > 0
              ? (() => {
                const parentIndex = sortedBranches.findIndex(b => b.branchtype === "Parent");
                return parentIndex !== -1 ? [String(sortedBranches[parentIndex].id || parentIndex)] : [];
              })()
              : []
          }
          className="modern-collapse"
          style={{
            background: 'transparent',
            border: 'none'
          }}
        >
          {sortedBranches.map((branch, idx) => {
            const isEditing = editingBranchIndex === idx;
            const editData = isEditing ? branchEdits : branch;
            const unitCmData = getCmDataForUnit(branch.branch);
            const selectedCm = selectedCmByUnit[branch.branch];

            const panelLabel =
              branch.branchtype === "Parent"
                ? <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: isMobile ? '6px' : '8px',
                  flexWrap: 'wrap'
                }}>
                  <Typography.Text strong style={{
                    fontSize: isMobile ? "14px" : "16px",
                    color: '#1a1a1a'
                  }}>
                    {branch.organizationname}
                  </Typography.Text>
                  <span style={{
                    fontSize: isMobile ? "10px" : "12px",
                    color: '#666666',
                    background: '#f0f9ff',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: '500'
                  }}>
                    Parent
                  </span>
                </span>
                : <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: isMobile ? '6px' : '8px',
                  flexWrap: 'wrap'
                }}>
                  <Typography.Text strong style={{
                    fontSize: isMobile ? "13px" : "15px",
                    color: '#1a1a1a'
                  }}>
                    {branch.branch}
                  </Typography.Text>
                  <span style={{
                    fontSize: isMobile ? "10px" : "12px",
                    color: '#666666',
                    background: '#f0f9ff',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: '500'
                  }}>
                    Unit
                  </span>
                </span>;
            return (
              <Collapse.Panel
                header={panelLabel}
                key={branch.id || idx}
                className="modern-collapse-panel"
              // style={{padding: "20px"}}
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
                    <Col xs={24} md={8} style={{ display: editingBranchIndex === idx && editData.branchtype === "Parent" && isEditing ? "block" : "none" }}>
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

                <div style={{
                  marginTop: 24,
                  paddingTop: 16,
                  borderTop: '1px solid #f0f0f0',
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                  gap: "8px"
                }}>
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
                            expandIconPosition="end"
                            expandIcon={({ isActive }) =>
                              isActive ? <MinusOutlined /> : <PlusOutlined />
                            }
                            className="modern-collapse cm-collapse"
                            style={{
                              background: 'transparent',
                              border: 'none'
                            }}
                          >
                            {unitCmData.map((cm, cmIndex) => (
                              <React.Fragment key={cm.cmid}>
                                <Collapse.Panel
                                  header={
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <Typography.Text strong style={{ fontSize: "14px", color: '#1a1a1a' }}>
                                        {cm.firstname} {cm.lastname}
                                      </Typography.Text>
                                      <span style={{ fontSize: "11px", color: '#666666' }}>
                                        ({cm.email})
                                      </span>
                                    </span>
                                  }
                                  key={cm.cmid}
                                  className="modern-collapse-panel cm-panel"
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

      <Box mt={4}
        sx={{
          padding: "16px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          height: "100%",
        }}>

        {/* Chevron Style Tab Navigation */}
        <Box sx={{ mb: 4 }}>
          {/* <Typography 
          className="custom-headding-16px"
            style={{
              textAlign: isMobile ? "left" : "center",
              fontSize: isMobile ? "15px" : isTablet ? "17px" : "18px",
              paddingLeft: isMobile ? "0px" : "30px",
            }}
          >
            Organization Sections
          </Typography> */}

          {/* Tab Navigation Bar */}
          {/* Modern Pill-Style Tab Navigation */}
          <Box sx={{
            backgroundColor: '#f8fafc',
            borderRadius: '20px',
            padding: isMobile ? '6px' : isTablet ? '4px' : '6px',
            border: '1px solid #e2e8f0',
            position: 'relative'
          }}>
            <Box sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : isTablet ? 'column' : 'row',
              gap: isMobile ? '6px' : isTablet ? '4px' : '6px',
              position: 'relative',
              flexWrap: isTablet ? 'wrap' : 'nowrap'
            }}>
              {/* Tab Buttons */}
              {['Journey Matrix', 'Business Opportunity', 'Partnership', 'Business Value', 'Competitor', 'Business Review'].map((tab, index) => (
                <Box
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="form-button"
                  sx={{
                    position: 'relative',
                    flex: isTablet ? '0 0 calc(50% - 2px)' : 1,
                    padding: isMobile ? '12px 20px' : isTablet ? '10px 16px' : '14px 24px',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    textAlign: 'center',
                    fontSize: isMobile ? '13px' : isTablet ? '12px' : '14px',
                    fontWeight: activeTab === tab ? 700 : 500,
                    color: activeTab === tab ? '#1e40af' : '#64748b',
                    backgroundColor: activeTab === tab ? '#ffffff' : 'transparent',
                    border: activeTab === tab ? '2px solid #3b82f6' : '2px solid transparent',
                    minHeight: isMobile ? '40px' : isTablet ? '36px' : '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: activeTab === tab ? '0 4px 12px rgba(59, 130, 246, 0.15)' : 'none',
                    transform: activeTab === tab ? 'scale(1.02)' : 'scale(1)',
                    '&:hover': {
                      color: activeTab === tab ? '#1e40af' : '#374151',
                      backgroundColor: activeTab === tab ? '#ffffff' : '#f1f5f9',
                      border: activeTab === tab ? '2px solid #3b82f6' : '2px solid #cbd5e1',
                      transform: activeTab === tab ? 'scale(1.02)' : 'scale(1.01)',
                      boxShadow: activeTab === tab ? '0 4px 12px rgba(59, 130, 246, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.1)'
                    },
                    '&:active': {
                      transform: 'scale(0.98)'
                    }
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 'inherit',
                      fontWeight: 'inherit',
                      color: 'inherit',
                      lineHeight: 1.3,
                      textAlign: 'center',
                      letterSpacing: '0.025em'
                    }}
                  >
                    {tab}
                  </Typography>
                  
                  {/* Active indicator dot */}
                  {activeTab === tab && (
                    <Box sx={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      width: '6px',
                      height: '6px',
                      backgroundColor: '#3b82f6',
                      borderRadius: '50%',
                      animation: 'pulse 2s infinite'
                    }} />
                  )}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Tab Description */}
          {/* <Typography sx={{ 
            mt: 2, 
            fontSize: '11px', 
            color: '#666666',
            fontStyle: 'italic'
          }}>
            Admin or HOB will create Organisation. This organization will have different tabs. 
            Tabs are Units, CMs, Product/Services – Marketed, Partnership Activities, 
            Competitor Analysis & Business Value.
          </Typography> */}
        </Box>

        {/* Tab Content Sections */}
        <Box sx={{ mt: 3 }}>
          {/* Units Section */}
          <Box sx={{ display: activeTab === 'Journey Matrix' ? 'block' : 'none' }}>
            <UnitsTab colors={colors} mobile={isMobile} tablet={isTablet} />
          </Box>

          {/* Customer Activities Section */}
          <Box sx={{ display: activeTab === 'Business Opportunity' ? 'block' : 'none' }}>
            <CustomerActivitiesTab colors={colors} mobile={isMobile} tablet={isTablet} cards={isCards} bigtablet={isHightTablet} />
          </Box>

          {/* Partnership Activities Section */}
          <Box sx={{ display: activeTab === 'Partnership' ? 'block' : 'none' }}>
            <PartnershipTab colors={colors} mobile={isMobile} tablet={isTablet} />
          </Box>
          {/* CMs Section */}
          <Box sx={{ display: activeTab === 'CMs' ? 'block' : 'none' }}>
            <CMsTab cmData={cmData} mobile={isMobile} tablet={isTablet} />
          </Box>

          {/* Product/Services Section */}
          <Box sx={{ display: activeTab === 'Product/Services' ? 'block' : 'none' }}>
            <ProductServicesTab mobile={isMobile} tablet={isTablet} />
          </Box>



          {/* Competitor Analysis Section */}
          <Box sx={{ display: activeTab === 'Competitor' ? 'block' : 'none' }}>
            <CompetitorTab colors={colors} mobile={isMobile} tablet={isTablet} />
          </Box>

          {/* Business Value Section */}
          <Box sx={{ display: activeTab === 'Business Value' ? 'block' : 'none' }}>
            <BusinessValueTab colors={colors} mobile={isMobile} tablet={isTablet} cards={isCards} bigtablet={isHightTablet} />
          </Box>

          {/* Q4 Business Review Section */}
          <Box sx={{ display: activeTab === 'Business Review' ? 'block' : 'none' }}>
            <BusinessReviewTab colors={colors} mobile={isMobile} tablet={isTablet} cards={isCards} bigtablet={isHightTablet} />
          </Box>

        </Box>
      </Box>

    </>
  );
};

export default OrganizationDetails;