import Header from "../partials/Header";
import { useState, useEffect } from "react";
import SlideBar from "../partials/SlideBar";
import { db } from "../firebase";
import {
  ref,
  query,
  orderByChild,
  equalTo,
  get,
  update,
} from "firebase/database";
import { useNavigate } from "react-router-dom";

export default function Account() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [ho, setHo] = useState("");
  const [ten, setTen] = useState("");
  const [chucVu, setChucVu] = useState(""); // "0" hoặc "1"
  const [userKey, setUserKey] = useState("");
  const [dateoff, setDateoff] = useState("");

  const [hoError, setHoError] = useState("");
  const [tenError, setTenError] = useState("");

  useEffect(() => {
    const emailLS = localStorage.getItem("email");
    if (emailLS === null) {
      navigate("/");
      return;
    }
    if (emailLS) {
      setEmail(emailLS);
      const userRef = query(
        ref(db, "users"),
        orderByChild("email"),
        equalTo(emailLS)
      );

      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const firstKey = Object.keys(data)[0];
          const user = data[firstKey];

          setUserKey(firstKey);
          setHo(user.ho || "");
          setTen(user.ten || "");
          setChucVu(user.tacgia?.toString() || "0");
          setDateoff(user.dateoff || "");
        }
      });
    }
  }, []);

  const isValidName = (value: string): boolean => {
    return /^[a-zA-ZÀ-ỹ\s]+$/.test(value);
  };

  const handleSave = async () => {
    let valid = true;

    if (!isValidName(ho)) {
      setHoError("Họ chỉ được chứa chữ cái và khoảng trắng.");
      valid = false;
    } else {
      setHoError("");
    }

    if (!isValidName(ten)) {
      setTenError("Tên chỉ được chứa chữ cái và khoảng trắng.");
      valid = false;
    } else {
      setTenError("");
    }

    if (!valid || !userKey) return;

    try {
      await update(ref(db, `users/${userKey}`), {
        ho,
        ten,
        tacgia: parseInt(chucVu),
      });
      alert("Cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Cập nhật thất bại!");
    }
  };

  // ✅ Format ngày từ YYYY-MM-DD → DD/MM/YYYY
  const getFormattedDate = (dateStr: string) => {
    if (!dateStr) return "Bạn chưa phải thành viên VIP";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <Header />
      <div className="container mt-4">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 mb-3">
            <SlideBar />
          </div>

          {/* Form */}
          <div className="col-md-9">
            <div className="card shadow-sm">
              <div className="card-header bg-dark text-white">Thông Tin Tài Khoản</div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" value={email} readOnly />
                </div>

                <div className="mb-3">
                  <label className="form-label">Họ</label>
                  <input
                    type="text"
                    className={`form-control ${hoError ? "is-invalid" : ""}`}
                    value={ho}
                    onChange={(e) => setHo(e.target.value)}
                  />
                  {hoError && <div className="text-danger mt-1">{hoError}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Tên</label>
                  <input
                    type="text"
                    className={`form-control ${tenError ? "is-invalid" : ""}`}
                    value={ten}
                    onChange={(e) => setTen(e.target.value)}
                  />
                  {tenError && <div className="text-danger mt-1">{tenError}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Chức vụ</label>
                  <input
                    type="text"
                    className="form-control"
                    value={chucVu === "1" ? "Tác giả" : "Người đọc"}
                    readOnly
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Ngày hết hạn VIP</label>
                  <input
                    type="text"
                    className="form-control"
                    value={getFormattedDate(dateoff)}
                    readOnly
                  />
                </div>

                <button className="btn btn-primary" onClick={handleSave}>
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
