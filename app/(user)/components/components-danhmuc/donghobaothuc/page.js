"use client";
import Link from "next/link";
import styles from "../../components-thuonghieu/donghonu/donghonu.module.css";
import { useEffect, useState } from "react";
import Loading from "../../loading/page";

export default function TrangsucCK() {
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState(""); // Tiêu đề danh mục
  const [selectedFilter, setSelectedFilter] = useState([]); // Lưu trữ các bộ lọc đã chọn
  const [sortOption, setSortOption] = useState(""); // Tuỳ chọn sắp xếp (tăng/giảm dần)
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Bộ lọc mặc định cho đồng hồ nữ
  const [filter, setFilter] = useState({
    chat_lieu_vo: "",
  });
  // 1. Hàm gọi API để lấy danh sách sản phẩm dựa vào bộ lọc và phân trang
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({ ...filter, page: currentPage });
      const response = await fetch(
        `http://localhost:5000/product/filterBaoThuc/c247b7f4-01bf-4203-bd39-a4087b9dac08?${queryParams}`
      );
      if (!response.ok) {
        throw new Error("Lỗi không thể tải dữ liệu");
      }
      const data = await response.json();
      setProducts(data.products); // Cập nhật danh sách sản phẩm
      setTotalPages(data.totalPages); // Cập nhật tổng số trang
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. Gọi lại API khi bộ lọc hoặc trang hiện tại thay đổi
  useEffect(() => {
    fetchProducts();
  }, [filter, currentPage]);

  // 3. Hàm chuyển trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchProducts();
  };

  // 4. Hàm cập nhật bộ lọc khi chọn mới
  const handleFilterChange = (filterType, value) => {
    const newFilters = [...selectedFilter];
    const newFilter = { ...filter, [filterType]: value };

    // Cập nhật hoặc thêm bộ lọc vào danh sách đã chọn
    const filterIndex = newFilters.findIndex((filter) => filter.startsWith(`${filterType}=`));
    if (filterIndex !== -1) {
      newFilters[filterIndex] = `${filterType}=${value}`;
    } else {
      newFilters.push(`${filterType}=${value}`);
    }
    // Cập nhật trạng thái bộ lọc
    setSelectedFilter(newFilters);
    setFilter(newFilter);

    // Đặt lại danh mục khi chọn một danh mục khác
    if (filterType === "danh_muc") {
      setCategoryName(value);
    }
  };

  // 5. Hàm xóa tất cả bộ lọc và đặt lại về trạng thái ban đầu
  const handleClearFilters = () => {
    setSelectedFilter([]);
    setFilter({
      gioi_tinh: "Nu",
    });
    setCurrentPage(1);
    setCategoryName("Đồng hồ nữ");
    fetchProducts();
  };

  // 6. Hàm xóa một bộ lọc cụ thể
  const handleRemoveFilter = (filterToRemove) => {
    // Loại bỏ bộ lọc cụ thể khỏi selectedFilter
    const newFilters = selectedFilter.filter((filter) => filter !== filterToRemove);

    // Cập nhật filter dựa trên các bộ lọc còn lại
    const [filterType] = filterToRemove.split("=");
    const updatedFilter = { ...filter, [filterType]: "" }; // Xóa giá trị của bộ lọc bị xoá

    // Nếu xoá danh mục (brand), đặt lại tiêu đề về đồng hồ nam
    if (filterType === "danh_muc") {
      setCategoryName("Đồng hồ nữ");
    }
    setSelectedFilter(newFilters);
    setFilter(updatedFilter);
    fetchProducts();
  };

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

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <p>Error:{error}</p>;
  }
  const displayedProducts = sortProducts(products);
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
                  <div className={styles["block-products-filter"]}>
                    <div className={styles["block-product-filter"]}>
                      {/* Thương hiệu  */}
                      <div className={`${styles["field-area"]} ${styles["field-item"]}`}>
                        <div
                          className={`${styles["field-name"]} ${styles.normal} ${styles.field} ${styles["field-opened"]}`}
                        >
                          Thương hiệu
                        </div>
                        <div
                          id="brand"
                          className={`${styles["field-label"]} ${styles["filters-in-field"]} ${styles["filters-in-field-3-column"]} ${styles["filter-brand"]}`}
                        >
                          <span className={styles.close}>x</span>
                          <div className={`${styles["filters-in-field-inner"]} ${styles.cls}`}>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="SEIKO"
                                onClick={() => handleFilterChange("thuong_hieu", "SEIKO")}
                              >
                                SEIKO
                              </Link>
                            </div>

                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="RHYTHM"
                                onClick={() => handleFilterChange("thuong_hieu", "RHYTHM")}
                              >
                                RHYTHM
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/*Chất liệu vỏ */}
                      <div className={`${styles["field-area"]} ${styles["field-item"]}`}>
                        <div
                          className={`${styles["field-name"]} ${styles.normal} ${styles.field} ${styles["field-opened"]}`}
                          data-id="id-field-chat-lieu-vo"
                        >
                          Chất liệu vỏ
                        </div>
                        <div
                          id="chat-lieu-vo"
                          className={`${styles["field-label"]} ${styles["filters-in-field"]} ${styles["filters-in-field-2-column"]} ${styles["filter-4-chat-lieu-vo"]}`}
                        >
                          <span className={styles.close}>x</span>
                          <div className={`${styles["filters-in-field-inner"]} ${styles.cls}`}>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Nhựa"
                                onClick={() => handleFilterChange("chat_lieu_vo", "Nhựa")}
                              >
                                Nhựa
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Nhôm"
                                onClick={() => handleFilterChange("chat_lieu_vo", "Nhôm")}
                              >
                                Nhôm
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {selectedFilter.length > 0 && (
                    <div className={styles.choosedfilter}>
                      {selectedFilter.map((filter, index) => (
                        <Link key={index} rel="nofollow" href="#" onClick={() => handleRemoveFilter(filter)}>
                          {filter.split("=")[1]} {/*Hiển thị các bộ lọc đã chọn*/}
                        </Link>
                      ))}
                      <Link rel="nofollow" className={styles.reset} href="#" onClick={handleClearFilters}>
                        Xoá hết
                      </Link>
                    </div>
                  )}
                  <div className={styles.clear}></div>
                  <div className={styles["field-title"]}>
                    <div className={styles["title-name"]}>
                      <div className={styles["cat-title"]}>
                        <h1>ĐỒNG HỒ BÁO THỨC</h1>
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
