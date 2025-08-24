import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
    Avatar,
    Chip,
    IconButton,
    useTheme,
    useMediaQuery,
    Container
} from '@mui/material';
import {
    Business,
    Handshake,
    Phone,
    Email,
    CardGiftcard,
    ArrowForward,
    Person,
    Event
} from '@mui/icons-material';
// import { CloseOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';
import { tokens } from '../../../theme';

const B2bScreen = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    //   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isMobile = useMediaQuery("(max-width:484px)");
    const isTablet = useMediaQuery("(max-width: 700px)");

    const customers = [
        {
            name: "TechCorp Solutions",
            avatar: <Person />,
            lastContact: "2 days ago",
            value: "High Value",
            valueColor: "success"
        },
        {
            name: "Global Industries Inc",
            avatar: <Person />,
            lastContact: "1 week ago",
            value: "Medium Value",
            valueColor: "warning"
        },
        {
            name: "Innovation Partners",
            avatar: <Person />,
            lastContact: "3 days ago",
            value: "High Value",
            valueColor: "success"
        }
    ];

    const upcomingEvents = [
        {
            title: "Client Lunch",
            time: "Tomorrow, 12:00 PM",
            company: "TechCorp Solutions"
        },
        {
            title: "Quarterly Review",
            time: "Friday, 2:00 PM",
            company: "Global Industries"
        }
    ];

    return (
        <>
            {/* Header */}
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
                        B2B Customer Relationships
                    </Typography>
                    <Typography
                        sx={{
                            color: '#666666',
                            textAlign: "left",
                            fontSize: isMobile ? "13px" : isTablet ? "15px" : "17px",
                            paddingLeft: isMobile ? "0px" : "30px",
                        }}
                    >
                        Build and nurture deep, lasting relationships with your business customers
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

            <Box
                sx={{
                    // minHeight: '100vh',
                    background: '#fff',
                    padding: { xs: 2, md: 4 },
                    // paddingTop: { xs: 8, md: 10 },
                    // marginLeft: { xs: 0, md: '265px' }, // Account for sidebar width
                    // width: { xs: '100%', md: 'calc(100% - 265px)' } // Adjust width for sidebar
                }}
            >
                <Container maxWidth="xl">





                    <Grid container spacing={3}>
                        {/* Main Content - Left Column */}
                        <Grid item xs={12} lg={8}>
                            {/* Customer Portfolio Section */}
                            <Card
                                sx={{
                                    background: '#ffffff',
                                    borderRadius: 3,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    border: '1px solid #e0e0e0',
                                    mb: 3
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: "center" }}>
                                        <Typography
                                            // variant="h5"
                                            className='custom-headding-16px'
                                            sx={{
                                                // fontWeight: 'bold',
                                                color: '#1a1a1a',
                                                mb: 3
                                            }}
                                        >
                                            Customer Portfolio
                                        </Typography>

                                        {/* Add Customer Button */}
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                                            <Button
                                                variant="contained"
                                                className="form-button"
                                                sx={{
                                                    background: colors.blueAccent[1000],
                                                    color: 'white',
                                                    // borderRadius: 2,

                                                    // px: 3,
                                                    // py: 1.5,
                                                    // fontWeight: 'bold',
                                                    // '&:hover': {
                                                    //     background: '#333'
                                                    // }
                                                }}
                                            >
                                                + Add Customer
                                            </Button>
                                        </Box>
                                    </div>

                                    {/* Summary Cards */}
                                    <Grid container spacing={2} sx={{ mb: 3 }}>
                                        <Grid item xs={12} sm={6}>
                                            <Card
                                                sx={{
                                                    background: '#f9fafb',
                                                    borderRadius: 2,
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                    border: '1px solid #e0e0e0'
                                                }}
                                            >
                                                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                                                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
                                                            <Typography variant="body2" sx={{ color: '#666666' }}>
                                                                Total Customers
                                                            </Typography>
                                                            <Typography sx={{ color: '#1a1a1a', fontWeight: 'bold', fontSize: "15px" }}>
                                                                247
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{
                                                            background: "#d1d5db", 
                                                            borderRadius: "5%", 
                                                            padding: "8px",
                                                            width: "50px",
                                                            height: "50px",
                                                            display: "flex",
                                                            alignItems: "center", 
                                                            justifyContent: "center"
                                                        }}>
                                                            <Business sx={{ fontSize: 30, color: '#4b5563' }} />
                                                        </Box>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Card
                                                sx={{
                                                    background: '#f9fafb',
                                                    borderRadius: 2,
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                    border: '1px solid #e0e0e0'
                                                }}
                                            >
                                                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                                                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>

                                                            <Typography variant="body2" sx={{ color: '#666666' }}>
                                                                Active Relationships
                                                            </Typography>
                                                            <Typography sx={{ color: '#1a1a1a', fontWeight: 'bold', fontSize: "15px" }}>
                                                                189
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{
                                                            background: "#d1d5db", 
                                                            borderRadius: "5%", 
                                                            padding: "8px",
                                                            width: "50px",
                                                            height: "50px",
                                                            display: "flex",
                                                            alignItems: "center", 
                                                            justifyContent: "center"
                                                        }}>
                                                            <Handshake sx={{ fontSize: 30, color: '#4b5563' }} />
                                                        </Box>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>



                                    {/* Customer List */}
                                    <Box>
                                        {customers.map((customer, index) => (
                                            <Card
                                                key={index}
                                                onClick={() => navigate('/b2bdetails')}
                                                sx={{
                                                    background: '#ffffff',
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
                                                <CardContent sx={{ p: 2 }}>
                                                    <Box sx={{ display: 'flex', flexDirection: isMobile ? "column" : "row", alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <Box sx={{ display: 'flex', flexDirection: isMobile ? "column" : "row", alignItems: 'center', gap: 2 }}>
                                                            <Avatar
                                                                sx={{
                                                                    background: '#f0f0f0',
                                                                    color: '#666666',
                                                                    width: 40,
                                                                    height: 40
                                                                }}
                                                            >
                                                                {customer.avatar}
                                                            </Avatar>
                                                            <Box>
                                                                <Typography
                                                                    // variant="h6"

                                                                    sx={{ fontWeight: "bold", fontSize: "11px", color: "#1e293b" }}
                                                                >
                                                                    {customer.name}
                                                                </Typography>
                                                                <Typography
                                                                    sx={{ color: "#666666", fontSize: "11px" }}
                                                                // sx={{ color: '#666666' }}
                                                                >
                                                                    Last contact: {customer.lastContact}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Chip
                                                                label={customer.value}
                                                                color={customer.valueColor}
                                                                size="small"
                                                                sx={{ fontWeight: 500, fontSize: "11px" }}
                                                            />
                                                            <IconButton
                                                                size="small"
                                                                sx={{ color: '#666666' }}
                                                            >
                                                                <ArrowForward />
                                                            </IconButton>
                                                        </Box>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Sidebar - Right Column */}
                        <Grid item xs={12} lg={4}>
                            {/* Quick Actions */}
                            <Card
                                sx={{
                                    background: '#ffffff',
                                    borderRadius: 3,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    border: '1px solid #e0e0e0',
                                    mb: 3
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Typography
                                        className='custom-headding-16px'
                                        sx={{
                                            // fontWeight: 'bold',
                                            paddingLeft: "0px !important",
                                            color: '#1a1a1a',
                                            mb: 2
                                        }}
                                    >
                                        Quick Actions
                                    </Typography>
                                    <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', gap: 2, alignItems: 'flex-start' }}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<Phone />}
                                            sx={{
                                                borderColor: '#333333',
                                                color: '#333333',
                                                borderRadius: 2,
                                                py: 1.5,
                                                fontSize: "11px",
                                                borderWidth: '1px',
                                                borderStyle: 'solid',
                                                width: '100%',
                                                justifyContent: 'flex-start',
                                                '&:hover': {
                                                    borderColor: '#333333',
                                                    background: '#f5f5f5'
                                                }
                                            }}
                                        >
                                            Schedule Call
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            startIcon={<Email />}
                                            sx={{
                                                borderColor: '#333333',
                                                color: '#333333',
                                                borderRadius: 2,
                                                py: 1.5,
                                                fontSize: "11px",
                                                borderWidth: '1px',
                                                borderStyle: 'solid',
                                                width: '100%',
                                                justifyContent: 'flex-start',
                                                '&:hover': {
                                                    borderColor: '#333333',
                                                    background: '#f5f5f5'
                                                }
                                            }}
                                        >
                                            Send Email
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            startIcon={<CardGiftcard />}
                                            sx={{
                                                borderColor: '#333333',
                                                color: '#333333',
                                                borderRadius: 2,
                                                py: 1.5,
                                                fontSize: "11px",
                                                borderWidth: '1px',
                                                borderStyle: 'solid',
                                                width: '100%',
                                                justifyContent: 'flex-start',
                                                '&:hover': {
                                                    borderColor: '#333333',
                                                    background: '#f5f5f5'
                                                }
                                            }}
                                        >
                                            Send Gift
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>

                            {/* Upcoming Events */}
                            <Card
                                sx={{
                                    background: '#ffffff',
                                    borderRadius: 3,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    border: '1px solid #e0e0e0'
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Typography
                                        className='custom-headding-16px'
                                        sx={{
                                            paddingLeft: "0px !important",
                                            color: '#1a1a1a',
                                            mb: 2
                                        }}
                                    >
                                        Upcoming Events
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {upcomingEvents.map((event, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    p: 2,
                                                    background: '#f8f9fa',
                                                    borderRadius: 2,
                                                    border: '1px solid #e0e0e0'
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                    <Event sx={{ color: '#666666', fontSize: 20 }} />
                                                    <Typography
                                                        // variant="subtitle2"
                                                        className='custom-headding-16px'
                                                        sx={{
                                                            color: '#1a1a1a',
                                                            fontSize: "11px",
                                                            fontWeight: 'bold !important',
                                                            paddingLeft: "0px !important"
                                                        }}
                                                    >
                                                        {event.title}
                                                    </Typography>
                                                </Box>
                                                <Typography
                                                    // variant="body2"
                                                    sx={{ color: '#666666', mb: 0.5, fontSize: "11px" }}
                                                >
                                                    {event.time}
                                                </Typography>
                                                <Typography
                                                    // variant="body2"
                                                    sx={{ color: '#666666', mb: 0.5, fontSize: "11px" }}
                                                >
                                                    {event.company}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    );
};

export default B2bScreen;
