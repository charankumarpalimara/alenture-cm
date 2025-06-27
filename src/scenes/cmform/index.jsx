import { Form, Input, Button as AntdButton, Select as AntdSelect, Typography as AntdTypography, Upload, Spin, message, Modal } from 'antd';
import { useMediaQuery } from "@mui/material";
import { UploadOutlined } from '@ant-design/icons';
import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
const { Option } = AntdSelect;
const { TextArea } = Input;

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

const CmForm = () => {
  const [form] = Form.useForm();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [experience, setExperience] = useState("");
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editValues, setEditValues] = useState({});
  const [createdTicketId, setCreatedTicketId] = useState(null);
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
    const cmid = userDetails.cmid;
    const cmname = userDetails.firstname + " " + userDetails.lastname;
    const organizationid = userDetails.organizationid;
    const organizationname = userDetails.organizationname;
    const branch = userDetails.branch;
    formData.append("cmid", cmid);
    formData.append("cmname", cmname);
    formData.append("organizationname", organizationname);
    formData.append("organizationid", organizationid);
    formData.append("branch", branch);
    formData.append("priority", "Medium");

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/v1/createTicket`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Assume response.data contains the created ticket, including its id
 // Get experienceid from response
  const ticketData = response.data.data || {};
  const experienceid = response.data.experienceid || ticketData.experienceid;

setEditValues({
  ...values,
  fileupload: selectedFile,
  filename: selectedFile ? selectedFile.name : null,
  fileurl: response.data.filename || null, // if your backend returns fileurl
  experienceid: experienceid,
});
  setCreatedTicketId(experienceid); // <-- store for update
      setShowEditModal(true);
      message.success("Experience Registered Successfully!");
      form.resetFields();
      setSelectedFile(null);
      setExperience("");
    } catch (error) {
      alert('Error submitting form');
      console.error('Error submitting form data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update ticket from modal
  const handleEditSubmit = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("experience", editValues.experience);
      formData.append("subject", editValues.subject);
      formData.append("experienceDetails", editValues.experienceDetails);
      formData.append("impact", editValues.impact);
      formData.append("experienceid", createdTicketId);
      if (selectedFile) {
        if (selectedFile instanceof File) {
          formData.append("fileupload", selectedFile);
        } else if (selectedFile.originFileObj) {
          formData.append("fileupload", selectedFile.originFileObj);
        }
      }
      await axios.post(`http://127.0.0.1:8080/v1/updateTicket`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("Experience updated successfully!");
      setShowEditModal(false);
      navigate(-1); // Go to previous page
    } catch (error) {
      message.error("Failed to update experience.");
      console.error('Error updating form data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle close/cancel in modal
  const handleModalClose = () => {
    setShowEditModal(false);
    navigate(-1); // Go to previous page
  };

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

      <Modal
        open={showEditModal}
        onCancel={handleModalClose}
        footer={null}
        width={700}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <AntdTypography.Title level={3} style={{ marginBottom: 0 }}>
            Thanks for your feedback!
          </AntdTypography.Title>
          <AntdTypography.Text type="secondary" style={{ fontSize: 16 }}>
            We appreciate your input and will use it to improve our services
          </AntdTypography.Text>
        </div>
        <AntdTypography level={3} style={{ marginTop: 3, alignSelf: 'flex-start', fontSize: 15 }}>
          Review & Experience Details
        </AntdTypography>
        <Form
          layout="vertical"
          initialValues={editValues}
          onValuesChange={(_, allValues) => setEditValues(allValues)}
          style={{ marginTop: 16 }}
        >
          <Form.Item label="Experience" name="experience" rules={[{ required: true }]}>
            <AntdSelect>
              {experienceOptions.map((option) => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </AntdSelect>
          </Form.Item>
          <Form.Item label="Subject" name="subject" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Details" name="experienceDetails" rules={[{ required: true }, { max: 500 }]}>
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item label="Impact" name="impact" rules={[{ required: true }]}>
            <AntdSelect>
              {impactOptions.map((option) => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </AntdSelect>
          </Form.Item>
<Form.Item label="Attach Files" style={{ marginBottom: 0 }}>
  <Upload
    beforeUpload={() => false}
    maxCount={1}
    showUploadList={false}
    onChange={handleFileChange}
    fileList={selectedFile ? [{ uid: '-1', name: selectedFile.name, status: 'done' }] : []}
  >
    <AntdButton icon={<UploadOutlined />}>Attach Files</AntdButton>
  </Upload>
  {/* Show file preview or link */}
  {(editValues.filename || selectedFile) && (
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
      {editValues.fileurl ? (
        <a href={editValues.fileurl} target="_blank" rel="noopener noreferrer">
          {editValues.filename}
        </a>
      ) : (
        editValues.filename || (selectedFile && selectedFile.name)
      )}
    </div>
  )}
</Form.Item>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
            <AntdButton
              type="primary"
              onClick={handleEditSubmit}
              loading={isLoading}
              style={{
                background: "#3e4396",
                borderColor: "#3e4396",
                color: "#fff",
                fontWeight: "bold",
                minWidth: 120,
              }}
            >
              Update
            </AntdButton>
            <AntdButton
              style={{ marginLeft: 12 }}
              onClick={handleModalClose}
            >
              Cancel
            </AntdButton>
          </div>
        </Form>
      </Modal>

      <div style={{ backgroundColor: "#fff", padding: 20 }}>
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
                fontSize: "14px",
                fontWeight: "bold",
                borderRadius: "3px",
                boxShadow: "3px 3px 6px rgba(0, 0, 0, 0.2)",
                color: "#ffffff",
                background: '#3e4396',
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
    </>
  );
};

export default CmForm;