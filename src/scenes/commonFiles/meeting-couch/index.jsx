import React, { useState } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  LinearProgress,
  IconButton,
  Grid,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  Lightbulb as LightbulbIcon,
  People as PeopleIcon,
  Flag as TargetIcon,
  Description as DescriptionIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

const MeetingCoach = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [selectedPersona, setSelectedPersona] = useState('Economic Buyer');
  const [selectedStage, setSelectedStage] = useState('Prospect');
  const [selectedObjective, setSelectedObjective] = useState('Secure discovery across stakeholders');
  const [currentStep, setCurrentStep] = useState(0);
  // const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeRemaining, ] = useState(1800); // 30 minutes in seconds

  const personas = [
    'Economic Buyer',
    'Technical Buyer',
    'User Buyer',
    'Champion',
    'Influencer'
  ];

  const stages = [
    'Prospect',
    'Qualified',
    'Proposal',
    'Negotiation',
    'Closed Won',
    'Closed Lost'
  ];

  const objectives = [
    'Secure discovery across stakeholders',
    'Present value proposition',
    'Address technical concerns',
    'Negotiate terms and pricing',
    'Close the deal'
  ];

  const agendaSteps = [
    {
      title: 'Set context & outcomes',
      icon: <SearchIcon />,
      duration: 5,
      description: 'Establish meeting purpose and expected outcomes'
    },
    {
      title: 'Value narrative & proof',
      icon: <LightbulbIcon />,
      duration: 10,
      description: 'Present compelling value proposition with proof points'
    },
    {
      title: 'Discovery & alignment',
      icon: <PeopleIcon />,
      duration: 10,
      description: 'Understand needs, risks, and success criteria'
    },
    {
      title: 'Close & next step',
      icon: <TargetIcon />,
      duration: 5,
      description: 'Secure clear next steps with owners and dates'
    }
  ];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((currentStep + 1) / agendaSteps.length) * 100;
  };



  return (
    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: 'Poppins, sans-serif'
    }}>
      {/* Main Content */}
      <Box sx={{
        flex: 1,
        p: isMobile ? 2 : 3,
        maxWidth: '100%',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: isMobile ? 2 : 4,
          backgroundColor: 'white',
          p: isMobile ? 1.5 : 2,
          borderRadius: 2,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 2 : 0
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? 1 : 2,
            width: isMobile ? '100%' : 'auto'
          }}>
            <SearchIcon sx={{ color: '#6b7280', fontSize: isMobile ? 18 : 20 }} />
            <Typography
              style={{
                fontSize: isMobile ? '12px' : '14px',
                color: '#6b7280',
                display: isMobile ? 'none' : 'block'
              }}
            >
              Search contracts, accounts...
            </Typography>
          </Box>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? 1 : 2,
            width: isMobile ? '100%' : 'auto',
            justifyContent: isMobile ? 'flex-end' : 'flex-start'
          }}>
            <IconButton sx={{ position: 'relative' }}>
              <NotificationsIcon sx={{ fontSize: isMobile ? 18 : 20 }} />
              <Box sx={{
                position: 'absolute',
                top: 6,
                right: 6,
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '50%',
                width: isMobile ? 14 : 18,
                height: isMobile ? 14 : 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isMobile ? '8px' : '10px',
                fontWeight: 'bold'
              }}>
                3
              </Box>
            </IconButton>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{
          maxWidth: '1200px',
          mx: 'auto',
          px: isMobile ? 0 : 0
        }}>
          {/* Title Section */}
          <Box sx={{ mb: isMobile ? 2 : 4 }}>
            <Typography style={{
              fontSize: isMobile ? '16px' : '18px',
              fontWeight: 600,
              color: '#1f2937',
              marginBottom: '4px'
            }}>
              30 Minute Meeting Coach
            </Typography>
            <Typography style={{
              fontSize: isMobile ? '12px' : '14px',
              color: '#6b7280'
            }}>
              Persona and stage based topics, tips, and a crisp next step
            </Typography>
          </Box>

          {/* Setup Section */}
          <Card sx={{
            mb: isMobile ? 2 : 4,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            borderRadius: 2
          }}>
            <CardContent sx={{ p: isMobile ? 2 : 3 }}>
              <Typography style={{
                fontSize: isMobile ? '16px' : '18px',
                fontWeight: 600,
                color: '#1f2937',
                marginBottom: '4px'
              }}>
                Setup
              </Typography>
              <Typography style={{
                fontSize: isMobile ? '12px' : '14px',
                color: '#6b7280',
                marginBottom: isMobile ? '16px' : '24px'
              }}>
                Select persona, stage, and objective
              </Typography>

              <Grid container spacing={isMobile ? 2 : 3}>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography style={{
                    fontSize: isMobile ? '12px' : '14px',
                    fontWeight: 600,
                    color: '#1f2937',
                    marginBottom: '8px'
                  }}>
                    Persona
                  </Typography>
                  <Select
                    value={selectedPersona}
                    onChange={(e) => setSelectedPersona(e.target.value)}
                    fullWidth
                    size={isMobile ? 'small' : 'small'}
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#d1d5db'
                      },
                      fontSize: isMobile ? '12px' : '14px'
                    }}
                  >
                    {personas.map((persona) => (
                      <MenuItem key={persona} value={persona} sx={{ fontSize: isMobile ? '12px' : '14px' }}>
                        {persona}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography style={{
                    fontSize: isMobile ? '12px' : '14px',
                    fontWeight: 600,
                    color: '#1f2937',
                    marginBottom: '8px'
                  }}>
                    Stage
                  </Typography>
                  <Select
                    value={selectedStage}
                    onChange={(e) => setSelectedStage(e.target.value)}
                    fullWidth
                    size={isMobile ? 'small' : 'small'}
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#d1d5db'
                      },
                      fontSize: isMobile ? '12px' : '14px'
                    }}
                  >
                    {stages.map((stage) => (
                      <MenuItem key={stage} value={stage} sx={{ fontSize: isMobile ? '12px' : '14px' }}>
                        {stage}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                  <Typography style={{
                    fontSize: isMobile ? '12px' : '14px',
                    fontWeight: 600,
                    color: '#1f2937',
                    marginBottom: '8px'
                  }}>
                    Objective
                  </Typography>
                  <Select
                    value={selectedObjective}
                    onChange={(e) => setSelectedObjective(e.target.value)}
                    fullWidth
                    size={isMobile ? 'small' : 'small'}
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#d1d5db'
                      },
                      fontSize: isMobile ? '12px' : '14px'
                    }}
                  >
                    {objectives.map((objective) => (
                      <MenuItem key={objective} value={objective} sx={{ fontSize: isMobile ? '12px' : '14px' }}>
                        {objective}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Timeboxed Agenda Section */}
          <Card sx={{
            mb: isMobile ? 2 : 4,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            borderRadius: 2
          }}>
            <CardContent sx={{ p: isMobile ? 2 : 3 }}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'flex-start' : 'center',
                mb: isMobile ? 2 : 3,
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? 2 : 0
              }}>
                <Box>
                  <Typography style={{
                    fontSize: isMobile ? '16px' : '18px',
                    fontWeight: 600,
                    color: '#1f2937',
                    marginBottom: '4px'
                  }}>
                    Timeboxed Agenda
                  </Typography>
                  <Typography style={{
                    fontSize: isMobile ? '12px' : '14px',
                    color: '#6b7280'
                  }}>
                    30 minutes total - tailored by persona and stage
                  </Typography>
                </Box>
                <Box sx={{
                  backgroundColor: '#f3f4f6',
                  px: isMobile ? 1.5 : 2,
                  py: isMobile ? 0.5 : 1,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  alignSelf: isMobile ? 'flex-start' : 'auto'
                }}>
                  <ScheduleIcon sx={{
                    color: '#6b7280',
                    fontSize: isMobile ? 16 : 20
                  }} />
                  <Typography style={{
                    fontSize: isMobile ? '14px' : '16px',
                    fontWeight: 600,
                    color: '#1f2937'
                  }}>
                    {formatTime(timeRemaining)}
                  </Typography>
                </Box>
              </Box>

              {/* Progress Bar */}
              <Box sx={{ mb: isMobile ? 2 : 3 }}>
                <LinearProgress
                  variant="determinate"
                  value={getProgressPercentage()}
                  sx={{
                    height: isMobile ? 6 : 8,
                    borderRadius: 4,
                    backgroundColor: '#e5e7eb',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#3b82f6',
                      borderRadius: 4
                    }
                  }}
                />
              </Box>

              {/* Agenda Steps */}
              <Grid container spacing={isMobile ? 1.5 : 2}>
                {agendaSteps.map((step, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Paper sx={{
                      p: isMobile ? 1.5 : 2,
                      border: currentStep === index ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                      borderRadius: 2,
                      backgroundColor: currentStep === index ? '#eff6ff' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      minHeight: 'auto'
                    }}
                      onClick={() => setCurrentStep(index)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between", mb: 1 }}>
                        <Typography style={{
                          fontSize: isMobile ? '12px' : '14px',
                          fontWeight: 600,
                          color: currentStep === index ? '#3b82f6' : '#1f2937'
                        }}>
                          {step.title}
                        </Typography>
                        <Box sx={{ border: '1px solid #e6e8ec', borderRadius: "10px", padding: "3px" }}>
                          <Typography style={{
                            fontSize: '10px',
                            fontWeight: 600,
                            color: currentStep === index ? '#3b82f6' : '#1f2937'
                          }}>
                            10m
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{
                        color: currentStep === index ? '#3b82f6' : '#6b7280',
                        mr: 1,
                        fontSize: isMobile ? 16 : 20
                      }}>
                        {step.icon}
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              {/* Timer Controls */}
              {/* <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: isMobile ? 1 : 2, 
                mt: isMobile ? 2 : 3,
                pt: isMobile ? 2 : 3,
                borderTop: '1px solid #e5e7eb',
                flexWrap: isMobile ? 'wrap' : 'nowrap'
              }}>
                <Button
                  variant="outlined"
                  onClick={handlePrevStep}
                  disabled={currentStep === 0}
                  size={isMobile ? 'small' : 'medium'}
                  sx={{ 
                    minWidth: isMobile ? 80 : 100,
                    fontSize: isMobile ? '11px' : '14px'
                  }}
                >
                  Previous
                </Button>
                <IconButton
                  onClick={handleTimerToggle}
                  size={isMobile ? 'small' : 'medium'}
                  sx={{ 
                    backgroundColor: isTimerRunning ? '#ef4444' : '#10b981',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: isTimerRunning ? '#dc2626' : '#059669'
                    }
                  }}
                >
                  {isTimerRunning ? <PauseIcon sx={{ fontSize: isMobile ? 16 : 20 }} /> : <PlayArrowIcon sx={{ fontSize: isMobile ? 16 : 20 }} />}
                </IconButton>
                <Button
                  variant="outlined"
                  onClick={handleResetTimer}
                  size={isMobile ? 'small' : 'medium'}
                  sx={{ 
                    minWidth: isMobile ? 80 : 100,
                    fontSize: isMobile ? '11px' : '14px'
                  }}
                >
                  Reset
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleNextStep}
                  disabled={currentStep === agendaSteps.length - 1}
                  size={isMobile ? 'small' : 'medium'}
                  sx={{ 
                    minWidth: isMobile ? 80 : 100,
                    fontSize: isMobile ? '11px' : '14px'
                  }}
                >
                  Next
                </Button>
              </Box> */}
            </CardContent>
          </Card>

          {/* Content Cards */}
          <Grid container spacing={isMobile ? 2 : 3}>
            {/* Open Strong */}
            <Grid item xs={12} md={6}>
              <Card sx={{
                height: '100%',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                borderRadius: 2
              }}>
                <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                  <Typography style={{
                    fontSize: isMobile ? '16px' : '18px',
                    fontWeight: 600,
                    color: '#1f2937',
                    marginBottom: '4px'
                  }}>
                    Open Strong
                  </Typography>
                  <Typography style={{
                    fontSize: isMobile ? '12px' : '14px',
                    color: '#6b7280',
                    marginBottom: isMobile ? '12px' : '16px'
                  }}>
                    Set context and outcomes
                  </Typography>
                  <Box sx={{
                    backgroundColor: '#f9fafb',
                    p: isMobile ? 1.5 : 2,
                    borderRadius: 2,
                    border: '1px solid #e5e7eb'
                  }}>
                    <FormControlLabel
                      control={<Checkbox checked={true} size={isMobile ? 'small' : 'medium'} />}
                      label="Thank you for the time—my aim in 30 minutes is to confirm the outcomes that matter and agree a crisp next step with clear owners and dates."
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontSize: isMobile ? '11px' : '12px',
                          color: '#374151',
                          lineHeight: 1.4
                        }
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Value Narrative */}
            <Grid item xs={12} md={6}>
              <Card sx={{
                height: '100%',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                borderRadius: 2
              }}>
                <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                  <Typography style={{
                    fontSize: isMobile ? '16px' : '18px',
                    fontWeight: 600,
                    color: '#1f2937',
                    marginBottom: '4px'
                  }}>
                    Value Narrative
                  </Typography>
                  <Typography style={{
                    fontSize: isMobile ? '12px' : '14px',
                    color: '#6b7280',
                    marginBottom: isMobile ? '12px' : '16px'
                  }}>
                    Proof that resonates with this persona
                  </Typography>
                  <Typography style={{
                    fontSize: isMobile ? '11px' : '12px',
                    color: '#374151',
                    marginBottom: isMobile ? '16px' : '24px',
                    lineHeight: 1.4
                  }}>
                    Peer outcomes in your industry show reduced time to value and measurable risk reduction within the first quarter.
                  </Typography>
                  <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: isMobile ? 0.5 : 1,
                    flexDirection: isMobile ? 'column' : 'row'
                  }}>
                    <Button
                      variant="outlined"
                      startIcon={<DescriptionIcon sx={{ fontSize: isMobile ? 11 : 13 }} />}
                      size={isMobile ? 'small' : 'small'}
                      sx={{
                        borderColor: '#d1d5db',

                        color: '#374151',
                        textTransform: 'none',
                        fontSize: isMobile ? '10px' : '11px',
                        minWidth: isMobile ? 'auto' : 'auto',
                        width: isMobile ? '100%' : 'auto',
                        marginBottom: isMobile ? '4px' : '0px',
                        border: '1px solid #e6e8ec',
                        borderRadius: "15px",
                        padding: "3px",
                        paddingX: "10px"
                      }}
                    >
                      Executive case study
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<DescriptionIcon sx={{ fontSize: isMobile ? 11 : 13 }} />}
                      size={isMobile ? 'small' : 'small'}
                      sx={{
                        borderColor: '#d1d5db',
                        color: '#374151',
                        textTransform: 'none',
                        fontSize: isMobile ? '10px' : '11px',
                        minWidth: isMobile ? 'auto' : 'auto',
                        width: isMobile ? '100%' : 'auto',
                        marginBottom: isMobile ? '4px' : '0px',
                        border: '1px solid #e6e8ec',
                        borderRadius: "15px",
                        padding: "3px",
                        paddingX: "10px"
                      }}
                    >
                      1 page value hypothesis
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<DescriptionIcon sx={{ fontSize: isMobile ? 11 : 13 }} />}
                      size={isMobile ? 'small' : 'small'}
                      sx={{
                        borderColor: '#d1d5db',
                        color: '#374151',
                        textTransform: 'none',
                        fontSize: isMobile ? '10px' : '11px',
                        minWidth: isMobile ? 'auto' : 'auto',
                        width: isMobile ? '100%' : 'auto',
                        border: '1px solid #e6e8ec',
                        borderRadius: "15px",
                        padding: "3px",
                        paddingX: "10px"

                      }}
                    >
                      ROI calculator
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Discovery Questions */}
            <Grid item xs={12} md={6}>
              <Card sx={{
                height: '100%',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                borderRadius: 2
              }}>
                <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                  <Typography style={{
                    fontSize: isMobile ? '16px' : '18px',
                    fontWeight: 600,
                    color: '#1f2937',
                    marginBottom: '4px'
                  }}>
                    Discovery Questions
                  </Typography>
                  <Typography style={{
                    fontSize: isMobile ? '12px' : '14px',
                    color: '#6b7280',
                    marginBottom: isMobile ? '12px' : '16px'
                  }}>
                    Align on needs, risks, and success
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 1 : 1.5 }}>
                    {[
                      "Which 2 or 3 metrics will this most influence for you?",
                      "What risks would block sponsorship?",
                      "What must be true by the next quarter for this to be considered successful?",
                      "Who else is essential to weigh in before moving forward?"
                    ].map((question, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <CheckCircleIcon sx={{
                          color: '#10b981',
                          fontSize: isMobile ? 16 : 20,
                          mt: 0.5
                        }} />
                        <Typography style={{
                          fontSize: isMobile ? '11px' : '12px',
                          color: '#374151',
                          lineHeight: 1.4
                        }}>
                          {question}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Close for Next Conversation */}
            <Grid item xs={12} md={6}>
              <Card sx={{
                height: '100%',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                borderRadius: 2
              }}>
                <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                  <Typography style={{
                    fontSize: isMobile ? '16px' : '18px',
                    fontWeight: 600,
                    color: '#1f2937',
                    marginBottom: '4px'
                  }}>
                    Close for Next Conversation
                  </Typography>
                  <Typography style={{
                    fontSize: isMobile ? '12px' : '14px',
                    color: '#6b7280',
                    marginBottom: isMobile ? '12px' : '16px'
                  }}>
                    Clear asks tied to stage and goal
                  </Typography>

                  <Box sx={{ mb: isMobile ? 2 : 3 }}>
                    <Typography style={{
                      fontSize: isMobile ? '12px' : '14px',
                      fontWeight: 600,
                      color: '#1f2937',
                      marginBottom: '8px'
                    }}>
                      Action Items:
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 0.5 : 1 }}>
                      {[
                        "Schedule technical deep dive",
                        "Confirm discovery recap and next step owners"
                      ].map((item, index) => (
                        <Box key={index} sx={{
                          display: 'flex', alignItems: 'center', gap: 1, border: '1px solid #e6e8ec',
                          // borderRadius:"15px", 
                          padding: "3px",
                          paddingX: "10px"
                        }}>
                          <CheckCircleIcon sx={{
                            color: '#10b981',
                            fontSize: isMobile ? 14 : 16
                          }} />
                          <Typography style={{
                            fontSize: isMobile ? '11px' : '12px',
                            color: '#374151',
                            lineHeight: 1.4
                          }}>
                            {item}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  <Box>
                    <Typography style={{
                      fontSize: isMobile ? '12px' : '14px',
                      fontWeight: 600,
                      color: '#1f2937',
                      marginBottom: '8px'
                    }}>
                      Recommended Follow Ups:
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 0.5 : 1 }}>
                      {[
                        { title: "Persona-targeted multi-threaded outreach", desc: "Engage multiple stakeholders" },
                        { title: "Discovery call (business + technical)", desc: "Deep dive into requirements" },
                        { title: "Value hypothesis recap", desc: "Summarize key value propositions" }
                      ].map((item, index) => (
                        <Box key={index} sx={{
                          p: isMobile ? 1 : 1.5,
                          backgroundColor: '#f9fafb',
                          borderRadius: 1,
                          border: '1px solid #e5e7eb'
                        }}>
                          <Typography style={{
                            fontSize: isMobile ? '11px' : '12px',
                            fontWeight: 600,
                            color: '#1f2937',
                            lineHeight: 1.3
                          }}>
                            {item.title}
                          </Typography>
                          <Typography style={{
                            fontSize: isMobile ? '9px' : '11px',
                            color: '#6b7280',
                            lineHeight: 1.3
                          }}>
                            {item.desc}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default MeetingCoach;
