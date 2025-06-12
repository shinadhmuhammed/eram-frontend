import React, { useState, useRef, useEffect } from "react";
import { Modal, Input, Button, Typography, Space, message } from "antd";
import {
  useVerifyAdminLoginOtpMutation,
  useVerifyUpdateProfileMutation,
} from "../../Slices/SuperAdmin/SuperAdminApis.js";
import { useSnackbar } from "notistack"; 

import { CloseOutlined, SafetyCertificateOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const SuperAdminOtpModal = ({
  visible,
  onCancel,
  email,
  onVerifySuccess,
  mode = "login",
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const inputRefs = useRef([]);
  const timerRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar(); 

  const [verifyAdminLoginOtp, { isLoading }] = useVerifyAdminLoginOtpMutation();
  const [verifyUpdateOtp] = useVerifyUpdateProfileMutation();

  useEffect(() => {
    if (visible) {
      startResendTimer();
      if (inputRefs.current[0]) {
        setTimeout(() => {
          inputRefs.current[0].focus();
        }, 100);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [visible]);

  const startResendTimer = () => {
    setResendTimer(180);
    setIsResendDisabled(true);

    timerRef.current = setInterval(() => {
      setResendTimer((prevTimer) => {
        if (prevTimer <= 1) {
          setIsResendDisabled(false);
          clearInterval(timerRef.current);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");

    if (pastedData.length === 6) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async () => {
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      message.error("Please enter complete 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      const otpData = {
        email,
        otp: otpString,
      };

      let response;

      if (mode === "login") {
        response = await verifyAdminLoginOtp(otpData).unwrap();
        console.log(response, "OTP verification response");
        message.success("Login OTP verified successfully!");
      } else if (mode === "updateProfile") {
        response = await verifyUpdateOtp(otpData).unwrap();
        message.success("Profile update OTP verified successfully!");
      } else {
        throw new Error("Invalid OTP verification mode");
      }

      if (onVerifySuccess) {
        onVerifySuccess(response);
      }

      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } catch (error) {
      console.error("OTP verification failed:", error);
      enqueueSnackbar(
        error?.data?.message ||
          error?.message ||
          "Invalid OTP. Please try again.",
        {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 3000,
        }
      );
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      // You might want to create a separate resend OTP API for super admin
      // For now, we can show a message to contact administrator
      message.info("Please contact system administrator to resend OTP");
      startResendTimer();
    } catch (error) {
      console.error("Resend OTP failed:", error);
      message.error("Failed to resend OTP. Please contact administrator.");
    }
  };

  const handleCancel = () => {
    setOtp(["", "", "", "", "", ""]);
    setResendTimer(0);
    setIsResendDisabled(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    onCancel();
  };

  const maskedEmail = email
    ? `${email.substring(0, 2)}**${email.substring(email.indexOf("@"))}`
    : "";

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      centered
      width="90%"
      style={{ maxWidth: 480 }}
      closable={true}
      closeIcon={
        <CloseOutlined className="text-gray-400 hover:text-gray-600" />
      }
      maskClosable={false}
      className="ant-modal-custom"
      bodyStyle={{
        padding: "clamp(20px, 5vw, 40px) clamp(16px, 4vw, 24px)",
        borderRadius: "16px",
      }}
    >
      <div className="text-center">
        {/* Super Admin Icon */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "linear-gradient(135deg,  #da2c46 70%, #a51632 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              color: "white",
            }}
          >
            <SafetyCertificateOutlined />
          </div>
        </div>

        <Title
          level={3}
          className="text-gray-900 mb-2 font-semibold"
          style={{ fontSize: "clamp(18px, 4vw, 24px)" }}
        >
          Super Admin Verification
        </Title>

        <Text
          type="secondary"
          className="block mb-8 font-medium text-gray-400"
          style={{ fontSize: "clamp(12px, 3vw, 14px)" }}
        >
          We have sent a 6-digit security code to {maskedEmail}
          <br />
          <span style={{ color: "#f5222d", fontSize: "12px" }}>
            This OTP expires in {formatTime(resendTimer)}
          </span>
        </Text>

        <Space direction="vertical" size={24} className="w-full">
          <div className="flex justify-center">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                maxLength={1}
                className="text-center"
                style={{
                  width: 60,
                  height: 56,
                  borderRadius: "12px",
                  fontSize: "18px",
                  padding: 0,
                  fontWeight: "bold",
                  borderColor: "#da2c46",
                  backgroundColor: "#fff",
                  textAlign: "center",
                  marginRight: index < 5 ? "4px" : "0",
                }}
              />
            ))}
          </div>

          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading || isLoading}
            className="w-full"
            style={{
              height: "clamp(24px, 8vw, 36px)",
              fontSize: "clamp(13px, 3vw, 14px)",
              background: "linear-gradient(135deg,  #da2c46 70%, #a51632 100%)",
              border: "none",
              fontWeight: "600",
            }}
          >
            Verify Super Admin Access
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default SuperAdminOtpModal;
