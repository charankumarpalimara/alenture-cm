import React, { useState } from 'react';
import {
    Table,
    Button,
    Select,
    Card,
    Tag,
    Space,
    Typography,
    Row,
    Col,
    theme
} from 'antd';
import {
    ExportOutlined,
    PlusOutlined,
    FilterOutlined,
    ReloadOutlined,
    EyeOutlined,
    EditOutlined,
    CloudOutlined,
    AppstoreOutlined,
    BarChartOutlined
} from '@ant-design/icons';
import { useTheme, useMediaQuery } from '@mui/material';
import { tokens } from '../../../theme';

const { Title, Text } = Typography;
const { Option } = Select;

const Account = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery("(max-width:484px)");
    const isTablet = useMediaQuery("(max-width: 700px)");
    const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
    const [selectedFunction, setSelectedFunction] = useState('All Functions');
    const [selectedTechnology, setSelectedTechnology] = useState('All Technologies');
    const [selectedComplexity, setSelectedComplexity] = useState('All Levels');

    // Mock data for the service matrix
    const serviceData = [
        {
            key: '1',
            serviceName: {
                name: 'Cloud Migration',
                description: 'Infrastructure modernization',
                icon: <CloudOutlined style={{ fontSize: '11px', color: '#1890ff' }} />
            },
            industry: { label: 'Healthcare', color: 'purple' },
            function: { label: 'Technology', color: 'green' },
            technology: { label: 'Cloud', color: 'blue' },
            complexity: { label: 'Advanced', color: 'orange' },
            duration: '6-12 months',
            status: { label: 'Active', color: 'green' },
            actions: ['view', 'edit']
        },
        {
            key: '2',
            serviceName: {
                name: 'AI Implementation',
                description: 'Machine learning solutions',
                icon: <AppstoreOutlined style={{ fontSize: '20px', color: '#722ed1' }} />
            },
            industry: { label: 'Financial', color: 'pink' },
            function: { label: 'Operations', color: 'red' },
            technology: { label: 'AI/ML', color: 'default' },
            complexity: { label: 'Expert', color: 'red' },
            duration: '8-18 months',
            status: { label: 'Active', color: 'green' },
            actions: ['view', 'edit']
        },
        {
            key: '3',
            serviceName: {
                name: 'Data Platform',
                description: 'Business intelligence platform',
                icon: <BarChartOutlined style={{ fontSize: '20px', color: '#52c41a' }} />
            },
            industry: { label: 'Telecom', color: 'default' },
            function: { label: '', color: '' },
            technology: { label: '', color: '' },
            complexity: { label: 'Intermediate', color: 'blue' },
            duration: '4-8 months',
            status: { label: 'Planning', color: 'orange' },
            actions: ['view', 'edit']
        },
        {
            key: '4',
            serviceName: {
                name: 'Cyber Security Services',
                description: 'Business intelligence platform',
                icon: <BarChartOutlined style={{ fontSize: '20px', color: '#52c41a' }} />
            },
            industry: { label: 'Insurance', color: 'default' },
            function: { label: '', color: '' },
            technology: { label: '', color: '' },
            complexity: { label: 'Intermediate', color: 'blue' },
            duration: '4-8 months',
            status: { label: 'Planning', color: 'orange' },
            actions: ['view', 'edit']
        },
        {
            key: '4',
            serviceName: {
                name: 'Voice AI',
                description: 'Business intelligence platform',
                icon: <BarChartOutlined style={{ fontSize: '20px', color: '#52c41a' }} />
            },
            industry: { label: 'Manufacturing', color: 'default' },
            function: { label: '', color: '' },
            technology: { label: '', color: '' },
            complexity: { label: 'Intermediate', color: 'blue' },
            duration: '4-8 months',
            status: { label: 'Planning', color: 'orange' },
            actions: ['view', 'edit']
        }
    ];

    const columns = [
        {
            title: 'Service Name',
            dataIndex: 'serviceName',
            key: 'serviceName',
            render: (serviceName) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {serviceName.icon}
                    <div>
                        <div style={{
                            // fontWeight: 'bold', 
                            // fontSize: '16px',
                            color: '#1a1a1a'
                        }}>
                            {serviceName.name}
                        </div>
                        <div style={{
                            // fontSize: '12px', 
                            color: '#666666',
                            lineHeight: 1.2
                        }}>
                            {serviceName.description}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Industry',
            dataIndex: 'industry',
            key: 'industry',
            render: (industry) => industry.label ? (
                <Tag color={industry.color} style={{ fontSize: "11px", borderRadius: "10px" }}>{industry.label}</Tag>
            ) : '-',
        },
        {
            title: 'Function',
            dataIndex: 'function',
            key: 'function',
            render: (func) => func.label ? (
                <Tag color={func.color}  style={{ fontSize: "11px", borderRadius: "10px" }}>{func.label}</Tag>
            ) : '-',
        },
        {
            title: 'Technology',
            dataIndex: 'technology',
            key: 'technology',
            render: (tech) => tech.label ? (
                <Tag color={tech.color}  style={{ fontSize: "11px", borderRadius: "10px" }}>{tech.label}</Tag>
            ) : '-',
        },
        {
            title: 'Complexity',
            dataIndex: 'complexity',
            key: 'complexity',
            render: (complexity) => complexity.label ? (
                <Tag color={complexity.color}  style={{ fontSize: "11px", borderRadius: "10px" }}>{complexity.label}</Tag>
            ) : '-',
        },
        {
            title: 'Duration',
            dataIndex: 'duration',
            key: 'duration',
            render: (duration) => (
                <span style={{
                    fontSize: '13px',
                    color: '#666666'
                }}>
                    {duration}
                </span>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => status.label ? (
                <Tag color={status.color}  style={{ fontSize: "11px", borderRadius: "10px" }}>{status.label}</Tag>
            ) : '-',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        size="small"
                        title="View Details"
                        style={{ fontSize: '11px' }}
                    />
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        size="small"
                        title="Edit"
                        style={{ fontSize: '11px' }}
                    />
                </Space>
            ),
        },
    ];

    const handleApplyFilters = () => {
        console.log('Filters applied:', {
            industry: selectedIndustry,
            function: selectedFunction,
            technology: selectedTechnology,
            complexity: selectedComplexity
        });
    };

    const handleResetFilters = () => {
        setSelectedIndustry('All Industries');
        setSelectedFunction('All Functions');
        setSelectedTechnology('All Technologies');
        setSelectedComplexity('All Levels');
    };

    return (
        <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            {/* Header Section */}
            <Card style={{ marginBottom: '24px' }}>
                <Row justify="space-between" align="middle">
                    <Col>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                backgroundColor: '#1890ff',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative'
                            }}>
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: 'white',
                                    borderRadius: '4px'
                                }} />
                                <div style={{
                                    position: 'absolute',
                                    bottom: '2px',
                                    right: '2px',
                                    width: '12px',
                                    height: '12px',
                                    backgroundColor: '#52c41a',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '8px',
                                    fontWeight: 'bold'
                                }}>
                                    +
                                </div>
                            </div>
                            <div>
                                <Title

                                    style={{
                                        textAlign: "left",
                                        fontSize: isMobile ? "15px" : isTablet ? "17px" : "18px",
                                        paddingLeft: isMobile ? "0px" : "0px",
                                        marginBottom: "4px",
                                        fontWeight: "bold"
                                    }}
                                >
                                    Service Matrix
                                </Title>
                                <Text
                                    style={{
                                        color: '#666666',
                                        textAlign: "left",
                                        fontSize: isMobile ? "13px" : isTablet ? "15px" : "17px",
                                        paddingLeft: isMobile ? "0px" : "0px",
                                        lineHeight: 1.2
                                    }}

                                >
                                    Browse our collection of services and offerings
                                </Text>
                            </div>
                        </div>
                    </Col>
                    <Col>
                        <Space>
                            <Button
                                icon={<ExportOutlined />}
                                style={{
                                    fontSize: '13px',
                                    color: '#666666'
                                }}
                            >
                                Export
                            </Button>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                style={{
                                    background: colors.blueAccent[1000],
                                    fontSize: '13px'
                                }}
                            >
                                + Add Service
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Card>

            {/* Filter Parameters Section */}
            <Card
                title={
                    <span 
                        //  className='custom-headding-16px'
                    style={{
                        // textAlign: "left",
                        fontSize: isMobile ? "15px" : isTablet ? "17px" : "18px",
                        paddingLeft: "0px !important",
                        marginBottom: "4px",
                        fontWeight: "500",
                        color: '#1a1a1a'
                    
                    }}
                    >
                        Filter Parameters
                    </span>
                }
                style={{ marginBottom: '24px' }}
            >
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={6}>
                        <div style={{ marginBottom: '8px' }}>
                            <Text style={{
                                fontSize: '11px',
                                fontWeight: 'bold',
                                color: '#1a1a1a'
                            }}>
                                Industry
                            </Text>
                        </div>
                        <Select
                            value={selectedIndustry}
                            onChange={setSelectedIndustry}
                            style={{ width: '100%' }}
                            placeholder="Select Industry"
                            dropdownStyle={{ fontSize: '11px' }}
                        >
                            <Option value="All Industries" style={{ fontSize: '11px' }}>All Industries</Option>
                            <Option value="Healthcare" style={{ fontSize: '11px' }}>Healthcare</Option>
                            <Option value="Financial" style={{ fontSize: '11px' }}>Financial</Option>
                            <Option value="Manufacturing" style={{ fontSize: '11px' }}>Manufacturing</Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <div style={{ marginBottom: '8px' }}>
                            <Text style={{
                             fontSize: '11px',
                                fontWeight: 'bold',
                                color: '#1a1a1a'
                            }}>
                                Function
                            </Text>
                        </div>
                        <Select
                            value={selectedFunction}
                            onChange={setSelectedFunction}
                            style={{ width: '100%' }}
                            placeholder="Select Function"
                            dropdownStyle={{ fontSize: '11px' }}
                        >
                            <Option value="All Functions" style={{ fontSize: '11px' }}>All Functions</Option>
                            <Option value="Technology" style={{ fontSize: '11px' }}>Technology</Option>
                            <Option value="Operations" style={{ fontSize: '11px' }}>Operations</Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <div style={{ marginBottom: '8px' }}>
                            <Text style={{
                                          fontSize: '11px',
                                fontWeight: 'bold',
                                color: '#1a1a1a'
                            }}>
                                Technology
                            </Text>
                        </div>
                        <Select
                            value={selectedTechnology}
                            onChange={setSelectedTechnology}
                            style={{ width: '100%' }}
                            placeholder="Select Technology"
                            dropdownStyle={{ fontSize: '11px' }}
                        >
                            <Option value="All Technologies" style={{ fontSize: '11px' }}>All Technologies</Option>
                            <Option value="Cloud" style={{ fontSize: '11px' }}>Cloud</Option>
                            <Option value="AI/ML" style={{ fontSize: '11px' }}>AI/ML</Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <div style={{ marginBottom: '8px' }}>
                            <Text style={{
                                  fontSize: '11px',
                                fontWeight: 'bold',
                                color: '#1a1a1a'
                            }}>
                                Complexity
                            </Text>
                        </div>
                        <Select
                            value={selectedComplexity}
                            onChange={setSelectedComplexity}
                            style={{ width: '100%' }}
                            placeholder="Select Complexity"
                            dropdownStyle={{ fontSize: '11px' }}
                        >
                            <Option value="All Levels" style={{ fontSize: '11px' }}>All Levels</Option>
                            <Option value="Intermediate" style={{ fontSize: '11px' }}>Intermediate</Option>
                            <Option value="Advanced" style={{ fontSize: '11px' }}>Advanced</Option>
                            <Option value="Expert" style={{ fontSize: '11px' }}>Expert</Option>
                        </Select>
                    </Col>
                </Row>

                <Row style={{ marginTop: '16px' }}>
                    <Col>
                        <Space>
                            <Button
                                className='form-button'
                                type="primary"
                                style={{
                                    background: colors.blueAccent[1000],
                                    fontSize: '13px'
                                }}
                                icon={<FilterOutlined />}
                                onClick={handleApplyFilters}
                            >
                                Apply Filters
                            </Button>
                            <Button
                                className='form-button'
                                icon={<ReloadOutlined />}
                                onClick={handleResetFilters}
                                style={{
                                    fontSize: '13px',
                                    color: '#666666'
                                }}
                            >
                                Reset
                            </Button>
                        </Space>
                    </Col>
                    <Col style={{ marginLeft: 'auto' }}>
                        <Text style={{
                            fontSize: '12px',
                            color: '#666666'
                        }}>
                            Showing 24 of 156 services
                        </Text>
                    </Col>
                </Row>
            </Card>

            {/* Service Offering Matrix Section */}
            <Card
                title={
                    <span
                    // className='custom-headding-16px'
                        style={{
                            textAlign: "left",
                            fontSize: isMobile ? "15px" : isTablet ? "17px" : "18px",
                            paddingLeft: isMobile ? "0px" : "0px",
                            marginBottom: "4px",
                            fontWeight: "500",
                            color: '#1a1a1a'
                        }}

                    >
                        Service Offering Matrix
                    </span>
                }
            >
                <Table
                    className="custom-ant-table-header"
                    rowClassName={() => "custom-row"}
                    columns={columns}
                    dataSource={serviceData}
                    pagination={false}
                    scroll={{ x: 1200 }}
                    size="middle"
                />
            </Card>
        </div>
    );
};

export default Account;
