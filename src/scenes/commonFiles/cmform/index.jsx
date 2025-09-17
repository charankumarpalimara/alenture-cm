import React, { useState, useRef } from "react";
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
import { CameraOutlined, PlusOutlined, EditOutlined, DeleteOutlined, CloseOutlined } from "@ant-design/icons";
import "react-image-crop/dist/ReactCrop.css";
import { Country } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../../theme";
import { useTheme, useMediaQuery } from "@mui/material";
// import { CameraOutlined, CloseOutlined } from "@ant-design/icons";
const { Option } = Select;
const { Text } = Typography;
const { TextArea } = Input;








const CmForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 400px)");
  const isTablet = useMediaQuery("(max-width: 700px)");

  // Basic form states
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Submitted data storage
  const [submittedData, setSubmittedData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editValues, setEditValues] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalEditValues, setOriginalEditValues] = useState({});

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

  // Static data for dropdowns
  const [functionList] = useState([
    "Sales", "Marketing", "IT", "Finance", "Operations", "HR", "Customer Service", "Product Management"
  ]);
  const [interestList] = useState([
    "Technology", "Business", "Leadership", "Innovation", "Strategy", "Analytics", "Customer Experience"
  ]);
  const [organizationNames] = useState([
    "Tech Corp", "Global Solutions", "Innovation Inc", "Future Systems", "Digital Dynamics"
  ]);
  const [branchNames] = useState([
    { branch: "North Branch" }, { branch: "South Branch" }, { branch: "East Branch" }, { branch: "West Branch" }
  ]);
  const [crmNameList] = useState([
    { crmid: "CRM001", name: "John Smith" }, { crmid: "CRM002", name: "Sarah Johnson" }, { crmid: "CRM003", name: "Mike Davis" }
  ]);

  // Note: Data will only persist during current session, not across page refreshes




  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };


  // Update existing persona
  const handleUpdate = async () => {
    setIsLoading(true);

    try {
      const updatedData = [...submittedData];
      updatedData[editingIndex] = {
        ...editValues,
        updatedAt: new Date().toISOString()
      };

      setSubmittedData(updatedData);

      message.success("Persona updated successfully!");
      setShowEditModal(false);
      setEditingIndex(null);
      setEditValues({});
      setIsEditMode(false);

    } catch (error) {
      message.error("Error updating persona!");
    } finally {
      setIsLoading(false);
    }
  };

  // Edit persona
  const handleEdit = (index) => {
    const persona = submittedData[index];
    setEditValues(persona);
    setEditingIndex(index);
    setOriginalEditValues(persona);
    setShowEditModal(true);
    setIsEditMode(true);
  };

  // Delete persona
  const handleDelete = (index) => {
    Modal.confirm({
      title: 'Delete Persona',
      content: 'Are you sure you want to delete this persona?',
      onOk: () => {
        const updatedData = submittedData.filter((_, i) => i !== index);
        setSubmittedData(updatedData);
        message.success("Persona deleted successfully!");
      }
    });
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

    try {
      const personaData = {
        id: Date.now().toString(),
        ...values,
        profileImage,
        commonTitles,
        departments,
        primaryGoals,
        painPoints,
        kpis,
        buyingMotivations,
        objections,
        decisionCriteria,
        responsibilities,
        submittedAt: new Date().toISOString()
      };

      const updatedData = [personaData, ...submittedData];
      setSubmittedData(updatedData);

      message.success("Persona created successfully!");
      personaForm.resetFields();
      setProfileImage(null);
      setCommonTitles([]);
      setDepartments([]);
      setPrimaryGoals([]);
      setPainPoints([]);
      setKpis([]);
      setBuyingMotivations([]);
      setObjections([]);
      setDecisionCriteria([]);
      setResponsibilities([]);
      setPersonaSuccess(true);

    } catch (error) {
      message.error("Error creating persona");
    } finally {
      setPersonaLoading(false);
    }
  };

  return (
    <>
      {/* Submitted Data Display */}
      {submittedData.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 8, padding: isMobile ? 15 : 24, margin: 16, marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <Text
              className="custom-headding-16px"
              style={{
                fontSize: isMobile ? "15px" : isTablet ? "17px" : "18px",
                fontWeight: 600
              }}
            >
              Submitted Personas ({submittedData.length})
            </Text>
          </div>

          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {submittedData.map((persona, index) => (
              <Card
                key={persona.id}
                size="small"
                style={{ marginBottom: 12 }}
                actions={[
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(index)}
                    size="small"
                  >
                    Edit
                  </Button>,
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(index)}
                    size="small"
                  >
                    Delete
                  </Button>
                ]}
              >
                <Row gutter={16} align="middle">
                  <Col xs={24} sm={4}>
                    <Avatar
                      src={persona.profileImage || "https://via.placeholder.com/60"}
                      size={60}
                      style={{ border: "2px solid #1677ff" }}
                    />
                  </Col>
                  <Col xs={24} sm={20}>
                    <Row gutter={8}>
                      <Col xs={12} sm={6}>
                        <Text strong>Name:</Text>
                        <br />
                        <Text>{persona.firstName} {persona.lastName}</Text>
                      </Col>
                      <Col xs={12} sm={6}>
                        <Text strong>Email:</Text>
                        <br />
                        <Text>{persona.email}</Text>
                      </Col>
                      <Col xs={12} sm={6}>
                        <Text strong>Phone:</Text>
                        <br />
                        <Text>{persona.phoneCode} {persona.phoneNumber}</Text>
                      </Col>
                      <Col xs={12} sm={6}>
                        <Text strong>Function:</Text>
                        <br />
                        <Text>{persona.function || "N/A"}</Text>
                      </Col>
                    </Row>
                    <Row gutter={8} style={{ marginTop: 8 }}>
                      <Col xs={12} sm={6}>
                        <Text strong>Organization:</Text>
                        <br />
                        <Text>{persona.organization || "N/A"}</Text>
                      </Col>
                      <Col xs={12} sm={6}>
                        <Text strong>Primary Role:</Text>
                        <br />
                        <Text>{persona.primaryRole || "N/A"}</Text>
                      </Col>
                      <Col xs={12} sm={6}>
                        <Text strong>Seniority:</Text>
                        <br />
                        <Text>{persona.seniority || "N/A"}</Text>
                      </Col>
                      <Col xs={12} sm={6}>
                        <Text strong>Submitted:</Text>
                        <br />
                        <Text>{new Date(persona.submittedAt).toLocaleDateString()}</Text>
                      </Col>
                    </Row>
                    {persona.interests && persona.interests.length > 0 && (
                      <Row style={{ marginTop: 8 }}>
                        <Col xs={24}>
                          <Text strong>Interests: </Text>
                          <Text>{Array.isArray(persona.interests) ? persona.interests.join(", ") : persona.interests}</Text>
                        </Col>
                      </Row>
                    )}
                  </Col>
                </Row>
              </Card>
            ))}
          </div>
        </div>
      )}

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
        title="Edit Persona Details"
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
              <Form.Item label="Phone Number" className="custom-placeholder-12px" name="phoneNumber" rules={[{ required: true, message: "Phone Number is required" }]}>
                <Input disabled={!isEditMode} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Gender" className="custom-placeholder-12px" name="gender">
                <Select disabled={!isEditMode}>
                  <Option value="Male">Male</Option>
                  <Option value="Female">Female</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item label="Function" className="custom-placeholder-12px" name="function">
                <Select disabled={!isEditMode}>
                  {functionList.map((fn) => (
                    <Select.Option key={fn} value={fn}>{fn}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Organization" className="custom-placeholder-12px" name="organization">
                <Select disabled={!isEditMode}>
                  {organizationNames.map((org) => (
                    <Select.Option key={org} value={org}>
                      {org}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Primary Role" className="custom-placeholder-12px" name="primaryRole">
                <Input disabled={!isEditMode} />
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




      {/* {!showSuccess && (
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

                  <Input disabled />

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
      )} */}
      {/* Persona Creation Form */}
      {!personaSuccess && (
        <div style={{ background: "#fff", borderRadius: 8, padding: isMobile ? 15 : 24, margin: 16, marginTop: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: isMobile ? "flex-start" : "space-between", flexDirection: "column", alignItems: "flex-start", marginBottom: 16 }}>
              <Text
                className="custom-headding-16px"
                style={{
                  textAlign: isMobile ? "left" : "left",
                  fontSize: isMobile ? "15px" : isTablet ? "17px" : "18px",
                  paddingLeft: isMobile ? "0px !important" : "0px !important",
                  // paddingRight: "10px"
                }}
              >
                Create Persona
              </Text>
              <Text style={{ fontSize: 14, color: "#6b7280", textAlign: "center", marginTop: 3, paddingLeft: "30px" }}>
                Capture a detailed B2B customer persona to guide targeting, messaging, & sales motions.
              </Text>
            </div>
            <div>
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
          </div>

          <Form
            form={personaForm}
            layout="vertical"
            onFinish={handlePersonaSubmit}
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              phoneCode: "",
              phoneNumber: "",
              gender: "",
              function: "",
              interests: [],
              description: "",
              companysize: "",
              organization: "",
              branch: "",
              crmname: "",
              crmid: "",
              primaryRole: "",
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
                      style={{ borderRadius: 8, background: "#fff" }}
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
                      style={{ borderRadius: 8, background: "#fff" }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col xs={24} md={8}>
                  <Form.Item
                    label={<Text className="custom-headding-12px">Phone Number</Text>}
                    className="custom-placeholder-12px"
                    required
                  >
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
                        name="phoneNumber"
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
                  >
                    <Select
                      placeholder="Select Gender"
                      size="large"
                      style={{ borderRadius: 8, background: "#fff" }}
                    >
                      <Option value="Male">Male</Option>
                      <Option value="Female">Female</Option>
                      <Option value="Other">Other</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label={<Text className="custom-headding-12px">Function</Text>}
                    className="custom-placeholder-12px"
                    name="function"
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
              </Row>
              <Row gutter={24}>
                <Col xs={24} md={8}>
                  <Form.Item
                    label={<Text className="custom-headding-12px">Interests</Text>}
                    className="custom-placeholder-12px"
                    name="interests"
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
                    >
                      {interestList.map((interest, idx) => (
                        <Select.Option key={interest} value={interest}>{interest}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                {/* <Col xs={24} md={8}>
                  <Form.Item
                    label={<Text className="custom-headding-12px">Description</Text>}
                    className="custom-placeholder-12px"
                    name="description"
                  >
                    <Input
                      placeholder="Description"
                      size="large"
                      style={{ borderRadius: 8, background: "#fff" }}
                    />
                  </Form.Item>
                </Col> */}
                {/* <Col xs={24} md={8}>
                  <Form.Item
                    label={<Text className="custom-headding-12px">Company Size</Text>}
                    className="custom-placeholder-12px"
                    name="companysize"
                  >
                    <Input
                      placeholder="Company Size"
                      size="large"
                      style={{ borderRadius: 8, background: "#fff" }}
                    />
                  </Form.Item>
                </Col> */}

                {/* <Row gutter={24}> */}
                <Col xs={24} md={8}>
                  <Form.Item
                    label={<Text className="custom-headding-12px">Organization</Text>}
                    className="custom-placeholder-12px"
                    name="organization"
                    rules={[{ required: true, message: "Organization is required" }]}
                  >
                    <Select
                      showSearch
                      placeholder="Select Organization"
                      size="large"
                      style={{ borderRadius: 8, background: "#fff" }}
                      onChange={(value) => {
                        personaForm.setFieldsValue({ organization: value, branch: "" });
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
                    rules={[{ required: true, message: "Unit is required" }]}
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
              </Row>
              <Row gutter={24}>
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
                        personaForm.setFieldsValue({
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
                    <Input disabled />
                  </Form.Item>
                </Col>
                {/* </Row> */}

                <Col xs={24} md={8}>
                  <Form.Item
                    label={<Text className="custom-headding-12px">Primary Role</Text>}
                    className="custom-placeholder-12px"
                    name="primaryRole"
                  >
                    <Input
                      placeholder="CIO"
                      size="large"
                      style={{ borderRadius: 8, background: "#fff" }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label={<Text className="custom-headding-12px">Seniority</Text>}
                    className="custom-placeholder-12px"
                    name="seniority"
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

            <div style={{ display: "flex", flexDirection: isMobile || isTablet ? "column" : "row", gap: "24px" }}>
              {/* Industry Focus */}
              <Card title="Industry Focus" style={{ marginBottom: 24, flex: 1 }}>
                <Form.Item
                  className="custom-placeholder-12px"
                  name="industries"
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
              >
                <Checkbox.Group style={{ width: "100%" }}>
                  <div style={{
                    display: "grid",
                    // gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                    flexWrap: "wrap",
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
