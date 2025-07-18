import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Tags } from '../interfaces/Tag';

interface Props {
  theLoaiList: Tags[];
}

export default function HeaderMenu({ theLoaiList }: Props) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="header-menu-container" onMouseLeave={() => setShowDropdown(false)}>
      <div className="header-menu">
        <div className="hamburger mobile" onClick={() => setIsMenuOpen(!isMenuOpen)}>☰</div>

        <div className={`menu-items ${isMenuOpen ? "open" : ""}`}>
          <div
            className="menu-item"
            onMouseEnter={() => setShowDropdown(true)}
          >
            Thể Loại ▾
          </div>

          <button className="menu-item" onClick={() => navigate("/lich-su")}>Lịch Sử</button>
          <button className="menu-item" onClick={() => navigate("/theo-doi")}>Theo Dõi</button>
        </div>
      </div>

      {showDropdown && (
        <div className="category-dropdown" ref={dropdownRef}>
          {theLoaiList.map((item) => (
            <div
              key={item.tenlink}
              className="category-item"
              onClick={() => navigate(`/the-loai/${item.tenlink}`)}
            >
              {item.ten}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
