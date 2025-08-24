import React, { useState } from 'react';
import {
    Box,
    Typography,
    Container,
    useTheme,
    useMediaQuery,
    Card,
    CardContent,
    Grid,
    Button,
    Chip,
    IconButton,
    InputBase,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import { Table as AntTable, Progress } from 'antd';
import {
    Visibility,
    AttachMoney,
    Schedule,
    TrendingUp,
    Download,
    FilterList,
    Business,
    Person,
    Search
} from '@mui/icons-material';
import { tokens } from '../../../theme';
import '../../../index.css';
import CustomTablePagination from '../../../components/CustomPagination';

const ContractAnalysis = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery("(max-width:484px)");
    const isTablet = useMediaQuery("(max-width: 700px)");

    // State for search and filter
    const [searchTerm, setSearchTerm] = useState('');
    const [filterReason, setFilterReason] = useState('All Reasons');
    
    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Summary metrics data
    const summaryMetrics = [
        {
            title: "Total Lost Contracts",
            value: "147",
            trend: "+12% from last quarter",
            icon: <Visibility />,
            iconColor: "#4b5563"
        },
        {
            title: "Lost Revenue",
            value: "$2.4M",
            subtitle: "$340K avg per contract",
            icon: <AttachMoney />,
            iconColor: "#4b5563"
        },
        {
            title: "Avg Contract Duration",
            value: "18 mo",
            subtitle: "Before termination",
            icon: <Schedule />,
            iconColor: "#4b5563"
        },
        {
            title: "Recovery Rate",
            value: "23%",
            subtitle: "Won back within 12mo",
            icon: <TrendingUp />,
            iconColor: "#4b5563"
        }
    ];

    // Top loss reasons data
    const lossReasons = [
        { reason: "Pricing/Budget Constraints", percentage: 34 },
        { reason: "Competitor Won", percentage: 28 },
        { reason: "Service Issues", percentage: 18 },
        { reason: "Internal Changes", percentage: 12 },
        { reason: "Other", percentage: 8 }
    ];

    // Recent lost contracts data
    const lostContracts = [
        {
            account: "TechCorp Solutions (Enterprise)",
            contractValue: "$450,000",
            duration: "24 months",
            lossReason: "Pricing",
            lostDate: "Jan 15, 2025",
            accountManager: "Sarah Johnson"
        },
        {
            account: "Global Industries (Mid-Market)",
            contractValue: "$280,000",
            duration: "18 months",
            lossReason: "Competitor",
            lostDate: "Jan 12, 2025",
            accountManager: "Mike Chen"
        }
    ];

    return (
        <Box
            sx={{
                background: '#ffffff',
                minHeight: '100vh',
                padding: { xs: 2, md: 4 }
            }}
        >
            <Container maxWidth="xl">
                {/* Header */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 4,
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: 2
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", background: "#fff", padding: "10px", borderRadius: "8px", }}>
                        <div style={{ flex: 1 }}>
                            <Typography
                                sx={{
                                    textAlign: "left",
                                    fontSize: isMobile ? "15px" : isTablet ? "17px" : "18px",
                                    // paddingLeft: isMobile ? "0px" : "30px",
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
                                    // paddingLeft: isMobile ? "0px" : "30px",
                                }}
                            >
                                Filter and manage your contracts
                            </Typography>
                        </div>
                        {/* <Button
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
                /> */}
                    </div>
                    <Box sx={{ display: 'flex', gap: 2, flexDirection: isMobile ? 'column' : 'row' }}>
                        <Button
                            variant="outlined"
                            startIcon={<Download />}
                            sx={{
                                border: '1px solid #e0e0e0',
                                color: '#666666',
                                borderRadius: 2,
                                // px: 3,
                                // py: 1.5,
                                '&:hover': {
                                    borderColor: '#666666',
                                    backgroundColor: '#f5f5f5'
                                }
                            }}
                        >
                            Export Report
                        </Button>
                        <Button
                            variant="contained"
                            endIcon={<FilterList />}
                            sx={{
                                background: colors.blueAccent[1000],
                                color: 'white',
                                borderRadius: 2,
                                // px: 3,
                                // py: 1.5,
                                // '&:hover': {
                                //   background: '#333333'
                                // }
                            }}
                        >
                            Add Filter
                        </Button>
                    </Box>
                </Box>

                {/* Summary Metrics Cards */}
                <Grid container spacing={isMobile ? 0 : 3} sx={{ mb: 4 }}>
                    {summaryMetrics.map((metric, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card
                                sx={{
                                    background: 'white',
                                    borderRadius: 1,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    border: '1px solid #e0e0e0',
                                    height: '80%',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                <CardContent sx={{
                                    p: 3,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography sx={{ color: '#666666', fontSize: '14px', mb: 1, minHeight: '20px' }}>
                                                {metric.title}
                                            </Typography>
                                            <Typography sx={{
                                                color: '#1a1a1a',
                                                fontWeight: 'bold',
                                                fontSize: isMobile ? "15px" : "15px",
                                                mb: 1,
                                                minHeight: '20px'
                                            }}>
                                                {metric.value}
                                            </Typography>
                                            <Box sx={{ minHeight: '32px', display: 'flex', alignItems: 'center' }}>
                                                {metric.subtitle ? (
                                                    <Typography sx={{
                                                        color: '#666666',
                                                        fontSize: '12px',
                                                        mb: 0
                                                    }}>
                                                        {metric.subtitle}
                                                    </Typography>
                                                ) : (
                                                    <Typography sx={{
                                                        color: '#4CAF50',
                                                        fontSize: '12px',
                                                        fontWeight: '500'
                                                    }}>
                                                        {metric.trend}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>
                                        <Box sx={{
                                            background: metric.iconColor + '20',
                                            borderRadius: '50%',
                                            width: 48,
                                            height: 48,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            <Box sx={{ color: metric.iconColor }}>
                                                {metric.icon}
                                            </Box>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Main Content Panels */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {/* Top Loss Reasons */}
                    <Grid item xs={12} lg={6}>
                        <Card
                            sx={{
                                background: 'white',
                                borderRadius: 3,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                border: '1px solid #e0e0e0',
                                height: '100%'
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Typography
                                    className='custom-headding-16px'
                                    sx={{
                                        // fontSize: isMobile ? "18px" : "20px",
                                        paddingLeft: '0px !important',
                                        fontWeight: "bold",
                                        color: '#1a1a1a',
                                        mb: 3
                                    }}
                                //   sx={{
                                //     fontSize: isMobile ? "16px" : "18px",
                                //     fontWeight: "bold",
                                //     color: '#1a1a1a',
                                //     mb: 3
                                //   }}
                                >
                                    Top Loss Reasons
                                </Typography>
                                <Box>
                                    {lossReasons.map((item, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 2,
                                                mb: 2,
                                                p: 1.5,
                                                borderRadius: 2,
                                                '&:hover': {
                                                    background: '#f5f5f5',
                                                    transition: 'background 0.3s ease'
                                                }
                                            }}
                                        >
                                            <Box sx={{
                                                width: 10,
                                                height: 10,
                                                borderRadius: 2,
                                                background: '#4b5563',
                                                flexShrink: 0
                                            }} />
                                            <Box sx={{ flex: 1 }}>
                                                <Typography sx={{
                                                    fontSize: '11px',
                                                    color: '#1a1a1a',
                                                    fontWeight: '500'
                                                }}>
                                                    {item.reason}
                                                </Typography>
                                            </Box>
                                            <Typography sx={{
                                                color: '#666666',
                                                fontSize: '11px',
                                                fontWeight: 'bold'
                                            }}>
                                                {item.percentage}%
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Loss Timeline Trend */}
                    <Grid item xs={12} lg={6}>
                        <Card
                            sx={{
                                background: 'white',
                                borderRadius: 3,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                border: '1px solid #e0e0e0',
                                height: '100%'
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Typography
                                    // sx={{
                                    //     fontSize: isMobile ? "16px" : "18px",
                                    //     fontWeight: "bold",
                                    //     color: '#1a1a1a',
                                    //     mb: 3
                                    // }}

                                    className='custom-headding-16px'
                                    sx={{
                                        // fontSize: isMobile ? "18px" : "20px",
                                        paddingLeft: '0px !important',
                                        fontWeight: "bold",
                                        color: '#1a1a1a',
                                        mb: 3
                                    }}
                                >
                                    Loss Timeline Trend
                                </Typography>
                                <Box
                                    sx={{
                                        height: 200,
                                        border: '2px dashed #e0e0e0',
                                        borderRadius: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: '#fafafa'
                                    }}
                                >
                                    <TrendingUp sx={{ fontSize: 48, color: '#cccccc', mb: 2 }} />
                                    <Typography sx={{
                                        color: '#999999',
                                        fontSize: '14px',
                                        textAlign: 'center'
                                    }}>
                                        Timeline Chart<br />
                                        Q1 2024 - Q4 2024
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Recent Lost Contracts Table */}
                <Card
                    sx={{
                        background: 'white',
                        borderRadius: 3,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        border: '1px solid #e0e0e0'
                    }}
                >
                    <CardContent sx={{ p: 3 }}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 3,
                            flexDirection: isMobile ? 'column' : 'row',
                            gap: 2
                        }}>
                            <Typography
                                className='custom-headding-16px'
                                sx={{
                                    // fontSize: isMobile ? "18px" : "20px",
                                    paddingLeft: '0px !important',
                                    fontWeight: "bold",
                                    color: '#1a1a1a',
                                    // mb: 3
                                }}
                            >
                                Recent Lost Contracts
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, flexDirection: isMobile ? 'column' : 'row' }}>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    background: 'white',
                                    borderRadius: 2,
                                    padding: '5px 16px',
                                    border: '1px solid #e0e0e0',
                                    minWidth: 200
                                }}>
                                    <Search sx={{ color: '#666666', mr: 1 }} />
                                    <InputBase
                                        placeholder="Search contracts..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        sx={{
                                            fontSize: '14px',
                                            color: '#666666',
                                            width: '100%'
                                        }}
                                    />
                                </Box>
                                <FormControl sx={{ minWidth: 150 }}>
                                    <InputLabel sx={{ fontSize: '14px', color: '#666666' }}>All Reasons</InputLabel>
                                    <Select
                                        value={filterReason}
                                        onChange={(e) => setFilterReason(e.target.value)}
                                        label="All Reasons"
                                        sx={{
                                            fontSize: '14px',
                                            height: '40px'
                                        }}
                                    >
                                        <MenuItem value="All Reasons">All Reasons</MenuItem>
                                        <MenuItem value="Pricing">Pricing</MenuItem>
                                        <MenuItem value="Competitor">Competitor</MenuItem>
                                        <MenuItem value="Service Issues">Service Issues</MenuItem>
                                        <MenuItem value="Internal Changes">Internal Changes</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>

                        {/* Table */}
                        <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden' }}>
                            <AntTable
                                dataSource={lostContracts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}

                                columns={[
                                    {
                                        title: 'ACCOUNT',
                                        dataIndex: 'account',
                                        key: 'account',
                                        render: (text) => (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Business sx={{ fontSize: 16, color: '#666666' }} />
                                                <Typography sx={{ fontSize: '12px', color: '#1a1a1a' }}>
                                                    {text}
                                                </Typography>
                                            </Box>
                                        ),
                                        className: 'custom-ant-table-header'
                                    },
                                    {
                                        title: 'CONTRACT VALUE',
                                        dataIndex: 'contractValue',
                                        key: 'contractValue',
                                        render: (text) => (
                                            <Typography sx={{ fontSize: '12px', color: '#1a1a1a', fontWeight: '500' }}>
                                                {text}
                                            </Typography>
                                        ),
                                        className: 'custom-ant-table-header'
                                    },
                                    {
                                        title: 'DURATION',
                                        dataIndex: 'duration',
                                        key: 'duration',
                                        render: (text) => (
                                            <Typography sx={{ fontSize: '12px', color: '#666666' }}>
                                                {text}
                                            </Typography>
                                        ),
                                        className: 'custom-ant-table-header'
                                    },
                                    {
                                        title: 'LOSS REASON',
                                        dataIndex: 'lossReason',
                                        key: 'lossReason',
                                        render: (text) => (
                                            <Chip
                                                label={text}
                                                size="small"
                                                sx={{
                                                    background: '#f0f0f0',
                                                    color: '#666666',
                                                    fontSize: '11px',
                                                    fontWeight: '500'
                                                }}
                                            />
                                        ),
                                        className: 'custom-ant-table-header'
                                    },
                                    {
                                        title: 'LOST DATE',
                                        dataIndex: 'lostDate',
                                        key: 'lostDate',
                                        render: (text) => (
                                            <Typography sx={{ fontSize: '12px', color: '#666666' }}>
                                                {text}
                                            </Typography>
                                        ),
                                        className: 'custom-ant-table-header'
                                    },
                                    {
                                        title: 'ACCOUNT MANAGER',
                                        dataIndex: 'accountManager',
                                        key: 'accountManager',
                                        render: (text) => (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Person sx={{ fontSize: 16, color: '#666666' }} />
                                                <Typography sx={{ fontSize: '12px', color: '#1a1a1a' }}>
                                                    {text}
                                                </Typography>
                                            </Box>
                                        ),
                                        className: 'custom-ant-table-header'
                                    },
                                    {
                                        title: 'ACTIONS',
                                        key: 'actions',
                                        render: () => (
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Button
                                                    size="small"
                                                    sx={{
                                                        color: colors.blueAccent[1000],
                                                        fontSize: '11px',
                                                        textTransform: 'none',
                                                        p: 0,
                                                        minWidth: 'auto'
                                                    }}
                                                >
                                                    View Details
                                                </Button>
                                                <Button
                                                    size="small"
                                                    sx={{
                                                        color: colors.blueAccent[1000],
                                                        fontSize: '11px',
                                                        textTransform: 'none',
                                                        p: 0,
                                                        minWidth: 'auto'
                                                    }}
                                                >
                                                    Recovery Plan
                                                </Button>
                                            </Box>
                                        ),
                                        className: 'custom-ant-table-header'
                                    }
                                ]}
                                pagination={false}
                                size="small"
                                rowClassName={() => "custom-row"}
                                className="custom-ant-table-header"
                                style={{
                                    fontSize: '11px'
                                }}
                            />
                        </Box>

                        {/* Pagination */}
                        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginTop: "10px" }}>
                            <CustomTablePagination
                                count={lostContracts.length}
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
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default ContractAnalysis;
