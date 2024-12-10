"use client";
import Link from "next/link";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import styles from "./register.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import OTP from "../OTP/page";

const schema = Yup.object().shape({
  name: Yup.string()
    .min(6, "Tên đăng nhập phải có ít nhất 6 ký tự")
    .matches(/^[a-zA-Z0-9_]+$/, "Tên đăng nhập không hợp lệ")
    .required("Vui lòng nhập tên đăng nhập"),

  email: Yup.string()
    .email("Email không hợp lệ")
    .matches(/^[^_\s]+@[^_\s]+\.[^_\s]+$/, "Email không hợp lệ")
    .required("Vui lòng nhập email"),

  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!?])[A-Za-z\d@#$%^&*!?]{8,}$/,
      "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
    )
    .required("Vui lòng nhập mật khẩu"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Mật khẩu không khớp")
    .required("Vui lòng xác nhận mật khẩu"),

  // image: Yup.mixed()
  //   .required("Vui lòng chọn file hình ảnh")
  //   .test("fileSize", "File quá lớn, vui lòng chọn file nhỏ hơn 2MB", (value) => {
  //     return value && value.size <= 2000000; // 2MB
  //   })
  //   .test("fileType", "Định dạng file không hợp lệ", (value) => {
  //     return value && ["image/jpg", "image/jpeg", "image/png", "image/webp", "image/gif"].includes(value.type);
  //   }),
});

export default function Register() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      // image: null,
    },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const res = await fetch("http://localhost:5000/users/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ten_dang_nhap: values.name,
            email: values.email,
            mat_khau: values.password,
            nhap_lai_mat_khau: values.confirmPassword,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          if (res.status === 400 && errorData.message === "Email đã tồn tại") {
            setFieldError("email", "Email đã tồn tại");
          } else {
            throw new Error(errorData.message || "Đăng ký thất bại");
          }
        } else {
          Swal.fire({
            icon: "success",
            title: "Đăng ký thành công",
            text: "Vui lòng kiểm tra email để xác nhận mã OTP",
          }).then(() => {
            setIsModalOpen(true); // mở modal xác thực OTP khi xác thực thành công
          });
        }
      } catch (error) {
        setFieldError("general", error.message);
      } finally {
        setSubmitting(false);
      }
    },
  });
  const handleLoginSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    try {
      const response = await fetch("http://localhost:5000/users/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      document.cookie = `token=${data.token}; path=/; max-age=${60 * 60}`;

      Swal.fire({
        title: "Đăng nhập thành công",
        text: "Chào mừng bạn đến với Website!",
        icon: "success",
        showConfirmButton: true,
      }).then(() => {
        window.location.href = "http://localhost:3001";
      });
    } catch (error) {
      Swal.fire({
        title: "Đăng nhập thất bại",
        text: error.message || "Vui lòng thử lại.",
        icon: "error",
        showConfirmButton: true,
      });
    }
  };

  const handleLoginFailure = () => {
    Swal.fire({
      title: "Đăng nhập thất bại",
      text: "Có lỗi xảy ra vui lòng thử lại.",
      icon: "error",
      showConfirmButton: true,
    });
  };

  // Hàm để đổi trạng thái ẩn/hiện mật khẩu
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
        <div className={styles.heading}>Đăng ký</div>
        <form onSubmit={formik.handleSubmit} className={styles.form}>
          <input
            type="text"
            className={`${styles.input} ${formik.errors.name ? styles.inputError : ""}`}
            id="name"
            name="name"
            onChange={formik.handleChange}
            value={formik.values.name}
            placeholder="Tên đăng nhập"
          />
          {formik.errors.name && <p className={styles.error}>{formik.errors.name}</p>}

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

          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              className={`${styles.input} ${formik.errors.password ? styles.inputError : ""}`}
              id="password"
              name="password"
              onChange={formik.handleChange}
              value={formik.values.password}
              placeholder="Mật khẩu"
            />
            <div className={styles.togglePasswordIcon} onClick={togglePasswordVisibility}>
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </div>
          </div>
          {formik.errors.password && <p className={styles.error}>{formik.errors.password}</p>}

          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              className={`${styles.input} ${formik.errors.confirmPassword ? styles.inputError : ""}`}
              id="confirmPassword"
              name="confirmPassword"
              onChange={formik.handleChange}
              value={formik.values.confirmPassword}
              placeholder="Nhâp lại mật khẩu"
            />
            <div className={styles.togglePasswordIcon} onClick={togglePasswordVisibility}>
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </div>
          </div>
          {formik.errors.confirmPassword && <p className={styles.error}>{formik.errors.confirmPassword}</p>}

          {/* <input
            type="file"
            className={`${styles.input} ${formik.errors.image ? styles.inputError : ""}`}
            id="image"
            name="image"
            onChange={(event) => {
              formik.setFieldValue("image", event.currentTarget.files[0]);
            }}
          />
          {formik.errors.image && <p className={styles.error}>{formik.errors.image}</p>} */}

          <input type="submit" className={styles.loginButton} value="Đăng ký" />
          <OTP isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} />
        </form>
        {!isModalOpen && (
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
            <div className={styles.socialAccountContainer}>
              <span className={styles.title}>Đăng nhập với</span>

              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onFailure={handleLoginFailure}
                render={(renderProps) => (
                  <div className={styles.socialAccounts}>
                    <button
                      className={styles.socialButton}
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    ></button>
                  </div>
                )}
              />
            </div>
          </GoogleOAuthProvider>
        )}
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
