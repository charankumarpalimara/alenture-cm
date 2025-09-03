import React, { useState } from 'react';
import {
    Table,
    Button,
    Select,
    Card,
    Space,
    Typography,
    Row,
    Col
} from 'antd';
import {
    ExportOutlined,
    PlusOutlined,
    FilterOutlined,
    ReloadOutlined
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

    // Mock data for the service matrix based on Excel table
    const serviceData = [
        {
            key: '1',
            sno: '1',
            accountIndustry: 'Banking, Manufacturing',
            productServices: 'Cloud Migration',
            description: 'Decision Making, Innovation',
            industry: 'Small,Medium,Large,Startups',
            function: 'Cost Savings, Agility',
            segments: 'Cloud Security, FinOps',
            businessValueDriver: 'Cost Savings, Agility',
            adjacencyExpansion: 'Cloud Security, FinOps'
        },
        {
            key: '2',
            sno: '2',
            accountIndustry: 'Banking',
            productServices: 'AI/ML Solutions',
            description: 'Revenue Growth, Innovation',
            industry: '',
            function: '',
            segments: 'AI Ops, Intelligent Automation',
            businessValueDriver: 'Revenue Growth, Innovation',
            adjacencyExpansion: 'AI Ops, Intelligent Automation'
        },
        {
            key: '3',
            sno: '3',
            accountIndustry: 'Insurance',
            productServices: 'Cybersecurity Services',
            description: 'Risk Reduction, Compliance',
            industry: '',
            function: '',
            segments: 'Managed Security, Zero Trust',
            businessValueDriver: 'Risk Reduction, Compliance',
            adjacencyExpansion: 'Managed Security, Zero Trust'
        },
        {
            key: '4',
            sno: '4',
            accountIndustry: 'Manufacturing',
            productServices: 'Voice AI',
            description: 'Customer Experience, Revenue Growth',
            industry: '',
            function: '',
            segments: 'Conversational Analytics, Multilingual Bots',
            businessValueDriver: 'Customer Experience, Revenue Growth',
            adjacencyExpansion: 'Conversational Analytics, Multilingual Bots'
        },
        {
            key: '5',
            sno: '5',
            accountIndustry: 'Telecom',
            productServices: 'Data Platform',
            description: 'Decision Making, Innovation',
            industry: '',
            function: '',
            segments: 'AI/ML Use Cases, Data Governance',
            businessValueDriver: 'Decision Making, Innovation',
            adjacencyExpansion: 'AI/ML Use Cases, Data Governance'
        }
    ];

    const columns = [
        {
            title: 'S.No',
            dataIndex: 'sno',
            key: 'sno',
            width: 60,
            render: (sno) => (
                <span style={{ fontSize: '11px', color: '#666666' }}>
                    {sno}
                </span>
            ),
        },
        {
            title: 'Account Industry',
            dataIndex: 'accountIndustry',
            key: 'accountIndustry',
            render: (accountIndustry) => (
                <span style={{ fontSize: '11px', color: '#1a1a1a' }}>
                    {accountIndustry}
                </span>
            ),
        },
        {
            title: 'Product/Services',
            dataIndex: 'productServices',
            key: 'productServices',
            render: (productServices) => (
                <span style={{ fontSize: '11px', color: '#1a1a1a' }}>
                    {productServices}
                </span>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (description) => (
                <span style={{ fontSize: '11px', color: '#666666' }}>
                    {description}
                </span>
            ),
        },
        {
            title: 'Industry',
            dataIndex: 'industry',
            key: 'industry',
            render: (industry) => (
                <span style={{ fontSize: '11px', color: '#1a1a1a' }}>
                    {industry}
                </span>
            ),
        },
        {
            title: 'Function',
            dataIndex: 'function',
            key: 'function',
            render: (func) => (
                <span style={{ fontSize: '11px', color: '#1a1a1a' }}>
                    {func}
                </span>
            ),
        },
        {
            title: 'Segment(s)',
            dataIndex: 'segments',
            key: 'segments',
            render: (segments) => (
                <span style={{ fontSize: '11px', color: '#1a1a1a' }}>
                    {segments}
                </span>
            ),
        },
        {
            title: 'Business Value Driver',
            dataIndex: 'businessValueDriver',
            key: 'businessValueDriver',
            render: (businessValueDriver) => (
                <span style={{ fontSize: '11px', color: '#1a1a1a' }}>
                    {businessValueDriver}
                </span>
            ),
        },
        {
            title: 'Adjacency Expansion',
            dataIndex: 'adjacencyExpansion',
            key: 'adjacencyExpansion',
            render: (adjacencyExpansion) => (
                <span style={{ fontSize: '11px', color: '#1a1a1a' }}>
                    {adjacencyExpansion}
                </span>
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
                                    Product Service Matrix Ver 0.1
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
                                    Decision Making, Innovation
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
                             Add Service
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
                            Showing 5 of 5 services
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
