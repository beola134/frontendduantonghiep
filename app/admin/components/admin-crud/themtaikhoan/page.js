"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import styles from "./themtaikhoan.module.css";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function ThemUser() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const role = 1; // Fixed role for admin

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Validate required fields
    if (!username || !password || !email || !fullName || !address || !phone) {
      Swal.fire({
        icon: "warning",
        title: "Thiếu thông tin",
        text: "Vui lòng nhập đầy đủ thông tin!",
      });
      return;
    }

    const formData = new FormData();
    formData.append("ten_dang_nhap", username);
    formData.append("mat_khau", password); // You may want to hash this on the server
    formData.append("email", email);
    formData.append("ho_ten", fullName);
    formData.append("dia_chi", address);
    formData.append("dien_thoai", phone);
    formData.append("quyen", role);
    formData.append("hinh_anh", image);

    try {
      const response = await fetch("http://localhost:5000/users/addUser", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Thêm quản trị viên thành công!",
        }).then(() => {
          router.push("/components/taikhoan");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Có lỗi xảy ra!",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Có lỗi xảy ra!",
      });
    }
  };

  return (
    <>
      <div className={styles.SidebarContainer}>
        <section id={styles.content}>
          <div className={styles.header1}>
            <div className={styles.title} style={{ fontWeight: "bold" }}>
              Thêm Người Dùng Admin
            </div>
          </div>
          <div className={styles.bg}>
            <form onSubmit={handleSubmit}>
              <div className={styles.container1}>
                <div className={styles.formGroup}>
                  <label htmlFor="username">Tên đăng nhập</label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="password">Mật khẩu</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="fullName">Họ và tên</label>
                  <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="address">Địa chỉ</label>
                  <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="phone">Điện thoại</label>
                  <input
                    type="text"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="image">Hình ảnh</label>
                  <input
                    type="file"
                    id="image"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </div>
                {errorMessage && (
                  <div className="alert alert-danger">{errorMessage}</div>
                )}
                <button type="submit" className="btn btn-outline-primary">
                  Thêm
                </button>
                <button type="button" className="btn btn-outline-secondary">
                  Hủy bỏ
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </>
  );
}
