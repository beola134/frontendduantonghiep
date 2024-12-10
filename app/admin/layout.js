"use client";
import Menu from "./components/layout/header/header";
import "./globals.css";
import "boxicons/css/boxicons.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export default function RootLayout({ children }) {
  const [showInterface, setShowinterface] = useState([false]);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
      
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded && decoded.quyen === 1) {
          setShowinterface(true);
        } else {
          setShowinterface(false);
        }
      } catch (error) {
        console.error("Token không hợp lệ:", error);
        setShowinterface(false);
      }
    } else {
      setShowinterface(false);
    }
  }, []);
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://unpkg.com/boxicons@2.0.9/css/boxicons.min.css"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css"
        />
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
        <title>Trang quản trị</title>
        <link rel="icon" href="/logo.png" />
      </head>

      <body>
        {showInterface ? (
          <>
            <Menu />
            {children}
          </>
        ) : (
          <div
            style={{ textAlign: "center",marginTop: "100px", color: "red" }}
          >
            <img  src="/image/item/bg-403.png" alt=""/>
            <h2>Bạn không có quyền truy cập vào trang này</h2>
          </div>
        )}
      </body>
    </html>
  );
}
