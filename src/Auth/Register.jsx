import React, { useState } from "react";
import { Card, Form, Input, Button, Select, Typography, Row, Col } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useRegisterUserMutation } from "../Slices/Users/UserApis";
import OtpModal from "../Modal/OtpModal";
import Header from "../Global/Header";
import HomeFooter from "../Global/Footer";

const { Option } = Select;

const Register = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const roles = [
    { value: "candidate", label: "Candidate" },
    { value: "employee", label: "Employee" },
  ];

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    // Basic phone validation - adjust regex as needed for your requirements
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const validateStrongPassword = (password) => {
    // Strong password: at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const validateName = (name) => {
    // Name should contain only letters and spaces, at least 2 characters
    const nameRegex = /^[a-zA-Z\s]{1,}$/;
    return nameRegex.test(name.trim());
  };

  const onFinish = async (values) => {
    setLoading(true);

    try {
      // Comprehensive validation
      if (!values.firstName || !values.firstName.trim()) {
        enqueueSnackbar("Please enter your first name.", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 3000,
        });
        setLoading(false);
        return;
      }

      if (!validateName(values.firstName)) {
        enqueueSnackbar("First name should contain only letters.", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 3000,
        });
        setLoading(false);
        return;
      }

      if (!values.lastName || !values.lastName.trim()) {
        enqueueSnackbar("Please enter your last name.", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 3000,
        });
        setLoading(false);
        return;
      }

      if (!validateName(values.lastName)) {
        enqueueSnackbar("Last name should contain only letters.", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 3000,
        });
        setLoading(false);
        return;
      }

      if (!values.role) {
        enqueueSnackbar("Please select your role.", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 3000,
        });
        setLoading(false);
        return;
      }

      if (!values.email || !values.email.trim()) {
        enqueueSnackbar("Please enter your email address.", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 3000,
        });
        setLoading(false);
        return;
      }

      if (!validateEmail(values.email)) {
        enqueueSnackbar("Please enter a valid email address.", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 3000,
        });
        setLoading(false);
        return;
      }

      if (!values.phone || !values.phone.trim()) {
        enqueueSnackbar("Please enter your phone number.", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 3000,
        });
        setLoading(false);
        return;
      }

      if (!validatePhone(values.phone)) {
        enqueueSnackbar("Please enter a valid phone number.", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 3000,
        });
        setLoading(false);
        return;
      }

      if (!values.password) {
        enqueueSnackbar("Please enter a password.", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 3000,
        });
        setLoading(false);
        return;
      }

      if (!validateStrongPassword(values.password)) {
        enqueueSnackbar("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 4000,
        });
        setLoading(false);
        return;
      }

      if (!values.cPassword) {
        enqueueSnackbar("Please confirm your password.", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 3000,
        });
        setLoading(false);
        return;
      }

      if (values.password !== values.cPassword) {
        enqueueSnackbar("Password and confirm password do not match.", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 3000,
        });
        setLoading(false);
        return;
      }

      const fullName = `${values.firstName.trim()} ${values.lastName.trim()}`;

      const userData = {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        fullName: fullName,
        role: values.role,
        email: values.email.trim().toLowerCase(),
        phone: values.phone.trim(),
        cPassword: values.cPassword,
      };

      console.log("Registration data:", userData);

      const response = await registerUser(userData).unwrap();
      console.log("Registration successful:", response);

      setRegisteredEmail(values.email.trim().toLowerCase());
      enqueueSnackbar("Registration successful! Please verify your email.", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" },
        autoHideDuration: 3000,
      });

      setShowOtpModal(true);
    } catch (error) {
      console.error("Registration failed:", error);
      enqueueSnackbar(
        error?.data?.message || error?.message || "Registration failed. Please try again.",
        {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 3000,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);

    // Get the first error message
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

  const handleOtpVerifySuccess = (otpResponse) => {
    setShowOtpModal(false);
    setRegisteredEmail("");
    enqueueSnackbar("Email verified successfully! Please login to continue.", {
      variant: "success",
      anchorOrigin: { vertical: "top", horizontal: "right" },
      autoHideDuration: 3000,
    });
    navigate("/login");
  };

  const handleOtpModalCancel = () => {
    setShowOtpModal(false);
    setRegisteredEmail("");

    enqueueSnackbar(
      "Email verification cancelled. Please register again if needed.",
      {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
        autoHideDuration: 3000,
      }
    );
  };

  const handleGoogleSignUp = () => {
    enqueueSnackbar("Google Sign-Up functionality to be implemented", {
      variant: "info",
      anchorOrigin: { vertical: "top", horizontal: "right" },
      autoHideDuration: 3000,
    });
  };

  return (
    <>
      <Header />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f0f0f0",
          padding: "20px",
        }}
      >
        <Card
          style={{
            width: "100%",
            maxWidth: 500,
            boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
            borderRadius: "20px",
            border: "none",
            overflow: "hidden",
          }}
          bodyStyle={{ padding: "40px" }}
        >
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
                fontSize: "32px",
                color: "white",
                fontWeight: "bold",
              }}
            >
              <img
                src="/logo-2.png"
                alt="Company Logo"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "block";
                }}
              />
              <span style={{ display: "none" }}>Logo</span>
            </div>
            <p
              style={{
                margin: 0,
                color: "#7f8c8d",
                fontSize: "16px",
              }}
            >
              Sign up to get started
            </p>
          </div>

          <Form
            form={form}
            name="register"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="vertical"
            scrollToFirstError
          >
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  name="firstName"
                  label={
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#2c3e50",
                      }}
                    >
                      First Name
                    </span>
                  }
                >
                  <Input
                    prefix={<UserOutlined style={{ color: "#bdc3c7" }} />}
                    placeholder="John"
                    size="large"
                    style={{
                      borderRadius: "12px",
                      border: "1px solid #e1e5e9",
                      fontSize: "16px",
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="lastName"
                  label={
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#2c3e50",
                      }}
                    >
                      Last Name
                    </span>
                  }
                >
                  <Input
                    prefix={<UserOutlined style={{ color: "#bdc3c7" }} />}
                    placeholder="Doe"
                    size="large"
                    style={{
                      borderRadius: "12px",
                      border: "1px solid #e1e5e9",
                      fontSize: "16px",
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="role"
              label={
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#2c3e50",
                  }}
                >
                  Register As
                </span>
              }
            >
              <Select
                placeholder="Select your role"
                size="large"
                style={{
                  borderRadius: "12px",
                }}
                suffixIcon={<TeamOutlined style={{ color: "#bdc3c7" }} />}
              >
                {roles.map((role) => (
                  <Option key={role.value} value={role.value}>
                    {role.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="email"
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
            >
              <Input
                prefix={<MailOutlined style={{ color: "#bdc3c7" }} />}
                placeholder="john.doe@example.com"
                size="large"
                style={{
                  borderRadius: "12px",
                  border: "1px solid #e1e5e9",
                  fontSize: "16px",
                }}
              />
            </Form.Item>

            <Form.Item
              name="phone"
              label={
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#2c3e50",
                  }}
                >
                  Phone Number
                </span>
              }
            >
              <Input
                prefix={<PhoneOutlined style={{ color: "#bdc3c7" }} />}
                placeholder="+1 (555) 123-4567"
                size="large"
                style={{
                  borderRadius: "12px",
                  border: "1px solid #e1e5e9",
                  fontSize: "16px",
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
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
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#bdc3c7" }} />}
                placeholder="Create a strong password"
                size="large"
                style={{
                  borderRadius: "12px",
                  border: "1px solid #e1e5e9",
                  fontSize: "16px",
                }}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item
              name="cPassword"
              label={
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#2c3e50",
                  }}
                >
                  Confirm Password
                </span>
              }
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#bdc3c7" }} />}
                placeholder="Confirm your password"
                size="large"
                style={{
                  borderRadius: "12px",
                  border: "1px solid #e1e5e9",
                  fontSize: "16px",
                }}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item style={{ marginTop: "24px", marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading || isLoading}
                block
                size="large"
                style={{
                  height: "48px",
                  borderRadius: "12px",
                  background:
                    "linear-gradient(135deg,rgb(231, 82, 82) 0%,rgb(185, 48, 48) 100%)",
                  border: "none",
                  fontSize: "16px",
                  fontWeight: "600",
                  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                }}
              >
                {loading || isLoading
                  ? "Creating Account..."
                  : "Create Account"}
              </Button>
            </Form.Item>
          </Form>

          <div
            style={{
              textAlign: "center",
              marginTop: "32px",
              paddingTop: "24px",
              borderTop: "1px solid #ecf0f1",
            }}
          >
            <span style={{ color: "#7f8c8d", fontSize: "14px" }}>
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "#f5222d",
                  fontWeight: "600",
                  textDecoration: "none",
                }}
              >
                Sign in here
              </Link>
            </span>
          </div>
        </Card>
      </div>

      <OtpModal
        visible={showOtpModal}
        onCancel={handleOtpModalCancel}
        email={registeredEmail}
        onVerifySuccess={handleOtpVerifySuccess}
      />

      <HomeFooter />
    </>
  );
};

export default Register;