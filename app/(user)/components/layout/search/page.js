"use client";
import React, { useEffect, useState } from "react";
import styles from "./search.module.css";
import classNames from "classnames/bind";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const cx = classNames.bind(styles);

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [results, setResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Hiển thị 20 mục mỗi trang

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  useEffect(() => {
    const query = searchParams.get("query");
    if (query) {
      setSearchQuery(query);

      const fetchData = async () => {
        try {
          const response = await fetch(
            "http://localhost:5000/product/timkiem",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ query }),
            }
          );

          const data = await response.json();
          setResults(data.products);
        } catch (error) {
          console.error("Lỗi khi fetch dữ liệu:", error);
        }
      };

      fetchData();
    }
  }, [searchParams]);

  // Tính số trang
  const totalPages = Math.ceil(results.length / itemsPerPage);

  // Lấy kết quả của trang hiện tại
  const currentResults = results.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Xử lý thay đổi trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className={cx("search-results")}>
      <h2>
        Có <b>{results.length}</b> sản phẩm với từ khóa: <b>{searchQuery}</b>
      </h2>
      {results.length > 0 ? (
        <>
          <div className={cx("dongho-list")}>
            {currentResults.map((item) => (
              <div key={item._id} className={styles.watch}>
                <div className={styles.discountBadge}>
                  -
                  {Math.floor(
                    ((item.gia_san_pham - item.gia_giam) / item.gia_san_pham) *
                      100
                  )}
                  %
                </div>
                <Link href={`/components/product-detail/${item._id}`}>
                  <img
                    src={`http://localhost:5000/images/${item.hinh_anh}`}
                    alt={item.ten_san_pham}
                  />
                </Link>
                <p>
                  <small>{item.ten_san_pham}</small>
                </p>
                <b>{item.ma_san_pham}</b>
                <p>
                  <small>
                    {item.loai} | {item.duong_kinh}
                  </small>
                </p>
                <p>
                  <small style={{ textDecoration: "line-through" }}>
                    Giá: {formatCurrency(item.gia_san_pham)}
                  </small>
                </p>
                <p>
                  <span className={styles.priceKm}>
                    Giá KM: {formatCurrency(item.gia_giam)}
                  </span>
                </p>
              </div>
            ))}
          </div>

          {/* Điều khiển phân trang */}
          <div className={styles.pagination}>
                    {/* Prev trang đâù */}
                    <span
                      title="First page"
                      className={
                        currentPage === 1
                          ? styles.disabled
                          : styles["other-page"]
                      }
                      onClick={() => currentPage > 1 && handlePageChange(1)}
                    >
                      ‹‹
                    </span>
                    {/* Prev 1 trang */}
                    <span
                      className={
                        currentPage === 1
                          ? styles.disabled
                          : styles["other-page"]
                      }
                      onClick={() =>
                        currentPage > 1 && handlePageChange(currentPage - 1)
                      }
                    >
                      ‹
                    </span>
                    {/* Trang hiện tại */}
                    <span
                      className={styles.currentPage}
                    >{`Trang ${currentPage} / ${totalPages || 1}`}</span>
                    {/* Next 1 trang*/}
                    <span
                      className={
                        currentPage === totalPages
                          ? styles.disabled
                          : styles["other-page"]
                      }
                      onClick={() =>
                        currentPage < totalPages &&
                        handlePageChange(currentPage + 1)
                      }
                    >
                      ›
                    </span>
                    {/* Next tới trang cuối */}
                    <span
                      className={
                        currentPage === totalPages
                          ? styles.disabled
                          : styles["other-page"]
                      }
                      onClick={() =>
                        currentPage < totalPages && handlePageChange(totalPages)
                      }
                    >
                      ››
                    </span>
                  </div>
        </>
      ) : (
        <p>Không tìm thấy sản phẩm nào</p>
      )}
    </div>
  );
}
