import { getCreaterId, getCreaterName } from "../../../config";
import { Form, Input, Button as AntdButton, Select as AntdSelect, Typography as AntdTypography, Upload, Spin, Result } from 'antd';
import { useMediaQuery } from "@mui/material";
import { UploadOutlined, CloseOutlined } from '@ant-design/icons';
import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";
const { Option } = AntdSelect;
const { TextArea } = Input;
// Adjust the import path as

const experienceOptions = [
  { value: "Extremely Happy", label: "😊 Extremely Happy", color: "#8BC34A" },
  { value: "Happy", label: "🙂 Happy", color: "#f7f700" },
  { value: "Frustrated", label: "😠 Frustrated", color: "#FF9800" },
  { value: "Extremely Frustrated", label: "😡 Extremely Frustrated", color: "#F44336" },
];

const impactOptions = [
  { value: "Revenue impact", label: "💰 Revenue Impact", color: "#00ACC1" },
  { value: "Business show stopper", label: "🚧 Business Show Stopper", color: "#00ACC1" },
  { value: "Customer experience", label: "👥 Customer Experience", color: "#00ACC1" },
];




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
          Your Experinece has been created successfully.
        </span>
      }
      extra={[
        <AntdButton
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
        </AntdButton>,
      ]}
      style={{ background: "#fff", borderRadius: 16, padding: 32 }}
    />
  </div>
);

const CmExperienceRegistrationForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [form] = Form.useForm();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [experience, setExperience] = useState("");
  const isMobile = useMediaQuery("(max-width: 600px)");
  // const [showEditModal, setShowEditModal] = useState(false);
  // const [editValues, setEditValues] = useState({});
  const [createdTicketId, setCreatedTicketId] = useState(null);
  // const [isEditMode, setIsEditMode] = useState(false);
  // const [originalEditValues, setOriginalEditValues] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (info) => {
    if (info.file.status === 'removed') {
      setSelectedFile(null);
    } else if (info.fileList && info.fileList.length > 0) {
      const fileObj = info.fileList[0].originFileObj || info.fileList[0];
      setSelectedFile(fileObj);
    } else {
      setSelectedFile(null);
    }
  };

  const handleExperienceClick = (value) => {
    setExperience(value);
    form.setFieldsValue({ experience: value });
  };

  // Submit form and open modal with submitted details
  const handleFormSubmit = async (values) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("experience", values.experience);
    formData.append("subject", values.subject);
    formData.append("experienceDetails", values.experienceDetails);
    formData.append("impact", values.impact);
    formData.append("status", "New");
    if (selectedFile) {
      if (selectedFile instanceof File) {
        formData.append("fileupload", selectedFile);
      } else if (selectedFile.originFileObj) {
        formData.append("fileupload", selectedFile.originFileObj);
      }
    }
    const userDetails = JSON.parse(sessionStorage.getItem('CmDetails')) || {};
    const cmid = getCreaterId();
    const cmname = getCreaterName();
    const organizationid = userDetails.organizationid;
    const organizationname = userDetails.organizationname;
    const branch = userDetails.branch;

    // Always store UTC date and time
    const now = new Date();
    const utcDate = now.toISOString().slice(0, 10); // YYYY-MM-DD
    const utcTime = now.toISOString().slice(11, 19); // HH:MM:SS

    formData.append("cmid", cmid);
    formData.append("cmname", cmname);
    formData.append("organizationname", organizationname);
    formData.append("organizationid", organizationid);
    formData.append("branch", branch);
    formData.append("priority", "Medium");
    formData.append("date", utcDate);
    formData.append("time", utcTime);

    try {
      const response = await axios.post(`http://127.0.0.1:8080/v1/createTicket`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // ...existing modal logic...
      const ticketData = response.data.data || {};
      const experienceid = response.data.experienceid || ticketData.experienceid;

      setCreatedTicketId(experienceid);
      setShowSuccess(true);

      form.resetFields();
      setSelectedFile(null);
      setExperience("");
    } catch (error) {
      if (error.response && error.response.status === 407) {
        alert('You are not assigned to any Relationship Manager');
      } else {
        alert('Error submitting form');
      }
      console.error('Error submitting form data:', error);
    } finally {
      setIsLoading(false);
    }
  };


  // Update ticket from modal
  // const handleEditSubmit = async () => {
  //   setIsLoading(true);
  //   try {
  //     const formData = new FormData();
  //     formData.append("experience", editValues.experience);
  //     formData.append("subject", editValues.subject);
  //     formData.append("experienceDetails", editValues.experienceDetails);
  //     formData.append("impact", editValues.impact);
  //     formData.append("experienceid", createdTicketId);
  //     if (selectedFile) {
  //       if (selectedFile instanceof File) {
  //         formData.append("fileupload", selectedFile);
  //       } else if (selectedFile.originFileObj) {
  //         formData.append("fileupload", selectedFile.originFileObj);
  //       }
  //     }
  //     await axios.post(`${process.env.REACT_APP_API_URL}/v1/updateTicket`, formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });
  //     message.success("Experience updated successfully!");
  //     setShowEditModal(false);
  //     navigate(-1); // Go to previous page
  //   } catch (error) {
  //     message.error("Failed to update experience.");
  //     console.error('Error updating form data:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // // Handle close/cancel in modal
  // const handleModalClose = () => {
  //   setShowEditModal(false);
  //   navigate(-1); // Go to previous page
  // };

  // When opening the modal, store original values for cancel
  // const openEditModal = (values) => {
  //   setEditValues(values);
  //   setOriginalEditValues(values);
  //   setShowEditModal(true);
  //   setIsEditMode(false);
  // };

  // In your form submit, replace setShowEditModal(true) with openEditModal({...})

  // Cancel editing: revert to original values and disable fields
  // const handleCancelEdit = () => {
  //   setEditValues(originalEditValues);
  //   setIsEditMode(false);
  // };


  return (
    <>
      {isLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          color: '#fff',
          fontSize: '20px',
        }}>
          <Spin size="large" fullscreen />
        </div>
      )}


      {!showSuccess && (
        <div style={{ backgroundColor: "#fff", padding: 20 }}>

          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            <AntdButton
              type="text"
              icon={<CloseOutlined style={{ fontSize: 20 }} />}
              onClick={() => navigate(-1)}
              style={{
                // margin: "16px 0 0 8px",
                color: "#3e4396",
                fontWeight: 600,
                fontSize: 16,
                alignSelf: "flex-end"
              }}
            >
              {/* Back */}
            </AntdButton>
          </div>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFormSubmit}
            initialValues={{ experience: "", subject: "", experienceDetails: "", impact: "" }}
          >
            <AntdTypography.Text strong style={{ fontSize: 15 }}>How was your experience?</AntdTypography.Text>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 5, marginTop: 8 }}>
              {experienceOptions.map((option) => (
                <AntdButton
                  key={option.value}
                  type={experience === option.value ? "primary" : "default"}
                  onClick={() => handleExperienceClick(option.value)}
                  style={{
                    display: "flex",
                    alignItems: isMobile ? 'flex-start' : "center",
                    gap: 8,
                    textTransform: "none",
                    fontSize: 15,
                    borderRadius: 8,
                    border: 'none',
                    background: experience === option.value ? option.color : "#f5f5f5",
                    color: experience === option.value ? "#000" : "#333",
                    boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.15)",
                    transition: "0.3s",
                    width: isMobile ? "100%" : 250,
                    marginBottom: 4,
                  }}
                >
                  <span style={{ fontSize: "17px" }}>{option.label}</span>
                </AntdButton>
              ))}
            </div>
            <Form.Item
              name="experience"
              rules={[{ required: true, message: 'Experience selection is required' }]}
              style={{ marginBottom: 8 }}
            >
              <Input type="hidden" />
            </Form.Item>

            <AntdTypography.Text strong style={{ fontSize: 15 }}>Subject</AntdTypography.Text>
            <Form.Item
              name="subject"
              rules={[{ required: true, message: 'Subject is required' }]}
              style={{ marginBottom: 8 }}
            >
              <Input placeholder="Enter subject" style={{ height: 45, background: '#fff', border: '1px solid #ccc', boxShadow: '2px 2px 5px rgba(0,0,0,0.1)' }} />
            </Form.Item>

            <AntdTypography.Text strong style={{ fontSize: 15 }}>Details of your experience</AntdTypography.Text>
            <Form.Item
              name="experienceDetails"
              rules={[{ required: true, message: 'Details are required' }, { max: 500, message: 'Maximum 500 characters' }]}
              style={{ marginBottom: 8 }}
            >
              <TextArea rows={4} placeholder="Describe your experience" style={{ background: '#fff', border: '1px solid #ccc', boxShadow: '2px 2px 5px rgba(0,0,0,0.1)' }} />
            </Form.Item>

            <AntdTypography.Text strong style={{ fontSize: 15 }}>Impact</AntdTypography.Text>
            <Form.Item
              name="impact"
              rules={[{ required: true, message: 'Impact selection is required' }]}
              style={{ marginBottom: 8 }}
            >
              <AntdSelect placeholder="Select an impact" style={{ height: 45, background: '#fff', boxShadow: '2px 2px 5px rgba(0,0,0,0.1)' }}>
                {impactOptions.map((option) => (
                  <Option key={option.value} value={option.value}>{option.label}</Option>
                ))}
              </AntdSelect>
            </Form.Item>

            <AntdTypography.Text strong style={{ fontSize: 15 }}>Attach Files</AntdTypography.Text>
            <Form.Item style={{ marginBottom: 16 }}>
              <Upload
                beforeUpload={() => false}
                onChange={handleFileChange}
                maxCount={1}
                showUploadList={false}
                fileList={selectedFile ? [{ uid: '-1', name: selectedFile.name, status: 'done' }] : []}
              >
                <AntdButton icon={<UploadOutlined />}>Attach Files</AntdButton>
              </Upload>
              {selectedFile && (
                <div style={{
                  marginTop: 8,
                  color: '#3e4396',
                  background: '#f5f5f5',
                  borderRadius: 6,
                  padding: '6px 12px',
                  fontSize: 14,
                  fontWeight: 500,
                  display: 'inline-block',
                  boxShadow: '1px 1px 4px rgba(62,67,150,0.08)'
                }}>
                  {selectedFile.name}
                </div>
              )}
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <AntdButton
                type="primary"
                htmlType="submit"
                style={{
                  padding: "14px 20px",
                  fontSize: "12px",
                  fontWeight: "600",
                  borderRadius: "3px",
                  boxShadow: "3px 3px 6px rgba(0, 0, 0, 0.2)",
                  color: "#ffffff",
                  background: colors.blueAccent[1000],
                  transition: "0.3s",
                  textTransform: "none",
                  width: '100%',
                  maxWidth: 250,
                }}
                className="cmform-submit-btn"
              >
                Submit Experience
              </AntdButton>
            </div>
          </Form>
        </div>

      )}
      {showSuccess && (
        <SuccessScreen background={colors.blueAccent[1000]} onNext={() => navigate(`/ticketdetails/${createdTicketId}`)} />
      )}
    </>
  );
};

export default CmExperienceRegistrationForm;