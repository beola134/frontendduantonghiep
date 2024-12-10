"use client";
import React, { useEffect, useState } from "react";
import styles from "./bannerslide1.module.css";
import classNames from "classnames/bind";
import Slider from "react-slick"; 

const cx = classNames.bind(styles);

export default function BannerSlide1() {


  const cates = [
    { src: "/image/banner/banner1.jpg", alt: "Banner 1" },
    { src: "/image/banner/banner2.jpg", alt: "Banner 2" },
    { src: "/image/banner/banner3.jpg", alt: "Banner 3" },
  ];

  
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000, 
    pauseOnHover: false,
  };
  const [slider, setSlider] = useState(null); 
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
      <Slider {...settings}>
        {cates.map((cate, index) => (
          <div className={cx("item")} key={index}>
            <img
              src={cate.src}
              alt={cate.alt}
              style={{ objectFit: "cover", width: "100%", height: "auto" }}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
