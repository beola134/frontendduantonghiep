"use client";
import { useState, useEffect } from "react";
import styles from "../user.module.css";
import Link from "next/link";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

const User = ({ params }) => {
  const { id } = params;
  const [userData, setUserData] = useState({
    ten_dang_nhap: "",
    ho_ten: "",
    email: "",
    dia_chi: "",
    dien_thoai: "",
    hinh_anh: "",
  });
  const [orderShow, setOrderShow] = useState([]);
  const [ShowLichsu, setShowLichsu] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [passwordData, setPasswordData] = useState({
    mat_khau: "",
    mat_khau_moi: "",
    xac_nhan_mat_khau: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const savedTab = localStorage.getItem("activeTab");
      if (savedTab) {
        setActiveTab(savedTab);
      }
    }
  }, [mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("activeTab", activeTab);
    }
  }, [activeTab, mounted]);

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

  useEffect(() => {
    if (activeTab === "orderShow") {
      const fetchOrderShow = async () => {
        try {
          const res = await fetch(`http://localhost:5000/donhang/show/${id}`);
          const data = await res.json();
          if (data.orders && Array.isArray(data.orders)) {
            setOrderShow(data.orders);
          } else {
            setOrderShow([]);
          }
        } catch (error) {
          console.error("Lỗi khi lấy lịch sử đơn hàng:", error);
          setOrderShow([]);
        }
      };
      fetchOrderShow();
    }
  }, [activeTab, id]);

  const fetchShowLichsu = async () => {
    try {
      const res = await fetch(`http://localhost:5000/donhang/history/${id}`);
      const data = await res.json();
      if (data.donHangs && Array.isArray(data.donHangs)) {
        setShowLichsu(data.donHangs);
      } else {
        setShowLichsu([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử đơn hàng:", error);
      setShowLichsu([]);
    }
  };

  useEffect(() => {
    if (activeTab === "ShowLichsu") {
      fetchShowLichsu();
    }
  }, [activeTab, id]);
  const fetchOrderShow = async () => {
    try {
      const res = await fetch(`http://localhost:5000/donhang/show/${id}`);
      const data = await res.json();
      if (data.orders && Array.isArray(data.orders)) {
        setOrderShow(data.orders);
      } else {
        setOrderShow([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử đơn hàng:", error);
      setOrderShow([]);
    }
  };

  useEffect(() => {
    if (activeTab === "orderShow") {
      fetchOrderShow();
    }
  }, [activeTab, id]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "orderShow") {
      fetchOrderShow();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleFileChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("ten_dang_nhap", userData.ten_dang_nhap);
    formData.append("ho_ten", userData.ho_ten);
    formData.append("email", userData.email);
    formData.append("dia_chi", userData.dia_chi);
    formData.append("dien_thoai", userData.dien_thoai);
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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { mat_khau, mat_khau_moi, xac_nhan_mat_khau } = passwordData;

    if (mat_khau_moi !== xac_nhan_mat_khau) {
      Swal.fire({
        title: "Lỗi",
        text: "Mật khẩu mới và xác nhận mật khẩu không khớp",
        icon: "error",
        confirmButtonText: "OK",
      });
      setIsSubmitting(false);
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/users/changepassword`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userData.email,
          mat_khau,
          mat_khau_moi,
          xac_nhan_mat_khau,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          title: "Thành công",
          text: data.message,
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          localStorage.setItem("activeTab", "changePassword");

          window.location.reload();
        });
      } else {
        Swal.fire({
          title: "Thất bại",
          text: data.message,
          icon: "error",
          confirmButtonText: "Thử lại",
        });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      Swal.fire({
        title: "Lỗi",
        text: "Có lỗi xảy ra, vui lòng thử lại.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }

    setIsSubmitting(false);
  };
  {
    /*useEffect(() => {
    const savedTab = localStorage.getItem("activeTab");
    if (savedTab) {
      setActiveTab(savedTab); 
    }
  }, []);*/
  }
  {
    /*Đăng xuất*/
  }
  const handleLayout = () => {
    Cookies.remove("token");
    Swal.fire({
      title: "Đăng xuất thành công",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      window.location.href = "/";
    });
  };

  const huyDonHang = async (id) => {
    Swal.fire({
      title: "Xác nhận thay đổi trạng thái",
      text: `Bạn có chắc chắn muốn chuyển trạng thái thành "Đơn hàng đã hủy"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `http://localhost:5000/donhang/update/${id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ trang_thai: "Đơn hàng đã hủy" }),
            }
          );

          if (!response.ok) {
            throw new Error(`Lỗi khi cập nhật: ${response.statusText}`);
          }
          Swal.fire({
            title: "Thành công",
            text: `Đơn hàng đã được hủy thành công.`,
            icon: "success",
          }).then(() => {
            setActiveTab("ShowLichsu");
            fetchShowLichsu();
          });
        } catch (error) {
          Swal.fire({
            title: "Lỗi",
            text: `Không thể cập nhật trạng thái. Vui lòng thử lại.`,
            icon: "error",
          });
          console.error("Lỗi khi cập nhật trạng thái:", error);
        }
      }
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
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
        <h3>
          <strong>Tài Khoản Của Tôi</strong>
        </h3>
        <div className={styles.Menu}>
          <p>
            <span
              style={{ cursor: "pointer" }}
              onClick={() => handleTabClick("profile")}>
              Hồ Sơ
            </span>
          </p>
          <p>
            <span
              style={{ cursor: "pointer" }}
              onClick={() => handleTabClick("ShowLichsu")}>
              Lịch sử mua hàng
            </span>
          </p>

          <p>
            <span
              style={{ cursor: "pointer" }}
              onClick={() => handleTabClick("orderShow")}>
              Trạng thái đơn hàng
            </span>
          </p>
          <p>
            <span
              style={{ cursor: "pointer" }}
              onClick={() => handleTabClick("changePassword")}>
              Đổi mật khẩu
            </span>
          </p>

          <p style={{ cursor: "pointer" }}>
            <Link href={""} onClick={handleLayout}>
              Đăng xuất
            </Link>
          </p>
        </div>
      </div>
      <div className={styles.profileContent}>
        {activeTab === "profile" && (
          <div>
            <p
              style={{
                fontSize: "22px",
                color: "black",
                marginBottom: "15px",
                textAlign: "center",
              }}>
              Hồ Sơ Người Dùng
            </p>
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
              <div className={styles.formGroup}>
                <label htmlFor="adress">Địa chỉ:</label>
                <input
                  type="text"
                  id="dia_chi"
                  name="dia_chi"
                  value={userData.dia_chi}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="phone">Số điện thoại:</label>
                <input
                  type="text"
                  id="dien_thoai"
                  name="dien_thoai"
                  value={userData.dien_thoai}
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
                      onClick={handleSave}
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
        )}
        {activeTab === "ShowLichsu" && (
          <div className={styles.ShowLichsu}>
            <h2>Lịch sử mua hàng</h2>
            {ShowLichsu.length > 0 ? (
              <ul>
                {ShowLichsu.map((order) => (
                  <li key={order._id}>
                    <div className={styles.orderHeader}>
                      <p>Mã Đơn Hàng: {order._id}</p>
                      <span className={styles.trh}>{order.trang_thai}</span>
                    </div>

                    <p>
                      Thời gian đặt hàng:{" "}
                      {new Date(order.thoi_gian_tao).toLocaleString("vi-VN", {
                        timeZone: "Asia/Ho_Chi_Minh",
                      })}
                    </p>

                    {order.chiTietDonHangs.map((detail) => (
                      <div key={detail._id} className={styles.productCard}>
                        <img
                          src={`http://localhost:5000/images/${detail.product.hinh_anh}`}
                          alt={detail.product.ten}
                          className={styles.productImage}
                        />
                        <div className={styles.productInfo}>
                          <br></br>
                          <p className={styles.productName}>
                            {detail.product.ten}
                          </p>
                          <br></br>
                          <p>
                            Số lượng: <strong>{detail.so_luong}</strong>
                          </p>
                          <p style={{ float: "right" }}>
                            Giá:{" "}
                            <strong>
                              {detail.product.gia_giam.toLocaleString("vi-VN")}₫
                            </strong>
                          </p>
                        </div>
                      </div>
                    ))}

                    <div className={styles.orderSummary}>
                      <p>Tổng Giá Trị:</p>
                      <span className={styles.summaryValue}>
                        {order.tong_tien.toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Bạn chưa có đơn hàng.</p>
            )}
          </div>
        )}

        {activeTab === "orderShow" && (
          <div className={styles.orderShow}>
            <h2>Trạng thái đơn hàng</h2>
            {orderShow.length > 0 ? (
              <ul>
                {orderShow.map((order) => (
                  <li key={order.id}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}>
                      <p>Mã Đơn Hàng: {order._id}</p>
                      <span className={styles.trh}>{order.trang_thai}</span>
                    </div>

                    <p>
                      Thời gian đặt hàng:{" "}
                      {new Date(order.thoi_gian_tao).toLocaleString("vi-VN", {
                        timeZone: "Asia/Ho_Chi_Minh",
                      })}
                    </p>
                    <p>Địa chỉ: {order.dia_chi}</p>
                    <table className={styles.orderTable}>
                      <thead>
                        <tr>
                          <th>Tên Sản Phẩm</th>
                          <th> Hình Ảnh</th>
                          <th>Số Lượng</th>
                          <th>Giá</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.chiTietDonHangs.map((detail) => (
                          <tr key={detail._id}>
                            <td>{detail.product.ten}</td>
                            <td>
                              <img
                                src={`http://localhost:5000/images/${detail.product.hinh_anh}`}
                                alt={detail.gia_giam}
                                style={{ width: "50px", height: "auto" }}
                              />
                            </td>
                            <td>{detail.so_luong}</td>
                            <td>
                              {detail.product.gia_giam.toLocaleString("vi-VN")}₫
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <p>
                      Phí Ship:
                      <span
                        style={{
                          margin: "0px 5px",
                          color: "black",
                        }}>
                        <strong>{order.phi_ship}₫</strong>
                      </span>{" "}
                    </p>
                    <div className={styles.cancel}>
                      <p>
                        Tổng Thanh Toán:
                        <span
                          style={{
                            fontSize: "20px",
                            margin: "0px 5px",
                            color: "red",
                          }}>
                          <strong>
                            {order.tong_tien.toLocaleString("vi-VN")}₫
                          </strong>
                        </span>
                      </p>
                      {order.trang_thai === "Chờ xác nhận" && (
                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            huyDonHang(order._id, "Đơn hàng đã hủy")
                          }>
                          Hủy đơn hàng
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Bạn chưa có đơn hàng.</p>
            )}
          </div>
        )}
        {activeTab === "changePassword" && (
          <div>
            <p
              style={{
                fontSize: "22px",
                color: "black",
                marginBottom: "15px",
                textAlign: "center",
              }}>
              Đổi Mật Khẩu
            </p>
            <form onSubmit={handleSubmitPasswordChange}>
              <div className={styles.formGroup}>
                <label htmlFor="mat_khau">Mật khẩu cũ:</label>
                <input
                  type="password"
                  id="mat_khau"
                  name="mat_khau"
                  value={passwordData.mat_khau}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="mat_khau_moi">Mật khẩu mới:</label>
                <input
                  type="password"
                  id="mat_khau_moi"
                  name="mat_khau_moi"
                  value={passwordData.mat_khau_moi}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="xac_nhan_mat_khau">
                  Xác nhận mật khẩu mới:
                </label>
                <input
                  type="password"
                  id="xac_nhan_mat_khau"
                  name="xac_nhan_mat_khau"
                  value={passwordData.xac_nhan_mat_khau}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className={styles.pro}>
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Đang xử lý..." : "Đổi Mật Khẩu"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default User;
