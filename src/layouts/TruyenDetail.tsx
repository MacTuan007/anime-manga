import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase";
import { get, ref, set, remove, onValue, off, update } from "firebase/database";
import Header from "../partials/Header";
import formatDate from "../utils/formatDate";
import type { TruyenDetail } from "../interfaces/Truyen";
import type { Tag } from "../interfaces/Tag";

function parseCustomDate(dateStr: string): number {
  const year = parseInt(dateStr.slice(0, 4));
  const month = parseInt(dateStr.slice(4, 6)) - 1;
  const day = parseInt(dateStr.slice(6, 8));
  const hour = parseInt(dateStr.slice(8, 10));
  const minute = parseInt(dateStr.slice(10, 12));
  const second = parseInt(dateStr.slice(12, 14));
  return new Date(year, month, day, hour, minute, second).getTime();
}

export default function TruyenDetailPage() {
  const { idtruyen } = useParams();
  const navigate = useNavigate();
  const [truyen, setTruyen] = useState<TruyenDetail | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [chuongList, setChuongList] = useState<
    { so: string; ngay: string; locked: boolean }[]
  >([]);
  const [isVip, setIsVip] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);

  const emailkey = localStorage.getItem("emailkey") || "";
  console.log("emailkey:", emailkey);

  useEffect(() => {
    if (!idtruyen) return;

    const truyenRef = ref(db, `truyen/${idtruyen}`);
    const unsubscribe = onValue(truyenRef, (snap) => {
      if (!snap.exists()) return;
      const data = snap.val() as TruyenDetail;
      setTruyen(data);

      // Lấy tag
      get(ref(db, "tags")).then((tagsSnap) => {
        const tagsData = tagsSnap.val() || {};
        const resolvedTags = Object.keys(data.listtag || {}).map(
          (idtag) => tagsData[idtag]
        );
        setTags(resolvedTags);
      });

      // Lấy chương
      const now = Date.now();
      const rawChuong = data.chuong || {};
      const danhSachChuong = Object.entries(rawChuong)
        .map(([so, chuong]: [string, any]) => {
          const dateRaw = chuong["ngay-dang"];
          const timestamp = dateRaw ? parseCustomDate(dateRaw.toString()) : 0;
          const dateStr = timestamp ? formatDate(timestamp.toString()) : "Không rõ";
          const locked = timestamp > 0 && now - timestamp < 10 * 24 * 60 * 60 * 1000;
          return { so, ngay: dateStr, locked };
        })
        .sort((a, b) => Number(b.so) - Number(a.so));
      setChuongList(danhSachChuong);
    });

    return () => off(truyenRef);
  }, [idtruyen]);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!emailkey || !idtruyen) return;

      const vipSnap = await get(ref(db, `users/${emailkey}/vip`));
      if (vipSnap.exists()) setIsVip(vipSnap.val() === 1);

      const likeSnap = await get(ref(db, `users/${emailkey}/thich/${idtruyen}`));
      setIsLiked(likeSnap.exists());

      const flSnap = await get(ref(db, `users/${emailkey}/theodoi/${idtruyen}`));
      setIsFollowed(flSnap.exists());
    };

    checkUserStatus();
  }, [emailkey, idtruyen]);

  const handleLike = async () => {
    if (!emailkey || !idtruyen) return;
    const newState = !isLiked;

    const likeRef = ref(db, `users/${emailkey}/thich/${idtruyen}`);
    if (newState) {
      await set(likeRef, "");
    } else {
      await remove(likeRef);
    }

    const snap = await get(ref(db, `truyen/${idtruyen}/luotthich`));
    const current = snap.exists() ? snap.val() : 0;
    const updated = Math.max(0, current + (newState ? 1 : -1));
    await update(ref(db, `truyen/${idtruyen}`), { luotthich: updated });

    setIsLiked(newState);
    setTruyen((prev) => (prev ? { ...prev, luotthich: updated } : prev));
  };

  const handleFollow = async () => {
    if (!emailkey || !idtruyen) return;
    const newState = !isFollowed;

    const followRef = ref(db, `users/${emailkey}/theodoi/${idtruyen}`);
    if (newState) {
      await set(followRef, "");
    } else {
      await remove(followRef);
    }

    const snap = await get(ref(db, `truyen/${idtruyen}/luotfl`));
    const current = snap.exists() ? snap.val() : 0;
    const updated = Math.max(0, current + (newState ? 1 : -1));
    await update(ref(db, `truyen/${idtruyen}`), { luotfl: updated });

    setIsFollowed(newState);
    setTruyen((prev) => (prev ? { ...prev, luotfl: updated } : prev));
  };

  const handleReadFirst = () => {
    const firstAvailable = [...chuongList].reverse().find((c) => !c.locked || isVip);
    if (firstAvailable) {
      navigate(`/chuong-chi-tiet/${idtruyen}/${firstAvailable.so}`);
    } else {
      alert("Chương đầu đang bị khóa hoặc chưa có!");
    }
  };

  if (!truyen) return <div className="text-center mt-4 text-danger">Không tìm thấy truyện!</div>;

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
            <p><strong>Tác giả:</strong> {truyen.tacgia || "Đang Cập Nhật"}</p>
            <p><strong>Tình trạng:</strong> {truyen.trangthai === 1 ? "Đang Cập Nhật" : "Đã Hoàn Thành"}</p>
            <p><strong>Lượt thích:</strong> {truyen.luotthich || 0}</p>
            <p><strong>Lượt theo dõi:</strong> {truyen.luotfl || 0}</p>
            <p><strong>Lượt xem:</strong> {truyen.luotxem || 0}</p>

            <div className="mb-2">
              {tags.map((tag, index) => (
                <Link
                  key={index}
                  to={`/the-loai/${tag.tenlink}`}
                  className="badge bg-dark text-white border border-warning me-2 text-decoration-none"
                >
                  {tag.ten}
                </Link>
              ))}
            </div>

            <button onClick={handleReadFirst} className="btn btn-success me-2">
              📖 Đọc từ đầu
            </button>
            <button onClick={handleFollow} className="btn btn-danger me-2">
              {isFollowed ? "💔 Bỏ theo dõi" : "❤️ Theo dõi"}
            </button>
            <button onClick={handleLike} className="btn btn-primary">
              {isLiked ? "👎 Bỏ thích" : "👍 Thích"}
            </button>
          </div>
        </div>

        <hr className="my-4" />

        <div>
          <h5>📌 Giới thiệu</h5>
          <p>{truyen.noidung}</p>
        </div>

        <hr className="my-4" />

        <div>
          <h5>📚 Danh sách chương</h5>
          <ul className="list-group overflow-auto" style={{ maxHeight: "400px" }}>
            {chuongList.map((chuong) => (
              <li key={chuong.so} className="list-group-item d-flex justify-content-between align-items-center">
                {chuong.locked && !isVip ? (
                  <>
                    <span className="text-muted flex-grow-1">🔒 Chương {chuong.so}</span>
                    <span className="text-muted">{chuong.ngay}</span>
                  </>
                ) : (
                  <>
                    <Link
                      to={`/chuong-chi-tiet/${idtruyen}/${chuong.so}`}
                      className="text-decoration-none text-dark flex-grow-1"
                    >
                      Chương {chuong.so}
                    </Link>
                    <span className="text-muted">{chuong.ngay}</span>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
