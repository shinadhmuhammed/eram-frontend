import React, { useState } from "react";
import { Form, Input, Button, Card, message, Divider, Space } from "antd";
import {
  UserOutlined,
  LockOutlined,
  GoogleOutlined,
  SafetyCertificateOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack"; 
import { useLoginSuperAdminMutation } from "../../Slices/SuperAdmin/SuperAdminApis.js";
import { setSuperAdminCredentials } from "../../Slices/SuperAdmin/SuperAdminSlice";
import SuperAdminOtpModal from "../Modal/SuperAdminOtpModal";

const SuperAdminLogin = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [loginSuperAdmin, { isLoading }] = useLoginSuperAdminMutation();

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const onFinish = async (values) => {
    try {
      if (!values.email || !values.password) {
        enqueueSnackbar("Please enter all required fields.", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 3000,
        });
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(values.email)) {
        enqueueSnackbar("Please enter a valid email address.", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 3000,
        });
        return;
      }

      // Validate password length
      if (values.password.length < 6) {
        enqueueSnackbar("Password must be at least 6 characters long.", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 3000,
        });
        return;
      }

      const response = await loginSuperAdmin({
        email: values.email,
        password: values.password,
      }).unwrap();

      if (response.requireOtp) {
        enqueueSnackbar("OTP sent to superadmin. Please verify OTP to complete login.", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 3000,
        });
        setUserEmail(response.email);
        setShowOtpModal(true);
      } else {
        enqueueSnackbar("Admin OTP verification successful!, Login successful!", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 3000,
        });

        const superAdminInfo = {
          email: response.user.email,
          name: response.user.name,
          roles: response.user.roles,
        };

        dispatch(setSuperAdminCredentials(superAdminInfo));
        navigate("/superadmin");
      }
    } catch (error) {
      console.error("Login error:", error);
      enqueueSnackbar(error?.data?.message || error?.message || "Login failed. Please try again.", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
        autoHideDuration: 3000,
      });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);

    const firstError = errorInfo.errorFields[0];
    if (firstError && firstError.errors.length > 0) {
      enqueueSnackbar(firstError.errors[0], {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
        autoHideDuration: 3000,
      });
    } else {
      enqueueSnackbar("Please check your input fields.", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
        autoHideDuration: 3000,
      });
    }
  };

  const handleGoogleSignIn = () => {
    enqueueSnackbar("Google Sign-In functionality to be implemented.", {
      variant: "info",
      anchorOrigin: { vertical: "top", horizontal: "right" },
      autoHideDuration: 3000,
    });
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleOtpVerificationSuccess = (response) => {
    enqueueSnackbar("OTP verified successfully! Super Admin login successful!", {
      variant: "success",
      anchorOrigin: { vertical: "top", horizontal: "right" },
      autoHideDuration: 3000,
    });

    const superAdminInfo = {
      email: response.user.email,
      name: response.user.name,
      roles: response.user.roles,
    };

    dispatch(setSuperAdminCredentials(superAdminInfo));

    setShowOtpModal(false);
    navigate("/superadmin");
  };

  const handleOtpVerificationError = (error) => {
    console.log(error, "error otp")
    enqueueSnackbar(error?.data?.message || error?.message || "Invalid OTP. Please try again.", {
      variant: "danger",
      anchorOrigin: { vertical: "top", horizontal: "right" },
      autoHideDuration: 3000,
    });
  };

  const handleOtpModalCancel = () => {
    setShowOtpModal(false);
    setUserEmail("");
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f0f0f0",
          minHeight: "100vh",
          padding: "20px",
        }}
      >
        <Card
          style={{
            width: "100%",
            maxWidth: 450,
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            borderRadius: "20px",
            border: "none",
            overflow: "hidden",
          }}
          bodyStyle={{ padding: "40px" }}
        >
          {/* Super Admin Logo Section */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "40px",
            }}
          >
            <div
              style={{
                margin: "0 auto 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "48px",
                color: "#da2c46",
                fontWeight: "bold",
              }}
            >
              <SafetyCertificateOutlined />
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: "28px",
                fontWeight: "700",
                color: "#2c3e50",
                marginBottom: "8px",
              }}
            >
              Super Admin Portal
            </h1>
            <p
              style={{
                margin: 0,
                color: "#7f8c8d",
                fontSize: "16px",
              }}
            >
              Secure administrative access
            </p>
          </div>

          {/* Login Form */}
          <Form
            form={form}
            name="superAdminLogin"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              label={
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#2c3e50",
                  }}
                >
                  Email Address
                </span>
              }
              name="email"
            >
              <Input
                prefix={<UserOutlined style={{ color: "#bdc3c7" }} />}
                placeholder="Enter your admin email address"
                size="large"
                style={{
                  borderRadius: "12px",
                  border: "1px solid #e1e5e9",
                  height: "48px",
                  fontSize: "16px",
                }}
              />
            </Form.Item>

            <Form.Item
              label={
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#2c3e50",
                  }}
                >
                  Password
                </span>
              }
              name="password"
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#bdc3c7" }} />}
                placeholder="Enter your admin password"
                size="large"
                style={{
                  borderRadius: "12px",
                  border: "1px solid #e1e5e9",
                  height: "48px",
                  fontSize: "16px",
                }}
              />
            </Form.Item>

            {/* Forgot Password Link */}
            <div
              style={{
                textAlign: "right",
                marginBottom: "24px",
              }}
            >
              {/* <Button
                type="link"
                onClick={handleForgotPassword}
                style={{
                  padding: 0,
                  fontSize: "14px",
                  color: "#667eea",
                  fontWeight: "500",
                }}
              >
                Forgot password?
              </Button> */}
            </div>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
                size="large"
                style={{
                  height: "48px",
                  borderRadius: "12px",
                  background:
                    "linear-gradient(135deg,  #da2c46 70%, #a51632 100%)",

                  border: "none",
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                {isLoading ? "Signing in..." : "Sign In as Super Admin"}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>

      {/* Super Admin OTP Modal */}
      <SuperAdminOtpModal
        visible={showOtpModal}
        onCancel={handleOtpModalCancel}
        email={userEmail}
        onVerifySuccess={handleOtpVerificationSuccess}
        onVerifyError={handleOtpVerificationError}
        mode="login"
      />
    </>
  );
};

export default SuperAdminLogin;
