import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Form, Input, message } from "antd";
import logoLight from "./alentur-logo.avif";
const Login = ({ onLogin }) => {
  const [form] = Form.useForm();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

const handleSubmit = async (values) => {
  setLoading(true);
  // let success = false;

  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/v1/adminLogin`,
      // `http://127.0.0.1:8080/v1/adminLogin`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }
    );
    const data = await response.json();

    if (response.ok) {
      const role = data.extraind10.table;
      message.success("Login successful!");

      // Save session storage and redirect based on role
      if (role === "listofhob") {
        sessionStorage.setItem("hobtoken", data.token);
        sessionStorage.setItem("hobDetails", JSON.stringify(data.data));
        navigate("/");
      } else if (role === "listofcrm") {
        sessionStorage.setItem("crmtoken", data.token);
        sessionStorage.setItem("CrmDetails", JSON.stringify(data.data));
            navigate("/");
      } else if (role === "admin") {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("userDetails", JSON.stringify(data.data));
            navigate("/");
      } else if (role === "listofcm") {
        sessionStorage.setItem("cmtoken", data.token);
        sessionStorage.setItem("CmDetails", JSON.stringify(data.data));
            navigate("/");
      }

      console.log("API response:", data);
      console.log("Saving token:", data.token);
      console.log("Saving data:", data.data);
      // success = true;
      if (onLogin) onLogin(); // Call parent login handler if provided
    } else {
      message.error("Invalid credentials.");
    }
  } catch (error) {
    message.error("Login failed. Please try again.");
    console.error(error);
  }

  setLoading(false);

  // if (!success) {
  //   message.error("User Not Found.");
  // }
};

  return (
    <Container
      maxWidth="lg"
      sx={{
        height: "76vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.3)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={60} />
        </Box>
      )}
      <Grid
        container
        sx={{
          height: isMobile ? "auto" : "80vh",
          borderRadius: 2,
          overflow: "hidden",
          marginTop: isMobile ? "30px" : 0,
          justifyContent: "center",
        }}
      >
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            p: isMobile ? 3 : 6,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: "background.paper",
            boxShadow: 3,
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              maxWidth: 400,
              mx: "auto",
              width: "100%",
            }}
          >
            <Box textAlign="center" mb={5}>
              <img
                src={logoLight}
                alt="logo"
                style={{ minWidth: 100, width: "80%" }}
              />
            </Box>

            <Typography variant="body1" mb={1} style={{ textAlign: "center", marginBottom: "20px", fontSize: "17px" }}>
              login to your account
            </Typography>

            {error && (
              <Typography color="error" mb={2}>
                {error}
              </Typography>
            )}

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              autoComplete="off"
            >
              <Form.Item
                label="Email address"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Enter a valid email address" },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Enter your email"
                  style={{
                    borderRadius: 8,
                    fontSize: 16,
                    padding: "10px 14px",
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please enter your password" }]}
              >
                <Input.Password
                  size="large"
                  placeholder="Enter your password"
                  style={{
                    borderRadius: 8,
                    fontSize: 16,
                    padding: "10px 14px",
                  }}
                />
              </Form.Item>
              <Box textAlign="right" mb={2}>
                <Button
                  variant="text"
                  size="small"
                  sx={{ textTransform: "none", color: "#3e4396", fontWeight: "bold" }}
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot Password?
                </Button>
              </Box>

              <Box textAlign="center" pt={1} mb={2} pb={1}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  type="submit"
                  sx={{
                    mb: 3,
                    fontWeight: "bold",
                    background:
                      "linear-gradient(to right, #0A0A3D, #1C1C6B, #2E2E9F, #5050D4, #5050D4)",
                    color: "white",
                    "&:hover": {
                      background:
                        "linear-gradient(to right, #0A0A3D, #1C1C6B, #2E2E9F, #5050D4, #5050D4)",
                    },
                  }}
                  disabled={loading}
                >
                  Sign in
                </Button>
              </Box>
            </Form>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;