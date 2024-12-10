"use client";
import React,{ useEffect,useState } from "react";
import Slider from "react-slick";
import styles from "./banner.module.css";
import classNames from "classnames/bind";
import Script from "next/script";
import BannerSlide1 from "../bannerslide1/page";
import BannerSlide2 from "../bannerslide2/page";
import Link from "next/link";


const cx = classNames.bind(styles);
export default function Banner() {
  
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6, 
    slidesToScroll: 1,
    autoplay: true,
    swipeToSlide: true,
    autoplaySpeed: 3000, 
  };
  const [slider, setSlider] = useState(null); 
  useEffect(() => {
    const interval = setInterval(() => {
      if (slider) {
        next();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [slider]); 
  const [thuongHieu, setThuonghieu] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:5000/thuonghieu/allthuonghieu");
      const data = await response.json();
      setThuonghieu(data.th);
    };

    fetchData();
  }, []);
  return (
    <>
      <BannerSlide1 />
      <section className={cx("section-banner")}>
        <div className={cx("typewriter")}>
          <p className={cx("typewriter1")}>WRISTLY - SỐ LƯỢNG ĐỒNG HỒ ĐA DẠNG</p>
        </div>
      </section>

      <section className={cx("icon-section")}>
        <div className={cx("icon-container")}>
          <div className={cx("icon1")}>
            <img src="/image/item/icons/icons_1.png" alt="Icon 1" className={cx("icon-image1")} loading="lazy" />
          </div>
          <div className={cx("text-container")}>
            <p>
              <b>PHÒNG BẢO HÀNH ĐẠT</b>
            </p>
            <small>TIÊU CHUẨN THỤY SĨ</small>
          </div>
        </div>

        <div className={cx("icon-container")}>
          <div className={cx("icon1", "gold")}>
            <img src="/image/item/icons/icon_2.png" alt="Icon 2" className={cx("icon-image1")} loading="lazy" />
          </div>
          <div className={cx("text-container")}>
            <p>
              <b>THƯƠNG HIỆU UY TÍN</b>
            </p>
            <small>LÂU ĐỜI 70 NĂM</small>
          </div>
        </div>

        <div className={cx("icon-container")}>
          <div className={cx("icon1")}>
            <img src="/image/item/icons/icon_3.png" alt="Icon 3" className={cx("icon-image1")} loading="lazy" />
          </div>
          <div className={cx("text-container")}>
            <p>
              <b>ĐỀN 20 LẦN NẾU BÁN</b>
            </p>
            <small>HÀNG FAKE</small>
          </div>
        </div>
      </section>

      <section className={cx("section-img")}>
        <div className={cx("img-banner")}>
          <img
            src="/image/banner/longines-sale_1.jpg"
            alt="Longines Sale Banner"
            width="500"
            height="300"
            loading="lazy"
          />
        </div>
        <div className={cx("img-banner")}>
          <img src="/image/banner/tissot gentleman.jpg" alt="Tissot Banner" loading="lazy" />
        </div>
      </section>

      <section className={cx("brand")}>
        <div className={cx("pav-slide-content")}>
          <div className={cx("fs-slider-home", "fs-slider-home-content", "brand-slider")}>
            <Slider {...settings}>
              {thuongHieu.map((item, index) => (
                 <Link href={`/components/chitietdanhmuc/${item.thuong_hieu}`}>
                <div className={cx("item")} key={item._id}>
                 
                    <img src={`http://localhost:5000/images/${item.hinh_anh}`} alt={item.thuong_hieu} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                  
                </div></Link>
              ))}
            </Slider>
          </div>
        </div>
      </section>
      <BannerSlide2 />

      <Script src="https://code.jquery.com/jquery-3.6.0.min.js" strategy="beforeInteractive" />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js"
        strategy="lazyOnload"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css"
      />
    </>
  );
}
