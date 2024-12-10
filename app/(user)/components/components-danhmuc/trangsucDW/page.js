"use client";
import Link from "next/link";
import styles from "../../components-thuonghieu/donghonu/donghonu.module.css";
import { useEffect, useState } from "react";

export default function TrangsucCK() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 10;

  // 7. Hàm sắp xếp sản phẩm theo giá
  const sortProducts = (products) => {
    if (sortOption === "asc") {
      return [...products].sort((a, b) => a.gia_san_pham - b.gia_san_pham); // Giá từ thấp đến cao
    } else if (sortOption === "desc") {
      return [...products].sort((a, b) => b.gia_san_pham - a.gia_san_pham); // Giá từ cao đến thấp
    }
    return products; // Trả về danh sách gốc nếu không sắp xếp
  };
  // 8. Cập nhật tuỳ chọn sắp xếp
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/product/getProductByCate/08bcf894-7d6b-4488-8639-701306321e22"
        );
        if (!response.ok) {
          throw new Error("Lỗi không thể tải dữ liệu");
        }
        const data = await response.json();
        setProducts(data.products);
        setTotalPages(Math.ceil(data.products.length / itemsPerPage)); // Giả sử mỗi trang hiển thị 10 sản phẩm
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedProducts = sortProducts(products).slice(startIndex, endIndex);
  return (
    <>
      <div className={styles["container-header"]}>
        <div id="main-container" className={styles.mt20}>
          <div className={styles["main-column"]}>
            <div className={styles["center-1col"]}>
              <div className={styles.clear}></div>
              <div className={styles.container}>
                <div className={styles.clear}></div>
                <div className={styles["products-cat"]}>
                  <div className={styles["field-title"]}>
                    <div className={styles["title-name"]}>
                      <div className={styles["cat-title"]}>
                        <h1>Trang sức DW</h1>
                      </div>
                    </div>

                    <select
                      className={styles["order-select"]}
                      name="order-select"
                      onChange={handleSortChange}
                      value={sortOption}
                    >
                      <option value="">Sắp xếp theo</option>
                      <option value="asc">Giá từ thấp tới cao</option>
                      <option value="desc">Giá từ cao tới thấp</option>
                      <option value="newest">Mới nhất</option>
                    </select>
                    <div className={styles.clear}></div>
                  </div>

                  <section className={styles["products-cat-frame"]}>
                    <div className={styles["products-cat-frame-inner"]}>
                      {loading ? (
                        <p>Đang tải...</p>
                      ) : error ? (
                        <p>{error}</p>
                      ) : (
                        <div className={styles["product-grid"]}>
                          {/* item-1 */}
                          {displayedProducts.map((product) => {
                            const {
                              _id,
                              ten,
                              ten_san_pham,
                              ma_san_pham,
                              gia_san_pham,
                              gia_giam,
                              hinh_anh,
                              loai,
                              duong_kinh,
                            } = product;
                            const roundDiscount = (discountPercentage) => {
                              const discountLevels = [10, 15, 20, 25, 30, 40, 50];
                              return discountLevels.reduce((prev, curr) =>
                                Math.abs(curr - discountPercentage) < Math.abs(prev - discountPercentage) ? curr : prev
                              );
                            };
                            return (
                              <div key={_id} className={styles.item}>
                                <div className={styles["frame-inner"]}>
                                  <figure className={styles["product-image"]}>
                                    <Link href={`/components/product-detail/${_id}`}>
                                      <img
                                        src={`http://localhost:5000/images/${hinh_anh}`}
                                        alt={ten}
                                        width="300"
                                        height="363"
                                        style={{
                                          display: "inline-block",
                                          opacity: "1",
                                        }}
                                      />
                                    </Link>
                                  </figure>
                                  <h3>
                                    <Link className={styles.name} href="#" title={ten}>
                                      <span className={styles["cat-name"]}>{ten_san_pham}</span>
                                      {ma_san_pham}
                                    </Link>
                                  </h3>
                                  <span className={styles["loai-may"]}>{loai}</span>
                                  <span className={styles["row-lm"]}>|</span>
                                  <span className={styles["duong-kinh"]}>{duong_kinh}</span>
                                  <div className={styles["price-area"]}>
                                    <div className={styles["price-current"]}>
                                      Giá: <span>{gia_san_pham.toLocaleString("vi-VN")}₫</span>
                                    </div>
                                  </div>

                                  <div className={styles.clear}></div>
                                </div>
                                {/* end .frame-inner */}
                                <div className={styles.clear}></div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Phân trang */}
                  <div className={styles.pagination}>
                    <span
                      title="First page"
                      className={currentPage === 1 ? styles.disabled : styles["other-page"]}
                      onClick={() => currentPage > 1 && handlePageChange(1)}
                    >
                      ‹‹
                    </span>
                    <span
                      className={currentPage === 1 ? styles.disabled : styles["other-page"]}
                      onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    >
                      ‹
                    </span>
                    <span className={styles.currentPage}>{`Trang ${currentPage} / ${totalPages || 1}`}</span>
                    <span
                      className={currentPage === totalPages ? styles.disabled : styles["other-page"]}
                      onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                    >
                      ›
                    </span>
                    <span
                      className={currentPage === totalPages ? styles.disabled : styles["other-page"]}
                      onClick={() => currentPage < totalPages && handlePageChange(totalPages)}
                    >
                      ››
                    </span>
                  </div>
                </div>
                <div className={styles.clear}></div>
              </div>
            </div>
            <div className={styles.clear}></div>
          </div>
        </div>
      </div>
    </>
  );
}
