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
  Modal
  // Typography
} from "antd";
// import { Country, State, City } from "country-state-city";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";

import { CloseOutlined } from "@ant-design/icons";





import { getCreaterRole } from "../../../config";

// import { heIL } from "@mui/x-data-grid";
// import { Height } from "@mui/icons-material";

const { Text } = Typography;

const OrganizationDetails = () => {
  // const [form] = Form.useForm();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isLoading, setIsLoading] = useState(false);
  // const [editMode, setEditMode] = useState(false);
  // const [originalBranch, setOriginalBranch] = useState(null);
  const [branchesData, setBranchesData] = useState([]);
  const [editingBranchIndex, setEditingBranchIndex] = useState(null); // <--- NEW
  const [branchEdits, setBranchEdits] = useState({}); // <--- NEW
  const navigate = useNavigate();
  const location = useLocation();
  // const countries = Country.getAllCountries();

  // Get initial data from navigation (organization.jsx sends via state)
  const ticket = location.state?.ticket || {};

  const oragnizationid = ticket.id || ticket;

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

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <Text
              className="custom-headding-16px"
            >
              Organization
            </Text>
            <Button
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
                          minWidth: 80,
                          // padding: "5px 15px",
                          marginRight: 8,
                        }}
                      >
                        Save
                      </Button>
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
                </div>
              </Collapse.Panel>
            );
          })}
        </Collapse>
        {(getCreaterRole() === "admin" || getCreaterRole() === "hob") && (
          <Button
            type="primary"
            onClick={() => {
              navigate("/organizationadd", {
                state: {
                  organizationid: ticket.id,
                  organizationname: ticket.name,
                },
              });
            }}
            className="form-button"
            style={{
              marginTop: 16,
              background: colors.blueAccent[1000],
              color: "#fff",
              minWidth: 120,
            }}
          >
            Add New Unit
          </Button>
        )}
      </Box>
    </>
  );
};

export default OrganizationDetails;
