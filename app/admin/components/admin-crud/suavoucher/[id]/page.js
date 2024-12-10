"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import styles from "./suavoucher.module.css";
import Swal from "sweetalert2";
import { useRouter, useParams } from "next/navigation";

export default function SuaVoucher() {
  const [maVouchers, setmaVouchers] = useState("");
  const [giatri, setgiatri] = useState("");
  const [ngayBD, setngayBD] = useState("");
  const [ngayKT, setngayKT] = useState("");
  const [mota, setmota] = useState("");
  const [mota2, setmota2] = useState("");
  const [soluong, setsoluong] = useState("");
  const [phantram, setphantram] = useState("");
  const [don_hang_toi_thieu, setdon_hang_toi_thieu] = useState("");
  const router = useRouter();
  const { id } = useParams();

  const convertToVietnamTime = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString();
  };
  const convertFromVietnamTime = (dateString) => {
    const date = new Date(dateString);
    const localDate = new Date(date.getTime() - 7 * 60 * 60 * 1000);
    return localDate.toISOString().slice(0, 16); // Format for input[type="datetime-local"]
  };

  useEffect(() => {
    const fetchVoucher = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/voucher/getVoucherById/${id}`
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Data from API:", data);
          setmaVouchers(data.ma_voucher);
          setgiatri(data.gia_tri);
          setsoluong(data.so_luong);
          setphantram(data.phan_tram);
          setngayBD(convertFromVietnamTime(data.bat_dau));
          setngayKT(convertFromVietnamTime(data.ket_thuc));
          setmota(data.mo_ta);
          setmota2(data.mota2);
          setdon_hang_toi_thieu(data.don_hang_toi_thieu);
        } else {
          Swal.fire("Error", "Không tìm thấy voucher!", "error");
        }
      } catch (error) {
        console.error("Error fetching Voucher:", error);
        Swal.fire("Error", "Có lỗi xảy ra khi tải thông tin!", "error");
      }
    };
    fetchVoucher();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !maVouchers ||
      !soluong ||
      !ngayBD ||
      !ngayKT ||
      !mota2 ||
      (!phantram && !giatri)
    ) {
      Swal.fire({
        icon: "warning",
        title: "Thiếu thông tin",
        text: "Vui lòng nhập đầy đủ thông tin!",
      });
      return;
    }
    if (isNaN(giatri)) {
      Swal.fire("Error", "Giá trị voucher phải là số!", "error");
      return;
    }
    const startDate = new Date(ngayBD);
    const endDate = new Date(ngayKT);
    if (startDate >= endDate) {
      Swal.fire("Error", "Ngày kết thúc phải sau ngày bắt đầu!", "error");
      return;
    }

    const formData = {
      ma_voucher: maVouchers,
      gia_tri: giatri,
      so_luong: soluong,
      phan_tram: phantram,
      bat_dau: convertToVietnamTime(ngayBD),
      ket_thuc: convertToVietnamTime(ngayKT),
      mo_ta: mota,
      mota2: mota2,
      don_hang_toi_thieu: don_hang_toi_thieu,
    };

    try {
      const response = await fetch(
        `http://localhost:5000/voucher/updateVoucher/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Sửa voucher thành công!",
        }).then(() => {
          router.push("/admin/components/quanlyadmin/voucher");
        });
      } else {
        Swal.fire("Error", "Có lỗi xảy ra!", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error", "Có lỗi xảy ra!", "error");
    }
  };

  return (
    <div className={styles.SidebarContainer}>
      <section id={styles.content}>
        <div className={styles.header1}>
          <div className={styles.title} style={{ fontWeight: "bold" }}>
            Cập nhật Voucher
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
                  value={giatri}
                  onChange={(e) => setgiatri(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="phantram">Phần trăm</label>
                <input
                  type="text"
                  id="phantram"
                  className="phantram"
                  value={phantram}
                  onChange={(e) => setphantram(e.target.value)}
                />
              </div>{" "}
              <div className={styles.formGroup}>
                <label htmlFor="soluong">Số Lượng</label>
                <input
                  type="text"
                  id="soluong"
                  className="soluong"
                  value={soluong}
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
                  value={ngayBD}
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
                  value={ngayKT}
                  onChange={(e) => setngayKT(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="description">Đơn hàng tối thiểu</label>
                <input
                  id="don_hang_toi_thieu"
                  name="don_hang_toi_thieu"
                  value={don_hang_toi_thieu}
                  onChange={(e) => setdon_hang_toi_thieu(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="description">Tiêu đề</label>
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
                onSubmit={handleSubmit}>
                Cập nhật
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() =>
                  router.push("/admin/components/quanlyadmin/voucher")
                }>
                Hủy bỏ
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
