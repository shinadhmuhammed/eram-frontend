import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Input,
  Select,
  Modal,
  Form,
  Row,
  Col,
  Badge,
  Space,
  Typography,
  Divider,
  Statistic,
  Tag,
  message,
  Avatar,
  Tooltip,
  Spin,
  Alert,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  BankOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  useGetBranchesQuery,
  useDeleteBranchMutation,
} from "../../Slices/SuperAdmin/SuperAdminAPIs.js";
import SkeletonLoader from "../../Global/SkeletonLoader";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const BranchManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState(null);

  // Use the API hook
  const {
    data: apiData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetBranchesQuery();

  const [deleteBranch, { isLoading: isDeleting }] = useDeleteBranchMutation();

  const transformedBranches =
    apiData?.branch?.map((branch) => ({
      id: branch._id,
      name: branch.name,
      code: branch.branchCode,
      location: `${branch.location.street}, ${branch.location.city}`,
      fullLocation: branch.location,
      status: branch.isActive ? "active" : "inactive",
      brandLogo: branch.brand_logo,
      phone: branch.location.branch_phoneno || "Not Available",
      email: branch.location.branch_email || "Not Available",
      region: branch.location.state, // Using state as region
    })) || [];

  const filteredBranches = transformedBranches.filter((branch) => {
    const matchesSearch =
      branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || branch.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAdd = () => {
    navigate("/superadmin/add");
  };

  const handleEdit = (branchId) => {
    navigate(`/superadmin/edit/${branchId}`);
  };

  const handleView = (branchId) => {
    navigate(`/superadmin/view/${branchId}`);
  };

  const handleDeleteClick = (branch) => {
    setBranchToDelete(branch);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!branchToDelete) return;

    setDeleteLoading(true);
    try {
      await deleteBranch(branchToDelete.id).unwrap();
      message.success("Branch deleted successfully!");
      refetch(); // Refresh the branch list
      setDeleteModalOpen(false);
      setBranchToDelete(null);
    } catch (error) {
      message.error("Failed to delete branch");
      console.error("Delete error:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setBranchToDelete(null);
  };

  const getStatusColor = (status) => {
    return status === "active" ? "success" : "default";
  };

  const getRegionColor = (region) => {
    return "blue";
  };

  // Handle loading state
  if (isLoading) {
    return <SkeletonLoader />;
  }

  // Handle error state
  if (isError) {
    return (
      <div style={{ padding: "24px" }}>
        <Alert
          message="Error Loading Branches"
          description={
            error?.message || "Failed to load branch data. Please try again."
          }
          type="error"
          showIcon
          action={
            <Button size="small" danger onClick={() => refetch()}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <Card style={{ marginBottom: "24px" }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space size="large">
              <Avatar
                size={48}
                style={{
                  background:
                    "linear-gradient(135deg,  #da2c46 70%, #a51632 100%)"
                }}
                icon={<BankOutlined />}
              />
              <div>
                <Title level={2} style={{ margin: 0 }}>
                  Branch Management
                </Title>
                <Text type="secondary">
                  Manage your branch locations and operations (
                  {transformedBranches.length} branches)
                </Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              style={{
                background: "linear-gradient(135deg,  #da2c46 70%, #a51632 100%)",
                border: "none",
              }}
            >
              Add New Branch
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Filters */}
      <Card style={{ marginBottom: "24px" }}>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={16} lg={18}>
            <Input
              size="large"
              placeholder="Search branches, locations, or branch codes..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={24} md={8} lg={6}>
            <Select
              size="large"
              value={filterStatus}
              onChange={setFilterStatus}
              style={{ width: "100%" }}
              suffixIcon={<FilterOutlined />}
            >
              <Option value="all">All Branches</Option>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Branch Cards */}
      <Row gutter={[24, 24]}>
        {filteredBranches.map((branch) => (
          <Col xs={24} sm={24} md={12} lg={12} xl={8} key={branch.id}>
            <Card
              hoverable
              style={{
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                transition: "all 0.3s ease",
              }}
              cover={
                branch.brandLogo ? (
                  <div style={{ height: "140px", overflow: "hidden" }}>
                    <img
                      alt={branch.name}
                      src={`https://res.cloudinary.com/dj0rho12o/image/upload/${branch.brandLogo}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      height: "140px",
                      background: "#f0f2f5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <BankOutlined
                      style={{ fontSize: "48px", color: "#d9d9d9" }}
                    />
                  </div>
                )
              }
              bodyStyle={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Header */}
              <div style={{ marginBottom: "16px" }}>
                <Row justify="space-between" align="top">
                  <Col flex="1">
                    <Title level={4} style={{ margin: "0 0 4px 0" }}>
                      {branch.name}
                    </Title>
                  </Col>
                  <Col>
                    <Badge
                      status={
                        branch.status === "active" ? "success" : "default"
                      }
                      text={
                        <Text strong style={{ textTransform: "capitalize" }}>
                          {branch.status}
                        </Text>
                      }
                    />
                  </Col>
                </Row>
              </div>

              {/* Branch Code & Region */}
              <Row justify="space-between" style={{ marginBottom: "16px" }}>
                <Col>
                  <Text type="secondary">Branch Code:</Text>
                  <br />
                  <Text
                    strong
                    style={{ fontFamily: "monospace", fontSize: "16px" }}
                  >
                    {branch.code}
                  </Text>
                </Col>
                <Col>
                  <Tag
                    color={getRegionColor(branch.region)}
                    style={{ margin: 0 }}
                  >
                    <GlobalOutlined style={{ marginRight: "4px" }} />
                    {branch.region}
                  </Tag>
                </Col>
              </Row>

              {/* Contact Information */}
              <div style={{ marginBottom: "16px" }}>
                <Space
                  direction="vertical"
                  size="small"
                  style={{ width: "100%" }}
                >
                  <Space>
                    <PhoneOutlined style={{ color: "#52c41a" }} />
                    <Text>{branch.phone}</Text>
                  </Space>
                  <Space>
                    <MailOutlined style={{ color: "#722ed1" }} />
                    <Text ellipsis style={{ maxWidth: "200px" }}>
                      {branch.email}
                    </Text>
                  </Space>
                </Space>
              </div>

              <Divider style={{ margin: "16px 0" }} />

              {/* Full Address */}
              <div style={{ marginBottom: "20px" }}>
                <Space
                  direction="vertical"
                  size="small"
                  style={{ width: "100%" }}
                >
                  <Space>
                    <EnvironmentOutlined style={{ color: "#1890ff" }} />
                    <Text strong>Complete Address:</Text>
                  </Space>
                  <Text
                    style={{
                      fontSize: "13px",
                      paddingLeft: "20px",
                      lineHeight: "1.4",
                    }}
                  >
                    {branch.fullLocation.street}
                    <br />
                    {branch.fullLocation.city}, {branch.fullLocation.state}
                    <br />
                    {branch.fullLocation.country} -{" "}
                    {branch.fullLocation.postalCode}
                  </Text>
                </Space>
              </div>

              {/* Actions */}
              <Space style={{ width: "100%", justifyContent: "center" }}>
                <Tooltip title="View Details">
                  <Button
                    type="default"
                    icon={<EyeOutlined />}
                    onClick={() => handleView(branch.id)}
                  >
                    View
                  </Button>
                </Tooltip>
                <Tooltip title="Edit Branch">
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(branch.id)}
                  >
                    Edit
                  </Button>
                </Tooltip>
                <Tooltip title="Delete Branch">
                  <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteClick(branch)}
                  />
                </Tooltip>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* No Results */}
      {filteredBranches.length === 0 && !isLoading && (
        <Card style={{ textAlign: "center", padding: "48px" }}>
          <BankOutlined
            style={{ fontSize: "48px", color: "#d9d9d9", marginBottom: "16px" }}
          />
          <Title level={3} type="secondary">
            No branches found
          </Title>
          <Paragraph type="secondary">
            {transformedBranches.length === 0
              ? "No branches available. Start by adding your first branch."
              : "Try adjusting your search or filter criteria"}
          </Paragraph>
          {transformedBranches.length === 0 && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              style={{ marginTop: "16px" }}
            >
              Add First Branch
            </Button>
          )}
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        title={
          <Space>
            <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />
            Confirm Delete
          </Space>
        }
        open={deleteModalOpen}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        okText="Yes, Delete"
        cancelText="Cancel"
        okButtonProps={{
          danger: true,
          loading: deleteLoading,
          style: { minWidth: "100px" },
        }}
        cancelButtonProps={{
          style: { minWidth: "80px" },
        }}
        width={500}
        centered
      >
        {branchToDelete && (
          <div style={{ padding: "20px 0" }}>
            <Text style={{ fontSize: "16px" }}>
              Are you sure you want to delete the branch{" "}
              <Text strong style={{ color: "#ff4d4f" }}>
                "{branchToDelete.name}"
              </Text>
              ?
            </Text>
            <br />
            <br />
            <Text type="secondary">
              This action cannot be undone. All data associated with this branch
              will be permanently removed.
            </Text>

            {/* Branch details preview */}
            <div
              style={{
                marginTop: "16px",
                padding: "12px",
                backgroundColor: "#fafafa",
                borderRadius: "6px",
                border: "1px solid #d9d9d9",
              }}
            >
              <Space
                direction="vertical"
                size="small"
                style={{ width: "100%" }}
              >
                <div>
                  <Text type="secondary">Branch Code: </Text>
                  <Text strong>{branchToDelete.code}</Text>
                </div>
                <div>
                  <Text type="secondary">Location: </Text>
                  <Text>{branchToDelete.location}</Text>
                </div>
                <div>
                  <Text type="secondary">Status: </Text>
                  <Badge
                    status={
                      branchToDelete.status === "active" ? "success" : "default"
                    }
                    text={branchToDelete.status}
                  />
                </div>
              </Space>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BranchManagement;
