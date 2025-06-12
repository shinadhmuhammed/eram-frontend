import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Row,
  Col,
  Typography,
  Space,
  Tag,
  Divider,
  Badge,
  Avatar,
  Tooltip,
  Alert,
  Descriptions,
  Image,
  Spin,
  Drawer,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  BankOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  CalendarOutlined,
  UserOutlined,
  InfoCircleOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { useGetBranchByIdQuery } from "../../Slices/SuperAdmin/SuperAdminApis.js";
import SkeletonLoader from "../../Global/SkeletonLoader";

const { Title, Text, Paragraph } = Typography;

const ViewBranch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [createdBy, setCreatedBy] = useState("System Admin");
  const [isMobile, setIsMobile] = useState(false);

  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetBranchByIdQuery(id);

  useEffect(() => {
    try {
      const superAdminInfo = localStorage.getItem("superadmininfo");
      if (superAdminInfo) {
        const parsedInfo = JSON.parse(superAdminInfo);
        if (parsedInfo?.name) {
          setCreatedBy(parsedInfo.name);
        }
      }
    } catch (error) {
      console.error("Error parsing localStorage:", error);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize(); 
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleBack = () => {
    navigate("/superadmin/branches");
  };

  const handleEdit = () => {
    navigate(`/superadmin/edit/${id}`);
  };

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (isError) {
    return (
      <div style={{ padding: "24px" }}>
        <Alert
          message="Error Loading Branch Details"
          description={
            error?.data?.message || 
            error?.message || 
            "Failed to load branch details. Please try again."
          }
          type="error"
          showIcon
          action={
            <Space>
              <Button size="small" onClick={() => refetch()}>
                Retry
              </Button>
              <Button size="small" type="primary" onClick={handleBack}>
                Go Back
              </Button>
            </Space>
          }
        />
      </div>
    );
  }

  // Extract branch data from API response
  const branch = apiResponse?.branch;

  if (!branch) {
    return (
      <div style={{ padding: "24px" }}>
        <Alert
          message="Branch Not Found"
          description="The requested branch could not be found."
          type="warning"
          showIcon
          action={
            <Button size="small" type="primary" onClick={handleBack}>
              Go Back
            </Button>
          }
        />
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Not Available";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div style={{ padding: isMobile ? "12px" : "24px" }}>
      {/* Header */}
      <Card 
        style={{ 
          marginBottom: isMobile ? "16px" : "24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}
        bodyStyle={{ padding: isMobile ? "16px" : "24px" }}
      >
        <Row justify="space-between" align={isMobile ? "top" : "middle"}>
          <Col xs={24} sm={24} md={18} lg={18}>
            <Space 
              size={isMobile ? "middle" : "large"} 
              direction={isMobile ? "vertical" : "horizontal"}
              style={{ width: "100%" }}
            >
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={handleBack}
                size={isMobile ? "middle" : "large"}
                style={{ alignSelf: isMobile ? "flex-start" : "center" }}
              >
                {isMobile ? "Back" : "Back to Branches"}
              </Button>
              
              {!isMobile && <Divider type="vertical" style={{ height: "40px" }} />}
              
              <Space size="middle">
                <Avatar
                  size={isMobile ? 40 : 48}
                  style={{
                    background: "linear-gradient(135deg,  #da2c46 70%, #a51632 100%)",
                  }}
                  icon={<BankOutlined />}
                />
                <div>
                  <Title 
                    level={isMobile ? 3 : 2} 
                    style={{ 
                      margin: 0,
                      fontSize: isMobile ? "20px" : undefined 
                    }}
                  >
                    {branch.name}
                  </Title>
                  <Space 
                    direction={isMobile ? "vertical" : "horizontal"}
                    size="small"
                  >
                    <Text type="secondary" style={{ fontSize: isMobile ? "12px" : "14px" }}>
                      Code: {branch.branchCode}
                    </Text>
                    <Badge
                      status={branch.isActive ? "success" : "default"}
                      text={
                        <Text 
                          strong 
                          style={{ 
                            textTransform: "capitalize",
                            fontSize: isMobile ? "12px" : "14px"
                          }}
                        >
                          {branch.isActive ? "Active" : "Inactive"}
                        </Text>
                      }
                    />
                  </Space>
                </div>
              </Space>
            </Space>
          </Col>
          <Col xs={24} sm={24} md={6} lg={6}>
            <div style={{ 
              marginTop: isMobile ? "16px" : "0",
              textAlign: isMobile ? "left" : "right"
            }}>
              <Tooltip title="Edit Branch">
                <Button
                  type="primary"
                  size={isMobile ? "middle" : "large"}
                  icon={<EditOutlined />}
                  onClick={handleEdit}
                  style={{
                    background: "linear-gradient(135deg,  #da2c46 70%, #a51632 100%)",
                    border: "none",
                    width: isMobile ? "100%" : "auto"
                  }}
                >
                  Edit Branch
                </Button>
              </Tooltip>
            </div>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        {/* Brand Logo & Basic Info */}
        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
          <Card
            title={
              <Space>
                <InfoCircleOutlined />
                <span style={{ fontSize: isMobile ? "14px" : "16px" }}>
                  Branch Overview
                </span>
              </Space>
            }
            style={{ 
              height: "100%",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
            bodyStyle={{ padding: isMobile ? "16px" : "24px" }}
          >
            {/* Brand Logo */}
            <div style={{ 
              textAlign: "center", 
              marginBottom: isMobile ? "16px" : "24px" 
            }}>
              {branch.brand_logo ? (
                <Image
                  src={`https://res.cloudinary.com/dj0rho12o/image/upload/${branch.brand_logo}`}
                  alt={branch.name}
                  style={{
                    maxWidth: isMobile ? "150px" : "200px",
                    maxHeight: isMobile ? "90px" : "120px",
                    borderRadius: "8px",
                  }}
                  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxY4Q9srJ2QXcDIBtiygL2BkRvYuQSbC9iuZGSb7kxmAUs+gI2M7EBmYuMs+gZNjTQz3fNT9ffY/T7k1FNV3T/J79QbHNZg+Q2C4C/8If6H4AtDH36hA6nOAAA="
                />
              ) : (
                <div
                  style={{
                    height: isMobile ? "90px" : "120px",
                    background: "#f0f2f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                  }}
                >
                  <BankOutlined
                    style={{ 
                      fontSize: isMobile ? "36px" : "48px", 
                      color: "#d9d9d9" 
                    }}
                  />
                </div>
              )}
            </div>

            {/* Key Information */}
            <Space 
              direction="vertical" 
              size={isMobile ? "small" : "middle"} 
              style={{ width: "100%" }}
            >
              <div>
                <Text type="secondary" style={{ fontSize: isMobile ? "12px" : "14px" }}>
                  Branch Status
                </Text>
                <br />
                <Badge
                  status={branch.isActive ? "success" : "default"}
                  text={
                    <Text 
                      strong 
                      style={{ fontSize: isMobile ? "14px" : "16px" }}
                    >
                      {branch.isActive ? "Active" : "Inactive"}
                    </Text>
                  }
                />
              </div>

              <div>
                <Text type="secondary" style={{ fontSize: isMobile ? "12px" : "14px" }}>
                  Region
                </Text>
                <br />
                <Tag
                  color="blue"
                  style={{ 
                    fontSize: isMobile ? "12px" : "14px", 
                    padding: isMobile ? "2px 8px" : "4px 12px" 
                  }}
                >
                  <GlobalOutlined style={{ marginRight: "4px" }} />
                  {branch.location?.state || "Not Specified"}
                </Tag>
              </div>

              <div>
                <Text type="secondary" style={{ fontSize: isMobile ? "12px" : "14px" }}>
                  Created Date
                </Text>
                <br />
                <Space size="small">
                  <CalendarOutlined style={{ color: "#1890ff" }} />
                  <Text style={{ fontSize: isMobile ? "12px" : "14px" }}>
                    {formatDate(branch.createdAt)}
                  </Text>
                </Space>
              </div>

              <div>
                <Text type="secondary" style={{ fontSize: isMobile ? "12px" : "14px" }}>
                  Last Updated
                </Text>
                <br />
                <Space size="small">
                  <CalendarOutlined style={{ color: "#52c41a" }} />
                  <Text style={{ fontSize: isMobile ? "12px" : "14px" }}>
                    {formatDate(branch.updatedAt)}
                  </Text>
                </Space>
              </div>
            </Space>
          </Card>
        </Col>

        {/* Contact & Location Details */}
        <Col xs={24} sm={24} md={24} lg={16} xl={16}>
          <Space 
            direction="vertical" 
            size={isMobile ? "middle" : "large"} 
            style={{ width: "100%" }}
          >
            {/* Contact Information */}
            <Card
              title={
                <Space>
                  <PhoneOutlined />
                  <span style={{ fontSize: isMobile ? "14px" : "16px" }}>
                    Contact Information
                  </span>
                </Space>
              }
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
              bodyStyle={{ padding: isMobile ? "16px" : "24px" }}
            >
              <Descriptions 
                column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }} 
                bordered
                size={isMobile ? "small" : "default"}
                labelStyle={{ 
                  fontSize: isMobile ? "12px" : "14px",
                  fontWeight: "600"
                }}
                contentStyle={{ 
                  fontSize: isMobile ? "12px" : "14px"
                }}
              >
                <Descriptions.Item label="Phone Number">
                  <Space size="small">
                    <PhoneOutlined style={{ color: "#52c41a" }} />
                    <Text style={{ fontSize: isMobile ? "12px" : "14px" }}>
                      {branch.location?.branch_phoneno || "Not Available"}
                    </Text>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Email Address">
                  <Space size="small">
                    <MailOutlined style={{ color: "#722ed1" }} />
                    <Text 
                      style={{ 
                        fontSize: isMobile ? "12px" : "14px",
                        wordBreak: "break-all" 
                      }}
                    >
                      {branch.location?.branch_email || "Not Available"}
                    </Text>
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Location Details */}
            <Card
              title={
                <Space>
                  <EnvironmentOutlined />
                  <span style={{ fontSize: isMobile ? "14px" : "16px" }}>
                    Location Details
                  </span>
                </Space>
              }
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
              bodyStyle={{ padding: isMobile ? "16px" : "24px" }}
            >
              <Descriptions 
                column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }} 
                bordered
                size={isMobile ? "small" : "default"}
                labelStyle={{ 
                  fontSize: isMobile ? "12px" : "14px",
                  fontWeight: "600"
                }}
                contentStyle={{ 
                  fontSize: isMobile ? "12px" : "14px"
                }}
              >
                <Descriptions.Item label="Street Address" span={2}>
                  <Text style={{ fontSize: isMobile ? "12px" : "14px" }}>
                    {branch.location?.street || "Not Available"}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="City">
                  <Text style={{ fontSize: isMobile ? "12px" : "14px" }}>
                    {branch.location?.city || "Not Available"}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="State">
                  <Text style={{ fontSize: isMobile ? "12px" : "14px" }}>
                    {branch.location?.state || "Not Available"}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Country">
                  <Text style={{ fontSize: isMobile ? "12px" : "14px" }}>
                    {branch.location?.country || "Not Available"}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Postal Code">
                  <Text style={{ fontSize: isMobile ? "12px" : "14px" }}>
                    {branch.location?.postalCode || "Not Available"}
                  </Text>
                </Descriptions.Item>
              </Descriptions>

              {/* Full Address Display */}
              <div style={{ marginTop: isMobile ? "12px" : "16px" }}>
                <Text 
                  strong 
                  style={{ fontSize: isMobile ? "13px" : "14px" }}
                >
                  Complete Address:
                </Text>
                <div
                  style={{
                    marginTop: "8px",
                    padding: isMobile ? "8px" : "12px",
                    backgroundColor: "#fafafa",
                    borderRadius: "6px",
                    border: "1px solid #d9d9d9",
                  }}
                >
                  <Text style={{ 
                    fontSize: isMobile ? "12px" : "14px",
                    lineHeight: isMobile ? "1.4" : "1.6"
                  }}>
                    {branch.location?.street}
                    <br />
                    {branch.location?.city}, {branch.location?.state}
                    <br />
                    {branch.location?.country} - {branch.location?.postalCode}
                  </Text>
                </div>
              </div>
            </Card>

            {/* Additional Information */}
            <Card
              title={
                <Space>
                  <InfoCircleOutlined />
                  <span style={{ fontSize: isMobile ? "14px" : "16px" }}>
                    Additional Information
                  </span>
                </Space>
              }
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
              bodyStyle={{ padding: isMobile ? "16px" : "24px" }}
            >
              <Descriptions 
                column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }} 
                bordered
                size={isMobile ? "small" : "default"}
                labelStyle={{ 
                  fontSize: isMobile ? "12px" : "14px",
                  fontWeight: "600"
                }}
                contentStyle={{ 
                  fontSize: isMobile ? "12px" : "14px"
                }}
              >
                <Descriptions.Item label="Branch ID">
                  <Text 
                    code 
                    style={{ 
                      fontSize: isMobile ? "10px" : "12px",
                      wordBreak: "break-all"
                    }}
                  >
                    {branch._id}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Branch Code">
                  <Text 
                    strong 
                    style={{ 
                      fontSize: isMobile ? "14px" : "16px", 
                      fontFamily: "monospace" 
                    }}
                  >
                    {branch.branchCode}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Created By">
                  <Space size="small">
                    <UserOutlined style={{ color: "#1890ff" }} />
                    <Text style={{ fontSize: isMobile ? "12px" : "14px" }}>
                      {createdBy}
                    </Text>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Version">
                  <Text style={{ fontSize: isMobile ? "12px" : "14px" }}>
                    {branch.__v || 0}
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default ViewBranch;