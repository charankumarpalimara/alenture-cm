import { Box } from "@mui/material";
import { Form, Input, Button, Row, Col, Select, message, Spin } from "antd";
import { Country, State, City } from "country-state-city";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { getCreaterRole, getCreaterId } from "../../../config";
import {  CloseOutlined } from "@ant-design/icons";


const OrganizationForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const countries = Country.getAllCountries();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [existingOrgs, setExistingOrgs] = useState([]);

  useEffect(() => {
    const getallOrganizations = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/v1/getAllOrgs`
        );
        const orgs =
          response.data?.data?.map((o) => o.organizationname?.toLowerCase()) ||
          [];
        setExistingOrgs(orgs);
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };
    getallOrganizations();
  }, []);

  const handleFormSubmit = async (values) => {
    // setIsLoading(true);
    const createrrole = getCreaterRole();
    const createrid = getCreaterId() || "";
    try {
      const formData = new FormData();
      formData.append("organizationname", values.organization);
      formData.append("branch", values.organization);
      formData.append("phonecode", values.phoneCode);
      formData.append("mobile", values.phoneno);
      formData.append("email", values.email);
      formData.append("username", values.organization.toLowerCase());
      formData.append("passwords", values.passwords || "defaultPassword123");
      formData.append("country", values.country);
      formData.append("state", values.province);
      formData.append("district", values.city);
      formData.append("address", "null");
      formData.append("postalcode", values.postcode);
      formData.append("createrid", createrid);
      formData.append("createrrole", createrrole);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/v1/createOrganization`,
        formData,
        { headers: { "Content-Type": "multipart/form-data, charset=utf-8" } }
      );


        // const FinalOrgid = response.data.orgid;
        // const branch = response.data.branch;
        // message.success("Organization Registered successfully!");
        // setEditValues({ ...values, orgid: FinalOrgid });
        // setCreatedOrgId(FinalOrgid);
      if (response) {
        const FinalOrgid = response.data.orgid;
        console.log("Final Organization ID:", FinalOrgid);
        const branch = response.data.branch;

        // message.success("Organization Registered successfully!");
        // navigate("/organizationunitadd", { state: { orgid: FinalOrgid } });
        navigate("/organizationunitadd", { state: { orgid: FinalOrgid } });
        navigate("/organizationunitadd", { state: { orgid: FinalOrgid, organizationname: values.organization } });
        form.resetFields();

      }
    } catch (error) {
      console.error("Error submitting form data:", error);
      message.error("Submission failed");
    } finally {
      // setIsLoading(false);
    }
  };

  const states = selectedCountry
    ? State.getStatesOfCountry(
        countries.find((c) => c.name === selectedCountry)?.isoCode || ""
      )
    : [];
  const cities = selectedState
    ? City.getCitiesOfState(
        countries.find((c) => c.name === selectedCountry)?.isoCode || "",
        states.find((s) => s.name === selectedState)?.isoCode || ""
      )
    : [];

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


      <Box m="15px" sx={{ backgroundColor: "#ffffff", padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                    <Button
                      type="text"
                      icon={<CloseOutlined style={{ fontSize: 20 }} />}
                      onClick={() => navigate(-1)}
                      className="form-button"
                      style={{
                        color: "#3e4396",
                        alignSelf: "flex-end"
                      }}
                    >
                      {/* Back */}
                    </Button>
                  </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={{
            organization: "",
            branch: "",
            email: "",
            phoneCode: "",
            phoneno: "",
            address: "",
            city: "",
            province: "",
            country: "",
            postcode: "",
            passwords: "",
          }}
        >
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                label={<b>Organization Name</b>}
                name="organization"
                rules={[
                  { required: true, message: "Organization Name is required" },
                  {
                    validator: (_, value) => {
                      if (
                        value &&
                        existingOrgs.includes(value.trim().toLowerCase())
                      ) {
                        return Promise.reject(
                          new Error("Organization name already registered")
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input
                  placeholder="Organization Name"
                  size="large"
                  style={{ borderRadius: 8, background: "#fff", fontSize: 16 }}
                />
              </Form.Item>
            </Col>
            {/* <Col xs={24} md={8}>
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
            </Col> */}
            <Col xs={24} md={8}>
              <Form.Item label={<b>Phone Number</b>} required>
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
                    name="phoneno"
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
                label={<b>Email Id</b>}
                name="email"
                rules={[
                  { required: true, type: "email", message: "Valid email is required" },
                ]}
              >
                <Input
                  placeholder="Email"
                  size="large"
                  style={{ borderRadius: 8, background: "#fff", fontSize: 16 }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={<b>Country</b>}
                name="country"
                rules={[{ required: true, message: "Country is required" }]}
              >
                <Select
                  showSearch
                  placeholder="Select Country"
                  size="large"
                  style={{ borderRadius: 8, background: "#fff", fontSize: 16 }}
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
                label={<b>State/Province</b>}
                name="province"
                rules={[{ required: true, message: "State/Province is required" }]}
              >
                <Select
                  showSearch
                  placeholder="Select State/Province"
                  size="large"
                  style={{ borderRadius: 8, background: "#fff", fontSize: 16 }}
                  onChange={(value) => {
                    setSelectedState(value);
                    form.setFieldsValue({ city: "" });
                  }}
                  disabled={!selectedCountry}
                >
                  {states.map((s) => (
                    <Select.Option key={s.isoCode} value={s.name}>
                      {s.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={<b>City</b>}
                name="city"
                rules={[{ required: true, message: "City is required" }]}
              >
                <Select
                  showSearch
                  placeholder="Select City"
                  size="large"
                  style={{ borderRadius: 8, background: "#fff", fontSize: 16 }}
                  disabled={!selectedState}
                >
                  {cities.map((city) => (
                    <Select.Option key={city.name} value={city.name}>
                      {city.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={<b>Postal Code</b>}
                name="postcode"
                rules={[{ required: true, message: "Postal Code is required" }]}
              >
                <Input
                  placeholder="Postal Code"
                  size="large"
                  style={{ borderRadius: 8, background: "#fff", fontSize: 16 }}
                />
              </Form.Item>
            </Col>
            {/* Add more fields as needed */}
          </Row>
          <Box display="flex" justifyContent="flex-end" mt="10px" gap="10px">
            <Button
              type="primary"
              htmlType="submit"
              style={{
                padding: "12px 24px",
                fontSize: "14px",
                fontWeight: "600",
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
    </>
  );
};

export default OrganizationForm;