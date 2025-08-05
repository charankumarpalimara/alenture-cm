import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Form, Input, message } from "antd";
import Logo from "./alentur-logo.avif";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { tokens } from "../../../theme";

const PasswordReset = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { email: emailParam } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(false);
  
  // Try to get email from different sources
  const emailFromQuery = searchParams.get('email');
  const email = emailParam || emailFromQuery;
  
  const [emailInput, setEmailInput] = useState(email || '');
  
  console.log("Current URL:", window.location.href);
  console.log("Email from URL params:", emailParam);
  console.log("Email from query params:", emailFromQuery);
  console.log("Final email:", email);

  // Extract token from query params (e.g., /reset-password?token=abc)
  // const params = new URLSearchParams(location.search);
  // const token = params.get("token");

  const handleSubmit = async (values) => {
    if (values.password !== values.confirmPassword) {
      message.error("Passwords do not match");
      return;
    }
    
      const emailToUse = email || emailInput;
  console.log("Email from URL:", email);
  console.log("Email from input:", emailInput);
  console.log("Email to use:", emailToUse);
  console.log("Current URL:", window.location.href);
    
    if (!emailToUse) {
      message.error("Email is required");
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8080/v1/resetPassword`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: emailToUse,
            password: values.password,
          }),
        }
      );
      
      console.log("Sending request with:", {
        email: emailToUse,
        password: values.password,
      });
      
      const data = await response.json();
      if (response.ok) {
        message.success("Password reset successful! Please log in.");
        navigate("/login"); // Redirect to login
      } else {
        message.error(data.error || "Failed to reset password.");
      }
    } catch (error) {
      message.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        height: "76vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
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
          <Box sx={{ maxWidth: 400, mx: "auto", width: "100%" }}>
            <Box textAlign="center" mb={5}>
              <img
                src={Logo}
                alt="logo"
                style={{ minWidth: 100, width: "80%" }}
              />
            </Box>
            <Typography variant="h6" mb={2} textAlign="center">
              Reset Your Password
            </Typography>
            {!email && (
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Enter your email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  style={{
                    borderRadius: 8,
                    fontSize: 16,
                    padding: "10px 14px",
                  }}
                />
              </Form.Item>
            )}
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              autoComplete="off"
            >
              <Form.Item
                label="New Password"
                name="password"
                rules={[
                  { required: true, message: "Please enter your new password" },
                  { min: 6, message: "Password must be at least 6 characters" },
                ]}
                hasFeedback
              >
                <Input.Password
                  size="large"
                  placeholder="Enter new password"
                  style={{
                    borderRadius: 8,
                    fontSize: 16,
                    padding: "10px 14px",
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  { required: true, message: "Please confirm your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="Confirm new password"
                  style={{
                    borderRadius: 8,
                    fontSize: 16,
                    padding: "10px 14px",
                  }}
                />
              </Form.Item>
              <Box textAlign="center" pt={1} mb={2} pb={1}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  className="form-button"
                  disabled={loading}
                  sx={{
                    mt: 3,
                    mb: 2,
                    background: colors.blueAccent[1000],
                    color: "#fff",
                    "&:hover": { backgroundColor: colors.blueAccent[600] },
                    textTransform: "none",
                  }}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>
              </Box>
            </Form>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PasswordReset;