import React, { useState } from "react";
import {
  Button,
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Tooltip,
  Empty,
  Space,
  Badge,
  Modal,
  message,
  Divider,
  Descriptions,
  List,
  Spin,
  Switch,
  Input,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  FileTextOutlined,
  RocketOutlined,
  EyeOutlined,
  FolderOpenOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  OrderedListOutlined,
  ApartmentOutlined,
  CheckOutlined,
  StopOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import {
  useGetPipelinesQuery,
  useDeletePipelineMutation,
  useGetPipelineByIdQuery,
  useDisablePipelineMutation,
} from "../../Slices/Admin/AdminApis";
import CreatePipelineModal from "../Components/CreatePipelineModal";
import "../../index.css";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const Pipeline = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPipeline, setEditingPipeline] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [pipelineToDelete, setPipelineToDelete] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedPipelineId, setSelectedPipelineId] = useState(null);
  const [disableModalVisible, setDisableModalVisible] = useState(false);
  const [pipelineToToggle, setPipelineToToggle] = useState(null);

  const {
    data: pipelinesResponse,
    isLoading,
    refetch,
  } = useGetPipelinesQuery();

  const {
    data: pipelineDetails,
    isLoading: isLoadingDetails,
    error: detailsError,
  } = useGetPipelineByIdQuery(selectedPipelineId, {
    skip: !selectedPipelineId,
  });

  const [deletePipeline, { isLoading: isDeleting }] =
    useDeletePipelineMutation();

  const [disablePipeline, { isLoading: isDisabling }] =
    useDisablePipelineMutation();

  const pipelines = pipelinesResponse?.allPipelines || [];

  const isPipelineActive = (pipeline) => {
    return pipeline?.pipelineStatus === "active";
  };

  const showDeleteModal = (pipeline) => {
    setPipelineToDelete(pipeline);
    setDeleteModalVisible(true);
  };

  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
    setPipelineToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!pipelineToDelete) return;

    try {
      await deletePipeline(pipelineToDelete._id).unwrap();
      message.success(
        `Pipeline "${pipelineToDelete.name}" deleted successfully`
      );
      setDeleteModalVisible(false);
      setPipelineToDelete(null);
      refetch();
    } catch (error) {
      const errorMessage =
        error?.data?.message || error?.message || "Failed to delete pipeline";
      message.error(errorMessage);
      console.error("Delete error:", error);
    }
  };

  const showDisableModal = (pipeline) => {
    setPipelineToToggle(pipeline);
    setDisableModalVisible(true);
  };

  const handleDisableCancel = () => {
    setDisableModalVisible(false);
    setPipelineToToggle(null);
  };

  const handleToggleStatus = async () => {
    if (!pipelineToToggle) return;

    try {
      const response = await disablePipeline(pipelineToToggle._id).unwrap();

      const newStatus = response.pipeline.pipelineStatus;
      message.success(
        `Pipeline "${pipelineToToggle.name}" is now ${newStatus}`
      );

      setDisableModalVisible(false);
      setPipelineToToggle(null);
      refetch();
    } catch (error) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Failed to update pipeline status";
      message.error(errorMessage);
      console.error("Status change error:", error);
    }
  };
  const showCreateModal = () => {
    setEditingPipeline(null);
    setIsModalVisible(true);
  };

  const showEditModal = (pipeline) => {
    setEditingPipeline(pipeline);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditingPipeline(null);
    refetch();
  };

  const handleViewPipeline = (pipelineId) => {
    setSelectedPipelineId(pipelineId);
    setViewModalVisible(true);
  };

  const handleViewModalClose = () => {
    setViewModalVisible(false);
    setSelectedPipelineId(null);
  };

  return (
    <>
      <div
        style={{
          padding: "16px",
          minHeight: "100vh",
          "@media (min-width: 576px)": {
            padding: "24px",
          },
          "@media (min-width: 768px)": {
            padding: "32px",
          },
        }}
      >
        <div className="pipeline-header">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ApartmentOutlined
              size={24}
              style={{ marginRight: "8px", color: "#2c3e50" }}
            />
            <Title
              level={2}
              className="pipeline-title"
              style={{ margin: 0, color: "#2c3e50", fontSize: "20px" }}
            >
              Pipeline Management
            </Title>
          </div>

          <Input.Search
            placeholder="Search Pipelines"
            allowClear
            style={{
              maxWidth: "300px",
              width: "100%",
              borderRadius: "8px",
              height: "44px",
            }}
          />

          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={showCreateModal}
            className="pipeline-button"
            style={{
              background: "linear-gradient(135deg,  #da2c46 70%, #a51632 100%)",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              width: "100%",
              height: "44px",
            }}
            block
          >
            Create New Pipeline
          </Button>
        </div>

        {isLoading ? (
          <Card loading style={{ borderRadius: "16px" }} />
        ) : pipelines?.length > 0 ? (
          <Row
            gutter={[
              { xs: 12, sm: 16, md: 16, lg: 20, xl: 24 },
              { xs: 12, sm: 16, md: 16, lg: 20, xl: 24 },
            ]}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "16px",
              "@media (min-width: 576px)": {
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "20px",
              },
              "@media (min-width: 768px)": {
                gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                gap: "24px",
              },
              "@media (min-width: 1200px)": {
                gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
              },
            }}
          >
            {pipelines.map((pipeline) => (
              <div key={pipeline._id}>
                <Card
                  style={{
                    borderRadius: "12px",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(10px)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    "@media (min-width: 768px)": {
                      borderRadius: "16px",
                      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                    },
                  }}
                  title={
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          minWidth: 0,
                          flex: 1,
                        }}
                      >
                        <FolderOpenOutlined
                          style={{
                            color: "#da2c46",
                            marginRight: 8,
                            fontSize: "16px",
                            flexShrink: 0,
                          }}
                        />
                        <Text
                          strong
                          style={{
                            fontSize: "14px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            "@media (min-width: 576px)": {
                              fontSize: "16px",
                            },
                          }}
                          title={pipeline.name}
                        >
                          {pipeline.name}
                        </Text>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <Tag
                          color={isPipelineActive(pipeline) ? "green" : "red"}
                        >
                          {isPipelineActive(pipeline) ? "Active" : "Inactive"}
                        </Tag>
                        <Badge
                          count={pipeline.stages.length}
                          style={{
                            backgroundColor: "#52c41a",
                            flexShrink: 0,
                          }}
                        />
                      </div>
                    </div>
                  }
                  extra={
                    <Space size="small">
                      <Tooltip title="View Details">
                        <Button
                          type="text"
                          size="small"
                          icon={<EyeOutlined />}
                          onClick={() => handleViewPipeline(pipeline._id)}
                        />
                      </Tooltip>
                      <Tooltip title="Edit Pipeline">
                        <Button
                          type="text"
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => showEditModal(pipeline)}
                        />
                      </Tooltip>
                      <Tooltip
                        title={
                          isPipelineActive(pipeline)
                            ? "Disable Pipeline"
                            : "Enable Pipeline"
                        }
                      >
                        <Button
                          type="text"
                          size="small"
                          icon={
                            isPipelineActive(pipeline) ? (
                              <StopOutlined />
                            ) : (
                              <CheckCircleOutlined />
                            )
                          }
                          onClick={() => showDisableModal(pipeline)}
                          style={{
                            color: isPipelineActive(pipeline)
                              ? "#ff4d4f"
                              : "#52c41a",
                          }}
                        />
                      </Tooltip>
                      <Tooltip title="Delete Pipeline">
                        <Button
                          type="text"
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => showDeleteModal(pipeline)}
                        />
                      </Tooltip>
                    </Space>
                  }
                  bodyStyle={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    padding: "16px",
                    "@media (min-width: 576px)": {
                      padding: "20px",
                    },
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ marginBottom: 16 }}>
                      <Text
                        strong
                        style={{ color: "#2c3e50", fontSize: "13px" }}
                      >
                        Pipeline Stages:
                      </Text>
                      <div
                        style={{
                          marginTop: 8,
                          maxHeight: "120px",
                          overflowY: "auto",
                          overflowX: "hidden",
                        }}
                      >
                        {[...pipeline.stages]
                          .sort((a, b) => a.order - b.order)
                          .map((stage, index) => (
                            <Tag
                              key={stage._id}
                              color="blue"
                              style={{
                                marginBottom: 6,
                                marginRight: 6,
                                borderRadius: 6,
                                fontSize: "11px",
                                padding: "2px 6px",
                                display: "inline-block",
                                maxWidth: "100%",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                "@media (min-width: 576px)": {
                                  fontSize: "12px",
                                  padding: "4px 8px",
                                  borderRadius: 8,
                                },
                              }}
                              title={`${stage.order}. ${stage.name}`}
                            >
                              {stage.order}. {stage.name}
                            </Tag>
                          ))}
                      </div>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <Text
                        strong
                        style={{ color: "#2c3e50", fontSize: "12px" }}
                      >
                        <FileTextOutlined style={{ marginRight: 4 }} />
                        Documents Required:
                      </Text>
                      <div style={{ marginTop: 6 }}>
                        {pipeline.stages.reduce((totalDocs, stage) => {
                          return totalDocs + stage.requiredDocuments.length;
                        }, 0) > 0 ? (
                          <Text type="secondary" style={{ fontSize: "11px" }}>
                            {pipeline.stages.reduce((totalDocs, stage) => {
                              return totalDocs + stage.requiredDocuments.length;
                            }, 0)}{" "}
                            documents across all stages
                          </Text>
                        ) : (
                          <Text type="secondary" style={{ fontSize: "11px" }}>
                            No documents required
                          </Text>
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      borderTop: "1px solid #f0f0f0",
                      paddingTop: 12,
                      marginTop: "auto",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "8px",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: "10px",
                          "@media (min-width: 576px)": {
                            fontSize: "12px",
                          },
                        }}
                      >
                        Created:{" "}
                        {new Date(
                          pipeline.createdAt || Date.now()
                        ).toLocaleDateString(undefined, {
                          year: "2-digit",
                          month: "short",
                          day: "numeric",
                        })}
                      </Text>
                    </div>
                    <div style={{ flexShrink: 0 }}>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: "10px",
                          "@media (min-width: 576px)": {
                            fontSize: "12px",
                          },
                        }}
                      >
                        ID: {pipeline._id.slice(-6)}
                      </Text>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </Row>
        ) : (
          <Card
            style={{
              borderRadius: "12px",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              "@media (min-width: 768px)": {
                borderRadius: "16px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div style={{ textAlign: "center" }}>
                  <Text
                    style={{
                      fontSize: "14px",
                      color: "#7f8c8d",
                      "@media (min-width: 576px)": {
                        fontSize: "16px",
                      },
                    }}
                  >
                    No pipelines created yet
                  </Text>
                  <br />
                  <Text
                    type="secondary"
                    style={{
                      fontSize: "12px",
                      "@media (min-width: 576px)": {
                        fontSize: "14px",
                      },
                    }}
                  >
                    Create your first pipeline to get started with structured
                    hiring
                  </Text>
                </div>
              }
            />
          </Card>
        )}
      </div>

      {/* View Pipeline Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <InfoCircleOutlined style={{ marginRight: 8, color: "#da2c46" }} />
            Pipeline Details
          </div>
        }
        open={viewModalVisible}
        onCancel={handleViewModalClose}
        footer={[
          <Button
            key="close"
            type="primary"
            style={{
              background: "linear-gradient(135deg,  #da2c46 70%, #a51632 100%)",
            }}
            onClick={handleViewModalClose}
          >
            Close
          </Button>,
        ]}
        width="90%"
        style={{ maxWidth: 800 }}
        centered
        destroyOnClose
      >
        {isLoadingDetails ? (
          <div style={{ textAlign: "center", padding: "50px 0" }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>
              <Text>Loading pipeline details...</Text>
            </div>
          </div>
        ) : detailsError ? (
          <div style={{ textAlign: "center", padding: "50px 0" }}>
            <Text type="danger">
              Failed to load pipeline details. Please try again.
            </Text>
          </div>
        ) : pipelineDetails?.getPipelineByIds ? (
          <div>
            <Card
              title="Pipeline Information"
              style={{ marginBottom: 16 }}
              size="small"
            >
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Name">
                  <Text strong>{pipelineDetails.getPipelineByIds.name}</Text>
                </Descriptions.Item>

                <Descriptions.Item label="Total Stages">
                  <Badge
                    count={pipelineDetails.getPipelineByIds.stages?.length || 0}
                    showZero
                    style={{ backgroundColor: "#52c41a" }}
                  />
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag
                    color={
                      pipelineDetails.getPipelineByIds.pipelineStatus ===
                      "active"
                        ? "green"
                        : "red"
                    }
                  >
                    {pipelineDetails.getPipelineByIds.pipelineStatus ===
                    "active"
                      ? "Active"
                      : "Inactive"}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card
              title={
                <div>
                  <OrderedListOutlined style={{ marginRight: 8 }} />
                  Pipeline Stages (
                  {pipelineDetails.getPipelineByIds.stages?.length || 0})
                </div>
              }
              size="small"
            >
              {pipelineDetails.getPipelineByIds.stages?.length > 0 ? (
                <List
                  dataSource={[...pipelineDetails.getPipelineByIds.stages].sort(
                    (a, b) => a.order - b.order
                  )}
                  renderItem={(stage, index) => (
                    <List.Item
                      style={{
                        background: index % 2 === 0 ? "#fafafa" : "white",
                        borderRadius: 8,
                        marginBottom: 12,
                        padding: "16px",
                        border: "1px solid #f0f0f0",
                      }}
                    >
                      <div style={{ width: "100%" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 12,
                          }}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Tag
                              color="blue"
                              style={{
                                margin: 0,
                                fontSize: "12px",
                                padding: "4px 8px",
                                borderRadius: "6px",
                              }}
                            >
                              Stage #{stage.order}
                            </Tag>
                            <Text
                              strong
                              style={{ marginLeft: 12, fontSize: 16 }}
                            >
                              {stage.name}
                            </Text>
                          </div>
                        </div>

                        {stage.description && (
                          <div style={{ marginBottom: 12 }}>
                            <Text
                              strong
                              style={{ fontSize: 13, color: "#666" }}
                            >
                              Description:
                            </Text>
                            <Paragraph
                              style={{
                                margin: "4px 0 0 0",
                                color: "#333",
                                fontSize: 14,
                                lineHeight: 1.5,
                                paddingLeft: 12,
                                borderLeft: "3px solid #e6f7ff",
                                backgroundColor: "#f9f9f9",
                                padding: "8px 12px",
                                borderRadius: "4px",
                              }}
                            >
                              {stage.description}
                            </Paragraph>
                          </div>
                        )}

                        {stage.requiredDocuments?.length > 0 && (
                          <div>
                            <Text
                              strong
                              style={{
                                fontSize: 13,
                                color: "#666",
                                display: "block",
                                marginBottom: 8,
                              }}
                            >
                              <FileTextOutlined style={{ marginRight: 6 }} />
                              Required Documents (
                              {stage.requiredDocuments.length}):
                            </Text>
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "6px",
                              }}
                            >
                              {stage.requiredDocuments.map((doc, docIndex) => (
                                <Tag
                                  key={docIndex}
                                  style={{
                                    fontSize: 12,
                                    padding: "4px 8px",
                                    backgroundColor: "#e6f7ff",
                                    borderColor: "#91d5ff",
                                    borderRadius: "6px",
                                    margin: 0,
                                  }}
                                >
                                  {doc}
                                </Tag>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </List.Item>
                  )}
                />
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No stages configured for this pipeline"
                />
              )}
            </Card>
          </div>
        ) : (
          <Empty description="Pipeline not found" />
        )}
      </Modal>

      {/* Create/Edit Pipeline Modal */}
      <CreatePipelineModal
        visible={isModalVisible}
        onClose={handleModalClose}
        editingPipeline={editingPipeline}
      />

      <Modal
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: isPipelineActive(pipelineToToggle) ? "#ff4d4f" : "#52c41a",
            }}
          >
            <ExclamationCircleOutlined
              style={{ marginRight: 8, fontSize: 18 }}
            />
            <span style={{ fontSize: "16px" }}>
              {isPipelineActive(pipelineToToggle) ? "Disable" : "Enable"}{" "}
              Pipeline
            </span>
          </div>
        }
        open={disableModalVisible}
        onCancel={handleDisableCancel}
        width="90%"
        style={{ maxWidth: 500 }}
        centered
        footer={[
          <Button key="cancel" onClick={handleDisableCancel} size="large">
            Cancel
          </Button>,
          <Button
            key="confirm"
            type="primary"
            danger={isPipelineActive(pipelineToToggle)}
            onClick={handleToggleStatus}
            loading={isDisabling}
            size="large"
            style={{
              background: isPipelineActive(pipelineToToggle)
                ? "#ff4d4f"
                : "#52c41a",
              borderColor: isPipelineActive(pipelineToToggle)
                ? "#ff4d4f"
                : "#52c41a",
            }}
          >
            {isPipelineActive(pipelineToToggle) ? "Disable" : "Enable"}
          </Button>,
        ]}
      >
        <div style={{ padding: "16px 0" }}>
          <Text>
            Are you sure you want to{" "}
            {isPipelineActive(pipelineToToggle) ? "disable" : "enable"} the
            pipeline <Text strong>"{pipelineToToggle?.name}"</Text>?
          </Text>
          {isPipelineActive(pipelineToToggle) && (
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">
                Disabling will prevent this pipeline from being used in new job
                postings.
              </Text>
            </div>
          )}
          {!isPipelineActive(pipelineToToggle) && (
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">
                Enabling will make this pipeline available for use in job
                postings.
              </Text>
            </div>
          )}
        </div>
      </Modal>

      <Modal
        title={
          <div
            style={{ display: "flex", alignItems: "center", color: "#ff4d4f" }}
          >
            <ExclamationCircleOutlined
              style={{ marginRight: 8, fontSize: 18 }}
            />
            <span style={{ fontSize: "16px" }}>Delete Pipeline</span>
          </div>
        }
        open={deleteModalVisible}
        onCancel={handleDeleteCancel}
        width="90%"
        style={{ maxWidth: 500 }}
        centered
        footer={[
          <Button
            key="cancel"
            onClick={handleDeleteCancel}
            size="large"
            style={{
              marginRight: 8,
              "@media (max-width: 576px)": {
                marginRight: 0,
                marginBottom: 8,
              },
            }}
          >
            Cancel
          </Button>,
          <Button
            key="delete"
            type="primary"
            danger
            loading={isDeleting}
            onClick={handleDeleteConfirm}
            size="large"
            icon={<DeleteOutlined />}
            style={{
              "@media (max-width: 576px)": {
                width: "100%",
              },
            }}
          >
            Delete Pipeline
          </Button>,
        ]}
        maskClosable={false}
        destroyOnClose
      >
        <div style={{ padding: "16px 0" }}>
          <div
            style={{
              background: "#fff2f0",
              border: "1px solid #ffccc7",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "16px",
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              "@media (min-width: 576px)": {
                padding: "16px",
                marginBottom: "20px",
              },
            }}
          >
            <WarningOutlined
              style={{
                color: "#ff4d4f",
                fontSize: "16px",
                marginTop: "2px",
                flexShrink: 0,
                "@media (min-width: 576px)": {
                  fontSize: "18px",
                },
              }}
            />
            <div>
              <Text strong style={{ color: "#ff4d4f", fontSize: "13px" }}>
                This action cannot be undone!
              </Text>
              <br />
              <Text style={{ color: "#8c8c8c", fontSize: "12px" }}>
                All pipeline data including stages, configurations, and
                associated records will be permanently removed.
              </Text>
            </div>
          </div>

          {pipelineToDelete && (
            <div>
              <Text>
                You are about to delete the pipeline{" "}
                <Text strong>"{pipelineToDelete.name}"</Text> which contains{" "}
                <Text strong>{pipelineToDelete.stages.length}</Text> stages.
              </Text>
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">
                  This action will permanently remove all associated data.
                </Text>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default Pipeline;
