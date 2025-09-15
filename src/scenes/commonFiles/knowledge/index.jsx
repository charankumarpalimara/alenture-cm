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
    // Chip,
    // IconButton,
    Checkbox,
    FormControlLabel,
    Select,
    MenuItem,
    FormControl,
    // InputLabel,
    InputBase,
    // Avatar,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import {
    Search,
    Star,
    PlayArrow,
    Description,
    Share,
    // Psychology,
    // Cloud,
    // Work,
    // Security,
    // Brush,
    Event,
    Business,
    ExpandMore,
    FilterList
} from '@mui/icons-material';
import { tokens } from '../../../theme';

const Knowledge = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery("(max-width:484px)");
    const isTablet = useMediaQuery("(max-width: 700px)");

    // State for filters and search
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('Most Recent');
    const [dateRange, setDateRange] = useState('Last 30 days');

    // Filter states
    const [categoryFilters, setCategoryFilters] = useState({
        'Knowledge Articles': true,
        'Case Studies': false,
        'Research Articles': false,
        'Point of View': false
    });

    const [topicFilters, setTopicFilters] = useState({
        'Technology': true,
        'Business Strategy': false,
        'Digital Innovation': false,
        'Data Analytics': false
    });

    // Main articles data
    const articles = [
        {
            id: 1,
            title: "The Rise of AI in Business",
            description: "AI is reshaping industries by automating processes, improving customer experience, and driving innovation across all sectors.",
            author: "John Smith",
            date: "Apr 23",
            readTime: "4 min read",
            thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=100&h=100&fit=crop&crop=center",
            category: "Knowledge Articles",
            topic: "Technology"
        },
        {
            id: 2,
            title: "Cloud Computing Trends",
            description: "Cloud computing continues to be a key driver of digital transformation, offering scalability, cost efficiency, and enhanced collaboration.",
            author: "Maria Garcia",
            date: "Apr 20",
            readTime: "6 min read",
            thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&h=100&fit=crop&crop=center",
            category: "Knowledge Articles",
            topic: "Technology"
        },
        {
            id: 3,
            title: "Digital Transformation Strategies",
            description: "Learn how successful companies are implementing digital transformation strategies to stay competitive in the modern market.",
            author: "Alex Thompson",
            date: "Apr 18",
            readTime: "7 min read",
            thumbnail: "https://images.unsplash.com/photo-1551434678-e076d223b692?w=100&h=100&fit=crop&crop=face",
            category: "Knowledge Articles",
            topic: "Business Strategy"
        },
        {
            id: 4,
            title: "Data Analytics Best Practices",
            description: "Discover the key principles and best practices for implementing effective data analytics in your organization.",
            author: "Lisa Chen",
            date: "Apr 15",
            readTime: "5 min read",
            thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop&crop=center",
            category: "Knowledge Articles",
            topic: "Data Analytics"
        }
    ];

    // Today's articles data
    const todaysArticles = [
        {
            id: 1,
            title: "The Future of Remote Work",
            date: "April 24",
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=80&h=80&fit=crop&crop=center"
        },
        {
            id: 2,
            title: "Cybersecurity Best Practices",
            date: "April 22",
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=80&h=80&fit=crop&crop=center"
        },
        {
            id: 3,
            title: "The Importance of UX Design",
            date: "April 20",
            image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=80&h=80&fit=crop&crop=center"
        }
    ];

    // Upcoming events data
    const upcomingEvents = [
        {
            id: 1,
            title: "Client Lunch",
            time: "Tomorrow 12:00 PM",
            company: "TechCorp Solutions",
            icon: <Event sx={{ fontSize: 20, color: '#666666' }} />
        },
        {
            id: 2,
            title: "Quarterly Review",
            time: "Friday, 2:00 PM",
            company: "Global Industries",
            icon: <Business sx={{ fontSize: 20, color: '#666666' }} />
        }
    ];

    const handleCategoryChange = (category) => {
        setCategoryFilters(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const handleTopicChange = (topic) => {
        setTopicFilters(prev => ({
            ...prev,
            [topic]: !prev[topic]
        }));
    };

    return (
        <Box
            sx={{
                background: '#ffffff',
                minHeight: '100vh',
                padding: { xs: 1, md: 2 }
            }}
        >
            <Container maxWidth="xl">
                <Grid container spacing={3}>
                    {/* Central Content Area */}
                    <Grid item xs={12} md={8}>
                        {/* Header */}
                        <Box sx={{ mb: 4 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", background: "#fff", padding: "10px", borderRadius: "8px", }}>
                                <div style={{ flex: 1 }}>
                                    <Typography
                                        sx={{
                                            textAlign: "left",
                                            fontSize: isMobile ? "15px" : isTablet ? "17px" : "18px",
                                            marginBottom: "4px",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        Knowledge Base
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: '#666666',
                                            textAlign: "left",
                                            fontSize: isMobile ? "13px" : isTablet ? "15px" : "17px",
                                        }}
                                    >
                                        Browse our collection of articles, case studies, and resarch
                                    </Typography>
                                </div>
                            </div>

                            {/* Search and Sort Bar */}
                            <Box sx={{
                                display: 'flex',
                                gap: 2,
                                flexDirection: isMobile ? 'column' : 'row',
                                mb: 3
                            }}>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    background: 'white',
                                    borderRadius: 2,
                                    padding: '8px 16px',
                                    border: '1px solid #e0e0e0',
                                    flex: 1
                                }}>
                                    <Search sx={{ color: '#666666', mr: 1 }} />
                                    <InputBase
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        sx={{
                                            fontSize: '14px',
                                            color: '#666666',
                                            width: '100%'
                                        }}
                                    />
                                </Box>
                                <FormControl sx={{ minWidth: isMobile ? '100%' : 200 }}>
                                    <Select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        displayEmpty
                                        sx={{
                                            fontSize: '14px',
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#e0e0e0'
                                            }
                                        }}
                                    >
                                        <MenuItem value="Most Recent">Sort by: Most Recent</MenuItem>
                                        <MenuItem value="Most Popular">Sort by: Most Popular</MenuItem>
                                        <MenuItem value="Alphabetical">Sort by: Alphabetical</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>

                        {/* Filters Section - Collapsible Accordion for all screen sizes */}
                        <Accordion 
                            sx={{ 
                                mb: 3, 
                                background: 'white',
                                borderRadius: 2,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                border: '1px solid #e0e0e0'
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                sx={{
                                    '& .MuiAccordionSummary-content': {
                                        alignItems: 'center',
                                        gap: 1
                                    }
                                }}
                            >
                                <FilterList sx={{ color: '#666666' }} />
                                <Typography className='custom-headding-16px' sx={{ fontSize: isMobile ? "13px" : isTablet ? "15px" : "17px", paddingLeft: "0px !important" }}>
                                    Filters
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{ 
                                    display: 'flex', 
                                    flexDirection: isMobile ? 'column' : 'row', 
                                    gap: 3,
                                    flexWrap: isMobile ? 'nowrap' : 'wrap'
                                }}>
                                    {/* Filter by Category */}
                                    <Box sx={{ flex: isMobile ? 'none' : 1, minWidth: isMobile ? '100%' : '200px' }}>
                                        <Typography
                                            className='custom-headding-16px'
                                            sx={{
                                                paddingLeft: '0px !important',
                                                color: '#1a1a1a',
                                                mb: 1,
                                                fontSize: '14px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Filter by Category
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                            {Object.keys(categoryFilters).map((category) => (
                                                <FormControlLabel
                                                    key={category}
                                                    control={
                                                        <Checkbox
                                                            checked={categoryFilters[category]}
                                                            onChange={() => handleCategoryChange(category)}
                                                            sx={{
                                                                color: '#666666',
                                                                '&.Mui-checked': {
                                                                    color: colors.blueAccent[1000]
                                                                }
                                                            }}
                                                        />
                                                    }
                                                    label={
                                                        <Typography sx={{ fontSize: '12px', color: '#666666' }}>
                                                            {category}
                                                        </Typography>
                                                    }
                                                    sx={{ margin: 0 }}
                                                />
                                            ))}
                                        </Box>
                                    </Box>

                                    {/* Filter by Topic */}
                                    <Box sx={{ flex: isMobile ? 'none' : 1, minWidth: isMobile ? '100%' : '200px' }}>
                                        <Typography
                                            className='custom-headding-16px'
                                            sx={{
                                                paddingLeft: '0px !important',
                                                color: '#1a1a1a',
                                                mb: 1,
                                                fontSize: '14px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Filter by Topic
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                            {Object.keys(topicFilters).map((topic) => (
                                                <FormControlLabel
                                                    key={topic}
                                                    control={
                                                        <Checkbox
                                                            checked={topicFilters[topic]}
                                                            onChange={() => handleTopicChange(topic)}
                                                            sx={{
                                                                color: '#666666',
                                                                '&.Mui-checked': {
                                                                    color: colors.blueAccent[1000]
                                                                }
                                                            }}
                                                        />
                                                    }
                                                    label={
                                                        <Typography sx={{ fontSize: '12px', color: '#666666' }}>
                                                            {topic}
                                                        </Typography>
                                                    }
                                                    sx={{ margin: 0 }}
                                                />
                                            ))}
                                        </Box>
                                    </Box>

                                    {/* Date Range */}
                                    <Box sx={{ flex: isMobile ? 'none' : 1, minWidth: isMobile ? '100%' : '200px' }}>
                                        <Typography
                                            className='custom-headding-16px'
                                            sx={{
                                                paddingLeft: '0px !important',
                                                color: '#1a1a1a',
                                                mb: 1,
                                                fontSize: '14px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Date Range
                                        </Typography>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                value={dateRange}
                                                onChange={(e) => setDateRange(e.target.value)}
                                                sx={{
                                                    fontSize: '14px',
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: '#e0e0e0'
                                                    }
                                                }}
                                            >
                                                <MenuItem value="Last 30 days">Last 30 days</MenuItem>
                                                <MenuItem value="Last 7 days">Last 7 days</MenuItem>
                                                <MenuItem value="Last 3 months">Last 3 months</MenuItem>
                                                <MenuItem value="Last year">Last year</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </Box>
                            </AccordionDetails>
                        </Accordion>

                        {/* Articles List - Facebook Style Posts */}
                        <Box>
                            {articles.map((article) => (
                                <Card
                                    key={article.id}
                                    sx={{
                                        background: 'white',
                                        borderRadius: 2,
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                        border: '1px solid #e0e0e0',
                                        mb: 3,
                                        '&:hover': {
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                            transition: 'all 0.3s ease'
                                        }
                                    }}
                                >
                                    {/* Post Header */}
                                    <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'center' : 'stretch', gap: 3, p: 2 }}>
                                        <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'stretch' }}>
                                            <Box
                                                component="img"
                                                src={article.thumbnail}
                                                sx={{
                                                    width: isMobile ? 120 : 120,
                                                    height: 'auto',
                                                    minHeight: '100%',
                                                    objectFit: 'cover',
                                                    background: '#f5f5f5',
                                                    borderRadius: 2,
                                                    flexShrink: 0
                                                }}
                                            />
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography
                                                sx={{
                                                    fontSize: '16px',
                                                    fontWeight: "600",
                                                    color: '#1a1a1a',
                                                    mb: 1
                                                }}
                                            >
                                                {article.title}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    color: '#1a1a1a',
                                                    fontSize: '14px',
                                                    lineHeight: 1.6,
                                                    mb: 1
                                                }}
                                            >
                                                {article.description}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontSize: '13px',
                                                    color: '#666666'
                                                }}
                                            >
                                                {article.date} · {article.readTime}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Post Actions - Facebook Style */}
                                    <Box sx={{
                                        borderTop: '1px solid #f0f0f0',
                                        p: 2
                                    }}>
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            gap: 1
                                        }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 1 }}>
                                                <Button
                                                    size="small"
                                                    startIcon={isMobile ? null : <Star sx={{ fontSize: 14 }} />}
                                                    sx={{
                                                        color: '#666666',
                                                        textTransform: 'none',
                                                        fontSize: '11px',
                                                        fontWeight: '500',
                                                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                                        '&:hover': {
                                                            background: '#f0f0f0'
                                                        }
                                                    }}
                                                >
                                                    {isMobile ? <Star sx={{ fontSize: 16 }} /> : 'Add to favorites'}
                                                </Button>
                                                <Button
                                                    size="small"
                                                    startIcon={isMobile ? null : <PlayArrow sx={{ fontSize: 14 }} />}
                                                    sx={{
                                                        color: '#666666',
                                                        textTransform: 'none',
                                                        fontSize: '11px',
                                                        fontWeight: '500',
                                                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                                        '&:hover': {
                                                            background: '#f0f0f0'
                                                        }
                                                    }}
                                                >
                                                    {isMobile ? <PlayArrow sx={{ fontSize: 16 }} /> : 'Request demo'}
                                                </Button>
                                                <Button
                                                    size="small"
                                                    startIcon={isMobile ? null : <Description sx={{ fontSize: 14 }} />}
                                                    sx={{
                                                        color: '#666666',
                                                        textTransform: 'none',
                                                        fontSize: '11px',
                                                        fontWeight: '500',
                                                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                                        '&:hover': {
                                                            background: '#f0f0f0'
                                                        }
                                                    }}
                                                >
                                                    {isMobile ? <Description sx={{ fontSize: 16 }} /> : 'Request in'}
                                                </Button>
                                                <Button
                                                    size="small"
                                                    startIcon={isMobile ? null : <Share sx={{ fontSize: 14 }} />}
                                                    sx={{
                                                        color: '#666666',
                                                        textTransform: 'none',
                                                        fontSize: '11px',
                                                        fontWeight: '500',
                                                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                                        '&:hover': {
                                                            background: '#f0f0f0'
                                                        }
                                                    }}
                                                >
                                                    {isMobile ? <Share sx={{ fontSize: 16 }} /> : 'Share'}
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Card>
                            ))}
                        </Box>
                    </Grid>

                    {/* Right Sidebar */}
                    <Grid item xs={12} md={4}>
                        {/* Today's Articles For You */}
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
                                <Typography
                                    className='custom-headding-16px'
                                    sx={{
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        color: '#1a1a1a',
                                        mb: 3,
                                        paddingLeft: '0px !important'
                                    }}
                                >
                                    Today's Articles For You
                                </Typography>

                                <Box>
                                    {todaysArticles.map((article, index) => (
                                        <Box
                                            key={article.id}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 2,
                                                mb: index === todaysArticles.length - 1 ? 0 : 2,
                                                p: 2,
                                                borderRadius: 2,
                                                border: '1px solid #e0e0e0',
                                                '&:hover': {
                                                    background: '#f5f5f5',
                                                    transition: 'background 0.3s ease'
                                                }
                                            }}
                                        >
                                            <Box sx={{ flex: 1 }}>
                                                <Typography
                                                    sx={{
                                                        fontSize: '12px',
                                                        fontWeight: 'bold',
                                                        color: '#1a1a1a',
                                                        mb: 0.5,
                                                        lineHeight: 1.2
                                                    }}
                                                >
                                                    {article.title}
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        fontSize: '12px',
                                                        color: '#666666',
                                                        lineHeight: 1.2
                                                    }}
                                                >
                                                    {article.date}
                                                </Typography>
                                            </Box>
                                            <Box
                                                component="img"
                                                src={article.image}
                                                alt={article.title}
                                                sx={{
                                                    width: 50,
                                                    height: 50,
                                                    borderRadius: 2,
                                                    objectFit: 'cover',
                                                    flexShrink: 0
                                                }}
                                            />
                                        </Box>
                                    ))}
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
                                                sx={{ color: '#666666', mb: 0.5, fontSize: "11px" }}
                                            >
                                                {event.time}
                                            </Typography>
                                            <Typography
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
    );
};

export default Knowledge;
