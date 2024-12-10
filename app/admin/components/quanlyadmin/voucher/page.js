"use client";
import Link from "next/link";
import styles from "./voucher.module.css";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import "jspdf-autotable";
import RobotoRegular from "./Roboto-Regular.base64";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function VoucherPage() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalVouchers, setTotalVouchers] = useState(0);
  const itemsPerPage = 5;

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // Hàm xuất dữ liệu ra Excel
  const exportToExcel = async () => {
    console.log(vouchers);
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
          const getAllVouchers = [];
          while (currentPage <= totalPages) {
            const response = await fetch(
              `http://localhost:5000/voucher/getAllVouchers?page=${currentPage}`
            );
            const data = await response.json();
            getAllVouchers.push(...data.vouchers);
            totalPages = data.totalPages;
            currentPage++;
          }
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet("Danh sách Voucher");
          worksheet.columns = [
            { header: "ID voucher", key: "_id", width: 20 },
            { header: "Mã voucher", key: "ma_voucher", width: 25 },
            { header: "Giá trị", key: "gia_tri", width: 25 },
            { header: "Phần trăm", key: "phan_tram", width: 25 },
            { header: "Số lượng", key: "so_luong", width: 25 },
            { header: "Ngày bắt đầu", key: "bat_dau", width: 25 },
            { header: "Ngày kết thúc", key: "ket_thuc", width: 25 },
            { header: "Ghi chú", key: "mo_ta", width: 40 },
            {
              header: "Đơn hàng tối thiểu",
              key: "don_hang_toi_thieu",
              width: 25,
            },
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
            getAllVouchers.map(async (item, index) => {
              worksheet.addRow({
                _id: item._id,
                ma_voucher: item.ma_voucher,
                gia_tri: item.gia_tri,
                phan_tram: item.phan_tram,
                so_luong: item.so_luong,
                bat_dau: item.bat_dau,
                ket_thuc: item.ket_thuc,
                mo_ta: item.mo_ta,
                don_hang_toi_thieu: item.don_hang_toi_thieu,
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
          a.download = "voucher.xlsx";
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
  //xuất file pdf
  const exportToPDF = async () => {
    const doc = new jsPDF();
    doc.addFileToVFS("Roboto-Regular.ttf", RobotoRegular);
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    doc.setFont("Roboto");

    // Tiêu đề file PDF
    doc.setFontSize(16);
    doc.setTextColor(40);
    doc.text("Danh sách voucher", 10, 10);

    try {
      let currentPage = 1;
      let totalPages = 1;
      const allVouchers = [];

      // Fetch all pages
      while (currentPage <= totalPages) {
        const response = await fetch(
          `http://localhost:5000/voucher/getAllVouchers?page=${currentPage}`
        );
        if (!response.ok) {
          throw new Error(
            `Failed to fetch page ${currentPage}: ${response.statusText}`
          );
        }
        const data = await response.json();
        allVouchers.push(...data.vouchers);
        totalPages = data.totalPages;
        currentPage++;
      }

      // Sort vouchers if needed
      const sortedVouchers = [...allVouchers].sort((a, b) => {
        return a._id.localeCompare(b._id);
      });

      // Generate PDF table
      doc.autoTable({
        head: [
          [
            "ID Voucher",
            "Mã Voucher",
            "Giá trị",
            "Phần trăm",
            "Số lượng",
            "Ngày bắt đầu",
            "Ngày kết thúc",
            "Ghi chú",
          ],
        ],
        body: sortedVouchers.map((item) => [
          item._id,
          item.ma_voucher,
          item.gia_tri,
          item.phan_tram,
          item.so_luong,
          new Date(item.bat_dau).toLocaleDateString(),
          new Date(item.ket_thuc).toLocaleDateString(),
          item.mo_ta || "Không có",
          item.don_hang_toi_thieu,
        ]),
        startY: 20,
        styles: {
          font: "Roboto",
          fontSize: 10,
          cellPadding: 4,
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
          0: { halign: "center", cellWidth: 25 },
          1: { halign: "left", cellWidth: 20 },
          2: { halign: "center", cellWidth: 20 },
          3: { halign: "center", cellWidth: 20 },
          4: { halign: "center", cellWidth: 25 },
          5: { halign: "center", cellWidth: 25 },
          6: { halign: "center", cellWidth: 25 },
          7: { halign: "left", cellWidth: 25 },
        },
      });

      const date = new Date().toLocaleDateString();
      doc.setFontSize(10);
      doc.text(`Ngày xuất: ${date}`, 10, doc.internal.pageSize.height - 10);
      doc.save("Voucher.pdf");

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

  const handleToggleComment = async (id, trang_thai) => {
    try {
      const response = await fetch(
        `http://localhost:5000/voucher/getVoucherByStatus/${id}`,
        {
          method: "PUT",
        }
      );
      const data = await response.json();

      if (data.message) {
        setVouchers((prevVoucher) =>
          prevVoucher.map((voucher) =>
            voucher._id === id
              ? { ...voucher, trang_thai: !trang_thai }
              : voucher
          )
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const convertToVietnamTime = (dateString) => {
    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // Chế độ 24 giờ
    });
    return formatter.format(date);
  };

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/voucher/getAllVouchers?page=${currentPage}&ma_voucher=${searchQuery}&limit=${itemsPerPage}`
      );
      if (!response.ok) {
        throw new Error("Lỗi không thể tải dữ liệu");
      }
      const data = await response.json();
      setTotalPage(data.totalPages || 1);
      setVouchers(data.vouchers);
      setTotalVouchers(data.totalVouchers);
      setVouchers(
        data.vouchers.map((voucher) => ({
          ...voucher,
          bat_dau: convertToVietnamTime(voucher.bat_dau),
          ket_thuc: convertToVietnamTime(voucher.ket_thuc),
        }))
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchVouchers = debounce(fetchVouchers, 300);

  useEffect(() => {
    debouncedFetchVouchers();
  }, [currentPage, searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPage) {
      setCurrentPage(page);
    }
  };

  const deleteVoucher = async (id) => {
    const result = await Swal.fire({
      title: "Xác nhận",
      text: "Bạn có chắc chắn muốn xóa danh mục này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });
    try {
      const response = await fetch(
        `http://localhost:5000/voucher/deleteVoucher/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setVouchers(vouchers.filter((voucher) => voucher._id !== id));
        Swal.fire({
          icon: "success",
          title: "Xóa thành công!",
          text: "Danh mục đã được xóa thành công!",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Có lỗi xảy ra khi xóa Danh mục.",
        });
      }
    } catch (error) {
      console.error("Error deleting voucher:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Đã xảy ra lỗi khi xóa Danh mục.",
      });
    }
  };

  const startVoucherIndex = (currentPage - 1) * itemsPerPage + 1;
  const endVoucherIndex = Math.min(currentPage * itemsPerPage, totalVouchers);

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div>Có lỗi xảy ra: {error}</div>;

  return (
    <div className={styles.SidebarContainer}>
      <section id={styles.content}>
        <div className={styles.header1}>
          <div className={styles.title} style={{ fontWeight: "bold" }}>
            Danh Sách Vouchers
          </div>
          <div className={styles.timestamp} id="timestamp"></div>
        </div>
        <div className={styles.bg}>
          <div className={styles.container}>
            <div className={styles.actions}>
              <Link
                href="/admin/components/admin-crud/themvoucher"
                className={styles.sp}>
                <i className="fas fa-plus"></i> Tạo mới voucher
              </Link>
              <div className={styles.buttonGroup}>
                &nbsp;
                <button className={styles.sp3}>
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
          </div>

          <div className={styles.tableControls}>
            <div className={styles.search}>
              <label htmlFor="search" style={{ fontWeight: "bold" }}>
                Tìm kiếm:
              </label>
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Nhập mã voucher..."
              />
            </div>
          </div>

          <table id="productTable" className={styles.productTable}>
            <thead>
              <tr>
                <th style={{ width: "10%", textAlign: "center" }}>
                  Id Voucher
                </th>
                <th style={{ width: "10%", textAlign: "center" }}>
                  Mã Voucher
                </th>
                <th style={{ width: "10%", textAlign: "center" }}>Giá trị</th>
                <th style={{ width: "10%", textAlign: "center" }}>Phần trăm</th>
                <th style={{ width: "10%", textAlign: "center" }}>Số Lượng</th>
                <th style={{ width: "12%", textAlign: "center" }}>
                  Ngày bắt đầu
                </th>
                <th style={{ width: "10%", textAlign: "center" }}>
                  Ngày kết thúc
                </th>
                <th style={{ width: "10%", textAlign: "center" }}>Mô tả</th>
                <th style={{ width: "10%", textAlign: "center" }}>Tiêu đề</th>
                <th style={{ width: "10%", textAlign: "center" }}>
                  Đơn hàng tối thiểu
                </th>
                <th style={{ width: "10%", textAlign: "center" }}>
                  Trạng thái
                </th>
                <th style={{ width: "15%", textAlign: "center" }}>Chức năng</th>
              </tr>
            </thead>
            <tbody>
              {vouchers.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    style={{
                      textAlign: "center",
                      color: "red",
                      fontWeight: "bold",
                    }}>
                    Không có voucher
                  </td>
                </tr>
              ) : (
                vouchers.map((voucher) => {
                  const {
                    _id,
                    ma_voucher,
                    gia_tri,
                    phan_tram,
                    so_luong,
                    bat_dau,
                    ket_thuc,
                    mo_ta,
                    don_hang_toi_thieu,
                    trang_thai,
                    mota2,
                  } = voucher;

                  return (
                    <tr
                      key={_id}
                      className={!trang_thai ? styles.hiddenRow : ""}>
                      <td>{_id}</td>
                      <td style={{ textAlign: "center" }}>{ma_voucher}</td>
                      <td style={{ textAlign: "center" }}>{gia_tri}</td>
                      <td style={{ textAlign: "center" }}>{phan_tram}%</td>
                      <td style={{ textAlign: "center" }}>{so_luong}</td>
                      <td style={{ textAlign: "center" }}>{bat_dau}</td>
                      <td style={{ textAlign: "center" }}>{ket_thuc}</td>
                      <td style={{ textAlign: "center" }}>{mo_ta}</td>
                      <td style={{ textAlign: "center" }}>{mota2}</td>
                      <td style={{ textAlign: "center" }}>
                        {don_hang_toi_thieu}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          onClick={() => handleToggleComment(_id, trang_thai)}
                          className={`${styles.btn2} ${styles.edit}`}>
                          <FontAwesomeIcon
                            icon={trang_thai ? faEye : faEyeSlash}
                          />
                        </button>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <Link
                          href={`/admin/components/admin-crud/suavoucher/${_id}`}
                          className={`${styles.btn} ${styles.edit}`}>
                          ✏️
                        </Link>
                        &nbsp;
                        <button
                          className={`${styles.btn} ${styles.delete}`}
                          onClick={() => deleteVoucher(_id)}>
                          🗑️
                        </button>
                        &nbsp;
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          <div className={styles.pagination}>
            <span>
              Hiện {startVoucherIndex} đến {endVoucherIndex} của {totalVouchers}{" "}
              sản phẩm
            </span>
            <div className={styles.paginationControls}>
              <button
                className={`${styles.paginationButton} ${
                  currentPage === 1 ? styles.disabled : styles["other-page"]
                }`}
                onClick={() =>
                  currentPage > 1 && handlePageChange(currentPage - 1)
                }
                disabled={currentPage === 1}>
                ‹
              </button>
              <button
                className={
                  styles.paginationButton
                }>{`Trang ${currentPage} / ${totalPage}`}</button>

              <button
                className={`${styles.paginationButton} ${
                  currentPage === totalPage
                    ? styles.disabled
                    : styles["other-page"]
                }`}
                onClick={() =>
                  currentPage < totalPage && handlePageChange(currentPage + 1)
                }
                disabled={currentPage === totalPage}>
                ›
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
