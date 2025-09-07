import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Add as AddIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  ThumbUp as ThumbUpIcon,
  Comment as CommentIcon,
  Visibility as ViewIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import { tokens } from '../../../theme';

const AllIdeas = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery("(max-width:768px)");
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('Latest');

  // Sample data based on the image
  const ideas = [
    {
      id: 1,
      title: "AI-Powered Lead Scoring",
      description: "Implement machine learning algorithms to automatically score and prioritize B2B leads based on historical data and company metrics.",
      author: "John Mitchell",
      authorAvatar: "/api/placeholder/32/32",
      timeAgo: "2 hours ago",
      category: "Sales Tech",
      categoryColor: "#4CAF50",
      likes: 24,
      comments: 8,
      activities: 5,
      collaborators: [
        "/api/placeholder/24/24",
        "/api/placeholder/24/24",
        "/api/placeholder/24/24"
      ],
      collaboratorCount: 3
    },
    {
      id: 2,
      title: "Interactive Product Demos",
      description: "Create immersive, interactive product demonstrations using VR/AR technology to showcase complex B2B solutions to potential clients.",
      author: "Sarah Chen",
      authorAvatar: "/api/placeholder/32/32",
      timeAgo: "5 hours ago",
      category: "Customer Experience",
      categoryColor: "#9C27B0",
      likes: 18,
      comments: 12,
      activities: 3,
      collaborators: [
        "/api/placeholder/24/24",
        "/api/placeholder/24/24"
      ],
      collaboratorCount: 2
    },
    {
      id: 3,
      title: "Social Selling Platform",
      description: "Develop a comprehensive social selling platform that integrates LinkedIn, Twitter, and industry forums for relationship building.",
      author: "Mike Rodriguez",
      authorAvatar: "/api/placeholder/32/32",
      timeAgo: "1 day ago",
      category: "Digital Strategy",
      categoryColor: "#2196F3",
      likes: 31,
      comments: 6,
      activities: 7,
      collaborators: [
        "/api/placeholder/24/24",
        "/api/placeholder/24/24",
        "/api/placeholder/24/24",
        "/api/placeholder/24/24"
      ],
      collaboratorCount: 4
    },
    {
      id: 4,
      title: "Automated Follow-up System",
      description: "Smart automated follow-up sequences that adapt based on prospect behavior and engagement levels across multiple touchpoints.",
      author: "Lisa Wang",
      authorAvatar: "/api/placeholder/32/32",
      timeAgo: "2 days ago",
      category: "Automation",
      categoryColor: "#FF9800",
      likes: 15,
      comments: 4,
      activities: 4,
      collaborators: [
        "/api/placeholder/24/24",
        "/api/placeholder/24/24"
      ],
      collaboratorCount: 2
    }
  ];

  const sidebarStats = [
    { label: "Active Ideas", value: 24 },
    { label: "Your Votes", value: 18 },
    { label: "Implemented", value: 7 }
  ];

  const categories = [
    "All Ideas",
    "Sales Solutions", 
    "Customer Engagement",
    "Process Improvement"
  ];

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      width: '100%',
      overflow: 'hidden'
    }}>
      {/* Sidebar */}
      {/* {!isMobile && (
        <Box sx={{
          width: 280,
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e0e0e0',
          p: 3,
          flexShrink: 0
        }}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{
                width: 32,
                height: 32,
                backgroundColor: colors.blueAccent[700],
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
              }}>
                <Typography sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '16px' }}>
                  I
                </Typography>
              </Box>
              <Typography sx={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a1a' }}>
                IdeaHub
              </Typography>
            </Box>
            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              fullWidth
              sx={{
                backgroundColor: colors.blueAccent[700],
                color: '#ffffff',
                textTransform: 'none',
                borderRadius: 2,
                py: 1.5,
                '&:hover': {
                  backgroundColor: colors.blueAccent[800]
                }
              }}
            >
              Create New Idea
            </Button>
          </Box>

          <Box sx={{ mb: 4 }}>
            {categories.map((category, index) => (
              <Box
                key={category}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 1.5,
                  borderRadius: 1,
                  cursor: 'pointer',
                  backgroundColor: index === 0 ? colors.blueAccent[100] : 'transparent',
                  color: index === 0 ? colors.blueAccent[700] : '#666666',
                  '&:hover': {
                    backgroundColor: colors.blueAccent[50]
                  },
                  mb: 0.5
                }}
              >
                <Typography sx={{ fontSize: '14px', fontWeight: index === 0 ? 600 : 400 }}>
                  {category}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box>
            <Typography sx={{ fontSize: '14px', fontWeight: 'bold', mb: 2, color: '#1a1a1a' }}>
              Quick Stats
            </Typography>
            {sidebarStats.map((stat) => (
              <Box key={stat.label} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography sx={{ fontSize: '13px', color: '#666666' }}>
                  {stat.label}
                </Typography>
                <Typography sx={{ fontSize: '13px', fontWeight: 'bold', color: '#1a1a1a' }}>
                  {stat.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )} */}

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ fontSize: '28px', fontWeight: 'bold', color: '#1a1a1a', mb: 1 }}>
            Innovation Ideas
          </Typography>
          <Typography sx={{ fontSize: '16px', color: '#666666', mb: 3 }}>
            Collaborate on B2B sales solutions and strategies
          </Typography>

          {/* Controls */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 2
          }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                sx={{ fontSize: '14px' }}
              >
                <MenuItem value="Latest">Sort by: Latest</MenuItem>
                <MenuItem value="Popular">Sort by: Popular</MenuItem>
                <MenuItem value="Most Voted">Sort by: Most Voted</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                onClick={() => setViewMode('grid')}
                sx={{ 
                  backgroundColor: viewMode === 'grid' ? colors.blueAccent[100] : 'transparent',
                  color: viewMode === 'grid' ? colors.blueAccent[700] : '#666666'
                }}
              >
                <GridViewIcon />
              </IconButton>
              <IconButton
                onClick={() => setViewMode('list')}
                sx={{ 
                  backgroundColor: viewMode === 'list' ? colors.blueAccent[100] : 'transparent',
                  color: viewMode === 'list' ? colors.blueAccent[700] : '#666666'
                }}
              >
                <ListViewIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Ideas Grid */}
        <Grid container spacing={isMobile ? 2 : 3}>
          {ideas.map((idea) => (
            <Grid item xs={12} md={viewMode === 'grid' ? 6 : 12} key={idea.id}>
              <Card sx={{
                backgroundColor: '#ffffff',
                borderRadius: isMobile ? 2 : 3,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '1px solid #e0e0e0',
                '&:hover': {
                  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease'
                }
              }}>
                <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                  {/* Header */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    justifyContent: 'space-between', 
                    mb: 2,
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? 1.5 : 0
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, width: '100%' }}>
                      <Avatar
                        src={idea.authorAvatar}
                        sx={{ width: isMobile ? 28 : 32, height: isMobile ? 28 : 32, mr: 1.5 }}
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ 
                          fontSize: isMobile ? '13px' : '14px', 
                          fontWeight: 'bold', 
                          color: '#1a1a1a',
                          lineHeight: 1.4,
                          wordBreak: 'break-word'
                        }}>
                          {idea.title}
                        </Typography>
                        <Typography sx={{ 
                          fontSize: isMobile ? '11px' : '12px', 
                          color: '#666666',
                          lineHeight: 1.3
                        }}>
                          by {idea.author} • {idea.timeAgo}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={idea.category}
                      size="small"
                      sx={{
                        backgroundColor: idea.categoryColor + '20',
                        color: idea.categoryColor,
                        fontSize: isMobile ? '10px' : '11px',
                        fontWeight: 600,
                        border: 'none',
                        alignSelf: isMobile ? 'flex-start' : 'center',
                        ml: isMobile ? 0 : 1
                      }}
                    />
                  </Box>

                  {/* Description */}
                  <Typography sx={{
                    fontSize: isMobile ? '13px' : '14px',
                    color: '#1a1a1a',
                    lineHeight: 1.6,
                    mb: 3,
                    wordBreak: 'break-word'
                  }}>
                    {idea.description}
                  </Typography>

                  {/* Stats */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    pt: 2,
                    borderTop: '1px solid #f0f0f0',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? 2 : 0
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: isMobile ? 2 : 3,
                      width: isMobile ? '100%' : 'auto',
                      justifyContent: isMobile ? 'space-around' : 'flex-start'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ThumbUpIcon sx={{ fontSize: isMobile ? 14 : 16, color: '#666666' }} />
                        <Typography sx={{ fontSize: isMobile ? '12px' : '13px', color: '#666666' }}>
                          {idea.likes}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CommentIcon sx={{ fontSize: isMobile ? 14 : 16, color: '#666666' }} />
                        <Typography sx={{ fontSize: isMobile ? '12px' : '13px', color: '#666666' }}>
                          {idea.comments}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ViewIcon sx={{ fontSize: isMobile ? 14 : 16, color: '#666666' }} />
                        <Typography sx={{ fontSize: isMobile ? '12px' : '13px', color: '#666666' }}>
                          {idea.activities} activities
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      width: isMobile ? '100%' : 'auto',
                      justifyContent: isMobile ? 'space-between' : 'flex-end'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {idea.collaborators.slice(0, 3).map((avatar, index) => (
                          <Avatar
                            key={index}
                            src={avatar}
                            sx={{
                              width: isMobile ? 20 : 24,
                              height: isMobile ? 20 : 24,
                              ml: index > 0 ? -0.5 : 0,
                              border: '2px solid #ffffff'
                            }}
                          />
                        ))}
                        {idea.collaboratorCount > 3 && (
                          <Box sx={{
                            width: isMobile ? 20 : 24,
                            height: isMobile ? 20 : 24,
                            borderRadius: '50%',
                            backgroundColor: '#f0f0f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            ml: -0.5,
                            border: '2px solid #ffffff'
                          }}>
                            <Typography sx={{ fontSize: isMobile ? '8px' : '10px', color: '#666666' }}>
                              +{idea.collaboratorCount - 3}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{
                          textTransform: 'none',
                          fontSize: isMobile ? '11px' : '12px',
                          borderColor: colors.blueAccent[300],
                          color: colors.blueAccent[700],
                          px: isMobile ? 1.5 : 2,
                          py: isMobile ? 0.5 : 1,
                          minWidth: isMobile ? '80px' : 'auto',
                          '&:hover': {
                            backgroundColor: colors.blueAccent[50]
                          }
                        }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Load More */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="outlined"
            sx={{
              textTransform: 'none',
              borderColor: colors.blueAccent[300],
              color: colors.blueAccent[700],
              px: 4,
              '&:hover': {
                backgroundColor: colors.blueAccent[50]
              }
            }}
          >
            Load More Ideas
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AllIdeas;
