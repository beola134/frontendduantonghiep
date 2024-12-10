import { useState, useEffect } from "react";
import styles from "./otp.module.css";
import Swal from "sweetalert2";

function OtpModal({ isOpen, onRequestClose }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChangeOtp = (index, value) => {
    if (!/^[0-9]*$/.test(value)) return; // chỉ nhận ký tự số
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // chỉ cho phép nhập 1 ký tự
    setOtp(newOtp);

    // Tự động chuyển sang ô tiếp theo hoặc quay lại ô trước đó
    if (index < otp.length - 1 && value) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
    // xoá ô nếu nhấn backspace
    if (index > 0 && !value) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  // Xử lý sự kiện dán mã OTP từ clipboard

  const handlePaste = (e) => {
    const pastedValue = e.clipboardData.getData("Text");
    // Lọc chỉ lấy số từ dữ liệu dán vào
    const otpValue = pastedValue.replace(/\D/g, "").slice(0, 6); // Giới hạn tối đa 6 chữ số
    const newOtp = otpValue.split("");
    while (newOtp.length < 6) newOtp.push(""); // Đảm bảo rằng có đủ 6 ô
    setOtp(newOtp);
  };

  const handleSubmit = async () => {
    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      setError("Vui lòng nhập đủ 6 ký tự");
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/users/verifyotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp: otpValue }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Xác thực OTP thất bại");
      }

      Swal.fire({
        icon: "success",
        title: "Xác thực thành công",
        text: "Chuyển hướng đến trang đăng nhập",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        onRequestClose();
        window.location.href = "/components/components-login/login";
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeLeft(180); // Đặt lại thời gian 3 phút mỗi khi mở modal
    }
  }, [isOpen]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div
        className={styles.modal}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}>
        <h3 className={styles.title}>Xác thực OTP</h3>
        <p className={styles.description}>
          Vui lòng nhập mã OTP vừa gửi tới gmail
        </p>
        <div className={styles.otpContainer} onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChangeOtp(index, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !otp[index]) {
                  document.getElementById(`otp-input-${index - 1}`).focus();
                }
              }}
              className={styles.otpInput}
            />
          ))}
        </div>
        <div className={styles.timerContainer}>
          <span>
            Mã sẽ hết hạn: {Math.floor(timeLeft / 60)}:
            {("0" + (timeLeft % 60)).slice(-2)}
          </span>
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.cancelButton} onClick={onRequestClose}>
            Hủy Bỏ
          </button>
          <button
            className={styles.confirmButton}
            onClick={handleSubmit}
            disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Xác Nhận"}
          </button>
        </div>
        {error && <div className={styles.errorMessage}>{error}</div>}
      </div>
    </div>
  );
}

export default function OTP({ isOpen, onRequestClose }) {
  return <OtpModal isOpen={isOpen} onRequestClose={onRequestClose} />;
}
