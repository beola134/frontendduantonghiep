"use client";
import styles from "./comments.module.css";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import "jspdf-autotable";
import RobotoRegular from "./Roboto-Regular.base64";


export default function CommentsPage() {
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // gọi tất cả các bình luận từ API
  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:5000/comment/showAll?page=${currentPage}&ten_dang_nhap=${search}`);
      const data = await response.json();
      setComments(data.comments);
      setTotalPages(data.totalPages);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [currentPage, search]);

  // chức năng chuyển trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  // hàm xử lí thay đổi bình luận
  const handSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };
  const handleToggleComment = async (id, trang_thai) => {
    try {
      const response = await fetch(`http://localhost:5000/comment/changeStatus/${id}`, {
        method: "PUT",
      });
      const data = await response.json();

      if (data.message) {
        setComments((prevComments) =>
          prevComments.map((comment) => (comment._id === id ? { ...comment, trang_thai: !trang_thai } : comment))
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  // hiển thị số sản phẩm trên mỗi trang
  const totalComment = comments.length;
  const startDanhmucIndex = (currentPage - 1) * 10 + 1;
  const endDanhmucIndex = currentPage * 10 > totalComment ? totalComment : currentPage * 10;

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
          let currentPage = 1;
          let totalPages = 1;
          const allComments = [];
          while (currentPage <= totalPages) {
            const response = await fetch(`http://localhost:5000/comment/showAll?page=${currentPage}`);
            const data = await response.json();
            allComments.push(...data.comments);
            totalPages = data.totalPages;
            currentPage++;
          }
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet("Danh sách bình luận");
          worksheet.columns = [
            { header: "ID bình luận", key: "_id", width: 35 },
            { header: "ID sản phẩm", key: "id_san_pham", width: 35 },
            { header: "Họ và tên", key: "ten_dang_nhap", width: 20 },
            { header: "Nội dung", key: "noi_dung", width: 20 },
            { header: "Sao", key: "sao", width: 10 },
            { header: "Ngày bình luận", key: "ngay_binh_luan", width: 20 },
            { header: "Trạng thái", key: "trang_thai", width: 20 },
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
            allComments.map(async (item) => {
              worksheet.addRow({
                _id: item._id,
                id_san_pham: item.id_san_pham,
                ten_dang_nhap: item.user?.ten_dang_nhap || "Null",
                noi_dung: item.noi_dung,
                sao: item.sao,
                ngay_binh_luan: new Date(item.ngay_binh_luan).toLocaleString("vi-VN", {
                  timeZone: "Asia/Ho_Chi_Minh",
                }),
                trang_thai: item.trang_thai ? "Đang hiển thị" : "Đã ẩn",
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
          a.download = "comments-table.xlsx";
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

  // xuất pdf
  const exportToPDF = async () => {
    const doc = new jsPDF();
    doc.addFileToVFS("Roboto-Regular.ttf", RobotoRegular);
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    doc.setFont("Roboto");

    // Tiêu đề file PDF
    doc.setFontSize(16);
    doc.setTextColor(40);
    doc.text("Danh sách bình luận", 10, 10);

    try {
      let currentPage = 1;
      let totalPages = 1;
      const allComments = [];

      // Lấy tất cả các bình luận
      while (currentPage <= totalPages) {
        const response = await fetch(`http://localhost:5000/comment/showAll?page=${currentPage}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch page ${currentPage}: ${response.statusText}`);
        }
        const data = await response.json();
        allComments.push(...data.comments);
        totalPages = data.totalPages;
        currentPage++;
      }

      const sortedComments = [...allComments].sort((a, b) => {
        return a._id.localeCompare(b._id);
      });

      // Tạo bảng dữ liệu
      doc.autoTable({
        head: [["ID bình luận", "ID sản phẩm", "Họ và tên", "Nội dung", "Sao", "Ngày bình luận", "Trạng thái"]],
        body: sortedComments.map((item) => [
          item._id,
          item.id_san_pham,
          item.user?.ten_dang_nhap || "Null",
          item.noi_dung,
          item.sao,
          new Date(item.ngay_binh_luan).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }) || "N/A",
          item.trang_thai ? "Đang hiển thị" : "Đã ẩn",
        ]),

        styles: {
          font: "Roboto",
          fontSize: 10,
          cellPadding: 5,
          valign: "middle",
          halign: "center",
          textColor: 20,
          lineColor: [200, 200, 200],
        },
        headStyles: {
          fillColor: [0, 112, 192],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        columnStyles: {
          0: { halign: "center", cellWidth: 30 },
          1: { halign: "left", cellWidth: 30 },
          2: { halign: "left", cellWidth: 26 },
          3: { halign: "left", cellWidth: 25 },
          4: { halign: "center", cellWidth: 25 },
          5: { halign: "center", cellWidth: 30 },
          6: { halign: "center", cellWidth: 30 },
          7: { halign: "center", cellWidth: 30 },
        },
      });

      const date = new Date().toLocaleDateString();
      doc.setFontSize(10);
      doc.text(`Ngày xuất: ${date}`, 10, doc.internal.pageSize.height - 10);

      // Lưu file PDF
      doc.save("comments-table.pdf");

      Swal.fire({
        title: "Thành công",
        text: "Dữ liệu đã được xuất ra PDF!",
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
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div className={styles.SidebarContainer}>
      <section id={styles.content}>
        <div className={styles.header1}>
          <div className={styles.title} style={{ fontWeight: "bold" }}>
            Danh Sách Sản Phẩm
          </div>
          <div className={styles.timestamp} id="timestamp"></div>
        </div>
        <div className={styles.bg}>
          <div className={styles.container}>
            <div className={styles.actions}>
              <div className={styles.buttonGroup}>
                <button
                  className={styles.sp3}
                  onClick={() => {
                    const originalContent = document.body.innerHTML;
                    const tableContent = document.getElementById("productTable").outerHTML;
                    document.body.innerHTML = tableContent;
                    window.print();
                    document.body.innerHTML = originalContent;
                  }}
                >
                  <i className="fas fa-print"></i> In dữ liệu
                </button>
                &nbsp;
                <button className={styles.sp5} onClick={exportToExcel}>
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
                    value={search}
                    onChange={handSearchChange}
                    placeholder="Nhập tên người dùng..."
                  />
                </div>
              </div>
              <table id="productTable" className={styles.productTable}>
                <thead>
                  <tr>
                    <th style={{ width: "15%", textAlign: "center" }}>Id bình luận</th>
                    <th style={{ width: "10%", textAlign: "center" }}>Id sản phẩm</th>
                    <th style={{ width: "8%", textAlign: "center" }}>Họ và tên </th>
                    <th style={{ width: "12%", textAlign: "center" }}>Nội dung</th>
                    <th style={{ width: "5%", textAlign: "center" }}>Sao</th>
                    <th style={{ width: "10%", textAlign: "center" }}>Ngày bình luận</th>
                    <th style={{ width: "10%", textAlign: "center" }}>Chức năng</th>
                  </tr>
                </thead>
                <tbody>
                  {comments.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        Không có bình luận nào
                      </td>
                    </tr>
                  ) : (
                    comments.map((comment) => {
                      const { _id, noi_dung, sao, ngay_binh_luan, id_san_pham, trang_thai } = comment;

                      return (
                        <tr key={_id} className={!trang_thai ? styles.hiddenRow : ""}>
                          <td>{_id}</td>
                          <td>{id_san_pham}</td>
                          <td style={{ textAlign: "center" }}>
                            <span className={`${styles.status} ${styles.inStock}`}>{comment.user?.ten_dang_nhap}</span>
                          </td>

                          <td style={{ textAlign: "center" }}>{noi_dung}</td>
                          <td style={{ textAlign: "center" }}>{sao}</td>
                          <td style={{ textAlign: "center" }}>
                            {new Date(ngay_binh_luan).toLocaleString("vi-VN", {
                              timeZone: "Asia/Ho_Chi_Minh",
                            })}
                          </td>

                          <td style={{ textAlign: "center" }}>
                            <button
                              onClick={() => handleToggleComment(_id, trang_thai)}
                              className={`${styles.btn} ${styles.edit}`}
                            >
                              <FontAwesomeIcon icon={trang_thai ? faEye : faEyeSlash} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>

              <div className={styles.pagination}>
                <span className={styles.totalComment}>
                  Hiện {startDanhmucIndex} đến {endDanhmucIndex} của {totalComment} bình luận
                </span>
                <div className={styles.paginationControls}>
                  <button
                    className={`${styles.paginationButton} ${
                      currentPage === 1 ? styles.disabled : styles["other-page"]
                    }`}
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    ‹
                  </button>

                  <button className={styles.paginationButton}>{`Trang ${currentPage} / ${totalPages || 1}`}</button>
                  <button
                    className={`${styles.paginationButton} ${
                      currentPage === totalPages ? styles.disabled : styles["other-page"]
                    }`}
                    onClick={() => handlePageChange(currentPage + 1)}
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
