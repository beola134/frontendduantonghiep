"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./taikhoan.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import "jspdf-autotable";
import RobotoRegular from "./Roboto-Regular.base64";

export default function TaiKhoan() {
  const [users, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayUsers, setDisplayUsers] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  //tìm kiếm
  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };
  const handleSearch = (e) => {
    const query = removeAccents(searchQuery.toLowerCase());
    const filtered = users.filter((user) => {
      const userName = user.ho_ten || "";
      const phone = user.dien_thoai || "";
      const email = user.email || "";
      const role = user.quyen === 1 ? "quản trị viên" : user.quyen === 2 ? "khách hàng" : "";
      return (
        removeAccents(userName.toLowerCase()).includes(query) ||
        removeAccents(phone.toLowerCase()).includes(query) ||
        removeAccents(email.toLowerCase()).includes(query) ||
        removeAccents(role.toLowerCase()).includes(query)
      );
    });

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch(removeAccents(searchQuery.toLowerCase()));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, users, itemsPerPage]);

  //cập nhật quyền người dùng
  const handleRoleChange = async (id, newRole) => {
    try {
      const response = await fetch(`http://localhost:5000/users/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quyen: newRole }),
      });
      if (!response.ok) throw new Error("Lỗi khi cập nhật chức vụ");

      setUser((prevUsers) => prevUsers.map((user) => (user._id === id ? { ...user, quyen: newRole } : user)));

      Swal.fire({
        title: "Thành công",
        text: "Chức vụ đã được cập nhật!",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      Swal.fire({
        title: "Lỗi",
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  //phân trang
  useEffect(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const dataToShow = searchQuery ? filteredUsers : users;
    setDisplayUsers(dataToShow.slice(start, end));
  }, [filteredUsers, users, itemsPerPage, currentPage, searchQuery]);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
    Swal.fire({
      title: "Đã cập nhật",
      text: `Giới hạn hiển thị đã được thay đổi thành ${e.target.value} mục.`,
      icon: "success",
      confirmButtonText: "OK",
    });
  };

  const totalPages = Math.ceil((searchQuery ? filteredUsers.length : users.length) / itemsPerPage);

  const uploadFile = () => {
    Swal.fire({
      title: "Chưa khả dụng",
      text: "Tính năng tải file chưa được triển khai!",
      icon: "info",
      confirmButtonText: "OK",
    });
  };

  const printData = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const copyData = () => {
    if (typeof document !== "undefined") {
      const table = document.getElementById("productTable");
      const range = document.createRange();
      range.selectNode(table);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.execCommand("copy");

      Swal.fire({
        title: "Thành công",
        text: "Dữ liệu đã được sao chép!",
        icon: "success",
        confirmButtonText: "OK",
      });
    }
  };

  //xuất excel
  const exportToExcel = async () => {
    Swal.fire({
      title: "Xác nhận",
      text: "Bạn có chắc chắn muốn xuất dữ liệu ra file Excel?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Xuất",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet("Danh sách tài khoản");
          worksheet.columns = [
            { header: "ID tài khoản", key: "_id", width: 20 },
            { header: "Họ và tên", key: "ho_ten", width: 25 },
            { header: "Địa chỉ", key: "dia_chi", width: 30 },
            { header: "Email", key: "email", width: 40 },
            { header: "Số điện thoại", key: "dien_thoai", width: 20 },
            { header: "Chức vụ", key: "quyen", width: 20 },
          ];

          // Thiết lập định dạng cho dòng tiêu đề
          worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true, color: { argb: "FFFFFF" } };
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "0070C0" },
            };
            cell.alignment = { vertical: "middle", horizontal: "center" };
          });

          // Lặp qua dữ liệu users và thêm vào Excel
          users.forEach((user) => {

            // Thêm dòng vào worksheet
            worksheet.addRow({
              _id: user._id || "N/A",
              ho_ten: user.ho_ten || "N/A",
              dia_chi: user.dia_chi || "N/A",
              email: user.email || "N/A",
              dien_thoai: user.dien_thoai || "N/A",
              quyen: user.quyen === "1" ? "Quản trị viên" : "Khách hàng",
            });
          });

          // Thiết lập border cho các ô
          worksheet.eachRow((row) => {
            row.eachCell((cell) => {
              cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
              };
            });
          });
          // Tạo file Excel và tải về
          const buffer = await workbook.xlsx.writeBuffer();
          const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "danh_sach_tai_khoan.xlsx";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          Swal.fire({
            title: "Thành công",
            text: "Dữ liệu đã được xuất ra file Excel!",
            icon: "success",
            confirmButtonText: "OK",
          });
        } catch (error) {
          console.error("Lỗi khi xuất Excel:", error);
          Swal.fire({
            title: "Lỗi",
            text: "Không thể xuất file Excel. Vui lòng thử lại!",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    });
  };


//xuất pdf
const exportToPDF = () => {
  Swal.fire({
    title: "Xác nhận",
    text: "Bạn có chắc chắn muốn xuất dữ liệu ra file PDF?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Xuất",
    cancelButtonText: "Hủy",
  }).then((result) => {
    if (result.isConfirmed) {
      try {
        const doc = new jsPDF();
        doc.addFileToVFS("Roboto-Regular.ttf", RobotoRegular);
        doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
        doc.setFont("Roboto");
        doc.setFontSize(18);
        doc.text("Danh sách tài khoản", 14, 20);
        const rows = [];
        const headers = [
          "ID tài khoản",
          "Họ và tên",
          "Địa chỉ",
          "Email",
          "Số điện thoại",
          "Chức vụ",
        ];
        users.forEach((user) => {
          const id = user._id || "N/A";
          const hoTen = user.ho_ten || "N/A";
          const diaChi = user.dia_chi || "N/A";
          const email = user.email || "N/A";
          const dienThoai = user.dien_thoai || "N/A";
          const chucVu = user.quyen === "1" ? "Quản trị viên" : "Khách hàng";
          rows.push([id, hoTen, diaChi, email, dienThoai, chucVu]);
        });
        doc.autoTable({
          head: [headers],
          body: rows,
          startY: 30,
          theme: "grid",
          headStyles: { fillColor: [0, 112, 192], textColor: [255, 255, 255] },
          styles: { font: "Roboto", fontSize: 10 },
          columnStyles: {
            0: { cellWidth: 30 }, // ID tài khoản
            1: { cellWidth: 30 }, // Họ và tên
            2: { cellWidth: 30 }, // Địa chỉ
            3: { cellWidth: 40 }, // Email
            4: { cellWidth: 20 }, // Số điện thoại
            5: { cellWidth: 30 }, // Chức vụ
          },
        });
        // Lưu file PDF
        doc.save("danh_sach_tai_khoan.pdf");
          Swal.fire({
            title: "Thành công",
            text: "Dữ liệu đã được xuất ra file PDF!",
            icon: "success",
            confirmButtonText: "OK",
          });
        } catch (error) {
          console.error("Lỗi khi xuất PDF:", error);
          Swal.fire({
            title: "Lỗi",
            text: "Không thể xuất file PDF. Vui lòng thử lại!",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    });
  };

  const deleteUser = async (id) => {
    const result = await Swal.fire({
      title: "Xác nhận",
      text: "Bạn có chắc chắn muốn xóa tài khoản này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:5000/users/delete/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Lỗi khi xóa tài khoản");
        }

        setUser((prevUsers) => prevUsers.filter((nguoi_dung) => nguoi_dung._id !== id));

        Swal.fire({
          title: "Thành công",
          text: "Tài khoản đã được xóa thành công!",
          icon: "success",
          confirmButtonText: "OK",
        });
      } catch (error) {
        Swal.fire({
          title: "Lỗi",
          text: error.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };
  //lấy dữ liệu danh sách tài khoản
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/users");
        if (!response.ok) {
          throw new Error("Lỗi không thể tải dữ liệu");
        }
        const data = await response.json();
        setUser(data.users);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div className={styles.SidebarContainer}>
      <section id={styles.content}>
        <div className={styles.header1}>
          <div className={styles.title} style={{ fontWeight: "bold" }}>
            Danh Sách Tài Khoản
          </div>
          <div className={styles.timestamp} id="timestamp"></div>
        </div>
        <div className={styles.bg}>
          <div className={styles.container}>
            <div className={styles.actions}>
              <Link href="/admin/components/admin-crud/themtaikhoan" className={styles.sp}>
                <i className="fas fa-plus"></i> Tạo mới tài khoản
              </Link>
              <div className={styles.buttonGroup}>
                &nbsp;
                <button className={styles.sp3} onClick={printData}>
                  <i className="fas fa-print"></i> In dữ liệu
                </button>
                &nbsp;
                <button className={styles.sp5} onClick={exportToExcel}>
                  &nbsp;
                  <i className="fas fa-file-excel"></i> Xuất Excel
                </button>
                &nbsp;
                <button className={styles.sp6} onClick={exportToPDF}>
                  <i className="fas fa-file-pdf"></i> Xuất PDF
                </button>
                &nbsp;
              </div>
            </div>

            <div className={styles.tableContainer}>
              <div className={styles.tableControls}>
                <label htmlFor="entries" style={{ fontWeight: "bold" }}></label>
                <div className={styles.search}>
                  <label htmlFor="search" style={{ fontWeight: "bold" }}>
                    Tìm kiếm:
                  </label>
                  <input
                    type="text"
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                    placeholder="Nhập tên người dùng..."
                  />
                </div>
              </div>
              {displayUsers.length > 0 ? (
                <table id="productTable" className={styles.productTable}>
                  <thead>
                    <tr>
                      <th style={{ width: "18%", textAlign: "center" }}>ID tài khoản</th>
                      <th style={{ width: "15%", textAlign: "center" }}>Họ và tên</th>
                      <th style={{ width: "12%", textAlign: "center" }}>Ảnh</th>
                      <th style={{ width: "10%", textAlign: "center" }}>Địa chỉ</th>
                      <th style={{ width: "18%", textAlign: "center" }}>Email</th>
                      <th style={{ width: "12%", textAlign: "center" }}>Số điện thoại</th>
                      <th style={{ width: "15%", textAlign: "center" }}>Chức vụ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayUsers.map((item) => (
                      <tr key={item._id}>
                        <td>{item._id}</td>
                        <td style={{ textAlign: "center" }}>
                          <p className={styles.mota}>{item.ho_ten}</p>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <img src={`http://localhost:5000/images/${item.hinh_anh}`} alt={item.danh_muc} />
                        </td>
                        <td style={{ textAlign: "center" }}>{item.dia_chi}</td>
                        <td style={{ textAlign: "center" }}> {item.email}</td>
                        <td style={{ textAlign: "center" }}>{item.dien_thoai}</td>
                        <td>
                          <p className={styles.chucvu}>
                            <select
                              style={{ textAlign: "center" }}
                              value={item.quyen}
                              onChange={(e) => handleRoleChange(item._id, Number(e.target.value))}
                              className={styles.roleSelect}
                            >
                              <option value="1">Quản trị viên</option>
                              <option value="2">Khách hàng</option>
                            </select>
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p
                  style={{
                    textAlign: "center",
                    marginTop: "20px",
                    fontStyle: "italic",
                    fontWeight: "bold",
                  }}
                >
                  Không tìm thấy dữ liệu cần tìm.
                </p>
              )}

              <div className={styles.pagination}>
                <span>
                  Hiện thị {displayUsers.length} của {filteredUsers.length || users.length} người dùng
                </span>
                <div className={styles.paginationControls}>
                  <button
                    className={styles.paginationButton}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    ‹
                  </button>
                  <button className={`${styles.paginationButton} ${styles.active}`}>
                    {` Trang ${currentPage} / ${totalPages}`}
                  </button>

                  <button
                    className={styles.paginationButton}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
