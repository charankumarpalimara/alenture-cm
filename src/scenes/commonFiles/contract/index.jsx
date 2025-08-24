import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
    Chip,
    IconButton,
    useTheme,
    useMediaQuery,
    Container,
    // Avatar,
    // List,
    // ListItem,
    // ListItemText,
    // ListItemIcon
} from '@mui/material';
import {
    Search,
    Notifications,
    TrendingUp,
    TrendingDown,
    Description,
    // Refresh,
    AttachMoney,
    ArrowForward,
    CalendarToday,
    Group,
    Warning,
    Schedule,
    CheckCircle,
    Pending,
    CloseOutlined
} from '@mui/icons-material';
// import {
//     Star,
//     CalendarToday,
//     Edit,
//     FilterList,
//     MoreVert,
//     CloseOutlined
// } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../../../theme';

const Contract = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const isMobile = useMediaQuery("(max-width:484px)");
    const isTablet = useMediaQuery("(max-width: 700px)");

    const summaryCards = [
        {
            title: "Total Contracts",
            value: "248",
            trend: "+12% vs last month",
            trendColor: "success",
            icon: <Description />,
            iconColor: "#4b5563"
        },
        {
            title: "Active Contracts",
            value: "186",
            trend: "+0% currently active",
            trendColor: "success",
            icon: <CheckCircle />,
            iconColor: "#4b5563"
        },
        {
            title: "Pending Review",
            value: "23",
            trend: "-15% awaiting approval",
            trendColor: "error",
            icon: <Pending />,
            iconColor: "#4b5563"
        },
        {
            title: "Total Value",
            value: "$2.4M",
            trend: "+22% contract value",
            trendColor: "success",
            icon: <AttachMoney />,
            iconColor: "#4b5563"
        }
    ];

    const recentContracts = [
        {
            company: "Acme Corporation",
            contractId: "CT-2024-001",
            value: "$450,000",
            dueDate: "2024-06-15",
            status: "Active",
            statusColor: "success"
        },
        {
            company: "TechStart Inc.",
            contractId: "CT-2024-002",
            value: "$125,000",
            dueDate: "2024-03-20",
            status: "Pending",
            statusColor: "warning"
        },
        {
            company: "Global Solutions Ltd",
            contractId: "CT-2024-003",
            value: "$890,000",
            dueDate: "2024-04-10",
            status: "Under Review",
            statusColor: "info"
        },
        {
            company: "DataFlow Systems",
            contractId: "CT-2024-004",
            value: "$320,000",
            dueDate: "2024-08-25",
            status: "Active",
            statusColor: "success"
        }
    ];

    const upcomingMilestones = [
        {
            title: "Contract Renewal - Acme Corp",
            date: "Mar 15, 2024",
            color: "#f44336"
        },
        {
            title: "Payment Due - TechStart Inc.",
            date: "Mar 18, 2024",
            color: "#ff9800"
        },
        {
            title: "Review Meeting - Global Solutions",
            date: "Mar 22, 2024",
            color: "#2196f3"
        },
        {
            title: "Contract Expiry - DataFlow",
            date: "Mar 28, 2024",
            color: "#9e9e9e"
        }
    ];

    const quickActions = [
        {
            title: "Create Contract",
            icon: <Description />,
            color: "#666666"
        },
        {
            title: "Add Account",
            icon: <Group />,
            color: "#666666"
        },
        {
            title: "Schedule Review",
            icon: <Schedule />,
            color: "#666666"
        },
        {
            title: "Risk Assessment",
            icon: <Warning />,
            color: "#666666"
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
                    alignItems: 'center',
                    mb: 4,
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: 2
                }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        flex: 1,
                        maxWidth: isMobile ? '100%' : '400px'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            background: 'white',
                            borderRadius: 2,
                            padding: '8px 16px',
                            flex: 1,
                            border: '1px solid #e0e0e0'
                        }}>
                            <Search sx={{ color: '#666666', mr: 1 }} />
                            <Typography sx={{ color: '#666666', fontSize: '14px' }}>
                                Search contracts, accounts...
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {/* <IconButton sx={{ position: 'relative' }}>
                            <Notifications />
                            <Box sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                background: '#f44336',
                                color: 'white',
                                borderRadius: '50%',
                                width: 16,
                                height: 16,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '10px'
                            }}>
                                3
                            </Box>
                        </IconButton> */}
                        <Button
                            variant="contained"
                            className='form-button'
                            sx={{
                                background: colors.blueAccent[1000],
                                color: 'white',
                                borderRadius: 2,
                                // px: 3,
                                // py: 1.5,
                                // fontWeight: 'bold',
                                // '&:hover': {
                                //     background: '#333'
                                // }
                            }}
                        >
                            + New Contract
                        </Button>
                    </Box>
                </Box>

                {/* Dashboard Title */}
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

                {/* Summary Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {summaryCards.map((card, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card
                                sx={{
                                    background: 'white',
                                    borderRadius: 3,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    border: '1px solid #e0e0e0'
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Box>
                                            <Typography sx={{ color: '#666666', fontSize: '14px', mb: 1 }}>
                                                {card.title}
                                            </Typography>
                                            <Typography sx={{
                                                color: '#1a1a1a',
                                                fontWeight: 'bold',
                                                fontSize: isMobile ? "15px" : "15px",
                                                mb: 1
                                            }}>
                                                {card.value}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                {card.trendColor === 'success' ? (
                                                    <TrendingUp sx={{ fontSize: 16, color: '#4CAF50' }} />
                                                ) : (
                                                    <TrendingDown sx={{ fontSize: 16, color: '#f44336' }} />
                                                )}
                                                <Typography sx={{
                                                    color: card.trendColor === 'success' ? '#4CAF50' : '#f44336',
                                                    fontSize: '12px',
                                                    fontWeight: '500'
                                                }}>
                                                    {card.trend}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{
                                            // background: card.iconColor + '20',
                                            // borderRadius: '50%',
                                            // width: 48,
                                            // height: 48,
                                            // display: 'flex',
                                            // alignItems: 'center',
                                            // justifyContent: 'center'
                                        }}>
                                            <Box sx={{ color: card.iconColor }}>
                                                <Box component="span" sx={{ fontSize: '20px' }}>
                                                    {card.icon}
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Grid container spacing={3}>
                    {/* Left Column */}
                    <Grid item xs={12} lg={8}>
                        {/* Recent Contracts */}
                        <Card
                            sx={{
                                background: 'white',
                                borderRadius: 3,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                border: '1px solid #e0e0e0',
                                mb: 3
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 3
                                }}>
                                    <Box>
                                        <Typography
                                            className='custom-headding-16px'
                                            sx={{
                                                // fontSize: isMobile ? "18px" : "20px",
                                                paddingLeft: '0px !important',
                                                fontWeight: "bold",
                                                color: '#1a1a1a',
                                                mb: 0.5
                                            }}
                                        >
                                            Recent Contracts
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: '#666666',
                                                fontSize: '14px'
                                            }}
                                        >
                                            Latest contract activity and status updates
                                        </Typography>
                                    </Box>
                                    <Button
                                        onClick={() => {
                                            navigate("/viewallcontracts")
                                        }}
                                        sx={{
                                            color: colors.blueAccent[1000],
                                            textTransform: 'none',
                                            fontWeight: 400,
                                            border: '1px solid #e0e0e0',
                                        }}
                                    >
                                        View All
                                    </Button>
                                </Box>

                                <Box>
                                    {recentContracts.map((contract, index) => (
                                        <Box
                                            key={index}
                                            // sx={{
                                            //     p: 2,
                                            //     border: '1px solid #e0e0e0',
                                            //     borderRadius: 2,
                                            //     mb: 2,
                                            //     background: '#fafafa',
                                            //     cursor: 'pointer',
                                            //     '&:hover': {
                                            //         background: '#f5f5f5',
                                            //         transition: 'background 0.3s ease'
                                            //     }
                                            // }}

                                            sx={{
                                                background: '#ffffff',
                                                p: 2,
                                                borderRadius: 2,
                                                mb: 2,
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                border: '1px solid #e0e0e0',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                                                    transition: 'all 0.3s ease'
                                                }
                                            }}
                                        >
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography sx={{
                                                        fontWeight: 'bold',
                                                        fontSize: '11px',
                                                        color: '#1a1a1a',
                                                        mb: 0.5
                                                    }}>
                                                        {contract.company}
                                                    </Typography>
                                                    <Typography sx={{
                                                        color: '#666666',
                                                        fontSize: '11px',
                                                        mb: 0.5
                                                    }}>
                                                        {contract.contractId}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                                        <Typography sx={{
                                                            color: '#666666',
                                                            fontSize: '11px'
                                                        }}>
                                                            Value: {contract.value}
                                                        </Typography>
                                                        <Typography sx={{
                                                            color: '#666666',
                                                            fontSize: '11px'
                                                        }}>
                                                            Due: {contract.dueDate}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Chip
                                                        label={contract.status}
                                                        color={contract.statusColor}
                                                        size="small"
                                                        sx={{ fontWeight: 500, fontSize: "11px" }}
                                                    />
                                                    <IconButton size="small" sx={{ color: '#666666' }}>
                                                        <ArrowForward />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Right Column */}
                    <Grid item xs={12} lg={4}>
                        {/* Upcoming Milestones */}
                        <Card
                            sx={{
                                background: 'white',
                                borderRadius: 3,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                border: '1px solid #e0e0e0'
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Typography
                                    className='custom-headding-16px'
                                    sx={{
                                        paddingLeft: '0px !important',
                                        // fontSize: isMobile ? "18px" : "20px",
                                        // fontWeight: "bold",
                                        color: '#1a1a1a',
                                        mb: 0.5
                                    }}
                                >
                                    Upcoming Milestones
                                </Typography>
                                <Typography
                                    //  className='custom-headding-16px'
                                    sx={{
                                        color: '#666666',
                                        fontWeight: 400,
                                        fontSize: "14px",
                                        textAlign: "left",
                                        paddingLeft: '0px !important',
                                        // fontSize: isMobile ? "13px" : isTablet ? "15px" : "17px",
                                        mb: 3
                                    }}
                                >
                                    Important dates and deadlines
                                </Typography>

                                <Box>
                                    {upcomingMilestones.map((milestone, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 2,
                                                mb: 2,
                                                p: 1.5,
                                                borderRadius: 2,
                                                border: '1px solid #e0e0e0',
                                                '&:hover': {
                                                    background: '#f5f5f5',
                                                    transition: 'background 0.3s ease'
                                                }
                                            }}
                                        >
                                            <Box sx={{
                                                width: 12,
                                                height: 12,
                                                borderRadius: '50%',
                                                background: milestone.color,
                                                flexShrink: 0
                                            }} />
                                            <Box sx={{ flex: 1 }}>
                                                <Typography sx={{
                                                    fontSize: '11px',
                                                    color: '#1a1a1a',
                                                    fontWeight: 'bold',
                                                    mb: 0.5
                                                }}>
                                                    {milestone.title}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <CalendarToday sx={{ fontSize: 11, color: '#666666' }} />
                                                    <Typography sx={{
                                                        color: '#666666',
                                                        fontSize: '11px'
                                                    }}>
                                                        {milestone.date}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>

                                <Button
                                    variant="outlined"
                                    sx={{
                                        width: '100%',
                                        mt: 2,
                                        border: '1px solid #e0e0e0',
                                        color: colors.blueAccent[1000],
                                        borderRadius: 2,
                                        py: 1.5,
                                        '&:hover': {
                                            borderColor: colors.blueAccent[1000],
                                            background: colors.blueAccent[1000] + '10'
                                        }
                                    }}
                                >
                                    View All Milestones
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                {/* Quick Actions */}
                <Card
                    sx={{
                        background: 'white',
                        borderRadius: 3,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        border: '1px solid #e0e0e0',
                        width: '100%',
                        marginTop: isMobile ? '20px' : '0px'
                    }}
                >
                    <CardContent sx={{ p: 3 }}>
                        <Typography
                            className='custom-headding-16px'
                            sx={{
                                // fontSize: isMobile ? "18px" : "20px",
                                // fontWeight: "bold",
                                paddingLeft: '0px !important',
                                color: '#1a1a1a',
                                mb: 0.5
                            }}
                        >
                            Quick Actions
                        </Typography>
                        <Typography
                            sx={{
                                color: '#666666',
                                fontSize: '14px',
                                mb: 3
                            }}
                        >
                            Common contract management tasks
                        </Typography>

                        <Grid container spacing={2}>
                            {quickActions.map((action, index) => (
                                <Grid item xs={6} sm={3} key={index}>
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            width: '100%',
                                            height: '80px',
                                            flexDirection: 'column',

                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                            border: '1px solid #e0e0e0',
                                            color: action.color,
                                            borderRadius: 2,
                                            '&:hover': {
                                                // borderColor: action.color,
                                                background: action.color + '10'
                                            }
                                        }}
                                    >
                                        <Box sx={{ color: action.color, mb: 1 }}>
                                            {action.icon}
                                        </Box>
                                        <Typography sx={{
                                            fontSize: '11px',
                                            fontWeight: '500',
                                            textTransform: 'none'
                                        }}>
                                            {action.title}
                                        </Typography>
                                    </Button>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default Contract;
