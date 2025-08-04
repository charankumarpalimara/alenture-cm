import { Box } from "@mui/material";
import { Form, Input, Button, Row, Col, Select, message, Spin, Typography } from "antd";
import { Country, State, City } from "country-state-city";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTheme, useMediaQuery } from "@mui/material";
import { tokens } from "../../../theme";
import { getCreaterRole, getCreaterId } from "../../../config";
import { CloseOutlined } from "@ant-design/icons";

const { Text } = Typography;
const OrganizationForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery("(max-width: 400px)");
  const isTablet = useMediaQuery("(max-width: 700px)");
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const countries = Country.getAllCountries();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [existingOrgs, setExistingOrgs] = useState([]);
  const [industryList, setIndustryList] = useState([]);
  // const [interestList, setInterestList] = useState([]);

  // Debug loading state changes
  useEffect(() => {
    console.log('Loading state changed:', isLoading);
  }, [isLoading]);

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

  useEffect(() => {
    const fetchIndustry = async () => {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/v1/GetOrganizationIndustries`);
      const data = await res.json();
      setIndustryList(data.data || data.industries || []);
    };
    fetchIndustry();
  }, []);

  const handleFormSubmit = async (values) => {
    console.log('Form submission started, setting loading to true');
    setIsLoading(true);
    const createrrole = getCreaterRole();
    const createrid = getCreaterId() || "";
    try {
      const formData = new FormData();
      formData.append("organizationname", values.organization);
      formData.append("branch", values.organization);
      formData.append("industry", values.industry);
      // formData.append("phonecode", values.phoneCode);
      // formData.append("mobile", values.phoneno);
      // formData.append("email", values.email);
      formData.append("username", values.organization.toLowerCase());
      formData.append("passwords", values.passwords || "defaultPassword123");
      formData.append("country", values.country);
      formData.append("state", values.province);
      formData.append("district", values.city);
      formData.append("address", values.address);
      formData.append("postalcode", values.postcode);
      formData.append("createrid", createrid);
      formData.append("createrrole", createrrole);

      // Add a small delay to make loading state visible (for testing)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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
      console.log('Form submission finished, setting loading to false');
      setIsLoading(false);
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
      {/* {isLoading && (
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
      )} */}


      <Box m="15px" sx={{ backgroundColor: "#ffffff", padding: isMobile ? "15px" : "24px" }}>
        <div style={{ display: "flex", justifyContent: isMobile ? "flex-start" : "space-between", alignItems: "center", marginBottom: 16 }}>
          <Text
            className="custom-headding-16px"
            style={{
              textAlign: isMobile ? "left" : "center",
              fontSize: isMobile ? "15px" : isTablet ? "17px" : "18px",
              paddingLeft: isMobile ? "0px" : "30px",
            }}
          >
            Create New Organization
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
          onFinish={handleFormSubmit}
          validateTrigger={["onBlur", "onChange", "onSubmit"]}
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
                label={<span className="custom-headding-12px">Organization Name</span>}
                className="custom-placeholder-12px"
                name="organization"
                validateTrigger={["onBlur", "onChange"]}
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
                  style={{ borderRadius: 8, background: "#fff" }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label={<Text className="custom-headding-12px">Industry</Text>}
                className="custom-placeholder-12px"
                name="industry"
                validateTrigger={["onBlur", "onChange"]}
                rules={[{ required: true, message: "Industry is required" }]}
              >
                <Select
                  showSearch
                  size="large"
                  placeholder="Select Industry"
                  style={{ borderRadius: 8, background: "#fff" }}
                >
                  {industryList.map((fn, idx) => (
                    <Select.Option key={fn} value={fn}>{fn}</Select.Option>
                  ))}
                </Select>
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
            {/* <Col xs={24} md={8}>
              <Form.Item
                label={<span className="custom-headding-12px">Phone Number</span>}
                className="custom-placeholder-12px"
                required>
                <Input.Group compact>
                  <Form.Item
                    name="phoneCode"
                    className="custom-placeholder-12px"
                    noStyle
                    rules={[{ required: true, message: "Code is required" }]}
                  >
                    <Select
                      showSearch
                      style={{ width: "40%" }}
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

                    className="custom-placeholder-12px"
                    noStyle
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
                label={<span className="custom-headding-12px">Email Id</span>}
                className="custom-placeholder-12px"
                name="email"
                rules={[
                  { required: true, type: "email", message: "Valid email is required" },
                ]}
              >
                <Input
                  placeholder="Email"
                  size="large"
                  style={{ borderRadius: 8, background: "#fff" }}
                />
              </Form.Item>
            </Col> */}



            <Col xs={24} md={8}>
              <Form.Item
                label={<span className="custom-headding-12px">Country</span>}
                name="country"
                validateTrigger={["onBlur", "onChange"]}
                rules={[{ required: true, message: "Country is required" }]}
              >
                <Select
                  showSearch
                  placeholder="Select Country"
                  size="large"
                  style={{ borderRadius: 8, background: "#fff" }}
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
                label={<span className="custom-headding-12px">State/Province</span>}
                className="custom-placeholder-12px"
                name="province"
                validateTrigger={["onBlur", "onChange"]}
                rules={[{ required: true, message: "State/Province is required" }]}
              >
                <Select
                  showSearch
                  placeholder="Select State/Province"
                  size="large"
                  style={{ borderRadius: 8, background: "#fff" }}
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
                label={<span className="custom-headding-12px">City</span>}
                className="custom-placeholder-12px"
                name="city"
                validateTrigger={["onBlur", "onChange"]}
                rules={[{ required: true, message: "City is required" }]}
              >
                <Select
                  showSearch
                  placeholder="Select City"
                  size="large"
                  style={{ borderRadius: 8, background: "#fff" }}
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
                label={<span className="custom-headding-12px">Address</span>}
                className="custom-placeholder-12px"
                name="address"
                validateTrigger={["onBlur", "onChange"]}
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
                label={<span className="custom-headding-12px">Postal Code</span>}
                className="custom-placeholder-12px"
                name="postcode"
                validateTrigger={["onBlur", "onChange"]}
                rules={[
                  { required: true, message: "Postal Code is required" }
                ]}
              >
                <Input
                  placeholder="Postal Code"
                  size="large"
                  style={{ borderRadius: 8, background: "#fff" }}
                />
              </Form.Item>
            </Col>
            {/* Add more fields as needed */}
          </Row>
          <Box display="flex" justifyContent="flex-end" mt="10px" gap="10px">
            {console.log('Rendering button with loading state:', isLoading)}
            <Button
              type="primary"
              className="form-button"
              htmlType="submit"
              disabled={isLoading}
              style={{
                padding: "12px 24px",
                borderRadius: "8px",
                background: isLoading ? "#ccc" : colors.blueAccent[1000],
                color: "#fff",
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.7 : 1,
                position: "relative",
                minWidth: "100px",
              }}
            >
              {isLoading ? (
                <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ 
                    width: "16px", 
                    height: "16px", 
                    border: "2px solid #fff", 
                    borderTop: "2px solid transparent", 
                    borderRadius: "50%", 
                    animation: "spin 1s linear infinite" 
                  }}></div>
                  Saving...
                </span>
              ) : (
                "Save"
              )}
            </Button>
          </Box>
        </Form>
      </Box>
    </>
  );
};

export default OrganizationForm;