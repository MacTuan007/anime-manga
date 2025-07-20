import { useEffect, useState } from "react";
import { get, ref, child } from "firebase/database";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import type { Truyen } from "../interfaces/Truyen";
import Header from "../partials/Header";
import useTheLoaiList from "../utils/theloaiList";
import HeaderMenu from "../partials/HeaderMenu";

const ITEMS_PER_PAGE = 16;

export default function TheoDoiPage() {
    const theLoaiList = useTheLoaiList();
    const [dsTruyen, setDsTruyen] = useState<Truyen[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const emailkey = localStorage.getItem("emailkey");
        if (!emailkey) return;

        const dbRef = ref(db);
        get(child(dbRef, `users/${emailkey}/theodoi`)).then((snap) => {
            if (!snap.exists()) return;

            const truyenIds = Object.keys(snap.val());

            get(child(dbRef, "truyen")).then((snapshot) => {
                if (!snapshot.exists()) return;

                const allTruyen = snapshot.val();
                const danhSach: Truyen[] = [];

                truyenIds.forEach((id) => {
                    const truyen = allTruyen[id];
                    if (!truyen || !truyen.chuong) return;

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
        <>
            <Header />
            <HeaderMenu theLoaiList={theLoaiList} />
            <div className="container my-4">
                <h2 className="text-center mb-4">Truyện Đang Theo Dõi</h2>

                {dsTruyen.length === 0 ? (
                    <p className="text-center">Bạn chưa theo dõi truyện nào.</p>
                ) : (
                    <>
                        <div className="row g-4">
                            {currentData.map((truyen) => (
                                <div key={truyen.id} className="col-6 col-md-3">
                                    <div
                                        className="card h-100 shadow-sm border-0 hover-shadow cursor-pointer"
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
                                    <button className="page-link" onClick={() => goToPage(1)}>
                                        Đầu
                                    </button>
                                </li>
                                {renderPageNumbers().map((page, idx) => (
                                    <li
                                        key={idx}
                                        className={`page-item ${currentPage === page ? "active" : ""
                                            } ${page === "..." ? "disabled" : ""}`}
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
                                    <button className="page-link" onClick={() => goToPage(totalPages)}>
                                        Cuối
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </>
                )}
            </div>
        </>
    );
}
