"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import styles from "./themdanhmuc.module.css";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function ThemDanhmuc() {
  const [tendanhmuc, setTendanhmuc] = useState("");
  const [hinhanh, sethinhanh] = useState(null);
  const [mota, setmota] = useState("");
  const router = useRouter();
  const [showInterface, setShowInterface] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tendanhmuc) {
      Swal.fire({
        icon: "warning",
        title: "Thiếu thông tin",
        text: "Vui lòng nhập Tên danh mục!",
      });
      return;
    }
    if (!hinhanh) {
      Swal.fire({
        icon: "warning",
        title: "Thiếu thông tin",
        text: "Vui lòng chọn ảnh danh mục!",
      });
      return;
    }
    if (!mota) {
      Swal.fire({
        icon: "warning",
        title: "Thiếu thông tin",
        text: "Vui lòng nhập mô tả danh mục!",
      });
      return;
    }

    const formData = new FormData();
    formData.append("ten_danh_muc", tendanhmuc);
    formData.append("hinh_anh", hinhanh);
    formData.append("mo_ta", mota);

    try {
      const response = await fetch("http://localhost:5000/cate/addcate", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Thêm Danh mục thành công!",
        }).then(() => {
          router.push("/admin/components/quanlyadmin/danhmuc");
        });
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: errorData.error || "Có lỗi xảy ra!",
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
    <div className={styles.SidebarContainer}>
      <section id={styles.content}>
        <div className={styles.header1}>
          <div className={styles.title} style={{ fontWeight: "bold" }}>
            Thêm Danh mục
          </div>
        </div>
        <div className={styles.bg}>
          <form onSubmit={handleSubmit}>
            <div className={styles.container1}>
              <div className={styles.formGroup}>
                <label htmlFor="tendanhmuc">Tên danh mục</label>
                <input
                  type="text"
                  id="tendanhmuc"
                  value={tendanhmuc}
                  onChange={(e) => setTendanhmuc(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description">Mô tả Danh mục</label>
                <textarea
                  id="description"
                  value={mota}
                  onChange={(e) => setmota(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="hinhAnh">Hình ảnh</label>
                <input
                  type="file"
                  id="hinhAnh"
                  accept="image/*"
                  onChange={(e) => sethinhanh(e.target.files[0])}
                />
              </div>

              <button
                type="submit"
                className="btn btn-outline-primary"
                onClick={handleSubmit}>
                Thêm
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => router.back()}>
                Hủy bỏ
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
