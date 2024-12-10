"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import styles from "./themvoucher.module.css";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function ThemVoucher() {
  const [maVouchers, setmaVouchers] = useState("");
  const [giatri, setgiatri] = useState("");
  const [ngayBD, setngayBD] = useState("");
  const [ngayKT, setngayKT] = useState("");
  const [soluong, setsoluong] = useState("");
  const [phantram, setphantram] = useState("");
  const [mota, setmota] = useState("");
  const [mota2, setmota2] = useState("");
  const [don_hang_toi_thieu, setdon_hang_toi_thieu] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const convertToVietnamTime = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!maVouchers) {
      Swal.fire({
        icon: "warning",
        title: "Thiếu thông tin",
        text: "Vui lòng nhập mã voucher!",
      });
      return;
    }
    if (giatri && phantram) {
      Swal.fire({
        icon: "warning",
        title: "Thông tin không hợp lệ",
        text: "Vui lòng chỉ nhập giá trị hoặc phần trăm",
      });
      return;
    }
    if (!ngayBD) {
      Swal.fire({
        icon: "warning",
        title: "Thiếu thông tin",
        text: "Vui lòng ngày bắt đầu tính giá trị voucher",
      });
      return;
    }
    if (!ngayKT) {
      Swal.fire({
        icon: "warning",
        title: "Thiếu thông tin",
        text: "Vui lòng ngày kết thúc tính giá trị voucher",
      });
      return;
    }

    const formData = {
      ma_voucher: maVouchers,
      gia_tri: giatri,
      bat_dau: convertToVietnamTime(ngayBD),
      ket_thuc: convertToVietnamTime(ngayKT),
      mo_ta: mota,
      mota2: mota2,
      so_luong: soluong,
      phan_tram: phantram,
      don_hang_toi_thieu: don_hang_toi_thieu,
    };

    try {
      const response = await fetch("http://localhost:5000/voucher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Thêm voucher thành công!",
        }).then(() => {
          router.push("/admin/components/quanlyadmin/voucher");
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
            Thêm Voucher
          </div>
          <div className={styles.timestamp} id="timestamp"></div>
        </div>
        <div className={styles.bg}>
          <form onSubmit={handleSubmit}>
            <div className={styles.container1}>
              <div className={styles.formGroup}>
                <label htmlFor="ma_Voucher">Mã Voucher</label>
                <input
                  type="text"
                  id="ma_Voucher"
                  className="ma_Voucher"
                  value={maVouchers}
                  onChange={(e) => setmaVouchers(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="giatri">Giá trị voucher</label>
                <input
                  type="text"
                  id="giatri"
                  className="giatri"
                  onChange={(e) => setgiatri(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="phantram">Phần trăm</label>
                <input
                  type="text"
                  id="phantram"
                  className="phantram"
                  onChange={(e) => setphantram(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="giatri">Số lượng</label>
                <input
                  type="text"
                  id="soluong"
                  className="soluong"
                  onChange={(e) => setsoluong(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="ngayBD">
                  Ngày bắt đầu tính giá trị voucher
                </label>
                <input
                  type="datetime-local"
                  id="ngayBD"
                  className="ngayBD"
                  onChange={(e) => setngayBD(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="ngayKT">
                  Ngày kết thúc tính giá trị voucher
                </label>
                <input
                  type="datetime-local"
                  id="ngayKT"
                  className="ngayKT"
                  onChange={(e) => setngayKT(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="donhangtoithieu">Đơn hàng tối thiểu</label>
                <input
                  id="donhangtoithieu"
                  name="donhangtoithieu"
                  value={don_hang_toi_thieu}
                  onChange={(e) => setdon_hang_toi_thieu(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="donhangtoithieu">Tiêu đề</label>
                <input
                  id="tieu_de"
                  name="tieu_de"
                  value={mota2}
                  onChange={(e) => setmota2(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="description">Mô tả voucher</label>
                <textarea
                  id="description"
                  name="description"
                  value={mota}
                  onChange={(e) => setmota(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-outline-primary"
                onClick={handleSubmit}>
                Thêm
              </button>
              <Link href="/admin/components/quanlyadmin/voucher">
                <button
                  type="button"
                  className="btn btn-outline-secondary w-100">
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
