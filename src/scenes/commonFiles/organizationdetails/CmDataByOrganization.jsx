import React, { useState, useEffect } from 'react';
import {
  Collapse,
  Modal,
  Table,
  message,
  Spin,
  Typography,
  Card,
  Row,
  Col,
  Button
} from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { tokens } from '../../../theme';
import { CloseOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Panel } = Collapse;
const { Text, Title } = Typography;

const CmDataByOrganization = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery('(max-width: 600px)');
  const isTablet = useMediaQuery('(max-width: 900px)');
  
  const location = useLocation();
  const navigate = useNavigate();
  const { organizationid, organizationname } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [cmData, setCmData] = useState([]);
  const [selectedUnitData, setSelectedUnitData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState('');

  // Fetch all CM data for the organization
  const fetchCmData = async () => {
    if (!organizationid) {
      message.error('Organization ID not found');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/v1/getCmDataOrganiozations`,
        { organizationid }
      );

      if (response.data && response.data.data) {
        setCmData(response.data.data);
      } else {
        setCmData([]);
        message.info('No Customer Managers found for this organization');
      }
    } catch (error) {
      console.error('Error fetching CM data:', error);
      message.error('Failed to fetch Customer Manager data');
      setCmData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCmData();
  }, [organizationid]);

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
    return grouped;
  };

  // Handle unit click to show CM data
  const handleUnitClick = (unitName) => {
    const unitData = groupCmByUnit()[unitName] || [];
    setSelectedUnitData(unitData);
    setSelectedUnit(unitName);
    setModalVisible(true);
  };

  // Table columns for CM data in modal
  const cmTableColumns = [
    {
      title: 'CM ID',
      dataIndex: 'cmid',
      key: 'cmid',
      width: 120,
    },
    {
      title: 'Name',
      dataIndex: 'firstname',
      key: 'firstname',
      render: (text, record) => `${record.firstname || ''} ${record.lastname || ''}`.trim(),
      width: 150,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: 'Phone',
      dataIndex: 'mobile',
      key: 'mobile',
      render: (text, record) => `${record.phonecode || ''} ${record.mobile || ''}`.trim(),
      width: 150,
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      width: 100,
    },
    {
      title: 'Function',
      dataIndex: 'function',
      key: 'function',
      width: 150,
    },
    {
      title: 'CRM',
      dataIndex: 'crmname',
      key: 'crmname',
      width: 150,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 120,
    },
  ];

  const groupedData = groupCmByUnit();

  return (
    <Box m="15px" sx={{ backgroundColor: '#ffffff', padding: '20px' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: isMobile ? 'flex-start' : 'space-between', 
        alignItems: 'center', 
        marginBottom: 16 
      }}>
        <Title
          level={3}
          style={{
            textAlign: isMobile ? 'left' : 'center',
            fontSize: isMobile ? '18px' : isTablet ? '20px' : '24px',
            margin: 0,
            color: colors.grey[100],
          }}
        >
          Customer Managers - {organizationname || 'Organization'}
        </Title>
        <Button
          type="text"
          icon={<CloseOutlined style={{ fontSize: isMobile ? 17 : 20 }} />}
          onClick={() => navigate(-1)}
          style={{
            color: colors.blueAccent[1000],
            fontWeight: 600,
            fontSize: 16,
            alignSelf: 'flex-end',
            marginLeft: 8,
          }}
        />
      </div>

      {loading ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '200px' 
        }}>
          <Spin size="large" />
        </div>
      ) : cmData.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '40px' }}>
          <UserOutlined style={{ fontSize: 48, color: colors.grey[400], marginBottom: 16 }} />
          <Text style={{ fontSize: 16, color: colors.grey[600] }}>
            No Customer Managers found for this organization
          </Text>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {Object.keys(groupedData).map((unitName) => (
            <Col xs={24} sm={12} md={8} lg={6} key={unitName}>
              <Card
                hoverable
                style={{
                  cursor: 'pointer',
                  border: `1px solid ${colors.grey[200]}`,
                  borderRadius: 8,
                }}
                onClick={() => handleUnitClick(unitName)}
                bodyStyle={{ padding: '16px' }}
              >
                <div style={{ textAlign: 'center' }}>
                  <UserOutlined 
                    style={{ 
                      fontSize: 32, 
                      color: colors.blueAccent[1000], 
                      marginBottom: 8 
                    }} 
                  />
                  <Title level={5} style={{ margin: '8px 0', color: colors.grey[100] }}>
                    {unitName}
                  </Title>
                  <Text style={{ color: colors.grey[600] }}>
                    {groupedData[unitName].length} Customer Manager{groupedData[unitName].length !== 1 ? 's' : ''}
                  </Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal for showing CM data */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <UserOutlined style={{ color: colors.blueAccent[1000] }} />
            <span>Customer Managers - {selectedUnit}</span>
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Close
          </Button>
        ]}
        width={isMobile ? '95%' : '80%'}
        style={{ top: 20 }}
      >
        <Table
          dataSource={selectedUnitData}
          columns={cmTableColumns}
          rowKey="cmid"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} Customer Managers`,
          }}
          scroll={{ x: 800 }}
          size="small"
        />
      </Modal>
    </Box>
  );
};

export default CmDataByOrganization; 