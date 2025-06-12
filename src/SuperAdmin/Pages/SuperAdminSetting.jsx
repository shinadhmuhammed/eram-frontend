import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Space,
  message,
  Row,
  Col,
  Divider,
  Avatar,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  MailOutlined,
  LockOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  useRequestUpdateProfileMutation,
  useVerifyUpdateProfileMutation,
} from "../../Slices/SuperAdmin/SuperAdminApis.js"; // Adjust import path
import SuperAdminOtpModal from "../Modal/SuperAdminOtpModal";

const { Title, Text } = Typography;

const SuperAdminSettings = () => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");
  const [profileData, setProfileData] = useState(null);

  const [requestUpdateProfile, { isLoading: isUpdating }] =
    useRequestUpdateProfileMutation();

  const [verifyUpdateProfile, { isLoading: isVerifying }] =
    useVerifyUpdateProfileMutation();

  useEffect(() => {
    const getProfileFromStorage = () => {
      try {
        const storedData = localStorage.getItem("superAdminInfo");
        if (storedData) {
          const parsed = JSON.parse(storedData);
          const { email, name, role, token } = parsed;

          setProfileData({ email, name, role, token });
        }
      } catch (error) {
        console.error("Error reading from localStorage:", error);
        message.error("Failed to load profile data");
      }
    };

    getProfileFromStorage();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    form.setFieldsValue({
      newEmail: profileData?.email || "",
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    form.resetFields();
  };

  const handleSubmitProfileUpdate = async (values) => {
    try {
      const { newEmail, password } = values;

      const response = await requestUpdateProfile({
        newEmail,
        password,
      }).unwrap();

      message.success(response.message || "OTP sent successfully!");
      setCurrentEmail(newEmail);
      setShowOtpModal(true);
    } catch (error) {
      console.error("Profile update request failed:", error);
      message.error(
        error?.data?.message || "Failed to send OTP. Please try again."
      );
    }
  };

  const handleOtpVerifySuccess = async (response) => {
    try {
      message.success("Profile updated successfully!");
      setShowOtpModal(false);
      setIsEditing(false);
      form.resetFields();

      const currentStoredInfo = JSON.parse(
        localStorage.getItem("superAdminInfo") || "{}"
      );

      const updatedInfo = {
        ...currentStoredInfo,
        email: currentEmail || profileData?.email,
        name: response.updatedUser?.fullName || currentStoredInfo.name,
        role: response.updatedUser?.role || currentStoredInfo.role,
        ...(response.token && { token: response.token }),
      };

      localStorage.setItem("superAdminInfo", JSON.stringify(updatedInfo));

      loadProfileFromStorage();
    } catch (error) {
      console.error("Profile update completion failed:", error);
      message.error("Something went wrong. Please try again.");
    }
  };

  const handleOtpModalCancel = () => {
    setShowOtpModal(false);
  };

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px", textAlign: "center" }}>
        <Avatar
          size={80}
          icon={<SettingOutlined />}
          style={{
            background: "linear-gradient(135deg,  #da2c46 70%, #a51632 100%)",
            marginBottom: "16px",
          }}
        />
        <Title level={2} style={{ marginBottom: "8px", color: "#1f2937" }}>
          Super Admin Settings
        </Title>
        <Text type="secondary" style={{ fontSize: "16px" }}>
          Welcome back, {profileData?.name || "Super Admin"}
        </Text>
      </div>

      {/* Settings Card */}
      <Card
        style={{
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        }}
        bodyStyle={{ padding: "32px" }}
      >
        <div style={{ marginBottom: "24px" }}>
          <Title level={4} style={{ marginBottom: "8px", color: "#374151" }}>
            <UserOutlined style={{ marginRight: "8px", color: '#da2c46' }} />
            Account Information
          </Title>
          <Text type="secondary">
            Update your email address and password for enhanced security
          </Text>
        </div>

        <Divider />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitProfileUpdate}
        >
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label={
                  <span style={{ fontWeight: "600", color: "#374151" }}>
                    <UserOutlined
                      style={{ marginRight: "8px", color: '#da2c46' }}
                    />
                    Admin Name
                  </span>
                }
              >
                <Input
                  value={profileData?.name || "Super Admin"}
                  disabled
                  style={{
                    backgroundColor: "#f9fafb",
                    borderColor: "#e5e7eb",
                    color: "#6b7280",
                  }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={
                  <span style={{ fontWeight: "600", color: "#374151" }}>
                    <SettingOutlined
                      style={{ marginRight: "8px", color: '#da2c46' }}
                    />
                    Role
                  </span>
                }
              >
                <Input
                  value={
                    profileData?.role?.replace("_", " ").toUpperCase() ||
                    "SUPER ADMIN"
                  }
                  disabled
                  style={{
                    backgroundColor: "#f9fafb",
                    borderColor: "#e5e7eb",
                    color: "#6b7280",
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label={
                  <span style={{ fontWeight: "600", color: "#374151" }}>
                    <MailOutlined
                      style={{ marginRight: "8px", color: '#da2c46' }}
                    />
                    Current Email
                  </span>
                }
              >
                <Input
                  value={profileData?.email || "admin@gmail.com"}
                  disabled
                  style={{
                    backgroundColor: "#f9fafb",
                    borderColor: "#e5e7eb",
                    color: "#6b7280",
                  }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={
                  <span style={{ fontWeight: "600", color: "#374151" }}>
                    <MailOutlined
                      style={{ marginRight: "8px", color: '#da2c46' }}
                    />
                    New Email Address
                  </span>
                }
                name="newEmail"
                rules={[
                  {
                    required: isEditing,
                    message: "Please enter new email address",
                  },
                  {
                    type: "email",
                    message: "Please enter a valid email address",
                  },
                ]}
              >
                <Input
                  placeholder="Enter new email address"
                  style={{
                    borderRadius: "8px",
                    borderColor: isEditing ? "#667eea" : "#d1d5db",
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label={
                  <span style={{ fontWeight: "600", color: "#374151" }}>
                    <LockOutlined
                      style={{ marginRight: "8px", color: '#da2c46' }}
                    />
                    New Password
                  </span>
                }
                name="password"
                rules={[
                  { required: isEditing, message: "Please enter new password" },
                  { min: 6, message: "Password must be at least 6 characters" },
                ]}
              >
                <Input.Password
                  placeholder="Enter new password"
                  style={{
                    borderRadius: "8px",
                    borderColor: isEditing ? "#667eea" : "#d1d5db",
                  }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={
                  <span style={{ fontWeight: "600", color: "#374151" }}>
                    <LockOutlined
                      style={{ marginRight: "8px", color: '#da2c46' }}
                    />
                    Confirm New Password
                  </span>
                }
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  {
                    required: isEditing,
                    message: "Please confirm your password",
                  },
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
                  placeholder="Confirm new password"
                  style={{
                    borderRadius: "8px",
                    borderColor: isEditing ? "#667eea" : "#d1d5db",
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          {/* Action Buttons */}
          <div style={{ textAlign: "right" }}>
            <Space>
              {!isEditing ? (
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={handleEdit}
                  style={{
                    background:
                      "linear-gradient(135deg,  #da2c46 70%, #a51632 100%)",

                    border: "none",
                    borderRadius: "8px",
                    height: "40px",
                    paddingLeft: "24px",
                    paddingRight: "24px",
                    fontWeight: "600",
                  }}
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    icon={<CloseOutlined />}
                    onClick={handleCancelEdit}
                    style={{
                      borderRadius: "8px",
                      height: "40px",
                      paddingLeft: "20px",
                      paddingRight: "20px",
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={isUpdating}
                    style={{
                      background:
                        "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      border: "none",
                      borderRadius: "8px",
                      height: "40px",
                      paddingLeft: "24px",
                      paddingRight: "24px",
                      fontWeight: "600",
                    }}
                  >
                    Save Changes
                  </Button>
                </>
              )}
            </Space>
          </div>
        </Form>
      </Card>

      {/* OTP Modal */}
      <SuperAdminOtpModal
        visible={showOtpModal}
        onCancel={handleOtpModalCancel}
        email={currentEmail}
        onVerifySuccess={handleOtpVerifySuccess}
        mode="updateProfile"
      />
    </div>
  );
};

export default SuperAdminSettings;
