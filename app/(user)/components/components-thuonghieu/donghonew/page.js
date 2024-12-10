"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./donghonam.module.css";
import Loading from "../../loading/page";
import { useSearchParams } from "next/navigation";

export default function DonghoNam() {
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("Đồng hồ nam mới");
  const [selectedFilter, setSelectedFilter] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();

  // Bộ lọc mặc định cho đồng hồ nam
  const [filter, setFilter] = useState({
    gioi_tinh: "",
    thuong_hieu: "",
    muc_gia: "",
    khuyenmai: "",
    loai_may: "",
    duong_kinh: "",
    chat_lieu_day: "",
    chat_lieu_vo: "",
    mat_kinh: "",
    mau_mat: "",
    phong_cach: "",
    kieu_dang: "",
    xuat_xu: "",
  });

  useEffect(() => {
    const query = searchParams.get("query");
    if (query) {
      const parsedFilters = Object.fromEntries(
        new URLSearchParams(query).entries()
      );

      if (parsedFilters.gioi_tinh === "Nam") {
        setCategoryName("Đồng hồ nam mới");
      } else if (parsedFilters.gioi_tinh === "Nữ") {
        setCategoryName("Đồng hồ nữ mới");
      } else if (parsedFilters.gioi_tinh === "Đồng Hồ Đôi") {
        setCategoryName("Đồng hồ đôi mới");
      }
      setFilter((prevFilter) => ({
        ...prevFilter,
        ...parsedFilters,
      }));

      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `http://localhost:5000/product/filtersanphamdongho?${query}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          setProducts(data.products || []);
          setTotalPages(data.totalPages || 1);
          setError(null);
        } catch (error) {
          console.error("Lỗi khi fetch dữ liệu:", error);
          setError("Lỗi khi tải dữ liệu");
          setProducts([]);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({ ...filter, page: currentPage });
      const response = await fetch(
        `http://localhost:5000/product/filtersanphamdongho?${queryParams}`
      );
      if (!response.ok) {
        throw new Error("Lỗi không thể tải dữ liệu");
      }
      const data = await response.json();
      setProducts(data.products);
      setTotalPages(data.totalPages || 1);
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
    const newFilter = { ...filter, [filterType]: value };

    const filterIndex = newFilters.findIndex((filter) =>
      filter.startsWith(`${filterType}=`)
    );
    if (filterIndex !== -1) {
      newFilters[filterIndex] = `${filterType}=${value}`;
    } else {
      newFilters.push(`${filterType}=${value}`);
    }

    setSelectedFilter(newFilters);
    setFilter(newFilter);
    setCurrentPage(1);

    if (filterType === "thuong_hieu") {
      setCategoryName(value);
    }
  };

  const handleClearFilters = () => {
    setSelectedFilter([]);
    setFilter({
      gioi_tinh: "Nam",
    });
    setCurrentPage(1);
    setCategoryName("Đồng hồ nam");
    fetchProducts();
  };

  const handleRemoveFilter = (filterToRemove) => {
    const newFilters = selectedFilter.filter(
      (filter) => filter !== filterToRemove
    );

    const [filterType] = filterToRemove.split("=");
    const updatedFilter = { ...filter, [filterType]: "" };

    if (filterType === "thuong_hieu") {
      setCategoryName("Đồng hồ nam");
    }
    setSelectedFilter(newFilters);
    setFilter(updatedFilter);
    fetchProducts();
  };

  const sortProducts = (products) => {
    if (sortOption === "asc") {
      return [...products].sort((a, b) => a.gia_giam - b.gia_giam);
    } else if (sortOption === "desc") {
      return [...products].sort((a, b) => b.gia_giam - a.gia_giam);
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
    return <p>Error: {error}</p>;
  }

  const displayedProducts = sortProducts(products); // sắp xếp sản phẩm trước khi hiển thị
  return (
    <>
      <div className={styles["container-header"]}>
        <div id="main-container" className={styles.mt20}>
          <div className={styles["main-column"]}>
            <div className={styles["center-1col"]}>
              <div className={styles.clear}></div>
              <div className={styles.clear}></div>
              <div className={styles.container}>
                <div className={styles.clear}></div>
                <div className={styles["all-summary"]}>
                  <div
                    className={styles["summary-content-filter"]}
                    style={{ description: true }}
                  >
                    <p>
                      Đến với thế giới <strong>đồng hồ nam</strong> của Wristly,
                      bạn sẽ được sở hữu hàng nghìn sản phẩm chất lượng, thiết
                      kế bắt mắt đến từ các thương hiệu&nbsp;
                      <em>
                        <strong>
                          <Link href="#" target="_blank">
                            đồng hồ&nbsp;Thụy Sỹ
                          </Link>
                        </strong>
                      </em>
                      , Nhật Bản, Pháp, Mỹ…danh tiếng trên thế giới. Mọi sản
                      phẩm đều đảm bảo
                      <strong>&nbsp;100% hàng chính hãng</strong> kèm theo{" "}
                      <strong>chế độ bảo hành chính hãng</strong> đặc biệt với
                      mức giá hợp lý sẽ đem đến cho bạn phụ kiện hoàn hảo nhất;
                      khẳng định đẳng cấp, phong cách riêng của bản thân
                    </p>
                  </div>

                  <div className={styles["view-more"]}>Xem thêm</div>
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
                        {filter.split("=")[1]} {/*Hiển thị các bộ lọc đã chọn*/}
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

                <div className={styles.clear}></div>
                <div className={styles["products-cat"]}>
                  <div className={styles["block-products-filter"]}>
                    <div className={styles["block-product-filter"]}>
                      {/* Giới tính */}
                      <div
                        className={`${styles["field-area"]} ${styles["field-item"]}`}
                      >
                        <div
                          className={`${styles["field-name"]} ${styles.normal} ${styles.field}`}
                        >
                          Giới tính
                        </div>
                        <div
                          className={`${styles["field-label"]} ${styles["filters-in-field"]} ${styles["filters-in-field-0-column"]}`}
                        >
                          <span className={styles.close}>x</span>
                          <div
                            className={`${styles["filters-in-field-inner"]} ${styles.cls}`}
                          >
                            <Link
                              rel="nofollow"
                              href="/components/components-thuonghieu/donghonew?query=gioi_tinh=Nam"
                                onClick={() =>
                                  handleFilterChange("gioi_tinh", "Nam")
                                }
                              title="Đồng hồ nam"
                            >
                              <span>Đồng hồ nam</span>
                            </Link>
                            <Link
                              rel="nofollow"
                                href="/components/components-thuonghieu/donghonew?query=gioi_tinh=Nữ"
                              title="Đồng hồ nữ"
                              onClick={() =>
                                  handleFilterChange("gioi_tinh", "Nữ")
                                }
                            >
                              <span>Đồng hồ nữ</span>
                            </Link>
                            <Link
                              rel="nofollow"
                              href="/components/components-thuonghieu/donghonew?query=gioi_tinh=Đồng Hồ Đôi"
                              onClick={() =>
                                  handleFilterChange("gioi_tinh", "Đồng Hồ Đôi")
                                }
                              title="Đồng hồ đôi"
                            >
                              <span>Đồng hồ đôi</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                      {/* Thương hiệu  */}
                      <div
                        className={`${styles["field-area"]} ${styles["field-item"]}`}
                      >
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
                          <div
                            className={`${styles["filters-in-field-inner"]} ${styles.cls}`}
                          >
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="LONGINES"
                                onClick={() =>
                                  handleFilterChange("thuong_hieu", "LONGINES")
                                }
                              >
                                LONGINES
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="TISSOT"
                                onClick={() =>
                                  handleFilterChange("thuong_hieu", "TISSOT")
                                }
                              >
                                TISSOT
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="MIDO"
                                onClick={() =>
                                  handleFilterChange("thuong_hieu", "MIDO")
                                }
                              >
                                MIDO
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="CERTINA"
                                onClick={() =>
                                  handleFilterChange("thuong_hieu", "CERTINA")
                                }
                              >
                                CERTINA
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="HAMILTON"
                                onClick={() =>
                                  handleFilterChange("thuong_hieu", "HAMILTON")
                                }
                              >
                                HAMILTON
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="TITONI"
                                onClick={() =>
                                  handleFilterChange("thuong_hieu", "TITONI")
                                }
                              >
                                TITONI
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="FREDERIQUECONSTANT"
                                onClick={() =>
                                  handleFilterChange(
                                    "thuong_hieu",
                                    "FREDERIQUECONSTANT"
                                  )
                                }
                              >
                                FREDERIQUE CONSTANT
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="CALVINKLEIN"
                                onClick={() =>
                                  handleFilterChange("thuong_hieu", "CALVINKLEIN")
                                }
                              >
                                CALVIN KLEIN
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="EDOX"
                                onClick={() =>
                                  handleFilterChange("thuong_hieu", "EDOX")
                                }
                              >
                                EDOX
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="CLAUDEBERNARD"
                                onClick={() =>
                                  handleFilterChange(
                                    "thuong_hieu",
                                    "CLAUDEBERNARD"
                                  )
                                }
                              >
                                CLAUDE BERNARD
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
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
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="CITIZEN"
                                onClick={() =>
                                  handleFilterChange("thuong_hieu", "CITIZEN")
                                }
                              >
                                CITIZEN
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="ORIENT"
                                onClick={() =>
                                  handleFilterChange("thuong_hieu", "ORIENT")
                                }
                              >
                                ORIENT
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="CASIO"
                                onClick={() =>
                                  handleFilterChange("thuong_hieu", "CASIO")
                                }
                              >
                                CASIO
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="OLYMPIANUS"
                                onClick={() =>
                                  handleFilterChange("thuong_hieu", "OLYMPIANUS")
                                }
                              >
                                OLYM PIANUS
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="DANIEL WELLINGTON"
                                onClick={() =>
                                  handleFilterChange(
                                    "thuong_hieu",
                                    "DANIELWELLINGTON"
                                  )
                                }
                              >
                                DANIEL WELLINGTON
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="FOSSIL"
                                onClick={() =>
                                  handleFilterChange("thuong_hieu", "FOSSIL")
                                }
                              >
                                FOSSIL
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="SKAGEN"
                                onClick={() =>
                                  handleFilterChange("thuong_hieu", "SKAGEN")
                                }
                              >
                                SKAGEN
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="MICHAEL KORS"
                                onClick={() =>
                                  handleFilterChange("thuong_hieu", "MICHAELKORS")
                                }
                              >
                                MICHAEL KORS
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Mức giá */}
                      <div
                        className={`${styles["field-area"]} ${styles["field-item"]}`}
                      >
                        <div
                          className={`${styles["field-name"]} ${styles.normal} ${styles.field} ${styles["field-opened"]}`}
                        >
                          Mức giá
                        </div>
                        <div
                          id="price"
                          className={`${styles["field-label"]} ${styles["filters-in-field"]} ${styles["filters-in-field-1-column"]} ${styles["filter-4-price"]}`}
                        >
                          <span className={styles.close}>x</span>
                          <div
                            className={`${styles["filters-in-field-inner"]} ${styles.cls}`}
                          >
                            <div className={`${styles.cls} ${styles.item}`}>
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
                            <div className={`${styles.cls} ${styles.item}`}>
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
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Từ 5 triệu đến 10 triệu"
                                onClick={() =>
                                  handleFilterChange(
                                    "muc_gia",
                                    "Từ 5 triệu đến 10 triệu"
                                  )
                                }
                              >
                                Từ 5 triệu đến 10 triệu
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Từ 10 triệu đến 20 triệu"
                                onClick={() =>
                                  handleFilterChange(
                                    "muc_gia",
                                    "Từ 10 triệu đến 20 triệu"
                                  )
                                }
                              >
                                Từ 10 triệu đến 20 triệu
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Từ 20 triệu đến 30 triệu"
                                onClick={() =>
                                  handleFilterChange(
                                    "muc_gia",
                                    "Từ 20 triệu đến 30 triệu"
                                  )
                                }
                              >
                                Từ 20 triệu đến 30 triệu
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Từ 30 triệu đến 50 triệu"
                                onClick={() =>
                                  handleFilterChange(
                                    "muc_gia",
                                    "Từ 30 triệu đến 50 triệu"
                                  )
                                }
                              >
                                Từ 30 triệu đến 50 triệu
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Từ 50 triệu đến 100 triệu"
                                onClick={() =>
                                  handleFilterChange(
                                    "muc_gia",
                                    "Từ 50 triệu đến 100 triệu"
                                  )
                                }
                              >
                                Từ 50 triệu đến 100 triệu
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Trên 100 triệu"
                                onClick={() =>
                                  handleFilterChange(
                                    "muc_gia",
                                    "Trên 100 triệu"
                                  )
                                }
                              >
                                Trên 100 triệu
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Khuyến mãi */}
                      <div
                        className={`${styles["field-area"]} ${styles["field-item"]}`}
                      >
                        <div
                          className={`${styles["field-name"]} ${styles.normal} ${styles.field} ${styles["field-opened"]}`}
                          data-id="id-field-discount"
                        >
                          Khuyến mại
                        </div>
                        <div
                          id="discount"
                          className={`${styles["field-label"]} ${styles["filters-in-field"]} ${styles["filters-in-field-1-column"]} ${styles["filter-4-discount"]}`}
                        >
                          <span className={styles.close}>x</span>
                          <div
                            className={`${styles["filters-in-field-inner"]} ${styles.cls}`}
                          >
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Giảm 10%"
                                onClick={() =>
                                  handleFilterChange("khuyenmai", "Giảm 10%")
                                }
                              >
                                Giảm 10%
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Giảm 15%"
                                onClick={() =>
                                  handleFilterChange("khuyenmai", "Giảm 15%")
                                }
                              >
                                Giảm 15%
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Giảm 20%"
                                onClick={() =>
                                  handleFilterChange("khuyenmai", "Giảm 20%")
                                }
                              >
                                Giảm 20%
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Giảm 25%"
                                onClick={() =>
                                  handleFilterChange("khuyenmai", "Giảm 25%")
                                }
                              >
                                Giảm 25%
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Giảm 30%"
                                onClick={() =>
                                  handleFilterChange("khuyenmai", "Giảm 30%")
                                }
                              >
                                Giảm 30%
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Giảm 40%"
                                onClick={() =>
                                  handleFilterChange("khuyenmai", "Giảm 40%")
                                }
                              >
                                Giảm 40%
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Giảm 50%"
                                onClick={() =>
                                  handleFilterChange("khuyenmai", "Giảm 50%")
                                }
                              >
                                Giảm 50%
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Loại máy */}
                      <div
                        className={`${styles["field-area"]} ${styles["field-item"]}`}
                      >
                        <div
                          className={`${styles["field-name"]} ${styles.normal} ${styles.field} ${styles["field-opened"]}`}
                          data-id="id-field-loai-may"
                        >
                          Loại máy
                        </div>
                        <div
                          id="loai-may"
                          className={`${styles["field-label"]} ${styles["filters-in-field"]} ${styles["filters-in-field-1-column"]} ${styles["filter-4-loai-may"]}`}
                        >
                          <span className={styles.close}>x</span>
                          <div
                            className={`${styles["filters-in-field-inner"]} ${styles.cls}`}
                          >
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Automatic (Máy cơ tự động)"
                                onClick={() =>
                                  handleFilterChange(
                                    "loai_may",
                                    "Automatic (Máy cơ tự động)"
                                  )
                                }
                              >
                                Automatic (Máy cơ tự động)
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Quartz (Máy pin - điện tử)"
                                onClick={() =>
                                  handleFilterChange(
                                    "loai_may",
                                    "Quartz (Máy pin - điện tử)"
                                  )
                                }
                              >
                                Quartz (Máy pin - điện tử)
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Eco-Drive (Năng lượng ánh sáng)"
                                onClick={() =>
                                  handleFilterChange(
                                    "loai_may",
                                    "Eco-Drive (Năng lượng ánh sáng)"
                                  )
                                }
                              >
                                Eco-Drive (Năng lượng ánh sáng)
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Quartz Chronograph (Máy pin bấm giờ thể thao)"
                                onClick={() =>
                                  handleFilterChange(
                                    "loai_may",
                                    "Quartz Chronograph (Máy pin bấm giờ thể thao)"
                                  )
                                }
                              >
                                Quartz Chronograph (Máy pin bấm giờ thể thao)
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Automatic Chronometer (Máy cơ tự động chuẩn COSC)"
                                onClick={() =>
                                  handleFilterChange(
                                    "loai_may",
                                    "Automatic Chronometer (Máy cơ tự động chuẩn COSC)"
                                  )
                                }
                              >
                                Automatic Chronometer (Máy cơ tự động chuẩn
                                COSC)
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Quartz Chronometer (Máy pin chuẩn COSC)"
                                onClick={() =>
                                  handleFilterChange(
                                    "loai_may",
                                    "Quartz Chronometer (Máy pin chuẩn COSC)"
                                  )
                                }
                              >
                                Quartz Chronometer (Máy pin chuẩn COSC)
                              </Link>
                            </div>
                            <div
                              className={`${styles.cls} ${styles.item}`}
                              onClick={() =>
                                handleFilterChange(
                                  "loai_may",
                                  "Automatic Chronograph (Máy cơ tự động bấm giờ thể thao)"
                                )
                              }
                            >
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Automatic Chronograph (Máy cơ tự động bấm giờ thể thao)"
                              >
                                Automatic Chronograph (Máy cơ tự động bấm giờ
                                thể thao)
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Quartz Solar (Năng lượng ánh sáng)"
                                onClick={() =>
                                  handleFilterChange(
                                    "loai_may",
                                    "Quartz Solar (Năng lượng ánh sáng)"
                                  )
                                }
                              >
                                Quartz Solar (Năng lượng ánh sáng)
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Đồng hồ cơ lên giây cót bằng tay ( Manual winding )"
                                onClick={() =>
                                  handleFilterChange(
                                    "loai_may",
                                    "Đồng hồ cơ lên giây cót bằng tay ( Manual winding )"
                                  )
                                }
                              >
                                Đồng hồ cơ lên giây cót bằng tay ( Manual
                                winding )
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/*Đường kính */}
                      <div
                        className={`${styles["field-area"]} ${styles["field-item"]}`}
                      >
                        <div
                          className={`${styles["field-name"]} ${styles.normal} ${styles.field} ${styles["field-opened"]}`}
                          data-id="id-field-duong-kinh"
                        >
                          Đường kính
                        </div>
                        <div
                          id="duong-kinh"
                          className={`${styles["field-label"]} ${styles["filters-in-field"]} ${styles["filters-in-field-1-column"]} ${styles["filter-4-duong-kinh"]}`}
                        >
                          <span className={styles.close}>x</span>
                          <div
                            className={`${styles["filters-in-field-inner"]} ${styles.cls}`}
                          >
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Dưới 25mm"
                                onClick={() =>
                                  handleFilterChange("duong_kinh", "Dưới 25mm")
                                }
                              >
                                Dưới 25mm
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="25mm đến 30mm"
                                onClick={() =>
                                  handleFilterChange(
                                    "duong_kinh",
                                    "25mm đến 30mm"
                                  )
                                }
                              >
                                25mm đến 30mm
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="30mm đến 35mm"
                                onClick={() =>
                                  handleFilterChange(
                                    "duong_kinh",
                                    "30mm đến 35mm"
                                  )
                                }
                              >
                                30mm đến 35mm
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="35mm đến 38mm"
                                onClick={() =>
                                  handleFilterChange(
                                    "duong_kinh",
                                    "35mm đến 38mm"
                                  )
                                }
                              >
                                35mm đến 38mm
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="38mm đến 40mm"
                                onClick={() =>
                                  handleFilterChange(
                                    "duong_kinh",
                                    "38mm đến 40mm"
                                  )
                                }
                              >
                                38mm đến 40mm
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="40mm đến 42mm"
                                onClick={() =>
                                  handleFilterChange(
                                    "duong_kinh",
                                    "40mm đến 42mm"
                                  )
                                }
                              >
                                40mm đến 42mm
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="42mm đến 45mm"
                                onClick={() =>
                                  handleFilterChange(
                                    "duong_kinh",
                                    "42mm đến 45mm"
                                  )
                                }
                              >
                                42mm đến 45mm
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Từ 45mm trở lên"
                                onClick={() =>
                                  handleFilterChange(
                                    "duong_kinh",
                                    "Từ 45mm trở lên"
                                  )
                                }
                              >
                                Từ 45mm trở lên
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/*Chất liệu dây  */}
                      <div
                        className={`${styles["field-area"]} ${styles["field-item"]}`}
                      >
                        <div
                          className={`${styles["field-name"]} ${styles.normal} ${styles.field} ${styles["field-opened"]}`}
                          data-id="id-field-chat-lieu-day"
                        >
                          Chất liệu dây
                        </div>
                        <div
                          id="chat-lieu-day"
                          className={`${styles["field-label"]} ${styles["filters-in-field"]} ${styles["filters-in-field-2-column"]} ${styles["filter-4-chat-lieu-day"]}`}
                        >
                          <span className={styles.close}>x</span>
                          <div
                            className={`${styles["filters-in-field-inner"]} ${styles.cls}`}
                          >
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Dây da"
                                onClick={() =>
                                  handleFilterChange("chat_lieu_day", "Dây da")
                                }
                              >
                                Dây da
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Thép không gỉ 316L"
                                onClick={() =>
                                  handleFilterChange(
                                    "chat_lieu_day",
                                    "Thép không gỉ 316L"
                                  )
                                }
                              >
                                Thép không gỉ 316L
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Thép không gỉ 316L mạ vàng công nghệ PVD"
                                onClick={() =>
                                  handleFilterChange(
                                    "chat_lieu_day",
                                    "Thép không gỉ 316L mạ vàng công nghệ PVD"
                                  )
                                }
                              >
                                Thép không gỉ 316L mạ vàng công nghệ PVD
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Thép không gỉ 316L dạng lưới"
                                onClick={() =>
                                  handleFilterChange(
                                    "chat_lieu_day",
                                    "Thép không gỉ 316L dạng lưới"
                                  )
                                }
                              >
                                Thép không gỉ 316L dạng lưới
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Thép không gỉ 316L dạng lắc"
                                onClick={() =>
                                  handleFilterChange(
                                    "chat_lieu_day",
                                    " Thép không gỉ 316L dạng lắc"
                                  )
                                }
                              >
                                Thép không gỉ 316L dạng lắc
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Dây vải"
                                onClick={() =>
                                  handleFilterChange(
                                    "chat_lieu_day",
                                    " Dây vải"
                                  )
                                }
                              >
                                Dây vải
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Thép không gỉ 316L/ Vàng 18K"
                                onClick={() =>
                                  handleFilterChange(
                                    "chat_lieu_day",
                                    " Thép không gỉ 316L/ Vàng 18K"
                                  )
                                }
                              >
                                Thép không gỉ 316L/ Vàng 18K
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Thép không gỉ 316L/ Ceramic"
                                onClick={() =>
                                  handleFilterChange(
                                    "chat_lieu_day",
                                    " Thép không gỉ 316L/ Ceramic"
                                  )
                                }
                              >
                                Thép không gỉ 316L/ Ceramic
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Thép không gỉ mạ công nghệ PVD"
                                onClick={() =>
                                  handleFilterChange(
                                    "chat_lieu_day",
                                    "Thép không gỉ mạ công nghệ PVD"
                                  )
                                }
                              >
                                Thép không gỉ mạ công nghệ PVD
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Dây cao su"
                                onClick={() =>
                                  handleFilterChange(
                                    "chat_lieu_day",
                                    " Dây cao su"
                                  )
                                }
                              >
                                Dây cao su
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Dây dù"
                                onClick={() =>
                                  handleFilterChange(
                                    "chat_lieu_day",
                                    "  Dây dù"
                                  )
                                }
                              >
                                Dây dù
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Titanium"
                                onClick={() =>
                                  handleFilterChange(
                                    "chat_lieu_day",
                                    " Titanium"
                                  )
                                }
                              >
                                Titanium
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Titanium mạ vàng công nghệ PVD"
                                onClick={() =>
                                  handleFilterChange(
                                    "chat_lieu_day",
                                    "itanium mạ vàng công nghệ PVD"
                                  )
                                }
                              >
                                Titanium mạ vàng công nghệ PVD
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Nhựa"
                                onClick={() =>
                                  handleFilterChange("chat_lieu_day", "  Nhựa")
                                }
                              >
                                Nhựa
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/*Chất liệu vỏ */}
                      <div
                        className={`${styles["field-area"]} ${styles["field-item"]}`}
                      >
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
                          <div
                            className={`${styles["filters-in-field-inner"]} ${styles.cls}`}
                          >
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Thép không gỉ 316L"
                                onClick={() =>
                                  handleFilterChange(
                                    "chat_lieu_vo",
                                    "Thép không gỉ 316L"
                                  )
                                }
                              >
                                Thép không gỉ 316L
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Thép không gỉ mạ vàng công nghệ PVD"
                                onClick={() =>
                                  handleFilterChange(
                                    "chat_lieu_vo",
                                    "Thép không gỉ mạ vàng công nghệ PVD"
                                  )
                                }
                              >
                                Thép không gỉ mạ vàng công nghệ PVD
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Vàng 18K"
                                onClick={() =>
                                  handleFilterChange("chat_lieu_vo", "Vàng 18K")
                                }
                              >
                                Vàng 18K
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Thép không gỉ 316L/ Vàng 18K"
                                onClick={() =>
                                  handleFilterChange(
                                    "chat_lieu_vo",
                                    "Thép không gỉ 316L/ Vàng 18K"
                                  )
                                }
                              >
                                Thép không gỉ 316L/ Vàng 18K
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Titanium"
                                onClick={() =>
                                  handleFilterChange("chat_lieu_vo", "Titanium")
                                }
                              >
                                Titanium
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Titanium mạ công nghệ PVD"
                                onClick={() =>
                                  handleFilterChange(
                                    "chat_lieu_vo",
                                    "Titanium mạ công nghệ PVD"
                                  )
                                }
                              >
                                Titanium mạ công nghệ PVD
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Ceramic"
                                onClick={() =>
                                  handleFilterChange("chat_lieu_vo", "Ceramic")
                                }
                              >
                                Ceramic
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Thép không gỉ 316L/ Ceramic"
                                onClick={() =>
                                  handleFilterChange(
                                    "chat_lieu_vo",
                                    "Thép không gỉ 316L/ Ceramic"
                                  )
                                }
                              >
                                Thép không gỉ 316L/ Ceramic
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Thép không gỉ mạ công nghệ PVD"
                                onClick={() =>
                                  handleFilterChange(
                                    "chat_lieu_vo",
                                    "Thép không gỉ mạ công nghệ PVD"
                                  )
                                }
                              >
                                Thép không gỉ mạ công nghệ PVD
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
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
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Titanium/ Vàng 18K"
                                onClick={() =>
                                  handleFilterChange(
                                    "chat_lieu_vo",
                                    "Titanium/ Vàng 18K"
                                  )
                                }
                              >
                                Titanium/ Vàng 18K
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Mặt kính */}
                      <div
                        className={`${styles["field-area"]} ${styles["field-item"]}`}
                      >
                        <div
                          className={`${styles["field-name"]} ${styles.normal} ${styles.field} ${styles["field-opened"]}`}
                          data-id="id-field-mat-kinh"
                        >
                          Mặt kính
                        </div>
                        <div
                          id="mat-kinh"
                          className={`${styles["field-label"]} ${styles["filters-in-field"]} ${styles["filters-in-field-1-column"]} ${styles["filter-4-mat-kinh"]}`}
                        >
                          <span className={styles.close}>x</span>
                          <div
                            className={`${styles["filters-in-field-inner"]} ${styles.cls}`}
                          >
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Sapphire"
                                onClick={() =>
                                  handleFilterChange("mat_kinh", "Sapphire")
                                }
                              >
                                Sapphire
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Mặt kính cứng"
                                onClick={() =>
                                  handleFilterChange(
                                    "mat_kinh",
                                    "Mặt kính cứng"
                                  )
                                }
                              >
                                Mặt kính cứng
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Hardlex Crystal"
                                onClick={() =>
                                  handleFilterChange(
                                    "mat_kinh",
                                    "Hardlex Crystal"
                                  )
                                }
                              >
                                Hardlex Crystal
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Mica"
                                onClick={() =>
                                  handleFilterChange("mat_kinh", "Mica")
                                }
                              >
                                Mica
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Kinh Nhựa"
                                onClick={() =>
                                  handleFilterChange("mat_kinh", "Kinh Nhựa")
                                }
                              >
                                Kinh Nhựa
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/*Màu mặt */}
                      <div
                        className={`${styles["field-area"]} ${styles["field-item"]}`}
                      >
                        <div
                          className={`${styles["field-name"]} ${styles.normal} ${styles.field} ${styles["field-opened"]}`}
                          data-id="id-field-mau-mat"
                        >
                          Màu mặt
                        </div>
                        <div
                          id="mau-mat"
                          className={`${styles["field-label"]} ${styles["filters-in-field"]} ${styles["filters-in-field-2-column"]} ${styles["filter-4-mau-mat"]}`}
                        >
                          <span className={styles.close}>x</span>
                          <div
                            className={`${styles["filters-in-field-inner"]} ${styles.cls}`}
                          >
                            <div className={`${styles.cls} ${styles.item}`}>
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
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Hồng"
                                onClick={() =>
                                  handleFilterChange("mau_mat", "Hồng")
                                }
                              >
                                Hồng
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Xám"
                                onClick={() =>
                                  handleFilterChange("mau_mat", "Xám")
                                }
                              >
                                Xám
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
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
                            <div className={`${styles.cls} ${styles.item}`}>
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
                            <div className={`${styles.cls} ${styles.item}`}>
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
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Khảm trai"
                                onClick={() =>
                                  handleFilterChange("mau_mat", "Khảm trai")
                                }
                              >
                                Khảm trai
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
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
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Da Cam"
                                onClick={() =>
                                  handleFilterChange("mau_mat", "Da Cam")
                                }
                              >
                                Da Cam
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Xanh Lá"
                                onClick={() =>
                                  handleFilterChange("mau_mat", "Xanh Lá")
                                }
                              >
                                Xanh Lá
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
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

                      {/*Phong cách */}
                      <div
                        className={`${styles["field-area"]} ${styles["field-item"]}`}
                      >
                        <div
                          className={`${styles["field-name"]} ${styles.normal} ${styles.field} ${styles["field-opened"]}`}
                          data-id="id-field-phong-cach"
                        >
                          Phong cách
                        </div>
                        <div
                          id="phong-cach"
                          className={`${styles["field-label"]} ${styles["filters-in-field"]} ${styles["filters-in-field-1-column"]} ${styles["filter-4-phong-cach"]}`}
                        >
                          <span className={styles.close}>x</span>
                          <div
                            className={`${styles["filters-in-field-inner"]} ${styles.cls}`}
                          >
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Sang trọng"
                                onClick={() =>
                                  handleFilterChange("phong_cach", "Sang trọng")
                                }
                              >
                                Sang trọng
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Thể thao"
                                onClick={() =>
                                  handleFilterChange("phong_cach", "Thể thao")
                                }
                              >
                                Thể thao
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Thể thao sang trọng"
                                onClick={() =>
                                  handleFilterChange(
                                    "phong_cach",
                                    "Thể thao sang trọng"
                                  )
                                }
                              >
                                Thể thao sang trọng
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Quân đội"
                                onClick={() =>
                                  handleFilterChange("phong_cach", "Quân đội")
                                }
                              >
                                Quân đội
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Thời trang"
                                onClick={() =>
                                  handleFilterChange("phong_cach", "Thời trang")
                                }
                              >
                                Thời trang
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Hiện đại"
                                onClick={() =>
                                  handleFilterChange("phong_cach", "Hiện đại")
                                }
                              >
                                Hiện đại
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/*Kiểu dáng */}
                      <div
                        className={`${styles["field-area"]} ${styles["field-item"]}`}
                      >
                        <div
                          className={`${styles["field-name"]} ${styles.normal} ${styles.field} ${styles["field-opened"]}`}
                          data-id="id-field-kieu-dang"
                        >
                          Kiểu dáng
                        </div>
                        <div
                          id="kieu-dang"
                          className={`${styles["field-label"]} ${styles["filters-in-field"]} ${styles["filters-in-field-1-column"]} ${styles["filter-4-kieu-dang"]}`}
                        >
                          <span className={styles.close}>x</span>
                          <div
                            className={`${styles["filters-in-field-inner"]} ${styles.cls}`}
                          >
                            <div className={`${styles.cls} ${styles.item}`}>
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
                            <div className={`${styles.cls} ${styles.item}`}>
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
                            <div className={`${styles.cls} ${styles.item}`}>
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
                            <div className={`${styles.cls} ${styles.item}`}>
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
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Khác"
                                onClick={() =>
                                  handleFilterChange("kieu_dang", "Khác")
                                }
                              >
                                Khác
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/*Xuất xứ thương hiệu */}
                      <div
                        className={`${styles["field-area"]} ${styles["field-item"]}`}
                      >
                        <div
                          className={`${styles["field-name"]} ${styles.normal} ${styles.field} ${styles["field-opened"]}`}
                          data-id="id-field-xuat-xu-thuong-hieu"
                        >
                          Xuất xứ thương hiệu
                        </div>
                        <div
                          id="xuat-xu-thuong-hieu"
                          className={`${styles["field-label"]} ${styles["filters-in-field"]} ${styles["filters-in-field-0-column"]} ${styles["filter-4-xuat-xu-thuong-hieu"]}`}
                        >
                          <span className={styles.close}>x</span>
                          <div
                            className={`${styles["filters-in-field-inner"]} ${styles.cls}`}
                          >
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Nhật Bản"
                                onClick={() =>
                                  handleFilterChange("xuat_xu", "Nhật Bản")
                                }
                              >
                                Nhật Bản
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Thụy Sỹ"
                                onClick={() =>
                                  handleFilterChange("xuat_xu", "Thụy Sỹ")
                                }
                              >
                                Thụy Sỹ
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/*Menu-Đồng hồ nam */}
                  <div className={styles["field-title"]}>
                    <div className={styles["title-name"]}>
                      <div className={styles["cat-title"]}>
                        <div
                          className={styles["cat-title-main"]}
                          id="cat-dong-ho"
                        >
                          <div className={styles["title-icon"]}>
                            <h1>
                              {" "}
                              {categoryName === "Đồng hồ nam"
                                ? categoryName
                                : `${categoryName}`}
                            </h1>
                          </div>
                        </div>
                        <div className={styles.clear}></div>
                      </div>
                    </div>

                    <select
                      className={styles["order-select"]}
                      name="order-select"
                      onChange={handleSortChange}
                    >
                      <option value="">Sắp xếp theo</option>
                      <option value="asc">Giá từ thấp tới cao</option>
                      <option value="desc">Giá từ cao tới thấp</option>
                      <option value="newest">Mới nhất</option>
                      <option value="hot">Sản phẩm hot</option>
                    </select>
                    <div className={styles.clear}></div>
                  </div>

                  <div className={styles.clear}></div>
                  {/*Danh sách sản phẩm */}

                  <section className={styles["products-cat-frame"]}>
                    <div className={styles["products-cat-frame-inner"]}>
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
                              Math.abs(curr - discountPercentage) <
                              Math.abs(prev - discountPercentage)
                                ? curr
                                : prev
                            );
                          };
                          return (
                            <div key={_id} className={styles.item}>
                              <div className={styles["frame-inner"]}>
                                <figure className={styles["product-image"]}>
                                  <Link
                                    href={`/components/product-detail/${_id}`}
                                  >
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
                                  <Link
                                    className={styles.name}
                                    href="#"
                                    title={ten}
                                  >
                                    <span className={styles["cat-name"]}>
                                      {ten_san_pham}
                                    </span>
                                    {ma_san_pham}
                                  </Link>
                                </h3>
                                <span className={styles["loai-may"]}>
                                  {loai}
                                </span>
                                <span className={styles["row-lm"]}>|</span>
                                <span className={styles["duong-kinh"]}>
                                  {duong_kinh}
                                </span>
                                <div className={styles["price-area"]}>
                                  <div className={styles["price-old"]}>
                                    Giá:{" "}
                                    <span>
                                      {gia_san_pham.toLocaleString("vi-VN")}₫
                                    </span>
                                  </div>
                                  <div className={styles["price-current"]}>
                                    Giá KM: {gia_giam.toLocaleString("vi-VN")} ₫
                                  </div>
                                </div>
                                <div className={styles.discount}>
                                  <span>
                                    -
                                    {roundDiscount(
                                      Math.round(
                                        ((gia_san_pham - gia_giam) /
                                          gia_san_pham) *
                                          100
                                      )
                                    )}
                                    %
                                  </span>
                                  
                                </div>
                                <div className={styles.overlay}>
                                  <span>
                                   new
                                  </span>
                                  
                                </div>
                                <div className={styles.clear}></div>
                              </div>
                              {/* end .frame-inner */}
                              <div className={styles.clear}></div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </section>

                  {/* phân trang*/}
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
                </div>
                <div className={styles.clear}></div>

                {/* đánh giá start */}
                <div className={styles.evaluateCat}>
                  <div className={`${styles.ratingArea} ${styles.cls}`}>
                    <span id="ratings">
                      <i
                        className={` ${styles.starOn}`}
                        id="rate_1"
                        value="1"
                      ></i>
                      <i
                        className={` ${styles.starOn}`}
                        id="rate_2"
                        value="2"
                      ></i>
                      <i
                        className={` ${styles.starOn}`}
                        id="rate_3"
                        value="3"
                      ></i>
                      <i
                        className={` ${styles.starOff}`}
                        id="rate_4"
                        value="4"
                      ></i>
                      <i
                        className={` ${styles.starOff}`}
                        id="rate_5"
                        value="5"
                      ></i>
                    </span>
                    <span className={styles.ratingNote}>
                      Nhấn vào đây để đánh giá
                    </span>
                  </div>
                </div>

                {/* mô tả*/}
                <div
                  className={`${styles.summaryContentCat} ${styles.description} ${styles.heightAuto}`}
                >
                  <h2 dir="ltr" style={{ textAlign: "justify" }}>
                    <strong>
                      TẤT CẢ NHỮNG ĐIỀU BẠN CẦN BIẾT VỀ CÁCH CHỌN ĐỒNG HỒ NAM
                    </strong>
                  </h2>

                  <p dir="ltr" style={{ textAlign: "justify" }}>
                    Những chiếc
                    <em>
                      <strong>
                        <Link href="#">
                          <span className={styles.highlightText}>
                            &nbsp;đồng hồ đeo tay
                          </span>
                        </Link>
                      </strong>
                    </em>
                    &nbsp;không chỉ để xem thời gian mà còn khẳng định phong
                    cách và đẳng cấp của phái mạnh.
                    <strong>&nbsp;Đồng hồ nam</strong> mang lại sự khác biệt
                    nhất là khi đặt vào tổng thể trang phục, nhưng không phải ai
                    cũng chọn được một chiếc đồng hồ phù hợp ở lần đầu tiên.
                    <strong>&nbsp;Wristly</strong> sẽ giúp bạn lựa chọn
                    <Link href="#">
                      <em>
                        <strong>&nbsp;đồng hồ nam đẹp&nbsp;</strong>
                      </em>
                    </Link>
                    và phù hợp với sở thích của từng người!
                  </p>
                  <p className={styles.imageContainer}>
                    <img
                      alt="đồng hồ nam"
                      height="800"
                      className={styles.lazy}
                      width="1200"
                      src="/image/item/donghonam-hinh1.jpg"
                    />
                  </p>

                  <p dir="ltr" className={styles.justifyText}>
                    &nbsp;
                  </p>

                  <h2 dir="ltr" className={styles.justifyText}>
                    <strong>
                      1. CÁC THƯƠNG HIỆU ĐỒNG HỒ NAM NỔI TIẾNG TẠI VIỆT NAM
                    </strong>
                  </h2>

                  <h3 dir="ltr" className={styles.justifyText}>
                    <strong>1.1&nbsp;Longines</strong>
                  </h3>

                  <p dir="ltr" className={styles.justifyText}>
                    Không nhiều người biết rằng
                    <em>
                      <strong>
                        <Link href="#">Longines</Link>
                      </strong>
                    </em>
                    là một trong những thương hiệu đồng hồ lâu đời nhất thế
                    giới. Với gần hai thế kỷ ra đời và phát triển, cái tên
                    Longines có thể được xem như “lão làng” trong giới chơi đồng
                    hồ. Quy tụ tinh hoa hàng trăm năm chế tác cùng tinh thần
                    thanh lịch bất biến với thời gian, những chiếc đồng hồ
                    Longines chính là vật sở hữu đáng giá nhờ độ tin cậy cao, đa
                    dạng về kiểu dáng và mẫu mã với thiết kế cổ điển, nhiều
                    phiên bản dress watch lý tưởng. Các mẫu
                    <strong>
                      <em>
                        <Link href="#">đồng hồ nam Longines</Link>
                      </em>
                    </strong>
                    đã làm mê hoặc&nbsp;rất nhiều&nbsp;tín đồ yêu đồng
                    hồ&nbsp;trên khắp thế giới hàng trăm&nbsp;năm nay.
                  </p>

                  <p className={styles.imageContainer}>
                    <img
                      alt="đồng hồ nam longines"
                      height="800"
                      className={styles.lazy}
                      width="1200"
                      src="/public/img/item/donghonam-hinh2.jpg"
                    />
                  </p>

                  <p dir="ltr" className={styles.justifyText}>
                    Dù là
                    <em>
                      <strong>
                        <Link href="#">
                          <span className={styles.highlightText}>
                            đồng hồ unisex
                          </span>
                        </Link>
                      </strong>
                    </em>
                    , đồng hồ nam hay nữ, Longines vẫn mang đến hàng loạt phiên
                    bản nổi tiếng đáp ứng nhiều thị hiếu khác nhau.
                  </p>

                  <p dir="ltr" className={styles.justifyText}>
                    &nbsp;
                  </p>

                  <h3 dir="ltr" className={styles.justifyText}>
                    <strong>1.2 Rolex</strong>
                  </h3>

                  <p dir="ltr" className={styles.justifyText}>
                    Dù là người đam mê đồng hồ hay không, bạn sẽ khó có thể tìm
                    thấy một người nào chưa từng nghe qua cái tên Rolex trong
                    đời. Vương miện <strong>Rolex </strong>là một trong những
                    biểu tượng dễ nhận diện nhất trên thế giới. Đeo đồng hồ
                    Rolex không chỉ thể hiện địa vị mà còn cho phép bạn bước vào
                    thế giới của những khả năng không giới hạn. Đó là lý do tại
                    sao Rolex sản xuất và bán khoảng một triệu chiếc
                    <Link href="#">
                      <em>
                        <strong>đồng hồ nam cao cấp</strong>
                      </em>
                    </Link>
                    mỗi năm.
                  </p>

                  <p className={styles.imageContainer}>
                    <img
                      alt="đồng hồ nam rolex"
                      height="375"
                      className={styles.lazy}
                      width="1200"
                      src="/public/img/item/donghonam-hinh3.jpg"
                    />
                  </p>

                  <p dir="ltr" className={styles.justifyText}>
                    &nbsp;
                  </p>

                  <h3 dir="ltr" className={styles.justifyText}>
                    <strong>1.3 Tissot</strong>
                  </h3>

                  <p dir="ltr" className={styles.justifyText}>
                    Được tạo ra vào năm 1853 tại Jura Thụy Sĩ,
                    <em>
                      <strong>
                        <Link href="#">
                          <span className={styles.highlightText}>Tissot</span>
                        </Link>
                      </strong>
                    </em>
                    tự hào có truyền thống chế tác đồng hồ rất lâu đời. Ngày nay
                    thuộc sở hữu của Tập đoàn Swatch của Thụy Sỹ, đồng hồ Tissot
                    liên tục đưa ra những mẫu đồng hồ chất lượng cao với mức giá
                    tương đối phải chăng. Họ cũng là một trong những thương hiệu
                    thành công nhất của Thụy Sĩ cung cấp những chiếc
                    <Link href="#">
                      <em>
                        <strong>đồng hồ nam thời trang</strong>
                      </em>
                    </Link>
                    , đa dạng&nbsp;phong cách và phù hợp với số đông người tiêu
                    dùng từ giá thành đến kiểu dáng.
                  </p>

                  <p className={styles.imageContainer}>
                    <img
                      alt="đồng hồ nam tissot"
                      height="800"
                      className={styles.lazy}
                      width="1200"
                      src="/public/img/item/donghonam-hinh4.jpg"
                    />
                  </p>

                  <p dir="ltr" className={styles.justifyText}>
                    &nbsp;
                  </p>

                  <h3 dir="ltr" className={styles.justifyText}>
                    <strong>1.4 Omega</strong>
                  </h3>

                  <p dir="ltr" className={styles.justifyText}>
                    Là người khổng lồ khác trong toàn ngành công nghiệp đồng hồ,{" "}
                    <strong>Omega</strong> chính là thương hiệu hùng mạnh nhất
                    thuộc tập đoàn Swatch. Nguồn gốc của thương hiệu bắt đầu từ
                    năm 1848. Omega được biết đến với nhiều thành tựu nổi bật và
                    đã tham gia vào các sự kiện đáng chú ý, như là cỗ máy đo
                    thời gian chính thức của Thế vận hội Olympic kể từ năm 1932
                    và là chiếc đồng hồ đầu tiên được đeo trên mặt trăng. Với
                    chứng nhận Master Chronometer, <strong>Omega</strong> đã
                    thiết lập một chuẩn mực công nghiệp mới về độ chính xác,
                    hiệu suất và khả năng chống từ.
                  </p>

                  <p className={styles.imageContainer}>
                    <img
                      alt="đồng hồ nam omega"
                      height="675"
                      className={styles.lazy}
                      width="1200"
                      src="/public/img/item/donghonam-hinh5.jpg"
                    />
                  </p>

                  <p dir="ltr" className={styles.justifyText}>
                    &nbsp;
                  </p>

                  <h3 dir="ltr" className={styles.justifyText}>
                    <strong>1.5 Hamilton</strong>
                  </h3>

                  <p dir="ltr" className={styles.justifyText}>
                    Thương hiệu thuộc về tập đoàn Swatch Thụy Sĩ và do đó được
                    hưởng lợi từ tất cả sự hợp lực của một tập đoàn công nghiệp
                    như vậy. Những năm gần đây
                    <em>
                      <strong>
                        <Link href="#">
                          <span className={styles.highlightText}>Hamilton</span>
                        </Link>
                      </strong>
                    </em>
                    đã tung ra một số chiếc
                    <Link href="">
                      <em>
                        <strong>đồng hồ đeo tay nam</strong>
                      </em>
                    </Link>
                    đáng ngưỡng mộ, kết hợp giữa thể thao và thanh lịch được
                    thực hiện một cách hoàn hảo, một số trong số chúng có công
                    nghệ tuyệt vời mà hầu như không quá đắt đỏ. So sánh trong
                    phân khúc tầm trung thì những gì Hamilton cung cấp là điều
                    mà một người yêu đồng hồ Thụy Sĩ nên quan tâm. Ngoài ra hãng
                    còn kết hợp với các nhà làm phim Hollywood để cho ra các
                    siêu phẩm phim hành động, phim khoa học viễn tưởng ăn khách
                    trên toàn thế giới, gần đây nhất là bộ&nbsp;phim Hành tinh
                    cát (Dune II) sản xuất năm 2024, với chiếc&nbsp;
                    <strong>
                      <em>
                        Hamilton Ventura Edge Dune Limited Edition H24624330
                      </em>
                    </strong>
                    được xuất hiện trên tay nhân vật chính trong phim.
                  </p>

                  <p className={styles.imageContainer}>
                    <img
                      alt="đồng hồ nam Hamilton Ventura Edge Dune Limited Edition H24624330"
                      height="800"
                      className={styles.lazy}
                      width="1200"
                      src="/public/img/item/donghonam-hinh6.jpg"
                    />
                  </p>

                  <p dir="ltr" className={styles.justifyText}>
                    &nbsp;
                  </p>

                  <h3 dir="ltr" className={styles.justifyText}>
                    <strong>1.6 Mido</strong>
                  </h3>

                  <p dir="ltr" className={styles.justifyText}>
                    <strong>
                      <em>
                        <Link href="#">Mido</Link>
                      </em>
                    </strong>
                    là một nhà sản xuất đồng hồ Thụy Sĩ đã tạo dựng được danh
                    tiếng khi kết hợp công nghệ tiên tiến với thiết kế thời
                    trang, lấy cảm hứng từ kiến ​​trúc. Đồng hồ của hãng tự hào
                    với độ chính xác và chất lượng cao nhờ kỹ thuật và vật liệu
                    cao cấp, đủ khả năng đứng vững trước thử thách của thời
                    gian.
                  </p>

                  <p className={styles.imageContainer}>
                    <img
                      alt="đồng hồ nam mido"
                      height="800"
                      className={styles.lazy}
                      width="1200"
                      src="/public/img/item/donghonam-hinh7.jpg"
                    />
                  </p>

                  <p dir="ltr" className={styles.justifyText}>
                    &nbsp;
                  </p>

                  <h3 dir="ltr" className={styles.justifyText}>
                    <strong>1.7 Seiko</strong>
                  </h3>

                  <p dir="ltr" className={styles.justifyText}>
                    Khi tạo ra chiếc
                    <strong>
                      <Link href="#">đồng hồ thạch anh</Link>
                    </strong>
                    đầu tiên vào năm 1969,
                    <strong>
                      <Link href="#">Seiko</Link>
                    </strong>
                    đã khởi động cuộc cách mạng lớn nhất của kỷ nguyên đồng hồ
                    hiện đại. Cho đến ngày nay, thương hiệu này vẫn tiếp tục
                    cung cấp những chiếc đồng hồ tuyệt vời từ cơ khí, tự động và
                    chạy bằng pin. Ngày nay, Seiko không chỉ là một nhà tiên
                    phong về đồng hồ khi những chiếc đồng hồ hàng đầu của thương
                    hiệu này tiếp tục sánh ngang với
                    <em>
                      <strong>
                        <Link href="#">đồng hồ Thụy Sỹ</Link>
                      </strong>
                    </em>
                    . Các quy trình sản xuất đồng hồ nội bộ của hãng, bao gồm cả
                    kỹ thuật đánh bóng truyền thống, zaratsu, vẫn là một trong
                    những quy trình tốt nhất thế giới, giúp cho những chiếc đồng
                    hồ của hãng trở nên chính xác và thẩm mỹ nhất trên thế giới.
                  </p>

                  <p className={styles.imageContainer}>
                    <img
                      alt="đồng hồ nam seiko 5 sport"
                      height="800"
                      className={styles.lazy}
                      width="1200"
                      src="/public/img/item/donghonam-hinh8.jpg"
                    />
                  </p>

                  <p dir="ltr" className={styles.justifyText}>
                    &nbsp;
                  </p>

                  <h3 dir="ltr" className={styles.justifyText}>
                    <strong>1.8 Casio</strong>
                  </h3>

                  <p dir="ltr" className={styles.justifyText}>
                    Nếu muốn sở hữu một chiếc
                    <em>
                      <strong>đồng hồ nam</strong>
                    </em>
                    đáng tin cậy và chắc chắn sẽ tồn tại suốt đời, đó là
                    <em>
                      <strong>
                        <Link href="#">đồng hồ Casio</Link>
                      </strong>
                    </em>
                    .&nbsp; Thương hiệu
                    <em>
                      <strong>
                        <Link href="#">đồng hồ Nhật Bản</Link>
                      </strong>
                    </em>
                    này nên là chiếc đồng hồ đầu tiên trong danh sách của bạn,
                    đặc biệt là vì nhiều bộ sưu tập của chúng có phong cách hoàn
                    hảo và hiệu suất phi thường.
                  </p>

                  <p className={styles.imageCenter}>
                    <img
                      alt="dong-ho-casio"
                      height="510"
                      className={styles.lazy}
                      width="1200"
                      src="/public/img/item/donghonam-hinh9.jpg"
                    />
                  </p>

                  <p dir="ltr" className={styles.justifyText}>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </p>

                  <h3 dir="ltr" className={styles.justifyText}>
                    <strong>1.9 Citizen</strong>
                  </h3>

                  <p className={styles.imageCenter}>
                    <img
                      alt="đồng hồ nam citizen"
                      height="800"
                      className={styles.lazy}
                      width="1200"
                      src="/public/img/item/donghonam-hinh10.jpg"
                    />
                  </p>

                  <p dir="ltr" className={styles.justifyText}>
                    &nbsp;
                  </p>

                  <h3 dir="ltr" className={styles.justifyText}>
                    <strong>1.10 Orient</strong>
                  </h3>

                  <p dir="ltr" className={styles.justifyText}>
                    <em>
                      <strong>
                        <Link href="#">Orient</Link>
                      </strong>
                    </em>
                    là một trong những nhà sản xuất đồng hồ tốt nhất và được
                    công nhận rộng rãi nhất tại Nhật Bản. Giờ đây, thương hiệu
                    này là một công ty con của Seiko, nhưng họ vẫn tiếp tục xây
                    dựng các bộ máy của riêng mình, đó là lý do tại sao những
                    chiếc
                    <Link href="#">
                      <strong>
                        <em>đồng hồ cơ Orient</em>
                      </strong>
                    </Link>
                    có chất lượng tuyệt vời và là một thương hiệu đáng tin cậy.
                  </p>

                  <p className={styles.imageCenter}>
                    <img
                      alt="đồng hồ nam orient"
                      height="675"
                      className={styles.lazy}
                      width="1200"
                      src="/public/img/item/donghonam-hinh11.jpg"
                    />
                  </p>

                  <p dir="ltr" className={styles.justifyText}>
                    &nbsp;
                  </p>

                  <h2 dir="ltr" className={styles.justifyText}>
                    <strong>2. TƯ VẤN LỰA CHỌN ĐỒNG HỒ NAM PHÙ HỢP</strong>
                  </h2>

                  <p dir="ltr" className={styles.justifyText}>
                    Nếu bạn đang muốn mua một chiếc đồng hồ để đeo nhưng chưa
                    biết nên lựa chọn như thế nào, từ việc cân nhắc những ưu và
                    nhược điểm của các loại đồng hồ khác nhau, đến các kiểu
                    <strong>đồng hồ nam</strong> khác nhau… thì bài viết này là
                    dành cho bạn!
                  </p>

                  <p dir="ltr" className={styles.justifyText}>
                    Hơn thế nữa việc trang bị cho mình những thông tin liên quan
                    có thể đơn giản hóa quá trình mua hàng và không bị lạc giữa
                    hàng trăm loại đồng hồ khác nhau và để chắc chắn rằng bạn
                    không mua một chiếc đồng hồ yêu thích hôm nay để rồi chán nó
                    vào ngày mai!
                  </p>

                  <p className={styles.justifyText}>
                    Bạn sẽ tìm thấy hướng dẫn cơ bản về
                    <em>
                      <strong>đồng hồ đeo tay nam</strong>
                    </em>
                    - tất cả thông tin cần thiết để lựa chọn được những mẫu
                    <em>
                      <strong>đồng hồ nam đẹp</strong>
                    </em>
                    và phù hợp với từng người.
                  </p>

                  <p className={styles.justifyText}>&nbsp;</p>

                  <h3 className={styles.justifyText}>
                    <strong>2.1 Chọn đồng hồ theo nhu cầu sử dụng</strong>
                  </h3>

                  <p className={styles.justifyText}>
                    Bạn sử dụng
                    <Link href="#">
                      <strong>
                        <em>đồng hồ</em>
                      </strong>
                    </Link>
                    của mình chủ yếu vào khi nào? Ở đâu? Hãy đặt ra câu hỏi và
                    trả lời chúng. Chiếc đồng hồ được chọn cũng cần phải phù hợp
                    với công việc, hoàn cảnh sử dụng.
                  </p>

                  <ul>
                    <li>
                      <p className={styles.justifyText}>
                        Nếu bạn là người kinh doanh, hay gặp gỡ mọi người và mặc
                        những bộ trang phục lịch sự thì bạn có thể lựa chọn
                        những mẫu
                        <em>
                          <strong>đồng hồ nam cổ điển</strong>
                        </em>
                        dành cho doanh nhân.
                      </p>
                    </li>
                    <li>
                      <p className={styles.justifyText}>
                        Nếu bạn yêu thích phong cách thể thao, mạnh mẽ thì những
                        chiếc
                        <em>
                          <strong>đồng hồ nam thể thao</strong>
                        </em>
                        có kích thước lớn sẽ là lựa chọn giúp bạn trở nên năng
                        động hơn. Những chiếc đồng hồ này không chỉ có khả năng
                        chịu va đập và chống nước tốt mà nó còn hữu dụng với
                        nhiều tính năng hỗ trợ khác.
                      </p>
                    </li>
                    <li>
                      <p className={styles.justifyText}>
                        Nếu bạn là mẫu người chỉ muốn lựa chọn những chiếc{" "}
                        <strong>đồng hồ nam đơn giản</strong> là để xem giờ, hỗ
                        trợ cho cuộc sống hàng ngày thì các mẫu
                        <em>
                          <strong>đồng hồ nam dây da</strong>
                        </em>
                        hoặc
                        <em>
                          <strong>đồng hồ nam dây kim loại</strong>
                        </em>
                        đơn giản của Tissot hoặc Longines với mức giá cũng khá
                        hợp lý.
                      </p>
                    </li>
                  </ul>

                  <p className={styles.justifyText}>&nbsp;</p>

                  <p className={styles.justifyText}>
                    <strong>Tham khảo</strong>
                  </p>

                  <ul>
                    <li className={styles.justifyText}>
                      <Link href="#">
                        Shop đồng hồ nam chính hãng uy tín tại HCM
                      </Link>
                    </li>
                    <li className={styles.justifyText}>
                      <Link href="">
                        Top 20 mẫu đồng hồ nam bán chạy nhất tháng 4 2023
                      </Link>
                    </li>
                  </ul>

                  <p className={styles.justifyText}>&nbsp;</p>

                  <h3 className={styles.justifyText}>
                    <strong>2.2 Chọn đồng hồ nam theo thương hiệu</strong>
                  </h3>

                  <p className={styles.justifyText}>
                    <Link href="#">
                      <em>
                        <strong>Thế giới đồng hồ nam</strong>
                      </em>
                    </Link>
                    rất đa dạng và phong phú với sự góp mặt của các thương hiệu
                    đồng hồ Thụy Sĩ và Nhật Bản – 2 cường quốc về sản xuất đồng
                    hồ hàng đầu thế giới. Ở các
                    <Link href="#">
                      <em>
                        <strong>shop đồng hồ nam</strong>
                      </em>
                    </Link>
                    , họ thường chia các mẫu đồng hồ theo thương hiệu. Thông
                    thường những thương hiệu phân khúc cao cấp nhất như Rolex,
                    Omega, Patek Philippe, Grand Seiko… sẽ có giá đến hàng trăm
                    triệu. Các mẫu đồng hồ thuộc thương hiệu Longines – thương
                    hiệu cao cấp của tập đoàn đồng hồ lớn nhất Thụy Sĩ Swatch có
                    giá từ vài chục đến vài trăm triệu tùy theo mẫu đồng hồ bạn
                    chọn. Trong khi đó các thương hiệu tầm trung như Tissot,
                    Mido, Certina, Hamilton, Seiko… có mức giá từ vài triệu đến
                    vài chục triệu. Ngoài ra nếu bạn muốn một chiếc
                    <Link href="#">
                      <em>
                        <strong>đồng hồ nam hàng hiệu</strong>
                      </em>
                    </Link>
                    với mức giá mềm thì có thể kể đến thương hiệu Seiko,
                    Citizen, Orient, Casio, Daniel Wellington… chỉ từ 3 triệu
                    trở lên.
                  </p>

                  <p className={styles.justifyText}>&nbsp;</p>

                  <h3 className={styles.justifyText}>
                    <strong>2.3 Chọn đồng hồ nam theo mức giá</strong>
                  </h3>

                  <p className={styles.justifyText}>
                    Phạm vi giá cũng là một yếu tố quan trọng để bạn quyết định
                    mua đồng hồ. Ngân sách sẽ quyết định bạn có thể mua được
                    đồng hồ nam ở mức giá nào! Ngoại trừ những chiếc đồng hồ có
                    giá cao thuộc phân khúc cao cấp thì bạn có thể ước lượng số
                    tiền mình có thể mua theo các mức giá sau:
                  </p>

                  <ul>
                    <li>
                      <p className={styles.justifyText}>
                        <em>
                          <strong>Đồng hồ nam dưới 3 triệu</strong>
                        </em>
                        : với mức giá này thì điều người mua quan tâm là đồng hồ
                        nam giá rẻ nhưng phải có chất lượng tốt và chỉ đơn giản
                        là để xem giờ như một món phụ kiện trên cổ tay. Bạn có
                        thể tìm đến đồng hồ pin thạch anh thuộc các thương hiệu
                        như Casio, Orient, Citizen, Olym Pianus.
                      </p>
                    </li>
                    <li>
                      <p className={styles.justifyText}>
                        <strong>
                          <em>Đồng hồ nam từ 3 – 6 triệu</em>
                        </strong>
                        : Với số tiền này bạn có thể lựa chọn nhiều mẫu đồng hồ
                        nam đẹp hơn, có thể kể đến Seiko, Orient, Citizen, Casio
                        Edifice, Casio G-Shock, Cadino, Olym Pianus…
                      </p>
                    </li>
                    <li>
                      <p className={styles.justifyText}>
                        <strong>
                          <em>Từ 6 đến 10 triệu</em>
                        </strong>
                        : Đây là phân khúc mà người dùng bắt đầu có sự hứng thú
                        với đồng hồ, bạn sẽ có vô vàn sự lựa chọn khác nhau từ
                        đồng hồ Nhật Bản cho đến đồng hồ Thụy Sỹ. Với đồng hồ
                        Nhật thì phân khúc này bạn có thể tìm kiếm một số mẫu
                        đồng hồ cơ của các thương hiệu như Citizen, Orient.
                      </p>
                    </li>
                    <li>
                      <p className={styles.justifyText}>
                        <strong>
                          <em>Từ 10 – 40 triệu trở lên</em>
                        </strong>
                        : Bạn có thể mua được đồng hồ cơ Thụy Sỹ với nhiều lựa
                        chọn phong phú từ Seiko, Orient Star, Tissot, Mido,
                        Hamilton, Certina…
                      </p>
                    </li>
                    <li>
                      <p className={styles.justifyText}>
                        <strong>
                          <em>Từ 40 triệu trở lên</em>
                        </strong>
                        : đây là mức giá để có thể sở hữu những chiếc đồng hồ cơ
                        Thụy Sỹ cao cấp, có thể kể đến thương hiệu Longines với
                        nhiều BST của họ có mức giá từ 40 triệu trở lên.
                      </p>
                    </li>
                  </ul>

                  <p className={styles.centerText}>
                    <img
                      alt="đồng hồ nam đeo tay"
                      height="800"
                      width="1200"
                      className={`${styles.imageStyle} lazy`} // Kết hợp cả hai lớp CSS
                      src="/public/img/item/donghonam-hinh12.jpg"
                    />
                  </p>

                  <p className={styles.justifyText}>&nbsp;</p>

                  <ul className={styles.justifyText}>
                    <li>
                      <Link href="#">
                        Cách lựa chọn đồng hồ phù hợp với kích thước cổ tay
                      </Link>
                    </li>
                    <li>
                      <Link href="">
                        Toplist 15 mẫu đồng hồ nam theo hot trend và đẹp nhất
                        năm 2023
                      </Link>
                    </li>
                  </ul>

                  <p className={styles.justifyText}>&nbsp;</p>

                  <h3 className={styles.justifyText}>
                    <strong>
                      2.6 Chọn đồng hồ nam dây da hay dây kim loại
                    </strong>
                  </h3>

                  <p className={styles.justifyText}>
                    <em>
                      -
                      <strong>
                        &nbsp;<Link href="#">Đồng hồ nam dây da</Link>
                      </strong>
                    </em>
                    là món đồ cổ điển quen thuộc được nhiều người yêu thích. Vì
                    cảm giác mềm mại, nhẹ nhàng tự nhiên, nó là một chất liệu
                    thoải mái vừa linh hoạt vừa bền lâu. Có nhiều màu sắc và
                    kiểu dáng, loại dây đồng hồ này có khả năng điều chỉnh &
                    giãn rộng theo thời gian. Dây da có thể phù hợp một cách gọn
                    gàng trên cổ tay của bạn.
                  </p>

                  <p className={styles.justifyText}>
                    Dây da là một lựa chọn tuyệt vời cho các sự kiện trang
                    trọng, dây da rất tinh xảo và thanh lịch. Điểm cộng của nó
                    là bạn có thể thử đi giày hoặc thắt lưng cùng màu sao cho
                    hợp thời trang. Dây da đồng hồ nói chung được làm với hệ
                    thống khóa chắc chắn, điều này ngăn không cho chốt đồng hồ
                    bị bung ra bất ngờ.
                  </p>

                  <p className={styles.justifyText}>
                    - Đồng hồ đeo tay bằng thép không gỉ cao cấp 316L&nbsp;(
                    <Link href="#">
                      <strong>
                        <em>đồng hồ nam dây kim loại)</em>
                      </strong>
                    </Link>
                    &nbsp;là một lựa chọn phổ biến cho đồng hồ thể thao, phù hợp
                    cho nhiều hoạt động thể thao. Đồng hồ dây kim loại như đồng
                    hồ nam chính hãng
                    <strong>
                      <em>
                        <Link href="#">Longines</Link>
                      </em>
                    </strong>
                    thường đắt hơn dây da và cũng có thể sử dụng như một chiếc
                    đồng hồ đeo tay cho những dịp sang trọng.
                  </p>

                  <p className={styles.justifyText}>
                    Mạnh mẽ và không dễ bị đứt, dây đồng hồ kim loại có thể bị
                    ướt, chúng không dễ bị hỏng như da khi tiếp xúc với mồ hôi
                    và nước. Vật liệu kim loại cũng không bị đàn hồi hay giãn
                    như dây da. Sở hữu độ bền cao và dây kim loại sẽ gắn bó với
                    đồng hồ đến hết vòng đời nên không tốn thêm chi phí!
                  </p>

                  <p className={styles.justifyText}>
                    - Ngoài dây da và dây kim loại, đồng hồ nam còn có các phiên
                    bản dây cao su, dây vải dù dành cho các tín đồ có&nbsp;phong
                    cách, có&nbsp;cá tính ưa chuộng những hoạt động bên
                    ngoài&nbsp;
                  </p>

                  <p className={styles.justifyText}>&nbsp;</p>

                  <ul className={styles.justifyText}>
                    <li>
                      <Link href="#">
                        Top 9 mẫu đồng hồ nam dây cao su nên mua trong năm 2024
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        DÂY ĐEO ĐỒNG HỒ: NÊN CHỌN DÂY DA HAY DÂY KIM LOẠI?
                      </Link>
                    </li>
                  </ul>

                  <p className={styles.justifyText}>&nbsp;</p>

                  <h3 className={styles.justifyText}>
                    <strong>2.7 Chọn đồng hồ nam theo màu mặt</strong>
                  </h3>

                  <p className={styles.justifyText}>
                    Mặt số của đồng hồ là mặt phía trên, chứa các dấu hiệu hiển
                    thị thời gian như kim và cọc số, kèm theo một số biến thể
                    khác nhau tùy vào loại đồng hồ.&nbsp;
                  </p>

                  <p className={styles.justifyText}>
                    Không có quy định
                    <em>
                      <strong>đồng hồ nam đẹp nhất</strong>
                    </em>
                    phải có màu sắc, kiểu dáng nào! Mặt số có vô vàn hình dáng,
                    màu sắc, chất liệu khác nhau. Mặt đồng hồ đen hoặc trắng là
                    lựa chọn phổ biến nhất dành cho nam giới, trong khi các màu
                    khác cũng được ưa chuộng không kém đó là xanh lục, nâu,
                    vàng, xám… Trong khi đó, những mặt số có màu sắc đặc biệt,
                    có vân họa tiết hoặc khảm xà cừ thường sẽ đắt tiền hơn. Các
                    dấu chỉ giờ như con số, vạch chỉ giờ, bộ kim… thường có màu
                    tương phản với mặt đồng hồ, một số chi tiết còn được tráng
                    lớp dạ quang để có thể nhìn trong đêm.
                  </p>

                  <p className={styles.justifyText}>
                    Hình dạng mặt đồng hồ và màu sắc mặt là sự lựa chọn liên
                    quan đến tính thẩm mỹ. Vì thế bạn có thể lựa chọn tùy theo
                    gu thẩm mỹ của bản thân.
                  </p>

                  <p className={styles.centerText}>
                    <img
                      alt=""
                      height="69"
                      className={`lazy ${styles.imageStyle}`} // Kết hợp lớp CSS nếu cần
                      width="300"
                      src="/public/img/item/xem them(1).gif"
                    />
                  </p>

                  <p className={styles.centerText}>
                    <Link href="#">
                      NHỮNG PHIÊN BẢN ĐỒNG HỒ NAM DÂY DA MẶT XANH THỂ HIỆN NÉT
                      CÁ TÍNH CỦA NAM GIỚI
                    </Link>
                  </p>

                  <p className={styles.justifyText}>&nbsp;</p>

                  <h3 className={styles.justifyText}>
                    <strong>2.8 Chọn đồng hồ nam theo loại kính</strong>
                  </h3>

                  <p className={styles.justifyText}>
                    Khi nói về đồng hồ, bộ máy có lẽ là phần quan trọng nhất.
                    Nhưng sau đó là gì? Vỏ và mặt kính đồng hồ cũng quan trọng
                    không kém vì nó bảo vệ mặt số và bộ chuyển động đồng thời
                    tăng thêm vẻ đẹp tinh tế cho thiết kế.
                  </p>

                  <p className={styles.justifyText}>
                    Có 3 loại kính đồng hồ, đó là
                    <em>
                      <strong>kính</strong>
                    </em>
                    <strong>
                      <em>Acrylic, kính khoáng và kính Sapphire</em>
                    </strong>
                    với những ưu nhược điểm riêng.
                  </p>

                  <p className={styles.justifyText}>
                    - Trong tất cả các loại kính đồng hồ,{" "}
                    <em>kính đồng hồ acrylic</em> là yếu nhất, điều này là do nó
                    được làm từ nhựa không phải từ thủy tinh. Acrylic là một
                    loại nhựa chuyên dụng có giá thành rẻ thường được tìm thấy
                    trên các thương hiệu đồng hồ giá thấp.
                  </p>

                  <p className={styles.justifyText}>
                    - Đây có lẽ là loại kính đồng hồ phổ biến nhất được sử dụng
                    trên đồng hồ. Nếu bạn có một chiếc đồng hồ tầm giá trung
                    bình thì nó thường có mặt <em>kính khoáng</em>. Nó được sản
                    xuất bằng kính cường lực tiêu chuẩn làm từ silica. Kính
                    khoáng có khả năng chống xước và sản xuất khá rẻ. Tuy nhiên,
                    nó có thể bị xước khi va chạm với vật liệu cứng.
                  </p>

                  <p className={styles.justifyText}>
                    - <em>Kính sapphire</em> có chất lượng hàng đầu thường có ở
                    những mẫu đồng hồ nam hàng hiệu. Nếu một chiếc đồng hồ có
                    kính sapphire crystal, thì nó là loại kính chất lượng cao
                    nhất hiện có. Đúng như tên gọi, loại kính đồng hồ này được
                    làm từ sapphire nhưng nó thường được làm từ sapphire tổng
                    hợp, không phải sapphire tự nhiên.
                  </p>

                  <p className={styles.justifyText}>
                    Nếu bạn mua
                    <Link href="#">
                      <em>
                        <strong>đồng hồ nam chính hãng</strong>
                      </em>
                    </Link>
                    từ những cửa hàng chính hãng và thương hiệu đáng tin cậy,
                    bạn sẽ luôn được cung cấp thông tin rõ ràng về loại mặt kính
                    của đồng hồ.
                  </p>

                  <p className={styles.justifyText}>&nbsp;</p>

                  <ul className={styles.listStyle}>
                    <li className={styles.justifyText}>
                      <Link href="#">
                        Top đồng hồ nam mặt chữ nhật có kiểu dáng đẹp nhất
                      </Link>
                    </li>
                    <li className={styles.justifyText}>
                      <Link href="#">
                        CÓ BAO NHIÊU LOẠI MẶT KÍNH ĐỒNG HỒ, LOẠI MẶT KÍNH ĐỒNG
                        HỒ NÀO TỐT NHẤT?&nbsp;
                      </Link>
                    </li>
                  </ul>

                  <p className={styles.justifyText}>&nbsp;</p>

                  <h2 className={styles.heading}>
                    <strong>
                      3. ĐỊA CHỈ MUA ĐỒNG HỒ NAM CHÍNH HÃNG UY TÍN
                    </strong>
                  </h2>

                  <p className={styles.justifyText}>
                    Cuối cùng, lựa chọn một
                    <strong>
                      <em>cửa hàng đồng hồ nam uy tín</em>
                    </strong>
                    &nbsp;để mua chiếc đồng hồ ưng ý nhất cũng là vấn đề quan
                    trọng.
                  </p>

                  <p dir="ltr" className={styles.justifyText}>
                    <strong className={styles.strongText}>Duy Anh Watch</strong>{" "}
                    là nhà phân phối được ủy quyền chính thức của các thương
                    hiệu đồng hồ hàng đầu thế giới của Thụy Sĩ:
                    <em>
                      <strong>
                        <Link href="#">Longines</Link>,{" "}
                        <Link href="#">Tissot</Link>, <Link href="#">Mido</Link>
                        , <Link href="#">Hamilton</Link>,
                        <Link href="#">Certina</Link>,{" "}
                        <Link href="#">Titoni</Link>,{" "}
                        <Link href="#">Frederique Constant</Link>
                      </strong>
                    </em>
                    … thương hiệu đồng hồ thời trang
                    <em>
                      <strong>
                        <Link href="#">Daniel Wellington (DW)</Link>
                      </strong>
                    </em>
                    &nbsp;của Thụy Điển do Filip Tysander thành lập năm 2011
                    nhưng đã có bước tăng trưởng thần kỳ vào năm 2015 (với hơn
                    4700% doanh thu)&nbsp;và các thương hiệu đồng hồ Nhật Bản
                    nổi tiếng về chất lượng và độ bền&nbsp;như
                    <em>
                      <strong>
                        <Link href="#">Seiko</Link>,{" "}
                        <Link href="#">Citizen</Link>,{" "}
                        <Link href="#">Orient</Link>,<Link href="#">Casio</Link>
                      </strong>
                    </em>
                    … Với hệ thống cửa hàng nằm ở những vị trí đắc địa, cơ sở
                    vật chất đẳng cấp cho phép khách hàng đánh giá cao trải
                    nghiệm mua sắm đồng hồ, đồng thời được hưởng lợi từ dịch vụ
                    chuyên nghiệp và xuất sắc.
                  </p>

                  <p dir="ltr" className={styles.justifyText}>
                    Tất cả các sản phẩm hiện có trong hệ thống cửa hàng của
                    chúng tôi đều được bảo hành chính hãng từ 1 đến 3 năm tùy
                    theo mặt hàng và điều kiện riêng của thương hiệu. Bên cạnh
                    đó bạn còn nhận được gói bảo hành 5 năm cùng nhiều quyền lợi
                    hấp dẫn tại
                    <Link href="#">
                      <strong className={styles.strongText}>
                        Đồng hồ Duy Anh
                      </strong>
                    </Link>
                    .
                  </p>

                  <p dir="ltr" className={styles.justifyText}>
                    &nbsp;
                  </p>

                  <hr />

                  <p dir="ltr" className={styles.justifyText}>
                    <strong className={styles.strongText}>
                      Hệ thống&nbsp;mạng xã hội của Đồng hồ Duy Anh
                    </strong>
                  </p>

                  <ul>
                    <li>
                      Facebook:&nbsp;
                      <Link href="#" className={styles.socialLink}>
                        https://www.facebook.com/donghoduyanh.vn
                      </Link>
                    </li>

                    <li>
                      Instagram:&nbsp;
                      <Link
                        href="https://www.instagram.com/donghoduyanh_official/"
                        target="_blank"
                        className={styles.socialLink}
                      >
                        https://www.instagram.com/donghoduyanh_official/
                      </Link>
                    </li>
                  </ul>

                  <hr />

                  <p className={styles.justifyText}>&nbsp;</p>
                  <p className={styles.justifyText}>&nbsp;</p>
                  <p className={styles.justifyText}>&nbsp;</p>
                  <p className={styles.justifyText}>&nbsp;</p>
                </div>
                {/* Xem thêm   */}
                <div className={styles.summaryContent}>
                  <span>Xem thêm</span>
                </div>
                <div className={styles.clear}></div>
                <div
                  className={`${styles.aq_relates} ${styles.content_li}`}
                ></div>
              </div>
            </div>
            {/* end đồng hồ nam   */}
            <div className={styles.clear}></div>
          </div>
        </div>
      </div>
    </>
  );
}
