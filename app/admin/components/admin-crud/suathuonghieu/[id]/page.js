'use client';
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import styles from "./suadanhmuc.module.css";
import Swal from "sweetalert2";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function SuaThuongHieu() {
    const [productName, setProductName] = useState("");
    const [productImage, setProductImage] = useState(null);
    const [productLogo, setProductLogo] = useState(null);
    const [description, setDescription] = useState("");
    const router = useRouter();
    const { id } = useParams();

    
    useEffect(() => {
    const fetchCategory = async () => {
        try {
            const response = await fetch(`http://localhost:5000/thuonghieu/allthuonghieu/${id}`);
            if (response.ok) {
                const data = await response.json();
                setProductName(data.th.thuong_hieu);
                setDescription(data.th.mo_ta);
                
            } else {
                Swal.fire("Error", "Không tìm thấy thương hiệu!", "error");
            }
        } catch (error) {
            console.error("Error fetching category:", error);
            Swal.fire("Error", "Có lỗi xảy ra khi tải thông tin!", "error");
        }
    };
    fetchCategory();
}, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("thuong_hieu", productName);
        if (productImage) formData.append("hinh_anh", productImage);
        if (productLogo) formData.append("hinh_anh2", productLogo);
        formData.append("mo_ta", description);

        try {
            const response = await fetch(`http://localhost:5000/thuonghieu/updatethuonghieu/${id}`, {
                method: "PUT",
                body: formData,
            });

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Thành công",
                    text: "Sửa thương hiệu thành công!",
                }).then(() => {
                    router.push("/admin/components/quanlyadmin/thuonghieu");
                });
            } else {
                Swal.fire("Error", "Có lỗi xảy ra!", "error");
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire("Error", "Có lỗi xảy ra!", "error");
        }
    };

    return (
        <div className={styles.SidebarContainer}>
            <section id={styles.content}>
                <div className={styles.header1}>
                    <div className={styles.title} style={{ fontWeight: "bold" }}>
                        Sửa Danh Mục
                    </div>
                </div>
                <div className={styles.bg}>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.container1}>
                            <div className={styles.formGroup}>
                                <label htmlFor="product-name">Tên thương hiệu</label>
                                <input
                                    type="text"
                                    id="product-name"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="product-image">Ảnh thương hiệu</label>
                                <input
                                    type="file"
                                    id="product-image"
                                    className="file-input"
                                    onChange={(e) => setProductImage(e.target.files[0])}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="product-logo">Ảnh thương hiệu 2 (logo)</label>
                                <input
                                    type="file"
                                    id="product-logo"
                                    className="file-input"
                                    onChange={(e) => setProductLogo(e.target.files[0])}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="description">Mô tả thương hiệu</label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="btn btn-outline-primary">
                                Cập nhật
                            </button>
                            <Link href="/admin/components/quanlyadmin/thuonghieu">
                            <button type="button" className="btn btn-outline-secondary w-100">
                            Hủy bỏ
                            </button>
                        </Link>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
}
