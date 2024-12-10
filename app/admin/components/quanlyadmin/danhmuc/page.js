"use client";
import Link from "next/link";
import styles from "./danhmuc.module.css";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import "jspdf-autotable";
import RobotoRegular from "./Roboto-Regular.base64";
import { jwtDecode } from "jwt-decode";

export default function DanhmucPage() {
  const [cates, setDanhmuc] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCates, settotalCates] = useState(0);
  const itemsPerPage = 5;
  const [showInterface, setShowInterface] = useState(false);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const fetchDanhmuc = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/cate/allcate?page=${currentPage}&ten_danh_muc=${searchQuery}`
      );
      if (!response.ok) {
        throw new Error("Lỗi không thể tải dữ liệu");
      }
      const data = await response.json();
      setTotalPage(data.totalPages);
      setDanhmuc(data.cates);
      settotalCates(data.totalCates);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const debouncedfetchDanhmuc = debounce(fetchDanhmuc, 300);

  useEffect(() => {
    debouncedfetchDanhmuc();
  }, [currentPage, searchQuery]);

  // chức năng chuyển trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // hàm xử lí thay đổi danh mục
  const handSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const deleteDanhmuc = async (id) => {
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
        `http://localhost:5000/cate/deletecate/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setDanhmuc(cates.filter((cate) => cate._id !== id));
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
      console.error("Error deleting Danh mục:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Đã xảy ra lỗi khi xóa Danh mục.",
      });
    }
  };

  const startDanhmucIndex = (currentPage - 1) * itemsPerPage + 1;
  const endDanhmucIndex = Math.min(currentPage * itemsPerPage, totalCates);

  const printData = () => {
    window.print();
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
          let currentPage = 1;
          let totalPages = 1;
          const allCates = [];
          while (currentPage <= totalPages) {
            const response = await fetch(
              `http://localhost:5000/cate/allcate?page=${currentPage}`
            );
            const data = await response.json();
            allCates.push(...data.cates);
            totalPages = data.totalPages;
            currentPage++;
          }
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet("Danh sách danh mục");
          worksheet.columns = [
            { header: "ID danh mục", key: "_id", width: 20 },
            { header: "Tên danh mục", key: "ten_danh_muc", width: 25 },
            { header: "Mô tả", key: "mo_ta", width: 60 },
            { header: "Hình ảnh danh mục", key: "hinh_anh", width: 20 },
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
            allCates.map(async (item, index) => {
              worksheet.addRow({
                _id: item._id,
                ten_danh_muc: item.ten_danh_muc,
                mo_ta: item.mo_ta,
                hinh_anh: "",
              });
              const response = await fetch(
                `http://localhost:5000/images/${item.hinh_anh}`
              );
              if (!response.ok) {
                throw new Error(`Không thể tải ảnh từ URL: ${item.hinh_anh}`);
              }
              const imageBuffer = await response.arrayBuffer();
              const imageExtension = item.hinh_anh.split(".").pop();
              const imageId = workbook.addImage({
                buffer: imageBuffer,
                extension: imageExtension === "png" ? "png" : "jpeg",
              });
              const rowNumber = index + 2;
              worksheet.addImage(imageId, {
                tl: { col: 3.2, row: rowNumber - 0.8 },
                ext: { width: 50, height: 50 },
              });
              const currentRow = worksheet.getRow(rowNumber);
              currentRow.height = 50;
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
          a.download = "danh_muc.xlsx";
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
    doc.text("Danh sách danh mục", 10, 10);

    try {
      let currentPage = 1;
      let totalPages = 1;
      const allCates = [];

      // Fetch all pages
      while (currentPage <= totalPages) {
        const response = await fetch(
          `http://localhost:5000/cate/allcate?page=${currentPage}`
        );
        if (!response.ok) {
          throw new Error(
            `Failed to fetch page ${currentPage}: ${response.statusText}`
          );
        }
        const data = await response.json();
        allCates.push(...data.cates);
        totalPages = data.totalPages;
        currentPage++;
      }

      const sortedCates = [...allCates].sort((a, b) => {
        return a._id.localeCompare(b._id);
      });

      // Load all images
      const images = await Promise.all(
        sortedCates.map((item) => {
          if (item.hinh_anh) {
            const imageUrl = `http://localhost:5000/images/${item.hinh_anh}`;
            return new Promise((resolve) => {
              const img = new Image();
              img.crossOrigin = "Anonymous";
              img.src = imageUrl;
              img.onload = () => {
                resolve({
                  id: item._id,
                  img: img,
                });
              };
              img.onerror = () => {
                console.error(`Không thể tải ảnh từ URL: ${imageUrl}`);
                resolve({
                  id: item._id,
                  img: null,
                });
              };
            });
          }
          return Promise.resolve({ id: item._id, img: null });
        })
      );

      // Generate PDF table
      doc.autoTable({
        head: [["ID danh mục", "Tên danh mục", "Mô tả", "Hình ảnh danh mục"]],
        body: sortedCates.map((item) => [
          item._id,
          item.ten_danh_muc,
          item.mo_ta,
          item.hinh_anh ? "Hình ảnh" : "Không có",
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
          0: { halign: "center", cellWidth: 30 },
          1: { halign: "left", cellWidth: 50 },
          2: { halign: "left", cellWidth: 80 },
          3: { halign: "center", cellWidth: 40 },
        },
        didDrawCell: (data) => {
          if (data.column.index === 3 && data.cell.raw === "Hình ảnh") {
            const rowIndex = data.row.index;
            const imageData = images.find(
              (img) => img.id === sortedCates[rowIndex]._id
            );

            if (imageData && imageData.img) {
              const img = imageData.img;
              const imgWidth = 30;
              const imgHeight = 30;
              const posX = data.cell.x + (data.cell.width - imgWidth) / 2;
              const posY = data.cell.y + 1;

              // Convert Image to Data URL
              const canvas = document.createElement("canvas");
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext("2d");
              ctx.drawImage(img, 0, 0);
              const imgData = canvas.toDataURL(
                img.src.endsWith(".png") ? "image/png" : "image/jpeg"
              );

              doc.addImage(
                imgData,
                img.src.endsWith(".png") ? "PNG" : "JPEG",
                posX,
                posY,
                imgWidth,
                imgHeight
              );
            }
          }
        },
      });

      const date = new Date().toLocaleDateString();
      doc.setFontSize(10);
      doc.text(`Ngày xuất: ${date}`, 10, doc.internal.pageSize.height - 10);
      doc.save("danhmuc.pdf");

      Swal.fire({
        title: "Thành công",
        text: "Dữ liệu và hình ảnh đã được xuất ra PDF!",
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

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div>Có lỗi xảy ra: {error}</div>;

  return (
    <div className={styles.SidebarContainer}>
      <section id={styles.content}>
        <div className={styles.header1}>
          <div className={styles.title} style={{ fontWeight: "bold" }}>
            Danh Sách Danh mục
          </div>
          <div className={styles.timestamp} id="timestamp"></div>
        </div>
        <div className={styles.bg}>
          <div className={styles.container}>
            <div className={styles.actions}>
              <Link href="/admin/components/admin-crud/themdanhmuc" className={styles.sp}>
                <i className="fas fa-plus"></i> Tạo mới Danh mục
              </Link>
            </div>
            <div className={styles.buttonGroup}>
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

          <div className={styles.tableControls}>
            <div className={styles.search}>
              <label htmlFor="search" style={{ fontWeight: "bold" }}>
                Tìm kiếm:
              </label>
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={handSearchChange}
                placeholder="Nhập tên danh mục..."
              />
            </div>
          </div>

          <table id="productTable" className={styles.productTable}>
            <thead>
              <tr>
                <th style={{ width: "10%", textAlign: "center" }}>
                  Id Danh mục
                </th>
                <th style={{ width: "10%", textAlign: "center" }}>
                  Tên danh mục
                </th>
                <th style={{ width: "15%", textAlign: "center" }}>Hình ảnh</th>
                <th style={{ width: "20%", textAlign: "center" }}>Mô tả</th>
                <th style={{ width: "10%", textAlign: "center" }}>Chức năng</th>
              </tr>
            </thead>
            <tbody>
              {cates.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      color: "red",
                      fontWeight: "bold",
                    }}>
                    Không có danh mục
                  </td>
                </tr>
              ) : (
                cates.map((cate) => {
                  const { _id, ten_danh_muc, mo_ta, hinh_anh } = cate;

                  return (
                    <tr key={_id}>
                      <td>{_id}</td>
                      <td style={{ textAlign: "center" }}>{ten_danh_muc}</td>
                      <td style={{ width: "10%", textAlign: "center" }}>
                        <img src={`http://localhost:5000/images/${hinh_anh}`} />
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <p className={styles.mota}>{mo_ta}</p>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <Link
                          href={`/admin/components/admin-crud/suadanhmuc/${_id}`}
                          className={`${styles.btn} ${styles.edit}`}>
                          ✏️
                        </Link>
                        &nbsp;
                        <button
                          className={`${styles.btn} ${styles.delete}`}
                          onClick={() => deleteDanhmuc(_id)}>
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
              Hiện {startDanhmucIndex} đến {endDanhmucIndex} của {totalCates}{" "}
              {""}
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
