"use client";
import React, { useEffect, useState } from "react";
import styles from "./bannerslide2.module.css";
import classNames from "classnames/bind";
import Slider from "react-slick"; 

const cx = classNames.bind(styles);

export default function BannerSlide1() {


  const cates = [
    { src: "image/item/banner-product-carousel/banner-1.webp",
      alt: "Banner 1",
      img: "/image/item/banner-product-carousel/banner-product1.webp",
      title: "Vàng 18k",
      type: "Bộ Sưu Tập",
      description: "Tuyển chọn những mẫu đồng hồ vàng 18K bán chạy",
      more: "VÀO CỬA HÀNG"
      },
       { src: "image/item/banner-product-carousel/banner-2.webp",
      alt: "Banner 2",
      img: "/image/item/banner-product-carousel/banner-product2.webp",
      title: "Open Heart",
      type: "Bộ sưu tập mới",
      description: "Bộ sưu tập những mẫu đồng hồ lộ máy cực đẹp",
      more: "VÀO CỬA HÀNG"
      },
       { src: "image/item/banner-product-carousel/banner-3.webp",
      alt: "Banner 3",
      img: "/image/item/banner-product-carousel/banner-product3.webp",
      title: "Xanh Lam",
      type: "Bộ Sưu Tập",
      description: "Tổng hợp những mẫu đồng hồ mặt xanh được yêu thích nhất",
      more: "VÀO CỬA HÀNG"
      },
       { src: "image/item/banner-product-carousel/banner-4.webp",
      alt: "Banner 4",
      img: "/image/item/banner-product-carousel/banner-product4.webp",
      title: "Siêu Mỏng",
      type: "Bộ Sưu Tập",
      description: "Tổng hợp những mẫu đồng hồ siêu mỏng được khách hàng lựa chọn nhiều nhất tại Wristly",
      more: "VÀO CỬA HÀNG"
      },
       { src: "image/item/banner-product-carousel/banner-5.webp",
      alt: "Banner 5",
      img: "/image/item/banner-product-carousel/banner-product5.webp",
      title: "Skeleton",
      type: "Bộ Sưu Tập",
      description: "Tuyển chọn những mẫu đồng hồ Skeleton bán chạy",
      more: "VÀO CỬA HÀNG"
      },
       { src: "image/item/banner-product-carousel/banner-6.webp",
      alt: "Banner 6",
      img: "/image/item/banner-product-carousel/banner-product6.webp",
      title: "Quân Đội",
      type: "Bộ sưu tập đồng hồ quân đội mới",
      description: "Khám phá những mẫu đồng hồ quân đội hot nhất",
      more: "VÀO CỬA HÀNG"
      },
       { src: "image/item/banner-product-carousel/banner-7.webp",
      alt: "Phi Công",
      img: "/image/item/banner-product-carousel/banner-product7.webp",
      title: "Phi Công",
      type: "Bộ Sưu Tập",
      description: "Tuyển chọn những mẫu đồng hồ phi công bán chạy nhất",
      more: "VÀO CỬA HÀNG"
      },
   
  ];

  
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    cssEase: "ease-in-out",
  };
    const [slider, setSlider] = useState(null);
    const next = () => {
      if (slider) {
        slider.slickNext();
      }
    };

    const prev = () => {
      if (slider) {
        slider.slickPrev();
      }
    };
    
    
    useEffect(() => {
      const interval = setInterval(() => {
        if (slider) {
          next();
        }
      }, 5000);

      return () => clearInterval(interval);
    }, [slider]); 
  return (
    <div className={cx("slider-collection")}>
      <div className={cx("pav-slide-content")}>
        <Slider {...settings} ref={(sliderRef) => setSlider(sliderRef)}>
          {cates.map((cate, index) => (
            <div className={cx("item")} key={index}>
              <img
                src={cate.src}
                alt={cate.alt}
                style={{ objectFit: "cover", width: "100%", height: "auto" }}
              />
              <img
                className={cx("image-product", "animate-image")}
                src={cate.img}
              />
              <div className={cx("sl-content")}>
                <div className={cx("title-banner-big", "animate-text")}>{cate.title}</div>
                <div className={cx("type", "animate-text")}>{cate.type}</div>

                <div className={cx("description-slide", "animate-text")}>
                  {cate.description}
                </div>
              </div>
              <div className={cx("read_more")}>
                <a href="#" title="Khám phá thêm">
                  {cate.more}
                </a>
              </div>
            </div>
          ))}
        </Slider>
        <div className={cx("owl-controls")}>
          <div className={cx("owl-navs")}>
            <div className={cx("prev")} onClick={prev}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={30}
                height={30}
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="white"
                  strokeWidth={1.45}
                  d="m15 6l-6 6l6 6"
                ></path>
              </svg>
            </div>
            <div className={cx("next")} onClick={next}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={30}
                height={30}
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="white"
                  strokeWidth={1.45}
                  d="m9 6l6 6l-6 6"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
