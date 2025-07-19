import React, { useState } from "react";
import { Form, Input, Select, Button, message, Col, Row } from "antd";
import { tokens } from "../../../theme";


const AssignCrmForm = ({ crmNameList, onClose, experienceid, existcrmid }) => {
  const [assignForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const colors = tokens();

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      const crmid = values.crmid;
      const crmname = values.crmname;
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/v1/AssignTask`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ experienceid, crmid, existcrmid, crmname }),
        }
      );
      if (response.ok) {
        message.success("Task assigned successfully!");
        onClose();
      } else {
        const data = await response.json();
        message.error(data.error || "Failed to assign task.");
      }
    } catch (error) {
      message.error("Error assigning task.");
    }
    setLoading(false);
  };

  return (
    <Form
      form={assignForm}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{ crmid: "", crmname: "" }}
    >
      <Form.Item
        label="Relationship Manager"
        name="crmname"
        rules={[{ required: true, message: "Relationship Manager is required" }]}
        style={{ width: "100%" }}
      >
        <Select
          showSearch
          placeholder="Select Relationship Manager"
          optionFilterProp="children"
          size="large"
          style={{ width: "100%" }}
          getPopupContainer={trigger => trigger.parentNode}
          onChange={(value) => {
            const selected = crmNameList.find(crm => crm.crmid === value);
            assignForm.setFieldsValue({
              crmname: selected ? selected.name : "",
              crmid: value
            });
          }}
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
      <Row justify="end" gutter={8}>
        <Col>
          <Button
            onClick={onClose}
            type="outline"
            danger
            style={{ color: "#fff", borderRadius: 8 }}
            className="form-button"
          >
            Cancel
          </Button>
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={() => assignForm.submit()}
            disabled={loading}
            style={{
              background: colors.blueAccent[1000],
              borderRadius: 8,
              color: "#fff",
              ...(loading && { opacity: 0.7 }),
            }}
            className="form-button"
          >
            {loading ? "Assigning..." : "Assign"}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default AssignCrmForm; 