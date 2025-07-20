import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { get, ref } from "firebase/database";
import { db } from "../firebase";
import formatDate from "../utils/formatDate";
import Header from "../partials/Header";

export default function ChuongDetailPage() {
    const { idtruyen, sochuong } = useParams();
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [ngayDang, setNgayDang] = useState<string>("");
    const [dsChuong, setDsChuong] = useState<string[]>([]);
    const [tenTruyen, setTenTruyen] = useState<string>("");

    const [isVisible, setIsVisible] = useState(true); // Cho thanh nav
    const navigate = useNavigate();

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (window.innerWidth <= 768) {
                setIsVisible(currentScrollY < lastScrollY || currentScrollY < 50);
            } else {
                setIsVisible(true);
            }
            lastScrollY = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (!idtruyen || !sochuong) return;

        const fetchChuong = async () => {
            const truyenRef = ref(db, `truyen/${idtruyen}`);
            const snap = await get(truyenRef);
            if (!snap.exists()) return;

            const truyenData = snap.val();
            setTenTruyen(truyenData.ten || "Không rõ");

            const allChuong = truyenData.chuong || {};
            const chuongHienTai = allChuong[sochuong];

            if (!chuongHienTai || typeof chuongHienTai !== "object") {
                setImageUrls([]);
                setNgayDang("Không rõ");
                return;
            }

            const dateNum = chuongHienTai["ngay-dang"];
            if (dateNum) {
                setNgayDang(formatDate(dateNum.toString()));
            }

            const images = Object.entries(chuongHienTai)
                .filter(([key]) => key.startsWith("image"))
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([, value]) => value as string);

            setImageUrls(images);

            const danhSach = Object.keys(allChuong)
                .filter(key => allChuong[key] && typeof allChuong[key] === "object")
                .sort((a, b) => Number(a) - Number(b));

            setDsChuong(danhSach);
        };

        fetchChuong();
    }, [idtruyen, sochuong]);

    const index = dsChuong.indexOf(sochuong || "");
    const prev = index > 0 ? dsChuong[index - 1] : null;
    const next = index < dsChuong.length - 1 ? dsChuong[index + 1] : null;

    return (
        <>
            <Header />

            {/* Thanh nav điều hướng */}
            <div
                className={`position-fixed top-0 start-0 w-100 bg-dark d-flex justify-content-center align-items-center py-2 gap-3 shadow-sm text-white z-3 nav-chuong ${
                    isVisible ? "show" : "hide"
                }`}
                style={{ height: "48px", zIndex: 1000 }}
            >
                <Link to="/" className="text-white text-decoration-none fs-5">🏠</Link>
                <button
                    className="btn btn-link text-white fs-5 p-0"
                    onClick={() => prev && navigate(`/chuong-chi-tiet/${idtruyen}-${prev}`)}
                    disabled={!prev}
                >◀</button>
                <span className="fw-semibold">Chương {sochuong}</span>
                <button
                    className="btn btn-link text-white fs-5 p-0"
                    onClick={() => next && navigate(`/chuong-chi-tiet/${idtruyen}-${next}`)}
                    disabled={!next}
                >▶</button>
                <button className="btn btn-light btn-sm">🤍 Theo dõi</button>
            </div>

            <div className="container mt-5 pt-3 text-dark">
                <p className="mb-2 fw-semibold fs-5 d-flex flex-wrap align-items-center gap-2">
                    <Link
                        to={`/chi-tiet/${idtruyen}`}
                        className="text-decoration-none text-dark"
                    >
                        {tenTruyen}
                    </Link>
                    <span className="text-secondary">- Chương {sochuong}</span>
                </p>

                <p className="text-muted mb-3 fs-6">
                    <strong>Ngày đăng:</strong> {ngayDang}
                </p>

                <div className="d-flex justify-content-between my-3">
                    <button
                        className="btn btn-outline-primary"
                        disabled={!prev}
                        onClick={() => prev && navigate(`/chuong-chi-tiet/${idtruyen}-${prev}`)}
                    >
                        ⬅ Chương trước
                    </button>
                    <button
                        className="btn btn-outline-primary"
                        disabled={!next}
                        onClick={() => next && navigate(`/chuong-chi-tiet/${idtruyen}-${next}`)}
                    >
                        Chương sau ➡
                    </button>
                </div>

                <div className="d-flex flex-column align-items-center">
                    {imageUrls.map((url, index) => (
                        <img
                            key={index}
                            src={url}
                            alt={`Trang ${index + 1}`}
                            className="img-fluid"
                            style={{ marginBottom: "0px", display: "block" }}
                        />
                    ))}
                </div>

                <div className="d-flex justify-content-between my-3">
                    <button
                        className="btn btn-outline-primary"
                        disabled={!prev}
                        onClick={() => prev && navigate(`/chuong-chi-tiet/${idtruyen}-${prev}`)}
                    >
                        ⬅ Chương trước
                    </button>
                    <button
                        className="btn btn-outline-primary"
                        disabled={!next}
                        onClick={() => next && navigate(`/chuong-chi-tiet/${idtruyen}-${next}`)}
                    >
                        Chương sau ➡
                    </button>
                </div>
            </div>
        </>
    );
}
