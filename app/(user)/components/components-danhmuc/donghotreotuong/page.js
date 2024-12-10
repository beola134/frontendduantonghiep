"use client";
import styles from "./donghotreotuong.module.css";
import classNames from "classnames/bind";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Loading from "../../loading/page";
const cx = classNames.bind(styles);

export default function DongHoTreoTuong() {
  const [products, setProduct] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const [filter, setFilter] = useState({
    muc_gia: "",
    phong_cach: "",
    chat_lieu_vo: "",
    danh_muc: "",
    mau_mat: "",
    kieu_dang: "",
  });

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({ ...filter, page: currentPage });
      const response = await fetch(
        `http://localhost:5000/product/filterTreoTuong/5307799c-55ae-4bfd-83d4-3ed6e219ff5f?${queryParams}`
      );
      if (!response.ok) {
        throw new Error("Lỗi không thể tải dữ liệu");
      }
      const data = await response.json();
      setProduct(data.products);
      setTotalPages(data.totalPages);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filter, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchProducts();
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = [...selectedFilter];
    const newFilter = { ...(filter || {}), [filterType]: value };

    const filterIndex = newFilters.findIndex((filter) =>
      filter.startsWith(`${filterType}=`)
    );
    if (filterIndex !== -1) {
      newFilters[filterIndex] = `${filterType}=${value}`;
    } else {
      newFilters.push(`${filterType}=${value}`);
    }
    // Cập nhật trạng thái bộ lọc
    setSelectedFilter(newFilters);
    setFilter(newFilter);

    if (filterType === "danh_muc") {
      setCategoryName(value);
    }
  };
  const handleClearFilters = () => {
    setSelectedFilter([]);
    setFilter({
      gioi_tinh: "",
    });
    setCurrentPage(1);

    fetchProducts();
  };

  const handleRemoveFilter = (filterToRemove) => {
    if (!filterToRemove.includes("=")) return;
    const newFilters = selectedFilter.filter(
      (filter) => filter !== filterToRemove
    );
    const [filterType] = filterToRemove.split("=");
    const updatedFilter = { ...(filter || {}), [filterType]: "" };

    setSelectedFilter(newFilters);
    setFilter(updatedFilter);
    fetchProducts();
  };

  const sortProducts = (products) => {
    if (sortOption === "asc") {
      return [...products].sort((a, b) => a.gia_san_pham - b.gia_san_pham);
    } else if (sortOption === "desc") {
      return [...products].sort((a, b) => b.gia_san_pham - a.gia_san_pham);
    }
    return products;
  };

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };
  return (
    <>
      <div className={cx("container-header")}>
        <div id="main-container" className={cx("mt20")}>
          <div className={cx("main-column")}>
            <div className={cx("center-1col")}>
              <div className={cx("banner-cat-manuf")}>
                <img src="/image/banner/banner-donghotreotuong.jpg" alt="" />
              </div>
              <div className={cx("clear")} />
              {/* container */}
              <div className={cx("container")}>
                <div className={cx("clear")} />
                <div className={cx("all-summary")}>
                  <div className={cx("summary-content-filter", "description")}>
                    <p>
                      <Link href="#">
                        <em>
                          <strong>Đồng hồ treo tường</strong>
                        </em>
                      </Link>
                      &nbsp;được coi là một món đồ nội thất trang trí&nbsp;tuyệt
                      vời, biến mỗi không gian sống trở nên ấm ấp, sinh động,
                      tươi vui hoặc theo bất kỳ phong cách nào mà bạn muốn. Dù
                      bạn có là người kỹ tính luôn yêu cầu mọi thứ phải cầu toàn
                      đi chăng nữa thì thế giới phong phú của
                      <em>
                        <strong>
                          <Link href="#">
                            {" "}
                            đồng hồ treo tường&nbsp;trang trí{" "}
                          </Link>
                          &nbsp;&nbsp;
                        </strong>
                      </em>
                      tại
                      <em>
                        <strong> WRISTLY Watch</strong>{" "}
                      </em>
                      &nbsp;với đầy đủ các thiết kế, kiểu dáng, kích thước, màu
                      sắc...đều sẽ khiến bạn hài lòng.
                    </p>
                  </div>
                  <div className={cx("view-more")}>Xem thêm</div>
                </div>
                {selectedFilter.length > 0 && (
                  <div className={styles.choosedfilter}>
                    {selectedFilter.map((filter, index) => (
                      <Link
                        key={index}
                        rel="nofollow"
                        href="#"
                        onClick={() => handleRemoveFilter(filter)}
                      >
                        {filter.split("=")[1]}
                      </Link>
                    ))}
                    <Link
                      rel="nofollow"
                      className={styles.reset}
                      href="#"
                      onClick={handleClearFilters}
                    >
                      Xoá hết
                    </Link>
                  </div>
                )}
                <div className={cx("clear")} />
                <div className={cx("products-cat")}>
                  <div className={cx("block-products-filter")}>
                    <div className={cx("block-product-filter", "cls")}>
                      <div className={cx("field-area", "field-item")}>
                        <div
                          className={cx(
                            "field-name",
                            "normal",
                            "field",
                            "field-opened"
                          )}
                          data-id="id-field-loai"
                        >
                          Loại
                        </div>
                        <div
                          id="loai"
                          className={cx(
                            "field-label",
                            "filters-in-field",
                            "filters-in-field-0-column",
                            "filter-4-loai"
                          )}
                        >
                          <span className={cx("close")}>x</span>
                          <div className={cx("filters-in-field-inner", "cls")}>
                            <div className={cx("cls", "item")}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Quả Lắc"
                                onClick={() =>
                                  handleFilterChange("phong_cach", "Quả Lắc")
                                }
                              >
                                Quả Lắc
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* item2 */}
                      <div className={cx("field-area", "field-item")}>
                        <div
                          className={cx(
                            "field-name",
                            "normal",
                            "field",
                            "field-opened"
                          )}
                          data-id="id-field-manufactory"
                        >
                          Thương hiệu
                        </div>
                        <div
                          id="manufactory"
                          className={cx(
                            "field-label",
                            "filters-in-field",
                            "filters-in-field-0-column",
                            "filter-4-manufactory"
                          )}
                        >
                          <span className={cx("close")}>x</span>
                          <div className={cx("filters-in-field-inner", "cls")}>
                            <div className={cx("cls", "item")}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="SEIKO"
                                onClick={() =>
                                  handleFilterChange("thuong_hieu", "SEIKO")
                                }
                              >
                                SEIKO
                              </Link>
                            </div>
                            <div className={cx("cls", "item")}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="RHYTHM"
                                onClick={() =>
                                  handleFilterChange("thuong_hieu", "RHYTHM")
                                }
                              >
                                RHYTHM
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* item3 */}
                      <div className={cx("field-area", "field-item")}>
                        <div
                          className={cx(
                            "field-name",
                            "normal",
                            "field",
                            "field-opened"
                          )}
                          data-id="id-field-price"
                        >
                          Mức giá
                        </div>
                        <div
                          id="price"
                          className={cx(
                            "field-label",
                            "filters-in-field",
                            "filters-in-field-0-column",
                            "filter-4-price"
                          )}
                        >
                          <span className={cx("close")}>x</span>
                          <div className={cx("filters-in-field-inner", "cls")}>
                            <div className={cx("cls", "item")}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Dưới 2 triệu"
                                onClick={() =>
                                  handleFilterChange("muc_gia", "Dưới 2 triệu")
                                }
                              >
                                Dưới 2 triệu
                              </Link>
                            </div>
                            <div className={cx("cls", "item")}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Từ 2 triệu đến 5 triệu"
                                onClick={() =>
                                  handleFilterChange(
                                    "muc_gia",
                                    "Từ 2 triệu đến 5 triệu"
                                  )
                                }
                              >
                                Từ 2 triệu đến 5 triệu
                              </Link>
                            </div>
                            <div className={cx("cls", "item")}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Trên 5 triệu"
                                onClick={() =>
                                  handleFilterChange("muc_gia", "Trên 5 triệu")
                                }
                              >
                                Trên 5 triệu
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* item4 */}
                      <div className={cx("field-area", "field-item")}>
                        <div
                          className={cx(
                            "field-name",
                            "normal",
                            "field",
                            "field-opened"
                          )}
                          data-id="id-field-vo-may"
                        >
                          Vỏ máy
                        </div>
                        <div
                          id="vo-may"
                          className={cx(
                            "field-label",
                            "filters-in-field",
                            "filters-in-field-0-column",
                            "filter-4-vo-may"
                          )}
                        >
                          <span className={cx("close")}>x</span>
                          <div className={cx("filters-in-field-inner", "cls")}>
                            <div className={cx("cls", "item")}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Thủy Tinh"
                                onClick={() =>
                                  handleFilterChange(
                                    "chat_lieu_vo",
                                    "Thủy Tinh"
                                  )
                                }
                              >
                                Thủy Tinh
                              </Link>
                            </div>
                            <div className={cx("cls", "item")}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Nhựa"
                                onClick={() =>
                                  handleFilterChange("chat_lieu_vo", "Nhựa")
                                }
                              >
                                Nhựa
                              </Link>
                            </div>
                            <div className={cx("cls", "item")}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Gỗ"
                                onClick={() =>
                                  handleFilterChange("chat_lieu_vo", "Gỗ")
                                }
                              >
                                Gỗ
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* item5 */}
                      <div className={cx("field-area", "field-item")}>
                        <div
                          className={cx(
                            "field-name",
                            "normal",
                            "field",
                            "field-opened"
                          )}
                          data-id="id-field-kieu-dang"
                        >
                          Kiểu dáng
                        </div>
                        <div
                          id="kieu-dang"
                          className={cx(
                            "field-label",
                            "filters-in-field",
                            "filters-in-field-0-column",
                            "filter-4-kieu-dang"
                          )}
                        >
                          <span className={cx("close")}>x</span>
                          <div className={cx("filters-in-field-inner", "cls")}>
                            <div className={cx("cls", "item")}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Mặt vuông"
                                onClick={() =>
                                  handleFilterChange("kieu_dang", "Mặt vuông")
                                }
                              >
                                Mặt vuông
                              </Link>
                            </div>
                            <div className={cx("cls", "item")}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Mặt tròn"
                                onClick={() =>
                                  handleFilterChange("kieu_dang", "Mặt tròn")
                                }
                              >
                                Mặt tròn
                              </Link>
                            </div>
                            <div className={cx("cls", "item")}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Mặt chữ nhật"
                                onClick={() =>
                                  handleFilterChange(
                                    "kieu_dang",
                                    "Mặt chữ nhật"
                                  )
                                }
                              >
                                Mặt chữ nhật
                              </Link>
                            </div>
                            <div className={cx("cls", "item")}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Mặt Oval"
                                onClick={() =>
                                  handleFilterChange("kieu_dang", "Mặt Oval")
                                }
                              >
                                Mặt Oval
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* item6 */}
                      <div className={cx("field-area", "field-item")}>
                        <div
                          className={cx(
                            "field-name",
                            "normal",
                            "field",
                            "field-opened"
                          )}
                          data-id="id-field-mau-mat"
                        >
                          Màu mặt
                        </div>
                        <div
                          id="mau-mat"
                          className={cx(
                            "field-label",
                            "filters-in-field",
                            "filters-in-field-1-column",
                            "filter-4-mau-mat"
                          )}
                        >
                          <span className={cx("close")}>x</span>
                          <div className={cx("filters-in-field-inner", "cls")}>
                            <div className={cx("cls", "item")}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Trắng"
                                onClick={() =>
                                  handleFilterChange("mau_mat", "Trắng")
                                }
                              >
                                Trắng
                              </Link>
                            </div>
                            <div className={cx("cls", "item")}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Đen"
                                onClick={() =>
                                  handleFilterChange("mau_mat", "Đen")
                                }
                              >
                                Đen
                              </Link>
                            </div>
                            <div className={cx("cls", "item")}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Xanh lam"
                                onClick={() =>
                                  handleFilterChange("mau_mat", "Xanh lam")
                                }
                              >
                                Xanh lam
                              </Link>
                            </div>
                            <div className={cx("cls", "item")}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Vàng"
                                onClick={() =>
                                  handleFilterChange("mau_mat", "Vàng")
                                }
                              >
                                Vàng
                              </Link>
                            </div>
                            <div className={cx("cls", "item")}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Đỏ"
                                onClick={() =>
                                  handleFilterChange("mau_mat", "Đỏ")
                                }
                              >
                                Đỏ
                              </Link>
                            </div>
                            <div className={cx("cls", "item")}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Nâu"
                                onClick={() =>
                                  handleFilterChange("mau_mat", "Nâu")
                                }
                              >
                                Nâu
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={cx("field-title")}>
                    <div className={cx("title-name")}>
                      <div className={cx("cat-title")}>
                        <div className={cx("cat-title-main")} id="cat-dong-ho">
                          <div className={cx("title-icon")}>
                            <h1>Đồng hồ treo tường</h1>
                          </div>
                        </div>
                        <div className={cx("clear")} />
                      </div>
                    </div>
                    <select
                      className={cx("order-select")}
                      name="order-select"
                      onChange={handleSortChange}
                    >
                      <option value="">Sắp xếp theo</option>
                      <option value="asc">Giá từ thấp tới cao</option>
                      <option value="desc">Giá từ cao tới thấp</option>
                      <option value="newest">Mới nhất</option>
                      <option value="hot">Sản phẩm hot</option>
                    </select>
                    <div className={cx("clear")} />
                  </div>

                  <div className={cx("clear")} />

                  <section className={cx("products-cat-frame")}>
                    <div className={cx("products-cat-frame-inner")}>
                      <div className={cx("product-grid", "cls")}>
                        {displayedProducts.map((item) => (
                          <div className={cx("item")}>
                            <Link
                              href={`/components/product-detail/${item._id}`}
                            >
                              <div className={cx("frame-inner")}>
                                <figure className={cx("product-image")}>
                                  <img
                                    src={`http://localhost:5000/images/${item.hinh_anh}`}
                                    alt={item.ten_san_pham} //son
                                    width={300}
                                    height={363}
                                    style={{
                                      display: "inline-block",
                                      opacity: 1,
                                    }}
                                  />
                                </figure>
                                <h3>
                                  <Link
                                    href="#"
                                    className={cx("name")}
                                    title={item.ten_san_pham}
                                  >
                                    <span className={cx("cat-name")}>
                                      {item.ten_san_pham}
                                    </span>
                                    {item.ma_san_pham}
                                  </Link>
                                </h3>
                                <span className={cx("loai-may")}>
                                  {item.loai}{" "}
                                </span>
                                <span className={cx("row-lm")}>|</span>
                                <span className={cx("duong-kinh")}>
                                  {item.duong_kinh}
                                </span>
                                <div className={cx("price-arae")}>
                                  <div className={cx("price-current")}>
                                    {formatCurrency(item.gia_san_pham)}
                                  </div>
                                </div>
                                <div className={cx("clear")} />
                              </div>
                              <div className={cx("clear")} />
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* phân trang*/}
                  <div className={cx("pagination")}>
                    {/* Prev trang đầu */}
                    <span
                      title="First page"
                      className={cx({
                        disabled: currentPage === 1,
                        "other-page": currentPage > 1,
                      })}
                      onClick={() => currentPage > 1 && handlePageChange(1)}
                    >
                      ‹‹
                    </span>

                    {/* Prev 1 trang */}
                    <span
                      className={cx({
                        disabled: currentPage === 1,
                        "other-page": currentPage > 1,
                      })}
                      onClick={() =>
                        currentPage > 1 && handlePageChange(currentPage - 1)
                      }
                    >
                      ‹
                    </span>

                    {/* Trang hiện tại */}
                    <span className={cx("currentPage")}>
                      {`Trang ${currentPage} / ${totalPages || 1}`}
                    </span>

                    {/* Next 1 trang */}
                    <span
                      className={cx({
                        disabled: currentPage === totalPages,
                        "other-page": currentPage < totalPages,
                      })}
                      onClick={() =>
                        currentPage < totalPages &&
                        handlePageChange(currentPage + 1)
                      }
                    >
                      ›
                    </span>

                    {/* Next tới trang cuối */}
                    <span
                      className={cx({
                        disabled: currentPage === totalPages,
                        "other-page": currentPage < totalPages,
                      })}
                      onClick={() =>
                        currentPage < totalPages && handlePageChange(totalPages)
                      }
                    >
                      ››
                    </span>
                  </div>

                  <div className={styles.clear}></div>
                </div>
                <div className={cx("clear")} />
                {/* đánh giá  */}
                <div className={cx("evaluate-cat")}>
                  <div className={cx("rating-area", "cls")}>
                    <span id="ratings" className={cx("cls")}>
                      <i
                        className={cx("icon_v1", "star_on")}
                        id="rate_1"
                        value={1}
                      />
                      <i
                        className={cx("icon_v1", "star_on")}
                        id="rate_2"
                        value={2}
                      />
                      <i
                        className={cx("icon_v1", "star_on")}
                        id="rate_3"
                        value={3}
                      />
                      <i
                        className={cx("icon_v1", "star_off")}
                        id="rate_4"
                        value={4}
                      />
                      <i
                        className={cx("icon_v1", "star_off")}
                        id="rate_5"
                        value={5}
                      />
                    </span>
                    <span className={cx("rating-note")}>
                      Nhấn vào đây để đánh giá
                    </span>
                  </div>

                  {/* mô tả */}
                  <div
                    className={cx(
                      "summary-content-cat",
                      "description",
                      "height-auto"
                    )}
                    style={{
                      height: isExpanded ? "auto" : "360px",
                      overflow: isExpanded ? "visible" : "hidden",
                    }}
                  >
                    <h2 dir="ltr" style={{ textAlign: "center" }}>
                      <span style={{ color: "#2980b9" }}>
                        <strong>
                          NÂNG CẤP&nbsp;KHÔNG GIAN SỐNG&nbsp;CỦA BẠN VỚI ĐỒNG HỒ
                          TREO TƯỜNG TRANG TRÍ
                        </strong>
                      </span>
                    </h2>
                    <p dir="ltr" style={{ textAlign: "justify" }}>
                      &nbsp;
                    </p>
                    <p dir="ltr" style={{ textAlign: "justify" }}>
                      Bạn đã bao giờ nghĩ đến trước khi đồng hồ được phát minh,
                      người xưa đã theo dõi thời gian nhờ chuyển động của mặt
                      trời như thế nào chưa. Đồng hồ giúp chúng ta quản lý cuộc
                      sống của mình.
                      <strong>
                        <em>Đồng hồ treo tường</em>
                      </strong>
                      &nbsp;là một vật dụng quan trọng trong gia đình&nbsp;giúp
                      bạn luôn đúng giờ, đến đúng nơi, đúng lúc để có được thành
                      công trong cuộc sống.
                    </p>
                    <div style={{ textAlign: "center" }}>
                      <figure
                        className={cx("image")}
                        style={{ display: "inline-block" }}
                      >
                        <img
                          alt="Đồng hồ treo tường Seiko"
                          height={734}
                          className={cx("lazy")}
                          width={1100}
                          style={{ display: "inline-block", opacity: 1 }}
                          src="/image/item/donghotreotuong-hinh1.jpg"
                        />
                        <figcaption>
                          <strong>
                            <Link href="#">
                              Stonehenge, một trong những đồng hồ mặt trời được
                              biết đến đầu tiên
                            </Link>
                          </strong>
                        </figcaption>
                      </figure>
                    </div>
                    <p dir="ltr" style={{ textAlign: "justify" }}>
                      Nếu muốn cạnh tranh với thế giới ngày nay để thành công,
                      điều rất quan trọng là phải biết ảnh hưởng của thời gian
                      đối với cuộc sống của chúng ta. Để coi trọng thời gian,
                      bạn nên đúng giờ, bạn cần có
                      <em>
                        <strong>đồng hồ treo tường</strong>
                      </em>{" "}
                      xung quanh mình. Và thực sự với một hoặc nhiều chiếc đồng
                      hồ treo tường hiện diện trong không gian sống của bạn nó
                      sẽ khiến bạn và gia đình mình kiểm soát được thời gian
                      trong mọi hoạt động của cuộc sống, góp phần cải thiện chất
                      lượng sống của mình.
                    </p>
                    <div style={{ textAlign: "center" }}>
                      <figure
                        className={cx("image")}
                        style={{ display: "inline-block" }}
                      >
                        <img
                          alt="đồng hồ treo tường Seiko"
                          height={734}
                          className={cx("lazy")}
                          width={1100}
                          style={{ display: "inline-block", opacity: 1 }}
                          src="/image/item/donghotreotuong_hinh2.jpg"
                        />
                        <figcaption>
                          <strong>
                            Đồng hồ tháp chuông Big Ben tại London
                          </strong>
                        </figcaption>
                      </figure>
                    </div>
                    <p dir="ltr" style={{ textAlign: "justify" }}>
                      <Link href="#">
                        <em>
                          <strong>Đồng hồ treo tường sang trọng</strong>
                        </em>
                      </Link>
                      &nbsp;không chỉ giúp bạn nhìn thấy đúng thời điểm và nó
                      cũng là một phần trang trí rất tuyệt vời cho ngôi nhà, văn
                      phòng làm việc hay bất cứ không gian nào khác. Bên cạnh
                      đó, lựa chọn
                      <em>
                        <strong>
                          <Link href="#">đồng hồ treo tường</Link>
                        </strong>
                        <Link href="#">
                          <strong>&nbsp;đẹp</strong>
                        </Link>
                      </em>
                      &nbsp;là một trong những ưu tiên hàng đầu khi nghĩ đến
                      thiết kế nội thất trong căn nhà của bạn. Một không gian
                      sống hiện đại được hưởng lợi từ những đường nét tinh tế
                      trên những chiếc&nbsp;
                      <strong>
                        <Link href="#">
                          <em>đồng hồ treo tường cao cấp</em>
                        </Link>
                      </strong>
                      sẽ khiến bạn và người thân của mình hoàn toàn hài lòng với
                      chúng.
                    </p>
                    <div style={{ textAlign: "center" }}>
                      <figure
                        className={cx("image")}
                        style={{ display: "inline-block" }}
                      >
                        <img
                          alt="Đồng hồ treo tường Seiko"
                          height={734}
                          className={cx("lazy")}
                          width={1100}
                          style={{ display: "inline-block", opacity: 1 }}
                          src="/image/item/donghotreotuong-hinh3.jpg"
                        />
                        <figcaption>
                          <strong>
                            Đồng hồ treo tường trang trí không gian sống
                          </strong>
                        </figcaption>
                      </figure>
                    </div>
                    <p dir="ltr" style={{ textAlign: "justify" }}>
                      &nbsp;
                    </p>
                    <p dir="ltr" style={{ textAlign: "justify" }}>
                      Cho dù bạn đang tìm kiếm một chiếc
                      <Link href="#">
                        <em>
                          <strong>đồng hồ treo tường đẹp</strong>
                        </em>
                      </Link>
                      &nbsp;theo phong cách cổ điển hay sang trọng và tinh tế,
                      <strong>
                        <Link href="#">Đồng hồ WRISTLY</Link>
                      </strong>{" "}
                      có hơn&nbsp;800+ mẫu cho bạn lựa chọn đến từ thương hiệu
                      <em>
                        <strong>
                          <Link href="#"> đồng hồ treo tường&nbsp;Seiko </Link>
                        </strong>
                      </em>
                      và
                      <em>
                        <strong>
                          <Link href="#"> đồng hồ treo tường&nbsp;Rhythm </Link>
                        </strong>
                      </em>
                      , với nhiều kiểu dáng và mức giá khác nhau…
                    </p>
                    <p dir="ltr" style={{ textAlign: "justify" }}>
                      &nbsp;
                    </p>
                    <p dir="ltr" style={{ textAlign: "justify" }}>
                      <em>
                        <strong>Các thông tin tham khảo thêm</strong>
                      </em>
                    </p>
                    <ul dir="ltr">
                      <li>
                        <Link href="#">
                          ĐỊA CHỈ BÁN ĐỒNG HỒ TREO TƯỜNG UY TÍN TẠI HÀ NỘI
                        </Link>
                      </li>
                      <li style={{ textAlign: "justify" }}>
                        <Link href="#">
                          HƯỚNG DẪN LỰA CHỌN ĐỒNG HỒ TREO TƯỜNG CHO NGÔI NHÀ CỦA
                          BẠN
                        </Link>
                      </li>
                      <li style={{ textAlign: "justify" }}>
                        <Link href="#">
                          TOP CÁC MẪU ĐỒNG HỒ TREO TƯỜNG&nbsp;TRANG TRÍ PHÒNG
                          KHÁCH ĐẸP
                        </Link>
                      </li>
                      <li style={{ textAlign: "justify" }}>
                        <Link href="#">HỆ THỐNG CỬA HÀNG CỦA WRISTLY</Link>
                      </li>
                    </ul>
                    <p>&nbsp;</p>
                    <p>
                      <span style={{ color: "#2980b9" }}>
                        <em>
                          <strong>WRISTLY WATCH</strong> luôn&nbsp;mang đến cho
                          khách hàng những chiếc
                          <strong>đồng hồ treo tường đẹp</strong>&nbsp;đáp ứng
                          hoàn hảo&nbsp;cho cuộc&nbsp;sống hiện&nbsp;đại, thể
                          hiện nét thẩm mỹ tối giản và thêm sức hấp dẫn trực
                          quan cho không gian sống của mình.
                        </em>
                      </span>
                    </p>
                  </div>
                </div>
                {/* xem thêm */}
                <div className={cx("vm-summary-content-cat")}>
                  <span onClick={toggleDescription}>
                    {isExpanded ? "Thu gọn" : "Xem thêm"}
                  </span>
                </div>
                <div className={cx("clear")} />
                <div className={cx("aq-relates content-li")} />
              </div>
            </div>
            {/* end - đồng hồ nam */}
            <div className={cx("clear")} />
          </div>
        </div>
      </div>
    </>
  );
}
