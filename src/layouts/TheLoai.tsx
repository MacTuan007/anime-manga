import { useEffect, useState } from "react";
import { get, ref, child } from "firebase/database";
import { db } from "../firebase";
import { useParams, useNavigate } from "react-router-dom";
import type { Truyen } from "../interfaces/Truyen";
import Header from "../partials/Header";
import HeaderMenu from "../partials/HeaderMenu";
import type { Tag } from "../interfaces/Tag";

const ITEMS_PER_PAGE = 16;

export default function TheLoai() {
    const { tag } = useParams(); // từ URL: /the-loai/:tag
    const [dsTruyen, setDsTruyen] = useState<Truyen[]>([]);
    const [tagInfo, setTagInfo] = useState<Tag | null>(null);
    const [listTags, setListTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const dbRef = ref(db);

            const [tagsSnap, truyenSnap] = await Promise.all([
                get(child(dbRef, "tags")),
                get(child(dbRef, "truyen")),
            ]);

            if (!tagsSnap.exists() || !truyenSnap.exists()) {
                setLoading(false);
                return;
            }

            const tagsData = tagsSnap.val();
            const truyenData = truyenSnap.val();

            // Lấy tất cả tags
            const allTags: Tag[] = Object.values(tagsData).map((t: any) => ({
                ten: t.ten,
                tenlink: t.tenlink,
                noidung: t.noidung,
            }));
            setListTags(allTags);

            // Tìm tag đang xem
            const foundTag = allTags.find((t) => t.tenlink?.toLowerCase() === tag?.toLowerCase()) || null;
            setTagInfo(foundTag);

            if (!foundTag) {
                setDsTruyen([]);
                setLoading(false);
                return;
            }

            // Lọc danh sách truyện thuộc tag này
            const danhSach: Truyen[] = [];

            Object.entries(truyenData).forEach(([id, truyen]: [string, any]) => {
                if (parseInt(truyen.trangthai) !== 1 || !truyen.chuong || !truyen.listtag) return;

                const listTagValues = Object.values(truyen.listtag as Record<string, string>).map((t) =>
                    t.toLowerCase()
                );

                if (!listTagValues.includes(tag!.toLowerCase())) return;

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

            setDsTruyen(danhSach.sort((a, b) => b.ngayDangChuong - a.ngayDangChuong));
            setLoading(false);
            setCurrentPage(1); // reset page khi đổi tag
        };

        fetchData();
    }, [tag]);

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
            <HeaderMenu theLoaiList={listTags} />
            <div className="container my-4">
                {tagInfo ? (
                    <>
                        <h2 className="text-center mb-2">{tagInfo.ten}</h2>
                        <p className="text-muted text-center mb-4">{tagInfo.noidung}</p>
                    </>
                ) : (
                    <h4 className="text-center text-danger mb-4">Thể loại không tồn tại</h4>
                )}

                {loading ? (
                    <p className="text-center">Đang tải dữ liệu...</p>
                ) : currentData.length === 0 ? (
                    <p className="text-center">Không có truyện nào thuộc thể loại này.</p>
                ) : (
                    <>
                        <div className="row g-4">
                            {currentData.map((truyen) => (
                                <div key={truyen.id} className="col-6 col-md-3">
                                    <div
                                        className="card h-100 shadow-sm border-0 hover-shadow"
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
        </>
    );
}
