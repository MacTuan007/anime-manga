import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, get } from "firebase/database";
import Header from "../partials/Header";
import useTheLoaiList from "../utils/theloaiList";
import HeaderMenu from "../partials/HeaderMenu";
import type { Truyen } from "../interfaces/Truyen";
import Footer from "../partials/Footer";

const ITEMS_PER_PAGE = 16;

export default function TimKiemPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [results, setResults] = useState<Truyen[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const keyword = params.get("tu") || "";
  const theLoaiList = useTheLoaiList();

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await get(ref(db, "truyen"));
      if (!snapshot.exists()) return;

      const data = snapshot.val();
      const matched: Truyen[] = [];

      Object.entries(data).forEach(([id, truyen]: [string, any]) => {
        if (
          !truyen.ten?.toLowerCase().includes(keyword.toLowerCase()) ||
          parseInt(truyen.trangthai) !== 1 ||
          !truyen.chuong
        )
          return;

        const chuongList = Object.entries(truyen.chuong)
          .filter(([_, val]: [string, any]) => typeof val === "object" && val["ngay-dang"])
          .map(([soChuong, val]: [string, any]) => ({
            soChuong,
            ngayDang: val["ngay-dang"],
          }));

        if (chuongList.length === 0) return;

        const moiNhat = chuongList.sort((a, b) => b.ngayDang - a.ngayDang)[0];

        matched.push({
          id,
          ten: truyen.ten,
          tacgia: truyen.tacgia,
          chuongMoiNhat: moiNhat.soChuong,
          ngayDangChuong: moiNhat.ngayDang,
          thumbnail: truyen.thumbnail || "/no-image.jpg",
        });
      });

      matched.sort((a, b) => b.ngayDangChuong - a.ngayDangChuong);
      setResults(matched);
    };

    if (keyword.trim()) fetchData();
  }, [keyword]);

  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = results.slice(startIdx, startIdx + ITEMS_PER_PAGE);

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
    <>
      <Header />
      <HeaderMenu theLoaiList={theLoaiList} />
      <div className="container py-3">
        <h3>Kết quả tìm kiếm cho: <em>{keyword}</em></h3>

        {results.length === 0 ? (
          <p>Không tìm thấy kết quả.</p>
        ) : (
          <>
            <div className="row g-4">
              {currentData.map((truyen) => (
                <div key={truyen.id} className="col-6 col-md-3">
                  <div
                    className="card h-100 shadow-sm border-0"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/chi-tiet/${truyen.id}`)}
                  >
                    <img
                      src={truyen.thumbnail}
                      className="card-img-top"
                      alt={truyen.ten}
                      style={{ height: "250px", objectFit: "cover" }}
                    />
                    <div className="card-body p-2">
                      <h6 className="card-title text-truncate" title={truyen.ten}>
                        {truyen.ten}
                      </h6>
                      <p className="card-text text-muted small">
                        Chương {truyen.chuongMoiNhat}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <nav className="d-flex justify-content-center mt-4">
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 && "disabled"}`}>
                  <button className="page-link" onClick={() => goToPage(1)}>Đầu</button>
                </li>
                {renderPageNumbers().map((page, idx) => (
                  <li
                    key={idx}
                    className={`page-item ${currentPage === page ? "active" : ""} ${page === "..." ? "disabled" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => typeof page === "number" && goToPage(page)}
                    >
                      {page}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages && "disabled"}`}>
                  <button className="page-link" onClick={() => goToPage(totalPages)}>Cuối</button>
                </li>
              </ul>
            </nav>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
