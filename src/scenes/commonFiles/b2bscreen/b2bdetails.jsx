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
    LinearProgress,
    useTheme,
    useMediaQuery,
    Container
} from '@mui/material';
import { tokens } from '../../../theme';
import {
    Star,
    CalendarToday,
    Edit,
    FilterList,
    MoreVert,
    CloseOutlined
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Divider } from 'antd';

const B2bDetails = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const isMobile = useMediaQuery("(max-width:484px)");
    const isTablet = useMediaQuery("(max-width: 700px)");

    const relationshipMetrics = [
        { label: 'Communication', value: 85 },
        { label: 'Trust Level', value: 78 },
        { label: 'Satisfaction', value: 92 },
        { label: 'Engagement', value: 67 }
    ];

    const activities = [
        {
            title: 'Executive Lunch Meeting',
            description: 'Quarterly business review with C-level executives',
            date: 'Mar 15, 2025',
            duration: '2 hours',
            priority: 'High Priority'
        },
        {
            title: 'Product Demo Session',
            description: 'Showcase new features to technical team',
            date: 'Mar 20, 2025',
            duration: '1.5 hours',
            priority: 'Medium'
        },
        {
            title: 'Industry Conference Invitation',
            description: 'Invite key stakeholders to tech summit',
            date: 'Apr 5, 2025',
            duration: 'Full day',
            priority: 'Low'
        }
    ];

    const strategies = [
        {
            title: 'Personal Connection',
            description: 'Build rapport through shared interests and personal conversations',
            keywords: ['Coffee chats', 'Hobby discussions']
        },
        {
            title: 'Value Delivery',
            description: 'Consistently provide insights and solutions that benefit their business',
            keywords: ['Market insights', 'Best practices']
        },
        {
            title: 'Strategic Alignment',
            description: 'Understand and align with their long-term business objectives',
            keywords: ['Goal mapping', 'Roadmap planning']
        },
        {
            title: 'Trust Building',
            description: 'Maintain transparency and deliver on promises consistently',
            keywords: ['Regular updates', 'Issue resolution']
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
                        Customer Relationship Development
                    </Typography>
                    <Typography
                        sx={{
                            color: '#666666',
                            textAlign: "left",
                            fontSize: isMobile ? "13px" : isTablet ? "15px" : "17px",
                            paddingLeft: isMobile ? "0px" : "30px",
                        }}
                    >
                        Plan and execute activities to deepen B2B customer relationships
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
                    background: '#fff',
                    padding: { xs: 2, md: 4 },
                }}
            >
                <Container maxWidth="xl">
                    {/* Top Row - Selected Customer and Relationship Health */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        {/* Selected Customer Card - Wider */}
                        <Grid item xs={12} lg={7}>
                            <Card
                                sx={{
                                    background: '#ffffff',
                                    borderRadius: 3,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    border: '1px solid #e0e0e0',
                                    position: 'relative'
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Typography
                                            className='custom-headding-16px'
                                            sx={{
                                                color: '#1a1a1a',
                                                paddingLeft: "0px !important"
                                            }}
                                        >
                                            Selected Customer
                                        </Typography>
                                        <IconButton size="small" sx={{ color: '#666666' }}>
                                            <Edit />
                                        </IconButton>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                        <Avatar
                                            sx={{
                                                background: '#1a1a1a',
                                                color: 'white',
                                                width: 60,
                                                height: 60,
                                                fontSize: '24px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            TC
                                        </Avatar>
                                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start" }}>
                                            <Box>
                                                <Typography
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        fontSize: '18px',
                                                        color: '#1a1a1a',
                                                        mb: 0.5
                                                    }}
                                                >
                                                    TechCorp Solutions
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        color: '#666666',
                                                        fontSize: '14px',
                                                        mb: 1
                                                    }}
                                                >
                                                    Enterprise Software Development
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: "center", gap: 2, mt: 2 }}>

                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, }}>
                                                    <Star sx={{ color: '#666666', fontSize: 16 }} />
                                                    <Typography
                                                        sx={{
                                                            color: '#666666',
                                                            fontSize: '14px',
                                                            // fontWeight: 'bold'
                                                        }}
                                                    >
                                                        Relationship Score: 7.5/10
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <CalendarToday sx={{ color: '#666666', fontSize: 16 }} />
                                                    <Typography
                                                        sx={{
                                                            color: '#666666',
                                                            fontSize: '14px'
                                                        }}
                                                    >
                                                        Client Since: 2023
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>

                                    </Box>


                                    <Divider style={{ margin: "10px 0px" }} />

                                    {/* Customer Metrics */}
                                    <Grid container spacing={2}>
                                        <Grid item xs={4}>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Typography
                                                    className='custom-headding-16px'
                                                    sx={{
                                                        fontWeight: 600,
                                                        // fontSize: '18px',
                                                        color: '#1a1a1a',
                                                        paddingLeft: "0px !important"
                                                    }}
                                                >
                                                    $2.5M
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        color: '#666666',
                                                        fontSize: '12px'
                                                    }}
                                                >
                                                    Annual Revenue
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Typography
                                                    className='custom-headding-16px'
                                                    sx={{
                                                        fontWeight: 600,
                                                        // fontSize: '18px',
                                                        color: '#1a1a1a',
                                                        paddingLeft: "0px !important"
                                                    }}
                                                >
                                                    12
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        color: '#666666',
                                                        fontSize: '12px'
                                                    }}
                                                >
                                                    Active Projects
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Typography
                                                    className='custom-headding-16px'
                                                    sx={{
                                                        fontWeight: 600,
                                                        // fontSize: '18px',
                                                        color: '#1a1a1a',
                                                        paddingLeft: "0px !important"
                                                    }}
                                                >
                                                    8
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        color: '#666666',
                                                        fontSize: '12px'
                                                    }}
                                                >
                                                    Key Contacts
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>


                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Relationship Health Card - Narrower */}
                        <Grid item xs={12} lg={5}>
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
                                            color: '#1a1a1a',
                                            paddingLeft: "0px !important",
                                            mb: 1
                                        }}
                                    >
                                        Relationship Health
                                    </Typography>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {relationshipMetrics.map((metric, index) => (
                                            <Box key={index}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                    <Typography
                                                        sx={{
                                                            color: '#1a1a1a',
                                                            fontSize: '13px',
                                                            fontWeight: '500'
                                                        }}
                                                    >
                                                        {metric.label}
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            color: colors.blueAccent[1000],
                                                            fontSize: '13px',
                                                            fontWeight: '500'
                                                        }}
                                                    >
                                                        {metric.value}%
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={metric.value}
                                                    sx={{
                                                        height: 8,
                                                        borderRadius: 4,
                                                        backgroundColor: '#f0f0f0',
                                                        '& .MuiLinearProgress-bar': {
                                                            background: colors.blueAccent[1000],
                                                            borderRadius: 4
                                                        }
                                                    }}
                                                />
                                            </Box>
                                        ))}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Bottom Row - Activity Planning and Strategies */}
                    <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
                        {/* Activity Planning Card - Left Column */}
                        <Grid item xs={12} lg={6}>
                            <Card
                                sx={{
                                    background: '#ffffff',
                                    borderRadius: 3,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    border: '1px solid #e0e0e0',
                                    height: '100%' // Make it full height
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                        <Typography
                                            className='custom-headding-16px'
                                            sx={{
                                                color: '#1a1a1a',
                                                paddingLeft: "0px !important"
                                            }}
                                        >
                                            Activity Planning
                                        </Typography>
                                        <IconButton size="small" sx={{ color: '#666666' }}>
                                            <FilterList />
                                        </IconButton>
                                    </Box>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                                        {activities.map((activity, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    p: 2,
                                                    background: '#f8f9fa',
                                                    borderRadius: 2,
                                                    border: '1px solid #e0e0e0'
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                                    <Typography
                                                        sx={{
                                                            fontWeight: 'bold',
                                                            fontSize: '14px',
                                                            color: '#1a1a1a'
                                                        }}
                                                    >
                                                        {activity.title}
                                                    </Typography>
                                                    <Chip
                                                    label={activity.priority}
                                                    size="small"
                                                    sx={{
                                                        background: '#f0f0f0',
                                                        color: '#666666',
                                                        fontSize: '11px',
                                                        fontWeight: '500'
                                                    }}
                                                />
                   
                                                </Box>
                                                <Box  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }} >
                                                <Typography
                                                    sx={{
                                                        color: '#666666',
                                                        fontSize: '13px',
                                                        mb: 1
                                                    }}
                                                >
                                                    {activity.description}
                                                </Typography>
                                                <IconButton size="small" sx={{ color: '#666666' }}>
                                                        <MoreVert />
                                                    </IconButton>
                                                    </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <CalendarToday sx={{ color: '#666666', fontSize: 14 }} />
                                                        <Typography
                                                            sx={{
                                                                color: '#666666',
                                                                fontSize: '12px'
                                                            }}
                                                        >
                                                            {activity.date}
                                                        </Typography>
                                                    </Box>
                                                    <Typography
                                                        sx={{
                                                            color: '#666666',
                                                            fontSize: '12px'
                                                        }}
                                                    >
                                                        {activity.duration}
                                                    </Typography>
                                                </Box>

                                            </Box>
                                        ))}
                                    </Box>

                                    <Button
                                        variant="outlined"
                                        className='form-button'
                                        sx={{
                                            // background: colors.blueAccent[1000],
                                            color: 'black',
                                            width: '100%',
                                            borderRadius: 2,
                                            borderColor: '#333333 !important',
                                            borderWidth: '1px',
                                            borderStyle: 'solid',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            padding: '10px 20px',
                                            textTransform: 'none',
                                            '&:hover': {
                                                background: colors.blueAccent[1000],
                                                color: 'white'
                                            }
                                            //   py: 1,
                                            //   px: 2,
                                            //   fontSize: '14px',
                                            //   '&:hover': {
                                            //     background: '#333333'
                                            //   }
                                        }}
                                    >
                                        + Add New Activity
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Right Column - Strategies and Recommendations */}
                        <Grid item xs={12} lg={6}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                {/* Relationship Building Strategies */}
                                <Card
                                    sx={{
                                        background: '#ffffff',
                                        borderRadius: 3,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        border: '1px solid #e0e0e0'
                                        // Removed flex height constraint to allow natural expansion
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <Typography
                                            className='custom-headding-16px'
                                            sx={{
                                                color: '#1a1a1a',
                                                paddingLeft: "0px !important",
                                                mb: 3
                                            }}
                                        >
                                            Relationship Building Strategies
                                        </Typography>

                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            {strategies.map((strategy, index) => (
                                                <Box key={index} sx={{ 
                                                    mb: 2,
                                                    pl: 3,
                                                    borderLeft: `4px solid #e0e0e0`,
                                                    // '&:hover': {
                                                    //     borderLeftColor: '#333333',
                                                    //     transition: 'border-left-color 0.3s ease'
                                                    // }
                                                }}>
                                                    <Typography
                                                        sx={{
                                                            fontWeight: 'bold',
                                                            fontSize: '14px',
                                                            color: '#1a1a1a',
                                                            mb: 1
                                                        }}
                                                    >
                                                        {strategy.title}
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            color: '#666666',
                                                            fontSize: '13px',
                                                            mb: 1
                                                        }}
                                                    >
                                                        {strategy.description}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                        {strategy.keywords.map((keyword, keyIndex) => (
                                                            <Chip
                                                                key={keyIndex}
                                                                label={keyword}
                                                                size="small"
                                                                sx={{
                                                                    background: '#f0f0f0',
                                                                    color: '#666666',
                                                                    fontSize: '11px',
                                                                    fontWeight: '500'
                                                                }}
                                                            />
                                                        ))}
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Box>
                                    </CardContent>
                                </Card>

                                {/* Next Recommended Action */}
                                <Card
                                    sx={{
                                        background: '#ffffff',
                                        borderRadius: 3,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        border: '1px solid #e0e0e0'
                                        // Removed flex height constraint
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <Typography
                                            className='custom-headding-16px'
                                            sx={{
                                                color: '#1a1a1a',
                                                paddingLeft: "0px !important",
                                                mb: 2
                                            }}
                                        >
                                            Next Recommended Action
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: '#666666',
                                                fontSize: '14px',
                                                lineHeight: 1.5
                                            }}
                                        >
                                            Schedule a strategic planning session to discuss Q2 initiatives and explore new collaboration opportunities.
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    );
};

export default B2bDetails;
