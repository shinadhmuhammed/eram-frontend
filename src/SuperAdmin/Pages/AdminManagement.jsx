import React, { useState, useMemo } from "react";
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Tag,
  Space,
  Avatar,
  Typography,
  Row,
  Col,
  Flex,
  message,
  Popconfirm,
  Modal,
} from "antd";
import {
  UserAddOutlined,
  SearchOutlined,
  FilterOutlined,
  EyeOutlined,
  EditOutlined,
  StopOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  BankOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  UserDeleteOutlined,
  CheckOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";

import AdminFormModal from "../Modal/AdminFormModal";
import AdminViewModal from "../Modal/AdminViewModal";
import {
  useGetBranchesQuery,
  useCreateAdminMutation,
  useGetAdminsQuery,
  useGetSingleAdminQuery,
  useUpdateAdminMutation,
  useDisableAdminMutation,
} from "../../Slices/SuperAdmin/SuperAdminApis.js";

import SkeletonLoader from "../../Global/SkeletonLoader";

const { Title, Text } = Typography;
const { Option } = Select;

const AdminManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [viewingAdminId, setViewingAdminId] = useState(null);
  const [statusChangeModalVisible, setStatusChangeModalVisible] =
    useState(false);
  const [adminToToggle, setAdminToToggle] = useState(null);

  const {
    data: branchesData,
    isLoading: branchesLoading,
    error: branchesError,
  } = useGetBranchesQuery();

  const {
    data: adminData,
    isLoading: adminLoading,
    error: adminError,
    refetch: refetchAdmins,
  } = useGetAdminsQuery();

  const { data: singleAdminData, isLoading: singleAdminLoading } =
    useGetSingleAdminQuery(viewingAdminId, {
      skip: !viewingAdminId,
    });

  const [createAdmin, { isLoading: createAdminLoading }] =
    useCreateAdminMutation();

  const [updateAdmin, { isLoading: updateAdminLoading }] =
    useUpdateAdminMutation();

  const [disableAdmin, { isLoading: disableAdminLoading }] =
    useDisableAdminMutation();

  const branches = branchesData?.branch || [];
  const admins = adminData?.allAdmins || [];
  const skeletonRows = 5;

  const transformedAdmins = useMemo(() => {
    return admins.map((admin) => {
      const assignedBranch = branches.find(
        (branch) => branch._id === admin.branch
      );

      return {
        key: admin._id,
        id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        name: admin.fullName,
        email: admin.email,
        phone: admin.phone,
        role: admin.role.charAt(0).toUpperCase() + admin.role.slice(1),
        status: admin.accountStatus === "active" ? "active" : "inactive",
        branchId: admin.branch,
        assignedBranches: assignedBranch
          ? [
              {
                id: assignedBranch._id,
                name: assignedBranch.name,
                code: assignedBranch.branchCode,
                location: assignedBranch.location
                  ? `${assignedBranch.location.city}, ${assignedBranch.location.state}`
                  : "N/A",
              },
            ]
          : [],
        createdDate: admin.createdAt
          ? new Date(admin.createdAt).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        region: assignedBranch?.location?.state || "N/A",
        isActive: admin.isActive,
        skills: admin.skills || [],
        qualifications: admin.qualifications || [],
      };
    });
  }, [admins, branches]);

  const filteredAdmins = transformedAdmins.filter((admin) => {
    const matchesSearch =
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || admin.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddAdmin = async (payload) => {
    try {
      const result = await createAdmin(payload).unwrap();
      message.success("Admin created successfully!");
      setIsAddModalOpen(false);
      refetchAdmins();
    } catch (error) {
      console.error("Failed to create admin:", error);
      message.error(
        error?.data?.message || "Failed to create admin. Please try again."
      );
    }
  };

  const handleEditAdmin = async (payload) => {
    try {
      const { adminId, ...updateData } = payload;
      const result = await updateAdmin({ adminId, ...updateData }).unwrap();
      message.success("Admin updated successfully!");
      setIsEditModalOpen(false);
      setSelectedAdmin(null);
      refetchAdmins();
    } catch (error) {
      console.error("Failed to update admin:", error);
      message.error(
        error?.data?.message || "Failed to update admin. Please try again."
      );
    }
  };

  const showStatusChangeModal = (admin) => {
    setAdminToToggle(admin);
    setStatusChangeModalVisible(true);
  };

  const handleToggleAdminStatus = async () => {
    if (!adminToToggle) return;

    try {
      await disableAdmin({ adminId: adminToToggle.id }).unwrap();
      const action = adminToToggle.status === "active" ? "disabled" : "enabled";
      message.success(
        `${adminToToggle.name}'s account has been ${action} successfully!`
      );
      setStatusChangeModalVisible(false);
      setAdminToToggle(null);
      refetchAdmins();
    } catch (error) {
      console.error("Failed to toggle admin status:", error);
      message.error(
        error?.data?.message ||
          "Failed to update admin status. Please try again."
      );
    }
  };

  const handleCancelStatusChange = () => {
    setStatusChangeModalVisible(false);
    setAdminToToggle(null);
  };

  const handleViewAdmin = (admin) => {
    setViewingAdminId(admin.id);
    setIsViewModalOpen(true);
  };

  const openEditModal = (admin) => {
    setSelectedAdmin(admin);
    setIsEditModalOpen(true);
  };

  React.useEffect(() => {
    if (branchesError) {
      message.error("Failed to load branches. Please refresh the page.");
    }
    if (adminError) {
      message.error("Failed to load admins. Please refresh the page.");
    }
  }, [branchesError, adminError]);

  const columns = [
    {
      title: "Admin",
      key: "admin",
      align: "center",
      render: (_, record) => (
        <Flex align="center" gap={12}>
          <Avatar
            size={40}
            icon={<UserOutlined />}
            style={{ backgroundColor: "#722ed1" }}
          />
          <div>
            <Text strong>{record.name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: "12px" }}>
              <MailOutlined style={{ marginRight: 4 }} />
              {record.email}
            </Text>
          </div>
        </Flex>
      ),
    },
    {
      title: "Role & Status",
      key: "roleStatus",
      render: (_, record) => (
        <Space direction="vertical" size={4}>
          <Tag color="purple" icon={<CheckCircleOutlined />}>
            {record.role}
          </Tag>
          <Tag color={record.status === "active" ? "green" : "red"}>
            {record.status.toUpperCase()}
          </Tag>
        </Space>
      ),
    },
    {
      title: "Contact",
      key: "contact",
      render: (_, record) => (
        <Space direction="vertical" size={4}>
          <Text style={{ fontSize: "13px" }}>
            <PhoneOutlined style={{ marginRight: 4 }} />
            {record.phone}
          </Text>
          <Text style={{ fontSize: "13px" }}>
            <EnvironmentOutlined style={{ marginRight: 4 }} />
            {record.region || "N/A"}
          </Text>
        </Space>
      ),
    },
    {
      title: "Assigned Branches",
      key: "branches",
      render: (_, record) => (
        <Space direction="vertical" size={4}>
          {record.assignedBranches?.length > 0 ? (
            record.assignedBranches.slice(0, 2).map((branch) => (
              <Tag
                key={branch.id || branch._id}
                color="blue"
                style={{ fontSize: "11px" }}
              >
                <BankOutlined style={{ marginRight: 2 }} />
                {branch.code || branch.name}
              </Tag>
            ))
          ) : (
            <Text type="secondary" style={{ fontSize: "12px" }}>
              No branches assigned
            </Text>
          )}
          {record.assignedBranches?.length > 2 && (
            <Text type="secondary" style={{ fontSize: "11px" }}>
              +{record.assignedBranches.length - 2} more
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewAdmin(record)}
            title="View Details"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
            title="Edit Admin"
          />
          {record.status === "active" ? (
            <Button
              type="text"
              icon={<StopOutlined />}
              onClick={() => showStatusChangeModal(record)}
              title="Disable Admin"
              danger
            />
          ) : (
            <Button
              type="text"
              icon={<CheckOutlined /> }
              onClick={() => showStatusChangeModal(record)}
              title="Enable Admin"
              style={{ color: "#52c41a" }}
            />
          )}
        </Space>
      ),
    },
  ];

  // Get the action details for the modal
  const getStatusChangeDetails = () => {
    if (!adminToToggle) return { action: "", color: "", icon: null };

    const isActive = adminToToggle.status === "active";
    return {
      action: isActive ? "disable" : "enable",
      color: isActive ? "#ff4d4f" : "#52c41a",
      icon: isActive ? <UserDeleteOutlined /> : <CheckOutlined />,
      actionText: isActive ? "Disable" : "Enable",
      actionPastTense: isActive ? "disabled" : "enabled",
    };
  };

  const statusDetails = getStatusChangeDetails();

  return (
    <div>
      {/* Header */}
      <Card style={{ marginBottom: "24px" }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space size="large">
              <Avatar
                size={48}
                icon={<UserAddOutlined />}
                style={{
                  background:
                    "linear-gradient(135deg,  #da2c46 70%, #a51632 100%)",
                }}
              />
              <div>
                <Title level={2} style={{ margin: 0 }}>
                  Admin Management
                </Title>
                <Text type="secondary">
                  Manage administrators and their branch assignments (
                  {filteredAdmins.length} admins)
                </Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => setIsAddModalOpen(true)}
              style={{
                background: "linear-gradient(135deg,  #da2c46 70%, #a51632 100%)",
                border: "none",
              }}
            >
              Add New Admin
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Filters */}
      <Card style={{ marginBottom: "24px" }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Input
              placeholder="Search by name, email or role..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="large"
            />
          </Col>
          <Col>
            <Flex align="center" gap={8}>
              <FilterOutlined />
              <Select
                value={filterStatus}
                onChange={setFilterStatus}
                style={{ width: 160 }}
                size="large"
              >
                <Option value="all">All Status</Option>
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
              </Select>
            </Flex>
          </Col>
        </Row>
      </Card>

      {/* Admins Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredAdmins}
          loading={{
            spinning: adminLoading || branchesLoading,
            indicator: <SkeletonLoader rowCount={skeletonRows} />,
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} admins`,
          }}
          scroll={{ x: "max-content" }}
        />
      </Card>

      {/* Status Change Confirmation Modal */}
      <Modal
        title={
          <Space>
            <ExclamationCircleOutlined style={{ color: statusDetails.color }} />
            <span>{statusDetails.actionText} Administrator Account</span>
          </Space>
        }
        open={statusChangeModalVisible}
        onOk={handleToggleAdminStatus}
        onCancel={handleCancelStatusChange}
        confirmLoading={disableAdminLoading}
        okText={`Yes, ${statusDetails.actionText} Account`}
        cancelText="Cancel"
        okButtonProps={{
          danger: adminToToggle?.status === "active",
          style:
            adminToToggle?.status === "inactive"
              ? { backgroundColor: "#52c41a", borderColor: "#52c41a" }
              : {},
          icon: statusDetails.icon,
        }}
        width={500}
        centered
      >
        <div style={{ padding: "20px 0" }}>
          <Text style={{ fontSize: "16px" }}>
            Are you sure you want to {statusDetails.action}{" "}
            <Text strong style={{ color: statusDetails.color }}>
              {adminToToggle?.name}
            </Text>
            's administrator account?
          </Text>

          <div
            style={{
              marginTop: "16px",
              padding: "12px",
              backgroundColor:
                adminToToggle?.status === "active" ? "#fff2f0" : "#f6ffed",
              borderRadius: "6px",
            }}
          >
            <Text type="secondary" style={{ fontSize: "14px" }}>
              <strong>This action will:</strong>
              <br />
              {adminToToggle?.status === "active" ? (
                <>
                  • Revoke the administrator's access to the system
                  <br />
                  • Change their account status to "Inactive"
                  <br />
                  • Prevent them from logging into their account
                  <br />• Maintain their data for potential future reactivation
                </>
              ) : (
                <>
                  • Restore the administrator's access to the system
                  <br />
                  • Change their account status to "Active"
                  <br />
                  • Allow them to log into their account
                  <br />• Reactivate all their permissions and access rights
                </>
              )}
            </Text>
          </div>

          {adminToToggle && (
            <div
              style={{
                marginTop: "16px",
                padding: "12px",
                backgroundColor: "#f6f6f6",
                borderRadius: "6px",
              }}
            >
              <Text strong>Admin Details:</Text>
              <br />
              <Text>Email: {adminToToggle.email}</Text>
              <br />
              <Text>Role: {adminToToggle.role}</Text>
              <br />
              <Text>Current Status: {adminToToggle.status}</Text>
            </div>
          )}
        </div>
      </Modal>

      {/* Other Modals */}
      <AdminFormModal
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        onSubmit={handleAddAdmin}
        branches={branches}
        loading={createAdminLoading}
        mode="add"
        title="Add New Administrator"
      />

      <AdminFormModal
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          setSelectedAdmin(null);
        }}
        onSubmit={handleEditAdmin}
        branches={branches}
        loading={updateAdminLoading}
        mode="edit"
        title="Edit Administrator"
        initialValues={selectedAdmin}
      />

      <AdminViewModal
        open={isViewModalOpen}
        onCancel={() => {
          setIsViewModalOpen(false);
          setViewingAdminId(null);
        }}
        admin={singleAdminData?.admin}
        loading={singleAdminLoading}
      />
    </div>
  );
};

export default AdminManagement;
