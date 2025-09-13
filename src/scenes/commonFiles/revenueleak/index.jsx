import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Chip,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  TrendingDown as TrendingDownIcon,
  Business as BusinessIcon,
  Timeline as TimelineIcon,
  Warning as WarningIcon,
  Assignment as AssignmentIcon,
  MonetizationOn as MonetizationOnIcon
} from '@mui/icons-material';
import { tokens } from '../../../theme';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

const RevenueLeak = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery("(max-width:768px)");

  // Sample data for the chart
  const chartData = [
    { month: '2024-01', payments: 45, lending: 35, wealth: 25, operations: 20, itServices: 15 },
    { month: '2024-02', payments: 42, lending: 33, wealth: 23, operations: 18, itServices: 14 },
    { month: '2024-03', payments: 40, lending: 30, wealth: 20, operations: 16, itServices: 12 },
    { month: '2024-04', payments: 38, lending: 28, wealth: 18, operations: 14, itServices: 10 },
    { month: '2024-05', payments: 35, lending: 25, wealth: 15, operations: 12, itServices: 8 },
    { month: '2024-06', payments: 32, lending: 22, wealth: 12, operations: 10, itServices: 6 }
  ];

  // Leak signals data
  const leakSignals = [
    { unit: 'Wealth', current: '115K', previous: '92K', decline: '-20.0%', leakEstimate: '23K', confidence: '95%' },
    { unit: 'Payments', current: '85K', previous: '78K', decline: '-8.2%', leakEstimate: '7K', confidence: '88%' },
    { unit: 'Lending', current: '95K', previous: '88K', decline: '-7.4%', leakEstimate: '7K', confidence: '82%' },
    { unit: 'IT Shared Services', current: '45K', previous: '42K', decline: '-6.7%', leakEstimate: '3K', confidence: '75%' },
    { unit: 'Operations', current: '65K', previous: '61K', decline: '-6.2%', leakEstimate: '4K', confidence: '70%' }
  ];

  // Recommendations data
  const recommendations = [
    {
      unit: 'Wealth',
      items: [
        'Business case & ROI/TCO analysis',
        'Mutual close plan',
        'Commercial proposal & pricing review'
      ]
    },
    {
      unit: 'Payments',
      items: [
        'Business case & ROI/TCO analysis',
        'Mutual close plan',
        'Commercial proposal & pricing review'
      ]
    },
    {
      unit: 'Lending',
      items: [
        'Business case & ROI/TCO analysis',
        'Mutual close plan',
        'Commercial proposal & pricing review'
      ]
    },
    {
      unit: 'IT Shared Services',
      items: [
        'Business case & ROI/TCO analysis',
        'Mutual close plan',
        'Commercial proposal & pricing review'
      ]
    },
    {
      unit: 'Operations',
      items: [
        'Business case & ROI/TCO analysis',
        'Mutual close plan',
        'Commercial proposal & pricing review'
      ]
    }
  ];

  const MetricCard = ({ title, value, subtitle, icon, progressValue, showProgress = false }) => {
    const isMobile = useMediaQuery("(max-width:768px)");
    return (
    <Card sx={{
      backgroundColor: '#ffffff',
      borderRadius: 3,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: '1px solid #e0e0e0',
      height: '100%'
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography style={{ 
              fontSize: isMobile ? '12px' : '14px', 
              fontWeight: 600, 
              color: '#1f2937' 
            }}>
              {title}
            </Typography>
            <Typography style={{ 
              fontSize: isMobile ? '20px' : '24px', 
              fontWeight: 700, 
              color: colors.blueAccent[500], 
              mb: 1 
            }}>
              {value}
            </Typography>
            <Typography style={{ 
              fontSize: isMobile ? '11px' : '12px', 
              color: '#6b7280', 
              mb: showProgress ? 2 : 0 
            }}>
              {subtitle}
            </Typography>
            {showProgress && (
              <LinearProgress
                variant="determinate"
                value={progressValue}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#f0f0f0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: colors.blueAccent[700],
                    borderRadius: 4
                  }
                }}
              />
            )}
          </Box>
          <Box sx={{
            width: 40,
            height: 40,
            backgroundColor: colors.blueAccent[100],
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {icon}
          </Box>
        </Box>
      </CardContent>

    </Card>
    );
  };

  return (
    <Box sx={{ 
      p: 3,
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      width: '100%'
    }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography style={{
          fontSize: isMobile ? '16px' : '18px',
          fontWeight: 600,
          color: '#1f2937',
          mb: 0.5
        }}>
          Potential Revenue Leak
        </Typography>
        <Typography style={{
          fontSize: isMobile ? '12px' : '14px',
          color: '#6b7280',
          mb: 3
        }}>
          Past trend analysis and recommended actions for Relationship Managers
        </Typography>
      </Box>

      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Potential Leak"
            value="70K"
            subtitle="Across 5 business units"
            icon={<MonetizationOnIcon sx={{ color: colors.blueAccent[700] }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Leak Risk Score"
            value="58"
            subtitle="Risk assessment score"
            icon={<WarningIcon sx={{ color: colors.blueAccent[700] }} />}
            showProgress={true}
            progressValue={58}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Leaking Units"
            value="5"
            subtitle="Units with ≥5% decline"
            icon={<BusinessIcon sx={{ color: colors.blueAccent[700] }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Time Window"
            value="6 months"
            subtitle="Historical trend period"
            icon={<TimelineIcon sx={{ color: colors.blueAccent[700] }} />}
          />
        </Grid>
      </Grid>

      {/* Revenue Trends Chart */}
      <Card sx={{
        backgroundColor: '#ffffff',
        borderRadius: 3,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #e0e0e0',
        mb: 4
      }}>
        <CardContent sx={{ p: 3 }}>
          <Typography style={{
            fontSize: isMobile ? '16px' : '18px',
            fontWeight: 600,
            color: '#1f2937',
            mb: 0.5
          }}>
            Revenue Trends by Business Unit
          </Typography>
          <Typography style={{
            fontSize: isMobile ? '12px' : '14px',
            color: '#6b7280',
            mb: 3
          }}>
            Declining trajectories indicate potential leakage
          </Typography>
          <Box sx={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#666666"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#666666"
                  fontSize={12}
                  domain={[0, 180]}
                  ticks={[0, 45, 90, 135, 180]}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="payments"
                  stackId="1"
                  stroke="#2196F3"
                  fill="#2196F3"
                  fillOpacity={0.6}
                  name="Payments"
                />
                <Area
                  type="monotone"
                  dataKey="lending"
                  stackId="1"
                  stroke="#9C27B0"
                  fill="#9C27B0"
                  fillOpacity={0.6}
                  name="Lending"
                />
                <Area
                  type="monotone"
                  dataKey="wealth"
                  stackId="1"
                  stroke="#4CAF50"
                  fill="#4CAF50"
                  fillOpacity={0.6}
                  name="Wealth"
                />
                <Area
                  type="monotone"
                  dataKey="operations"
                  stackId="1"
                  stroke="#FF9800"
                  fill="#FF9800"
                  fillOpacity={0.6}
                  name="Operations"
                />
                <Area
                  type="monotone"
                  dataKey="itServices"
                  stackId="1"
                  stroke="#607D8B"
                  fill="#607D8B"
                  fillOpacity={0.6}
                  name="IT Shared Services"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

      {/* Leak Signals and Recommendations */}
      <Grid container spacing={3}>
        {/* Leak Signals */}
        <Grid item xs={12} md={6}>
          <Card sx={{
            backgroundColor: '#ffffff',
            borderRadius: 3,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #e0e0e0',
            height: '100%'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography style={{
                fontSize: isMobile ? '16px' : '18px',
                fontWeight: 600,
                color: '#1f2937',
                mb: 0.5
              }}>
                Leak Signals
              </Typography>
              <Typography style={{
                fontSize: isMobile ? '12px' : '14px',
                color: '#6b7280',
                mb: 3
              }}>
                Units sorted by estimated leakage
              </Typography>
              <List>
                {leakSignals.map((signal, index) => (
                  <React.Fragment key={signal.unit}>
                    <ListItem sx={{ px: 0, py: 2 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Box sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: colors.redAccent[100],
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <TrendingDownIcon sx={{ color: colors.redAccent[700], fontSize: 18 }} />
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                            <Typography style={{ 
                              fontSize: isMobile ? '13px' : '15px', 
                              fontWeight: 600, 
                              color: '#1f2937' 
                            }}>
                              {signal.unit}
                            </Typography>
                            <Chip
                              label="Leaking"
                              size="small"
                              sx={{
                                backgroundColor: colors.redAccent[100],
                                color: colors.redAccent[700],
                                fontSize: '11px',
                                fontWeight: 600
                              }}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography style={{ 
                              fontSize: isMobile ? '11px' : '12px', 
                              color: '#374151', 
                              mb: 0.5 
                            }}>
                              {signal.current} → {signal.previous} ({signal.decline})
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography style={{ 
                                fontSize: isMobile ? '10px' : '11px', 
                                color: '#6b7280' 
                              }}>
                                Leak estimate: {signal.leakEstimate}
                              </Typography>
                              <Typography style={{ 
                                fontSize: isMobile ? '10px' : '11px', 
                                color: '#6b7280' 
                              }}>
                                Confidence: {signal.confidence}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < leakSignals.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recommendations */}
        <Grid item xs={12} md={6}>
          <Card sx={{
            backgroundColor: '#ffffff',
            borderRadius: 3,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #e0e0e0',
            height: '100%'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography style={{
                fontSize: isMobile ? '16px' : '18px',
                fontWeight: 600,
                color: '#1f2937',
                mb: 0.5
              }}>
                Recommendations for Relationship Manager
              </Typography>
              <Typography style={{
                fontSize: isMobile ? '12px' : '14px',
                color: '#6b7280',
                mb: 3
              }}>
                Targeted actions to stop and recover leakage
              </Typography>
              <Box>
                {recommendations.map((rec, index) => (
                  <Box key={rec.unit} sx={{ mb: 3 }}>
                    <Typography style={{
                      fontSize: isMobile ? '14px' : '16px',
                      fontWeight: 600,
                      color: '#1f2937',
                      mb: 2
                    }}>
                      {rec.unit}
                    </Typography>
                    <List sx={{ py: 0 }}>
                      {rec.items.map((item, itemIndex) => (
                        <ListItem key={itemIndex} sx={{ py: 1, px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <Box sx={{
                              width: 24,
                              height: 24,
                              backgroundColor: colors.blueAccent[100],
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <AssignmentIcon sx={{ color: colors.blueAccent[700], fontSize: 14 }} />
                            </Box>
                          </ListItemIcon>
                          <ListItemText
                            primary={
                            <Typography style={{ 
                              fontSize: isMobile ? '11px' : '12px', 
                              color: '#374151',
                              lineHeight: 1.4
                            }}>
                              {item}
                            </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                    {index < recommendations.length - 1 && <Divider sx={{ mt: 2 }} />}
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RevenueLeak;
