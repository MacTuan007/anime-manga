import { useEffect, useState } from "react";
import { ref, child, get } from "firebase/database";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import formatDate from "../utils/formatDate";
import Header from "../partials/Header";
import useTheLoaiList from "../utils/theloaiList";
import HeaderMenu from "../partials/HeaderMenu";
import Footer from "../partials/Footer";

interface LichSuXem {
    id: string;
    ten: string;
    thumbnail: string;
    chuong: string;
    ngayxem: number;
}

export default function LichSuPage() {
    const [lichSu, setLichSu] = useState<LichSuXem[]>([]);
    const navigate = useNavigate();
    const theLoaiList = useTheLoaiList();

    useEffect(() => {
        const fetchData = async () => {
            const emailKey = localStorage.getItem("emailkey");
            if (!emailKey) return;

            const userRef = child(ref(db), `users/${emailKey}/daxem`);
            const truyenRef = child(ref(db), "truyen");

            const [userSnap, truyenSnap] = await Promise.all([
                get(userRef),
                get(truyenRef),
            ]);

            if (!userSnap.exists() || !truyenSnap.exists()) return;

            const daxem = userSnap.val(); // { idtruyen: { chuong, ngayxem }, ... }
            const truyenData = truyenSnap.val();

            const list = Object.entries(daxem)
                .map(([id, val]: [string, any]) => {
                    const tr = truyenData[id];
                    if (!tr) return null;
                    return {
                        id,
                        ten: tr.ten,
                        thumbnail: tr.thumbnail || "/no-image.jpg",
                        chuong: val.chuong,
                        ngayxem: val.ngayxem,
                    } satisfies LichSuXem;
                })
                .filter((item): item is LichSuXem => item !== null)
                .sort((a, b) => b.ngayxem - a.ngayxem);

            setLichSu(list);
        };

        fetchData();
    }, []);

    return (
        <>
            <Header />
            <HeaderMenu theLoaiList={theLoaiList} />
            <div className="container my-4 p-3">
                <h2 className="text-center mb-4">Lịch Sử Đã Xem</h2>
                {lichSu.length === 0 ? (
                    <p className="text-center">Bạn chưa xem truyện nào.</p>
                ) : (
                    <div className="row g-4">
                        {lichSu.map((item) => (
                            <div key={item.id} className="col-6 col-md-3">
                                <div
                                    className="card h-100 shadow-sm border-0"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                        navigate(`/chuong-chi-tiet/${item.id}/${item.chuong}`)
                                    }
                                >
                                    <img
                                        src={item.thumbnail}
                                        className="card-img-top"
                                        alt={item.ten}
                                        style={{ height: "250px", objectFit: "cover" }}
                                    />
                                    <div className="card-body p-2">
                                        <h6 className="card-title text-truncate" title={item.ten}>
                                            {item.ten}
                                        </h6>
                                        <p className="card-text text-muted small mb-0">
                                            Đã xem chương {item.chuong}
                                        </p>
                                        <p className="card-text text-muted small">
                                            {formatDate(item.ngayxem.toString())}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}
