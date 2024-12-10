import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "./footer.module.css";

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  // Hàm xử lý sự kiện cuộn
  const toggleVisibility = () => {
    if (window.scrollY > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Hàm cuộn lên đầu trang
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);
  return (
    <footer>
      {/* Footer Top */}
      <div className={styles.topFooter}>
        <div className={styles.contactSimpleFt}>
          <div className={styles.container}>
            <div className={`${styles.blockContactSimple}  ${styles.cls}`}>
              <div className={styles.item}>
                <div className={styles.icon}>
                  <i className="fa-regular fa-clock"></i>
                </div>
                <div className={styles.title}>Mua hàng Online</div>
                <div className={styles.content}>Tất cả các ngày trong tuần</div>
              </div>
              <div className={`${styles.item} ${styles.cls}`}>
                <div className={styles.icon}>
                  <i className="fa-solid fa-phone"></i>
                </div>
                <div className={styles.item1}>
                  <div className={styles.title}>Hỗ trợ bán hàng</div>
                  <div className={styles.content}>084.5487.339</div>
                </div>
                <div className={styles.item2}>
                  <div className={styles.title}>Hỗ trợ kỹ thuật</div>
                  <div className={styles.content}>070.4434.597</div>
                </div>
              </div>
              <div className={styles.item}>
                <div className={styles.icon}>
                  <i className="fa-regular fa-envelope"></i>
                </div>
                <div className={styles.title}>Email</div>
                <div className={styles.content}>watchwristly@gmail.com</div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.clear}></div>

        <div className={styles.container}>
          <div className={styles.footerFacebook}>
            <div className={styles.bottommenuFt}>
              <ul className={styles.menuBottom}>
                <li className={`${styles.level0} ${styles.firstItem}`}>
                  <span className={styles.clickMobile}></span>
                  <Link href="#">Về donghowristly</Link>
                  <ul id="menu-sub1">
                    <li className={styles.level1}>
                      <Link href="#">Giới thiệu về donghowristly</Link>
                    </li>
                    <li className={styles.level1}>
                      <Link href="#">Triết lý kinh doanh</Link>
                    </li>
                    <li className={styles.level1}>
                      <Link href="#">Giấy chứng nhận và giải thưởng</Link>
                    </li>
                    <li className={styles.level1}>
                      <Link href="#">Khách hàng nói gì về chúng tôi</Link>
                    </li>
                  </ul>
                </li>
                <li className={`${styles.level0} ${styles.menuItem}`}>
                  <span className={styles.clickMobile}></span>
                  <Link href="#">Chăm sóc khách hàng</Link>
                  <ul id="menu-sub6">
                    <li className={styles.menusubItem}>
                      <Link href="#">Hướng dẫn mua hàng</Link>
                    </li>
                    <li className={styles.menusubItem}>
                      <Link href="#">Chính sách đổi trả</Link>
                    </li>
                    <li className={styles.menusubItem}>
                      <Link href="#">Chính sách bảo hành</Link>
                    </li>
                    <li className={styles.menusubItem}>
                      <Link href="#">Dịch vụ và sửa chữa</Link>
                    </li>
                    <li className={styles.menusubItem}>
                      <Link href="#">Hướng dẫn sử dụng đồng hồ</Link>
                    </li>
                    <li className={styles.menusubItem}>
                      <Link href="#">Chính sách Khách hàng thân thiết</Link>
                    </li>
                  </ul>
                </li>
                <li className={`${styles.level0} ${styles.menuItem}`}>
                  <span className={styles.clickMobile}></span>
                  <Link href="#">Tiện ích</Link>
                  <ul id="menu-sub13">
                    <li className={styles.menusubItem}>
                      <Link href="#">Tin Tức Và Sự Kiện</Link>
                    </li>
                    <li className={styles.menusubItem}>
                      <Link href="#">Tuyển dụng</Link>
                    </li>
                    <li className={styles.menusubItem}>
                      <Link href="#">Thanh Toán</Link>
                    </li>
                    <li className={styles.menusubItem}>
                      <Link href="#">Mua hàng online</Link>
                    </li>
                    <li className={styles.menusubItem}>
                      <Link href="#">Mua Hàng Trả Góp</Link>
                    </li>
                  </ul>
                </li>
              </ul>
              <div className={styles.clear}></div>
            </div>

            <div className={styles.fanpageFb}>
              <div
                className="fb-page"
                data-href="https://www.facebook.com/profile.php?id=61566364566665"
                data-tabs="timeline"
                data-width="300"
                data-height="70"
                data-small-header="false"
                data-adapt-container-width="false"
                data-hide-cover="false"
                data-show-facepile="false"
              >
                <blockquote
                  cite="https://www.facebook.com/profile.php?id=61566364566665"
                  className="fb-xfbml-parse-ignore"
                >
                  <Link href="https://www.facebook.com/profile.php?id=61566364566665">Đồng Hồ Wristly</Link>
                </blockquote>
              </div>

              <div className={styles.blockShare}>
                <div className={styles.titleSocial}>Liên kết</div>
                <div className={styles.socialFt}>
                  <Link href="">
                    <i className="fa-brands fa-facebook"></i>
                  </Link>

                  <Link href="">
                    <i className="fa-brands fa-instagram"></i>
                  </Link>
                </div>
              </div>
            </div>
            <div className={styles.clear}></div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className={styles.footerBottom}>
        <div className={`${styles.container} ${styles.cls}`}>
          <div className={styles.footerBottom1}>
            <div className={styles.title}>CÔNG TY TNHH PHÁT TRIỂN WRISTLY</div>
            <ul>
              <li>VPGD: Công viên phần mềm Quang Trung, P. Tân Chánh Hiệp, Quận 12, TP.HCM</li>
              <li>Điện thoại: (08)4.5487.399</li>
              <li>MST: 0105545498 Cấp ngày: 03/10/2011 Nơi cấp: TP. Hồ Chí Minh</li>
            </ul>
          </div>
          <div className={styles.footerBottom2}>
            <div className={styles.bctCopyright}>
              <Link href="#">
                <img src="/image/item/dathongbao.png" alt="Bộ công thương chứng nhận" width="148px" height="56px" />
              </Link>
              <div className={styles.copyring}>© WristlyWatch-All rights reserved</div>
            </div>
            <div className={styles.dmcaDa} style={{ width: "150px", marginTop: "4px" }}>
              <Link
                href="https://www.dmca.com/Protection/Status.aspx?ID=5cdfd6b9-54ac-4fa8-953f-524e3520dffa&refurl=https://donghoduyanh.com/"
                className={styles.dmcaBadge}
              >
                <img src="/image/item/dmca_protected_sml_120l.png" alt="" />
              </Link>
            </div>
            <div className={styles.blockTagsFt}>
              <div className={styles.blockTagsDefault}>
                <Link href="">Longines</Link>
                <span className={styles.sepa}> | </span>
                <Link href="">Tissot</Link>
                <span className={styles.sepa}> | </span>
                <Link href="">MIDO</Link>
                <span className={styles.sepa}> | </span>
                <Link href="">Frederique Constant</Link>
                <span className={styles.sepa}> | </span>
                <Link href="">Seiko</Link>
                <span className={styles.sepa}> | </span>
                <Link href="">Citizen</Link>
                <span className={styles.sepa}> | </span>
                <Link href="">Orient</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="fixedBar" style={{ position: "fixed", bottom: "168px", display: isVisible ? "block" : "none" }}>
        <div id="barInner">
          <button className={styles.goTop} href="" onClick={scrollToTop}>
            <i className="fa-solid fa-angles-up"></i>
          </button>
        </div>
      </div>
      <div className={styles.loading}></div>
    </footer>
  );
}
