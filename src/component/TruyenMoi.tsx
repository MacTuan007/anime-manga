import { useEffect, useState } from "react";
import { get, ref, child } from "firebase/database";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import type { Truyen } from "../interfaces/Truyen";

const ITEMS_PER_PAGE = 16;

export default function TruyenMoi() {
  const [dsTruyen, setDsTruyen] = useState<Truyen[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const dbRef = ref(db);
    get(child(dbRef, "truyen")).then((snapshot) => {
      if (!snapshot.exists()) return;

      const data = snapshot.val();
      const danhSach: Truyen[] = [];

      Object.entries(data).forEach(([id, truyen]: [string, any]) => {
        if (parseInt(truyen.trangthai) !== 1 || !truyen.chuong) return;

        const chuongList = Object.entries(truyen.chuong)
          .filter(([_, val]: [string, any]) => typeof val === "object" && val["ngay-dang"])
          .map(([soChuong, val]: [string, any]) => ({
            soChuong,
            ngayDang: val["ngay-dang"],
          }));

        if (chuongList.length === 0) return;

        const moiNhat = chuongList.sort((a, b) => b.ngayDang - a.ngayDang)[0];

        danhSach.push({
          id,
          ten: truyen.ten,
          tacgia: truyen.tacgia,
          chuongMoiNhat: moiNhat.soChuong,
          ngayDangChuong: moiNhat.ngayDang,
          thumbnail: truyen.thumbnail || "/no-image.jpg",
        });
      });

      danhSach.sort((a, b) => b.ngayDangChuong - a.ngayDangChuong);
      setDsTruyen(danhSach);
    });
  }, []);

  const totalPages = Math.ceil(dsTruyen.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = dsTruyen.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="truyen-moi-container">
      <h2 className="section-title">Truyện Mới Cập Nhật</h2>
      <div className="truyen-grid">
        {currentData.map((truyen) => (
          <div
            key={truyen.id}
            className="truyen-card"
            onClick={() => navigate(`/chi-tiet/${truyen.id}`)}
          >
            <img
              src={truyen.thumbnail}
              alt={truyen.ten}
              className="truyen-img"
            />
            <div className="truyen-ten">{truyen.ten}</div>
            <div className="chuong-moi">Chương {truyen.chuongMoiNhat}</div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button onClick={() => goToPage(1)} disabled={currentPage === 1}>Đầu</button>
        {renderPageNumbers().map((page, idx) => (
          <button
            key={idx}
            onClick={() => typeof page === "number" && goToPage(page)}
            className={currentPage === page ? "active" : ""}
            disabled={page === "..."}
          >
            {page}
          </button>
        ))}
        <button onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}>Cuối</button>
      </div>
    </div>
  );
}
