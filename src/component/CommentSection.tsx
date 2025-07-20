import { useEffect, useState } from "react";
import { ref, onValue, push, get } from "firebase/database";
import { db } from "../firebase";
import type { BinhLuan } from "../interfaces/BinhLuan";

interface Props {
  idtruyen: string;
  idchuong?: string; // có thể không có nếu ở trang chi tiết truyện
}

function getNowDateNumber() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const mi = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  return parseInt(`${yyyy}${mm}${dd}${hh}${mi}${ss}`);
}

export default function CommentSection({ idtruyen, idchuong }: Props) {
  const [comments, setComments] = useState<BinhLuan[]>([]);
  const [nd, setNd] = useState("");
  const [ho, setHo] = useState("");
  const [ten, setTen] = useState("");

  const emailkey = localStorage.getItem("emailkey") || "";

  // Lấy họ và tên từ Firebase
  useEffect(() => {
    if (!emailkey) return;
    const userRef = ref(db, `users/${emailkey}`);
    get(userRef).then((snapshot) => {
      const data = snapshot.val();
      if (data) {
        setHo(data.ho || "");
        setTen(data.ten || "");
      }
    });
  }, [emailkey]);

  // Lấy bình luận
  useEffect(() => {
    const cmtRef = ref(db, "binhluan");
    return onValue(cmtRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return setComments([]);

      const filtered = Object.entries(data)
        .map(([id, val]: any) => ({ idbinhluan: id, ...val }))
        .filter((cmt: BinhLuan) =>
          idchuong
            ? cmt.idtruyen === idtruyen && cmt.idchuong === idchuong
            : cmt.idtruyen === idtruyen && !cmt.idchuong
        )
        .sort((a, b) => b.ngaybinhluan - a.ngaybinhluan);

      setComments(filtered);
    });
  }, [idtruyen, idchuong]);

  const handleSubmit = async () => {
    if (!nd.trim() || !emailkey || !ten) return;

    const newCmt: Omit<BinhLuan, "idbinhluan"> = {
      idtruyen,
      iduser: emailkey,
      ho,
      ten,
      noidung: nd,
      ngaybinhluan: getNowDateNumber(),
      ...(idchuong ? { idchuong } : {}),
    };

    await push(ref(db, "binhluan"), newCmt);
    setNd("");
  };

  return (
    <div className="container mt-4">
      <h5>Bình luận</h5>

      <div className="mb-3 d-flex">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Nhập bình luận..."
          value={nd}
          onChange={(e) => setNd(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSubmit}>
          Gửi
        </button>
      </div>

      <ul className="list-group">
        {comments.map((cmt) => (
          <li key={cmt.idbinhluan} className="list-group-item">
            <strong>{cmt.ho} {cmt.ten}</strong>: {cmt.noidung}
            <div className="text-muted" style={{ fontSize: "0.85em" }}>
              {formatDate(cmt.ngaybinhluan)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatDate(yyyymmddhhmmss: number) {
  const s = yyyymmddhhmmss.toString();
  const y = s.slice(0, 4);
  const m = s.slice(4, 6);
  const d = s.slice(6, 8);
  const h = s.slice(8, 10);
  const min = s.slice(10, 12);
  const sec = s.slice(12, 14);
  return `${d}/${m}/${y} ${h}:${min}:${sec}`;
}
