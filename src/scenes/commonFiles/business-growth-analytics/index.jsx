import React from 'react';
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Select,
  Button
} from 'antd';
import {
  DownloadOutlined,
  Refresh as ReloadOutlined,
  AttachMoney as DollarOutlined,
  Person as UserOutlined,
  BarChart as BarChartOutlined,
  TrendingUp as RiseOutlined
} from '@mui/icons-material';
import { tokens } from '../../../theme';

const BusinessGrowthAnalytics = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery("(max-width:768px)");
  const isTablet = useMediaQuery("(max-width:1024px)");

  return (
    <Box>
      {/* Business Growth Analytics Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: isMobile || isTablet ? 'column' : 'row', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography
              style={{
                textAlign: "left",
                fontSize: isMobile ? "15px" : isTablet ? "17px" : "18px",
                paddingLeft: "0px",
                fontWeight: "600",
                color: '#1a1a1a'
              }}
            >
              Business Growth Analytics
            </Typography>
            <Typography sx={{
              fontSize: '14px',
              color: '#666666'
            }}>
              Insights and metrics to drive B2B account growth
            </Typography>
          </Box>
          <Box sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 1.5 : 2,
            mt: isMobile ? 2 : 0,
            width: isMobile ? '100%' : 'auto'
          }}>
            <Select
              defaultValue="This Quarter"
              style={{
                width: isMobile ? '100%' : 120,
                fontSize: isMobile ? '12px' : '11px'
              }}
              size="middle"
            >
              <Select.Option value="thisQuarter" style={{ fontSize: isMobile ? '12px' : '11px' }}>This Quarter</Select.Option>
              <Select.Option value="lastQuarter" style={{ fontSize: isMobile ? '12px' : '11px' }}>Last Quarter</Select.Option>
              <Select.Option value="thisYear" style={{ fontSize: isMobile ? '12px' : '11px' }}>This Year</Select.Option>
              <Select.Option value="lastYear" style={{ fontSize: isMobile ? '12px' : '11px' }}>Last Year</Select.Option>
            </Select>
            <Box sx={{
              display: 'flex',
              gap: isMobile ? 1 : 2,
              width: isMobile ? '100%' : 'auto'
            }}>
              <Button
                className="form-button"
                type="primary"
                icon={<DownloadOutlined />}
                style={{
                  background: colors.blueAccent[1000],
                  border: 'none',
                  fontSize: isMobile ? '12px' : '14px',
                  height: isMobile ? '36px' : '32px',
                  flex: isMobile ? 1 : 'none'
                }}
              >
                {isMobile ? 'Export' : 'Export'}
              </Button>
              <Button
                className="form-button"
                type="default"
                icon={<ReloadOutlined />}
                style={{
                  border: '1px solid #d9d9d9',
                  fontSize: isMobile ? '12px' : '14px',
                  height: isMobile ? '36px' : '32px',
                  flex: isMobile ? 1 : 'none'
                }}
              >
                {isMobile ? 'Refresh' : 'Refresh'}
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Key Metrics Cards */}
        <Box sx={{ display: 'flex', flexDirection: isMobile || isTablet ? 'column' : 'row', gap: 3, mb: 4 }}>
          {/* Revenue Growth Card */}
          <Box sx={{
            flex: 1,
            p: 3,
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            textAlign: 'left',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{
                width: '40px',
                height: '40px',
                backgroundColor: '#dcfce6',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px'
              }}>
                <DollarOutlined style={{ color: '#3bb468', fontSize: '20px' }} />
              </Box>
              <Box sx={{ backgroundColor: "#dcfce6", padding: "4px 8px", borderRadius: "4px" }}>
                <Typography style={{ fontSize: '11px', color: '#3bb468', fontWeight: '600' }}>
                  +5.2%
                </Typography>
              </Box>
            </Box>
            <Typography style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a', mb: 1 }}>
              28.5%
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography style={{ fontSize: '12px', color: '#666666' }}>
                Revenue Growth
              </Typography>
            </Box>
          </Box>

          {/* Account Growth Card */}
          <Box sx={{
            flex: 1,
            p: 3,
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            textAlign: 'left',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{
                width: '40px',
                height: '40px',
                backgroundColor: '#dbeafe',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px'
              }}>
                <UserOutlined style={{ color: '#3b82f6', fontSize: '20px' }} />
              </Box>
              <Box sx={{ backgroundColor: "#dcfce6", padding: "4px 8px", borderRadius: "4px" }}>
                <Typography style={{ fontSize: '11px', color: '#3bb468', fontWeight: '600' }}>
                  +3.1%
                </Typography>
              </Box>
            </Box>
            <Typography style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a', mb: 1 }}>
              15.2%
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography style={{ fontSize: '12px', color: '#666666' }}>
                Account Growth
              </Typography>
            </Box>
          </Box>

          {/* Activity Efficiency Card */}
          <Box sx={{
            flex: 1,
            p: 3,
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            textAlign: 'left',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{
                width: '40px',
                height: '40px',
                backgroundColor: '#fef3c7',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px'
              }}>
                <BarChartOutlined style={{ color: '#f59e0b', fontSize: '20px' }} />
              </Box>
              <Box sx={{ backgroundColor: "#fef2f2", padding: "4px 8px", borderRadius: "4px" }}>
                <Typography style={{ fontSize: '11px', color: '#ef4444', fontWeight: '600' }}>
                  -2.4%
                </Typography>
              </Box>
            </Box>
            <Typography style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a', mb: 1 }}>
              73.8%
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography style={{ fontSize: '12px', color: '#666666' }}>
                Activity Efficiency
              </Typography>
            </Box>
          </Box>

          {/* Pipeline Value Card */}
          <Box sx={{
            flex: 1,
            p: 3,
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            textAlign: 'left',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{
                width: '40px',
                height: '40px',
                backgroundColor: '#e0e7ff',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px'
              }}>
                <RiseOutlined style={{ color: '#6366f1', fontSize: '20px' }} />
              </Box>
              <Box sx={{ backgroundColor: "#dcfce6", padding: "4px 8px", borderRadius: "4px" }}>
                <Typography style={{ fontSize: '11px', color: '#3bb468', fontWeight: '600' }}>
                  +12.8%
                </Typography>
              </Box>
            </Box>
            <Typography style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a', mb: 1 }}>
              $2.85M
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography style={{ fontSize: '12px', color: '#666666' }}>
                Pipeline Value
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Sales Pipeline Overview */}
        <Box sx={{ mb: 4 }}>
          <Typography
            style={{
              textAlign: "left",
              fontSize: isMobile ? "15px" : isTablet ? "17px" : "18px",
              paddingLeft: "0px",
              fontWeight: "600",
              color: '#1a1a1a',
              marginBottom: "5px"
            }}
          >
            Sales Pipeline Overview
          </Typography>
          <Typography style={{
            fontSize: '14px',
            color: '#666666',
            marginBottom: "10px"
          }}>
            High-value opportunities requiring attention
          </Typography>

          {/* Pipeline Summary Metrics */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: isMobile ? 2 : 3,
            mb: 4
          }}>
            <Box sx={{
              p: isMobile ? 1.5 : 2,
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              textAlign: 'center',
              backgroundColor: '#ffffff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <Typography style={{
                fontSize: isMobile ? '16px' : '20px',
                fontWeight: '700',
                color: '#1a1a1a',
                mb: 1
              }}>
                $2.9M
              </Typography>
              <Typography style={{
                fontSize: isMobile ? '10px' : '12px',
                color: '#666666'
              }}>
                Total Pipeline
              </Typography>
            </Box>
            <Box sx={{
              p: isMobile ? 1.5 : 2,
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              textAlign: 'center',
              backgroundColor: '#ffffff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <Typography style={{
                fontSize: isMobile ? '16px' : '20px',
                fontWeight: '700',
                color: '#1a1a1a',
                mb: 1
              }}>
                $185K
              </Typography>
              <Typography style={{
                fontSize: isMobile ? '10px' : '12px',
                color: '#666666'
              }}>
                Average Deal Size
              </Typography>
            </Box>
            <Box sx={{
              p: isMobile ? 1.5 : 2,
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              textAlign: 'center',
              backgroundColor: '#ffffff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <Typography style={{
                fontSize: isMobile ? '16px' : '20px',
                fontWeight: '700',
                color: '#1a1a1a',
                mb: 1
              }}>
                42
              </Typography>
              <Typography style={{
                fontSize: isMobile ? '10px' : '12px',
                color: '#666666'
              }}>
                Days Sales Cycle
              </Typography>
            </Box>
            <Box sx={{
              p: isMobile ? 1.5 : 2,
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              textAlign: 'center',
              backgroundColor: '#ffffff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <Typography style={{
                fontSize: isMobile ? '16px' : '20px',
                fontWeight: '700',
                color: '#1a1a1a',
                mb: 1
              }}>
                31.5%
              </Typography>
              <Typography style={{
                fontSize: isMobile ? '10px' : '12px',
                color: '#666666'
              }}>
                Upsell Rate
              </Typography>
            </Box>
          </Box>

          {/* Opportunity List */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Enterprise Platform Upgrade */}
            <Box sx={{
              p: isMobile ? 2 : 3,
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <Box sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'flex-start' : 'flex-start',
                mb: 2
              }}>
                <Box sx={{ flex: 1, width: isMobile ? '100%' : 'auto' }}>
                  <Typography style={{
                    fontSize: isMobile ? '14px' : '16px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    mb: 1
                  }}>
                    Enterprise Platform Upgrade
                  </Typography>
                  <Typography style={{
                    fontSize: isMobile ? '12px' : '14px',
                    color: '#666666',
                    mb: 2
                  }}>
                    Acme Corporation
                  </Typography>
                  <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                    gap: isMobile ? 1.5 : 2,
                    mb: 2
                  }}>
                    <Box>
                      <Typography style={{ fontSize: '12px', color: '#666666' }}>
                        Value
                      </Typography>
                      <Typography style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: '600', color: '#1a1a1a' }}>
                        $750K
                      </Typography>
                    </Box>
                    <Box>
                      <Typography style={{ fontSize: '12px', color: '#666666' }}>
                        Probability
                      </Typography>
                      <Typography style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: '600', color: '#1a1a1a' }}>
                        85%
                      </Typography>
                    </Box>
                    <Box>
                      <Typography style={{ fontSize: '12px', color: '#666666' }}>
                        Expected Close
                      </Typography>
                      <Typography style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: '600', color: '#1a1a1a' }}>
                        15/04/2024
                      </Typography>
                    </Box>
                    <Box>
                      <Typography style={{ fontSize: '12px', color: '#666666' }}>
                        Activities
                      </Typography>
                      <Typography style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: '600', color: '#1a1a1a' }}>
                        8 completed
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ width: isMobile ? '100%' : '200px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography style={{ fontSize: '12px', color: '#666666' }}>
                        Progress
                      </Typography>
                      <Typography style={{ fontSize: '12px', color: '#666666' }}>
                        85%
                      </Typography>
                    </Box>
                    <Box sx={{ width: '100%', height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                      <Box sx={{ width: '85%', height: '100%', backgroundColor: '#3b82f6', borderRadius: '4px' }} />
                    </Box>
                  </Box>
                </Box>
                <Box sx={{
                  display: 'flex',
                  gap: 1,
                  mb: 2,
                  flexWrap: 'wrap',
                  mt: isMobile ? 2 : 0,
                  alignSelf: isMobile ? 'flex-start' : 'flex-end'
                }}>
                  <Box sx={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    high
                  </Box>
                  <Box sx={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    negotiation
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Multi-Year Service Extension */}
            <Box sx={{
              p: isMobile ? 2 : 3,
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <Box sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'flex-start' : 'flex-start',
                mb: 2
              }}>
                <Box sx={{ flex: 1, width: isMobile ? '100%' : 'auto' }}>
                  <Typography style={{
                    fontSize: isMobile ? '14px' : '16px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    mb: 1
                  }}>
                    Multi-Year Service Extension
                  </Typography>
                  <Typography style={{
                    fontSize: isMobile ? '12px' : '14px',
                    color: '#666666',
                    mb: 2
                  }}>
                    Global Solutions Ltd
                  </Typography>
                  <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                    gap: isMobile ? 1.5 : 2,
                    mb: 2
                  }}>
                    <Box>
                      <Typography style={{ fontSize: '12px', color: '#666666' }}>
                        Value
                      </Typography>
                      <Typography style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: '600', color: '#1a1a1a' }}>
                        $480K
                      </Typography>
                    </Box>
                    <Box>
                      <Typography style={{ fontSize: '12px', color: '#666666' }}>
                        Probability
                      </Typography>
                      <Typography style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: '600', color: '#1a1a1a' }}>
                        70%
                      </Typography>
                    </Box>
                    <Box>
                      <Typography style={{ fontSize: '12px', color: '#666666' }}>
                        Expected Close
                      </Typography>
                      <Typography style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: '600', color: '#1a1a1a' }}>
                        01/05/2024
                      </Typography>
                    </Box>
                    <Box>
                      <Typography style={{ fontSize: '12px', color: '#666666' }}>
                        Activities
                      </Typography>
                      <Typography style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: '600', color: '#1a1a1a' }}>
                        6 completed
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ width: isMobile ? '100%' : '200px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography style={{ fontSize: '12px', color: '#666666' }}>
                        Progress
                      </Typography>
                      <Typography style={{ fontSize: '12px', color: '#666666' }}>
                        70%
                      </Typography>
                    </Box>
                    <Box sx={{ width: '100%', height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                      <Box sx={{ width: '70%', height: '100%', backgroundColor: '#3b82f6', borderRadius: '4px' }} />
                    </Box>
                  </Box>
                </Box>
                <Box sx={{
                  display: 'flex',
                  gap: 1,
                  mb: 2,
                  flexWrap: 'wrap',
                  mt: isMobile ? 2 : 0,
                  alignSelf: isMobile ? 'flex-start' : 'flex-end'
                }}>
                  <Box sx={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    high
                  </Box>
                  <Box sx={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    proposal
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Advanced Analytics Package */}
            <Box sx={{
              p: isMobile ? 2 : 3,
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <Box sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'flex-start' : 'flex-start',
                mb: 2
              }}>
                <Box sx={{ flex: 1, width: isMobile ? '100%' : 'auto' }}>
                  <Typography style={{
                    fontSize: isMobile ? '14px' : '16px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    mb: 1
                  }}>
                    Advanced Analytics Package
                  </Typography>
                  <Typography style={{
                    fontSize: isMobile ? '12px' : '14px',
                    color: '#666666',
                    mb: 2
                  }}>
                    TechStart Inc.
                  </Typography>
                  <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                    gap: isMobile ? 1.5 : 2,
                    mb: 2
                  }}>
                    <Box>
                      <Typography style={{ fontSize: '12px', color: '#666666' }}>
                        Value
                      </Typography>
                      <Typography style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: '600', color: '#1a1a1a' }}>
                        $220K
                      </Typography>
                    </Box>
                    <Box>
                      <Typography style={{ fontSize: '12px', color: '#666666' }}>
                        Probability
                      </Typography>
                      <Typography style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: '600', color: '#1a1a1a' }}>
                        60%
                      </Typography>
                    </Box>
                    <Box>
                      <Typography style={{ fontSize: '12px', color: '#666666' }}>
                        Expected Close
                      </Typography>
                      <Typography style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: '600', color: '#1a1a1a' }}>
                        30/04/2024
                      </Typography>
                    </Box>
                    <Box>
                      <Typography style={{ fontSize: '12px', color: '#666666' }}>
                        Activities
                      </Typography>
                      <Typography style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: '600', color: '#1a1a1a' }}>
                        4 completed
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ width: isMobile ? '100%' : '200px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography style={{ fontSize: '12px', color: '#666666' }}>
                        Progress
                      </Typography>
                      <Typography style={{ fontSize: '12px', color: '#666666' }}>
                        60%
                      </Typography>
                    </Box>
                    <Box sx={{ width: '100%', height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                      <Box sx={{ width: '60%', height: '100%', backgroundColor: '#3b82f6', borderRadius: '4px' }} />
                    </Box>
                  </Box>
                </Box>

                <Box sx={{
                  display: 'flex',
                  gap: 1,
                  mb: 2,
                  flexWrap: 'wrap',
                  mt: isMobile ? 2 : 0,
                  alignSelf: isMobile ? 'flex-start' : 'flex-end'
                }}>
                  <Box sx={{
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    medium
                  </Box>
                  <Box sx={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    qualified
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Security Compliance Upgrade */}
            <Box sx={{
              p: isMobile ? 2 : 3,
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              position: 'relative'
            }}>
              <Box sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'flex-start' : 'flex-start',
                mb: 2
              }}>
                <Box sx={{ flex: 1, width: isMobile ? '100%' : 'auto' }}>
                  <Typography style={{
                    fontSize: isMobile ? '14px' : '16px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    mb: 1
                  }}>
                    Security Compliance Upgrade
                  </Typography>
                  <Typography style={{
                    fontSize: isMobile ? '12px' : '14px',
                    color: '#666666',
                    mb: 2
                  }}>
                    DataFlow Systems
                  </Typography>
                  <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                    gap: isMobile ? 1.5 : 2,
                    mb: 2
                  }}>
                    <Box>
                      <Typography style={{ fontSize: '12px', color: '#666666' }}>
                        Value
                      </Typography>
                      <Typography style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: '600', color: '#1a1a1a' }}>
                        $320K
                      </Typography>
                    </Box>
                    <Box>
                      <Typography style={{ fontSize: '12px', color: '#666666' }}>
                        Probability
                      </Typography>
                      <Typography style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: '600', color: '#1a1a1a' }}>
                        75%
                      </Typography>
                    </Box>
                    <Box>
                      <Typography style={{ fontSize: '12px', color: '#666666' }}>
                        Expected Close
                      </Typography>
                      <Typography style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: '600', color: '#1a1a1a' }}>
                        28/03/2024
                      </Typography>
                    </Box>
                    <Box>
                      <Typography style={{ fontSize: '12px', color: '#666666' }}>
                        Activities
                      </Typography>
                      <Typography style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: '600', color: '#1a1a1a' }}>
                        5 completed
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ width: isMobile ? '100%' : '200px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography style={{ fontSize: '12px', color: '#666666' }}>
                        Progress
                      </Typography>
                      <Typography style={{ fontSize: '12px', color: '#666666' }}>
                        75%
                      </Typography>
                    </Box>
                    <Box sx={{ width: '100%', height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                      <Box sx={{ width: '75%', height: '100%', backgroundColor: '#3b82f6', borderRadius: '4px' }} />
                    </Box>
                  </Box>
                </Box>
                <Box sx={{
                  display: 'flex',
                  gap: 1,
                  mb: 2,
                  flexWrap: 'wrap',
                  mt: isMobile ? 2 : 0,
                  alignSelf: isMobile ? 'flex-start' : 'flex-end'
                }}>
                  <Box sx={{
                    backgroundColor: '#ef4444',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    urgent
                  </Box>
                  <Box sx={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    proposal
                  </Box>
                </Box>
              </Box>

              {/* Floating overlay */}
              <Box sx={{
                position: 'absolute',
                top: isMobile ? '5px' : '10px',
                right: isMobile ? '5px' : '10px',
                backgroundColor: 'rgba(0,0,0,0.1)',
                borderRadius: '4px',
                padding: '4px',
                display: 'flex',
                gap: '4px'
              }}>
                <Box sx={{ width: '16px', height: '16px', backgroundColor: '#666', borderRadius: '2px' }} />
                <Box sx={{ width: '16px', height: '16px', backgroundColor: '#666', borderRadius: '2px' }} />
                <Box sx={{ width: '16px', height: '16px', backgroundColor: '#ef4444', borderRadius: '2px' }} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BusinessGrowthAnalytics;