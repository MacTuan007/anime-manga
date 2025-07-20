import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { get, ref } from "firebase/database";
import { db } from "../firebase";
import formatDate from "../utils/formatDate";
import type { Tag } from "../interfaces/Tag";
import type { TruyenDetail } from "../interfaces/Truyen";
import Header from "../partials/Header";

export default function TruyenDetailPage() {
    const { idtruyen } = useParams();
    const [truyen, setTruyen] = useState<TruyenDetail | null>(null);
    const [tags, setTags] = useState<Tag[]>([]);
    const [chuongList, setChuongList] = useState<{ so: string; ngay: string }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!idtruyen) return;

            // Lấy truyện
            const snap = await get(ref(db, `truyen/${idtruyen}`));
            if (!snap.exists()) return;

            const data = snap.val() as TruyenDetail;
            setTruyen(data);

            // Lấy tag từ tag id
            const tagsSnap = await get(ref(db, "tags"));
            const tagsData = tagsSnap.val() || {};
            const resolvedTags = Object.keys(data.listtag || {}).map((idtag) => tagsData[idtag]);
            setTags(resolvedTags);

            // Lấy danh sách chương
            const rawChuong = data.chuong || {};
            const danhSachChuong = Object.entries(rawChuong)
                .map(([so, chuong]) => {
                    const dateNumber = (chuong as any)["ngay-dang"];
                    const dateStr = dateNumber ? formatDate(dateNumber.toString()) : "Không rõ";
                    return { so, ngay: dateStr };
                })
                .sort((a, b) => Number(b.so) - Number(a.so)); // Giảm dần theo chương

            setChuongList(danhSachChuong);
        };

        fetchData();
    }, [idtruyen]);

    if (!truyen) return <div className="text-center text-dark mt-4">Đang tải...</div>;

    return (
        <>
            <Header />
            <div className="container mt-4 text-dark">
                <div className="row">
                    <div className="col-md-3 text-center">
                        <img
                            src={truyen.thumbnail}
                            alt={truyen.ten}
                            className="img-fluid rounded shadow"
                        />
                    </div>

                    <div className="col-md-9">
                        <h3>{truyen.ten}</h3>
                        <p><strong>Tác giả:</strong> {truyen.tacgia ? truyen.tacgia : "Đang Cập Nhật"}</p>
                        <p><strong>Tình trạng:</strong> {truyen.trangthai === 1 ? "Đang Cập Nhật" : "Đã Hoàn Thành"}</p>
                        <p><strong>Lượt thích:</strong> {truyen.luotthich || 0}</p>
                        <p><strong>Lượt theo dõi:</strong> {truyen.luotfl || 0}</p>
                        <p><strong>Lượt xem:</strong> {truyen.luotxem || 0}</p>

                        <div className="mb-2">
                            {tags.map((tag, index) => (
                                <Link
                                    to={`/the-loai/${tag.tenlink}`}
                                    key={index}
                                    className="badge bg-dark text-white border border-warning me-2 text-decoration-none"
                                >
                                    {tag.ten}
                                </Link>
                            ))}
                        </div>

                        <button className="btn btn-success me-2">📖 Đọc từ đầu</button>
                        <button className="btn btn-danger me-2">❤️ Theo dõi</button>
                        <button className="btn btn-primary">👍 Thích</button>
                    </div>
                </div>

                <hr className="my-4" />

                <div>
                    <h5 className="text-dark">📌 Giới thiệu</h5>
                    <p className="text-dark">{truyen.noidung}</p>
                </div>

                <hr className="my-4" />

                <div>
                    <h5 className="text-dark">📚 Danh sách chương</h5>
                    <ul
                        className="list-group overflow-auto"
                        style={{ maxHeight: "400px" }}
                    >
                        {chuongList.map((chuong) => (
                            <li key={chuong.so} className="list-group-item d-flex justify-content-between">
                                <Link
                                    to={`/chuong-chi-tiet/${idtruyen}/${chuong.so}`}
                                    className="text-decoration-none text-dark flex-grow-1"
                                >
                                    Chương {chuong.so}
                                </Link>
                                <span className="text-muted">{chuong.ngay}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}
