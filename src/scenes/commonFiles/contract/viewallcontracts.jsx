import React, { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Chip,
    IconButton,
    useMediaQuery,
    Container
} from '@mui/material';
import { Table, Progress, Select as AntSelect } from 'antd';
import {
    Search,
    FilterList,
    MoreVert,
    CalendarToday,
    CloseOutlined
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import CustomTablePagination from '../../../components/CustomPagination';
import '../../../index.css';

const Viewallcontracts = () => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery("(max-width:484px)");
    const isTablet = useMediaQuery("(max-width: 700px)");
    
    // Pagination state
    const [page, setPage] = useState(0); // 0-based index
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filteredTickets, setFilteredTickets] = useState([]);
    
    // Search state
    const [searchTerm, setSearchTerm] = useState('');

    const contracts = [
        {
            key: '1',
            contractName: "Software License Agreement",
            contractId: "CT-2024-001",
            client: "Acme Corporation",
            clientType: "License",
            value: "$450,000",
            status: "Active",
            statusColor: "success",
            progress: 75,
            endDate: "2024-06-15"
        },
        {
            key: '2',
            contractName: "Service Level Agreement",
            contractId: "CT-2024-002",
            client: "TechStart Inc.",
            clientType: "Service",
            value: "$125,000",
            status: "Pending",
            statusColor: "warning",
            progress: 45,
            endDate: "2024-03-20"
        },
        {
            key: '3',
            contractName: "Master Service Agreement",
            contractId: "CT-2024-003",
            client: "Global Solutions Ltd",
            clientType: "Service",
            value: "$890,000",
            status: "Under Review",
            statusColor: "info",
            progress: 30,
            endDate: "2024-04-10"
        },
        {
            key: '4',
            contractName: "Data Processing Agreement",
            contractId: "CT-2024-004",
            client: "DataFlow Systems",
            clientType: "Data",
            value: "$320,000",
            status: "Active",
            statusColor: "success",
            progress: 60,
            endDate: "2024-08-25"
        },
        {
            key: '5',
            contractName: "Research Partnership",
            contractId: "CT-2024-005",
            client: "Innovation Labs",
            clientType: "Partnership",
            value: "$675,000",
            status: "Draft",
            statusColor: "default",
            progress: 15,
            endDate: "2024-12-01"
        },
        {
            key: '6',
            contractName: "Security Audit Agreement",
            contractId: "CT-2024-006",
            client: "SecureBank Corp",
            clientType: "Audit",
            value: "$200,000",
            status: "Expired",
            statusColor: "error",
            progress: 100,
            endDate: "2024-01-01"
        }
    ];

    // Initialize filteredTickets with contracts data
    React.useEffect(() => {
        setFilteredTickets(contracts);
    }, []);

    // Search filter function
    const handleSearchChange = (event) => {
        const searchValue = event.target.value.toLowerCase();
        setSearchTerm(searchValue);

        if (searchValue === "") {
            setFilteredTickets(contracts); // Reset to original data when search is cleared
        } else {
            const filtered = contracts.filter(
                (contract) =>
                    contract.contractName.toLowerCase().includes(searchValue) ||
                    contract.contractId.toLowerCase().includes(searchValue) ||
                    contract.client.toLowerCase().includes(searchValue) ||
                    contract.clientType.toLowerCase().includes(searchValue) ||
                    contract.status.toLowerCase().includes(searchValue)
            );
            setFilteredTickets(filtered);
        }
        setPage(0); // Reset to first page on search
    };

    const handleRowClick = (record) => {
        // Handle row click - navigate to contract details
        console.log('Clicked contract:', record);
        // navigate(`/contract-details/${record.contractId}`);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active':
                return '#4CAF50';
            case 'Pending':
                return '#FF9800';
            case 'Under Review':
                return '#2196F3';
            case 'Draft':
                return '#757575';
            case 'Expired':
                return '#f44336';
            default:
                return '#666666';
        }
    };

    const columns = [
        {
            title: 'Contract',
            dataIndex: 'contractName',
            key: 'contractName',
            render: (text, record) => (
                <Box>
                    <Typography sx={{
                        // fontWeight: 'bold',
                        fontSize: '11px',
                        color: '#1a1a1a',
                        mb: 0.5
                    }}>
                        {text}
                    </Typography>
                    <Typography sx={{
                        fontSize: '11px',
                        color: '#666666'
                    }}>
                        {record.contractId}
                    </Typography>
                </Box>
            ),
        },
        {
            title: 'Client',
            dataIndex: 'client',
            key: 'client',
            render: (text, record) => (
                <Box>
                    <Typography sx={{
                        // fontWeight: 'bold',
                        fontSize: '11px',
                        color: '#1a1a1a',
                        mb: 0.5
                    }}>
                        {text}
                    </Typography>
                    <Chip
                        label={record.clientType}
                        size="small"
                        sx={{
                            background: '#f0f0f0',
                            color: '#666666',
                            fontSize: '11px',
                            fontWeight: '500',
                            height: '20px'
                        }}
                    />
                </Box>
            ),
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
            align: 'right',
            render: (text) => (
                <Typography sx={{
                    // fontWeight: 'bold',
                    fontSize: '11px',
                    color: '#1a1a1a'
                }}>
                    {text}
                </Typography>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (text) => (
                <Chip
                    label={text}
                    size="small"
                    sx={{
                        background: getStatusColor(text) + '20',
                        color: getStatusColor(text),
                        fontSize: '11px',
                        fontWeight: '500',
                        border: `1px solid ${getStatusColor(text)}`
                    }}
                />
            ),
        },
        {
            title: 'Progress',
            dataIndex: 'progress',
            key: 'progress',
            render: (text) => (
                <Box sx={{ width: '100%' }}>
                    <Typography sx={{
                        fontSize: '11px',
                        color: '#666666',
                        mb: 1
                    }}>
                        {text}%
                    </Typography>
                    <Progress
                        percent={text}
                        size="small"
                        strokeColor="#2196F3"
                        trailColor="#e0e0e0"
                        showInfo={false}
                    />
                </Box>
            ),
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (text) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarToday sx={{ fontSize: 16, color: '#666666' }} />
                    <Typography sx={{
                        fontSize: '11px',
                        color: '#1a1a1a'
                    }}>
                        {text}
                    </Typography>
                </Box>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'right',
            render: () => (
                <IconButton size="small" sx={{ color: '#666666' }}>
                    <MoreVert />
                </IconButton>
            ),
        },
    ];

    // const handleStatusFilter = (status) => {
    //     setStatusFilter(status);
    //     setFilteredTickets(
    //       originalTickets.filter((item) =>
    //         status === "Active"
    //           ? (item.status || "").toLowerCase() === "active"
    //           : (item.status || "").toLowerCase() === "suspend"
    //       )
    //     );
    //     setPage(0); // Reset to first page on filter change
    //   };
    

    const paginatedData = filteredTickets.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );

    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", background: "#fff", padding: "10px", borderRadius: "8px", }}>
                <div style={{ flex: 1 }}>
                    <Typography
                        sx={{
                            textAlign: "left",
                            fontSize: isMobile ? "15px" : isTablet ? "17px" : "18px",
                            paddingLeft: isMobile ? "0px" : "30px",
                            marginBottom: "4px",
                            fontWeight: "bold"
                        }}
                    >
                        Contract Management
                    </Typography>
                    <Typography
                        sx={{
                            color: '#666666',
                            textAlign: "left",
                            fontSize: isMobile ? "13px" : isTablet ? "15px" : "17px",
                            paddingLeft: isMobile ? "0px" : "30px",
                        }}
                    >
                        Filter and manage your contracts
                    </Typography>
                </div>
                <Button
                    type="text"
                    startIcon={<CloseOutlined style={{ fontSize: 20 }} />}
                    onClick={() => navigate(-1)}
                    style={{
                        color: "#3e4396",
                        fontWeight: 600,
                        fontSize: 16,
                        alignSelf: "flex-start",
                        marginLeft: 8,
                    }}
                />
            </div>

            <Box
                sx={{
                    background: '#ffffff',
                    minHeight: '100vh',
                    padding: { xs: 2, md: 4 }
                }}
            >
                <Container maxWidth="xl">
                    {/* Search and Filter Bar */}
                    <Card
                        sx={{
                            background: 'white',
                            borderRadius: 3,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            border: '1px solid #e0e0e0',
                            mb: 4
                        }}
                    >
                        <CardContent >
                            <Box sx={{
                                display: 'flex',
                                gap: 2,
                                flexDirection: isMobile ? 'column' : 'row',
                                alignItems: isMobile ? 'stretch' : 'center'
                            }}>
                                {/* Search Bar */}
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    background: '#f5f5f5',
                                    borderRadius: 2,
                                    padding: '8px 16px',
                                    flex: 1,
                                    border: '1px solid #e0e0e0',
                                    height: '36px'
                                }}>
                                    <Search sx={{ color: '#666666', mr: 1 }} />
                                    <input
                                        type="text"
                                        placeholder="Search contracts, clients, or IDs..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        style={{
                                            border: 'none',
                                            background: 'transparent',
                                            outline: 'none',
                                            fontSize: '14px',
                                            color: '#666666',
                                            width: '100%',
                                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
                                        }}
                                    />
                                </Box>

                                {/* Status Dropdown */}
                                <AntSelect
                                    placeholder="All Status"
                                    style={{
                                        minWidth: isMobile ? '100%' : 120,
                                        height: '36px',
                                        background: '#f5f5f5',
                                        borderRadius: '8px',
                                        border: '1px solid #e0e0e0'
                                    }}
                                    options={[
                                        { value: '', label: 'All Status' },
                                        { value: 'active', label: 'Active' },
                                        { value: 'pending', label: 'Pending' },
                                        { value: 'review', label: 'Under Review' },
                                        { value: 'draft', label: 'Draft' },
                                        { value: 'expired', label: 'Expired' }
                                    ]}
                                />

                                {/* Type Dropdown */}
                                <AntSelect
                                    placeholder="All Types"
                                    style={{
                                        minWidth: isMobile ? '100%' : 120,
                                        height: '36px',
                                        background: '#f5f5f5',
                                        borderRadius: '8px',
                                        border: '1px solid #e0e0e0'
                                    }}
                                    options={[
                                        { value: '', label: 'All Types' },
                                        { value: 'license', label: 'License' },
                                        { value: 'service', label: 'Service' },
                                        { value: 'data', label: 'Data' },
                                        { value: 'partnership', label: 'Partnership' },
                                        { value: 'audit', label: 'Audit' }
                                    ]}
                                />

                                {/* Filters Button */}
                                <Button
                                    variant="outlined"
                                    startIcon={<FilterList />}
                                    sx={{
                                        borderColor: '#666666',
                                        color: '#666666',
                                        borderRadius: 2,
                                        px: 3,
                                        py: 1.5,
                                        background: '#f5f5f5',
                                        height: '36px',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        '&:hover': {
                                            borderColor: '#333333',
                                            background: '#e0e0e0'
                                        }
                                    }}
                                >
                                    Filters
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Contracts Table */}
                    <Box
                        sx={{
                            margin: "13px 0 0 0",
                            backgroundColor: "#ffffff",
                            borderRadius: "8px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            width: "100%",
                            overflowX: isMobile ? "auto" : "unset",
                        }}
                    >
                        <Table
                            dataSource={paginatedData}
                            columns={columns}
                            pagination={false}
                            onRow={(record) => ({
                                onClick: () => handleRowClick(record),
                                style: { cursor: "pointer" },
                            })}
                            bordered={false}
                            showHeader={true}
                            rowClassName={() => "custom-row"}
                            className="custom-ant-table-header"
                            scroll={isMobile ? { x: 700 } : false}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '8px'
                            }}
                        />
                        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginTop: "10px" }}>
                            <CustomTablePagination
                                count={filteredTickets.length}
                                page={page}
                                rowsPerPage={rowsPerPage}
                                onPageChange={newPage => setPage(newPage)}
                                onRowsPerPageChange={newRpp => {
                                    setRowsPerPage(newRpp);
                                    setPage(0);
                                }}
                                rowsPerPageOptions={[10, 20, 50, 100]}
                            />
                        </div>
                    </Box>
                </Container>
            </Box>

            <style>{`
                .custom-ant-table-header .ant-table-thead > tr {
                    background: linear-gradient(to bottom, #0A0A3D, #1C1C6B, #2E2E9F, #5050D4, #5050D4) !important;
                }

                .custom-ant-table-header .ant-table-thead > tr > th {
                    background: transparent !important;
                    color: #fff !important;
                    font-weight: bold !important;
                    font-size: 11px !important;
                    border-right: none !important;
                    border-bottom: none !important;
                    padding-top: 6px !important;
                    padding-bottom: 6px !important;
                    height: 36px !important;
                }

                .custom-row:hover td {
                    background: #e3e8ff !important;
                }

                .custom-ant-table-header .ant-table-thead > tr > th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before {
                    display: none !important;
                    background: none !important;
                    width: 0 !important;
                    content: none !important;
                }

                .ant-table-thead > tr > th {
                    border-bottom: none !important;
                }

                .ant-table-tbody > tr > td {
                    font-size: 11px !important;

                }

                /* Force override any conflicting styles */
                .custom-ant-table-header .ant-table-thead > tr > th {
                    background: transparent !important;
                    color: #fff !important;
                    font-weight: bold !important;
                    font-size: 11px !important;
                    border-right: none !important;
                    border-bottom: none !important;
                    padding-top: 6px !important;
                    padding-bottom: 6px !important;
                    height: 36px !important;
                }

                .custom-row:hover td {
                    background: #e3e8ff !important;
                }
            `}</style>
        </>
    );
};

export default Viewallcontracts;
