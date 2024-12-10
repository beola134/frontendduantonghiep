import React, { useState, useEffect } from "react";
import styles from "./dieukien.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function VoucherModal({ isOpen, onRequestClose, voucherId }) {
  const [voucher, setVoucher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && voucherId) {
      setLoading(true); // Reset loading state khi mở modal
      fetch(`http://localhost:5000/voucher/getVoucherById/${voucherId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch voucher");
          }
          return response.json();
        })
        .then((data) => {
          setVoucher(data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    }
  }, [isOpen, voucherId]);

  const handleCopy = (voucherCode) => {
    navigator.clipboard.writeText(voucherCode)
      .then(() => {
        toast.success(`Mã ${voucherCode} đã được sao chép thành công!`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      })
      .catch(() => {
        toast.error("Không thể sao chép mã. Vui lòng thử lại.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
  };

  if (!isOpen) return null;
  if (loading) return <div className={styles.overlay}><p>Loading...</p></div>;
  if (error) return <div className={styles.overlay}><p>Error: {error.message}</p></div>;

  return (
    <>
      <ToastContainer />
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <h3 className={styles.title}>VOUCHER</h3>
          <div className={styles.content}>
            <p>
              <strong>Mã khuyến mãi:</strong> {voucher?.ma_voucher}
            </p>
            <p>
              <strong>Điều kiện:</strong> {voucher?.mo_ta}
            </p>
          </div>
          <div className={styles.buttonContainer}>
          {voucher.so_luong > 0 ? (
                    <button
                      className={styles.copyButton}
                      onClick={() => handleCopy(voucher.ma_voucher)}
                    >
                      Copy
                    </button>
                  ) : (
                    <button className={`${styles.copyButton} ${styles.disabled} `}>Hết Voucher</button>
                  )}
            <button
              className={styles.closeButton}
              onClick={onRequestClose}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default VoucherModal;
