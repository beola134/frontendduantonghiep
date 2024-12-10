"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./header.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
export default function Menu() {
  const [isProductDropdownOpen, setProductDropdownOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const isActive = (path) => currentPath === path;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
      setCurrentPath(pathname === "/" ? "/components/thongke" : pathname);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("bootstrap/dist/js/bootstrap.bundle.min.js");
    }
  }, []);

  const handleLinkClick = (path) => {
    setCurrentPath(path);
  };

  const [user, setUser] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    if (token) {
      const decoded = jwtDecode(token);
      fetchUserDetails(decoded._id);
    }
  }, []);
  const fetchUserDetails = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/users/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };
  {
    /*Đăng xuất*/
  }
  const handleLayout = () => {
    Cookies.remove("token");
    Swal.fire({
      title: "Đăng xuất thành công",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      window.location.href = "/components/components-login/login";
    });
  };

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    if (token) {
      const decoded = jwtDecode(token);
      console.log(decoded);
      if (decoded.quyen === 1) {
        fetchUserDetails(decoded._id);
      } else {
        setShowMessage(true);
      }
    } else {
      setShowMessage(true);
    }
  }, []);

  return (
    <div className={styles.SidebarContainer}>
      {showMessage ? (
        <div className={styles.centeredMessageContainer}>
          <p className={styles.centeredMessage}>Bạn không có quyền truy cập vào trang này</p>
        </div>
      ) : (
        <>
          <section id={styles.sidebar}>
            <Link href="" className={styles.brand}>
              <i className={`bx bxs-smile ${styles.icon}`}></i>
              AdminSite
            </Link>
            <ul className={styles.sideMenu}>
              <li>
                <Link
                  href="/admin/components/quanlyadmin/thongke"
                  className={isActive("/components/quanlyadmin/thongke") ? styles.active : ""}
                  onClick={() => handleLinkClick("/components/quanlyadmin/thongke")}
                >
                  <i className={`bx bxs-chart ${styles.icon}`}></i>
                  Thống Kê
                </Link>
              </li>
              <li className={styles.divider} data-text="Sản Phẩm">
                Sản Phẩm
              </li>
              <li>
                <Link
                  href="/admin/components/quanlyadmin/sanpham"
                  className={isActive("/components/quanlyadmin/sanpham") ? styles.active : ""}
                  onClick={() => handleLinkClick("/components/quanlyadmin/sanpham")}
                >
                <i className={`bx bxs-package ${styles.icon}`}></i>
                  Quản lý sản phẩm
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/components/quanlyadmin/thuonghieu"
                  className={isActive("/components/quanlyadmin/thuonghieu") ? styles.active : ""}
                  onClick={() => handleLinkClick("/components/quanlyadmin/thuonghieu")}
                >
                <i className={`bx bxs-tag ${styles.icon}`}></i>
                  Quản lý thương hiệu
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/components/quanlyadmin/danhmuc"
                  className={isActive("/components/quanlyadmin/danhmuc") ? styles.active : ""}
                  onClick={() => handleLinkClick("/components/quanlyadmin/danhmuc")}
                >
                <i className={`bx bxs-category ${styles.icon}`}></i>
                  Quản lý danh mục
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/components/quanlyadmin/quanlikho"
                  className={isActive("/components/quanlyadmin/quanlikho") ? styles.active : ""}
                  onClick={() => handleLinkClick("/components/quanlyadmin/quanlikho")}
                >
                <i className={`bx bxs-box ${styles.icon}`}></i>
                  Quản lý kho
                </Link>
              </li>
              <li className={styles.divider} data-text="Bình luận">
                Bình luận
              </li>
              <li>
                <Link
                  href="/admin/components/quanlyadmin/comments"
                  className={isActive("/components/quanlyadmin/comments") ? styles.active : ""}
                  onClick={() => handleLinkClick("/components/quanlyadmin/comments")}
                >
                  <i className={`bx bxs-comment-detail ${styles.icon}`}></i>
                  Quản lý bình luận
                </Link>
              </li>
              <li className={styles.divider} data-text="Tài khoản">
                Tài khoản
              </li>
              <li>
                <Link
                  href="/admin/components/quanlyadmin/taikhoan"
                  className={isActive("/components/quanlyadmin/taikhoan") ? styles.active : ""}
                  onClick={() => handleLinkClick("/components/quanlyadmin/taikhoan")}
                >
                  <i className={`bx bxs-user-account ${styles.icon}`}></i>
                  Quản Lý Tài khoản
                </Link>
              </li>
              <li className={styles.divider} data-text="Đơn Hàng">
                Đơn Hàng
              </li>
              <li>
                <Link
                  href="/admin/components/quanlyadmin/quanlydonhang"
                  className={isActive("/components/quanlyadmin/quanlydonhang") ? styles.active : ""}
                  onClick={() => handleLinkClick("/components/quanlyadmin/quanlydonhang")}
                >
                <i className={`bx bxs-cart-alt ${styles.icon}`}></i>
                  Quản Lý Đơn Hàng
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/components/quanlyadmin/chitietdonhang"
                  className={isActive("/components/quanlyadmin/chitietdonhang") ? styles.active : ""}
                  onClick={() => handleLinkClick("/components/quanlyadmin/chitietdonhang")}
                >
                  <i className={`bx bxs-cart ${styles.icon}`}></i>
                  Sản Phẩm Đã Bán
                </Link>
              </li>
              <li className={styles.divider} data-text="Voucher">
                Voucher
              </li>
              <li>
                <Link
                  href="/admin/components/quanlyadmin/voucher"
                  className={isActive("/components/quanlyadmin/voucher") ? styles.active : ""}
                  onClick={() => handleLinkClick("/components/quanlyadmin/voucher")}
                >
                  <i className={`bx bx-qr ${styles.icon}`}></i>
                  Quản lý Voucher
                </Link>
              </li>
            </ul>
          </section>
          <section id={styles.content}>
            <nav className={styles.nav}>
              <i className={`bx bx-menu ${styles.toggleSidebar}`}></i>
              <form action="#"></form>
              {/*
              <a href="#" className={styles.navLink}>
              <i className={`bx bxs-bell ${styles.icon}`}></i>
              <span className={styles.badge}>5</span>
            </a>
            <a href="/admin/components/comments" className={styles.navLink}>
              <i className={`bx bxs-message-square-dots ${styles.icon}`}></i>
              <span className={styles.badge}>8</span>
            </a>*/}
              <span className={styles.divider}></span>
              {user ? (
                <div className="dropdown profile">
                  <a
                    className="dropdown-toggle d-flex align-items-center"
                    href="#"
                    id="profileDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {/*<img
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cGVvcGxlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                alt=""
                className={`${styles.roundedCircle}`}
                width="40"
                height="40"
              />*/}
                    <img
                      src={
                        user.user.hinh_anh.startsWith("http")
                          ? user.user.hinh_anh
                          : `http://localhost:5000/images/${user.user.hinh_anh}`
                      }
                      className={`${styles.roundedCircle}`}
                      width="40"
                      height="40"
                    />
                  </a>
                  <ul
                    className={`dropdown-menu dropdown-menu-end ${styles.dropdownMenu}`}
                    aria-labelledby="profileDropdown"
                  >
                    <li>
                      <Link
                        className={`dropdown-item ${styles.dropdownItem}`}
                        href={`/admin/components/quanlyadmin/ho_so_admin/${user.user._id}`}
                      >
                        <i className="bx bxs-user-circle icon"></i>
                        Hồ sơ
                      </Link>
                    </li>

                    <li>
                      <a className={`dropdown-item ${styles.dropdownItem}`} href="#" onClick={handleLayout}>
                        <i className="bx bxs-log-out-circle"></i>
                        Đăng xuất
                      </a>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="dropdown profile">
                  <a
                    className="dropdown-toggle d-flex align-items-center"
                    href="#"
                    id="profileDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {/*<img
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cGVvcGxlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                alt=""
                className={`${styles.roundedCircle}`}
                width="40"
                height="40"
              />*/}

                    <img
                      src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cGVvcGxlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                      alt=""
                      className={`${styles.roundedCircle}`}
                      width="40"
                      height="40"
                    />
                  </a>
                  <ul
                    className={`dropdown-menu dropdown-menu-end ${styles.dropdownMenu}`}
                    aria-labelledby="profileDropdown"
                  >
                    <li>
                      <Link className={`dropdown-item ${styles.dropdownItem}`} href={"/admin/"}>
                        <i className="bx bxs-user-circle icon"></i>
                        Hồ sơ
                      </Link>
                    </li>

                    <li>
                      <a className={`dropdown-item ${styles.dropdownItem}`} href="#" onClick={handleLayout}>
                        <i className="bx bxs-log-out-circle"></i>
                        Đăng xuất
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </nav>
          </section>
        </>
      )}
    </div>
  );
}
