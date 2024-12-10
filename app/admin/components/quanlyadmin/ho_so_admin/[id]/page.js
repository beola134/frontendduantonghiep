"use client";
import { useState, useEffect } from "react";
import styles from "./ho_so_admin.module.css";
import Swal from "sweetalert2";

const ho_so_admin = ({ params }) => {
  const { id } = params;
  const [userData, setUserData] = useState({
    ten_dang_nhap: "",
    ho_ten: "",
    email: "",
    hinh_anh: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/users/${id}`);
        const data = await res.json();
        setUserData(data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleFileChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  const handleSave = async (e) => {
    const formData = new FormData();
    formData.append("ten_dang_nhap", userData.ten_dang_nhap);
    formData.append("ho_ten", userData.ho_ten);
    formData.append("email", userData.email);
    if (avatarFile) {
      formData.append("hinh_anh", avatarFile);
    }
    try {
      const res = await fetch(`http://localhost:5000/users/update/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        Swal.fire({
          title: "Thành công",
          text: "Cập nhật thông tin thành công",
          icon: "success",
          confirmButtonText: "OK",
        });
        setIsEditing(false);
        setAvatarFile(null);
      } else {
        Swal.fire({
          title: "Thất bại",
          text: "Cập nhật thông tin thất bại",
          icon: "error",
          confirmButtonText: "Thử lại",
        });
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      Swal.fire({
        title: "Lỗi",
        text: "Có lỗi xảy ra, vui lòng thử lại.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileContent}>
        <div>
          <p
            style={{
              fontSize: "22px",
              color: "black",
              marginBottom: "15px",
              textAlign: "center",
            }}>
            Hồ Sơ Admin
          </p>
          <div className={styles.profilePicture}>
            <img
              src={
                userData.hinh_anh.startsWith("http")
                  ? userData.hinh_anh
                  : `http://localhost:5000/images/${userData.hinh_anh}`
              }
              width="300"
              height="363"
              style={{ display: "inline-block", opacity: "1" }}
            />
          </div>
          <form>
            <div className={styles.formGroup}>
              <label htmlFor="username">Tên đăng nhập:</label>
              <input
                type="text"
                id="username"
                name="ten_dang_nhap"
                value={userData.ten_dang_nhap}
                onChange={handleChange}
                disabled
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="name">Họ và tên:</label>
              <input
                type="text"
                id="name"
                name="ho_ten"
                value={userData.ho_ten}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email:</label>
              <input
                type="text"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            {isEditing ? (
              <>
                <div className={styles.pro}>
                  <div className={styles.formGroup}>
                    <label htmlFor="avatar">Chọn ảnh đại diện:</label>
                    <input
                      type="file"
                      id="avatar"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                  <button
                    type="submit"
                    onClick={(e) => handleSave(e)}
                    className="save-button">
                    Cập nhật
                  </button>
                </div>
              </>
            ) : (
              <div className={styles.pro}>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="edit-button">
                  Chỉnh sửa
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ho_so_admin;
