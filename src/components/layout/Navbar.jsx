// src/components/layout/Navbar.jsx
import React, { useEffect, useState } from "react";
import { getPublicHeader } from "../../api/publicApi";
import { useAuthStore } from "../../store/useAuthStore";

export default function Navbar() {
  const [links, setLinks] = useState([]);
  const { user } = useAuthStore();

  useEffect(() => {
    getPublicHeader().then((res) => {

      // نحذف تسجيل الدخول لو جاي من CMS
      const filtered = res.data.filter(
        (item) => item.url !== "/login" && item.page !== "login"
      );

      setLinks(filtered);
    });
  }, []);

  return (
    <nav className="navbar">
      <ul>

        {/* CMS Links */}
        {links.map((link) => (
          <li key={link.id}>
            <a href={link.url || `/page/${link.page}`}>{link.label_ar}</a>

            {link.children?.length > 0 && (
              <ul className="dropdown">
                {link.children.map((child) => (
                  <li key={child.id}>
                    <a href={child.url || `/page/${child.page}`}>
                      {child.label_ar}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}

        {/* Login / Dashboard */}
        {user ? (
          <li><a href="/dashboard">لوحة التحكم</a></li>
        ) : (
          <li><a href="/login">تسجيل الدخول</a></li>
        )}

      </ul>
    </nav>
  );
}
