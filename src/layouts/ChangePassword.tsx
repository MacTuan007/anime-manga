import { useState, useEffect } from "react";
import Header from "../partials/Header";
import SlideBar from "../partials/SlideBar";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import { db } from "../firebase"; 
import { ref, query, orderByChild, equalTo, get, update } from "firebase/database";
import Footer from "../partials/Footer";

export default function ChangePassword() {
    const [pass, setPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [rePass, setRePass] = useState('');
    const [passError, setPassError] = useState('');
    const [rePassError, setRePassError] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const navigate = useNavigate();
    const email = localStorage.getItem("email");

    useEffect(() => {
        if (!email) {
            navigate("/");
        }
    }, [email, navigate]);

    const handleSave = async () => {
        setPassError('');
        setRePassError('');
        setErrorMsg('');
        setSuccessMsg('');

        if (!pass || !newPass || !rePass) {
            setErrorMsg("Vui lòng điền đầy đủ thông tin.");
            return;
        }

        if (newPass.length < 6) {
            setPassError("Mật khẩu phải có ít nhất 6 ký tự.");
            return;
        }

        if (newPass !== rePass) {
            setRePassError("Mật khẩu nhập lại không khớp.");
            return;
        }

        try {
            const q = query(ref(db, 'users'), orderByChild('email'), equalTo(email));
            const snapshot = await get(q);

            if (!snapshot.exists()) {
                setErrorMsg("Không tìm thấy tài khoản.");
                return;
            }

            const data = snapshot.val();
            const userKey = Object.keys(data)[0];
            const userData = data[userKey];

            const isMatch = await bcrypt.compare(pass, userData.password);
            if (!isMatch) {
                setErrorMsg("Mật khẩu cũ không đúng.");
                return;
            }

            const salt = await bcrypt.genSalt(10);
            const newHashedPass = await bcrypt.hash(newPass, salt);

            await update(ref(db, `users/${userKey}`), { password: newHashedPass });

            setSuccessMsg("Đổi mật khẩu thành công.");
            setPass('');
            setNewPass('');
            setRePass('');
        } catch (err) {
            console.error(err);
            setErrorMsg("Đã xảy ra lỗi khi cập nhật mật khẩu.");
        }
    };

    if (!email) return null;

    return (
        <>
            <Header />
            <div className="container mt-4">
                <div className="row">
                    <div className="col-md-3 mb-3">
                        <SlideBar />
                    </div>

                    <div className="col-md-9 p-3">
                        <div className="card shadow-sm">
                            <div className="card-header bg-dark text-white">Thông Tin Tài Khoản</div>
                            <div className="card-body">
                                {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
                                {successMsg && <div className="alert alert-success">{successMsg}</div>}

                                <div className="mb-3">
                                    <label className="form-label">Mật khẩu cũ</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={pass}
                                        onChange={(e) => setPass(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Mật khẩu mới</label>
                                    <input
                                        type="password"
                                        className={`form-control ${passError ? "is-invalid" : ""}`}
                                        value={newPass}
                                        onChange={(e) => setNewPass(e.target.value)}
                                    />
                                    {passError && <div className="text-danger mt-1">{passError}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Nhập lại mật khẩu mới</label>
                                    <input
                                        type="password"
                                        className={`form-control ${rePassError ? "is-invalid" : ""}`}
                                        value={rePass}
                                        onChange={(e) => setRePass(e.target.value)}
                                    />
                                    {rePassError && <div className="text-danger mt-1">{rePassError}</div>}
                                </div>

                                <button className="btn btn-primary" onClick={handleSave}>
                                    Lưu thay đổi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
