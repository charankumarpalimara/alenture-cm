import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  useTheme, 
  useMediaQuery,
  InputBase,
  Avatar,
  Button,
  Chip,
  Card,
  CardContent,
  Tabs,
  Tab,
  IconButton
} from '@mui/material';
import { 
  Search,
  Add,
  Business,
  Schedule,
  Assessment,
  Share,
  Visibility,
  CalendarToday,
  TrendingUp
} from '@mui/icons-material';
import { tokens } from '../../../theme';

const CustomerInsights = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const Mobile = useMediaQuery("(max-width: 400px)");
  const isTablet = useMediaQuery("(max-width: 700px)");
  const isCards = useMediaQuery("(max-width: 540px)");
  const isHightTablet = useMediaQuery("(max-width: 830px)");
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      padding: isMobile ? '16px' : '24px'
    }}>
      {/* Header */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        backgroundColor: '#ffffff',
        padding: '16px 24px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{
            width: '40px',
            height: '40px',
            backgroundColor: '#4f46e5',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TrendingUp sx={{ color: 'white', fontSize: '24px' }} />
          </Box>
          <Typography sx={{
        textAlign: "left",
        fontSize: Mobile ? "15px" : isTablet ? "17px" : "18px",
        paddingLeft: "0px",
        fontWeight: "600",
        color: '#1a1a1a'
          }}>
            Customer Insights
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Search Bar */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f3f4f6',
            borderRadius: '8px',
            padding: '8px 16px',
            minWidth: isMobile ? '200px' : '300px'
          }}>
            <Search sx={{ color: '#9ca3af', marginRight: '8px' }} />
            <InputBase
              placeholder="Search customers..."
              sx={{
                flex: 1,
                fontSize: '14px',
                color: '#374151'
              }}
            />
          </Box>

          {/* Profile Avatar */}
          <Avatar 
            src="/api/placeholder/32/32"
            sx={{ width: 32, height: 32 }}
          />
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', gap: 3, flexDirection: isMobile ? 'column' : 'row' }}>
        {/* Left Column - Main Content */}
        <Box sx={{ flex: 1 }}>
          {/* Company Profile Card */}
          <Card sx={{ 
            marginBottom: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: 'none'
          }}>
            <CardContent sx={{ padding: '24px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#3b82f6',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Business sx={{ color: 'white', fontSize: '24px' }} />
                  </Box>
                  <Box>
                    <Typography sx={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '4px'
                    }}>
                      TechCorp Industries
                    </Typography>
                    <Typography sx={{
                      fontSize: '14px',
                      color: '#6b7280'
                    }}>
                      Fortune 500 Technology Company
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  startIcon={<Add />}
                  className='form-button'
                  sx={{
                    // backgroundColor: '#3b82f6',
                    background: colors.blueAccent[1000],
                    color: 'white',
                    // borderRadius: '8px',
                    textTransform: 'none',
                    // fontSize: '14px',
                    // fontWeight: '500',
                    '&:hover': {
                      backgroundColor: '#2563eb'
                    }
                  }}
                >
                  Create Action Plan
                </Button>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Chip
                  label="Active Client"
                  sx={{
                    backgroundColor: '#dcfce7',
                    color: '#166534',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}
                />
                <Chip
                  label="Account Value: $2.5M"
                  sx={{
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}
                />
              </Box>

              {/* Tabs */}
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange}
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#6b7280',
                    minHeight: '40px'
                  },
                  '& .Mui-selected': {
                    color: '#3b82f6 !important'
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#3b82f6'
                  }
                }}
              >
                <Tab label="News & Publications" />
                <Tab label="Financial Updates" />
                <Tab label="Industry Trends" />
              </Tabs>
            </CardContent>
          </Card>

          {/* News Articles */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Article 1 */}
            <Card sx={{ 
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <CardContent sx={{ padding: '20px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '8px'
                    }}>
                      TechCorp Announces $500M Investment in AI Research
                    </Typography>
                    <Typography sx={{
                      fontSize: '12px',
                      color: '#6b7280',
                      marginBottom: '12px',
                      lineHeight: 1.5
                    }}>
                      The company plans to expand its artificial intelligence capabilities with a focus on enterprise solutions...
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography sx={{ fontSize: '12px', color: '#9ca3af' }}>
                        📅 2 days ago
                      </Typography>
                      <Typography sx={{ fontSize: '12px', color: '#9ca3af' }}>
                        📰 TechCrunch
                      </Typography>
                      <Chip
                        label="High Impact"
                        size="small"
                        sx={{
                          backgroundColor: '#fef3c7',
                          color: '#d97706',
                          fontSize: '11px',
                          height: '20px'
                        }}
                      />
                    </Box>
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                     className='form-button'
                    sx={{
                      borderColor: '#10b981',
                      color: '#10b981',
                      textTransform: 'none',
                      // fontSize: '12px',
                      marginLeft: '16px',
                      '&:hover': {
                        backgroundColor: '#ecfdf5',
                        borderColor: '#10b981'
                      }
                    }}
                  >
                    🔍 Create Insight
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Article 2 */}
            <Card sx={{ 
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <CardContent sx={{ padding: '20px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '8px'
                    }}>
                      CEO Interview: Digital Transformation Strategy
                    </Typography>
                    <Typography sx={{
                      fontSize: '12px',
                      color: '#6b7280',
                      marginBottom: '12px',
                      lineHeight: 1.5
                    }}>
                      TechCorp's CEO discusses the company's 5-year roadmap for digital transformation and cloud migration...
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography sx={{ fontSize: '12px', color: '#9ca3af' }}>
                        📅 1 week ago
                      </Typography>
                      <Typography sx={{ fontSize: '12px', color: '#9ca3af' }}>
                        📰 Forbes
                      </Typography>
                      <Chip
                        label="Medium Impact"
                        size="small"
                        sx={{
                          backgroundColor: '#dbeafe',
                          color: '#2563eb',
                          fontSize: '11px',
                          height: '20px'
                        }}
                      />
                    </Box>
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: '#10b981',
                      color: '#10b981',
                      textTransform: 'none',
                      fontSize: '12px',
                      marginLeft: '16px',
                      '&:hover': {
                        backgroundColor: '#ecfdf5',
                        borderColor: '#10b981'
                      }
                    }}
                  >
                    🔍 Create Insight
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Article 3 */}
            <Card sx={{ 
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <CardContent sx={{ padding: '20px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '8px'
                    }}>
                      Q3 Earnings Beat Expectations
                    </Typography>
                    <Typography sx={{
                      fontSize: '12px',
                      color: '#6b7280',
                      marginBottom: '12px',
                      lineHeight: 1.5
                    }}>
                      TechCorp reported 15% revenue growth driven by strong demand for cloud services and cybersecurity solutions...
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography sx={{ fontSize: '12px', color: '#9ca3af' }}>
                        📅 2 weeks ago
                      </Typography>
                      <Typography sx={{ fontSize: '12px', color: '#9ca3af' }}>
                        📰 Reuters
                      </Typography>
                      <Chip
                        label="High Impact"
                        size="small"
                        sx={{
                          backgroundColor: '#dcfce7',
                          color: '#166534',
                          fontSize: '11px',
                          height: '20px'
                        }}
                      />
                    </Box>
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: '#10b981',
                      color: '#10b981',
                      textTransform: 'none',
                      fontSize: '12px',
                      marginLeft: '16px',
                      '&:hover': {
                        backgroundColor: '#ecfdf5',
                        borderColor: '#10b981'
                      }
                    }}
                  >
                    🔍 Create Insight
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Right Sidebar */}
        <Box sx={{ width: isMobile ? '100%' : '320px' }}>
          {/* Quick Stats */}
          <Card sx={{ 
            marginBottom: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <CardContent sx={{ padding: '20px' }}>
              <Typography sx={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '16px'
              }}>
                Quick Stats
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '12px', color: '#6b7280' }}>
                    Last Contact
                  </Typography>
                  <Typography sx={{ fontSize: '12px', fontWeight: '500', color: '#1f2937' }}>
                    3 days ago
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '12px', color: '#6b7280' }}>
                    Next Meeting
                  </Typography>
                  <Typography sx={{ fontSize: '12px', fontWeight: '500', color: '#1f2937' }}>
                    Tomorrow 2PM
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '12px', color: '#6b7280' }}>
                    Active Insights
                  </Typography>
                  <Typography sx={{ fontSize: '12px', fontWeight: '500', color: '#1f2937' }}>
                    7
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '12px', color: '#6b7280' }}>
                    Action Plans
                  </Typography>
                  <Typography sx={{ fontSize: '12px', fontWeight: '500', color: '#1f2937' }}>
                    3
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Active Insights */}
          <Card sx={{ 
            marginBottom: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <CardContent sx={{ padding: '20px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography sx={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1f2937'
                }}>
                  Active Insights
                </Typography>
                <Button sx={{ 
                  fontSize: '12px', 
                  color: '#3b82f6',
                  textTransform: 'none',
                  padding: 0,
                  minWidth: 'auto'
                }}>
                  View All
                </Button>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Insight 1 */}
                <Box sx={{
                  padding: '12px',
                  backgroundColor: '#fef3c7',
                  borderRadius: '8px',
                  border: '1px solid #fbbf24'
                }}>
                  <Typography sx={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#92400e',
                    marginBottom: '4px'
                  }}>
                    AI Investment Opportunity
                  </Typography>
                  <Typography sx={{
                    fontSize: '12px',
                    color: '#92400e',
                    marginBottom: '8px'
                  }}>
                    Propose AI consulting services
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip
                      label="High Priority"
                      size="small"
                      sx={{
                        backgroundColor: '#fbbf24',
                        color: '#92400e',
                        fontSize: '10px',
                        height: '18px'
                      }}
                    />
                    <Button sx={{ 
                      fontSize: '10px', 
                      color: '#92400e',
                      textTransform: 'none',
                      padding: 0,
                      minWidth: 'auto'
                    }}>
                      View Plan
                    </Button>
                  </Box>
                </Box>

                {/* Insight 2 */}
                <Box sx={{
                  padding: '12px',
                  backgroundColor: '#e0e7ff',
                  borderRadius: '8px',
                  border: '1px solid #a5b4fc'
                }}>
                  <Typography sx={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#3730a3',
                    marginBottom: '4px'
                  }}>
                    Cloud Migration
                  </Typography>
                  <Typography sx={{
                    fontSize: '12px',
                    color: '#3730a3',
                    marginBottom: '8px'
                  }}>
                    Discuss infrastructure solutions
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip
                      label="Medium Priority"
                      size="small"
                      sx={{
                        backgroundColor: '#a5b4fc',
                        color: '#3730a3',
                        fontSize: '10px',
                        height: '18px'
                      }}
                    />
                    <Button sx={{ 
                      fontSize: '10px', 
                      color: '#3730a3',
                      textTransform: 'none',
                      padding: 0,
                      minWidth: 'auto'
                    }}>
                      View Plan
                    </Button>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card sx={{ 
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <CardContent sx={{ padding: '20px' }}>
              <Typography sx={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '16px'
              }}>
                Quick Actions
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Schedule />}
                  fullWidth
                  className='form-button'
                  sx={{
                    // backgroundColor: '#3b82f6',
                    background: colors.blueAccent[1000],
                    color: 'white',
                    // borderRadius: '8px',
                    textTransform: 'none',
                    justifyContent:"flex-start",
                    // fontSize: '14px',
                    // fontWeight: '500',
                    '&:hover': {
                      backgroundColor: '#2563eb'
                    }
                  }}
                >
                  🔒 Schedule Meeting
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<Assessment />}
                  fullWidth
                  className='form-button'
                  sx={{
                    // borderColor: '#d1d5db',
                    color: '#374151',
                    borderRadius: '8px',
                    textTransform: 'none',
                    // fontSize: '14px',
                    // fontWeight: '500',
                    // padding: '12px',
                    justifyContent: 'flex-start',
                    '&:hover': {
                      backgroundColor: '#f9fafb',
                      borderColor: '#d1d5db'
                    }
                  }}
                >
                  🔒 Generate Report
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<Share />}
                  fullWidth
                  className='form-button'
                  sx={{
                    // borderColor: '#d1d5db',
                    color: '#374151',
                    borderRadius: '8px',
                    textTransform: 'none',
                    // fontSize: '14px',
                    // fontWeight: '500',
                    // padding: '12px',
                    justifyContent: 'flex-start',
                    '&:hover': {
                      backgroundColor: '#f9fafb',
                      borderColor: '#d1d5db'
                    }
                  }}
                >
                  🔗 Share Insights
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default CustomerInsights;
