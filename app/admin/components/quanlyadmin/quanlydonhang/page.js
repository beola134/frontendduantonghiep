"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./donhang.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import "jspdf-autotable";
import RobotoRegular from "../taikhoan/Roboto-Regular.base64";

const statusOptions = ["Chờ xác nhận", "Đã xác nhận", "Đang giao hàng", "Giao hàng thành công", "Đơn hàng đã hủy"];

export default function DonHang() {
  const [displayDonhang, setDisplayDonhang] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [donHangs, setDonhang] = useState([]);
  const [nguoiDungMap, setNguoiDungMap] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredDonhangs, setFilteredDonhangs] = useState([]);
  //tìm kiếm
  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const handleSearch = (query) => {
    const filtered = donHangs.filter((donHang) => {
      const userName = nguoiDungMap[donHang.id_nguoi_dung]?.ho_ten || "";
      const phoneNumber = nguoiDungMap[donHang.id_nguoi_dung]?.dien_thoai || "";
      const trangThai = donHang.trang_thai || "";
      return (
        removeAccents(userName.toLowerCase()).includes(query) ||
        phoneNumber.includes(query) ||
        removeAccents(trangThai.toLowerCase()).includes(query)
      );
    });
    setFilteredDonhangs(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch(removeAccents(searchQuery.toLowerCase()));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, donHangs, itemsPerPage]);

  // phân trang
  useEffect(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const dataToShow = searchQuery ? filteredDonhangs : donHangs;
    setDisplayDonhang(dataToShow.slice(start, end));
  }, [filteredDonhangs, donHangs, itemsPerPage, currentPage, searchQuery]);

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

  const totalPages = Math.ceil((searchQuery ? filteredDonhangs.length : donHangs.length) / itemsPerPage);

  const uploadFile = () => {
    Swal.fire({
      title: "Chưa khả dụng",
      text: "Tính năng tải file chưa được triển khai!",
      icon: "info",
      confirmButtonText: "OK",
    });
  };

  const printData = () => {
    window.print();
  };

  const copyData = () => {
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
  };
  
  // Hàm xuất dữ liệu ra Excel
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
          const worksheet = workbook.addWorksheet("Danh sách đơn hàng");
          worksheet.columns = [
            { header: "ID đơn hàng", key: "_id", width: 20 },
            { header: "Địa chỉ", key: "dia_chi", width: 25 },
            { header: "Tên khách hàng", key: "ho_ten", width: 20 },
            { header: "Số điện thoại", key: "dien_thoai", width: 15 },
            { header: "Ghi chú", key: "ghi_chu", width: 40 },
            { header: "Ngày mua", key: "thoi_gian_tao", width: 15 },
            { header: "Tổng tiền", key: "tong_tien", width: 15 },
            { header: "Tình trạng", key: "trang_thai", width: 20 },
          ];
          worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true, color: { argb: "FFFFFF" } };
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "0070C0" },
            };
            cell.alignment = { vertical: "middle", horizontal: "center" };
          });

          await Promise.all(
            donHangs.map(async (item) => {
              const hoTen =
                nguoiDungMap[item.id_nguoi_dung]?.ho_ten || "Đang tải...";
              const dienThoai =
                nguoiDungMap[item.id_nguoi_dung]?.dien_thoai || "Đang tải...";
              const thoiGianTao = item.thoi_gian_tao
                ? new Intl.DateTimeFormat("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }).format(new Date(item.thoi_gian_tao))
                : "N/A";
              const tinhTrang =
                statusOptions.find((status) => status === item.trang_thai) ||
                item.trang_thai;
              // Thêm dòng vào worksheet
              worksheet.addRow({
                _id: item._id || "N/A",
                dia_chi: item.dia_chi || "N/A",
                ho_ten: hoTen,
                dien_thoai: dienThoai,
                ghi_chu: item.ghi_chu || "N/A",
                thoi_gian_tao: thoiGianTao,
                tong_tien: item.tong_tien
                  ? item.tong_tien.toLocaleString("vi-VN") + "₫"
                  : "0₫",
                trang_thai: tinhTrang,
              });
            })
          );

     
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

          const buffer = await workbook.xlsx.writeBuffer();
          const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "danh_sach_don_hang.xlsx";
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



  // Hàm xuất dữ liệu ra PDF
 const exportToPDF = async () => {
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
        doc.text("Danh sách đơn hàng", 14, 20);

        const headers = [
          "ID đơn hàng",
          "Địa chỉ",
          "Tên khách hàng",
          "Số điện thoại",
          "Ghi chú",
          "Ngày mua",
          "Tổng tiền",
          "Tình trạng",
        ];
        const rows = [];
        donHangs.forEach((item) => {
          const hoTen = nguoiDungMap[item.id_nguoi_dung]?.ho_ten || "Đang tải...";
          const dienThoai = nguoiDungMap[item.id_nguoi_dung]?.dien_thoai || "Đang tải...";
          const thoiGianTao = item.thoi_gian_tao
            ? new Intl.DateTimeFormat("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }).format(new Date(item.thoi_gian_tao))
            : "N/A";
          const tinhTrang =
            statusOptions.find((status) => status === item.trang_thai) || item.trang_thai;
          rows.push([
            item._id || "N/A",
            item.dia_chi || "N/A",
            hoTen,
            dienThoai,
            item.ghi_chu || "N/A",
            thoiGianTao,
            item.tong_tien
              ? item.tong_tien.toLocaleString("vi-VN") + "₫"
              : "0₫",
            tinhTrang,
          ]);
        });
        doc.autoTable({
          head: [headers],
          body: rows,
          startY: 30,
          theme: "grid",
          headStyles: {
            fillColor: [0, 112, 192],
            textColor: [255, 255, 255],
          },
          styles: { font: "Roboto", fontSize: 10 },
          columnStyles: {
            0: { cellWidth: 25 }, // ID đơn hàng
            1: { cellWidth: 20 }, // Địa chỉ
            2: { cellWidth: 30 }, // Tên khách hàng
            3: { cellWidth: 23 }, // Số điện thoại
            4: { cellWidth: 15 }, // Ghi chú
            5: { cellWidth: 25 }, // Ngày mua
            6: { cellWidth: 30 }, // Tổng tiền
            7: { cellWidth: 27 }, // Tình trạng
          },
        });

        // Lưu file PDF
        doc.save("danh_sach_don_hang.pdf");

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


  //lấy dữ liệu danh sách đơn hàng
  useEffect(() => {
    const fetchDonhang = async () => {
      try {
        const response = await fetch("http://localhost:5000/donhang/showAll");
        if (!response.ok) {
          throw new Error("Lỗi không thể tải dữ liệu");
        }
        const data = await response.json();
        setDonhang(data.donHangs);

        const idNguoiDungList = [...new Set(data.donHangs.map((dh) => dh.id_nguoi_dung))];

        const nguoiDungData = await Promise.all(
          idNguoiDungList.map(async (id) => {
            const res = await fetch(`http://localhost:5000/users/${id}`);
            const userData = await res.json();
            return { id, ...userData.user };
          })
        );

        const nguoiDungObj = nguoiDungData.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {});
        setNguoiDungMap(nguoiDungObj);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDonhang();
  }, []);
  //cập nhật trạng thái đơn hàng
  const handleStatusChange = (id, newStatus) => {
    Swal.fire({
      title: "Xác nhận thay đổi trạng thái",
      text: `Bạn có chắc chắn muốn chuyển trạng thái thành "${newStatus}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Gửi yêu cầu PUT đến API
          const response = await fetch(`http://localhost:5000/donhang/update/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id,
              trang_thai: newStatus,
            }),
          });

          if (!response.ok) {
            throw new Error(`Lỗi khi cập nhật: ${response.statusText}`);
          }

          // Phản hồi từ API
          const responseData = await response.json();

          // Cập nhật trạng thái trong danh sách hiển thị
          setDonhang((prevDonhang) =>
            prevDonhang.map((don) => (don.id === id ? { ...don, trang_thai: newStatus } : don))
          );

          // Hiển thị thông báo thành công
          Swal.fire({
            title: "Thành công!",
            text: `Trạng thái đã được cập nhật thành "${newStatus}".`,
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        } catch (error) {
          // Thông báo lỗi nếu cập nhật thất bại
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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }
  return (
    <div className={styles.SidebarContainer}>
      <section id={styles.content}>
        <div className={styles.header1}>
          <div className={styles.title} style={{ fontWeight: "bold" }}>
            Danh Sách đơn hàng
          </div>
          <div className={styles.timestamp} id="timestamp"></div>
        </div>
        <div className={styles.bg}>
          <div className={styles.container}>
            <div className={styles.actions}>
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
              {displayDonhang.length > 0 ? (
                <table id="productTable" className={styles.productTable}>
                  <thead>
                    <tr>
                      <th style={{ width: "18%", textAlign: "center" }}>ID đơn hàng</th>
                      <th style={{ width: "12%", textAlign: "center" }}>Địa chỉ</th>
                      <th style={{ width: "12%", textAlign: "center" }}>Tên khách hàng</th>
                      <th style={{ width: "10%", textAlign: "center" }}>Số điện thoại</th>
                      <th style={{ width: "10%", textAlign: "center" }}>Ghi chú</th>
                      <th style={{ width: "10%", textAlign: "center" }}>Ngày mua</th>
                      <th style={{ width: "11%", textAlign: "center" }}>Tổng tiền</th>
                      <th style={{ width: "17%", textAlign: "center" }}>Tình trạng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayDonhang.map((item) => (
                      <tr key={item._id}>
                        <td>{item._id}</td>
                        <td>
                          <p className={styles.mota}>{item.dia_chi}</p>
                        </td>
                        <td>{nguoiDungMap[item.id_nguoi_dung]?.ho_ten || "Đang tải..."}</td>
                        <td>{nguoiDungMap[item.id_nguoi_dung]?.dien_thoai || "Đang tải..."}</td>
                        <td>{item.ghi_chu}</td>
                        <td>
                          {new Intl.DateTimeFormat("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }).format(new Date(item.thoi_gian_tao))}
                        </td>
                        <td>{item.tong_tien.toLocaleString("vi-VN")}₫</td>

                        <td style={{ "text-align": "center" }}>
                          <p className={styles.trangthai}>
                            <select
                              value={item.trang_thai}
                              onChange={(e) => handleStatusChange(item._id, e.target.value)}
                              style={{
                                textAlign: "center",
                                backgroundColor: item.trang_thai === "Đơn hàng đã hủy" ? "#dc3545" : "#28a745",
                                color: "white",
                                border: "1px solid white",
                              }}
                              disabled={
                                item.trang_thai === "Giao hàng thành công" || item.trang_thai === "Đơn hàng đã hủy"
                              }
                            >
                              {statusOptions
                                .filter((status, index) => {
                                  const currentIndex = statusOptions.indexOf(item.trang_thai);
                                  return index >= currentIndex; // Chỉ hiển thị các trạng thái phía sau (bao gồm trạng thái hiện tại)
                                })
                                .map((status) => (
                                  <option
                                    key={status}
                                    value={status}
                                    style={{
                                      backgroundColor: status === "Đơn hàng đã hủy" ? "#dc3545" : "#28a745",
                                      color: "white",
                                    }}
                                  >
                                    {status}
                                  </option>
                                ))}
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
                  Hiện thị {displayDonhang.length} của {filteredDonhangs.length || donHangs.length} đơn hàng
                </span>
                <div className={styles.paginationControls}>
                  <button
                    className={styles.paginationButton}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    ‹
                  </button>

                  <button className={`${styles.paginationButton}  ${styles.active}`}>
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
