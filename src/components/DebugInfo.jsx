import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

const DebugInfo = () => {
  const [debugInfo, setDebugInfo] = useState({});
  const [apiTest, setApiTest] = useState(null);

  useEffect(() => {
    // Gather debug information
    const info = {
      userAgent: navigator.userAgent,
      currentUrl: window.location.href,
      apiUrl: process.env.REACT_APP_API_URL,
      wsUrl: process.env.REACT_APP_WS_URL,
      hasCmToken: !!sessionStorage.getItem('cmtoken'),
      hasCrmToken: !!sessionStorage.getItem('crmtoken'),
      hasHobToken: !!sessionStorage.getItem('hobtoken'),
      hasToken: !!sessionStorage.getItem('token'),
      timestamp: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
    setDebugInfo(info);
  }, []);

  const testApi = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://alantur-api.softplix.com';
      const testUrl = `${apiUrl}/v1/getAllExperiences`;
      
      console.log('Testing API URL:', testUrl);
      
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = {
        url: testUrl,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      };
      
      if (response.ok) {
        const data = await response.json();
        result.dataType = typeof data;
        result.hasData = !!data.data;
        result.dataLength = Array.isArray(data.data) ? data.data.length : 'N/A';
        result.sampleData = Array.isArray(data.data) && data.data.length > 0 ? data.data[0] : null;
      } else {
        result.error = await response.text();
      }
      
      setApiTest(result);
    } catch (error) {
      setApiTest({
        error: error.message,
        type: error.name
      });
    }
  };

  return (
    <Box sx={{ p: 2, maxWidth: 800 }}>
      <Typography variant="h5" gutterBottom>
        Debug Information
      </Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>Environment Info</Typography>
        <pre style={{ fontSize: '12px', overflow: 'auto' }}>
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </Paper>

      <Button 
        variant="contained" 
        onClick={testApi}
        sx={{ mb: 2 }}
      >
        Test API Connection
      </Button>

      {apiTest && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>API Test Result</Typography>
          <pre style={{ fontSize: '12px', overflow: 'auto' }}>
            {JSON.stringify(apiTest, null, 2)}
          </pre>
        </Paper>
      )}
    </Box>
  );
};

export default DebugInfo;