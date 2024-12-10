"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./suasanpham.module.css";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Link from "next/link";
export default function SuaSanPham({ params }) {
  const { id } = params;
  const [formData, setFormData] = useState({
    ten_san_pham: "",
    ten: "",
    gia_san_pham: "",
    gia_giam: "",
    ma_san_pham: "",
    do_chiu_nuoc: "",
    xuat_xu: "",
    gioi_tinh: "",
    so_luong: "",
    loai_may: "",
    loai: "",
    duong_kinh: "",
    chat_lieu_day: "",
    chat_lieu_vo: "",
    mat_kinh: "",
    mau_mat: "",
    phong_cach: "",
    kieu_dang: "",
    thuong_hieu: "",
    size_day: "",
    mau_day: "",
    do_dai_day: "",
    id_thuong_hieu: "",
    mo_ta: "",
    hinh_anh: null,
  });
  const [cates, setCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    const fetchProductAndCategories = async () => {
      try {
        const cateResponse = await fetch(
          "http://localhost:5000/thuonghieu/allthuonghieu"
        );
        const cateData = await cateResponse.json();
        setCategories(cateData.th);

        const productResponse = await fetch(
          `http://localhost:5000/product/chitietsp/${id}`
        );
        const productData = await productResponse.json();
        setFormData({ ...productData.product });
      } catch (error) {
        setErrorMessage("Đã xảy ra lỗi khi tải dữ liệu.");
      }
    };
    fetchProductAndCategories();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      hinh_anh: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const { ten_san_pham, gia_san_pham, id_thuong_hieu } = formData;
    if (!ten_san_pham || !gia_san_pham || !id_thuong_hieu) {
      setErrorMessage("Vui lòng điền tất cả các trường bắt buộc.");
      return;
    }

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key !== "hinh_anh") {
        data.append(key, formData[key]);
      }
    });

    if (formData.hinh_anh) {
      data.append("hinh_anh", formData.hinh_anh);
    }

    try {
      const response = await fetch(
        `http://localhost:5000/product/capnhatsp/${id}`,
        {
          method: "PUT",
          body: data,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Cập nhật sản phẩm không thành công"
        );
      }

      await Swal.fire({
        title: "Thành công!",
        text: "Sản phẩm đã được cập nhật thành công",
        icon: "success",
        confirmButtonText: "OK",
      });

      window.location.href = "/admin/components/quanlyadmin/sanpham";
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error.message);

      await Swal.fire({
        title: "Lỗi!",
        text: "Đã xảy ra lỗi khi cập nhật sản phẩm: " + error.message,
        icon: "error",
        confirmButtonText: "OK",
      });
      setErrorMessage("Đã xảy ra lỗi khi cập nhật sản phẩm: " + error.message);
    }
  };

  return (
    <div className={styles.SidebarContainer}>
      <section id={styles.content}>
        <div className={styles.header1}>
          <div className={styles.title} style={{ fontWeight: "bold" }}>
            Danh Sách Sản Phẩm
          </div>
          <div className={styles.timestamp} id="timestamp"></div>
        </div>
        <div className={styles.bg}>
          <form onSubmit={handleSubmit}>
            <div className={styles.container1}>
              <div className={styles.formGroup}>
                <label htmlFor="ten_san_pham">Tên sản phẩm</label>
                <input
                  type="text"
                  id="ten_san_pham"
                  name="ten_san_pham"
                  value={formData.ten_san_pham}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="ten">Tên chi tiết</label>
                <input
                  type="text"
                  id="ten"
                  name="ten"
                  value={formData.ten}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="gia_san_pham">Giá sản phẩm</label>
                <input
                  type="text"
                  id="gia_san_pham"
                  name="gia_san_pham"
                  value={formData.gia_san_pham}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="gia_giam">Giá giảm</label>
                <input
                  type="text"
                  id="gia_giam"
                  name="gia_giam"
                  value={formData.gia_giam}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="id_thuong_hieu">Danh mục</label>
                <select
                  id="id_thuong_hieu"
                  name="id_thuong_hieu"
                  value={formData.id_thuong_hieu}
                  onChange={handleChange}
                >
                  <option value="">Chọn danh mục</option>
                  {cates.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.thuong_hieu}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="ma_san_pham">Mã sản phẩm</label>
                <input
                  type="text"
                  id="ma_san_pham"
                  name="ma_san_pham"
                  value={formData.ma_san_pham}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="do_chiu_nuoc">Độ chịu nước</label>
                <input
                  type="text"
                  id="do_chiu_nuoc"
                  name="do_chiu_nuoc"
                  value={formData.do_chiu_nuoc}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="xuat_xu">Xuất xứ</label>
                <input
                  type="text"
                  id="xuat_xu"
                  name="xuat_xu"
                  value={formData.xuat_xu}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="gioi_tinh">Giới tính</label>
                <input
                  type="text"
                  id="gioi_tinh"
                  name="gioi_tinh"
                  value={formData.gioi_tinh}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="so_luong">Số lượng</label>
                <input
                  type="text"
                  id="so_luong"
                  name="so_luong"
                  value={formData.so_luong}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="loai">Loại</label>
                <input
                  type="text"
                  id="loai"
                  name="loai"
                  value={formData.loai}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="loai_may">Loại máy</label>
                <input
                  type="text"
                  id="loai_may"
                  name="loai_may"
                  value={formData.loai_may}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="duong_kinh">Đường kính</label>
                <input
                  type="text"
                  id="duong_kinh"
                  name="duong_kinh"
                  value={formData.duong_kinh}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="chat_lieu_day">Chất liệu dây</label>
                <input
                  type="text"
                  id="chat_lieu_day"
                  name="chat_lieu_day"
                  value={formData.chat_lieu_day}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="chat_lieu_vo">Chất liệu vỏ</label>
                <input
                  type="text"
                  id="chat_lieu_vo"
                  name="chat_lieu_vo"
                  value={formData.chat_lieu_vo}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="mat_kinh">Mặt kính</label>
                <input
                  type="text"
                  id="mat_kinh"
                  name="mat_kinh"
                  value={formData.mat_kinh}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="mau_mat">Màu mặt</label>
                <input
                  type="text"
                  id="mau_mat"
                  name="mau_mat"
                  value={formData.mau_mat}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="phong_cach">Phong cách</label>
                <input
                  type="text"
                  id="phong_cach"
                  name="phong_cach"
                  value={formData.phong_cach}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="kieu_dang">Kiểu dáng</label>
                <input
                  type="text"
                  id="kieu_dang"
                  name="kieu_dang"
                  value={formData.kieu_dang}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="thuong_hieu">Thương hiệu</label>
                <input
                  type="text"
                  id="thuong_hieu"
                  name="thuong_hieu"
                  value={formData.thuong_hieu}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="size_day">Size dây</label>
                <input
                  type="text"
                  id="size_day"
                  name="size_day"
                  value={formData.size_day}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="mau_day">Màu dây</label>
                <input
                  type="text"
                  id="mau_day"
                  name="mau_day"
                  value={formData.mau_day}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="do_dai_day">Độ dài dây</label>
                <input
                  type="text"
                  id="do_dai_day"
                  name="do_dai_day"
                  value={formData.do_dai_day}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="hinh_anh">Hình ảnh</label>
                <input
                  type="file"
                  id="hinh_anh"
                  name="hinh_anh"
                  onChange={handleFileChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="mo_ta">Mô tả sản phẩm</label>
                <textarea
                  id="mo_ta"
                  name="mo_ta"
                  value={formData.mo_ta}
                  onChange={handleChange}
                />
              </div>
              {errorMessage && (
                <div className="alert alert-danger">{errorMessage}</div>
              )}
              <button type="submit" className="btn btn-outline-primary">
                Cập nhật
              </button>
              <Link href="/admin/components/quanlyadmin/sanpham">
              <button href="/admin/components/quanlyadmin/sanpham" type="button" className="btn btn-outline-secondary w-100">
                Hủy bỏ
              </button>
              </Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
