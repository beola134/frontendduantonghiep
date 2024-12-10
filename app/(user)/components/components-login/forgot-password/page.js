"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import styles from "./forgot-password.module.css";
import Link from "next/link";
import Loading from "../../loading/page";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Email không hợp lệ")
    .matches(/^[^_\s]+@[^_\s]+\.[^_\s]+$/, "Email không hợp lệ")
    .required("Vui lòng nhập email"),
  otp: Yup.string()
    .min(6, "Mã OTP phải có ít nhất 6 ký tự số")
    .matches(/^[0-9]+$/, "Mã OTP chỉ được chứa các chữ số")
    .required("Vui lòng nhập mã OTP"),
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!?])[A-Za-z\d@#$%^&*!?]{8,}$/,
      "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
    )
    .required("Vui lòng nhập mật khẩu"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Mật khẩu không khớp")
    .required("Vui lòng xác nhận mật khẩu"),
});

export default function ForgotPassword() {
  const router = useRouter();
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formik = useFormik({
    initialValues: {
      email: "",
      otp: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: schema,
    onSubmit: async (values, { setFieldError }) => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/users/resetPasswordByOTP", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.email,
            otp: values.otp,
            mat_khau_moi: values.password,
            xac_nhan_mat_khau: values.confirmPassword,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          if (errorData.message.includes("Email không tồn tại")) {
            setFieldError("email", errorData.message);
          } else if (errorData.message.includes("Mã OTP không chính xác")) {
            setFieldError("otp", errorData.message);
          } else {
            setFieldError("general", errorData.message);
          }
          throw new Error(errorData.message || "Có lỗi xảy ra, vui lòng thử lại sau");
        }

        Swal.fire({
          icon: "success",
          title: "Đổi mật khẩu thành công",
          text: "Vui lòng đăng nhập để tiếp tục",
        }).then(() => {
          router.push("/components/components-login/login");
        });
      } catch (error) {
        setFieldError("general", error.message);
      } finally {
        setLoading(false);
      }
    },
  });

  // gửi mã otp
  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/users/sendOTPquenmk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formik.values.email,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || "Không thể gửi OTP, vui lòng thử lại");
        return;
      }

      Swal.fire({
        icon: "success",
        title: "OTP đã được gửi",
        text: "Vui lòng kiểm tra email của bạn để nhận OTP",
      });
      setIsOtpSent(true);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
        <div className={styles.heading}>Quên mật khẩu</div>
        <form onSubmit={formik.handleSubmit} className={styles.form}>
          <input
            type="email"
            className={`${styles.input} ${formik.errors.email ? styles.inputError : ""}`}
            id="email"
            name="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            placeholder="Email"
          />
          {formik.errors.email && <p className={styles.error}>{formik.errors.email}</p>}

          <div className={styles.inputWrapper}>
            <input
              type="text"
              className={`${styles.input} ${formik.errors.otp ? styles.inputError : ""}`}
              id="otp"
              name="otp"
              onChange={formik.handleChange}
              value={formik.values.otp}
              placeholder="OTP"
              disabled={!isOtpSent}
            />
            <p
              className={styles.GetOTP}
              onClick={handleSendOtp}
              style={{ cursor: loading || isOtpSent ? "not-allowed" : "pointer", color: isOtpSent ? "grey" : "blue" }}
            >
              {isOtpSent ? "OTP đã gửi" : "Gửi OTP"}
            </p>
          </div>
          {formik.errors.otp && <p className={styles.error}>{formik.errors.otp}</p>}

          <input
            type="password"
            className={`${styles.input} ${formik.errors.password ? styles.inputError : ""}`}
            id="password"
            name="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            placeholder="Mật khẩu mới"
            disabled={!isOtpSent}
          />
          {formik.errors.password && <p className={styles.error}>{formik.errors.password}</p>}

          <input
            type="password"
            className={`${styles.input} ${formik.errors.confirmPassword ? styles.inputError : ""}`}
            id="confirmPassword"
            name="confirmPassword"
            onChange={formik.handleChange}
            value={formik.values.confirmPassword}
            placeholder="Nhập lại mật khẩu mới"
            disabled={!isOtpSent}
          />
          {formik.errors.confirmPassword && <p className={styles.error}>{formik.errors.confirmPassword}</p>}

          {formik.errors.general && <p className={styles.error}>{formik.errors.general}</p>}

          <button type="submit" className={styles.loginButton} disabled={!isOtpSent || loading}>
            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
          </button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.signUpNow}>
          <span className={styles.dontHaveAnAccount}>
            Đã có tài khoản? &nbsp;
            <Link href="/components/components-login/login" id="gotoSignup">
              Đăng nhập ngay
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
