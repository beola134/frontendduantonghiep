"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./danhmuc.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import "jspdf-autotable";
import RobotoRegular from "./Roboto-Regular.base64";

export default function DanhMuc() {
  const [categories, setCategories] = useState([]);
  const [displayCategories, setDisplayCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  //tìm kiếm
  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };
  const handleSearch = (query) => {
    const filtered = categories.filter((category) => removeAccents(category.thuong_hieu.toLowerCase()).includes(query));
    setFilteredCategories(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch(removeAccents(searchQuery.toLowerCase()));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, categories, itemsPerPage]);
  //phân trang
  useEffect(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const dataToShow = searchQuery ? filteredCategories : categories;
    setDisplayCategories(dataToShow.slice(start, end));
  }, [filteredCategories, categories, itemsPerPage, currentPage, searchQuery]);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset về trang đầu tiên
    Swal.fire({
      title: "Đã cập nhật",
      text: `Giới hạn hiển thị đã được thay đổi thành ${e.target.value} mục.`,
      icon: "success",
      confirmButtonText: "OK",
    });
  };

  const totalPages = Math.ceil((searchQuery ? filteredCategories.length : categories.length) / itemsPerPage);

  console.log(categories);
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
          const worksheet = workbook.addWorksheet("Danh sách thương hiệu");
          worksheet.columns = [
            { header: "ID thương hiệu", key: "_id", width: 20 },
            { header: "Tên thương hiệu", key: "thuong_hieu", width: 25 },
            { header: "Ghi chú", key: "mo_ta", width: 40 },
            { header: "Ảnh thương hiệu", key: "hinh_anh", width: 20 },
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
            categories.map(async (item, index) => {
              worksheet.addRow({
                _id: item._id,
                thuong_hieu: item.thuong_hieu,
                mo_ta: item.mo_ta,
                hinh_anh: "",
              });
              const response = await fetch(`http://localhost:5000/images/${item.hinh_anh2}`);
              if (!response.ok) {
                throw new Error(`Không thể tải ảnh từ URL: ${item.hinh_anh2}`);
              }
              const imageBuffer = await response.arrayBuffer();
              const imageExtension = item.hinh_anh2.split(".").pop();
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
          a.download = "thuong_hieu.xlsx";
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

    doc.setFontSize(16);
    doc.setTextColor(40);
    doc.text("Danh sách thương hiệu", 10, 10);

    const getBase64ImageFromURL = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = url;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const base64 = canvas.toDataURL("image/png", 1.0);
          resolve(base64);
        };
        img.onerror = (error) => reject(error);
      });
    };

    const imageCache = {};
    for (const item of categories) {
      if (item.hinh_anh2) {
        const imageUrl = `http://localhost:5000/images/${item.hinh_anh2}`;
        try {
          const base64Image = await getBase64ImageFromURL(imageUrl);
          imageCache[item.hinh_anh2] = base64Image;
        } catch (error) {
          console.error(`Không thể tải ảnh: ${imageUrl}`, error);
        }
      }
    }

    // Thêm một hàng trống vào đầu bảng
    const dataTable = [
      // Hàng trống đầu tiên
      { _id: "", mo_ta: "", thuong_hieu: "", hinh_anh2: "" }, // Hàng trống

      // Dữ liệu các hàng tiếp theo
      ...categories.map((item) => ({
        _id: item._id,
        mo_ta: item.mo_ta,
        thuong_hieu: item.thuong_hieu,
        hinh_anh2: item.hinh_anh2,
      })),
    ];

    // Tạo bảng với startY = 40 để tạo khoảng trống giữa tiêu đề và dữ liệu đầu tiên
    doc.autoTable({
      body: dataTable, // Sử dụng dữ liệu với hàng trống đầu tiên
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
        0: { halign: "center", cellWidth: 20 },
        1: { halign: "left", cellWidth: 50 },
        2: { halign: "center", cellWidth: 50 },
        3: { halign: "center", cellWidth: 50 },
      },
      columns: [
        { header: "ID thương hiệu", dataKey: "_id" },
        { header: "Ghi chú", dataKey: "mo_ta" },
        { header: "Tên thương hiệu", dataKey: "thuong_hieu" },
        { header: "Ảnh thương hiệu", dataKey: "hinh_anh2" },
      ],
      didDrawCell: (data) => {
        if (data.row.index > 0) {
          const rowIndex = data.row.index - 1;
          const item = categories[rowIndex];

          if (item && item.hinh_anh2 && imageCache[item.hinh_anh2] && data.column.index === 3) {
            const base64Image = imageCache[item.hinh_anh2];
            const yPosition = data.cell.y + data.cell.height / 2 - 30 / 2;

            doc.addImage(base64Image, "PNG", data.cell.x + data.cell.width / 2 - 15, yPosition, 30, 30);
          }
        }
      },
      startY: 20,
      margin: { top: 30 },
    });
    const date = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Ngày xuất: ${date}`, 10, doc.internal.pageSize.height - 10);
    doc.save("Thuonghieu.pdf");
    Swal.fire({
      title: "Thành công",
      text: "Dữ liệu và hình ảnh đã được xuất ra PDF!",
      icon: "success",
      confirmButtonText: "OK",
    });
  };

  //Xóa thương hiệu
  const deleteCategory = async (id) => {
    const result = await Swal.fire({
      title: "Xác nhận",
      text: "Bạn có chắc chắn muốn xóa thương hiệu này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:5000/thuonghieu/delete/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Lỗi khi xóa thương hiệu");
        }

        setCategories((prevCategory) => prevCategory.filter((category) => category._id !== id));

        Swal.fire({
          title: "Thành công",
          text: "Danh mục đã được xóa thành công!",
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

  // lấy dữ liệu danh sách thương hiệu
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/thuonghieu/allthuonghieu");
        if (!response.ok) {
          throw new Error("Lỗi không thể tải dữ liệu");
        }
        const data = await response.json();
        setCategories(data.th);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

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
            Danh Sách Thương Hiệu
          </div>
          <div className={styles.timestamp} id="timestamp"></div>
        </div>
        <div className={styles.bg}>
          <div className={styles.container}>
            <div className={styles.actions}>
              <Link href="/admin/components/admin-crud/themthuonghieu" className={styles.sp}>
                <i className="fas fa-plus"></i> Thêm thương hiệu mới
              </Link>
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

            <div className={styles.tableContainer}>
              <div className={styles.tableControls}>
                <label htmlFor="entries" style={{ fontWeight: "bold" }}>
                  {/* Nội dung */}
                </label>
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
                    placeholder="Nhập tên thương hiệu..."
                  />
                </div>
              </div>
              {displayCategories.length > 0 ? (
                <table id="productTable" className={styles.productTable}>
                  <thead>
                    <tr>
                      <th style={{ width: "15%", textAlign: "center" }}>ID thương hiệu</th>
                      <th style={{ width: "40%", textAlign: "center" }}>Ghi chú</th>
                      <th style={{ width: "15%", textAlign: "center" }}>Tên thương hiệu</th>
                      <th style={{ width: "15%", textAlign: "center" }}>Ảnh thương hiệu</th>
                      <th style={{ width: "15%", textAlign: "center" }}>Chức năng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayCategories.map((item) => (
                      <tr key={item._id}>
                        <td>{item._id}</td>
                        <td style={{ textAlign: "center" }}>
                          <p className={styles.mota}>{item.mo_ta}</p>
                        </td>
                        <td style={{ textAlign: "center" }}>{item.thuong_hieu}</td>
                        <td style={{ textAlign: "center" }}>
                          <img src={`http://localhost:5000/images/${item.hinh_anh2}`} alt={item.thuong_hieu} />
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <Link
                            href={`/admin/components/admin-crud/suathuonghieu/${item._id}`}
                            className={`${styles.btn} ${styles.edit}`}
                          >
                            ✏️
                          </Link>{" "}
                          &nbsp;
                          <button
                            className={`${styles.btn} ${styles.delete}`}
                            id="deleteButton"
                            onClick={() => deleteCategory(item._id)}
                          >
                            🗑️
                          </button>
                          &nbsp;
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
                  Hiện thị {displayCategories.length} của {filteredCategories.length || categories.length} thương hiệu
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
                    {`Trang ${currentPage} / ${totalPages}`}
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
