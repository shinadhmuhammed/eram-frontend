import React from "react";
import { Form, Input, Button, Card, Divider } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { useLoginUserMutation } from "../Slices/Users/UserApis";
import { setUserCredentials } from "../Slices/Users/UserSlice";
import Header from "../Global/Header";
import HomeFooter from "../Global/Footer";
import { useSearchParams } from "react-router-dom";

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [loginUser, { isLoading }] = useLoginUserMutation();
   const [searchParams] = useSearchParams();
  const branchId = searchParams.get("branchId");
  console.log(branchId,'id-branch')

  const onFinish = async (values) => {
    try {
      // Validate required fields
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

      const response = await loginUser({
        email: values.email,
        password: values.password,
        branchId
      }).unwrap();

      if (response.requireOtp) {
        enqueueSnackbar("OTP sent to your email. Please verify to complete login.", {
          variant: "info",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 3000,
        });
        navigate("/verify-otp", { 
          state: { 
            email: response.email,
            message: response.message 
          } 
        });
        return;
      }

      enqueueSnackbar("Login successful!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" },
        autoHideDuration: 3000,
      });

      const userRole = response.user.roles;

      const userInfo = {
        email: response.user.email,
        name: response.user.name,
        roles: response.user.roles,
      };

      dispatch(setUserCredentials({
        userInfo: userInfo,
        role: userRole
      }));

      // Navigate based on user role
      switch (userRole) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "candidate":
          navigate("/candidate-jobs");
          break;
        case "employee":
          navigate("/employee/dashboard");
          break;
        case "recruiter":
          navigate("/recruiter/dashboard");
          break;
        case "super_admin":
          navigate("/super-admin/dashboard");
          break;
        default:
          enqueueSnackbar("No dashboard defined for your role.", {
            variant: "warning",
            anchorOrigin: { vertical: "top", horizontal: "right" },
            autoHideDuration: 3000,
          });
          navigate("/"); 
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

  const handleGoogleSignIn = () => {
    enqueueSnackbar("Google Sign-In functionality to be implemented", {
      variant: "info",
      anchorOrigin: { vertical: "top", horizontal: "right" },
      autoHideDuration: 3000,
    });
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
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
            maxWidth: 450,
            boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
            borderRadius: "20px",
            border: "none",
            overflow: "hidden",
            padding: "40px"
          }}
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
            <h1
              style={{
                margin: 0,
                fontSize: "28px",
                fontWeight: "700",
                color: "#2c3e50",
                marginBottom: "8px",
              }}
            >
              Welcome Back
            </h1>
            <p
              style={{
                margin: 0,
                color: "#7f8c8d",
                fontSize: "16px",
              }}
            >
              Sign in to your account
            </p>
          </div>

          <Form
            form={form}
            name="login"
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
                placeholder="Enter your email address"
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
                placeholder="Enter your password"
                size="large"
                style={{
                  borderRadius: "12px",
                  border: "1px solid #e1e5e9",
                  height: "48px",
                  fontSize: "16px",
                }}
              />
            </Form.Item>

            <div
              style={{
                textAlign: "right",
                marginBottom: "24px",
              }}
            >
              <Button
                type="link"
                onClick={handleForgotPassword}
                style={{
                  padding: 0,
                  fontSize: "14px",
                  color: "#f5222d",
                  fontWeight: "500",
                }}
              >
                Forgot password?
              </Button>
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
                    "linear-gradient(135deg,rgb(231, 82, 82) 0%,rgb(185, 48, 48) 100%)",
                  border: "none",
                  fontSize: "16px",
                  fontWeight: "600",
                  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                }}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </Form.Item>
          </Form>

          <Divider
            style={{
              margin: "24px 0",
              color: "#bdc3c7",
              fontSize: "14px",
            }}
          >
            or sign in with email
          </Divider>

          <Button
            onClick={handleGoogleSignIn}
            size="large"
            block
            style={{
              marginBottom: "20px",
              height: "48px",
              borderRadius: "12px",
              border: "1px solid #e1e5e9",
              backgroundColor: "#fff",
              color: "#5f6368",
              fontSize: "16px",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
            }}
          >
            <img src="/google-logo.svg" />
            Continue with Google
          </Button>

          <div
            style={{
              textAlign: "center",
              marginTop: "32px",
              paddingTop: "24px",
              borderTop: "1px solid #ecf0f1",
            }}
          >
            <span style={{ color: "#7f8c8d", fontSize: "14px" }}>
              Don't have an account?{" "}
              <Button
                type="link"
                onClick={() => navigate("/register")}
                style={{
                  padding: 0,
                  fontSize: "14px",
                  color: "#f5222d",
                  fontWeight: "600",
                }}
              >
                Sign up here
              </Button>
            </span>
          </div>
        </Card>
      </div>
      <HomeFooter />
    </>
  );
};

export default Login;